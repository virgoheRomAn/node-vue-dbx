<template>
  <div class="better-scroll-box">
    <div class="bscroll-container header footer">
      <header class="bscroll-header">
        <div class="tab-bar">
          <div class="tab-nav" name="tab">
            <div class="item" name="all" :class="{'active':activeName==='all'}"><label>全部产品</label></div>
            <div class="item disabled" name="tenement" :class="{'active':activeName==='tenement'}"><label>物业宝</label>
            </div>
            <label class="tab-line"></label>
          </div>
        </div>
      </header>
      <scroll ref="scroll" class="wrapper" :data="productList" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="product-bar">
          <div class="tab-bar">
            <div class="tab-content" name="tab">

              <div class="pane-item" :class="{'active':activeName==='all'}">
                <div class="product-list">
                  <div class="box-list-title">
                    <div class="container">
                      <item v-for="(product,key) in productList" :data="product" :key="key"
                        :class="{'sale-out':product.status==='sellout'}">
                      </item>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pane-item" :class="{'active':activeName==='tenement'}">
                <div class="data-list-none">暂无数据</div>
              </div>

            </div>
          </div>
        </div>
        <div class="h-15" v-if="!pullUpLoadObj"></div>
      </scroll>

      <div class="data-list-none pt-40" v-if="productList.length === 0">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
      <fb-footer></fb-footer>
    </div>
  </div>

</template>

<script>
import Item from "@/components/ProductItem";
import Scroll from "@/components/Scroll";

import data from "components/data/productData.js";

export default {
  name: "product",
  components: {
    Item,
    Scroll
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      activeName: "all",
      productList: [],

      pullUpLoadObj: false
    };
  },
  created() {
    this.ajaxListData(this.pageNum, this.pageSize).then(data => {
      if (data.length === this.pageSize) {
        this.pageNum++;
        this.pullUpLoadObj = {
          threshold: 20
        };
      } else {
        this.pullUpLoadObj = false;
      }

      setTimeout(() => {
        this.$refs.scroll && this.$refs.scroll.initScroll();
      }, 20);
      this.handleData(data);
    });
  },
  mounted() {
    let vue = this;
    vue.$G.tabBox(".tab-bar|tab", function(name) {
      if (name === "tenement") {
        vue.$jBox.warn(`功能正在开发中<br>敬请期待`, {
          hideTitle: true,
          content: { text_dir: "center" }
        });
        return false;
      }
      vue.activeName = name;
      vue.scrollTo(0, 0);
    });
  },
  methods: {
    handleData(data) {
      data.map(item => {
        let expand = [];
        item.product_expand_label &&
          item.product_expand_label.split(",").map(x => {
            expand.push(x);
          });

        this.productList.push({
          name: item.product_name,
          rate: this.$G.count.mul(item.product_rate, 100).toFixed(2),
          day: item.deadline,
          now: item.issuance_amount - item.product_balance,
          amount: item.issuance_amount,
          money: item.sale_amount,
          link: "/product/s/details/" + item.product_code,
          status: item.product_status,
          repayType: item.product_payment_method,
          explainList: expand
        });
      });
    },
    ajaxListData(pageNum, pageSize, type) {
      return new Promise((resolve, reject) => {
        this.proAPI
          .getProductList({
            pageSize,
            pageNum,
            type
          })
          .then(data => {
            resolve(data);
          })
          .catch(data => {
            reject(data);
          });
      });
    },
    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    onPullingUp() {
      this.ajaxListData(this.pageNum, this.pageSize, false).then(data => {
        setTimeout(() => {
          if (data.length !== 0) {
            this.pageNum++;
          }
          if (data.length !== this.pageSize) {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          }

          this.handleData(data);
        }, 1500);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.product-bar {
  display: block;
  padding: 15px 0 0 0;
  .product-list {
    padding: 0 15px;
  }
}
</style>

