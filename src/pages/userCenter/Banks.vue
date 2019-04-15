<template>
  <div class="banks-bar">
    <bank-card :cardClass="cardClass" v-on:card-details="cardDetails" v-if="hasCard"></bank-card>
    <div class="add-card" v-else>
      <a href="javascript:;" @click="addCard()">
        <i class="sprite s-icon-add-bank"></i>
        <span>添加银行卡</span>
      </a>
    </div>
  </div>
</template>

<script>
  import BankCard from "components/BankCard";
  export default {
    name: "banks",
    components: {
      BankCard
    },
    data() {
      return {
        hasCard: true,
        cardClass: "card-zs"
      };
    },
    mounted() {
      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        if (Object.keys(data).length !== 0 && data && data.bankCardNo) {
          this.hasCard = true;
        } else {
          this.hasCard = false;
        }
      });
    },
    methods: {
      cardDetails: function() {
        this.$router.push({
          name: "changeBank"
        });
      },
      addCard: function() {
        this.$router.push({
          name: "addBank"
        });
      }
    }
  };
</script>

<style>
</style>
