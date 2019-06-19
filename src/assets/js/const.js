//银行
const BANK = [
  { code: "1", text: "中国建设银行" },
  { code: "2", text: "中国农业银行" },
  { code: "3", text: "中国工商银行" },
  { code: "4", text: "中国银行" },
  { code: "5", text: "中国招商银行" },
  { code: "6", text: "中国交通银行" }
];

//订单状态
const ORDERSTATUS = [
  { code: 0, text: "待付款", cls: "unpaid" },
  { code: 1, text: "在保中", cls: "guarantee" },
  { code: 2, text: "在保中且待续保", cls: "guarantee" },
  { code: 3, text: "已过保", cls: "lost" }
];

//购买状态
const PAYSTATUS = [
  { code: "1", text: "下单成功" },
  { code: "2", text: "购买成功" }
];

export default {
  BANK,
  ORDERSTATUS,
  PAYSTATUS,
  USERINFO: "userInfo",
  USERASSETS: "userAssets",
  IDCARDINFO: "idCardInfo",
  BANKCARDINFO: "bankCardInfo",
  FACEBIZID: "bizId",
  DATE: new Date()
}