const axios = require("axios");

import { useQuery } from "@apollo/client";
import { getUnixTime, startOfMinute, sub } from "date-fns";
import { get, sortBy, toLower, uniq } from "lodash";
import { blockClient, uniswapClient, compoundClient } from "./client";

import {
  GET_BLOCKS_QUERY,
  UNISWAP_PAIR_DATA_QUERY,
  UNISWAP_PAIRS_BULK_QUERY,
  UNISWAP_PAIRS_HISTORICAL_BULK_QUERY,
  UNISWAP_PAIRS_ID_QUERY,
} from "./queries";

export const fetchPairs = async () => {
  try {
    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      method: "POST",
      data: {
        query: `{
          pairs(first: 1000, orderBy: txCount, orderDirection: desc) {
            id,
            token0 {
              id,
              symbol,
              name
            },
            token1 {
              id,
              symbol,
              name
            }
            reserve0,
            reserve1,
            totalSupply,
            reserveUSD,
            reserveETH,
            trackedReserveETH,
            token0Price,
            token1Price,
            volumeToken0,
            volumeToken1,
            volumeUSD,
            untrackedVolumeUSD,
            txCount,
            createdAtTimestamp,
            createdAtBlockNumber,
            liquidityProviderCount
          },
        }`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch currency pairs: ", error);
    throw Error("Failed to fetch currency pairs");
  }
};

export const fetchById = async (id) => {
  try {
    const query = `{
           tokenDayDatas(orderBy: date, orderDirection: asc,
            where: {
              token: "${id}"
            }
           ) {
              id
              date
              priceUSD
              totalLiquidityToken
              totalLiquidityUSD
              totalLiquidityETH
              dailyVolumeETH
              dailyVolumeToken
              dailyVolumeUSD
           }
          }`;

    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      method: "POST",
      data: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch currency pairs: ", error);
    throw Error("Failed to fetch currency pairs");
  }
};

export const fetchPairData = async (id, numDaysAgo = 30) => {
  const daysAgoStart = getUnixTime(
    startOfMinute(sub(Date.now(), { days: numDaysAgo }))
  );
  try {
    const query = `{
       pairDayDatas(first: 100, orderBy: date, orderDirection: asc,
         where: {
           pairAddress: "${id}",
           date_gt: ${daysAgoStart}
         }
       ) {
           date
           dailyVolumeToken0
           dailyVolumeToken1
           dailyVolumeUSD
           reserveUSD
       }
      }`;

    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      method: "POST",
      data: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch currency pairs: ", error);
    throw Error("Failed to fetch currency pairs");
  }
};

async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    const sliced = list.slice(skip, end);
    try {
      const result = await localClient.query({
        fetchPolicy: "network-only",
        query: query(...vars, sliced),
      });
      fetchedData = {
        ...fetchedData,
        ...result.data,
      };

      if (
        Object.keys(result.data).length < skipCount ||
        skip + skipCount > list.length
      ) {
        allFound = true;
      } else {
        skip += skipCount;
      }
    } catch (e) {
      console.log("🦄 Pools split query error", e);
    }
  }

  return fetchedData;
}

export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
  if (timestamps?.length === 0) {
    return [];
  }

  const fetchedData = await splitQuery(
    GET_BLOCKS_QUERY,
    blockClient,
    [],
    timestamps,
    skipCount
  );

  const blocks = [];
  if (fetchedData) {
    for (let t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          number: fetchedData[t][0]["number"],
          timestamp: t.split("t")[1],
        });
      }
    }
  }

  return blocks;
}

const getTimestampsForChanges = () => {
  const t1 = getUnixTime(startOfMinute(sub(Date.now(), { days: 1 })));
  const t2 = getUnixTime(startOfMinute(sub(Date.now(), { days: 2 })));
  const t3 = getUnixTime(startOfMinute(sub(Date.now(), { months: 1 })));
  return [t1, t2, t3];
};

export async function getBulkPairData(pairList, ethPrice, ethPriceOneMonthAgo) {
  try {
    const [t1, t2, t3] = getTimestampsForChanges();
    const [
      { number: b1 },
      { number: b2 },
      { number: b3 },
    ] = await getBlocksFromTimestamps([t1, t2, t3]);

    const current = await uniswapClient.query({
      fetchPolicy: "network-only",
      query: UNISWAP_PAIRS_BULK_QUERY,
      variables: {
        allPairs: pairList,
      },
    });

    const [oneDayResult, twoDayResult, oneMonthResult] = await Promise.all(
      [b1, b2, b3].map(async (block) => {
        const result = uniswapClient.query({
          fetchPolicy: "network-only",
          query: UNISWAP_PAIRS_HISTORICAL_BULK_QUERY,
          variables: {
            block,
            pairs: pairList,
          },
        });
        return result;
      })
    );

    const oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const oneMonthData = oneMonthResult?.data?.pairs.reduce((obj, cur) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const pairData = await Promise.all(
      current &&
        current.data.pairs.map(async (pair) => {
          let data = pair;
          let oneDayHistory = oneDayData?.[pair.id];
          if (!oneDayHistory) {
            const newData = await uniswapClient.query({
              fetchPolicy: "network-only",
              query: UNISWAP_PAIR_DATA_QUERY(pair.id, b1),
            });
            oneDayHistory = newData.data.pairs[0];
          }
          let twoDayHistory = twoDayData?.[pair.id];
          if (!twoDayHistory) {
            const newData = await uniswapClient.query({
              fetchPolicy: "network-only",
              query: UNISWAP_PAIR_DATA_QUERY(pair.id, b2),
            });
            twoDayHistory = newData.data.pairs[0];
          }
          let oneMonthHistory = oneMonthData?.[pair.id];
          if (!oneMonthHistory) {
            const newData = await uniswapClient.query({
              fetchPolicy: "network-only",
              query: UNISWAP_PAIR_DATA_QUERY(pair.id, b3),
            });
            oneMonthHistory = newData.data.pairs[0];
          }

          data = parseData(
            data,
            oneDayHistory,
            twoDayHistory,
            oneMonthHistory,
            // ethPrice,
            // ethPriceOneMonthAgo,
            b1
          );
          return data;
        })
    );
    return pairData;
  } catch (e) {
    console.log("🦄🦄🦄 error in getBulkPairData", e);
  }
}

function parseData(
  data,
  oneDayData,
  twoDayData,
  oneMonthData,
  // ethPrice,
  // ethPriceOneMonthAgo,
  oneDayBlock
) {
  const newData = { ...data };
  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    newData?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  );
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    newData?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD
      ? parseFloat(oneDayData?.untrackedVolumeUSD)
      : 0,
    twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
  );

  // newData.profit30d = calculateProfit30d(
  //   data,
  //   oneMonthData,
  //   ethPrice,
  //   ethPriceOneMonthAgo
  // );

  // set volume properties
  newData.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD);
  newData.volumeChangeUSD = volumeChangeUSD;
  newData.oneDayVolumeUntracked = oneDayVolumeUntracked;
  newData.volumeChangeUntracked = volumeChangeUntracked;

  // set liquidity properties
  // newData.trackedReserveUSD = newData.trackedReserveETH * ethPrice;
  newData.liquidityChangeUSD = getPercentChange(
    newData.reserveUSD,
    oneDayData?.reserveUSD
  );

  // format if pair hasnt existed for a day
  if (!oneDayData && data && newData.createdAtBlockNumber > oneDayBlock) {
    newData.oneDayVolumeUSD = parseFloat(newData.volumeUSD);
  }
  if (!oneDayData && data) {
    newData.oneDayVolumeUSD = parseFloat(newData.volumeUSD);
  }

  /*newData.annualized_fees =
    (newData.oneDayVolumeUSD * 0.003 * 365 * 100) / newData.trackedReserveUSD;*/

  return {
    ...newData,
    address: newData.id,
    liquidity: Number(Number(newData.reserveUSD).toFixed(2)),
    symbol: "UNI-V2",
    tokenNames: `${newData.token0.symbol}-${newData.token1.symbol}`.replace(
      "WETH",
      "ETH"
    ),
    type: "uniswap-v2",
    uniqueId: newData.id,
  };
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (
  valueNow,
  value24HoursAgo,
  value48HoursAgo
) => {
  // get volume info for both 24 hour periods
  const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo);
  const previousChange =
    parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo);

  const adjustedPercentChange =
    (parseFloat(currentChange - previousChange) / parseFloat(previousChange)) *
    100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

export const calculateProfit30d = (
  data,
  valueOneMonthAgo,
  ethPriceNow,
  ethPriceOneMonthAgo
) => {
  const now = calculateLPTokenPrice(data, ethPriceNow);
  if (now === 0) {
    console.log("🦄🦄🦄 lpTokenPrice now is 0", data, ethPriceNow);
  }

  if (valueOneMonthAgo === undefined) {
    return undefined;
  }

  if (ethPriceOneMonthAgo === undefined) {
    console.log("🦄🦄🦄 ethPriceOneMonthAgo is missing.", ethPriceOneMonthAgo);
    return undefined;
  }
  const oneMonthAgo = calculateLPTokenPrice(
    valueOneMonthAgo,
    ethPriceOneMonthAgo
  );

  const percentageChange = getPercentChange(now, oneMonthAgo);
  return Number(percentageChange.toFixed(2));
};

export const calculateLPTokenPrice = (data, ethPrice) => {
  const {
    reserve0,
    reserve1,
    totalSupply,
    token0: { derivedETH: token0DerivedEth },
    token1: { derivedETH: token1DerivedEth },
  } = data;

  const tokenPerShare = 100 / totalSupply;

  const reserve0USD =
    Number(reserve0) * (Number(token0DerivedEth) * Number(ethPrice));
  const reserve1USD =
    Number(reserve1) * (Number(token1DerivedEth) * Number(ethPrice));

  const token0LiquidityPrice = (reserve0USD * tokenPerShare) / 100;
  const token1LiquidityPrice = (reserve1USD * tokenPerShare) / 100;
  const lpTokenPrice = token0LiquidityPrice + token1LiquidityPrice;

  return lpTokenPrice;
};

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) /
      parseFloat(value24HoursAgo)) *
    100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};
