const { program } = require("commander");
const uniswapAPI = require("./uniswapAPI");

program.version("0.0.1");

program.option("-v, --verbose", "verbose output debugging");
program.option("-p, --pairs", "fetch the pairs via graphql");

program.parse(process.argv);

const options = program.opts();

if (options.verbose) console.log("options: ", options);

if (options.pairs) {
  uniswapAPI
    .fetchPairs()
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
