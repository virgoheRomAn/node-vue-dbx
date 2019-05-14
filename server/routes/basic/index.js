var express = require('express')
var $ajax = require('axios')

var multer = require('multer');
var fs = require('fs');
var UPLOAD_PATH = './uploads'
var upload = multer({ dest: UPLOAD_PATH })

var native = require('../../config/native')
var port = require('../../config/interface')
var router = express.Router()
var common = require('../common')

/**
 * banner列表
 */
router.get('/basic/banner', function (request, response, next) {
  let url = native + port.url.basic.banner;
  let sessionid = request.session.token;
  let suid = request.query.suid;
  // if (!sessionid) {
  //   common.notUserInfo(request, response);
  //   return false;
  // }
  let param = { sessionid, suid };
  $ajax.post(url, param).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * notice列表
 */
router.get('/basic/notice', function (request, response, next) {
  let url = native + port.url.basic.notice;
  let sessionid = request.session.token;
  let suid = request.query.suid;
  // if (!sessionid) {
  //   common.notUserInfo(request, response);
  //   return false;
  // }
  let param = { sessionid, suid };
  $ajax.post(url, param).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 城市列表
 */
router.get('/basic/city', function (request, response, next) {
  let url = native + port.url.basic.city;
  let sessionid = request.session.token;
  // if (!sessionid) {
  //   common.notUserInfo(request, response);
  //   return false;
  // }
  let param = { sessionid };
  $ajax.post(url, param).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

module.exports = router
