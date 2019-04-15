<template>
  <div class="user-bar">
    <el-tabs class="login-tab" v-model="activeName">
      <el-tab-pane label="密码登陆" name="password">
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
        </div>

        <div class="user-handle">
          <label class="btn">
            <el-button class="user-btn" @click="login('password')">登陆</el-button>
          </label>
          <label class="tips">
            <a href="javascript:;" @click="jump()">马上注册</a>
            <span>|</span>
            <a href="javascript:;" @click="forget()">忘记密码</a>
          </label>
        </div>
      </el-tab-pane>

      <el-tab-pane label="短信登陆" name="verCode">
        <div class="user-form">
          <div class="item">
            <span>手机号：</span>
            <div class="input">
              <el-input type="tel" placeholder="请输入手机号" v-model="mobile" maxlength="11" clearable>
              </el-input>
            </div>
          </div>
          <ver-code ref="verCode" :mobile="mobile"></ver-code>
        </div>

        <div class="user-handle">
          <label class="btn">
            <el-button class="user-btn" @click="login('verCode')">登陆</el-button>
          </label>
          <label class="tips">
            <a href="javascript:;" @click="jump()">马上注册</a>
            <span>|</span>
            <a href="javascript:;" @click="forget()">忘记密码</a>
          </label>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  export default {
    name: "login",
    components: {
      verCode
    },
    data() {
      return {
        mobile: "",
        password: "",
        activeName: "password"
      };
    },
    methods: {
      jump() {
        this.$router.push("/register");
      },
      login(type) {
        if (!this.mobile) {
          this.$jBox.error("请输入手机号");
          return false;
        }

        if (type === "password") {
          if (!this.password) {
            this.$jBox.error("请输入密码");
            return false;
          }
          this.userAPI
            .userPasswordLogin({
              mobile: this.mobile,
              password: this.password
            })
            .then(data => {
              let path = this.$route.query.redirect || "/";
              this.$router.push(path);
            });
        } else if (type === "verCode") {
          if (!this.$refs.verCode.verCode) {
            this.$jBox.error("请输入验证码");
            return false;
          }
          this.userAPI
            .userCodeLogin({
              mobile: this.mobile,
              verCode: this.$refs.verCode.verCode
            })
            .then(data => {
              let path = this.$route.query.redirect || "/";
              this.$router.push(path);
            });
        }
      },
      forget() {
        this.$router.push({
          path: "/usercenter/s/psd/forgetlogin/" + this.mobile || ""
        });
      }
    }
  };
</script>
