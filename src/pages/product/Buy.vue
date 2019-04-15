<template>
  <div class="buy-bar">
    <div class="information-box">
      <div class="box-list-title">
        <h2 class="title">购买金额</h2>
        <div class="container">
          <money-input ref="moneyInput">
            <label slot="info" class="tips">
              <span>当前余额<em>{{balanceStr}}</em>元</span>
              <span>可使用余额<em>{{balanceUseStr}}</em>元</span>
            </label>
          </money-input>
        </div>
      </div>

      <!-- <div class="box-list-title pt-10">
        <h2 class="title">红包及优惠券</h2>
        <div class="container">
          <div class="box-list-arrow">
            <ul>
              <li>
                <span>1000元奖金红包</span>
              </li>
            </ul>
          </div>
        </div>
      </div> -->
    </div>

    <div class="handle-box">
      <label class="agreement">
        <el-checkbox v-model="agreement">
          <span>已阅读并同意<a class="agreement-word" href="javascript:;" @click="showAgreement">《XXXXXX协议》</a></span>
        </el-checkbox>
      </label>
      <el-button class="user-btn" @click="buy()">立即购买</el-button>
      <el-button class="user-btn line" @click="recharge()">充值</el-button>
    </div>

    <div class="warning-box">
      <label>温情提示</label>
      <span>1、投资金额不能含有小数 </span>
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
  import PayInput from "components/password/Input";
  import KeyBoard from "components/password/Keyboard";
  import PopupBox from "components/PopupBox";
  import MoneyInput from "components/MoneyInput";
  export default {
    name: "buy",
    data() {
      return {
        balance: "",
        balanceUse: "",
        agreement: false
      };
    },
    components: {
      MoneyInput,
      PopupBox,
      PayInput,
      KeyBoard
    },
    computed: {
      balanceStr: function() {
        return this.$G.moneyFormat(this.balance);
      },
      balanceUseStr: function() {
        return this.$G.moneyFormat(this.balanceUse);
      }
    },
    created() {
      var vue = this;
      let obj = [
        {
          fun: this.getUserCount(),
          callback: data => {
            if (!!data) {
              this.balance = this.$G.count.div(data.current_balance, 100);
              this.balanceUse = this.$G.count.div(
                data.withdrawAvailableBalance,
                100
              );
            }
          }
        },
        {
          fun: this.getUserExtData(),
          callback: data => {
            if (Object.keys(data).length === 0 || !data || !data.bankCardNo) {
              let html = `您还没有绑定银行卡，请先绑定银行卡！`;
              this.showDialog(html, () => {
                vue.$router.push({
                  name: "addBank",
                  query: { redirect: vue.$route.fullPath }
                });
              });
              return false;
            }

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

            if (Object.keys(data).length === 0 || !data || !data.riskAssessment) {
              let html = `您还没有风险测评，请先去风险测评`;
              this.showDialog(html, () => {
                vue.$router.push({
                  name: "appraisal",
                  query: { redirect: vue.$route.fullPath }
                });
              });
              return false;
            }
          }
        }
      ];
      this.__G__.ajaxParataxisDataStep(this, obj).then(data => {
        console.log(data);
      });
    },
    methods: {
      forget() {
        this.$router.push({
          name: "buy"
        });
      },
      getUserCount() {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/userCenter/account`)
            .then(res => {
              let data = res.data.data;
              if (res.data.code !== 200) {
                reject(res.data);
              } else {
                resolve(data);
              }
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getUserExtData() {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/userCenter/userExtData`)
            .then(res => {
              let data = res.data.data;
              if (res.data.code !== 200) {
                reject(res.data);
              } else {
                resolve(data);
              }
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      sure(psd) {
        let vue = this;
        let m = this.$refs.moneyInput;
        let realMoney = m.moneyNumber;

        this.userAPI
          .checkPayPssword({
            payPassword: psd
          })
          .then(data => {
            this.$refs.popupBox.closePopup("#popupBox");
            this.$store.dispatch("emptyPayPassword");
            //发送验证码
            this.userAPI
              .investSmsCode({
                productCode: this.$route.params.code
              })
              .then(data => {
                this.orderId = data.data;
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
                      .investSubmit({
                        investAmount: realMoney,
                        productCode: this.$route.params.code,
                        payPwd: psd,
                        smsCode: value,
                        orderId: this.orderId,
                        couponId: ""
                      })
                      .then(data => {
                        this.$router.push({
                          name: "buyDone",
                          params: { code: this.$route.params.code },
                          query: {
                            title: this.$route.query.title,
                            tradeOrderOid: data.data
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
      buy() {
        let vue = this;
        let m = this.$refs.moneyInput;
        let realMoney = m.moneyNumber;
        if (isNaN(realMoney)) {
          this.$jBox.error("请输入数字金额");
          return false;
        }
        if (realMoney === "") {
          this.$jBox.error("输入的投资金额");
          return false;
        }
        if (parseFloat(realMoney) > parseFloat(this.balanceUse)) {
          this.$jBox.error("输入的金额大于可用余额");
          return false;
        }
        if (!this.agreement) {
          this.$jBox.error("请勾选协议");
          return false;
        }

        //投资
        this.userAPI
          .post(`/userCenter/cashier/invest`, {
            productCode: this.$route.params.code,
            investAmount: realMoney,
            backUrl: "_product"
          })
          .then(data => {
            window.location.href = data.data;
          });
        // this.$refs.popupBox.showPopup("#popupBox");
      },
      showDialog(html, callback) {
        let vue = this;
        vue.$refs.popupBox.closePopup("#popupBox");
        vue.$store.dispatch("emptyPayPassword");

        vue.$jBox.confirm(html, {
          title: "友情提示",
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
      },
      recharge() {
        this.$router.push({
          name: "recharge"
        });
      },
      showAgreement() {}
    }
  };
</script>

<style lang="less" scoped>
  @import url("../../assets/less/_variable.less");
  .buy-bar {
    padding: 0 20px;
    .money-input {
      margin-top: 10px;
    }
    .box-list-arrow {
      padding: 0;
      ul > li {
        padding: 10px 0 10px;
        border-bottom: 1px solid @bd;
        span {
          color: @main;
          font-size: @fs-14;
        }
      }
    }
    .psd-input-bar {
      margin-top: 15px;
    }
  }
</style>
