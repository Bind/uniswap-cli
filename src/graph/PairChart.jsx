import { min, max } from "d3-array";
import React, { useRef } from "react";
import { measureElement, Text, Box, Newline } from "ink";

import Sparkline from "../sparkline/index.jsx";

const scaleSelectors = {
  minX: (data) => min(data.map((d) => d.date)),
  minY: (data) => max(data.map((d) => d.dailyVolumeUSD)),
  maxX: (data) => max(data.map((d) => d.date)),
  maxY: (data) => min(data.map((d) => d.dailyVolumeUSD)),
};
const accessors = {
  x: (d) => d.date * 1000,
  y: (d) => d.dailyVolumeUSD,
};

const PairChart = ({ data }) => {
  const ref = useRef(null);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    const { width: _width, height: _height } = measureElement(ref.current);
    setHeight(_height);
    setWidth(_width);
  }, [width, height]);
  return (
    <Box
      ref={ref}
      flexDirection={"column"}
      width="60%"
      borderStyle="single"
      borderColor="white"
    >
      <Box flexDirection="row" justifyContent="flex-end" width="100%">
        <Text color={"white"}>Volume | ETH-USDC | ALL </Text>
      </Box>
      <Newline />
      <Sparkline
        height={64}
        width={width * 1.9}
        data={data}
        selectors={scaleSelectors}
        accessors={accessors}
      />
    </Box>
  );
};

export default PairChart;
