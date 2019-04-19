<template>
  <div class="user-bar login">
    <div class="user-logo">
      <label><img src="../../assets/img/logo.png"></label>
    </div>
    <div class="user-form">
      <div class="item">
        <span><i class="sprite s-icon-phone"></i></span>
        <div class="input">
          <el-input type="tel" placeholder="请输入手机号" v-model="mobile" maxlength="11" clearable>
          </el-input>
        </div>
      </div>
      <div class="item">
        <span><i class="sprite s-icon-psd"></i></span>
        <div class="input">
          <el-input type="password" placeholder="输入6-20位数字和字母组合的密码" v-model="password" minlength="6" maxlength="20"
            clearable>
          </el-input>
        </div>
      </div>
    </div>

    <div class="user-handle">
      <label class="btn">
        <el-button class="user-btn radius" @click="login()">登录</el-button>
      </label>
    </div>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      mobile: "cs1",
      password: "123456"
    };
  },
  methods: {
    login() {
      if (!this.mobile) {
        this.$jBox.error("请输入手机号");
        return false;
      }

      if (!this.password) {
        this.$jBox.error("请输入密码");
        return false;
      }
      this.API
        .post({
          url: `/user/login`,
          params: {
            username: this.mobile,
            password: this.password
          }
        })
        .then(data => {
          let path = this.$route.query.redirect || "/";
          this.$router.push(path);
        });
    }
  }
};
</script>
