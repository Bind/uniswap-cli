const axios = require("axios");
const fetchPairs = async () => {
  try {
    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      method: "POST",
      data: {
        query: `{
          pairs(first: 1000, orderBy: reserveUSD, orderDirection: desc) {
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

const fetchById = async (id) => {
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


export default  {
  fetchPairs,
  fetchById,
};
