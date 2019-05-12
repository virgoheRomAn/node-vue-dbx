let express = require('express')
let $ajax = require('axios')
let native = require('../../config/native')
let port = require('../../config/interface')
let router = express.Router()
let common = require('../common')

/**
 * 产品类型
 */
router.post('/product/classes', function (request, response, next) {
  let url = native + port.url.product.classes;
  let sessionid = request.session.token;
  // if (!sessionid) {
  //   common.notUserInfo(request, response);
  //   return false;
  // }
  let param = { sessionid };
  console.log("产品类型查询参数：" + JSON.stringify(param));
  $ajax.post(url, param).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 产品列表
 */
router.post('/product/list', function (request, response, next) {
  let url = native + port.url.product.list;
  let sessionid = request.session.token;
  // if (!sessionid) {
  //   common.notUserInfo(request, response);
  //   return false;
  // }
  let param = {
    sessionid,
    pageNum: request.body.pageNum,
    pageSize: request.body.pageSize,
    prodClass: request.body.prodClass,
    suid: request.body.suid
  };
  console.log("产品列表查询参数：" + JSON.stringify(param));
  $ajax.post(url, param).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

module.exports = router
