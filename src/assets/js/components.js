import Footer from 'components/Footer'
import PopupBox from 'components/PopupBox'
import VerCode from "components/VerCode";
import PayInput from "components/password/Input";
import KeyBoard from "components/password/Keyboard";
import MobileSelect from "components/MobileSelect";
import MoneyInput from "components/MoneyInput";
import DoneTemplate from "components/DoneTemplate";
import Scroll from "components/Scroll";
import BankCard from "components/BankCard";
import Picker from "components/Picker";
import ProductItem from "components/ProductItem";
import PersonAssets from "components/PersonAssets";
import Calendar from "components/calendar/Calendar.vue";
import { VueCropper } from 'vue-cropper';

export default {
  install(Vue) {
    Vue.component('fb-footer', Footer);
    Vue.component('popup-box', PopupBox);
    Vue.component('ver-code', VerCode);
    Vue.component('pay-input', PayInput);
    Vue.component('key-board', KeyBoard);
    Vue.component('mobile-select', MobileSelect);
    Vue.component('money-input', MoneyInput);
    Vue.component('done-template', DoneTemplate);
    Vue.component('scroll-item', Scroll);
    Vue.component('bank-card', BankCard);
    Vue.component('picker', Picker);
    Vue.component('product-item', ProductItem);
    Vue.component('vue-cropper', VueCropper);
    Vue.component('calendar-item', Calendar);
    Vue.component('person-assets', PersonAssets);
  }
}
