var express = require('express')
var $ajax = require('axios')
var native = require('../../config/native')
var port = require('../../config/interface')
var router = express.Router()
var common = require('../common')

/**
 * 产品列表查询
 */
router.post('/product/dataList',function (request, response, next) {
  var url = native.system.dataResource + port.url.dataresource.list;
  var userInfo = common.sessionUserInfo(request)
  var body = request.body;
  var isNotSpecial = 0
  if(body.pageSize==2){
    isNotSpecial = 1
  }
  var param = {
    pageNum:body.pageNum || 1,
    pageSize:body.pageSize || 5,
    productDataresourceStatus: 2,
    isNotSpecial: isNotSpecial
  }
  console.log("产品列表查询参数："+JSON.stringify(param))
  $ajax.post(url, param).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    var productList = new Array()
    if(resData.data!='[]'){
      for(var p in resData.data){
        var product = resData.data[p];
        if(product.product_special_label){
          if(userInfo && product.product_special_label.indexOf(userInfo.userName)>=0){
            productList.push(product)
          }
        }else{
          productList.push(product)
        }
      }
    }
    resData.data = productList
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 产品详情
 */
router.get('/product/details/:productCode',function (request,response,next){
  var url = native.system.dataResource + port.url.dataresource.details;
  var productCode = request.params.productCode;
  $ajax.post(url, {productCode:productCode}).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
module.exports = router
