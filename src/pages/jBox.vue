<template>
  <div class="jBox-bar">
    <div class="jBox-handle">
      <h2>提示框</h2>
      <ul>
        <li v-for="(value,key) in jBoxAlert" :key="key">
          <el-button class="user-btn line" @click="value.callback(value.opts)">{{value.text}}</el-button>
        </li>
      </ul>
    </div>
    <div class="jBox-handle">
      <h2>确认框</h2>
      <ul>
        <li v-for="(value,key) in jBoxConfirm" :key="key">
          <el-button class="user-btn line" @click="value.callback(value.opts)">{{value.text}}</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import jBox from "assets/plugins/jBox.1";
  export default {
    name: "jBox",
    data() {
      return {
        jBoxAlert: [],
        jBoxConfirm: []
      };
    },
    created() {
      this.jBoxAlert = [
        {
          text: "提示框",
          opts: {
            cont: "简单提示框",
            params: {}
          },
          callback: opts => {
            jBox.alert(opts.cont, opts.params);
          }
        },
        {
          text: "错误提示框",
          opts: {
            cont: "错误提示框",
            params: {}
          },
          callback: opts => {
            jBox.error(opts.cont, opts.params);
          }
        },
        {
          text: "成功提示框",
          opts: {
            cont: "成功提示框",
            params: {}
          },
          callback: opts => {
            jBox.success(opts.cont, opts.params);
          }
        },
        {
          text: "loading提示框",
          opts: {
            cont: "loading提示框",
            params: {}
          },
          callback: opts => {
            jBox.loading(opts.cont, opts.params);
          }
        }
      ];

      this.jBoxConfirm = [
        {
          text: "文本输入框",
          opts: {
            cont: "这是个标准提示框",
            params: {}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        },
         {
          text: "单个按钮确认框",
          opts: {
            cont: "这是个标准提示框",
            params: {}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        },
        {
          text: "标准模式",
          opts: {
            cont: "这是个标准提示框",
            params: {title:"123456"}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        },
        {
          text: "IOS模式",
          opts: {
            cont: "这是个IOS模式提示框",
            params: {}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        },
        {
          text: "Andriod模式",
          opts: {
            cont: "这是个Andriod模式提示框",
            params: {}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        },
        {
          text: "Custom模式",
          opts: {
            cont: "这是个Custom模式提示框",
            params: {}
          },
          callback: opts => {
            jBox.confirm(opts.cont, opts.params);
          }
        }
      ];
    }
  };
</script>

<style lang="less">
  .jBox-bar {
    padding: 20px 10px;
    .jBox-handle {
      display: block;
      margin-bottom: 20px;
      h2 {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        font-size: 17px;
        padding: 0 5px;
        &::before {
          content: "";
          width: 3px;
          height: 15px;
          background: #f90;
          margin-right: 5px;
        }
      }
      ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        li {
          flex: 1 1 33.33%;
          padding: 0 5px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
