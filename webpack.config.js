const path = require('path');
 
module.exports = {
  mode: "development",
  entry: {main: path.resolve(__dirname, './src/index.js'),
  explore: path.resolve(__dirname, './src/explore.js'),
  pairs: path.resolve(__dirname, './src/pairs.js')
},
  target: "node",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
  },
};