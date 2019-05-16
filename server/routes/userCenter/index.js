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
 * 我的收入列表
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
 * 我的收入详情
 */
router.post('/usercenter/profitDetails', function (request, response, next) {
  let url = native + port.url.usercenter.incomeDetials
  let sessionid = request.session.token;
  let { type, startTime, endTime, pageSize, pageNum } = request.body;
  let params = { sessionid, type, startTime, endTime, pageSize, pageNum };

  console.log("我的收入详情：" + JSON.stringify(params));
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
router.post('/usercenter/verChangePaySmscode', function (request, response, next) {
  let url = native + port.url.usercenter.checkPayPwdSmscode;

  let paySmscode = request.session.paySmscode;
  let payMobile = request.session.payMobile;
  let sessionid = request.session.token;

  let { smscode, mobile } = request.body;
  let params = { sessionid, smscode, mobile, codetype: "2" };

  if (smscode !== paySmscode || mobile !== payMobile) {
    response.send({
      code: 201,
      msg: "验证码错误",
      data: {}
    })
  } else {
    $ajax.post(url, params).then(function (res) {
      let data = res.data;
      response.send(data)
    }).catch(function (err) {
      console.log(err)
    })
  }
})

/**
 * 修改支付密码
 */
router.post('/usercenter/changePayPwd', function (request, response, next) {
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
 * 设置支付密码
 */
router.post('/usercenter/setPayPwd', function (request, response, next) {
  let url = native + port.url.usercenter.changePayPwd;
  let sessionid = request.session.token;
  let { newPwd, confrimPwd } = request.body;
  let params = {
    sessionid,
    newPwd,
    confrimPwd
  }
  console.log("设置支付密码参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})

/**
 * 获取客户信息
 */
router.post('/usercenter/customer', function (request, response, next) {
  let url = native + port.url.usercenter.customerRecord;
  let sessionid = request.session.token;
  let { pageSize, pageNum } = request.body;
  let params = {
    pageSize,
    pageNum,
    sessionid
  }
  console.log("获取客户信息参数：" + JSON.stringify(params))
  $ajax.post(url, params).then(function (res) {
    let data = res.data;
    response.send(data)
  }).catch(function (err) {
    console.log(err)
  })
})


module.exports = router
