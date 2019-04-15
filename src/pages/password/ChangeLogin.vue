<template>
  <div class="user-bar">
    <div class="user-form">
      <h2 class="title"><span class="has-line">登录密码修改</span></h2>
      <div class="item">
        <span>原密码：</span>
        <div class="input">
          <el-input type="password" placeholder="请输入原密码" v-model="oldPsd" clearable>
          </el-input>
        </div>
      </div>
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
        <el-button class="user-btn" @click="sure()">确定修改</el-button>
      </label>
      <label class="tips">
        <a href="javascript:;" @click="forget()">忘记原密码？</a>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "changeLogin",
    data() {
      return {
        userMobile: "",
        oldPsd: "",
        newPsd: "",
        newAgainPsd: ""
      };
    },
    created() {
      this.userMobile = this.$route.params.mobile || "";
    },
    methods: {
      sure() {
        this.userAPI
          .changePassword({
            oldPassword: this.oldPsd,
            newPassword: this.newPsd,
            again: this.newAgainPsd
          })
          .then(data => {
            //登陆页面
            this.$router.push({
              name: "login"
            });
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


