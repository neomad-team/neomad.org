var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './static/components/AroundCards.js',
  output: {
    path: './static/components',
    filename: 'App.js'
  },
  watch: true,

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_module/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
