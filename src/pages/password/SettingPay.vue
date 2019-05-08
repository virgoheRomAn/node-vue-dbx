<template>
  <div class="set-password-bar">
    <div class="container">
      <pay-input>
        <span slot="title" v-if="!next">请输入支付密码</span>
        <span slot="title" v-else>请再次输入支付密码</span>
      </pay-input>
      <key-board :callback="inputPasswordComplete"></key-board>
      <div class="set-button">
        <el-button class="user-btn" v-if="!next" @click="nextStep()">确定</el-button>
        <el-button class="user-btn" v-else @click="ensure()">确定支付密码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PayInput from "components/password/Input";
import KeyBoard from "components/password/Keyboard";
export default {
  name: "settingPay",
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
      hasPayPsd: false,
      next: false,
      pwd: "",
      confrimPwd: ""
    };
  },
  created() {
    this.API.get({ url: `/usercenter/withdrawInfo` })
      .then(data => {
        this.hasPayPsd = data.payPwd === 1;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    inputPasswordComplete() {
      if (!this.next) {
        this.nextStep();
        this.$store.dispatch("showKeyBoard");
      }
    },
    inputPwd() {
      let pwd = "";
      if (this.payPassword.length !== 6) {
        this.$jBox.error("请输入六位密码");
        return false;
      }
      this.payPassword.map(item => {
        pwd += item;
      });
      this.$store.dispatch("emptyPayPassword");

      return pwd;
    },
    nextStep() {
      this.pwd = this.inputPwd();

      if (this.pwd.length !== 6) {
        return false;
      }
      this.next = true;
    },
    ensure() {
      this.confrimPwd = this.inputPwd();

      if (this.confrimPwd.length !== 6) {
        return false;
      }

      if (this.pwd !== this.confrimPwd) {
        this.$jBox.error("两次密码不一致！");
        return false;
      }

      if (this.hasPayPsd) {
        this.API.post({
          url: `/userCenter/changePayPwd`,
          params: {
            newPwd: this.pwd,
            confrimPwd: this.confrimPwd
          }
        })
          .then(data => {
            this.$router.push("/usercenter");
          })
          .catch(err => {
            this.next = false;
            this.pwd = "";
            this.confrimPwd = "";
            console.log(err);
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
    .user-btn {
      margin: 0 0 15px 0;
    }
  }
}
</style>




