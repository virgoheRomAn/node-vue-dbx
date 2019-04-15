<template>
  <div class="item">
    <div class="content">
      <a class="link" href="javascript:;" @click="jump(data.link)">
        <label class="name">{{data.name}}</label>

        <div class="info">
          <label class="rate">
            <span class="number">{{data.rate}}<em>%</em></span>
            <em class="text">预期年化收益率</em>
          </label>
          <label class="day">
            <span class="number">{{data.day}}<em>天</em></span>
            <em class="text">投资期限</em>
          </label>
          <label class="money">
            <span class="number">{{investmentAmount}}<em>元</em></span>
            <em class="text">起投金额</em>
          </label>
        </div>

        <div class="explain">
          <label>还款方式：{{repayType}}</label>
          <label v-for="(value,key) in data.explainList" :key="key">{{value}}</label>
        </div>

        <div class="progress-box">
          <label class="line">
            <span :style="{width:ratio}"></span>
          </label>
          <label class="text">
            <span>{{ratio}}</span>
            <span>{{amount}}</span>
          </label>
        </div>

        <slot class="other"></slot>
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    name: "item",
    props: {
      data: Object,
      default: function() {
        return {};
      }
    },
    computed: {
      repayType: function() {
        switch (this.data.repayType) {
          case "1":
            return "一次性还本付息";
        }
      },
      ratio: function() {
        if (this.data.status !== "2") {
          return (
            this.data.money &&
            this.$G.count
              .mul(this.$G.count.div(this.data.now, this.data.amount), 100)
              .toFixed(2) + "%"
          );
        } else {
          return "已售罄";
        }
      },
      amount: function() {
        let amount = this.data.money && this.$G.count.div(this.data.amount, 100);
        if (amount >= 10000) {
          amount = this.data.money && this.$G.count.div(amount, 10000) + "万元";
        } else {
          amount = amount + "元";
        }
        return amount;
      },
      investmentAmount: function() {
        return this.data.money && this.$G.count.div(this.data.money, 100);
      }
    },
    methods: {
      jump(url) {
        if (this.data.status === "shellout") {
          this.$jBox.error("该商品已售罄");
          return false;
        }

        this.$router.push(url);
      }
    }
  };
</script>