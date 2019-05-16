<template>
  <div class="invite-bar">
    <h2 class="title">邀请好友注册</h2>
    <div class="content">
      <div class="ewm-bar" id="ewmBox">
        <span><img src="../../assets/img/share-logo.jpg"></span>
        <img ref="ewm">
      </div>
      <div class="invite-btn">
        <a href="javascript:;" @click="share()">立即注册</a>
      </div>
      <div class="invite-nav">
        <a>我的邀请</a>
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
  created() {
    this.API.get({ url: `/usercenter/userInfo` })
      .then(data => {
        this.breakName = data.mobile;
        this.breakId = data.userID;
        this.share_url = `http://${
          window.location.host
        }/invite/s/friend?breakName=${this.breakName}&breakId=${this.breakId}`;

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
          let img = this.$refs.ewm;
          img.src = url;
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    share() {
      console.log(this.share_url);
      window.location.href = this.share_url;
      // if (!!this.$G.isWeiXin()) {
      //   //微信分享
      //   this.showTips = true;
      // } else {
      //   //浏览器复制链接
      //   this.$copyText(this.share_url).then(
      //     e => {
      //       this.$jBox.success("复制成功<br>在浏览器地址栏中粘贴吧！");
      //     },
      //     e => {
      //       this.$jBox.error("复制失败");
      //     }
      //   );
      // }
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
  background: url("../../assets/img/invite/bg.jpg") no-repeat;
  background-size: cover;
  overflow-x: hidden;
  overflow-y: auto;

  .title {
    font-size: 40px;
    margin: 70px 0 30px;
    color: @white;
    text-shadow: 0px 2px 20px #077f93;
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
    box-shadow: 0px 0px 20px 0px #95cfd8;
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
      background: linear-gradient(136deg, #72e6f9 0%, #25abc3 100%);
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
          #46c5db 0%,
          #36b9d0 47%,
          #29afc7 88%,
          #098496 100%
        );
        box-shadow: 0px 10px 10px 0px #c2f7ff;
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



