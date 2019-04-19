const banner = [
  { path: require("../../assets/img/tjs-banner1.png"), url: "http://www.baidu.com" },
  { path: require("../../assets/img/tjs-banner2.png"), url: "http://www.qq.com" },
  { path: require("../../assets/img/tjs-banner3.jpg"), url: "https://element.eleme.cn" }
]

const notice = [
  { title:"神奇法国：每年花2万亿养公务员，却修不起一座巴黎圣母院！", url: "https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9355124393427998121%22%7D&n_type=0&p_from=1" },
  { title: "官宣！第二届“一带一路国际合作高峰论坛”4月25日至4月27日在京举行", url: "https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9145824645500514327%22%7D&n_type=0&p_from=1" },
  { title: "普京表示看到巴黎圣母院大火自己悲伤到热泪盈眶", url: "https://m.gmw.cn/baijia/2019-04/19/1300311629.html" }
]

export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {
    /**
     * banner列表
     */
    mock.onGet(`/basic/banner`).reply(config => {
      let { pageNum, pageSize } = config;

      return new Promise((resolve, reject) => {
        let res = []
        let startIndex = (pageNum - 1) * pageSize
        if (banner.length > startIndex) {
          let endIndex = startIndex + pageSize
          res = banner.slice(startIndex, endIndex)
        }
        resolve([200, { code: 200, message: '成功', data: res }])
      })
    }),

      /**
       * 公告列表
       */
      mock.onGet(`/basic/getNotice`).reply(config => {
        let { pageNum, pageSize } = config;

        return new Promise((resolve, reject) => {
          let res = []
          let startIndex = (pageNum - 1) * pageSize
          if (notice.length > startIndex) {
            let endIndex = startIndex + pageSize
            res = notice.slice(startIndex, endIndex)
          }
          resolve([200, { code: 200, message: '成功', data: res }])
        })
      })
  }
}
