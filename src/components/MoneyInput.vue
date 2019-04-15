<template>
  <div class="money-input">
    <label class="container">
      <em>{{icon}}</em>
      <input ref="input" type="text" v-model="money" placeholder="请输入金额" @blur="blur()" @focus="focus()">
      <i class="sprite s-icon-close" v-if="isClose" @click.self="clear()"></i>
      <slot name="button"></slot>
    </label>
    <slot name="info"></slot>
  </div>
</template>

<script>
  export default {
    name: "moneyInput",
    props: {
      icon: {
        type: String,
        default: "￥"
      },
      isClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        money: "",
        moneyNumber: "",
        changeAfter: false
      };
    },
    created() {
      this.changeAfter = true;
      this.money = this.money && this.$G.moneyFormat(this.money, 2);
    },
    methods: {
      clear() {
        this.money = "";
        this.$refs.input.focus();
      },
      blur() {
        this.changeAfter = true;
        this.moneyNumber = this.money;
        this.money =
          this.money &&
          (this.money.indexOf(".") > 0
            ? this.$G.moneyFormat(this.money, 2)
            : this.$G.moneyFormat(this.money, 0));
      },
      focus() {
        this.changeAfter = false;
        this.moneyNumber = this.money;
        this.money = this.money && this.money.toString().replace(/[^0-9|^.]/gi, "");
      }
    },
    watch: {
      money: function(val) {
        if (!this.changeAfter) {
          let new_val = val.toString().replace(/[^0-9|^.]/gi, "");
          if (new_val.indexOf(".") > 0 && new_val.match(/\./gi).length > 1) {
            this.money =
              new_val.split(".")[0] +
              "." +
              new_val
                .split(".")
                .slice(1)
                .join("");
          } else {
            this.money = new_val;
          }
        }
      }
    },
    computed: {}
  };
</script>

<style lang="less">
  @import url("../assets/less/_variable.less");
  .money-input {
    position: relative;
    &.button {
      > label.container {
        padding-right: 90px;
      }
    }
    > label.container {
      position: relative;
      display: block;
      width: 100%;
      padding: 0 20px 10px;
      border-bottom: 1px solid @bd;
      min-height: 42px;
      em {
        position: absolute;
        top: 7px;
        left: 0;
        width: 20px;
        color: @light;
        font-size: @fs-19;
      }
      span {
        position: relative;
        display: block;
        width: 100%;
        height: 32px;
        color: @main;
        font-size: 27px;
        b {
          font-weight: normal;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
      input {
        display: block;
        width: 100%;
        border: 0 none;
        background: transparent;
        padding: 0 2px;
        color: @main;
        font-size: 27px;
        &::placeholder {
          font-size: 27px;
          color: @g-ddd;
          font-weight: normal;
        }
      }
      i {
        position: absolute;
        bottom: 12px;
        right: 0;
        z-index: 100;
      }
      .button {
        position: absolute;
        top: 50%;
        right: 5px;
        font-size: @fs-14;
        color: @link;
        height: 30px;
        line-height: 30px;
        margin-top: -15px;
      }
    }
    > label.tips {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      > span {
        color: @g-999;
        em {
          color: @main;
        }
      }
    }
  }
</style>
