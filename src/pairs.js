
import { render } from "ink"
import React from "react";
import { program } from "commander";
import { DetailTable, Table } from "./ccyPairs";

import uniswapAPI from "./uniswapAPI";

program.version("0.0.1");
process.env.FORCE_COLOR = "1";

program
  .option("-d, --detail", "detail output style")
  .option("-v, --verbose", "verbose output debugging");

program.parse(process.argv);

const options = program.opts();

if (options.verbose) console.log("options: ", options);

if (options.detail)
  uniswapAPI
    .fetchPairs()
    .then(
      (pairs) => {
        const uniPairs = pairs.data.pairs;
        const sortedUniPairs = uniPairs.sort((firstEl, secondEl) => {
          const token0volumeUSD = Number(firstEl.volumeUSD);
          const token1volumeUSD = Number(secondEl.volumeUSD);
          return token0volumeUSD - token1volumeUSD;
        });
        const selectedPairs = sortedUniPairs.slice(0, 5);
        render(React.createElement(DetailTable, { pairs: selectedPairs }));
      },
      (error) => {
        console.log("error fetching pairs", error);
      }
    )
    .catch((error) => {
      console.log("Caught an error fetching pairs: ", error);
    });
else render(React.createElement(Table));
