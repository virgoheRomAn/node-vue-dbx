<template>
  <div class="buy-bar banks-bar">
    <div class="information-box mt-0">
      <div class="box-list-title">
        <h2 class="title mb-20">提现金额</h2>
        <div class="container">
          <money-input class="button" ref="moneyInput" :isClose="false">
            <label slot="info" class="tips">
              <span>可提现金额<em>{{balanceStr}}</em>元</span>
            </label>
            <a slot="button" class="button" @click="allWithdraw()">全部提现</a>
          </money-input>
        </div>

        <h2 class="title mt-40">银行信息</h2>
        <div class="box-list-arrow-content left pl-5 pr-5">
          <ul>
            <mobile-select ref="bankPicker" title="请选择银行" resultField="bankInfo" :pickerData="bankData"
              :initData="bankInfo" @select="selectResult">
              <template slot="text">
                <span>银行名称</span>
                <label @click="showPicker('bankPicker')" :class="{'disable':!bankInfo.text}">{{bankInfo.text ||
                  "请选择银行名称"}}</label>
              </template>
            </mobile-select>
            <li>
              <div class="content">
                <span>银行卡号</span>
                <el-input class="input" type="tel" placeholder="请输入银行卡号" v-model="bankNo" clearable></el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="handle-box">
      <div class="agreement-box-bar">
        <el-checkbox v-model="agreement" class="agreement">
          <span class="text">我已同意并阅读</span>
          <a class="link"  href="http://succ.dongbaoxian.cn/agreement/tx.pdf" @click="showAgreement">《提现协议》</a>
        </el-checkbox>
      </div>

      <el-button class="user-btn" @click="withdraw()">确认提现</el-button>
      <a class="link" target="_blank" href="/usercenter/s/capital">提现记录</a>
    </div>

    <div class="warning-box">
      <label>提现说明：</label>
      <span>1、收款账号实名信息需与懂保宝注册的实名信息一致，否则提现失败；</span>
      <span>2、每天只能申请一次提现，提现最少50元，最多2000元；</span>
      <span>3、提现成功会，会在3-10个工作日到账，请注意查收。</span>
    </div>

    <popup-box id="popupBox" ref="popupBox" :isTitle="false">
      <div class="pay-pwd-bar" slot="cont">
        <pay-input>
          <span slot="title">请输入支付密码</span>
        </pay-input>
        <label class="forget-link" @click="forget()">忘记密码</label>
        <key-board :showBox="true" class="static" :callback="sure"></key-board>
      </div>
    </popup-box>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import BankCard from "components/BankCard";
import PayInput from "components/password/Input";
import KeyBoard from "components/password/Keyboard";
import PopupBox from "components/PopupBox";
import MoneyInput from "components/MoneyInput";

export default {
  name: "withdraw",
  components: {
    BankCard,
    MoneyInput,
    PopupBox,
    PayInput,
    KeyBoard
  },
  data() {
    return {
      agreement: false,
      balance: "",
      bankNo: "",
      bankInfo: { code: "", text: "" },
      bankData: [[]],
      password: "",
      payPwd: false
    };
  },
  computed: {
    balanceStr() {
      return this.$G.moneyFormat(this.balance);
    }
  },
  created() {
    let obj = [
      {
        fun: this.getWidthdrawInfo(),
        callback: data => {
          if (!!data) {
            this.balance = data.balance;
            this.bankNo = data.bankcardno;
            this.bankInfo = {
              code: data.bankcode,
              text: data.bankname
            };
            this.payPwd = data.payPwd;
          }
        }
      },
      {
        fun: this.getBankList(),
        callback: data => {
          data.map(item => {
            this.bankData[0].push({
              code: item.bankcode,
              text: item.bankname
            });
          });
        }
      }
    ];
    this.__G__.ajaxParataxisDataStep(this, obj);
  },
  methods: {
    showAgreement() {},
    getWidthdrawInfo() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/withdrawInfo`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getBankList() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/bankList`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    allWithdraw() {
      this.$refs.moneyInput.money = this.balance.toString();
      this.$refs.moneyInput.blur();
    },
    showPicker(ref) {
      this.$refs[ref].showPicker();
    },
    selectResult(field, text, value) {
      this[field] = { text: text, code: value };
    },
    withdraw() {
      let m = this.$refs.moneyInput;
      let realMoney = m.moneyNumber;

      if(!this.agreement){
        this.$jBox.error("请同意并阅读《提现协议》");
        return false;
      }

      if (isNaN(realMoney)) {
        this.$jBox.error("请输入数字金额");
        return false;
      }

      if (realMoney === "") {
        this.$jBox.error("输入的投资金额");
        return false;
      }

      if (parseFloat(realMoney) > parseFloat(this.balance)) {
        this.$jBox.error("金额大于可提现余额");
        return false;
      }

      if (!this.bankNo || !this.bankInfo.code) {
        this.$jBox.error("请选择银行卡相关信息");
        return false;
      }

      if (this.payPwd !== 1) {
        this.$jBox.warn("您还没有设置支付密码<br>去设置支付密码？", {
          confirm: () => {
            this.$router.push("/usercenter/s/psd/settingpay");
          }
        });
        return false;
      }

      this.$refs.popupBox.show();
    },
    sure(psd) {
      let m = this.$refs.moneyInput;
      let realMoney = m.moneyNumber;

      this.$refs.popupBox.sure();

      this.$store.dispatch("emptyPayPassword");

      this.API.post({
        url: `/usercenter/withdraw`,
        params: {
          money: realMoney,
          password: psd,
          bankCode: this.bankInfo.code,
          bankCardno: this.bankNo
        }
      }).then(data => {
        this.$jBox.success("提现成功！", {
          closeCallback: () => {
            this.$router.push("/usercenter");
          }
        });
      });
    },
    forget() {
      this.$router.push("/usercenter/s/psd/vermobile");
    }
  }
};
</script>

<style lange="less">
.agreement-box-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
</style>
