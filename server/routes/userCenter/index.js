let express = require('express')
let $ajax = require('axios')
let native = require('../../config/native')
let port = require('../../config/interface')
let router = express.Router()
let common = require('../common')

/**
 * 获取当前登录的用户信息
 */
router.get('/usercenter/userInfo', function (request, response, next) {
  let sessionid = request.session.token;
  let url = native + port.url.usercenter.userInfo;
  let params = { sessionid };
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      data.data.suid = request.session.suid;
    }
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 用户提现记录
 */
router.post('/usercenter/withdrawRecord', function (request, response, next) {
  let url = native + port.url.usercenter.withdrawRecord;
  let sessionid = request.session.token;
  let pageNum = request.body.pageNum || 1;
  let pageSize = request.body.pageSize || 10;
  let startTime = request.body.startTime || "";
  let endTime = request.body.endTime || "";
  let params = {
    sessionid,
    pageNum,
    pageSize,
    startTime,
    endTime
  }
  console.log("用户提现记录参数：" + JSON.stringify(params));
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 收入列表
 */
router.post('/usercenter/incomeRecord', function (request, response, next) {
  let url = native + port.url.usercenter.incomeRecord
  let sessionid = request.session.token;
  let startTime = request.body.startTime || "";
  let endTime = request.body.endTime || "";
  let params = {
    sessionid,
    startTime,
    endTime
  }
  console.log("用户收入列表参数：" + JSON.stringify(params));
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 我的收入
 */
router.get('/usercenter/income', function (request, response, next) {
  let url = native + port.url.usercenter.income
  let sessionid = request.session.token;
  let params = { sessionid }
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 我的收入详情
 */
router.get('/usercenter/profitInfo', function (request, response, next) {
  let url = native + port.url.usercenter.profitInfo
  let sessionid = request.session.token;
  let params = { sessionid };
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 提现信息查询
 */
router.get('/usercenter/withdrawInfo', function (request, response, next) {
  let url = native + port.url.usercenter.withdrawInfo
  let sessionid = request.session.token;
  let params = { sessionid };
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 提现银行卡查询
 */
router.get('/usercenter/bankList', function (request, response, next) {
  let url = native + port.url.usercenter.bankList
  let sessionid = request.session.token;
  let params = { sessionid };
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 提现
 */
router.post('/usercenter/withdraw', function (request, response, next) {
  let url = native + port.url.usercenter.withdraw
  let sessionid = request.session.token;
  let { money, bankCode, bankCardno, password } = request.body;
  let params = { sessionid, money, bankCode, bankCardno, password };
  console.log("用户提现参数：" + JSON.stringify(params));
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 修改登录密码
 */
router.post('/usercenter/changeLoginPwd', function (request, response, next) {
  let url = native + port.url.usercenter.changeLoginPwd;
  let sessionid = request.session.token;
  let { oldPwd, newPwd, confrimPwd } = request.body;

  let params = {
    sessionid,
    oldPwd,
    newPwd,
    confrimPwd
  }
  console.log("用户修改登录密码参数：" + JSON.stringify(params));
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      request.session.token = "";
    }
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 修改支付密码验证码
 */
router.get('/usercenter/payPwdSmscode', function (request, response, next) {
  let url = native + port.url.usercenter.payPwdSmscode
  let sessionid = request.session.token;
  let params = { sessionid };
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      console.log("手机号码：%s，修改支付密码验证码：%s", data.data.mobile, data.data.smscode);
      request.session.payMobile = data.data.mobile;
      request.session.paySmscode = data.data.smscode.toString();
      data.data = {};
    }
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 验证修改支付密码的验证码
 */
router.post('/userCenter/verChangePaySmscode', function (request, response, next) {
  let paySmscode = request.session.paySmscode;
  let payMobile = request.session.payMobile;
  let { smscode, mobile } = request.body;

  if (smscode !== paySmscode || mobile !== payMobile) {
    response.send({
      code: 201,
      msg: "验证码错误",
      data: {}
    })
  } else {
    response.send({
      code: 200,
      msg: "验证成功",
      data: {}
    })
  }
})

/**
 * 修改支付密码
 */
router.post('/userCenter/changePayPwd', function (request, response, next) {
  let url = native + port.url.usercenter.changePayPwd;
  let sessionid = request.session.token;
  let smscode = request.session.paySmscode;
  let { newPwd, confrimPwd } = request.body;
  let params = {
    smscode,
    sessionid,
    newPwd,
    confrimPwd
  }
  console.log("修改支付密码参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    if (data.code === 200) {
      request.session.payMobile = "";
      request.session.paySmscode = "";
    }
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 忘记支付密码
 */
router.post('/userCenter/forgetPayPassword', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.forgotPayPsaa
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    userName: userInfo.userName,
    userId: userInfo.id,
    newPassword: body.newPassword,
    validationCode: body.verCode
  }
  console.log("忘记支付密码参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 验证支付密码是否正确
 */
router.post('/userCenter/checkPayPssword', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.checkPayPwd
  let userInfo = common.sessionUserInfo(request)
  let params = {
    userId: userInfo.id,
    payPwd: request.body.payPassword
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 绑卡发送验证码
 */
router.post('/userCenter/bindCardSmsCode', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.bindCardSmsCode
  let body = request.body
  let userInfo = common.sessionUserInfo(request)
  let params = {
    phoneNum: userInfo.userName,
    realName: body.realName,
    certificateNo: body.certificateNo,
    bankName: body.bankName,
    cardNo: body.cardNo,
    phone: body.phone
  }
  console.log('绑定银行卡发短信参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 绑卡确认
 */
router.post('/userCenter/bindCardSubmit', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.bindBankCardSubmit
  let body = request.body
  let userInfo = common.sessionUserInfo(request)
  let params = {
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
  console.log("绑卡确认参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 换卡发送短信验证码
 */
router.post('/userCenter/changeCardSmsCode', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.changeBankCardSmsCode
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    userId: userInfo.id,
    newBankName: body.bankName,
    newCardNo: body.cardNo,
    newPhone: body.phone
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 换卡提交
 */
router.post('/userCenter/changeCardSubmit', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.changeBankCardSubmit
  let body = request.body
  let userInfo = common.sessionUserInfo(request)
  let params = {
    userId: userInfo.id,
    newBankName: body.bankName,
    newCardNo: body.cardNo,
    newPhone: body.phone,
    cardOrderId: body.cardOrderId,
    smsCode: body.smsCode
  }
  console.log("换卡确认参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 获取用户扩展信息
 */
router.get('/userCenter/userExtData', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.userExtData
  let userInfo = common.sessionUserInfo(request)
  if (!userInfo) {
    common.notLoginData(response)
    return
  }
  let userId = userInfo.id
  let params = {
    userId: userId
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    if (resData.data.tradePassword) {
      resData.data.tradePassword = Math.random().toString(36).substr(2)
    }
    if (resData.data.headPortrait) {
      let fileToken = resData.data.headPortrait
      let url1 = native.system.file + port.url.filetool.download
      $ajax.post(url1, { fileToken: fileToken }).then(function (res) {
        let fileUrl = common.parseResponseData(res, '0')
        resData.data.headPortrait = fileUrl.data.fileToken
        response.send(resData)
      }).catch(function (err) {
        resData.data.headPortrait = null;
        response.send(resData)
      })
    } else {
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
router.post('/userCenter/rechargeSmsCode', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.rechargeSmsCode
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 充值提交
 */
router.post('/userCenter/rechargeSubmit', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.rechargeSubmit
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount,
    payNo: body.payNo,
    smsCode: body.smsCode,
    payPwd: body.payPwd
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 提现发送短信验证码
 */
router.post('/userCenter/withdrawSmsCode', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.withdrawSmsCode
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    phoneNum: userInfo.userName,
    orderAmount: body.orderAmount
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 提现提交
 */
router.post('/userCenter/withdrawSubmit', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.withdrawSubmit
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    userId: userInfo.id,
    orderAmount: body.orderAmount,
    payNo: body.payNo,
    smsCode: body.smsCode,
    payPwd: body.payPwd
  }
  console.log("提现提交参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    console.log("提现返回参数：" + JSON.stringify(res.data))
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 *  交易流水查询
 */
router.get('/userCenter/tradingFlow', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.tradingFlow
  let userInfo = common.sessionUserInfo(request)
  let params = {
    userId: userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 获取风险测评题目
 */
router.get('/userCenter/riskQuestions', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.questionList
  $ajax.post(url, {}).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    if (resData.code === 200) {
      let quesData = JSON.parse(resData.data).qamsQue
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
router.post('/userCenter/riskAnswerSubmit', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.answerSubmit
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    userId: userInfo.id,
    phoneNum: userInfo.userName,
    type: 'platform',
    data: JSON.stringify(body)
  }
  console.log("风险测评答案参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 投资发送短信验证码
 */
router.post('/userCenter/investSmsCode', function (request, response, next) {
  let apply_url = native.system.dataResource + port.url.dataresource.investApply
  let invest_sms_code_url = native.system.dataResource + port.url.dataresource.tjfaeSmsCode
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let apply_params = {
    phoneNum: userInfo.userName,
    productCode: body.productCode
  }
  let sms_params = {
    phoneNum: userInfo.userName,
    smsType: '3'
  }
  $ajax.post(apply_url, apply_params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    if (resData.code === 200) {
      $ajax.post(invest_sms_code_url, sms_params).then(function (res) {
        let resData = common.parseResponseData(res, '200')
        response.send(resData)
      }).catch(function (err) {
        console.log(err)
        response.send(common.parseErrorData(err))
      })
    } else {
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
router.post('/userCenter/investSubmit', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.investSubmit
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
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
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 投资结果查询
 */
router.post('/userCenter/investStatus', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.investStatus
  let params = {
    tradeOrderOid: request.body.tradeOrderOid
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 充值结果查询
 */
router.post('/userCenter/rechargeStatus', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.rechargeStatus
  let params = {
    bankOrderOid: request.body.bankOrderOid
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 我的邀请
 */
router.get('/userCenter/myInvite', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.myInvite
  let userInfo = common.sessionUserInfo(request)
  let params = {
    userId: userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 设置用户分类code
 */
router.post('/userCenter/setStaffCode', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.setStaffCode
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let params = {
    userId: userInfo.id,
    staffCode: body.staffCode
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 我的优惠券（包含红包、抵扣券）
 */
router.post('/userCenter/myCoupons', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.myCoupons
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let date = new Date();
  let year = body.year || date.getFullYear()
  let month = body.month || (date.getMonth() + 1)
  let createTimeBegin = year + '-' + month + '-01' + ' 00:00:00'
  let createTimeEnd = year + '-' + month + '-' + common.getEndDayByMonth(year, month) + ' 23:59:59'
  let params = {
    phoneList: userInfo.userName,
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 5,
    createTimeBegin: createTimeBegin,
    createTimeEnd: createTimeEnd
  }
  console.log('我的红包查询参数：' + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    if (resData.code === 200) {
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
router.post('/userCenter/useCoupons', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.useCoupons
  let userInfo = common.sessionUserInfo(request)
  let params = {
    phoneNum: userInfo.userName,
    couponId: request.body.couponId
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 设置昵称和头像
 */
router.post('/userCenter/setNickAndHead', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.setNickHead
  let body = request.body
  let userInfo = common.sessionUserInfo(request)
  let params = {
    userId: userInfo.id,
    nickName: body.nickName || '',
    headPortrait: body.headPortrait || ''
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})
/**
 * 查询用户消息
 */
router.post('/userCenter/myMessage', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.messageList
  let body = request.body
  let userInfo = common.sessionUserInfo(request)
  let params = {
    pageNum: body.pageNum || 1,
    pageSize: body.pageSize || 10,
    userName: userInfo.userName
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

router.get('/userCenter/message/:id', function (request, response, next) {
  let url = native.system.userCenter + port.url.user.messageById
  let body = request.params
  let params = {
    id: body.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '0')
    if (resData.code == 200) {
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
router.post('/userCenter/cashier/payPassword/:type', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.cashier.payPassword
  let userInfo = common.sessionUserInfo(request)
  let type = request.params.type
  let backUrl = request.body.backUrl || '_usercenter'
  let params = {
    phoneNum: userInfo.userName,
    type: type,
    backUrl: native.system.moneyNode + '/cashier/backUrl/' + backUrl + '/1/' + userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台充值
 */
router.post('/userCenter/cashier/recharge', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.cashier.recharge
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let backUrl = body.backUrl || '_usercenter'
  let params = {
    phoneNum: userInfo.userName,
    rechargeAmount: body.orderAmount,
    backUrl: native.system.moneyNode + '/cashier/backUrl/' + backUrl + '/2/' + userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台提现
 */
router.post('/userCenter/cashier/withdraw', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.cashier.withdraw
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let backUrl = body.backUrl || '_usercenter'
  let params = {
    phoneNum: userInfo.userName,
    orderAmount: body.orderAmount,
    backUrl: native.system.moneyNode + '/cashier/backUrl/' + backUrl + '/3/' + userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

/**
 * 收银台投资
 */
router.post('/userCenter/cashier/invest', function (request, response, next) {
  let url = native.system.dataResource + port.url.dataresource.cashier.invest
  let userInfo = common.sessionUserInfo(request)
  let body = request.body
  let backUrl = body.backUrl || '_usercenter'
  let params = {
    phoneNum: userInfo.userName,
    productCode: body.productCode,
    investAmount: body.investAmount,
    payAmouont: body.investAmount,
    backUrl: native.system.moneyNode + '/cashier/backUrl/' + backUrl + '/4/' + userInfo.id
  }
  $ajax.post(url, params).then(function (res) {
    let resData = common.parseResponseData(res, '200')
    response.send(resData)
  }).catch(function (err) {
    console.log(err)
    response.send(common.parseErrorData(err))
  })
})

module.exports = router
