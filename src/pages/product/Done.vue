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
        result: true,
        img_url: "",
        tips_text: "",
        info_text: "",
        buttons: []
      };
    },
    created() {
      this.userAPI
        .investStatus({
          tradeOrderOid: this.$route.query.tradeOrderOid
        })
        .then(data => {
          this.img_url = require("../../assets/img/tips/tips2.png");
          this.tips_text = "购买成功";
          this.info_text = this.$route.query.title
            ? `您已经成功购买 ${this.$route.query.title} 产品`
            : `您已经成功购买产品`;
          this.buttons.push(
            { text: "确定", callback: this.go },
            { text: "查看订单", cls: "line", callback: this.jump }
          );
        })
        .catch(data => {
          this.img_url = require("../../assets/img/tips/tips1.png");
          this.tips_text = "购买失败";
          this.info_text = `对不起，您购买失败。`;
          this.buttons.push(
            { text: "返回", callback: this.back },
            { text: "重新购买", cls: "line", callback: this.again }
          );
        });
    },
    methods: {
      go() {
        this.$router.push({
          name: "product"
        });
      },
      back() {
        this.$router.push({
          name: "details",
          params: { code: this.$route.params.code },
          query: { title: this.$route.query.title }
        });
      },
      jump() {
        this.$router.push({
          name: "trades"
        });
      },
      again() {
        this.$router.push({
          name: "buy",
          params: { code: this.$route.params.code },
          query: { title: this.$route.query.title }
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

