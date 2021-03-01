const importJsx = require('import-jsx');
const {render} = require('ink')
const React = require('react')
process.env.FORCE_COLOR = '1';
const App  = importJsx('./graph');

render(React.createElement(App))