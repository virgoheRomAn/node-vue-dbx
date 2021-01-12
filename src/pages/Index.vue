<template>
  <div class="better-scroll-box">
    <div class="bscroll-container footer">
      <scroll-item ref="scroll" class="index-wrapper" :data="productList" :pullUpLoad="pullUpLoadObj" @scroll="scroll" @upload="onPullingUp">
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
            <li v-for="(item,index) in noticeList" :key="index">
              <a :href="item.url">{{item.title}}</a>
            </li>
          </ul>
        </div>

        <div class="product-bar">
          <div class="tab-bar">
            <!-- <div class="tab-nav sticky" ref="tabNav">
              <a class="item" :class="{'active':activeName===item.id}"  @click="checkProductClass(item.id)"
                v-for="(item, key) in productClasses" :key="key">{{item.name}}</a>
            </div> -->
            <div class="swiper-container swiper-tab" id="tab">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, key) in productClasses" :key="key" :class="{'active':activeName===item.id}"
                  @click="checkProductClass(item.id)">{{item.name}}</div>
              </div>
            </div>

            <div class="tab-content pl-20 pr-20" name="tab">
              <div class="pane-item active">
                <div class="box-list-lr">
                  <product-item v-for="(product,key) in productList" :data="product" :key="key"></product-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-item>

      <div class="data-list-none" style="padding-top: 20%;" v-if="productList.length === 0">
        <label>
          <img src="../assets/img/404.png">
        </label>
        <span>暂无数据</span>
      </div>
      <fb-footer></fb-footer>
    </div>
  </div>
</template>

<script>
import data from "components/data/productData.js";
export default {
  name: "index",
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      noticeList: [],
      bannerList: [],

      activeName: "",
      productClasses: [],
      productList: [],
      pullUpLoadObj: false,
    };
  },
  created() {
    let obj = [
      {
        fun: this.getBanner(),
        callback: (data) => {
          data.map((item) => {
            this.bannerList.push({
              path: item.path,
              url: item.url,
            });
          });

          this.$nextTick(() => {
            this.banner = new this.$swiper("#banner", {
              autoplay: false,
              pagination: {
                el: ".swiper-pagination",
              },
              lazy: {
                loadPrevNext: true,
              },
              loop: true,
              observer: true,
              observeParents: true,
            });

            this.tab = new this.$swiper("#tab", {
              freeMode: true,
              slidesPerView: "auto",
              observer: true,
              observeParents: true,
            });
          });
        },
      },
      {
        fun: this.getNotice(),
        callback: (data) => {
          data.map((item) => {
            this.noticeList.push({
              title: item.title,
              url: item.url,
            });
          });
        },
      },
      {
        fun: this.getProductClasses(),
        callback: (data) => {
          data.map((item) => {
            this.productClasses.push(item);
            this.activeName = this.productClasses[0].id;
          });
        },
      },
    ];
    this.__G__.ajaxParataxisDataStep(this, obj).then((data) => {
      let slideBox = this.$G.slideBox("#slideBox");
      this.init(this.pageNum, this.pageSize, this.productClasses[0].id, true);
    });
  },
  methods: {
    getNotice() {
      return new Promise((resolve, reject) => {
        this.API.get({
          url: `/basic/notice`,
          params: { suid: this.$route.query.suid },
          type: false,
          errorTips: false,
        })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getBanner() {
      return new Promise((resolve, reject) => {
        this.API.get({
          url: `/basic/banner`,
          params: { suid: this.$route.query.suid },
          type: false,
          errorTips: false,
        })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getProductClasses() {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/product/classes`,
          params: { suid: this.$route.query.suid },
          type: false,
          errorTips: false,
        })
          .then((data) => {
            resolve(data);
          })
          .catch((data) => {
            reject(data);
          });
      });
    },
    checkProductClass(id) {
      this.pageNum = 1;
      this.activeName = id;
      this.init(this.pageNum, this.pageSize, id, true);
    },
    init(pageNum, pageSize, prodClass, type) {
      this.productList.splice(0, this.productList.length);
      this.ajaxListData(pageNum, pageSize, prodClass, type)
        .then((data) => {
          if (data.length === this.pageSize) {
            this.pageNum++;
            this.pullUpLoadObj = {
              threshold: 20,
            };
          } else {
            this.pullUpLoadObj = false;
          }

          if (!!data) {
            this.handleData(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    ajaxListData(pageNum, pageSize, prodClass, type = false) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/product/list`,
          params: {
            pageNum,
            pageSize,
            prodClass,
            suid: this.$route.query.suid,
          },
          type,
          errorTips: false,
        })
          .then((data) => {
            resolve(data);
          })
          .catch((data) => {
            reject(data);
          });
      });
    },
    handleData(data) {
      if (data.length > 0) {
        data.map((item) => {
          this.productList.push({
            img: item.thumb_img,
            name: item.name,
            intro: item.summary,
            bx_daylimit: item.bx_daylimit,
            agelimit: item.agelimit,
            lower_money: item.lower_money,
            commission_rate: item.commission_rate,
            company: item.company,
            id: item.id,
            class: item.class,
            link: item.bxh5_url,
          });
        });
      }
    },
    scroll(pos) {
      // let t = this.$refs.tabNav.offsetTop;
      // if (Math.abs(pos.y) >= t) {
      //   this.$refs.tabNav.className = "tab-nav sticky fixed";
      // } else {
      //   this.$refs.tabNav.className = "tab-nav sticky";
      // }
    },
    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    onPullingUp() {
      this.ajaxListData(this.pageNum, this.pageSize, this.activeName, false).then((data) => {
        setTimeout(() => {
          if (data.length !== 0) {
            this.pageNum++;
          }
          if (data.length !== this.pageSize) {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          }

          this.handleData(data);
        }, 500);
      });
    },
    // moreNotice() {
    //   this.$router.push({ name: "notice" });
    // }
  },
};
</script>
