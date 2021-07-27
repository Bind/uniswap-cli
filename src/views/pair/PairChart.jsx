import { min, max } from "d3-array";
import React, { useRef } from "react";
import { measureElement, Text, Box, Newline } from "ink";
import { scaleTime, scaleLinear } from "d3-scale";
import Sparkline from "../../components/sparkline/index.jsx";

const DailyVolumeScaleSelectors = {
  minX: (data) => min(data.map((d) => d.date)),
  minY: (data) => max(data.map((d) => d.dailyVolumeUSD)),
  maxX: (data) => max(data.map((d) => d.date)),
  maxY: (data) => min(data.map((d) => d.dailyVolumeUSD)),
};

const dailyVolumeAccessors = {
  x: (d) => d.date * 1000,
  y: (d) => d.dailyVolumeUSD,
};

const LiquidityScaleSelectors = {
  minX: (data) => min(data.map((d) => d.date)),
  minY: (data) => max(data.map((d) => d.reserveUSD)),
  maxX: (data) => max(data.map((d) => d.date)),
  maxY: (data) => min(data.map((d) => d.reserveUSD)),
};

const LiquidityAccessors = {
  x: (d) => d.date * 1000,
  y: (d) => d.reserveUSD,
};

const getChartHelpers = (stat) => {
  if (stat == "VOLUME") {
    return [DailyVolumeScaleSelectors, dailyVolumeAccessors];
  }
  if (stat == "LIQUIDITY") {
    return [LiquidityScaleSelectors, LiquidityAccessors];
  }
};

const ALL = "ALL";
const WEEK = "WEEK";
const WEEK_MS = 604800000;

const MONTH = "MONTH";
const MONTH_MS = 2419200000;
const getTimeRangeFilters = (range) => {
  let now;
  switch (range) {
    case ALL:
      return () => true;
      break;
    case WEEK:
      now = Date.now();
      const last_week = now - WEEK_MS;
      return (d) => d.date * 1000 > last_week;
      break;
    case MONTH:
      now = Date.now();
      const last_month = now - MONTH_MS;
      return (d) => d.date * 1000 > last_month;
      break;
    default:
      return () => true;
      break;
  }
};
function generateXScale(data, width, selectors) {
  const xScale = scaleTime()
    .domain([
      new Date(selectors.minX(data) * 1000),
      new Date(selectors.maxX(data) * 1000),
    ])
    .range([0, width]);
  return xScale;
}

function generateYScale(data, height, selectors) {
  const yScale = scaleLinear()
    .domain([selectors.minY(data), selectors.maxY(data)])
    .range([0, height]);
  return yScale;
}

const PairChart = ({ stat = "VOLUME", range = "ALL", data, symbol }) => {
  const ref = useRef(null);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const timeboxedData = data.filter(getTimeRangeFilters(range));
  const [scaleSelectors, accessors] = getChartHelpers(stat);

  React.useEffect(() => {
    const { width: _width, height: _height } = measureElement(ref.current);
    setHeight(_height);
    setWidth(_width);
  }, [width, height]);
  const xScale = generateXScale(timeboxedData, width * 1.9, scaleSelectors);
  const yScale = generateYScale(data, 64 * 2, scaleSelectors);
  const statLabel = stat == "VOLUME" ? "Volume" : "Liquidity";

  return (
    <Box
      ref={ref}
      flexDirection={"column"}
      width="60%"
      borderStyle="single"
      borderColor="white"
      paddingLeft="2"
      justifyContent="center"
    >
      <Box flexDirection="row" justifyContent="flex-end" width="100%">
        <Text color={"white"}>
          {statLabel} | {symbol} | {range}
        </Text>
      </Box>
      <Newline />
      <Sparkline
        height={64}
        width={width * 1.9}
        data={timeboxedData}
        scale={{ yScale: yScale, xScale: xScale }}
        accessors={accessors}
      />
    </Box>
  );
};

export default PairChart;
