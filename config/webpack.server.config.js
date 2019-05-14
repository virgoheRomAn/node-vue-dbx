'use strict'
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('./utils');
const webpackBaseConfig = require('./webpack.base.config');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const webpackDevConfig = Object.assign(webpackBaseConfig, {
  entry: {
    app: path.join(__dirname, '../src/index.js'),
    vendor: ['vue', 'vue-router', 'jquery', 'iview', 'axios']
  },
  devtool: '#source-map',
  devServer: {
    clientLogLevel: 'warning',  
    disableHostCheck: true,
    historyApiFallback: {
      rewrites: [
        {
          from: /\/get\/*/, to: function (context) {
            console.log("get请求路径：" + context.parsedUrl.path);
            return context.parsedUrl.path
          }
        },
      ],
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: '0.0.0.0',
    port: "9999",
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    proxy: {
      '/api': {
        target: 'http://10.55.110.211:3030',
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/api': '/'}
      }
    },
    quiet: true,
    watchOptions: {
      poll: false,
    }
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

// module.exports = webpackDevConfig;
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || "9999"
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      webpackDevConfig.devServer.port = port
      webpackDevConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${webpackDevConfig.devServer.host}:${port}`],
        },
        onErrors: false
      }))

      resolve(webpackDevConfig)
    }
  })
})

