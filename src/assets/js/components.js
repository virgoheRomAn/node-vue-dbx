import Footer from 'components/Footer'
import PopupBox from 'components/PopupBox'

export default {
  install(Vue) {
    Vue.component('fb-footer', Footer);
    Vue.component('popup-box', PopupBox);
  }
}
