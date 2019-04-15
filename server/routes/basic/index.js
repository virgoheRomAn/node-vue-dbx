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
 * 查询银行
 */
router.get('/basic/banks',function(request,response,next){
  var url = native.system.userCenter + port.url.user.getBanks
  var bankCardName = request.query.bankName
  var params = {}
  if(bankCardName){
    params = {bankCardName: bankCardName}
  }
  $ajax.post(url, params).then(function (res) {
    var resData = {}
    var data = res.data.data
    if(res.data.code==='0'){
      resData.code = 200
      resData.message = '成功'
      resData.data = data.bankCardInfo
    }else{
      resData.code = 205
      resData.message = res.data.message
      resData.data = {}
    }
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 用户分类信息查询
 */
router.get('/basic/userClassfl/:cfCode',function(request,response,next){
  var cfCode = request.params.cfCode
  var url = native.system.userCenter + port.url.user.classificationQuery
  if(cfCode==='01'){
    cfCode = '0101'
  }
  var params = {
    cfCode: cfCode
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

router.get('/basic/test',function(request,response,next){
  var url = native.system.userCenter + '/user/aslssll'
  $ajax.post(url, {}).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 上传文件
 */
router.post('/basic/fileUpload',upload.array('file'),function(request,response,next){
  var body = request.body
  var url = native.system.file + port.url.filetool.upload
  const { files } = request;
  fs.readFile(files[0].path, function(err, data) {
    var params = {
      file: data.toString('base64'),
      type: '1',
      suffix: 'png'
    }
    $ajax.post(url, params).then(function (res) {
      var resData = common.parseResponseData(res, '0')
      fs.unlinkSync(files[0].path)
      response.send(resData)
    }).catch(function(err){
      //删除上传的临时文件
      fs.unlinkSync(files[0].path)
      console.log(err)
      response.send(common.parseErrorData(err))
    })
  })
})

/**
 * 下载文件
 */
router.get('/basic/fileDownload/:fileToken',function(request,response,next){
  var fileToken = request.params.fileToken
  var url = native.system.file + port.url.filetool.download
  $ajax.post(url, {fileToken:fileToken}).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 查询当前展示的banner数据
 */
router.post('/basic/bannerList',function(request,response,next){
  var url = native.system.userCenter + port.url.user.bannerList
  var body = request.body
  var params = {
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 10,
    bannerState: 1,
    bannerType: body.bannerType
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 分页查询系统通知(公告)
 */
router.post('/basic/noticeList',function(request,response,next){
  var url = native.system.userCenter + port.url.user.noticeList
  var body = request.body
  var params = {
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 10
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 公告详情
 */
router.get('/basic/notice/:id',function(request,response,next){
  var url =  native.system.userCenter + port.url.user.noticeById
  var params = {
    id: request.params.id
  }
  console.log("公告ID：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    if(resData.code==200){
      resData.data = resData.data[0]
    }
    response.send(resData)
  }).catch(function(err){
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

module.exports = router
