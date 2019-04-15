var express = require('express')
var $ajax = require('axios')
var fs = require('fs')
var native = require('../../config/native')
var port = require('../../config/interface')
var router = express.Router()
var common = require('../common')

/**
 * 用户登录（密码登录）
 * @param {String} userName 用户手机号
 */
router.post('/user/login', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.login;
  var body = request.body;
  var userName = body.mobile;
  var password = body.password;
  var params = {
    userName: userName,
    password: password
  };
  console.log('用户登录密码登录参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    if (resData.code == '200') {//登录成功存用户信息到session
      var userInfo = {
        userName: userName,
        id: resData.data.userId
      }
      request.session.userInfo = userInfo;
      resData.data.token = request.session.id
      resData.data.userName = userName
    }
    console.log(request.session.id)
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 短信验证码登录
 */
router.post('/user/codeLogin', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.loginByCode
  var body = request.body
  var userName = body.mobile
  var params = {
    userName: userName,
    validationCode: body.verCode
  };
  console.log('短信验证码登录参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    if (resData.code == '200') {//登录成功存用户信息到session
      var userInfo = {
        userName: userName,
        id: resData.data.userId
      }
      request.session.userInfo = userInfo;
      resData.data.token = request.session.id
      resData.data.userName = userName
    }
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 用户注册
 */
router.post('/user/register', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.register
  var body = request.body
  var again = body.again
  var password = body.password
  if (again !== password) {
    response.send({
      code: 209,
      message: '确认密码不一致',
      data: {}
    })
    return;
  }
  var params = {
    userName: body.mobile,
    password: password,
    validationCode: body.verCode,
    brokerId: body.brokerId || ''
  }
  console.log('用户注册参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 忘记密码
 */
router.post('/user/forgotPassword', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.forgotPass
  var body = request.body
  var again = body.again
  var password = body.password
  if (again !== password) {
    response.send({
      code: 208,
      message: '确认密码不一致',
      data: {}
    })
    return;
  }
  var params = {
    userName: body.mobile,
    validationCode: body.verCode,
    newPassword: body.password
  }
  console.log('忘记密码参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 发送短信
 * @param mobile
 */
router.post('/user/sendSmsCode', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.sendSmsCode
  var body = request.body
  var userName = body.mobile
  var params = {
    userName: userName
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    console.log("手机号码：" + userName + "，短信验证码为：" + resData.data.validation)
    resData.data = {}
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })

})

/**
 * 获取用户登录状态
 * 登录返回true,未登录返回false
 */
router.get('/user/loginStatus', function (request, response, next) {
  var userInfo = request.session.userInfo
  console.log("用户登录sessionID：" + request.session.id)
  if (userInfo) {
    response.send({
      loginStatus: true
    })
  } else {
    response.send({
      loginStatus: false
    })
  }
})
/**
 * 注销
 */
router.get('/user/logout', function (request, response, next) {
  var userInfo = request.session.userInfo
  if (userInfo) {
    request.session.userInfo = null
  }
  request.session.destroy()
  response.send({
    code: 200,
    message: '成功'
  })
})

/**
 * 验证短信验证码是否正确
 */
router.post('/user/checkSmsCode', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.loginByCode
  var body = request.body
  var params = {
    userName: body.mobile,
    validationCode: body.verCode
  }
  console.log('验证验证码参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 邀请注册
 */
router.post('/user/inviteRegister', function (request, response, next) {
  var url = native.system.userCenter + port.url.user.inviteRegister
  var body = request.body
  var params = {
    userName: body.mobile,
    validationCode: body.verCode,
    brokerId: body.brokerId
  }
  console.log("推荐注册参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台backUrl 接收回调逻辑处理
 */
router.post('/cashier/backUrl/:viewPage/:type/:userId',function(request, response, next){
  var body = request.body
  var type = request.params.type
  var userId = request.params.userId
  var viewPage = request.params.viewPage + ""
  console.log(body)
  console.log('收银台回调type='+type)
  var viewUrl = native.system.moneyView + viewPage.replace('_','/')
  switch (type) {
    case "1":
      //处理支付密码设置回调
      var url = native.system.userCenter + port.url.user.updatePayPassword
      var params = {
        userId: userId,
        newPayPwd: '666666'
      }
      $ajax.post(url, params).then(function (res) {
        var resData = common.parseResponseData(res,'0')
      }).catch(function (err) {
        console.log(err)
      })
      response.redirect(302, viewUrl)
      break;
    case "2":
      //处理充值回调
      response.redirect(302, viewUrl)
      break;
    case "3":
      //处理提现回调
      response.redirect(302, viewUrl+'')
      break;
    case "4":
      //处理投资回调
      response.redirect(302, viewUrl)
      break;
    default:
      console.log('收银台回调类型未知')
      response.redirect(302, viewUrl)
      break;
  }
})

module.exports = router
