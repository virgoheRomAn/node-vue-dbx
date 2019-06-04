<template>
  <div class="done-page-bar">
    <done-item :img_url="img_url" :buttons="buttons">
      <span class="tips" slot="tips">{{tips_text}}</span>
      <!-- <span class="info" slot="info">{{info_text}}</span> -->
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
    this.result = true;
    this.img_url = require("../assets/img/tips/tips2.png");
    this.tips_text = "恭喜你，投保成功！";
    this.buttons.push({ text: "确定", callback: this.go });
  },
  mounted() {},
  methods: {
    go() {
      this.$router.push({
        name: "index"
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

