const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './static/components/AroundCards.js',
  output: {
    path: './static/components',
    filename: 'App.js'
  },
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
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}
