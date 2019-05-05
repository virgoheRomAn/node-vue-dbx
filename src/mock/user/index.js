const userInfo = {
  username: "徐继强",
  mobile: "13628332957",
  portrait: require("../../assets/img/user/head.jpg"),
  approve: 1,
  balance: 2000,
  amout: 50000,
  email: "872180521@qq.com",
  provinceId: "500000",
  provinceName: "重庆市",
  cityId: "500100",
  cityName: "市辖区",
  areaId: "500112",
  areaName: "渝北区"
};

const capitalRecord = [
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 },
  { type: "0", time: "2019-04-22", info: "至尾号5626招商银行卡", amount: 100 }
];

const incomeRecord = [
  { source: "0", source_text: "推广出单", number: "0", insurance_amount: "50", generalize_amount: "100" },
  { source: "0", source_text: "合伙人出单", number: "1", insurance_amount: "50", generalize_amount: "100" }
];


export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {
    /**
     * 获取个人信息
     */
    mock.onGet(`/usercenter/userInfo`).reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, { code: 200, message: '成功', data: userInfo }])
      });
    }),

      /**
       * 提现列表
       */
      mock.onGet(`/usercenter/capital`).reply(config => {
        let { pageNum, pageSize } = config;

        return new Promise((resolve, reject) => {
          let res = []
          let startIndex = (pageNum - 1) * pageSize
          if (capitalRecord.length > startIndex) {
            let endIndex = startIndex + pageSize
            res = capitalRecord.slice(startIndex, endIndex)
          }
          resolve([200, { code: 200, message: '成功', data: res }])
        })
      }),

      /**
       * 收入列表
       */
      mock.onGet(`/usercenter/income`).reply(config => {
        let { pageNum, pageSize } = config;

        return new Promise((resolve, reject) => {
          let res = []
          let startIndex = (pageNum - 1) * pageSize
          if (incomeRecord.length > startIndex) {
            let endIndex = startIndex + pageSize
            res = incomeRecord.slice(startIndex, endIndex)
          }
          resolve([200, { code: 200, message: '成功', data: res }])
        })
      })
  }
}
