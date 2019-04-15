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
    name: "buyDone",
    data() {
      return {
        result: false,
        img_url: "",
        tips_text: "",
        info_text: "",
        buttons: []
      };
    },
    created() {
      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        if (Object.keys(data).length !== 0 && data && data.bankCardNo) {
          this.result = true;
        } else {
          this.result = false;
        }

        this.img_url = this.result
          ? require("../../assets/img/tips/tips2.png")
          : require("../../assets/img/tips/tips1.png");
        this.tips_text = this.result ? "绑定成功" : "绑定失败";
        this.info_text = this.result
          ? "恭喜！您已经成功绑定了银行卡。"
          : "对不起，您绑定银行卡失败";

        this.result
          ? this.buttons.push(
              { text: "确定", callback: this.go },
              { text: "充值", cls: "line", callback: this.jump }
            )
          : this.buttons.push(
              { text: "返回", callback: this.back },
              { text: "重新绑定", cls: "line", callback: this.again }
            );
      });
    },
    mounted() {},
    methods: {
      go() {
        this.$router.push({
          name: "usercenter"
        });
      },
      back() {
        this.$router.push({
          name: "banks"
        });
      },
      jump() {
        this.$router.push({
          name: "recharge"
        });
      },
      again() {
        this.$router.push({
          name: "addBank"
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

