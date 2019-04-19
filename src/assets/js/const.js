//银行
const BANK = [
  { code: "1", text: "中国建设银行" },
  { code: "2", text: "中国农业银行" },
  { code: "3", text: "中国工商银行" },
  { code: "4", text: "中国银行" },
  { code: "5", text: "中国招商银行" },
  { code: "6", text: "中国交通银行" }
];

//关系
const CONTACT = [
  { code: "1", text: "朋友" },
  { code: "2", text: "亲人" },
  { code: "3", text: "同事" }
];

//婚姻
const MERRY = [
  { code: "1", text: "已婚" },
  { code: "2", text: "未婚" },
  { code: "3", text: "离婚" }
];

//学历
const EDU = [
  { code: "1", text: "初中或以下" },
  { code: "2", text: "高中" },
  { code: "3", text: "中专" },
  { code: "4", text: "大专" },
  { code: "5", text: "大学本科" },
  { code: "6", text: "硕士研究生或以上" }
];

//性别
const SEX = [
  { code: "0", text: "男" },
  { code: "1", text: "女" }
];

//借款期数
const PERIODS = [
  { code: "1", text: "3个月" },
  { code: "2", text: "6个月" },
  { code: "3", text: "12个月" },
  { code: "4", text: "24个月" },
  { code: "5", text: "36个月" }
];

//借款用途
const PURPOSE = [
  { code: "1", text: "旅游" },
  { code: "2", text: "装修" },
  { code: "3", text: "买车" }
];

//放款机构
const ORG = [
  { code: "1", text: "通融+家" }
];

//还款方式
const REPAYMODE = [
  { code: "1", text: "每月等额" },
  { code: "2", text: "等本等息" }
];

//订单状态
const ORDERSTATUS = [
  { code: "1", text: "申请中" },
  { code: "2", text: "审批中" },
  { code: "3", text: "放款中" },
  { code: "4", text: "还款中" },
  { code: "5", text: "审批拒绝" }
];

//还款状态
const REPAYSTATUS = [
  { code: "1", text: "已结清" },
  { code: "2", text: "提前还款" }
];

//房产-房屋用途
const HOUSEPURPOSE = [
  { code: "1", text: "自住" },
  { code: "2", text: "出租" },
  { code: "3", text: "空置" }
];

//房产-有无电梯
const HOUSELIFT = [
  { code: "1", text: "无" },
  { code: "2", text: "有" }
];

export default {
  BANK,
  CONTACT,
  MERRY,
  EDU,
  SEX,
  PERIODS,
  PURPOSE,
  ORG,
  REPAYMODE,
  ORDERSTATUS,
  REPAYSTATUS,
  HOUSEPURPOSE,
  HOUSELIFT,
  USERINFO: "userInfo",
  USERASSETS: "userAssets",
  IDCARDINFO: "idCardInfo",
  BANKCARDINFO: "bankCardInfo",
  FACEBIZID: "bizId",
  DATE: new Date()
}