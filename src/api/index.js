import axios from '@/request/config';
import jBox from 'assets/plugins/jBox';
import router from '@/router';

import user from './user';
import mock from './mock';

const handleData = (data, resolve, reject) => {
  if (data.code === 200) {
    resolve(data.data);
  } else if (data.code === -998) {
    jBox.closeAll(() => {
      jBox.error("请先登录！", {
        closeCallback: () => {
          router.push("/login");
        }
      });
    })
  } else {
    jBox.error(data.msg, {
      closeCallback: () => {
        reject(data);
      }
    });
  }
};

const METHOD = {
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
  },

  /**
   * 通用请求分页分页接口
   * @param {String} pageNum 页号
   * @param {String} pageSize 每页显示条数
   * @param {String} type 是否开启loading
   * @param {String} url 请求URL
   */
  getAjaxPaging: ({ pageNum, pageSize, type = true }, url) => {
    let loading;
    if (type) {
      loading = jBox.loading("加载中...")
    }
    return new Promise((resolve, reject) => {
      axios.post(url, {
        pageNum, pageSize
      }).then(res => {
        let data = res.data;
        if (type) {
          jBox.closeById(loading, () => {
            handleData(data, resolve, reject);
          })
        } else {
          handleData(data, resolve, reject);
        }
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  }
}

export default {
  method: METHOD,
  user,
  mock
}