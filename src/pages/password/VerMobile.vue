<template>
  <div class="user-bar">
    <div class="user-form">
      <h2 class="title"><span class="has-line">验证手机号</span></h2>
      <div class="item">
        <span>手机号：</span>
        <div class="input">
          <el-input class="tc-333" type="text" placeholder="请输入手机号码" v-model="userMobile" disabled>
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
  name: "verMobile",
  components: {
    verCode
  },
  data() {
    return {
      userMobile: ""
    };
  },
  created() {
    this.API.get({ url: `/usercenter/userInfo` })
      .then(data => {
        this.userMobile = data.mobile;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    nextStep() {
      if (!this.$refs.verCode.verCode) {
        this.$jBox.error("请输入验证码");
        return false;
      }
      this.API.post({
        url: `/userCenter/verChangePaySmscode`,
        params: {
          mobile: this.userMobile,
          smscode: this.$refs.verCode.verCode
        }
      })
        .then(data => {
          this.$jBox.success("验证成功", {
            closeCallback: () => {
              this.$router.push("/usercenter/s/psd/settingpay")
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


