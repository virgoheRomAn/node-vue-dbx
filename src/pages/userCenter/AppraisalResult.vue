<template>
  <div class="done-page-bar">
    <span class="done-tips">您的风险评估结果</span>
    <done-item :img_url="img_url" :buttons="buttons">
      <span class="tips tc-red" slot="tips">{{tips_text}}</span>
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
      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        this.img_url = require("../../assets/img/tips/tips3.png");
        this.tips_text = data.riskAssessment;
        this.buttons.push(
          { text: "确定", callback: this.go },
          { text: "重新测评", cls: "line", callback: this.again }
        );
      });
    },
    methods: {
      go() {
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.$router.push({
            name: "product"
          });
        }
      },
      again() {
        this.$router.push({
          name: "appraisal",
          params: { mobile: this.$route.params.mobile }
        });
      }
    },
    components: {
      DoneItem
    }
  };
</script>
<style lang="less">
  @import url("../../assets/less/_variable.less");
  .done-page-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    .done-tips {
      color: @main;
      font-size: @fs-15;
      display: flex;
      text-align: center;
      margin-top: 15px;
      align-items: center;
      justify-content: center;
      &::before {
        content: "";
        height: 1px;
        width: 15px;
        background: @main;
        margin-right: 10px;
      }
      &::after {
        content: "";
        height: 1px;
        width: 15px;
        background: @main;
        margin-left: 10px;
      }
    }
  }
</style>

