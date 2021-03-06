const importJsx = require("import-jsx");
var rawData = require("./tmp.json");
var d3Array = require("d3-array");
const React = require("react");
const { Text, Box, Newline } = require("ink");
const Sparkline = importJsx("../sparkline");

const scaleSelectors = {
  minX: (data) => d3Array.min(data.map((d) => d.timestamp)),
  minY: (data) => d3Array.min(data.map((d) => d.open)),
  maxX: (data) => d3Array.max(data.map((d) => d.timestamp)),
  maxY: (data) => d3Array.max(data.map((d) => d.open)),
};

const ExampleComponent = ({ width, height, data }) => {
  return (
    <Box borderColor="red" borderStyle="round" flexDirection={"column"}>
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

module.exports = ExampleComponent;
