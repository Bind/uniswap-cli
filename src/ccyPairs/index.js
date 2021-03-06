const React = require("react");
const importJsx = require("import-jsx");
const { Box, Text, Spacer } = require("ink");
const Spark = importJsx("./spark");

const Table = () => {
  const data = [
    {
      ticker: "BTCUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      sparkLine: <Spark></Spark>,
    },
    {
      ticker: "ETHUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      sparkLine: <Spark></Spark>,
    },
    {
      ticker: "LTCUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      sparkLine: <Spark></Spark>,
    },
  ];

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

const DetailTable = () => {
  const data = [
    {
      ticker: "BTCUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      ohlcv: [49000, 59000, 40000, 53000, 120129912],
      sparkLine: <Spark></Spark>,
    },
    {
      ticker: "ETHUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      ohlcv: [49000, 59000, 40000, 53000, 120129912],
      sparkLine: <Spark></Spark>,
    },
    {
      ticker: "LTCUSD",
      bid: 53200,
      ask: 52199,
      last: 52199.01,
      ohlcv: [49000, 59000, 40000, 53000, 120129912],
      sparkLine: <Spark></Spark>,
    },
  ];

  return (
    <Box flexDirection="column" margin={1} flexGrow={1} borderStyle={"round"}>
      {data.map((item) => {
        return (
          <Box
            key={item.ticker}
            flexDirection="row"
            borderStyle={"single"}
            justifyContent={"space-between"}
          >
            <Box flexDirection={"column"}>
              <Text>Ticker: {item.ticker}</Text>
              <Text color={"gray"}>Last: {item.last}</Text>
              <Text color={"red"}>Bid: {item.bid}</Text>
              <Text color={"green"}>Ask: {item.ask}</Text>
            </Box>
            <Box flexDirection={"column"}>
              <Text color={"green"}>Open: {item.ohlcv[0]}</Text>
              <Text color={"green"}>High: {item.ohlcv[1]}</Text>
              <Text color={"green"}>Low: {item.ohlcv[2]}</Text>
              <Text color={"green"}>Close: {item.ohlcv[3]}</Text>
              <Text color={"gray"}>Vol: {item.ohlcv[4]}</Text>
            </Box>
            <Text>{item.sparkLine}</Text>
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
