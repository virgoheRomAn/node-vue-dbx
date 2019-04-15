'use strict'
const utils = require('./utils');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: path.join(__dirname, '../src/index.js'),
    vendor: ['vue', 'vue-router', 'vuex', 'jquery', 'element-ui', 'axios']
  },
  output: {
    path: path.resolve(__dirname, './assets'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      'assets': utils.resolve('src/assets'),
      'components': utils.resolve('src/components'),
      'swiper': 'swiper/dist'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: utils.cssLoaders({
                sourceMap: true,
                extract: true
              }),
              cssSourceMap: true,
              cacheBusting: true,
              transformToRequire: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href'
              }
            }
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('src'),
          utils.resolve('node_modules/webpack-dev-server/client'),
          utils.resolve('node_modules/iview/src'),
          utils.resolve('node_modules/iview/packages'),
          utils.resolve('node_modules/elemnt-ui/src'),
          utils.resolve('node_modules/elemnt-ui/packages')
        ]
      },
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
          }, {
            loader: 'less-loader',
          }]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

// module.exports = vuxLoader.merge(webpackConfig, {
//   plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
// });

module.exports = webpackConfig;
