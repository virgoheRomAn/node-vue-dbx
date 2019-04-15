<template>
  <div class="user-bar">
    <div class="user-form">
      <h2 class="title"><span class="has-line">忘记登陆密码</span></h2>
      <div class="item">
        <span>手机号：</span>
        <div class="input">
          <el-input type="tel" placeholder="请输入手机号" v-model="userMobile" maxlength="11" clearable>
          </el-input>
        </div>
      </div>

      <ver-code ref="verCode" :mobile="userMobile"></ver-code>

      <div class="item">
        <span>新密码：</span>
        <div class="input">
          <el-input type="password" placeholder="请输入6-20位数字和字母组合的密码" v-model="newPsd" clearable>
          </el-input>
        </div>
      </div>
      <div class="item">
        <span>确认密码：</span>
        <div class="input">
          <el-input type="password" placeholder="请再次确认密码" v-model="newAgainPsd" clearable>
          </el-input>
        </div>
      </div>
    </div>
    <div class="user-handle">
      <label class="btn">
        <el-button class="user-btn" @click="sure()">提交</el-button>
      </label>
    </div>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  export default {
    name: "forget-login",
    components: {
      verCode
    },
    data() {
      return {
        userMobile: "",
        newPsd: "",
        newAgainPsd: ""
      };
    },
    created() {
      this.userMobile = this.$route.params.mobile || "";
    },
    methods: {
      sure() {
        if (!this.userMobile) {
          this.$jBox.error("请输入手机号");
          return false;
        }
        let verPsd = this.$G.verifyPassword(this.newPsd, {});
        if (verPsd.type !== 2) {
          this.$jBox.error(verPsd.text);
          return false;
        }

        this.userAPI
          .forgotPassword({
            mobile: this.userMobile,
            password: this.newPsd,
            again: this.newAgainPsd,
            verCode: this.$refs.verCode.verCode
          })
          .then(data => {
            //登陆页面
            this.$router.push({
              name: "login"
            });
          });
      }
    }
  };
</script>


