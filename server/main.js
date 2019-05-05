var path = require('path')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var webpackConfig = require('../config/webpack.dev.config')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var querystring = require('querystring')
var history = require('connect-history-api-fallback')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var env = process.env.NODE_ENV

app.use(history({
  index: '/index.html',
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /\/api\/*/,
      to: function (context) {
        var path = context.parsedUrl.path;
        console.log("get请求路径：" + path);
        return path;
      }
    }
  ]
}))

if (env === 'native1') {
  var proxy = require("express-http-proxy");
  var apiProxy = proxy("http://10.55.110.191:8888", {
    forwardPath: function (req, res) {
      return req._parsedUrl.path
    }
  })

  app.use("/api", apiProxy)

  var complier = webpack(webpackConfig)
  var devMiddleware = webpackDevMiddleware(complier, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: {
      colors: true,
    }
  })

  var hotMiddleware = webpackHotMiddleware(complier, {
    log: false,
    path: '/__webpack_hmr',
    heartbeat: 2000,
  })
  app.use(devMiddleware)
  app.use(hotMiddleware)

} else {
  app.use(cookieParser('session'));
  app.use(session({
    name: 'sessionId',
    secret: 'session',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1 * 24
    }
  }));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(function (req, res, next) {
    var arr = req.url;
    if (arr.indexOf('usercenter') > 0 || arr.indexOf('product') > 0) {
      let sessionid = req.session.token;
      if (!sessionid) {
        res.send({
          code: 401,
          message: '请先登录',
          data: {}
        })
      } else {
        next();
      }
    } else {
      next();
    }
  })

  //api
  var user = require('./routes/user')
  app.use(user)

  var product = require('./routes/product')
  app.use(product)

  var userCenter = require('./routes/userCenter')
  app.use(userCenter)

  var basic = require('./routes/basic')
  app.use(basic)

  app.use(function (req, res, next) {
    //处理cookie信息，如果有，并且不对每次请求都新开一个session
    res.header("Access-Control-Allow-Credentials", "true")
    next()
  })

  //访问静态资源
  app.use(express.static(path.resolve(__dirname, '../assets')))
  app.get('*', function response(req, res) {
    res.sendFile(path.resolve(__dirname, '../assets/index.html'))
  })
}

var server = app.listen(3030, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('环境:', env)
  console.log('服务已开启，访问地址为 http://%s:%s', host, port)
})
