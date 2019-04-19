<template>
  <div class="bank-info-bar">
    <div class="box-list-title">
      <h2 class="title big">银行卡信息</h2>
    </div>
    <div class="box-list-arrow-content left pl-5 pr-5">
      <ul>
        <mobile-select ref="bankPicker" title="请选择银行" resultField="bankInfo" :pickerData="bankData" :initData="bankInfo"
          @select="selectResult">
          <template slot="text">
            <span>银行名称</span>
            <label @click="showPicker('bankPicker')" :class="{'disable':!bankInfo.text}">{{bankInfo.text || "请选择银行名称"}}</label>
          </template>
        </mobile-select>
        <li>
          <div class="content">
            <span>银行卡号</span>
            <el-input class="input" type="tel" placeholder="请输入银行卡号" v-model="bankNo" clearable></el-input>
          </div>
        </li>
      </ul>
    </div>

    <div class="handle-box">
      <el-button class="user-btn" @click="next()">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { native_env, ajax_host } from "@/request/native.js";
export default {
  name: "bankInfo",
  data() {
    return {
      option: {
        img: "",
        mode: "100% auto",
        outputType: "png",
        fixedBox: false,
        fixedNumber: [28, 17],
        canMove: true,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: window.screen.width,
        autoCropHeight: window.screen.width / (560 / 340),
        cropData: {}
      },
      fileUploadUrl: ``,
      userName: "",
      bankNo: "",
      bankInfo: { code: "", text: "" },
      bankData: [this.CONST.BANK],
      bankMobile: ""
    };
  },
  created() {},
  methods: {
    showPicker(ref) {
      this.$refs[ref].showPicker();
    },
    selectResult(field, text, value) {
      this[field] = { text: text, code: value };
    },
    select(target, index, data) {
      this.bankInfo.name = data[0].value;
      this.bankInfo.value = data[0].id;
    },
    next() {
      if (!this.bankNo || !this.bankInfo.text) {
        this.$jBox.error("请输入相关银行卡信息");
        return false;
      }

      //保存银行卡信息
      this.$router.push(`/usercenter`);
    }
  }
};
</script>
<style lang="less">
.bank-info-bar {
  padding: 20px 20px 0;
}
</style>

