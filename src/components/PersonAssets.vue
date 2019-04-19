<template>
  <div class="person-assets">
    <div class="info">
      <ul>
        <li v-for="(value,key,index) in user_assets_count" :key="key">
          <div class="content">
            <label class="t">
              <span>{{assets[index]}}</span>
              <template v-if="index===0">
                <em>(元)</em>
                <a href="javascript:;" v-if="see_total_assets" @click="showAssets()" :class="{'unlook':!uAssetsLook}">
                  <i class="sprite s-icon-look"></i>
                </a>
              </template>
            </label>
            <template v-if="total_assets_type">
              <template v-if="index===0">
                <label class="c" v-if="uAssetsLook">{{value | fMoney}}</label>
                <label class="c" v-else>******</label>
              </template>
              <template v-else>
                <label class="c">{{value | fMoney}}</label>
              </template>
            </template>
            <template v-else>
              <label class="c">{{value | fMoney}}</label>
            </template>
          </div>
        </li>
      </ul>
    </div>
    <div class="handle" v-if="userHandle">
      <a :href="'/usercenter/s/recharge/' + userName">查看收入</a>
      <a :href="'/usercenter/s/withdraw/' + userName">余额提现</a>
    </div>
  </div>
</template>

<script>
import $G from "@/assets/js/global";
import CONST from "@/assets/js/const";
export default {
  name: "assets",
  props: {
    userHandle: {
      type: Boolean,
      default: true
    },
    ajax_user_count: {
      type: Boolean,
      default: true
    },
    ajax_count_data: {
      type: Object,
      default: null
    },
    total_assets_type: {
      type: Boolean,
      default: false
    },
    see_total_assets: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uAssetsLook: false,
      userName: "",
      user_assets_count: {
        totalAssets: "0",
        currentBalance: "0"
      },
      assets: ["我的收入", "我的余额"]
    };
  },
  created() {
    this.uAssetsLook = !!this.__G__.getItem([CONST.USERASSETS])
      ? JSON.parse(this.__G__.getItem([CONST.USERASSETS]))
      : true;
  },
  mounted() {
    let vue = this;

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

    if (this.ajax_user_count) {
      //组件内加载数据
      this.userAPI.get(`/userCenter/account`).then(data => {
        this.user_assets_count = {
          totalAssets: data.total_assets,
          currentBalance: data.current_balance,
          totalIncomeAmount: data.totalIncomeAmount,
          totalInvestAmount: data.totalInvestAmount
        };
      });
    } else {
      //父组件传递数据
      this.user_assets_count = this.ajax_count_data;
    }
  },
  filters: {
    fMoney: function(value) {
      return value.toString().indexOf("*") < 0
        ? $G.moneyFormat($G.count.div(value, 100))
        : value;
    }
  },
  methods: {
    showAssets: function() {
      this.uAssetsLook = !this.uAssetsLook;
      this.__G__.setItem([CONST.USERASSETS], this.uAssetsLook);
    }
  }
};
</script>

<style>
</style>
