<template>
  <div class="set-password-bar">
    <div class="container">
      <pay-input>
        <span slot="title">请输入支付密码</span>
      </pay-input>
      <key-board></key-board>
      <div class="set-button">
        <el-button class="user-btn" @click="ensure()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PayInput from "components/password/Input";
import KeyBoard from "components/password/Keyboard";
export default {
  name: "changePayPwd",
  components: {
    PayInput,
    KeyBoard
  },
  computed: {
    ...mapState({
      payPassword: state => state.payPassword
    })
  },
  data() {
    return {
      hasPayPsd: false
    };
  },
  created() {
    this.userAPI.get(`/userCenter/userExtData`).then(data => {
      if (Object.keys(data).length !== 0 && data && data.tradePassword) {
        this.hasPayPsd = true;
      } else {
        this.hasPayPsd = false;
      }
    });
  },
  methods: {
    ensure() {
      let psd = "";
      if (this.payPassword.length !== 6) {
        this.$jBox.error("请输入六位密码");
        return false;
      }
      this.payPassword.map(item => {
        psd += item;
      });
      this.$store.dispatch("emptyPayPassword");

      if (this.hasPayPsd) {
        this.userAPI
          .forgetPayPassword({
            newPassword: psd,
            verCode: this.$route.query.code || ""
          })
          .then(data => {
            this.$router.push({ name: "usercenter" });
          })
          .catch(data => {
            console.log(data);
          });
      } else {
        this.userAPI
          .setPayPassword({
            newPassword: psd
          })
          .then(data => {
            this.$router.push({ name: "usercenter" });
          });
      }
    }
  }
};
</script>
<style lang="less">
.set-password-bar {
  padding: 40px 20px;
  .set-button {
    padding: 0 15px;
    margin-top: 30px;
  }
}
</style>




