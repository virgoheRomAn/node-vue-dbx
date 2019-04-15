const URL = {
  user: {
    login: "/tjfaeUser/userAuth",
    loginByCode: "/tjfaeUser/userSMSAuth",
    register: "/tjfaeUser/userRegist",
    findUser: "/user/findLogin",
    sendSmsCode: "/tjfaeUser/sendVerificationCode",
    forgotPass: "/tjfaeUser/updatePassword",
    getBanks: "/tjfaeBankInfo/findBankCard",
    updatePass: "/tjfaeUser/updatePassword",
    userExtData: "/tjfaeUser/findUser",
    setPayPass: "/tjfaeUser/setChangePassword",
    userLoginInfo: "/user/findUser",
    bindBankCardSubmit: "/tjfaeUser/saveCustomerInfo",
    checkPayPwd: "/tjfaeUser/checkPayPwd",
    tradingFlow: "/tjfaeCashflow/findWithdrawalTopUp",
    withdrawSubmit: "/tjfaeUser/withdrawal",
    answerSubmit: "/tjfaeUser/preservationRiskAssessment",
    forgotPayPsaa: "/tjfaeUser/forgetPayPwd",
    changeBankCardSmsCode: "/tjfaeUser/applyCar",
    changeBankCardSubmit: "/tjfaeUser/changeCustomerInfo",
    myInvite: "/tjfaeUser/inviteList",
    inviteRegister: "/tjfaeUser/invitationRegist",
    classificationQuery: "/tjfaeUser/classf/getByParentCode",
    setStaffCode: "/tjfaeUser/changeStaffCode",
    setNickHead: "/tjfaeUser/changeAvatarsAndNicknames",
    bannerList: "/tjfaeBanner/findBanner",
    noticeList: "/tjfaeAnnouncement/findAnnouncement",
    messageList: "/tjfaeMessage/findbasicMessageAll",
    noticeById: "/tjfaeAnnouncement/findIdAnnouncement",
    messageById: "/tjfaeMessage/findIdBasicMessage",
    updatePayPassword: "/tjfaeUser/updatePayPassword"
  },
  dataresource: {
    list: "/tjfaeMode4/tjfaeProductList",
    details: "/tjfaeMode4/tjfaeGetProductInfo",
    transRecord: "/tjfaeMode4/tjfaeAssetinfo",
    cashFlow: "/tjfaeMode4/tjfaeCashflow",
    userAccount: "/tjfaeMode4/tjfaeUserInfo",
    bindCardSmsCode: "/tjfaeMode4/tjfaeReadyForBind",
    rechargeSmsCode: "/tjfaeMode4/tjfaeDapply",
    rechargeSubmit: "/tjfaeMode4/tjfaeDeposit",
    rechargeStatus: "/tjfaeMode4/tjfaeDepositIsdone",
    withdrawSmsCode: "/tjfaeMode4/tjfaeWapply",
    questionList: "/tjfaeMode4/tjfaeQamsQueTypeResult",
    investApply: "/tjfaeMode4/tjfaeGotoInvest",
    tjfaeSmsCode: "/tjfaeMode4/tjfaeSendvc",
    investSubmit: "/tjfaeMode4/tjfaeInvest",
    investStatus: "/tjfaeMode4/tjfaeFindInvestStatus",
    myCoupons: "/tjfaeMode4/tjfaeGetCoupons",
    useCoupons: "/tjfaeMode4/tjfaeUseRedPacket",
    cashier: {
      payPassword: "/tjfaeMode4/tjfaePayPwdManage",
      recharge: "/tjfaeMode4/tjfaeCashierDeskForDeposit",
      withdraw: "/tjfaeMode4/tjfaeCashierDeskForWithdraw",
      invest: "/tjfaeMode4/tjfaeCashierDeskForInvest"
    }
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
