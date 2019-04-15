<template>
  <div class="psd-input-bar">
    <h2 :class="titleCls">
      <slot name="title"></slot>
    </h2>
    <div class="psd-input" :class="inputCls" @click="showKeyBoard()">
      <ul class="input-list">
        <!-- <li><input type="password" maxlength="1" disabled :value="!!payPassword[0] ? payPassword[0] : ''" /></li>
        <li><input type="password" maxlength="1" disabled :value="!!payPassword[1] ? payPassword[1] : ''" /></li>
        <li><input type="password" maxlength="1" disabled :value="!!payPassword[2] ? payPassword[2] : ''" /></li>
        <li><input type="password" maxlength="1" disabled :value="!!payPassword[3] ? payPassword[3] : ''" /></li>
        <li><input type="password" maxlength="1" disabled :value="!!payPassword[4] ? payPassword[4] : ''" /></li>
        <li><input type="password" maxlength="1" disabled :value="!!payPassword[5] ? payPassword[5] : ''" /></li> -->
        <li :class="{'active':!!payPassword[0]}"></li>
        <li :class="{'active':!!payPassword[1]}"></li>
        <li :class="{'active':!!payPassword[2]}"></li>
        <li :class="{'active':!!payPassword[3]}"></li>
        <li :class="{'active':!!payPassword[4]}"></li>
        <li :class="{'active':!!payPassword[5]}"></li>
      </ul>
    </div>
    <label class="psd-handle">
      <slot name="handle"></slot>
    </label>
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex";
  export default {
    name: "psdInput",
    props: {
      titleCls: {
        type: String,
        default: null
      },
      inputCls: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapState({
        payPassword: state => state.payPassword
      })
    },
    methods: {
      ...mapActions(["showKeyBoard"])
    }
  };
</script>

<style lang="less">
  @import url("../../assets/less/_variable");
  .psd-input-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    h2 {
      display: block;
      width: 100%;
      margin-bottom: 15px;
      font-size: @fs-15;
      color: @main;
      text-align: center;
    }
    .psd-input {
      display: block;
      width: 100%;
      ul {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        border: 1px solid @main;
        border-radius: 3px;
        height: 46px;
        overflow: hidden;
        li {
          position: relative;
          width: 16.666%;
          height: 100%;
          border-right: 1px solid @main;
          &:last-child {
            border-right: 0 none;
          }
          &.active {
            display: flex;
            align-items: center;
            justify-content: center;
            &::before {
              content: "";
              display: block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: @black;
            }
          }
          > input {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            border: 0 none;
            background: transparent;
            text-align: center;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
