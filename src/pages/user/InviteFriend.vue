<template>
  <div class="module-container">
    <div class="invite-banner">
      <label><img src="../../assets/img/invite-banner.png"></label>
      <span>您的好友{{breakName}}，邀请您加入通融+家！</span>
    </div>

    <div class="user-bar">
      <div class="user-form">
        <div class="item">
          <span>手机号：</span>
          <div class="input">
            <el-input type="tel" placeholder="请输入手机号" v-model="mobile" maxlength="11" clearable>
            </el-input>
          </div>
        </div>
        <ver-code ref="verCode" :mobile="mobile"></ver-code>
      </div>
      <div class="user-handle">
        <label class="agreement">
          <el-checkbox v-model="agreement">
            <span>已阅读并同意<a href="javascript:;" @click="showAgreement">《用户服务协议》</a></span>
          </el-checkbox>
        </label>
        <label class="btn">
          <el-button class="user-btn" @click="register()">注册</el-button>
        </label>
      </div>
    </div>

    <div class="footer-copyright">
      <label>
        <span>@2017 通融+家 All rights Reserved</span>
        <span>客户电话：023-8815-1333</span>
      </label>
      <label>
        <span>市场有风险，投资需谨慎</span>
      </label>
    </div>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  import CONST from "@/assets/js/const";

  export default {
    name: "inviteFriend",
    components: {
      verCode
    },
    data() {
      return {
        mobile: "",
        agreement: true,
        break: {
          breakName: "",
          breakId: ""
        }
      };
    },
    mounted() {
      let breakName = this.$route.query.breakName;
      let breakId = this.$route.query.breakId;
      if (breakName && breakId) {
        this.break.breakName = breakName;
        this.break.breakId = breakId;
      } else {
        this.$jBox.error("获取经纪人信息失败");
        return false;
      }
    },
    computed: {
      breakName: function() {
        let reg = /^(\d{3})\d{4}(\d{4})$/;
        return this.break.breakName
          ? this.break.breakName.replace(reg, "$1****$2")
          : "";
      }
    },
    methods: {
      showAgreement() {},
      register() {
        let vue = this;
        if (!this.mobile) {
          this.$jBox.error("请输入手机号");
          return false;
        }

        if (!this.agreement) {
          this.$jBox.error("请勾选用户服务协议");
          return false;
        }

        this.userAPI
          .post(`/user/inviteRegister`, {
            mobile: this.mobile,
            brokerId: this.break.breakId,
            verCode: this.$refs.verCode.verCode
          })
          .then(data => {
            this.$jBox.success("注册成功", {
              closeFun: () => {
                vue.$router.push({
                  name: "InviteDone",
                  params: { mobile: this.mobile }
                });
              }
            });
          });
      }
    }
  };
</script>
<style lang="less">
  @import url("../../assets/less/_variable.less");
  .invite-banner {
    position: relative;
    display: block;
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
    > span {
      display: block;
      background: @btn;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      font-size: @fs-15;
      color: @white;
    }
  }
</style>



