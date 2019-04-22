<template>
  <div class="money-input-bar">
    <div class="money-container">
      <label class="input">
        <em>{{icon}}</em>
        <input ref="input" :type="inputType" v-model="money" placeholder="请输入金额" @blur="blur()" @focus="focus()">
        <i class="sprite s-icon-close" v-if="isClose" @click.self="clear()"></i>
      </label>
      <slot name="button"></slot>
    </div>
    <label class="error-tips" v-if="moneyError">{{errorText}}</label>
    <div class="tips" v-else>
      <slot name="info"></slot>
    </div>
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
      moneyError: false,
      changeAfter: false,
      inputType: "number"
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
      this.inputType = "text";
      this.changeAfter = true;
      this.moneyNumber = this.money;
      this.money =
        this.money &&
        (this.money.indexOf(".") > 0
          ? this.$G.moneyFormat(this.money, 2)
          : this.$G.moneyFormat(this.money, 0));
    },
    focus() {
      this.inputType = "number";
      this.changeAfter = false;
      this.moneyNumber = this.money;
      this.money =
        this.money && this.money.toString().replace(/[^0-9|^.]/gi, "");
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
.money-input-bar {
  position: relative;
  display: block;
  width: 100%;

  .money-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid @bd;
    .input {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 42px;
      em {
        width: 20px;
        color: @light;
        font-size: @fs-20;
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
        position: relative;
        top: -5px;
        width: 0;
        flex: 1;
        border: 0 none;
        background: transparent;
        padding: 0 2px;
        color: @main;
        font-size: 30px;
        &::placeholder {
          font-size: @fs-18;
          color: @g-ddd;
          font-weight: normal;
        }
      }
    }

    .button {
      font-size: @fs-14;
      color: @link;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 70px;
    }
  }
  > .tips {
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
  > .error-tips {
    display: flex;
    margin-top: 10px;
    color: @red;
  }
}
</style>
