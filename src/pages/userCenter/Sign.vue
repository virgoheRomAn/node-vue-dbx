<template>
  <div class="buy-bar banks-bar">
    <div class="information-box mt-0">
      <div class="box-list-title">
        <h2 class="title">可提现余额</h2>
        <div class="container">
          <label class="tips">{{balanceStr}}元</label>
        </div>

        <h2 class="title mt-40">用户信息</h2>
        <div class="box-list-arrow-content left pl-5 pr-5">
          <ul>
            <li>
              <div class="content">
                <span>姓名</span>
                <el-input class="input" type="text" placeholder="请输入姓名" v-model="payName" :readonly="isSign" :clearable="!isSign && isCompany">
                </el-input>
              </div>
            </li>
            <li>
              <div class="content">
                <span>身份证</span>
                <el-input class="input" type="text" placeholder="请输入身份证" v-model="userInfo.idcard" :readonly="isSign" :clearable="!isSign"></el-input>
              </div>
            </li>
            <li>
              <div class="content">
                <span>银行卡号</span>
                <el-input class="input" type="tel" placeholder="请输入银行卡号" v-model="bankNo" clearable></el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="handle-box">
      <el-button class="user-btn" @click="sign()">下一步</el-button>
      <a class="link" target="_blank" href="/usercenter/s/capital">提现记录</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "sign",
  data() {
    return {
      isCompany: false,
      isSign: false,
      payName: "",
      userInfo: {},
      bankNo: "",
      balance: "",
    };
  },
  computed: {
    balanceStr() {
      return this.$G.moneyFormat(this.balance);
    },
  },
  created() {
    let obj = [
      {
        fun: this.getUserInfo(),
        callback: (data) => {
          this.userInfo = data;
        },
      },
      {
        fun: this.getWidthdrawInfo(),
        callback: (data) => {
          if (!!data) {
            this.balance = data.balance;
            this.bankNo = data.bankcardno;
            this.isSign = data.signstatus !== "0";
            this.isCompany = data.is_company === 1;
            this.payName = data.pay_name;
          }
        },
      },
    ];
    this.__G__.ajaxParataxisDataStep(this, obj);
  },
  methods: {
    showAgreement() {},
    getUserInfo() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/userInfo`, type: false })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getWidthdrawInfo() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/withdrawInfo`, type: false })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getBankList() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/bankList`, type: false })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    sign() {
      if (!this.userInfo.idcard) {
        this.$jBox.error("请输入身份证号码");
        return false;
      }

      if (!this.bankNo) {
        this.$jBox.error("请输入银行卡号");
        return false;
      }

      // 去签约
      if (!this.isSign) {
        this.API.post({ url: `/usercenter/withdrawSign`, params: { idCard: this.userInfo.idcard, bankCardno: this.bankNo, payName: this.payName }, type: false })
          .then((data) => {
            this.$router.push("/usercenter/s/withdraw");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$router.push("/usercenter/s/withdraw");
      }
    },
  },
};
</script>
