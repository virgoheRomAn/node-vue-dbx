<template>
  <div class="item">
    <span>验证码：</span>
    <div class="input">
      <el-input type="text" placeholder="请输入验证码" v-model="verCode" maxlength="6" clearable>
      </el-input>
    </div>
    <a class="ver-code" :class="{'disabled': !isMobile,'loading': isCodeLoading}" href="javascript:;" @click="getVerCode($event)">{{codeText}}</a>
  </div>
</template>

<script>
export default {
  name: "ver-code",
  props: {
    mobile: {
      type: String,
      default: null
    },
    payPwd: {
      type: null,
      default: true
    }
  },
  data() {
    return {
      verCode: "",
      isMobile: false,
      isCodeLoading: false,
      codeText: "获取验证码"
    };
  },
  created() {
    this.isMobile = /^1[0-9]{10}$/.test(this.mobile);
  },
  watch: {
    mobile(val) {
      this.isMobile = /^1[0-9]{10}$/.test(val);
    }
  },
  methods: {
    cutDown() {
      let r = 60;
      this.isMobile = true;
      this.isCodeLoading = true;

      this.codeText = r + "s重新发送";
      let verifyAuto = setInterval(() => {
        this.codeText = --r + "s重新发送";
        if (r <= 0) {
          this.codeText = "获取验证码";
          clearInterval(verifyAuto);
          this.isCodeLoading = false;
        }
      }, 1000);
    },
    getVerCode(event) {
      if (!this.isMobile) return false;
      if (this.isCodeLoading) return false;

      if (this.payPwd) {
        this.API.get({ url: `/usercenter/payPwdSmscode` })
          .then(data => {
            this.cutDown();
            this.$jBox.alert("验证码已发送!");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (!this.bindCard.change) {
          let params = {
            realName: this.bindCard.realName,
            certificateNo: this.bindCard.certificateNo,
            bankName: this.bindCard.bankName,
            cardNo: this.bindCard.cardNo,
            phone: this.mobile
          };

          this.userAPI.getBindCardSmsCode(params).then(data => {
            this.cutDown();
            this.orderData = data.data;
            this.$jBox.alert("验证码已发送!");
          });
        } else {
          let params = {
            bankName: this.bindCard.bankName,
            cardNo: this.bindCard.cardNo,
            phone: this.mobile
          };

          this.userAPI.changeCardSmsCode(params).then(data => {
            this.cutDown();
            this.orderData = data.data;
            this.$jBox.alert("验证码已发送!");
          });
        }
      }
    }
  }
};
</script>

<style>
</style>
