<template>
  <div class="buy-bar banks-bar">
    <bank-card class="mb-25" :cardClass="cardClass"></bank-card>

    <div class="information-box">
      <div class="box-list-title">
        <h2 class="title mb-20">充值金额</h2>
        <div class="container">
          <money-input class="button" ref="moneyInput"></money-input>
        </div>
      </div>
    </div>

    <div class="handle-box">
      <el-button class="user-btn" @click="recharge()">确定充值</el-button>
    </div>

    <div class="warning-box">
      <label>温情提示</label>
      <span>1、如果有疑问，请拨打客户电话400-xxxx-xxxxx </span>
    </div>

    <popup-box id="popupBox" ref="popupBox" :isTitle="false">
      <span slot="title">标题</span>
      <div slot="cont">
        <pay-input>
          <span slot="title">请输入支付密码</span>
        </pay-input>
        <label class="forget-link" @click="forget()">忘记密码</label>
        <key-board :showBox="true" :keyboardStyle="{height:'auto'}" :callback="sure"></key-board>
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
    name: "recharge",
    components: {
      BankCard,
      MoneyInput,
      PopupBox,
      PayInput,
      KeyBoard
    },
    data() {
      return {
        cardClass: "card-zs",
        _timer_: 0
      };
    },
    methods: {
      forget() {
        this.$router.push({
          name: "changePay",
          params: { mobile: "17723558969" }
        });
      },
      sure(psd) {
        let m = this.$refs.moneyInput;
        let realMoney = m.moneyNumber;
        let vue = this;
        let $ = this.$;
        let cut_time = 3;

        this.userAPI
          .checkPayPssword({
            payPassword: psd
          })
          .then(data => {
            this.$refs.popupBox.closePopup("#popupBox");
            this.$store.dispatch("emptyPayPassword");
            //发送验证码
            this.userAPI
              .rechargeSmsCode({
                orderAmount: realMoney
              })
              .then(data => {
                this.payNo = data.data.payNo;
                this.$prompt("短信验证码：", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  inputPlaceholder: "请输入短信验证码",
                  inputValidator: function(value) {
                    if (value === "" || value === null) {
                      return "短信验证码不能为空";
                    } else if (value.length !== 6) {
                      return "请输入6位短信验证码";
                    }
                  }
                })
                  .then(({ value }) => {
                    //提交订单
                    this.userAPI
                      .rechargeSubmit({
                        orderAmount: realMoney,
                        payNo: this.payNo,
                        smsCode: value,
                        payPwd: psd
                      })
                      .then(data => {
                        let text = `倒计时：<label id="cutDown" style="font-size:40px; margin:0 8px;" class="tc-red">${cut_time}</label>秒`;

                        vue.$jBox.loading(text, {
                          showNumber: "1",
                          icon: {
                            iconType: "none"
                          },
                          initAfterFun: function(opt) {
                            let cut_time = parseInt($("#cutDown").text());
                            clearInterval(vue._timer_);
                            vue._timer_ = setInterval(() => {
                              if (cut_time <= 0) {
                                clearInterval(vue._timer_);
                                vue.$router.push({
                                  name: "result",
                                  params: {
                                    result: `recharge`
                                  },
                                  query: {
                                    bankOrderOid: `${data.data.bankOrderOid}`,
                                    realMoney: `${realMoney}`
                                  }
                                });
                                return false;
                              }
                              cut_time--;
                              $("#cutDown").text(cut_time);
                            }, 1000);
                          }
                        });
                      })
                      .catch(data => {
                        console.log(data);
                      });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
          })
          .catch(data => {
            this.$store.dispatch("emptyPayPassword");
          });
      },
      recharge() {
        let vue = this;
        let m = this.$refs.moneyInput;
        let realMoney = m.moneyNumber;
        if (isNaN(realMoney)) {
          this.$jBox.error("请输入数字金额");
          return false;
        }
        if (realMoney === "") {
          this.$jBox.error("输入的充值金额");
          return false;
        }

        this.userAPI.get(`/userCenter/userExtData`).then(data => {
          if (Object.keys(data).length === 0 || !data || !data.tradePassword) {
            let html = `您还没有设置支付密码，请先设置支付密码！`;
            this.showDialog(html, () => {
              vue.$router.push({
                name: "password",
                query: { redirect: vue.$route.fullPath }
              });
            });
            return false;
          }

          //充值
          this.userAPI
            .post(`/userCenter/cashier/recharge`, {
              orderAmount: realMoney,
              backUrl: "_usercenter"
            })
            .then(data => {
              window.location.href = data.data;
            });
          // this.$refs.popupBox.showPopup("#popupBox");
        });
      },
      showDialog(html, callback) {
        let vue = this;
        vue.$refs.popupBox.closePopup("#popupBox");
        vue.$store.dispatch("emptyPayPassword");

        vue.$jBox.confirm(html, {
          title: "错误提示",
          confirmType: 1,
          icon: { iconDir: "h" },
          css: {
            titleCSS: { borderBottom: "0 none" },
            introCSS: { padding: "6px 30px 40px" }
          },
          btn: {
            array: [
              {
                text: "确定",
                callback: callback
              }
            ]
          }
        });
      }
    }
  };
</script>

<style lange="less">
</style>
