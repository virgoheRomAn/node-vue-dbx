<template>
  <div class="user-bar">
    <div class="user-form">
      <div class="item">
        <span>手机号：</span>
        <div class="input">
          <el-input type="tel" placeholder="请输入手机号" v-model="mobile" maxlength="11" clearable>
          </el-input>
        </div>
      </div>
      <div class="item">
        <span>密码：</span>
        <div class="input">
          <el-input type="password" placeholder="输入6-20位数字和字母组合的密码" v-model="password" minlength="6" maxlength="20"
            clearable>
          </el-input>
        </div>
      </div>
      <div class="item">
        <span>确认密码：</span>
        <div class="input">
          <el-input type="password" placeholder="请再次输入密码" v-model="again" minlength="6" maxlength="20" clearable>
          </el-input>
        </div>
      </div>
      <ver-code ref="verCode" :mobile="mobile"></ver-code>
    </div>
    <div class="user-handle">
      <label class="agreement">
        <el-checkbox v-model="agreement">
          <span>已阅读并同意<a href="javascript:;" @click="showAgreement">《用户服务协议》</a></span>
        </el-checkbox>
      </label>
      <label class="btn">
        <el-button class="user-btn" @click="register()">注册</el-button>
      </label>
      <label class="tips">
        <a href="javascript:;" @click="jump()">马上登录</a>
        <span>|</span>
        <a href="javascript:;" @click="jump()">忘记密码</a>
      </label>
    </div>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  export default {
    name: "register",
    components: {
      verCode
    },
    data() {
      return {
        mobile: "",
        password: "",
        again: "",
        agreement: true
      };
    },
    methods: {
      showAgreement() {},
      jump() {
        this.$router.push("/login");
      },
      register() {
        if (!this.mobile) {
          this.$jBox.error("请输入手机号");
          return false;
        }

        if (!this.agreement) {
          this.$jBox.error("请勾选用户服务协议");
          return false;
        }

        let verPsd = this.$G.verifyPassword(this.password, {});
        if (verPsd.type !== 2) {
          this.$jBox.error(verPsd.text);
          return false;
        }

        this.userAPI
          .userRegister({
            mobile: this.mobile,
            password: this.password,
            again: this.again,
            verCode: this.$refs.verCode.verCode
          })
          .then(data => {
            //登陆
            this.userAPI
              .userPasswordLogin({
                mobile: this.mobile,
                password: this.password
              })
              .then(data => {
                let path = this.$route.query.redirect || "/";
                this.$router.push(path);
              });
          });
      }
    }
  };
</script>


