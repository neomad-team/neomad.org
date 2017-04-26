var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: "./static/components/PoiCards.js",
  output: {
    path: "./static/components",
    filename: "App-around.js"
  },
  watch: true,

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_module/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
