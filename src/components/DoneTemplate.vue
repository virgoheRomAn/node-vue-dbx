<template>
  <div class="done-box">
    <div class="info-box">
      <label :class="img_cls">
        <i><img :src="img_url"></i>
        <slot name="tips"></slot>
      </label>
      <slot name="info"></slot>
    </div>
    <slot name="content"></slot>
    <div class="handle-box">
      <el-button v-for="(item,key) in buttons" :key="key" :class="item.cls" class="user-btn" @click="item.callback">{{item.text}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tips",
    props: {
      img_url: {
        type: String,
        default: null
      },
      img_cls: {
        type: String,
        default: null
      },
      buttons: {
        type: Array,
        default: function() {
          return [{ text: "确定", cls: "", callback: function() {} }];
        }
      }
    }
  };
</script>

<style lang="less">
  @import url("../assets/less/_variable.less");
  .done-box {
    position: relative;
    display: block;
    width: 100%;
    padding: 0 20px;
    .info-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      label {
        display: block;
        margin-top: 35px;
        i {
          display: block;
          width: 60px;
          margin: auto;
          img {
            display: block;
            width: 100%;
          }
        }
        .tips {
          display: block;
          margin-top: 15px;
          font-size: 24px;
          color: @main;
        }
      }
      .info {
        display: block;
        width: 85%;
        margin-top: 10px;
        font-size: @fs-13;
        color: @g-999;
        line-height: 20px;
        text-align: center;
      }
    }
    .handle-box {
      margin-top: 60px;
    }
  }
</style>
