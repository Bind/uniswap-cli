import { program } from "commander";
import { fetchById, fetchPairs } from "./uniswapAPI";

program.version("0.0.1");

program.option("-v, --verbose", "verbose output debugging");
program.option("-p, --pairs", "fetch the pairs via graphql");
program.option("-i, --id <id>", "fetch token day data for a pair id");

program.parse(process.argv);

const options = program.opts();

if (options.verbose) console.log("options: ", options);

if (options.pairs) {
  fetchPairs()
    .then(
      (pairs) => {
        pairs.data.pairs.forEach((pair) => {
          console.log("pair: ", pair);
        });
      },
      (error) => {
        console.log("error fetching pairs", error);
      }
    )
    .catch((error) => {
      console.log("Caught an error fetching pairs: ", error);
    });
}

if (options.id) {
  fetchById(options.id)
    .then(
      (response) => {
        response.data.tokenDayDatas.forEach((data) => {
          console.log("tokenData: ", data);
        });
      },
      (error) => {
        console.log("error fetching token data for id", error);
      }
    )
    .catch((error) => {
      console.log("Caught an error fetching token data for id: ", error);
    });
}
