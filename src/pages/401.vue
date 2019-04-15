<template>
  <div class="error-bar">
    <label>
      <img src="../assets/img/404.png" />
      <span>对不起，登陆超时</span>
    </label>
    <div class="user-handle">
      <label class="btn">
        <el-button class="user-btn" @click="login()">重新登陆</el-button>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimeOutPage",
    methods: {
      login() {
        this.$router.push({
          path: "/login"
        });
      }
    }
  };
</script>

<style lang="less">
  @import url("../assets/less/_variable.less");
  .error-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    > label {
      position: relative;
      top: -60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        display: block;
        width: 100px;
        height: 100px;
        margin-bottom: 15px;
      }
      span {
        font-size: @fs-14;
        margin-bottom: 20px;
      }
      a {
        display: block;
        height: 36px;
        line-height: 36px;
        width: 100px;
        text-align: center;
        font-size: @fs-14;
        background: @btn;
        color: @white;
        border-radius: 3px;
      }
    }
    .user-handle {
      position: relative;
      top: -40px;
      padding: 0 80px;
    }
  }
</style>
