const URL = {
  basic: {
    banner: "/front/api/user/banner",
    notice: "/front/api/user/notice"
  },
  user: {
    login: "/front/api/login"
  },
  usercenter: {
    userInfo: "/front/api/user/user_info",
    withdraw: "/front/api/user/withdraw_list",
    income: "/front/api/user/user_profit_total",
    profit: "/front/api/user/user_profit",
    changeLoginPwd:"/front/api/user/change_loginpassword"
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
