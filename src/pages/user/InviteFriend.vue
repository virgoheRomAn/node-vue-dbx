<template>
  <div class="module-container">
    <div class="invite-banner">
      <h2>邀请注册</h2>
      <div class="tips">
        <span>邀请人：</span>
        <label>{{breakName}}</label>
      </div>
    </div>

    <div class="user-bar">
      <div class="user-form mt-0">
        <div class="item">
          <span>手机号：</span>
          <div class="input">
            <el-input type="tel" placeholder="请输入手机号" v-model="mobile" maxlength="11" clearable>
            </el-input>
          </div>
        </div>
        <ver-code ref="verCode" :mobile="mobile" :payPwd="false"></ver-code>
        <div class="item">
          <span>密码：</span>
          <div class="input">
            <el-input type="password" placeholder="请输入密码" v-model="password" minlength="6" clearable>
            </el-input>
          </div>
        </div>
      </div>
      <div class="user-tips">
        <label>根据国家规定需要进行实名认证</label>
      </div>
      <div class="user-form mt-0">
        <div class="item">
          <span>真实姓名：</span>
          <div class="input">
            <el-input type="text" placeholder="请输入真实姓名" v-model="name" clearable>
            </el-input>
          </div>
        </div>
        <div class="item">
          <span>身份证号：</span>
          <div class="input">
            <el-input type="tel" placeholder="请输入身份证号" v-model="idNo" clearable>
            </el-input>
          </div>
        </div>
      </div>
      <div class="user-handle">
        <label class="agreement">
          <el-checkbox v-model="agreement">
            <span>已阅读并同意<a href="javascript:;" @click="showAgreement">《用户服务协议》</a></span>
          </el-checkbox>
        </label>
        <label class="btn">
          <el-button class="user-btn" @click="register()">立即注册</el-button>
        </label>
      </div>
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
      password: "",
      name: "",
      idNo: "",
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
      if (!this.mobile) {
        this.$jBox.error("请输入手机号");
        return false;
      }

      if (!this.$refs.verCode.verCode) {
        this.$jBox.error("请输入手机验证码");
        return false;
      }

      if (!this.password) {
        this.$jBox.error("请输入密码");
        return false;
      }

      if (!this.name) {
        this.$jBox.error("请输入真实姓名");
        return false;
      }

      if (!this.idNo) {
        this.$jBox.error("请输入身份证号码");
        return false;
      }

      if (!this.agreement) {
        this.$jBox.error("请勾选用户服务协议");
        return false;
      }

      this.API.post({
        url: `/user/register`,
        params: {
          topUid: this.break.breakId,
          mobile: this.mobile,
          smscode: this.$refs.verCode.verCode,
          password: this.password,
          userName: this.name,
          idCard: this.idNo
        }
      }).then(data => {
        this.$jBox.success("注册成功", {
          closeCallback: () => {
            this.API.post({
              url: `/user/login`,
              params: {
                username: this.mobile,
                password: this.password
              }
            }).then(data => {
              this.$router.push("/");
            });
          }
        });
      }).catch(err=>{
        console.log(err);
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
  .tips {
    padding: 0 20px;
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    font-size: @fs-14;
    span {
      display: inline-block;
      width: 70px;
      color: @main;
    }
    &:after {
      content: "";
      display: block;
      border-bottom: 1px solid @bd;
    }
  }
  h2 {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 30px;
    padding: 30px 0 15px;
  }
  > span {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-size: @fs-14;
  }
}

.user-tips {
  padding: 0 20px;
  margin: 50px 0 20px;
  font-size: @fs-16;
  text-align: center;
}
</style>



