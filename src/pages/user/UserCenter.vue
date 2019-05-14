<template>
  <div class="module-container">
    <div class="user-center-bar">
      <div class="person-info">
        <label class="image"><img :src="userInfo.portrait"></label>
        <div class="user-intro">
          <label>{{userInfo.username}}<em class="status" :class="userInfo.approveCls">{{userInfo.approveText}}</em></label>
          <span>{{userInfo.mobile}}</span>
        </div>
        <a href="javascript:;" @click="goToSetting()">
          <i class="sprite s-icon-setting"></i>
        </a>
      </div>

      <person-assets :userHandle="true" :see_total_assets="true" :total_assets_type="true" :ajax_user_count="false"
        :ajax_count_data="user_count_data"></person-assets>

      <div class="person-card">
        <div class="box-list-arrow">
          <ul>
            <li>
              <a href="#">
                <label><i class="sprite s-icon-bank"></i></label>
                <span>我的保单</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a href="/usercenter/s/customer">
                <label><i class="sprite s-icon-capital"></i></label>
                <span>客户管理</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a href="/usercenter/s/help">
                <label><i class="sprite s-icon-trade"></i></label>
                <span>理赔帮助</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a href="/usercenter/s/question">
                <label><i class="sprite s-icon-appraisal"></i></label>
                <span>常见问题</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <fb-footer></fb-footer>
  </div>
</template>

<script>
import $G from "@/assets/js/global";

export default {
  name: "usercenter",
  data() {
    return {
      userInfo: {
        username: "",
        approve: "",
        approveCls: "",
        mobile: "",
        portrait: require("../../assets/img/user/headImg.png")
      },
      user_count_data: {
        totalAssets: "0",
        currentBalance: "0"
      }
    };
  },
  created() {
    let obj = [
      {
        fun: this.getUserInfo(),
        callback: data => {
          let reg = /^(\d{3})\d{4}(\d{4})$/;

          this.userInfo = data;

          this.userInfo.mobile = this.userInfo.mobile.replace(reg, "$1****$2");
          this.userInfo.approveCls =
            this.userInfo.approve === 0 ? "failed" : "success";

          this.userInfo.approveText =
            this.userInfo.approve === 0 ? "未认证" : "已认证";

          this.user_count_data.currentBalance = data.balance;
        }
      },
      {
        fun: this.getUserIncome(),
        callback: data => {
          if (!!data) {
            this.user_count_data.totalAssets = data.amount;
          }
        }
      }
    ];
    this.__G__.ajaxParataxisDataStep(this, obj);
  },
  methods: {
    getUserIncome() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/income`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/userInfo`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    goToSetting() {
      this.$router.push({ name: "settings" });
    }
  }
};
</script>