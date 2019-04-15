<template>
  <div class="module-container">
    <div class="index-bar">
      <div class="banner-bar">
        <div v-if="bannerList.length===0">
          <img src="../assets/img/banner-default.png">
        </div>
        <div class="swiper-container" id="banner">
          <div class="swiper-slide swiper-wrapper">
            <div class="swiper-slide" v-for="(value,key) in bannerList" :key="key">
              <a :href="value.url">
                <img class="swiper-lazy" src="../assets/img/banner-default.png" :data-src="value.path">
              </a>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="notice-bar">
        <label class="icon">
          <i class="sprite s-icon-notice"></i>
        </label>
        <ul class="list" id="slideBox">
          <li v-for="item in noticeList">
            <a :href="item.url">{{item.title}}</a>
          </li>
        </ul>
        <a class="more" href="javascript:;" @click="moreNotice()">更多</a>
      </div>
      <div class="tips-bar">
        <div class="box-list-flex">
          <div class="item">
            <div class="content">
              <label class="logo"><img src="../assets/img/tips/index-img1.png" /></label>
              <label class="name">
                <span>天津金融交易所</span>
                <em><i></i>挂牌<i></i></em>
              </label>
            </div>
          </div>
          <div class="item">
            <div class="content">
              <label class="logo"><img src="../assets/img/tips/index-img2.png" /></label>
              <label class="name">
                <span>协信控股集团</span>
                <em><i></i>保证承兑<i></i></em>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="product-list hot-product">
        <div class="box-list-title">
          <h2 class="title">热门产品展示</h2>
          <div class="container">
            <list-item v-for="(product,key) in productList" :data="product" :key="key" :class="{'sale-out':product.status==='sellout'}">
            </list-item>
          </div>
        </div>
      </div>
    </div>

    <fb-footer></fb-footer>
  </div>
</template>

<script>
  import Item from "@/components/ProductItem";
  export default {
    name: "index",
    components: {
      "list-item": Item
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 2,
        noticeList: [],
        bannerList: [],

        productList: []
      };
    },
    created() {
      let obj = [
        {
          fun: this.getBanner(),
          callback: data => {
            data.map(item => {
              this.bannerList.push({
                path: item.imagePath,
                url: item.url
              });
            });

            this.$nextTick(() => {
              this.banner = new this.$swiper("#banner", {
                autoplay: {
                  delay: 4000,
                  disableOnInteraction: false
                },
                pagination: {
                  el: ".swiper-pagination"
                },
                lazy: {
                  loadPrevNext: true
                },
                loop: true,
                observer: true,
                observeParents: true
              });
            });
          }
        },
        {
          fun: this.getNotice(),
          callback: data => {
            data.map(item => {
              this.noticeList.push({
                title: item.announcementInfo,
                url: `/notice/details/${item.id}`
              });
            });
          }
        },
        {
          fun: this.ajaxListData(this.pageNum, this.pageSize, false),
          callback: data => {
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
          }
        }
      ];
      this.__G__.ajaxParataxisDataStep(this, obj).then(() => {
        let slideBox = this.$G.slideBox("#slideBox");
      });
    },
    mounted() {},
    methods: {
      getNotice() {
        return new Promise((resolve, reject) => {
          this.userAPI
            .post(
              `/basic/noticeList`,
              {
                pageNum: "1",
                pageSize: "5"
              },
              false
            )
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getBanner() {
        return new Promise((resolve, reject) => {
          this.userAPI
            .post(
              `/basic/bannerList`,
              {
                bannerType: "1"
              },
              false
            )
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      ajaxListData(pageNum, pageSize) {
        return new Promise((resolve, reject) => {
          this.proAPI
            .getProductList({
              pageSize,
              pageNum,
              type: false
            })
            .then(data => {
              resolve(data);
            })
            .catch(data => {
              reject(data);
            });
        });
      },
      moreNotice() {
        this.$router.push({ name: "notice" });
      }
    }
  };
</script>
