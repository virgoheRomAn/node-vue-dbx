var express = require('express')
var $ajax = require('axios')
var native = require('../../config/native')
var port = require('../../config/interface')
var router = express.Router()
var common = require('../common')

/**
 * 获取当前登录的用户信息
 */
router.get('/userCenter/userInfo', function (request, response, next) {
  console.log(request.session.id)
  common.notLoginData(request,response)
  var url = native.system.userCenter + port.url.user.userLoginInfo
  var userInfo = request.session.userInfo
  var params = {
    userId: userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 用户资产信息
 */
router.post('/userCenter/transRecord',function (request, response, next) {
  var url = native.system.dataResource + port.url.dataresource.transRecord
  var userInfo = common.sessionUserInfo(request)
  var phoneNum = userInfo.userName
  var pageNum = request.body.pageNum || 1
  var pageSize = request.body.pageSize || 5
  var params = {
    phoneNum: phoneNum,
    pageNum: pageNum,
    pageSize: pageSize
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 资金流水（资金管理）
 */
router.post('/userCenter/cashFlow',function(request, response, next) {
  var url = native.system.dataResource + port.url.dataresource.cashFlow
  var userInfo = common.sessionUserInfo(request)
  var phoneNum = userInfo.userName
  var pageNum = request.body.pageNum || 1
  var pageSize = request.body.pageSize || 5
  var params = {
    phoneNum: phoneNum,
    pageNum: pageNum,
    pageSize: pageSize
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 账户信息
 */
router.get('/userCenter/account',function(request, response, next) {
  var url = native.system.dataResource + port.url.dataresource.userAccount
  var phoneNum = request.params.mobile
  var userInfo = common.sessionUserInfo(request)
  var params = {
    phoneNum: userInfo.userName
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 修改登录密码
 */
router.post('/userCenter/updatePass',function(request,response,next){
  var url = native.system.userCenter + port.url.user.updatePass
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var newPassword = body.newPassword
  var again = body.again
  if(newPassword !== again){
    response.send({
      code: 210,
      message: '确认密码不一致',
      data: {}
    })
    return
  }
  var params = {
    userName: userInfo.userName,
    oldPassword: body.oldPassword,
    newPassword: newPassword
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 设置支付密码
 */
router.post('/userCenter/setPayPassword',function(request,response,next){
  var url = native.system.userCenter + port.url.user.setPayPass
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userId: userInfo.id,
    phoneNum: userInfo.userName,
    oldPayPwd: body.oldPassword || '',
    newPayPwd: body.newPassword
  }
  console.log("设置支付密码参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 忘记支付密码
 */
router.post('/userCenter/forgetPayPassword',function(request,response,next){
  var url = native.system.userCenter + port.url.user.forgotPayPsaa
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userName: userInfo.userName,
    userId: userInfo.id,
    newPassword: body.newPassword,
    validationCode: body.verCode
  }
  console.log("忘记支付密码参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 验证支付密码是否正确
 */
router.post('/userCenter/checkPayPssword',function(request,response,next){
  var url = native.system.userCenter + port.url.user.checkPayPwd
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id,
    payPwd: request.body.payPassword
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 绑卡发送验证码
 */
router.post('/userCenter/bindCardSmsCode',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.bindCardSmsCode
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var params = {
    phoneNum: userInfo.userName,
    realName: body.realName,
    certificateNo: body.certificateNo,
    bankName: body.bankName,
    cardNo: body.cardNo,
    phone: body.phone
  }
  console.log('绑定银行卡发短信参数：'+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 绑卡确认
 */
router.post('/userCenter/bindCardSubmit',function(request,response,next){
  var url = native.system.userCenter + port.url.user.bindBankCardSubmit
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id,
    mobileNo: userInfo.userName,
    name: body.realName,
    idNo: body.certificateNo,
    bankCardName: body.bankName,
    bankCardNo: body.cardNo,
    bankObileNo: body.phone,
    cardOrderId: body.cardOrderId,
    smsCode: body.smsCode
  }
  console.log("绑卡确认参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 换卡发送短信验证码
 */
router.post('/userCenter/changeCardSmsCode',function(request,response,next){
  var url = native.system.userCenter + port.url.user.changeBankCardSmsCode
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userId: userInfo.id,
    newBankName: body.bankName,
    newCardNo: body.cardNo,
    newPhone: body.phone
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 换卡提交
 */
router.post('/userCenter/changeCardSubmit',function(request,response,next){
  var url = native.system.userCenter + port.url.user.changeBankCardSubmit
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id,
    newBankName: body.bankName,
    newCardNo: body.cardNo,
    newPhone: body.phone,
    cardOrderId: body.cardOrderId,
    smsCode: body.smsCode
  }
  console.log("换卡确认参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 获取用户扩展信息
 */
router.get('/userCenter/userExtData',function(request,response,next){
  var url = native.system.userCenter + port.url.user.userExtData
  var userInfo = common.sessionUserInfo(request)
  if(!userInfo){
    common.notLoginData(response)
    return
  }
  var userId = userInfo.id
  var params = {
    userId: userId
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    if(resData.data.tradePassword){
      resData.data.tradePassword = Math.random().toString(36).substr(2)
    }
    if(resData.data.headPortrait){
      var fileToken = resData.data.headPortrait
      var url1 = native.system.file + port.url.filetool.download
      $ajax.post(url1, {fileToken:fileToken}).then(function (res) {
        var fileUrl = common.parseResponseData(res, '0')
        resData.data.headPortrait = fileUrl.data.fileToken
        response.send(resData)
      }).catch(function(err){
        resData.data.headPortrait = null;
        response.send(resData)
      })
    }else{
      response.send(resData)
    }
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 充值发送短信验证码
 */
router.post('/userCenter/rechargeSmsCode',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.rechargeSmsCode
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 充值提交
 */
router.post('/userCenter/rechargeSubmit',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.rechargeSubmit
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount,
    payNo: body.payNo,
    smsCode: body.smsCode,
    payPwd: body.payPwd
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 提现发送短信验证码
 */
router.post('/userCenter/withdrawSmsCode',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.withdrawSmsCode
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    phoneNum: userInfo.userName,
    orderAmount: body.orderAmount
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 提现提交
 */
router.post('/userCenter/withdrawSubmit',function(request,response,next){
  var url = native.system.userCenter + port.url.user.withdrawSubmit
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userId: userInfo.id,
    orderAmount: body.orderAmount,
    payNo: body.payNo,
    smsCode: body.smsCode,
    payPwd: body.payPwd
  }
  console.log("提现提交参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    console.log("提现返回参数："+JSON.stringify(res.data))
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 *  交易流水查询
 */
router.get('/userCenter/tradingFlow',function(request,response,next){
  var url = native.system.userCenter + port.url.user.tradingFlow
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 获取风险测评题目
 */
router.get('/userCenter/riskQuestions',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.questionList
  $ajax.post(url, {}).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    if(resData.code === 200){
      var quesData = JSON.parse(resData.data).qamsQue
      resData.data = quesData
    }
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 提交测评答案
 */
router.post('/userCenter/riskAnswerSubmit',function(request,response,next){
  var url = native.system.userCenter + port.url.user.answerSubmit
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userId: userInfo.id,
    phoneNum: userInfo.userName,
    type: 'platform',
    data: JSON.stringify(body)
  }
  console.log("风险测评答案参数："+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 投资发送短信验证码
 */
router.post('/userCenter/investSmsCode',function(request,response,next){
  var apply_url = native.system.dataResource + port.url.dataresource.investApply
  var invest_sms_code_url = native.system.dataResource + port.url.dataresource.tjfaeSmsCode
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var apply_params = {
    phoneNum: userInfo.userName,
    productCode: body.productCode
  }
  var sms_params = {
    phoneNum: userInfo.userName,
    smsType: '3'
  }
  $ajax.post(apply_url, apply_params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    if(resData.code===200){
      $ajax.post(invest_sms_code_url, sms_params).then(function (res) {
        var resData = common.parseResponseData(res,'200')
        response.send(resData)
      }).catch(function (err) {
        console.log(err)
        response.send(common.parseErrorData(err))
      })
    }else{
      response.send(resData)
    }
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 投资提交
 */
router.post('/userCenter/investSubmit',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.investSubmit
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    phoneNum: userInfo.userName,
    investAmount: body.investAmount,
    payAmouont: body.investAmount,
    productCode: body.productCode,
    tranCode: body.payPwd,
    smsCode: body.smsCode,
    orderId: body.orderId,
    couponId: body.couponId || ''
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 投资结果查询
 */
router.post('/userCenter/investStatus',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.investStatus
  var params = {
    tradeOrderOid: request.body.tradeOrderOid
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 充值结果查询
 */
router.post('/userCenter/rechargeStatus',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.rechargeStatus
  var params = {
    bankOrderOid: request.body.bankOrderOid
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 我的邀请
 */
router.get('/userCenter/myInvite',function(request,response,next){
  var url = native.system.userCenter + port.url.user.myInvite
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 设置用户分类code
 */
router.post('/userCenter/setStaffCode',function(request,response,next){
  var url = native.system.userCenter + port.url.user.setStaffCode
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var params = {
    userId: userInfo.id,
    staffCode: body.staffCode
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 我的优惠券（包含红包、抵扣券）
 */
router.post('/userCenter/myCoupons',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.myCoupons
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var date = new Date();
  var year = body.year || date.getFullYear()
  var month = body.month || (date.getMonth()+1)
  var createTimeBegin = year+'-'+month+'-01'+' 00:00:00'
  var createTimeEnd = year+'-'+month+'-'+common.getEndDayByMonth(year,month)+' 23:59:59'
  var params = {
    phoneList: userInfo.userName,
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 5,
    createTimeBegin: createTimeBegin,
    createTimeEnd: createTimeEnd
  }
  console.log('我的红包查询参数：'+JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    if(resData.code === 200){
      resData.data = resData.data.redEnvelope
    }
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 红包提现
 */
router.post('/userCenter/useCoupons',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.useCoupons
  var userInfo = common.sessionUserInfo(request)
  var params = {
    phoneNum: userInfo.userName,
    couponId: request.body.couponId
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 设置昵称和头像
 */
router.post('/userCenter/setNickAndHead',function(request,response,next){
  var url = native.system.userCenter + port.url.user.setNickHead
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var params = {
    userId: userInfo.id,
    nickName: body.nickName || '',
    headPortrait: body.headPortrait || ''
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 查询用户消息
 */
router.post('/userCenter/myMessage',function(request,response,next){
  var url = native.system.userCenter + port.url.user.messageList
  var body = request.body
  var userInfo = common.sessionUserInfo(request)
  var params = {
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 10,
    userName: userInfo.userName
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

router.get('/userCenter/message/:id',function(request,response,next){
  var url = native.system.userCenter + port.url.user.messageById
  var body = request.params
  var params = {
    id: body.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'0')
    if(resData.code==200){
      resData.data = resData.data[0]
    }
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台设置支付密码
 */
router.post('/userCenter/cashier/payPassword/:type',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.cashier.payPassword
  var userInfo = common.sessionUserInfo(request)
  var type = request.params.type
  var backUrl = request.body.backUrl || '_usercenter'
  var params = {
    phoneNum: userInfo.userName,
    type: type,
    backUrl: native.system.moneyNode+'/cashier/backUrl/'+backUrl+'/1/'+userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台充值
 */
router.post('/userCenter/cashier/recharge',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.cashier.recharge
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var backUrl = body.backUrl || '_usercenter'
  var params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount,
    backUrl: native.system.moneyNode+'/cashier/backUrl/'+backUrl+'/2/'+userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台提现
 */
router.post('/userCenter/cashier/withdraw',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.cashier.withdraw
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var backUrl = body.backUrl || '_usercenter'
  var params = {
    phoneNum: userInfo.userName,
    orderAmount: body.orderAmount,
    backUrl: native.system.moneyNode+'/cashier/backUrl/'+backUrl+'/3/'+userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台投资
 */
router.post('/userCenter/cashier/invest',function(request,response,next){
  var url = native.system.dataResource + port.url.dataresource.cashier.invest
  var userInfo = common.sessionUserInfo(request)
  var body = request.body
  var backUrl = body.backUrl || '_usercenter'
  var params = {
    phoneNum: userInfo.userName,
    productCode: body.productCode,
    investAmount: body.investAmount,
    payAmouont: body.investAmount,
    backUrl: native.system.moneyNode+'/cashier/backUrl/'+backUrl+'/4/'+userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    var resData = common.parseResponseData(res,'200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

module.exports = router
