import rawData from "./tmp.json"

import {min,max} from "d3-array"
import React from "react";
import { Text, Box, Newline } from "ink";

import LogoComponent from "../logo/index.jsx";
import Sparkline from "../sparkline/index.jsx";

const scaleSelectors = {
  minX: (data) => min(data.map((d) => d.timestamp)),
  minY: (data) => min(data.map((d) => d.open)),
  maxX: (data) => max(data.map((d) => d.timestamp)),
  maxY: (data) => max(data.map((d) => d.open)),
};

const ExampleComponent = ({ width, height, data }) => {
  return (
    <Box flexDirection={"column"}>
      <LogoComponent height={128} width={128} />
      <Text color={"white"}>UNI-ETH | last 7</Text>
      <Newline />
      <Sparkline
        height={height}
        width={200}
        data={rawData}
        selectors={scaleSelectors}
      />
    </Box>
  );
};

export default  ExampleComponent;
