<template>
  <div class="user-bar">
    <div class="user-form">
      <h2 class="title"><span class="has-line">修改注册手机号</span></h2>
      <div class="item">
        <span>手机号：</span>
        <div class="input">
          <el-input class="tc-333" type="text" v-model="userMobile" disabled>
          </el-input>
        </div>
      </div>

      <ver-code ref="verCode" :mobile="userMobile"></ver-code>

    </div>
    <div class="user-handle">
      <label class="btn">
        <el-button class="user-btn" @click="nextStep()">下一步</el-button>
      </label>
    </div>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  import CONST from "@/assets/js/const";
  export default {
    name: "changePay",
    components: {
      verCode
    },
    data() {
      return {
        userMobile: ""
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
    },
    methods: {
      nextStep() {
        let vue = this;
        if (!this.$refs.verCode.verCode) {
          this.$jBox.error("请输入验证码");
          return false;
        }
        this.userAPI
          .checkSmsCode({
            mobile: this.userMobile,
            verCode: this.$refs.verCode.verCode
          })
          .then(data => {
            this.$jBox.success("验证成功", {
              closeFun: () => {
                vue.$router.push({
                  name: "settingPay",
                  params: { mobile: vue.userMobile },
                  query: { code: this.$refs.verCode.verCode }
                });
              }
            });
          })
          .catch(data => {
            console.log(data);
          });
      }
    }
  };
</script>


