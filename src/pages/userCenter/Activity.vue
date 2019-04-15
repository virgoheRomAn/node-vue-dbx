<template>
  <div class="activity-bar">
    <div class="index-bar">
      <div class="banner-bar">
        <div v-if="bannerList.length===0">
          <img src="../../assets/img/banner-default.png">
        </div>
        <div class="swiper-container" id="banner">
          <div class="swiper-slide swiper-wrapper">
            <div class="swiper-slide" v-for="(value,key) in bannerList" :key="key">
              <a :href="value.url">
                <img class="swiper-lazy" src="../../assets/img/banner-default.png" :data-src="value.path">
                <!-- <div class="swiper-lazy-preloader"></div> -->
              </a>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
    <div class="box-list-arrow">
      <ul>
        <li>
          <a :href="'/usercenter/s/active/packet/' + mobile">
            <label><i class="sprite s-icon-packet"></i></label>
            <span>我的红包</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li>
        <!-- <li>
          <a>
            <label><i class="sprite s-icon-coupon"></i></label>
            <span>我的优惠券</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li> -->
        <!-- <li>
          <a>
            <label><i class="sprite s-icon-lottery"></i></label>
            <span>我的抽奖券</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li> -->
        <li>
          <a :href="'/invite/s/list/' + mobile">
            <label><i class="sprite s-icon-invite"></i></label>
            <span>我的邀请</span>
            <em><i class="sprite s-icon-arrow"></i></em>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "activity",
    data() {
      return {
        mobile: this.$route.params.mobile,
        bannerList: []
      };
    },
    created() {
      this.userAPI
        .post(`/basic/bannerList`, {
          bannerType: "2"
        })
        .then(data => {
          data.data.map(item => {
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
</script>

<style lang="less">
  @import url("../../assets/less/_variable.less");
  .activity-bar {
    .box-list-arrow {
      padding: 0 15px;
      margin: 20px 0;
      ul {
        li {
          border: 1px solid @bd;
          margin-bottom: 10px;
          border-radius: 5px;
          padding: 0 15px 0 20px;
          &:last-child {
            border-bottom: 1px solid @bd;
          }
          span {
            font-size: @fs-16;
          }
        }
      }
    }
  }
</style>
