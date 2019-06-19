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


const orderList = [];
for (let i = 1; i < 5; i++) {
  orderList.push({ tab: i.toString(), list: [] });
  let n = i > 3 ? 4 : 11;
  let m = i === 1 ? "待支付" : (i === 2 ? "保障中" : (i === 3 ? "在保中且待续保" : (i === 4 ? "已过保" : "")))

  for (let j = 0; j < n; j++) {
    orderList[i - 1].list.push({
      id: `${i}${j}`,
      buy_time: "2019/6/14 11:03:05",
      product_id: `${i}${j}`,
      pol_order_id: Math.random().toString().split(".")[1],
      holder_name: `张三${i}${j}`,
      money: (Math.random() * 100).toFixed(2),
      status: "2",
      thumb_img: require("../../assets/img/p1.jpg"),
      name: `【${m}】保险名称文字`,
      file_url: "http://www.lcyun18.com:8080/order/downOrdersByOrder?orderIds=1932669",
      end_time: "2020/6/16 23:59:59",
      insured_amount: (Math.random() * 2).toFixed(2),
      beibaoren: "张三,李四,王五",
      tag: i - 1
    });
  }
}
// console.log(orderList);

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

    /**
     * 我的保单列表
     */
    mock.onGet(`/usercenter/order`).reply(config => {
      let { pageNum, pageSize, tab } = config;

      return new Promise((resolve, reject) => {
        let order = [];

        if (tab === "0") {
          orderList.map(item => {
            item.list.map(x => {
              order.push(x);
            })
          })
        } else {
          orderList.map(item => {
            if (item.tab === tab) {
              item.list.map(x => {
                order.push(x);
              })
            }
          })
        }

        console.log(order);

        let res = [];
        let startIndex = (pageNum - 1) * pageSize;
        if (order.length > startIndex) {
          let endIndex = startIndex + pageSize;
          console.log(startIndex, endIndex);
          res = order.slice(startIndex, endIndex);
        }

        resolve([200, { code: 200, message: '成功', data: res }]);
      })
    })
  }
}
