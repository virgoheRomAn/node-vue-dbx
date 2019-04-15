<template>
  <div class="banks-bar">
    <bank-card ref="bankCard" :cardClass="cardClass" :callback="info"></bank-card>
    <div class="information-box">
      <div class="box-list-title">
        <h2 class="title">身份/银行卡信息</h2>
        <div class="container">
          <div class="box-list-arrow title-width item">
            <ul>
              <li>
                <label>姓名</label>
                <span>{{cardInfo.userName}}</span>
              </li>
              <li>
                <label>身份证号</label>
                <span>{{idNo}}</span>
              </li>
              <li>
                <label>开户行</label>
                <span>{{cardInfo.bankName}}</span>
              </li>
              <li>
                <label>储蓄卡号</label>
                <span>{{bankCardNo}}</span>
              </li>
              <li>
                <label>银行预留手机号</label>
                <span>{{bankMobile}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="change-bank">
      <el-button class="user-btn" @click="changeBank()">更换银行卡</el-button>
    </div>
  </div>
</template>

<script>
  import BankCard from "components/BankCard";
  export default {
    name: "changeBank",
    components: {
      BankCard
    },
    data() {
      return {
        hasCard: true,
        cardClass: "card-zs",
        cardInfo: {
          userName: "徐继强",
          idCardNo: "152103199006181819",
          bankName: "招商银行",
          userMoblie: "17723558969",
          cardNo: ""
        }
      };
    },
    computed: {
      idNo: function() {
        let idCardNo = this.cardInfo.idCardNo;
        let before = idCardNo.substring(0, 5);
        let after = idCardNo.substring(idCardNo.length - 4, idCardNo.length);
        return before + "********" + after;
      },
      bankCardNo: function() {
        let cardNo = this.cardInfo.cardNo;
        let after =
          "**** **** **** " + cardNo.substring(cardNo.length - 4, cardNo.length);
        return after;
      },
      bankMobile: function() {
        let reg = /^(\d{3})\d{4}(\d{4})$/;
        return this.cardInfo.userMoblie.replace(reg, "$1****$2");
      }
    },
    methods: {
      info(value) {
        this.cardInfo = {
          userName: value.name,
          idCardNo: value.idNo,
          bankName: value.bankCardName,
          userMoblie: value.bankObileNo,
          cardNo: value.bankCardNo
        };
      },
      changeBank() {
        this.$router.push({
          name: "addBank",
          query: { title: "更换新的银行卡" }
        });
      }
    }
  };
</script>

<style>
</style>
