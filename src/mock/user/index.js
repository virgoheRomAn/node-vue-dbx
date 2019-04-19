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
}


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
    })
  }
}
