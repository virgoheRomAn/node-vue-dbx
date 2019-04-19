<template>
  <div class="invite-bar">
    <h2 class="title">邀请好友投资</h2>
    <div class="content">
      <i class="i-top"><img src="../../assets/img/invite/icon2.png"></i>
      <i class="i-left"><img src="../../assets/img/invite/icon1.png"></i>
      <i class="i-bto"><img src="../../assets/img/invite/icon3.png"></i>
      <div class="ewm-bar" id="ewmBox">
        <i class="top left"></i>
        <i class="top right"></i>
        <i class="bto right"></i>
        <i class="bto left"></i>
        <span><img src="../../assets/img/share-logo.png"></span>
        <img id="ewmImg">
      </div>
      <div class="invite-btn">
        <a href="javascript:;" @click="share()">立即邀请</a>
      </div>
      <div class="invite-nav">
        <a @click="myInvite()">我的邀请</a>
        <span>|</span>
        <a>邀请说明</a>
      </div>
    </div>

    <div class="share-tips" v-if="showTips" @click="close()">
      <label><img src="../../assets/img/invite/share.png"></label>
    </div>
  </div>
</template>

<script>
  import QRCode from "qrcode";
  import CONST from "@/assets/js/const";
  import { share_host } from "@/request/native";

  export default {
    name: "inviteIndex",
    data() {
      return {
        share_url: "",
        showTips: false
      };
    },
    mounted() {
      let vue = this;
      let userInfo = this.__G__.getItem([CONST.USERINFO]);
      if (!userInfo) {
        this.$jBox.error("获取用户信息错误<br>请重新登陆", {
          closeCallback: () => {
            vue.$router.push({
              name: "login",
              query: { redirect: vue.$route.fullPath }
            });
          }
        });
        return false;
      }

      this.userName = JSON.parse(userInfo).userName;
      this.userId = JSON.parse(userInfo).userId;

      this.share_url = `${share_host}/invite/s/friend?breakName=${
        this.userName
      }&breakId=${this.userId}`;

      let opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 2,
        maskPattern: 3,
        rendererOpts: {
          quality: 0.9
        }
      };
      QRCode.toDataURL(this.share_url, opts, (err, url) => {
        if (err) throw err;
        let img = document.getElementById("ewmImg");
        img.src = url;
      });
    },
    methods: {
      share() {
        if (!!this.$G.isWeiXin()) {
          //微信分享
          this.showTips = true;
        } else {
          //浏览器复制链接
          this.$copyText(this.share_url).then(
            e => {
              this.$jBox.success("复制成功<br>在浏览器地址栏中粘贴吧！");
            },
            e => {
              this.$jBox.error("复制失败");
            }
          );
        }
      },
      close() {
        this.showTips = false;
      },
      myInvite() {
        this.$router.push({
          name: "inviteList"
        });
      }
    }
  };
</script>
<style lang="less">
  @import url("../../assets/less/_variable.less");
  .invite-bar {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background: url("../../assets/img/invite/bg.png") no-repeat;
    background-size: cover;
    overflow-x: hidden;
    overflow-y: auto;

    .title {
      font-size: 45px;
      margin: 40px 0 20px;
      color: @white;
      text-shadow: 0px 2px 20px #d58502;
      font-weight: bold;
    }

    .content {
      @w: 200px;
      @h: @w;
      position: relative;
      display: block;
      width: 90%;
      padding: 50px 30px;
      border-radius: 5px;
      background: @white;
      box-shadow: 0px 0px 20px 0px rgba(245, 166, 35, 1);
      i {
        position: absolute;
        z-index: 88;
        img {
          display: block;
          width: 100%;
        }
      }

      .i-top {
        width: 40px;
        right: -15px;
        top: -25px;
      }

      .i-left {
        width: 30px;
        left: -6%;
        top: 50px;
      }

      .i-bto {
        width: 35px;
        bottom: -25px;
        right: 30px;
      }

      .ewm-bar {
        display: block;
        position: relative;
        margin: 0 auto;
        background: linear-gradient(
          136deg,
          rgba(250, 217, 97, 1) 0%,
          rgba(247, 107, 28, 1) 100%
        );
        padding: 18px;
        width: @w;
        height: @h;

        i {
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: @white;
          &.top {
            top: 0;
            margin-top: -7px;
            &.left {
              left: -7px;
            }
            &.right {
              right: -7px;
            }
          }
          &.bto {
            bottom: -7px;
            &.left {
              left: -7px;
            }
            &.right {
              right: -7px;
            }
          }
        }

        span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 46px;
          height: 46px;
          margin: -23px 0 0 -23px;
          background: #fff;
          padding: 4px;
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }

        > img {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      }

      .invite-btn {
        margin: 0 auto;
        margin-top: 30px;
        width: @w;
        > a {
          display: block;
          width: 100%;
          height: 46px;
          line-height: 46px;
          background: linear-gradient(
            180deg,
            rgba(250, 217, 97, 1) 0%,
            rgba(248, 134, 45, 1) 47%,
            rgba(247, 107, 28, 1) 88%,
            rgba(247, 167, 28, 1) 100%
          );
          box-shadow: 0px 10px 10px 0px rgba(253, 221, 169, 1);
          border-radius: 25px;
          text-align: center;
          color: @white;
          font-size: @fs-16;
        }
      }

      .invite-nav {
        margin-top: 20px;
        color: @main;
        text-align: center;
        font-size: @fs-15;
        span {
          position: relative;
          top: -1px;
          margin: 0 8px;
        }
      }
    }

    .share-tips {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      label {
        display: block;
        width: 172px;
        float: right;
        margin: 10px 20px 0 0;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>



