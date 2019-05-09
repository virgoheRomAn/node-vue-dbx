const URL = {
  basic: {
    banner: "/front/api/user/banner",
    notice: "/front/api/user/notice",
    city: "/front/api/user/province_city"
  },
  user: {
    login: "/front/api/login",
    logout: "/front/api/logout",
    register: "/front/api/user/register",
    registerSmscode: "/front/api/user/smscode_register"
  },
  usercenter: {
    userInfo: "/front/api/user/user_info",
    withdrawRecord: "/front/api/user/withdraw_list",
    incomeRecord: "/front/api/user/user_profit_total",
    profitInfo: "/front/api/user/user_profit",
    changeLoginPwd: "/front/api/user/change_loginpassword",
    income: "/front/api/user/user_income",
    withdrawInfo: "/front/api/user/withdraw",
    bankList: "/front/api/user/bank_list",
    withdraw: "/front/api/user/save_withdraw",
    payPwdSmscode: "/front/api/user/smscode_tkpassword",
    changePayPwd: "/front/api/user/change_tkpassword"
  },
  product: {
    classes: "/front/api/user/product_classes",
    list: "/front/api/user/products"
  },
  filetool: {
    upload: "/file/upload",
    download: "/file/download"
  }
}

const BASE = {
  author: "virgoheRomAn",
  time: "2018/11/16"
}

module.exports = {
  url: URL
}
