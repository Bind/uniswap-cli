const importJsx = require("import-jsx");
const { render } = require("ink");
const React = require("react");
const { program } = require('commander');
const { DetailTable, Table } = importJsx("./ccyPairs");

program.version('0.0.1');
process.env.FORCE_COLOR = "1";

program
  .option('-d, --detail', 'detail output style')
  .option('-v, --verbose', 'verbose output debugging')

program.parse(process.argv);

const options = program.opts()

if( options.verbose )
  console.log("options: ", options)

if( options.detail )
  render(React.createElement(DetailTable));
else
  render(React.createElement(Table));
