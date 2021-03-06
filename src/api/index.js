import axios from '@/request/config';
import jBox from 'assets/plugins/jBox';
import router from '@/router';

import user from './user';
import mock from './mock';

const handleData = (data, resolve, reject, err) => {
  if (data.code === 200) {
    resolve(data.data);
  } else if (data.code === -999) {
    if (err) {
      jBox.error(data.msg, {
        closeCallback: () => {
          router.push("/login");
        }
      });
    } else {
      router.push("/login");
    }

  } else {
    if (err) {
      jBox.error(data.msg, {
        closeCallback: () => {
          reject(data);
        }
      });
    } else {
      reject(data);
    }
  }
};

const METHOD = {
  /**
   * 通用get
   * @param {Boolean} type 是否显示loading动画
   * @param {Boolean} errorTips 是否提示错误信息（区分多个异步加载）
   */
  get: ({ url, params, type = true, text = "加载中...", errorTips = true } = {}) => {
    return new Promise((resolve, reject) => {
      let loading;
      if (type) {
        loading = jBox.loading(text);
      }

      axios.get(url, { params: params }).then((res) => {
        let data = res.data;
        if (type) {
          jBox.closeById(loading, () => {
            handleData(data, resolve, reject, errorTips);
          });
        } else {
          handleData(data, resolve, reject, errorTips);
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
   * @param {Boolean} errorTips 是否提示错误信息（区分多个异步加载）
   */
  post: ({ url, params, config, type = true, text = "加载中...", errorTips = true } = {}) => {
    let loading;
    if (type) {
      loading = jBox.loading(text);
    }
    return new Promise((resolve, reject) => {
      axios.post(url, params, config).then((res) => {
        let data = res.data;
        if (type) {
          jBox.closeById(loading, () => {
            handleData(data, resolve, reject, errorTips);
          })
        } else {
          handleData(data, resolve, reject, errorTips);
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
   * @param {Boolean} type 是否开启loading
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