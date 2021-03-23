import React, { useRef} from "react";
import { Box, measureElement } from "ink";
import Example from "./example.jsx"

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

export default Table;
