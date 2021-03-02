const React = require("react");
const importJsx = require("import-jsx");
const { useState, useEffect } = require("react");
const { Box, Text, measureElement } = require("ink");
const Example = importJsx("./example");
const { useRef } = require("react");

const Table = () => {
  return (
    <Box flexGrow={1}>
      <Example />
    </Box>
  );
};

module.exports = Table;
