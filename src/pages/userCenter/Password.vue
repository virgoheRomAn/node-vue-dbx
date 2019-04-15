<template>
  <div class="password-bar">
    <div class="box-list-arrow">
      <ul>
        <li>
          <a href="javascript:;" @click="loginPsd()">
            <span>登陆密码修改</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="payPsd()">
            <span>{{psdText}}</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="forget()">
            <span>忘记登陆密码</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import CONST from "@/assets/js/const";
  export default {
    name: "password",
    data() {
      return {
        hasPayPsd: false,
        userMobile: "",
        psdText: "设置支付密码"
      };
    },
    created() {
      let vue = this;

      let userInfo = this.__G__.getItem([CONST.USERINFO]);
      if (!userInfo) {
        this.$jBox.error("获取用户信息错误<br>请重新登陆", {
          closeFun: () => {
            vue.$router.push({
              name: "login",
              query: { redirect: vue.$route.fullPath }
            });
          }
        });
        return false;
      }

      this.userMobile = JSON.parse(userInfo).userName;

      //首先获取用户是否设置了支付密码，如果设置就修改，反之设置
      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        if (Object.keys(data).length !== 0 && data && data.tradePassword) {
          this.hasPayPsd = true;
        } else {
          this.hasPayPsd = false;
        }

        this.psdText = this.hasPayPsd ? "修改支付密码" : "设置支付密码";
      });
    },
    methods: {
      loginPsd: function() {
        this.$router.push({
          name: "changeLogin",
          params: { mobile: this.userMobile }
        });
      },
      payPsd: function() {
        // if (this.hasPayPsd) {
        //   this.$router.push({
        //     name: "changePay",
        //     params: { mobile: this.userMobile }
        //   });
        // } else {
        //   this.$router.push({
        //     name: "settingPay",
        //     params: { mobile: this.userMobile }
        //   });
        // }

        let vue = this;

        this.userAPI.get(`/userCenter/userExtData`).then(data => {
          if (Object.keys(data).length !== 0 && data && data.bankCardNo) {
            if (this.hasPayPsd) {
              this.userAPI
                .post(`/userCenter/cashier/payPassword/reset`, {
                  backUrl: "_usercenter"
                })
                .then(data => {
                  window.location.href = data.data;
                });
            } else {
              this.userAPI
                .post(`/userCenter/cashier/payPassword/set`, {
                  backUrl: "_usercenter"
                })
                .then(data => {
                  window.location.href = data.data;
                });
            }
          } else {
            let html = `您还没有绑定银行卡，请先绑定银行卡！`;
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
                    callback: () => {
                      vue.$router.push({
                        name: "addBank",
                        query: { redirect: vue.$route.fullPath }
                      });
                    }
                  }
                ]
              }
            });
            return false;
          }
        });
      },
      forget() {
        this.$router.push({
          name: "forgetLogin",
          params: { mobile: this.userMobile }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
