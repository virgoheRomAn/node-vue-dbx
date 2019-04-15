<template>
  <div class="module-container">
    <div class="user-center-bar">
      <div class="person-info">
        <label><img :src="headPhoto"></label>
        <span>{{userNameReg}}</span>
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
              <a :href="'/usercenter/s/banks/' + userName">
                <label><i class="sprite s-icon-bank"></i></label>
                <span>我的银行卡</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a :href="'/usercenter/s/capital/' + userName">
                <label><i class="sprite s-icon-capital"></i></label>
                <span>资金管理</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a :href="'/usercenter/s/trades/' + userName">
                <label><i class="sprite s-icon-trade"></i></label>
                <span>交易记录</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a :href="isAppraisal ? '/usercenter/s/appraisalResult/' + userName : '/usercenter/s/appraisal/' + userName">
                <label><i class="sprite s-icon-appraisal"></i></label>
                <span>风险评测</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="person-card">
        <div class="box-list-arrow">
          <ul>
            <li>
              <a :href="'/usercenter/s/activity/' + userName">
                <label><i class="sprite s-icon-activity"></i></label>
                <span>活动管理</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a :href="'/usercenter/s/message/' + userName">
                <label><i class="sprite s-icon-message"></i></label>
                <span>消息管理</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a :href="'/usercenter/s/password/' + userName">
                <label><i class="sprite s-icon-password"></i></label>
                <span>密码管理</span>
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
  import CONST from "@/assets/js/const";
  import PersonAssets from "@/components/PersonAssets";

  export default {
    name: "usercenter",
    components: {
      PersonAssets
    },
    data() {
      return {
        headPhoto: require("../../assets/img/user/headImg.png"),
        userName: "",
        isAppraisal: false,
        user_count_data: {
          totalAssets: "0",
          currentBalance: "0",
          totalIncomeAmount: "0",
          totalInvestAmount: "0"
        }
      };
    },
    created() {
      let obj = [
        {
          fun: this.getUserExtData(),
          callback: data => {
            if (Object.keys(data).length !== 0 && data && data.riskAssessment) {
              this.isAppraisal = true;
            } else {
              this.isAppraisal = false;
            }

            if (Object.keys(data).length !== 0 && data && data.headPortrait) {
              this.headPhoto = data.headPortrait;
            } else {
              this.headPhoto = require("../../assets/img/user/headImg.png");
            }
          }
        },
        {
          fun: this.getUserCount(),
          callback: data => {
            if (!!data) {
              this.user_count_data.totalAssets = data.total_assets;
              this.user_count_data.currentBalance = data.current_balance;
              this.user_count_data.totalIncomeAmount = data.totalIncomeAmount;
              this.user_count_data.totalInvestAmount = data.totalInvestAmount;
            }
          }
        }
      ];
      this.__G__.ajaxParataxisDataStep(this, obj);
    },
    mounted() {
      let userInfo = this.__G__.getItem([CONST.USERINFO]);
      if (!userInfo) {
        this.$jBox.error("获取用户信息错误<br>请重新登陆", {
          closeFun: () => {
            vue.$router.push({
              name: "login",
              query: { redirect: vue.$route.fullPath }
            });
          }
        });
        return false;
      }

      this.userName = JSON.parse(userInfo).userName;
    },
    computed: {
      userNameReg: function() {
        let reg = /^(\d{3})\d{4}(\d{4})$/;
        return this.userName
          ? this.userName.replace(reg, "$1****$2")
          : "请先登录";
      }
    },
    methods: {
      getUserExtData() {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/userCenter/userExtData`)
            .then(res => {
              let data = res.data.data;
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getUserCount() {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/userCenter/account`)
            .then(res => {
              let data = res.data.data;
              if (res.data.code !== 200) {
                reject(res.data);
              } else {
                resolve(data);
              }
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

<style lang="less">
  @import "../../assets/less/user.less";
</style>