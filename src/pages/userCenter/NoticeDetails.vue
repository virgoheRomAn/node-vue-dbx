<template>
  <div class="notice-details">
    <div class="header">
      <h2 class="title">{{noticeDetails.announcementTitle}}</h2>
      <div class="info">
        <label class="intro">{{noticeDetails.announcementInfo}}</label>
      </div>
    </div>
    <div class="content" v-html="noticeDetails.announcementContent"></div>
    <div class="footer">
      <label class="time">{{noticeDetails.createTime}}</label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "noticeDetails",
    data() {
      return {
        noticeDetails: {}
      };
    },
    created() {
      var vue = this;
      this.userAPI
        .get(`/basic/notice/${this.$route.params.noticeID}`)
        .then(data => {
          if (!!data) {
            data.createTime =
              "创建时间：" + this.$G.getDateByTime(data.createTime);
            this.noticeDetails = data;
          } else {
            this.$jBox.error("没有数据，返回列表", {
              closeFun: () => {
                vue.$router.push({
                  name: "notice"
                });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
</script>

<style lang="less">
  .notice-details {
    padding: 20px;
    .header {
      display: block;
      margin-bottom: 10px;
      text-align: left;
      .title {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      .info {
        display: block;
        margin-top: 10px;
        label {
          display: block;
          font-size: 12px;
          color: #666;
        }
        .time {
          display: block;
          color: #999999;
          font-size: 12px;
          margin-top: 8px;
        }
      }
    }
    .content {
      display: block;
      padding: 20px 0;
      p {
        margin: 8px 0;
        // text-indent: 2em;
        line-height: 24px;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: initial;
        font-weight: 700;
      }
      img {
        // display: block;
        // width: 100% !important;
        // height: auto !important;
        max-width: 100%;
      }
    }
    .footer {
      .time {
        display: block;
        text-align: right;
        margin-left: 15px;
        color: #999999;
        font-size: 12px;
      }
    }
  }
</style>
