<template>
  <div class="module-container">
    <div class="product-details-bar">
      <div class="details-box">
        <div class="card-box">
          <label class="name">{{product_name}}</label>
          <label class="rate">
            <span>{{rate}}<em>%</em></span>
            <span>预期年化收益率</span>
          </label>
          <div class="fund">
            <label>
              <span>起投金额(元)</span>
              <em>{{start_amountStr}}</em>
            </label>
            <label>
              <span>封闭期限(天)</span>
              <em>{{end_day}}</em>
            </label>
          </div>
        </div>
        <div class="progress-box">
          <label class="line">
            <span :style="{width:ratio}"></span>
          </label>
          <label class="text">
            <span>{{ratio}}</span>
            <span>{{total_amountStr}}</span>
          </label>
        </div>
        <div class="day-line-box">
          <label class="text start">
            <span>挂牌日</span>
            <em>{{start_date}}</em>
          </label>
          <label class="day-line"></label>
          <label class="text mid">
            <span>起息日</span>
            <em>{{setupDate}}</em>
          </label>
          <label class="day-line"></label>
          <label class="text end">
            <span>到期日</span>
            <em>{{interestsEndDate}}</em>
          </label>
        </div>
        <div class="information-box">
          <div class="box-list-title">
            <h2 class="title">热门产品展示</h2>
            <div class="container">
              <div class="box-list-arrow item">
                <ul>
                  <li>
                    <label>产品名称：</label>
                    <span>{{product_name}}</span>
                  </li>
                  <li>
                    <label>产品规模：</label>
                    <span>{{total_amountFormat}}元</span>
                  </li>
                  <li>
                    <label>还款方式：</label>
                    <span>{{repayment_type}}</span>
                  </li>
                  <li>
                    <label>风险类型：</label>
                    <span>{{risk}}</span>
                  </li>
                  <li>
                    <label>征信措施：</label>
                    <span>{{trustment_type}}</span>
                  </li>
                  <li>
                    <label>备注：</label>
                    <span>{{remark}}</span>
                  </li>
                  <li>
                    <a href="javascript:;" @click="investSpecification()">
                      <span>产品说明书</span>
                      <em>
                        <i class="sprite s-icon-arrow"></i>
                      </em>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="box-list-title">
            <h2 class="title">收益说明</h2>
            <div class="container">
              <div class="box-list-arrow item">
                <ul>
                  <li>
                    <span>{{income_info}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- <div class="box-list-title">
            <h2 class="title">投资记录</h2>
            <div class="container">
              <div class="box-list-arrow item">
                <ul>
                  <li>
                    <a href="javascript:;" @click="investmentList()">
                      <span>投资记录</span>
                      <em>
                        <i class="sprite s-icon-arrow"></i>
                      </em>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div> -->

        </div>
      </div>
    </div>
    <div class="footer-btn-box">
      <el-button class="user-btn" :class="{disabled:!productCode}" @click="invest()">立即投资</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "productDetails",
    data() {
      return {
        productCode: "",
        product_name: "产品名称",
        rate: "0",
        end_day: "0",
        start_amount: "0",
        new_amount: "",
        total_amount: "",
        repayment_type: "",
        risk_type: "",
        trustment_type: "",
        remark: "",
        income_info: "",
        invest_file: "",
        start_date: "",
        setupDate: "",
        interestsEndDate: ""
      };
    },
    created() {
      this.getDetails();
    },
    watch: {
      $route: "getDetails"
    },
    computed: {
      risk: function() {
        switch (this.risk_type) {
          case "R1":
            return "低风险";
          case "R2":
            return "中低风险";
          case "R3":
            return "中风险";
          case "R4":
            return "中高风险";
          case "R5":
            return "高风险";
        }
      },
      start_amountStr: function() {
        let amount =
          this.start_amount &&
          this.$G.moneyFormat(this.$G.count.div(this.start_amount, 100), 0);

        return amount;
      },
      ratio: function() {
        return (
          this.new_amount &&
          this.$G.count
            .mul(this.$G.count.div(this.new_amount, this.total_amount), 100)
            .toFixed(2) + "%"
        );
      },
      total_amountStr: function() {
        let amount =
          this.total_amount && this.$G.count.div(this.total_amount, 100);
        if (amount >= 10000) {
          amount = this.total_amount && this.$G.count.div(amount, 10000) + "万元";
        } else {
          amount = amount + "元";
        }
        return amount;
      },
      total_amountFormat: function() {
        let amount =
          this.total_amount &&
          this.$G.moneyFormat(this.$G.count.div(this.total_amount, 100), 2);
        return amount;
      }
    },
    methods: {
      invest() {
        if (!this.productCode) {
          return false;
        }

        this.$router.push({
          name: "buy",
          params: { code: this.productCode },
          query: { title: this.product_name }
        });
      },
      getDetails() {
        let vue = this;
        let code = this.$route.params.code;
        this.userAPI
          .get(`/product/details/${code}`)
          .then(data => {
            if (data && data.product_code) {
              this.productCode = data.product_code;
              this.product_name = data.product_name;
              this.rate = this.$G.count.mul(data.expect_rate, 100).toFixed(2);
              this.end_day = data.duration;
              this.start_amount = data.mini_invest_amount;
              this.new_amount = data.product_total_amount - data.product_balance;
              this.total_amount = data.product_total_amount;
              this.repayment_type = data.repayment_type;
              this.risk_type = data.risk_type;
              this.trustment_type = data.trustment_type || "暂无";
              this.remark = "暂无";
              this.income_info = data.income_info;
              this.invest_file = data.invest_file;
              this.start_date = data.start_date;
              this.setupDate = data.setupDate;
              this.interestsEndDate = data.interestsEndDate;
            } else {
              vue.$jBox.confirm(`产品CODE错误，请重新选择`, {
                title: "错误提示",
                confirmType: 1,
                css: {
                  titleCSS: { borderBottom: "0 none" },
                  introCSS: { padding: "6px 30px 40px" }
                },
                btn: {
                  array: [
                    {
                      text: "确定",
                      callback: () => {
                        vue.$router.push({ name: "product" });
                      }
                    }
                  ]
                }
              });
              return false;
            }
          })
          .catch(data => {
            console.log(data);
          });
      },
      investSpecification() {
        window.location.href = this.invest_file;
      },
      investmentList() {}
    }
  };
</script>
