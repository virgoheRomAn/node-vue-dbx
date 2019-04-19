import axios from '@/request/config'
import jBox from '@/assets/plugins/jBox'

export default {
  /**
   * 获取用户退出登陆
   * @returns {Boolean}
   */
  userLogout: () => {
    return new Promise((resolve, reject) => {
      axios.get(`/user/logout`).then(res => {
        let data = res.data;
        resolve(data);
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  /**
   * 获取用户登陆状态
   * @returns {Boolean}
   */
  getUserLoginStaus: () => {
    return new Promise((resolve, reject) => {
      axios.get("/user/status").then((res) => {
        let status = res.data.status;
        resolve(status);
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  }
}