<template>
  <div class="banks-bar pad-all-0">
    <div class="user-bar">
      <div class="user-form">
        <h2 class="title"><span>请填写身份信息</span></h2>
        <div class="item" :disabled="hasBankCard">
          <span>姓名</span>
          <div class="input">
            <el-input type="text" placeholder="请输入真实姓名" v-model="userName" clearable :disabled="hasBankCard">
            </el-input>
          </div>
        </div>
        <div class="item" :disabled="hasBankCard">
          <span>身份证号</span>
          <div class="input">
            <el-input type="text" placeholder="请输入身份证号" v-model="idNo" maxlength="18" clearable :disabled="hasBankCard">
            </el-input>
          </div>
        </div>
      </div>

      <div class="user-form pt-10">
        <h2 class="title">
          <span>请填写银行卡</span>
          <label @click="lookBankInfo()">
            <i class="sprite s-icon-bank-info"></i>
            <em>支持的银行卡及充值限额</em>
          </label>
        </h2>
        <div class="item">
          <span>选择银行</span>
          <div class="input">
            <el-select v-model="bankName" clearable placeholder="请选择" @change="selectBank" @clear="clearBank">
              <el-option v-for="item in bankList" :key="item.value" :label="item.label" :value="item.value + '|' + item.payDayLimit + '|' + item.payOneLimit">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item" disabled>
          <span>单笔限额</span>
          <div class="input">
            <el-input type="text" value="1万元" v-model="singleStroke" disabled>
            </el-input>
          </div>
        </div>
        <div class="item" disabled>
          <span>单日限额</span>
          <div class="input">
            <el-input type="text" value="1万元" v-model="singleDay" disabled>
            </el-input>
          </div>
        </div>
        <div class="item">
          <span>借记卡号</span>
          <div class="input">
            <el-input type="text" placeholder="请输入借记卡号" v-model="bankCardNo" clearable>
            </el-input>
          </div>
        </div>
        <div class="item">
          <span>预留手机号</span>
          <div class="input">
            <el-input type="tel" placeholder="请输入预留手机号" v-model="mobile" maxlength="11" clearable>
            </el-input>
          </div>
        </div>

        <ver-code ref="verCode" :mobile="mobile" :bindCard="bindCardInfo"></ver-code>

      </div>
      <div class="user-handle">
        <label class="btn">
          <el-button class="user-btn" @click="addBank()">绑定</el-button>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
  import verCode from "components/VerCode";
  export default {
    name: "addBank",
    components: { verCode },
    data() {
      return {
        userName: "",
        idNo: "",
        mobile: "",
        bankName: "",
        hasBankCard: false,
        bankCardNo: "",
        bindCardInfo: {},

        singleStroke: "请选择银行",
        singleDay: "请选择银行",
        bankList: []
      };
    },
    created() {
      this.bindCardInfo = {
        realName: this.userName,
        certificateNo: this.idNo,
        bankName: this.bankName,
        cardNo: this.bankCardNo,
        change: this.hasBankCard
      };
    },
    watch: {
      userName(val) {
        this.bindCardInfo.realName = val;
      },
      idNo(val) {
        this.bindCardInfo.certificateNo = val;
      },
      bankName(val) {
        this.bindCardInfo.bankName = val;
      },
      bankCardNo(val) {
        this.bindCardInfo.cardNo = val;
      }
    },
    created() {
      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        if (Object.keys(data).length !== 0 && data && data.bankCardNo) {
          this.userName = data.name;
          this.idNo = data.idNo;
          this.hasBankCard = true;
          this.bindCardInfo.change = this.hasBankCard;
        }
      });
      this.userAPI.get(`/basic/banks`).then(data => {
        data.map(item => {
          this.bankList.push({
            value: item.bankCardName,
            label: item.bankCardName,
            code: item.bankCode,
            payDayLimit: item.payDayLimit,
            payOneLimit: item.payOneLimit
          });
        });
      });
    },
    methods: {
      selectBank(value) {
        let result = value.split("|");
        this.bankName = result[0];

        this.singleDay =
          result[1] >= 10000
            ? this.$G.count.div(result[1], 10000) + "万元"
            : result[1] + "元";

        this.singleStroke =
          result[2] >= 10000
            ? this.$G.count.div(result[2], 10000) + "万元"
            : result[2] + "元";
      },
      clearBank() {
        this.bankName = "";
        this.singleDay = "请选择银行";
        this.singleStroke = "请选择银行";
      },
      lookBankInfo() {
        let html = "";
        html += "<table class='limit-table'>";
        html +=
          "<thead><tr><th>银行</th><th>单笔限额</th><th>单日限额</th></tr></thead>";
        html += "<tbody>";
        this.bankList.map(item => {
          html +=
            "<tr><td>" +
            item.label +
            "</td><td>" +
            this.$G.count.div(item.payOneLimit, 10000) +
            "万元" +
            "</td><td>" +
            this.$G.count.div(item.payDayLimit, 10000) +
            "万元" +
            "</td></tr>";
        });
        html += "</tbody>";
        html += "</table>";

        this.$alert(html, "支持银行卡和充值限额", {
          customClass: "limit-meessage-box",
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定"
        });
      },
      addBank() {
        if (!this.hasBankCard) {
          let params = {
            realName: this.userName,
            certificateNo: this.idNo,
            bankName: this.bankName,
            cardNo: this.bankCardNo,
            phone: this.mobile,
            cardOrderId: this.$refs.verCode.orderData,
            smsCode: this.$refs.verCode.verCode
          };

          this.userAPI
            .bindCardSubmit(params)
            .then(data => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push({
                  name: "bankDone"
                });
              }
            })
            .catch(data => {
              console.log(data);
            });
        } else {
          let params = {
            bankName: this.bankName,
            cardNo: this.bankCardNo,
            phone: this.mobile,
            cardOrderId: this.$refs.verCode.orderData,
            smsCode: this.$refs.verCode.verCode
          };

          this.userAPI
            .changeCardSubmit(params)
            .then(data => {
              this.$router.push({
                name: "bankDone"
              });
            })
            .catch(data => {
              console.log(data);
            });
        }
      }
    }
  };
</script>
<style lang="less">
  .limit-meessage-box {
    .el-message-box__content {
      max-height: 300px;
      margin: 7px 0 0 0;
      padding: 0 10px !important;
      overflow: hidden;
      overflow-y: scroll;
      border-top: 1px solid #dfe4ea;
    }
  }
  .limit-table {
    width: 100%;
    th,
    td {
      text-align: left;
      padding: 8px 5px 8px 10px;
      border-top: 1px solid #dfe4ea;
      border-right: 1px solid #dfe4ea;
      font-size: 12px;
    }

    th {
      border-top: 0 none;
      &:last-child {
        border-right: 0 none;
      }
    }

    td:nth-child(3n) {
      border-right: 0 none;
    }
  }
</style>


