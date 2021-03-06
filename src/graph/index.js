const React = require("react");
const importJsx = require("import-jsx");
const { useState, useEffect } = require("react");
const { Box, Text, measureElement } = require("ink");
const Example = importJsx("./example");
const { useRef } = require("react");

const Table = () => {
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const ref = useRef(null);
  React.useEffect(() => {
    const { width: _width, height: _height } = measureElement(ref.current);
    setHeight(_height);
    setWidth(_width);
  }, [width, height]);
  return (
    <Box ref={ref} flexGrow={1} width={"100"}>
      <Example height={height} width={width} />
    </Box>
  );
};

module.exports = Table;
