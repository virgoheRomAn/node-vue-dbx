
import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import store from './vuex/index';
import App from './App';
import ElementUI from 'element-ui';
import VueClipboard from 'vue-clipboard2'
import axios from './request/config';
import jquery from 'jquery';
import swiper from 'swiper/js/swiper.js';
import Global from 'assets/js/global';
import Plugins from 'assets/js/components';
import jBox from 'assets/plugins/jBox';
import api from '@/api';
import __G__ from "assets/js/information";
import CONST from "assets/js/const";

import Mock from '@/mock';

//引入全局样式
import 'element-ui/lib/theme-chalk/index.css'
import 'swiper/css/swiper.min.css';
import './assets/less/base.less';
import './assets/less/user.less';

Vue.prototype.$ = jquery;
Vue.prototype.$ajax = axios;
Vue.prototype.$swiper = swiper;
Vue.prototype.$G = Global;
Vue.prototype.$jBox = jBox;
Vue.prototype.API = api.method;
Vue.prototype.USER = api.user;
Vue.prototype.__G__ = __G__;
Vue.prototype.CONST = CONST;

const isDebug_mode = process.env.NODE_ENV !== 'prod';

Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;

VueClipboard.config.autoSetContainer = true;
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(Plugins);
Vue.use(VueClipboard);


if (process.env.NODE_ENV === 'dev') {
  Vue.prototype.MOCK = api.mock;
  Mock.bootstrap()
}

var vue = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

export default vue;
