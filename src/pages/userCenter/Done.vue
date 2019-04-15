<template>
  <div class="done-page-bar">
    <done-item :img_url="img_url" :buttons="buttons">
      <span class="tips" slot="tips">{{tips_text}}</span>
      <span class="info" slot="info">{{info_text}}</span>
    </done-item>
  </div>
</template>

<script>
  import DoneItem from "components/DoneTemplate";
  export default {
    name: "result",
    data() {
      return {
        result: true,
        img_url: "",
        tips_text: "",
        info_text: "",
        buttons: []
      };
    },
    created() {
      let result = this.$route.params.result;

      if (!result) {
        this.$jBox.error("URL地址错误");
        return false;
      }

      if (result !== "recharge" && result !== "withdraw") {
        this.$jBox.error("URL参数错误");
        return false;
      }

      if (result === "recharge") {
        this.userAPI
          .rechargeStatus({
            bankOrderOid: this.$route.query.bankOrderOid
          })
          .then(data => {
            this.img_url = require("../../assets/img/tips/tips2.png");
            this.tips_text = "充值成功";
            this.info_text = `恭喜！您已经成功充值${
              this.$route.query.realMoney
            }元。`;
            this.buttons.push(
              { text: "确定", callback: this.go },
              { text: "查看订单", cls: "line", callback: this.jump }
            );
          })
          .catch(data => {
            this.img_url = require("../../assets/img/tips/tips1.png");
            this.tips_text = "充值失败";
            this.info_text = `对不起，您充值失败。`;
            this.buttons.push(
              { text: "返回", callback: this.back },
              { text: "重新充值", cls: "line", callback: this.again }
            );
          });
      } else if (result === "withdraw") {
        this.img_url = require("../../assets/img/tips/tips2.png");
        this.tips_text = "提现成功";
        this.info_text = `您的体现申请已经提交，银行正在审批中。`;
        this.buttons.push(
          { text: "确定", callback: this.go },
          { text: "查看订单", cls: "line", callback: this.jump }
        );
      }
    },
    methods: {
      go() {
        this.$router.push({
          name: "usercenter"
        });
      },
      back() {
        this.$router.push({
          name: "usercenter"
        });
      },
      jump() {
        this.$router.push({
          name: "capital"
        });
      },
      again() {
        this.$router.push({
          name: "recharge"
        });
      }
    },
    components: {
      DoneItem
    }
  };
</script>
<style lang="less">
  .done-page-bar {
    position: relative;
    display: flex;
    padding-top: 30px;
  }
</style>

