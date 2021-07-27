import React, { useState } from "react";
import { Box, Newline, Text } from "ink";
import { useApp } from "../../context/application";
import { useListedTokens } from "../../context/uniswap";
import { useGlobalData, useAllPairsInUniswap } from "../../context/globalData";
import SelectInput from "ink-select-input";
import { VIEWS, useView } from "../../context/view";

const parseTokenSearchString = (searchString) => {
  if (searchString.indexOf("-") >= 0) {
    const [token0Symbol, token1Symbol] = searchString.split("-");
    return { token0Symbol, token1Symbol };
  } else {
    return { token0Symbol: searchString, token1Symbol: "" };
  }
};

function findExactPairMatch(pairs, searchPair) {
  //Find Exact match
  return (
    pairs.filter((pair) => {
      if (
        pair.token0.symbol == searchPair.token0Symbol &&
        pair.token1.symbol == searchPair.token1Symbol
      ) {
        return true;
      } else if (
        pair.token1.symbol == searchPair.token0Symbol &&
        pair.token0.symbol == searchPair.token1Symbol
      ) {
        return true;
      } else {
        return false;
      }
    })?.[0] || undefined
  );
}

const SuggestedToken1 = () => {
  return [
    {
      label: "WETH",
      value: "WETH",
    },
    {
      label: "DAI",
      value: "DAI",
    },
    {
      label: "USDC",
      value: "USDC",
    },
    {
      label: "OTHER",
      value: "OTHER",
    },
  ];
};

export default ({ searchString }) => {
  const tokens = useListedTokens();
  const { setAddress } = useApp();
  const { setView } = useView();
  useGlobalData();
  const data = useAllPairsInUniswap();
  const [searchPair, setSearchPair] = useState(
    parseTokenSearchString(searchString)
  );
  function handleSelect(item) {
    searchPair.token1Symbol = item.value;
    setSearchPair(searchPair);
  }

  if (!searchPair.token1Symbol) {
    const items = SuggestedToken1();
    return <SelectInput items={items} onSelect={handleSelect} />;
  }
  const exactMatch = findExactPairMatch(data, searchPair);
  if (exactMatch) {
    console.log(exactMatch);
    setAddress(exactMatch.address);
    setView(VIEWS.TABLE);
  }
  return (
    <Box height="100" width="100" flexDirection="column">
      {data
        .filter(
          (pair) =>
            pair.token0.symbol.indexOf(searchPair.token0Symbol) >= 0 &&
            pair.token1.symbol.indexOf(searchPair.token1Symbol) >= 0
        )
        .map((pair) => (
          <Box
            borderColor="gray"
            borderStyle="single"
            key={`${pair.token0.id}-${pair.token1.id}`}
          >
            <Text>
              <Text>{`${pair.token0.symbol}-${pair.token1.symbol}`}</Text>
              <Newline />
              <Text color="gray">{`${pair.token0.name}  ${pair.token1.name}`}</Text>
              <Newline />
            </Text>
          </Box>
        ))}
    </Box>
  );
};
