let path = require('path')
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let history = require('connect-history-api-fallback')
let cookieParser = require('cookie-parser')
let session = require('express-session')

let router = require('./routes')

let env = process.env.NODE_ENV

//数据处理
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//session
app.use(cookieParser('session'));
app.use(session({
  name: 'dbxSessionId',
  secret: 'dbxSession',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 1 * 24 * 365
  }
}));

//处理cookie信息，如果有，并且不对每次请求都新开一个session
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

//请求API
router.forEach(element => {
  app.use(element)
})

app.use(history({
  index: '/index.html',
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /\/api\/*/,
      to: function (context) {
        let path = context.parsedUrl.path;
        console.log("get请求路径：" + path);
        return path;
      }
    }
  ]
}))

//访问静态资源
app.use(express.static(path.resolve(__dirname, '../assets')))
app.get('*', function response(req, res) {
  res.sendFile(path.resolve(__dirname, '../assets/index.html'))
})

let server = app.listen(3030, function () {
  let host = server.address().address
  let port = server.address().port

  console.log('环境:', env)
  console.log('服务已开启，访问地址为 http://%s:%s', host, port)
})
