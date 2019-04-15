'use strict'
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('./utils');
const webpackBaseConfig = require('./webpack.base.config');

const webpackDevConfig = Object.assign(webpackBaseConfig, {
  entry: {
    app: ['webpack-hot-middleware/client?reload=true', path.join(__dirname, '../src/index.js')],
    vendor: ['vue', 'vue-router', 'jquery', 'iview', 'axios']
  },
  devtool: '#source-map',
  devServer: {
    hot: true,
    port: 8888
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // filename:  (getPath) => {
      //   return getPath('css/[name].css').replace('css/js', 'css');
      // },
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]
});

module.exports = webpackDevConfig;


