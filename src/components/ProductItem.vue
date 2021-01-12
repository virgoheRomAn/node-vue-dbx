<template>
  <div class="item">
    <div class="content">
      <a class="link" :href="data.link">
        <div class="header">
          <label class="image"><img :src="data.img" :alt="data.name"></label>

          <div class="information">
            <label class="name">
              <span>{{data.name}}</span>
              <span class="info">{{data.intro}}</span>
            </label>
            <label class="explain">
              <span>保障期限：{{data.bx_daylimit}}</span>
              <span>承保年龄：{{data.agelimit}}</span>
            </label>
          </div>
        </div>
        <div class="footer">
          <label class="price">
            <span class="m">保费：<em>{{data.lower_money}}</em></span>
            <span class="r" v-if="!!data.commission_rate">推广费：<em>{{data.commission_rate}}</em></span>
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
    default: function () {
      return {};
    },
  },
  methods: {
    jump(url) {
      if (this.data.status === "shellout") {
        this.$jBox.error("该商品已售罄");
        return false;
      }

      this.$router.push(url);
    },
  },
};
</script>