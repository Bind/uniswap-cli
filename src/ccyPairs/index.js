const React = require("react");
const importJsx = require("import-jsx");
const { Box, Text, Spacer } = require("ink");
const Spark = importJsx("./spark");

const Table = ({ pairs }) => {
  console.log("Pairs: ", typeof pairs);
  // TEMP Until we figure out what data to pass into this thing.
  const sparkline = <Spark />;

  return (
    <Box flexDirection="column" margin={1} flexGrow={1} borderStyle={"round"}>
      <Box flexDirection="row" justifyContent={"space-between"}>
        <Text>Ticker</Text>
        <Text color={"gray"}>Last</Text>
        <Text color={"red"}>Bid</Text>
        <Text color={"green"}>Ask</Text>
        <Box width={60}></Box>
      </Box>
      {data.map((item) => {
        return (
          <Box
            key={item.ticker}
            flexDirection="row"
            borderStyle={"single"}
            justifyContent={"space-between"}
          >
            <Text>{item.ticker}</Text>
            <Text color={"gray"}>{item.last}</Text>
            <Text color={"red"}>{item.bid}</Text>
            <Text color={"green"}>{item.ask}</Text>
            <Box width={20} />
            <Text>{item.sparkLine}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

const DetailTable = ({ pairs }) => {
  console.log("Pairs: ", typeof pairs);
  // TEMP Until we figure out what data to pass into this thing.
  const sparkline = <Spark />;

  return (
    <Box flexDirection="column" margin={1} flexGrow={1} borderStyle={"round"}>
      {pairs.map((item) => {
        const ticker = `${item.token0.symbol}-${item.token1.symbol}`;
        const itemId = item.id;

        return (
          <Box
            key={item.id}
            flexDirection="row"
            borderStyle={"single"}
            justifyContent={"space-between"}
          >
            <Box flexDirection={"column"}>
              <Text>Ticker: {ticker}</Text>
              <Text>ID: {itemId}</Text>
              <Text color={"gray"}>
                {item.token0.symbol} Price: {item.token0Price}
              </Text>
              <Text color={"gray"}>
                {item.token1.symbol} Price: {item.token1Price}
              </Text>
            </Box>
            <Box flexDirection={"column"}>
              <Text color={"green"}>
                {item.token0.symbol} Reserve: {item.reserve0}
              </Text>
              <Text color={"green"}>
                {item.token1.symbol} Reserve: {item.reserve1}
              </Text>
            </Box>
            <Text>{sparkline}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

module.exports = {
  Table,
  DetailTable,
};
