const path = require('path');
const { optimize, OptimizationStages } = require('webpack');

module.exports = {
  mode: 'development',
  optimization: {minimize: false},
  entry: './index.js',
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/")
    },
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
};

