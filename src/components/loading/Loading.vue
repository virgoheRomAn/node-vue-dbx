<template>
  <label class="loading-bar">
    <img src="./loading.gif">
    <span>
      <slot></slot>
    </span>
  </label>
</template>
<script>
  export default {
    name: "loading"
  };
</script>
<style lang="less" scoped>
  @fs: 14px;
  @color: #666666;
  .loading-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    vertical-align: middle;
    // margin-bottom: 15px;
    img {
      display: block;
      width: 20px;
      height: 20px;
    }
    span {
      display: block;
      margin-left: 5px;
      font-size: @fs;
      color: @color;
    }
  }
</style>
