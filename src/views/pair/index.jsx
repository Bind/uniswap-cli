import React, { useRef } from "react";
import { useApp } from "../../context/application";
import { Newline, Box, Text, measureElement, useInput } from "ink";
import PairChart from "./PairChart.jsx";
import { formattedNum } from "../../utils";
import LogoComponent from "../../components/logo/index.jsx";

export function formattedPercent(percent, useBrackets = false) {
  percent = parseFloat(percent);
  if (!percent || percent === 0) {
    return <Text fontWeight={500}>0%</Text>;
  }

  if (percent < 0.0001 && percent > 0) {
    return <Text color="green">{"< 0.0001%"}</Text>;
  }

  if (percent < 0 && percent > -0.0001) {
    return <Text color="red">{"< 0.0001%"}</Text>;
  }

  let fixedPercent = percent.toFixed(2);
  if (fixedPercent === "0.00") {
    return "0%";
  }
  if (fixedPercent > 0) {
    if (fixedPercent > 100) {
      return (
        <Text color="green">{`+${percent?.toFixed(0).toLocaleString()}%`}</Text>
      );
    } else {
      return <Text color="green">{`+${fixedPercent}%`}</Text>;
    }
  } else {
    return <Text color="red">{`${fixedPercent}%`}</Text>;
  }
}

import {
  usePairData,
  useAllPairData,
  usePairChartData,
} from "../../context/pairData";
import { useEthPrice } from "../../context/globalData";

const VOL = "VOLUME";
const LIQ = "LIQUIDITY";

const Table = () => {
  const {
    state: { address: pairAddress },
  } = useApp();

  console.log("pair address", pairAddress);
  const ref = useRef(null);
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress);
  const [stat, setStat] = React.useState("VOLUME");
  const [range, setRange] = React.useState("ALL");
  useInput((input, key) => {
    if (input === "a") {
      // Exit program
      setRange("ALL");
    }
    if (input === "w") {
      // Exit program
      setRange("WEEK");
    }
    if (input === "m") {
      // Exit program
      setRange("MONTH");
    }
    if (input === "v") {
      // Exit program
      setStat(VOL);
    }

    if (input === "l") {
      // Exit program
      setStat(LIQ);
    }
    if (input === "q") {
      // Left arrow key pressed
      process.exit();
    }
  });

  const allPairData = useAllPairData(pairAddress);
  const pairChartData = usePairChartData(pairAddress);

  const formattedLiquidity = reserveUSD
    ? formattedNum(reserveUSD, true)
    : formattedNum(trackedReserveUSD, true);
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD;
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // volume
  const volume = !!oneDayVolumeUSD
    ? formattedNum(oneDayVolumeUSD, true)
    : formattedNum(oneDayVolumeUntracked, true);
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUntracked
  );

  const showUSDWaning = usingUntrackedLiquidity | usingUtVolume;

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : "-";

  // token data for usd
  const [ethPrice] = useEthPrice();
  const token0USD =
    token0?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true)
      : "";

  const token1USD =
    token1?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true)
      : "";

  // rates
  const token0Rate =
    reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : "-";
  const token1Rate =
    reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : "-";

  // formatted symbols for overflow
  const formattedSymbol0 =
    token0?.symbol.length > 6
      ? token0?.symbol.slice(0, 5) + "..."
      : token0?.symbol;
  const formattedSymbol1 =
    token1?.symbol.length > 6
      ? token1?.symbol.slice(0, 5) + "..."
      : token1?.symbol;
  if (!pairChartData) {
    return (
      <Box
        ref={ref}
        flexGrow={1}
        width={"100"}
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading...</Text>
        <LogoComponent height={128} width={128} />
      </Box>
    );
  }
  pairChartData.filter((x) => x.__typename !== "PairDayData");

  return (
    <Box ref={ref} width={"100%"} alignItems="flex-start">
      <Box justifyContent="flex-start" flexDirection="column" width="30%">
        <Box borderColor="grey" borderStyle="single" flexDirection="column">
          <Text color="grey">
            Total Liquidity
            <Newline></Newline>
          </Text>
          <Text color="white">{formattedLiquidity}</Text>
          {liquidityChange}
        </Box>
        <Box
          flexDirection="column"
          borderColor="grey"
          borderStyle="single"
          display="flex"
          flexGrow="1"
          flexFlow="column"
          justifyContent="center"
        >
          <Text color="grey">
            Volume (24 hrs)<Newline></Newline>
          </Text>
          <Text color="white">{volume}</Text>
          {volumeChange}
        </Box>
        <Box
          flexDirection="column"
          borderColor="grey"
          borderStyle="single"
          display="flex"
          flexGrow="1"
          flexFlow="column"
        >
          <Text color="grey">
            Fees (24 hrs)
            <Newline></Newline>
          </Text>
          <Text color="white">{fees}</Text>
          {volumeChange}
        </Box>
        <Box
          borderColor="grey"
          borderStyle="single"
          display="flex"
          flexGrow="1"
          flexFlow="column"
        >
          <Text color="grey">
            Pooled Tokens
            <Newline></Newline>
            <Newline></Newline>
            <Text color="white">
              {formattedNum(reserve0)} - {token0?.symbol ?? ""}
              <Newline></Newline>
              {formattedNum(reserve1)} - {token1?.symbol ?? ""}
            </Text>
          </Text>
        </Box>
      </Box>
      <PairChart
        data={pairChartData}
        stat={stat}
        range={range}
        symbol={token0.symbol + "-" + token1.symbol}
      />
    </Box>
  );
};

export default Table;
