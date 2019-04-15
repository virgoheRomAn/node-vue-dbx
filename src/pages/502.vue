<template>
  <div class="error-bar">
    <label>
      <img src="../assets/img/502.png" />
      <span>对不起，您的网络好像有点问题</span>
    </label>
    <div class="user-handle">
      <label class="btn">
        <el-button class="user-btn" @click="index()">回到首页</el-button>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ErrorPage",
    methods: {
      index() {
        this.$router.push("/index");
      }
    }
  };
</script>