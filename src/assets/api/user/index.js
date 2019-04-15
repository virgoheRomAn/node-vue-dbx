import axios from '@/request/config'
import store from '@/vuex/index'
import jBox from 'assets/plugins/jBox'

import CONST from 'assets/js/const';
import __G__ from 'assets/js/information'


/**
 * 设置用户登录信息
 * @param {*} userId 
 * @param {*} userName 
 * @param {*} userToken 
 */
const setUserInfo = ({ userId, userName, userToken }) => {
  return new Promise((resolve, reject) => {
    let userInfo = {
      userToken: userToken,
      userId: userId,
      userName: userName
    };

    __G__.set({ [CONST.USERINFO]: JSON.stringify(userInfo) })

    store.dispatch("userLogin", { token: userToken, userId, userName })
    resolve(userInfo)
  });
};

/**
 * 获取用户登录信息
 */
const getUserLoginInfo = () => {
  return new Promise((resolve, reject) => {
    let userLoginInfo = __G__.get({ "userLoginInfo": [CONST.USERINFO] });
    let data = JSON.parse(userLoginInfo);
    store.dispatch("userLogin", { token: data.userToken, userId: data.userId, userName: data.userName })
    resolve(userLoginInfo)
  });
};

export default {
  /**
   * 通用get
   * @param {Boolean} type 是否显示loading动画
   */
  get: (url, type = true) => {
    return new Promise((resolve, reject) => {
      let loading;
      if (type) {
        loading = jBox.loading("获取中...");
      }

      axios.get(url).then((res) => {
        let data = res.data;
        jBox.close(loading, null, () => {
          if (type) {
            if (data.code !== 200) {
              jBox.error(data.message);
              reject(data)
            } else {
              resolve(data.data);
            }
          } else {
            if (data.code !== 200) {
              reject(data)
            } else {
              resolve(data.data);
            }
          }
        })
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  },

  /**
   * 通用post
   * @param {Boolean} type 是否显示loading动画
   */
  post: (url, params, type = true) => {
    let loading;
    if (type) {
      loading = jBox.loading("处理中...");
    }
    return new Promise((resolve, reject) => {
      axios.post(url, params).then((res) => {
        let data = res.data;
        if (type) {
          jBox.close(loading, null, () => {
            if (data.code !== 200) {
              jBox.error(data.message);
              reject(data)
            } else {
              resolve(data);
            }
          })
        } else {
          if (data.code !== 200) {
            reject(data)
          } else {
            resolve(data.data)
          }
        }
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  },

  /**
   * 通用请求分页分页接口
   * @param {String} pageNum 页号
   * @param {String} pageSize 每页显示条数
   * @param {String} type 是否开启loading
   * @param {String} url 请求URL
   */
  getAjaxDataList: ({ pageNum, pageSize, type = true }, url) => {
    let loading;
    if (type) {
      loading = jBox.loading("查询中...", { boxID: "loadingID" })
    }
    return new Promise((resolve, reject) => {
      axios.post(url, {
        pageNum, pageSize
      }).then(res => {
        let data = res.data;
        if (type) {
          jBox.close(loading, null, () => {
            if (data.code !== 200) {
              jBox.error(data.message)
              reject(data)
            } else {
              resolve(data.data)
            }
          })
        } else {
          if (data.code !== 200) {
            reject(data)
          } else {
            resolve(data.data)
          }
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },


  /**
   * 设置用户登录信息
   * @param {*} userId 
   * @param {*} userName 
   * @param {*} userToken 
   */
  setUserInfo: ({ userId, userName, userToken }) => {
    setUserInfo({ userId, userName, userToken })
  },

  /**
   * 获取用户登录信息
   */
  getUserLoginInfo: () => {
    getUserLoginInfo()
  },

  /**
   * 获取用户登陆状态
   * @returns {Boolean}
   */
  getUserLoginStaus: () => {
    // jBox.loading("跳转中...", { boxID: "jumpLoadingID" })
    return new Promise((resolve, reject) => {
      axios.get("/user/loginStatus").then((res) => {
        let status = res.data.loginStatus;
        // jBox.close("#jumpLoadingID", null, () => {
        resolve(status);
        // })
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  },

  /**
   * 用户密码登录
   * @param {String} mobile 用户手机
   * @param {String} password 用户密码
   * @param {String} url 请求路径
   */
  userPasswordLogin: ({ mobile, password }, url = `/user/login`) => {
    jBox.loading("登陆中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile,
        password
      }).then(res => {
        let data = res.data;
        if (data.code !== 200) {
          jBox.close("#loadingID", null, () => {
            jBox.error("用户名或密码错误")
          })
        } else {
          jBox.close("#loadingID", null, () => {
            jBox.success("登陆成功", {
              closeFun: () => {
                let userInfo = {
                  userId: data.data.userId,
                  userName: data.data.userName,
                  userToken: data.data.token
                }
                setUserInfo(userInfo)
                resolve(data)
              }
            })
          })
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 用户验证码登录
   * @param {String} mobile 用户手机
   * @param {String} verCode 手机验证码
   * @param {String} url 请求路径
   */
  userCodeLogin: ({ mobile, verCode }, url = `/user/codeLogin`) => {
    jBox.loading("登陆中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile,
        verCode
      }).then(res => {
        let data = res.data;
        if (data.code !== 200) {
          jBox.close("#loadingID", null, () => {
            jBox.error(data.message)
          })
        } else {
          jBox.close("#loadingID", null, () => {
            jBox.success("登陆成功", {
              closeFun: () => {
                let userInfo = {
                  userId: data.data.userId,
                  userName: data.data.userName,
                  userToken: data.data.token
                }
                setUserInfo(userInfo)
                resolve(data)
              }
            })
          })
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 用户退出登陆
   * @param {String} url 
   */
  userLogout: (url = `/user/logout`) => {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        let data = res.data;
        resolve(data);
        __G__.remove([CONST.USERINFO]);
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 获取手机验证码
   * @param {String} mobile 手机号 
   * @param {String} url  
   */
  getSmsCode: ({ mobile }, url = `/user/sendSmsCode`) => {
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile
      }).then(res => {
        let data = res.data;
        resolve(data)
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 用户注册
   * @param {String} mobile 手机号
   * @param {String} password 密码
   * @param {String} again 确认密码
   * @param {String} verCode 验证码
   */
  userRegister: ({ mobile, password, again, verCode }, url = `/user/register`) => {
    jBox.loading("注册中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile,
        password,
        again,
        verCode
      }).then(res => {
        let data = res.data;
        if (data.code !== 200) {
          jBox.close("#loadingID", null, () => {
            jBox.error(data.message);
          })
        } else {
          jBox.close("#loadingID", null, () => {
            resolve(data)
          })
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 忘记登陆密码
   * @param {String} mobile 手机号
   * @param {String} password 密码
   * @param {String} again 确认密码
   * @param {String} verCode 验证码
   */
  forgotPassword: ({ mobile, password, again, verCode }, url = `/user/forgotPassword`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile,
        password,
        again,
        verCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
          } else {
            jBox.success("修改成功", {
              closeFun: () => {
                resolve(data)
              }
            });
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 修改登录密码
   * @param {String} oldPassword 原密码
   * @param {String} newPassword 新密码
   * @param {String} again 确认密码
   */
  changePassword: ({ oldPassword, newPassword, again }, url = `/userCenter/updatePass`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        oldPassword,
        newPassword,
        again
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
          } else {
            jBox.success("修改成功", {
              closeFun: () => {
                resolve(data)
              }
            });
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 绑卡发送短信验证码（下单）
   * @param {String} realName 真实姓名
   * @param {String} certificateNo 身份证号
   * @param {String} bankName 银行名称
   * @param {String} cardNo 银行卡号
   * @param {String} phone 银行卡预留手机号
   */
  getBindCardSmsCode: ({ realName, certificateNo, bankName, cardNo, phone }, url = `/userCenter/bindCardSmsCode`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        realName, certificateNo, bankName, cardNo, phone
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 绑卡提交
   * @param {String} realName 真实姓名
   * @param {String} certificateNo 身份证号
   * @param {String} bankName 银行名称
   * @param {String} cardNo 银行卡号
   * @param {String} phone 银行卡预留手机号
   * @param {String} cardOrderId 绑卡订单号
   * @param {String} smsCode 手机验证码
   */
  bindCardSubmit: ({ realName, certificateNo, bankName, cardNo, phone, cardOrderId, smsCode }, url = `/userCenter/bindCardSubmit`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        realName, certificateNo, bankName, cardNo, phone, cardOrderId, smsCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 设置支付密码
   * @param {String} oldPassword 原密码（设置 为空）
   * @param {String} newPassword 新密码
   */
  setPayPassword: ({ oldPassword = "", newPassword }, url = `/userCenter/setPayPassword`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        newPassword, oldPassword
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
  * 忘记支付密码
  * @param {String} newPassword 新支付密码
  * @param {String} verCode 验证码
  */
  forgetPayPassword: ({ newPassword, verCode }, url = `/userCenter/forgetPayPassword`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        newPassword, verCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 验证手机验证码是否正确
   * @param {String} mobile 手机号
   * @param {String} verCode 验证码
   */
  checkSmsCode: ({ mobile, verCode }, url = `/user/checkSmsCode`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        mobile, verCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 验证支付密码正确性
   * @param {String} payPassword 支付密码
   */
  checkPayPssword: ({ payPassword }, url = `/userCenter/checkPayPssword`) => {
    jBox.loading("处理中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        payPassword
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 充值发送短信验证码
   * @param {String} orderAmount 充值金额
   */
  rechargeSmsCode: ({ orderAmount }, url = `/userCenter/rechargeSmsCode`) => {
    jBox.loading("正在发送短信验证码", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        orderAmount
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 充值提交
   * @param {String} orderAmount 充值金额
   * @param {String} payNo 充值订单号
   * @param {String} smsCode 短信验证码
   * @param {String} payPwd 支付密码
   */
  rechargeSubmit: ({ orderAmount, payNo, smsCode, payPwd }, url = `/userCenter/rechargeSubmit`) => {
    jBox.loading("充值中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        orderAmount, payNo, smsCode, payPwd
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 提现发送短信验证码
   * @param {String} orderAmount 提现金额
   */
  withdrawSmsCode: ({ orderAmount }, url = `/userCenter/withdrawSmsCode`) => {
    jBox.loading("正在发送短信验证码", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        orderAmount
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 提现提交
   * @param {String} orderAmount 提现金额
   * @param {String} payNo 提现订单号
   * @param {String} smsCode 短信验证码
   * @param {String} payPwd 支付密码
   */
  withdrawSubmit: ({ orderAmount, payNo, smsCode, payPwd }, url = `/userCenter/withdrawSubmit`) => {
    jBox.loading("提现中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        orderAmount, payNo, smsCode, payPwd
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 投资发送短信验证码
   * @param {String} productCode 产品code
   */
  investSmsCode: ({ productCode }, url = `/userCenter/investSmsCode`) => {
    jBox.loading("正在发送短信验证码", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        productCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 投资提交
   * @param {String} investAmount 投资金额
   * @param {String} productCode 产品code
   * @param {String} payPwd 支付密码
   * @param {String} smsCode 短信验证码
   * @param {String} orderId 订单ID
   * @param {String} couponId 优惠券ID
   */
  investSubmit: ({ investAmount, productCode, payPwd, smsCode, orderId, couponId }, url = `/userCenter/investSubmit`) => {
    jBox.loading("提交中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        investAmount, productCode, payPwd, smsCode, orderId, couponId
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code === "1326") {
            jBox.error("投资金额不能有小数");
            reject(data)
            return false;
          }
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 风险问卷答案提交
   * @param {String} sid 问卷ID
   * @param {String} questions 问题的答案数组
   */
  riskAnswerSubmit: ({ sid, questions }, url = `/userCenter/riskAnswerSubmit`) => {
    jBox.loading("提交中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        sid, questions
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
  * 换卡发送短信验证码
  * @param {String} bankName 新银行名称
  * @param {String} cardNo 新银行卡号
  * @param {String} phone 新卡银行卡预留手机号
  */
  changeCardSmsCode: ({ bankName, cardNo, phone }, url = `/userCenter/changeCardSmsCode`) => {
    jBox.loading("正在发送短信验证码", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        bankName, cardNo, phone
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 换卡提交
   * @param {String} bankName 新银行名称
   * @param {String} cardNo 新银行卡号
   * @param {String} phone 新银行卡预留手机号
   * @param {String} cardOrderId 绑卡订单号
   * @param {String} smsCode 手机验证码
   */
  changeCardSubmit: ({ bankName, cardNo, phone, cardOrderId, smsCode }, url = `/userCenter/changeCardSubmit`) => {
    jBox.loading("提交中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        bankName, cardNo, phone, cardOrderId, smsCode
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 充值结果查询
   * @param {String} bankOrderOid 银行订单号
   */
  rechargeStatus: ({ bankOrderOid }, url = `/userCenter/rechargeStatus`) => {
    jBox.loading("查询中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        bankOrderOid
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          if (data.code !== 200) {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 投资结果查询
   * @param {String} tradeOrderOid 投资订单号
   */
  investStatus: ({ tradeOrderOid }, url = `/userCenter/investStatus`) => {
    jBox.loading("查询中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        tradeOrderOid
      }).then(res => {
        let data = res.data;
        jBox.close("#loadingID", null, () => {
          //1334是订单处理中，暂时作为成功回调
          if (data.code !== 200 && data.code !== "1334") {
            jBox.error(data.message);
            reject(data)
          } else {
            resolve(data);
          }
        })
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 交易记录
   * @param {String} pageNum 页号
   * @param {String} pageSize 每页显示条数
   * @param {String} type 是否开启loading
   */
  transRecord: ({ pageNum, pageSize, type = true }, url = `/userCenter/transRecord`) => {
    type && jBox.loading("查询中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        pageNum, pageSize
      }).then(res => {
        let data = res.data;
        if (type) {
          jBox.close("#loadingID", null, () => {
            if (data.code !== 200) {
              jBox.error(data.message)
              reject(data)
            } else {
              resolve(data.data)
            }
          })
        } else {
          if (data.code !== 200) {
            jBox.error(data.message)
            reject(data)
          } else {
            resolve(data.data)
          }
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 资金管理
   * @param {String} pageNum 页号
   * @param {String} pageSize 每页显示条数
   * @param {String} type 是否开启loading
   */
  cashFlow: ({ pageNum, pageSize, type = true }, url = `/userCenter/cashFlow`) => {
    jBox.loading("查询中...", { boxID: "loadingID" })
    return new Promise((resolve, reject) => {
      axios.post(url, {
        pageNum, pageSize
      }).then(res => {
        let data = res.data;
        if (type) {
          jBox.close("#loadingID", null, () => {
            if (data.code !== 200) {
              jBox.error(data.message)
              reject(data)
            } else {
              resolve(data.data)
            }
          })
        } else {
          if (data.code !== 200) {
            jBox.error(data.message)
            reject(data)
          } else {
            resolve(data.data)
          }
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  }
}