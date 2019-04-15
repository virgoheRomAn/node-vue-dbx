import axios from '@/request/config'
import store from '@/vuex/index'
import jBox from 'assets/plugins/jBox'

import CONST from 'assets/js/const';
import __G__ from 'assets/js/information'

export default {

  /**
   * 获取产品列表
   * @param {String} pageNum 页号
   * @param {String} pageSize 每页显示条数
   * @param {String} type 是否开启加载loading
   * @param {String} url 请求路径
   */
  getProductList: ({ pageNum, pageSize, type = true }, url = `/product/dataList`) => {
    type && jBox.loading("获取中...", { boxID: "loadingID" })
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