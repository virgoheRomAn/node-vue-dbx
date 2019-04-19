import axios from 'axios'
import jBox from '@/assets/plugins/jBox'

const handleData = (data, resolve, reject) => {
  if (data.code === 200) {
    resolve(data.data);
  } else {
    jBox.error(data.message, {
      closeCallback: () => {
        setTimeout(() => {
          reject(data);
        }, 2000);
      }
    });
  }
};

export default {
  /**
   * 通用get
   * @param {Boolean} type 是否显示loading动画
   */
  get: ({ url, params, type = true, text = "加载中..." } = {}) => {
    return new Promise((resolve, reject) => {
      let loading;
      if (type) {
        loading = jBox.loading(text);
      }

      axios.get(url, params).then((res) => {
        let data = res.data;
        if (type) {
          jBox.closeById(loading, () => {
            handleData(data, resolve, reject);
          });
        } else {
          handleData(data, resolve, reject);
        }
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  },

  /**
   * 通用post
   * @param {Boolean} type 是否显示loading动画
   */
  post: ({ url, params, config, type = true, text = "加载中..." } = {}) => {
    let loading;
    if (type) {
      loading = jBox.loading(text);
    }
    return new Promise((resolve, reject) => {
      axios.post(url, params, config).then((res) => {
        let data = res.data;
        if (type) {
          jBox.closeById(loading, () => {
            handleData(data, resolve, reject);
          })
        } else {
          handleData(data, resolve, reject);
        }
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    });
  }
}