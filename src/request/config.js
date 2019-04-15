import jBox from 'assets/plugins/jBox';
import vue from '@/index';
import { ajax_host } from './native';

const axios = require("axios");
const Qs = require("qs");

const baseURL = ajax_host;

const instance = axios.create({
  baseURL: baseURL,
  timeout: 100000,
  headers: {}
});

//添加请求拦截器
instance.interceptors.request.use(function (config) {
  config.headers['accessToken'] = localStorage.getItem('accessToken') || undefined;
  //config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

  config.params = config.params || {};
  //config.data = Qs.stringify(config.data);

  return config;
}, function (error) {
  console.log(error);

  return Promise.reject(error);
});

//添加响应拦截器
instance.interceptors.response.use(function (response) {
  let data = response.data;
  //令牌失效，请重新获取令牌
  if (data.errorCode === 'E0004' && response.config.url.indexOf('refreshToken.json') == -1) {
    return instance.refreshToken().then(() => {
      response.config.headers['accessToken'] = localStorage.getItem('accessToken') || undefined;
      return instance(response.config);
    });
  }

  if (response.data.code === 401) {
    jBox.close(".jBox-container", null, () => {
      vue.$router.push({ name: "401" })
    })
  }
  if (response.data.code === 404) {
    jBox.close(".jBox-container", null, () => {
      vue.$router.push({ name: "404" })
    })
  }
  if (response.data.code === 502) {
    jBox.close(".jBox-container", null, () => {
      vue.$router.push({ name: "502" })
    })
  }

  return response;
}, function (error) {
  console.log(error);
  jBox.close("", null, () => {
    jBox.error("获取超时")
  })
  return Promise.reject(error);
});

export default instance;
