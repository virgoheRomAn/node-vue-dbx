<template>
  <div class="invite-done">
    <div class="container">
      <div class="title">
        <i class="sprite s-icon-success"></i>
        <span>恭喜！注册成功</span>
      </div>
      <div class="content">
        <div class="ewm">
          <label><img src="../../assets/img/ewm.png"></label>
          <span>扫描关注“通融信义通”微信号<br>点击“理财”即可投资</span>
        </div>
        <label class="fb-split-line">
          <em>or</em>
        </label>
        <div class="handle-box">
          <el-button class="user-btn line" @click="invest()">立即投资</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "inviteFriendDone",
    created() {
      if (!this.$route.params.mobile) {
        this.$jBox.error("获取信息失败");
        return false;
      }
    },
    methods: {
      invest() {
        this.$router.push({ name: "product" });
      }
    }
  };
</script>
<style lang="less">
  @import url("../../assets/less/_variable.less");
  .invite-done {
    padding: 40px 25px;
    .container {
      position: relative;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        color: @main;
        font-size: @fs-20;
        margin: 20px 0 50px;
        i {
          margin-right: 5px;
        }
      }
      .content {
        display: block;
        .ewm {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          label {
            display: block;
            width: 140px;
          }
          span {
            display: block;
            text-align: center;
            font-size: @fs-15;
            color: @g-666;
            margin: 15px 0 30px;
          }
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>



