let express = require('express');
let $ajax = require('axios');
let native = require('../../config/native');
let port = require('../../config/interface');
let router = express.Router();
let common = require('../common');

/**
 * 检测登录状态
 */
router.get('/user/status', function (request, response, next) {
  let token = request.session.token;
  console.log(`当前token=> ${token}`);

  if (token) {
    response.send({
      status: true
    })
  } else {
    response.send({
      status: false
    })
  }
})

/**
 * 用户注册验证码
 */
router.post('/user/registerSmscode', function (request, response, next) {
  let url = native + port.url.user.registerSmscode;
  let { mobile } = request.body;

  let params = { mobile };
  console.log('用户注册验证码参数：' + JSON.stringify(params))

  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      console.log('用户：%s，验证码：%s', mobile, data.data.smscode);
      data.data = {};
    }
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
});

/**
 * 用户注册
 */
router.post('/user/register', function (request, response, next) {
  let url = native + port.url.user.register;
  let { topUid, mobile, smscode, password, userName, idCard } = request.body;

  let params = {
    topUid, mobile, smscode, password, userName, idCard
  };
  console.log('用户用户注册参数：' + JSON.stringify(params))

  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
});

/**
 * 用户登录（密码登录）
 * @param {String} username 用户手机号
 * @param {String} password 密码
 */
router.post('/user/login', function (request, response, next) {
  let url = native + port.url.user.login;
  let username = request.body.username;

  let params = {
    username,
    password: request.body.password
  };
  console.log('用户登录密码登录参数：' + JSON.stringify(params))

  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      request.session.token = data.data.sessionid;
      request.session.username = username;
      request.session.suid = data.data.suid;
    } else {
      request.session.token = "";
      request.session.username = "";
      request.session.suid = "";
    }

    response.send(res.data)
  }).catch(function (err) {
    console.log(err)
  })
});

/**
 * 用户登出
 * @param {String} username 用户手机号
 * @param {String} password 密码
 */
router.get('/user/logout', function (request, response, next) {
  let url = native + port.url.user.logout;
  $ajax.post(url).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      request.session.token = "";
      request.session.username = "";
      request.session.suid = "";
    }

    response.send(res.data)
  }).catch(function (err) {
    console.log(err)
  })
});

/**
 * 获取邀请人列表
 * @param {String} username 用户手机号
 */
router.get('/user/myInvite', function (request, response, next) {
  let url = native + port.url.user.myInvite;
  let username = request.query.username;
  let sessionid = request.session.token;

  let params = { k: username, sessionid };
  console.log('获取邀请人列表参数：' + JSON.stringify(params))

  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data);
  }).catch(function (err) {
    console.log(err)
  })
});

module.exports = router
