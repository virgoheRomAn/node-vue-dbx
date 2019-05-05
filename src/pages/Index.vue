<template>
  <div class="better-scroll-box">
    <div class="bscroll-container footer">
      <scroll-item ref="scroll" class="wrapper" :data="productList" :pullUpLoad="pullUpLoadObj" @upload="onPullingUp">
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

        <div class="product-bar pl-20 pr-20">
          <div class="tab-bar">
            <div class="tab-content" name="tab">

              <div class="pane-item" :class="{'active':activeName==='all'}">
                <div class="box-list-lr">
                  <product-item v-for="(product,key) in productList" :data="product" :key="key">
                  </product-item>
                </div>
              </div>

              <!-- <div class="pane-item" :class="{'active':activeName==='tenement'}">
                <div class="data-list-none">暂无数据</div>
              </div> -->

            </div>
          </div>
        </div>
        <div class="h-15" v-if="!pullUpLoadObj"></div>
      </scroll-item>

      <div class="data-list-none" style="padding-top: 63%;" v-if="productList.length === 0">
        <label><img src="../assets/img/404.png" /></label>
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
      pageSize: 5,
      noticeList: [],
      bannerList: [],

      activeName: "all",
      productList: [],
      pullUpLoadObj: false
    };
  },
  created() {
    let obj = [
      {
        fun: this.getBanner(),
        callback: data => {
          data.map(item => {
            this.bannerList.push({
              path: item.path,
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
              title: item.title,
              url: item.url
            });
          });
        }
      },
      {
        fun: this.getProductClasses(),
        callback: data => {
          // console.log(data);
        }
      },
      {
        fun: this.ajaxListData(this.pageNum, this.pageSize),
        callback: data => {
          if (data.length === this.pageSize) {
            this.pageNum++;
            this.pullUpLoadObj = {
              threshold: 20
            };
          } else {
            this.pullUpLoadObj = false;
          }

          setTimeout(() => {
            this.$refs.scroll.initScroll();
          }, 20);

          if (!!data) {
            this.handleData(data);
          }
        }
      }
    ];
    this.__G__.ajaxParataxisDataStep(this, obj).then(data => {
      let slideBox = this.$G.slideBox("#slideBox");
    });
  },
  methods: {
    getNotice() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/basic/notice`, type: false })
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
        this.API.get({ url: `/basic/banner`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getProductClasses() {
      return new Promise((resolve, reject) => {
        this.API.post({ url: `/product/classes`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(data => {
            reject(data);
          });
      });
    },
    ajaxListData(pageNum, pageSize) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/product/list`,
          params: {
            pageNum,
            pageSize,
            prodClass: ""
          },
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
    handleData(data) {
      data.map(item => {
        this.productList.push({
          img: item.thumb_img,
          name: item.name,
          intro: item.summary,
          bx_daylimit: item.bx_daylimit,
          agelimit: item.agelimit,
          lower_money: item.lower_money,
          company: item.company,
          id: item.id,
          class: item.class,
          link: item.bxh5_url
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
        }, 500);
      });
    }
    // moreNotice() {
    //   this.$router.push({ name: "notice" });
    // }
  }
};
</script>
