<template>
  <div class="better-scroll-box">
    <div class="bscroll-container" id="container">

      <scroll ref="scroll" class="wrapper" :data="holdList" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="trades-bar user-center-bar">

          <!-- <person-assets class="bg mt-0" :userHandle="false" :see_total_assets="false"></person-assets> -->
          <person-assets class="bg mt-0" :userHandle="false" :see_total_assets="false" :ajax_user_count="false"
            :ajax_count_data="user_count_data"></person-assets>

          <div class="person-trades">
            <div class="box-list-information">
              <ul>
                <li v-for="(item,key) in holdList" :key="key">
                  <div class="box-list-arrow">
                    <ul>
                      <li>
                        <a :href="'/product/s/details/'+item.code">
                          <span><b>{{item.name}}</b></span>
                          <em><i class="sprite s-icon-arrow"></i></em>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="content">
                    <div class="item row1">
                      <span>购买金额：</span>
                      <label>{{item.money}}元</label>
                    </div>
                    <div class="item row1">
                      <span>预期收益：</span>
                      <label>{{item.earnings}}元</label>
                    </div>
                    <div class="item row1">
                      <span>订单时间</span>
                      <label>{{item.orderTime}}</label>
                    </div>
                    <div class="item row1">
                      <span>到期时间</span>
                      <label>{{item.endTime}}</label>
                    </div>
                    <!-- <div class="item row1">
                      <span>交易状态：</span>
                      <label>{{item.status}}</label>
                    </div> -->
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="h-15" v-if="!pullUpLoadObj"></div>
      </scroll>

      <div class="data-list-none pt-40" v-if="holdList.length === 0">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  import $G from "@/assets/js/global";
  import Scroll from "@/components/Scroll";
  import PersonAssets from "@/components/PersonAssets";

  export default {
    name: "trades",
    components: {
      Scroll,
      PersonAssets
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 5,
        isShowHeader: false,
        pullUpLoadObj: false,
        activeName: "hold",
        holdList: [],
        user_count_data: {
          totalAssets: "0",
          currentBalance: "0",
          totalIncomeAmount: "0",
          totalInvestAmount: "0"
        }
      };
    },
    created() {
      let obj = [
        {
          fun: this.ajaxListData(this.pageNum, this.pageSize, false),
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
            this.handleData(data);
          }
        },
        {
          fun: this.getUserCount(),
          callback: data => {
            if (!!data) {
              this.user_count_data.totalAssets = data.total_assets;
              this.user_count_data.currentBalance = data.current_balance;
              this.user_count_data.totalIncomeAmount = data.totalIncomeAmount;
              this.user_count_data.totalInvestAmount = data.totalInvestAmount;
            }
          }
        }
      ];
      this.__G__.ajaxParataxisDataStep(this, obj);
    },
    mounted() {
      let vue = this;
      vue.$G.tabBox(".tab-bar|tab", function(name) {
        vue.activeName = name;
        vue.showUpload();
        vue.scrollTo(0, 0);
      });
    },
    methods: {
      getUserCount() {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/userCenter/account`)
            .then(res => {
              let data = res.data.data;
              if (res.data.code !== 200) {
                reject(res.data);
              } else {
                resolve(data);
              }
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      handleData(data) {
        data.map(item => {
          this.holdList.push({
            code: item.product_code,
            name: item.product_name,
            money: this.$G.count.div(item.ta_balance, 100),
            earnings: this.$G.count.div(item.product_expected_income, 100),
            orderTime: item.order_time,
            endTime: item.product_expiring_date,
            status: "1"
          });
        });
      },
      ajaxListData(pageNum, pageSize, type) {
        return new Promise((resolve, reject) => {
          this.userAPI
            .getAjaxDataList(
              {
                pageSize,
                pageNum,
                type
              },
              `/userCenter/transRecord`
            )
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
      scroll(pos) {
        //监听滚动，暂时屏蔽
        let $container = this.$("#container");
        let $top = this.$(".person-assets");
        let $ele = this.$(".tab-nav");
        if (Math.abs(pos.y) >= 15 + $top.outerHeight(true) + 45) {
          $container.addClass("header");
          this.isShowHeader = true;

          let $tabNavItme = this.$("#tab").find(".item.active");
          let $tabLine = this.$("#line");
          let _tabWidth = $tabNavItme.outerWidth(true);
          let _tabLeft = $tabNavItme.position().left;
          let _tabPadLeft = parseInt($tabNavItme.css("padding-left"));
          let _tabPadRight = parseInt($tabNavItme.css("padding-right"));
          $tabLine.css({
            width: _tabWidth - _tabPadLeft - _tabPadRight,
            left: _tabLeft + _tabPadLeft
          });
        } else {
          $container.removeClass("header");
          this.isShowHeader = false;
        }
      },
      onPullingUp() {
        this.ajaxListData(this.pageNum, this.pageSize, false)
          .then(data => {
            setTimeout(() => {
              if (data.length !== 0) {
                this.pageNum++;
              }
              if (data.length !== this.pageSize) {
                this.$refs.scroll && this.$refs.scroll.forceUpdate();
              }

              this.handleData(data);
            }, 1500);
          })
          .catch(() => {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          });
      }
    }
  };
</script>

<style lang="less">
  @import url("../../assets/less/_variable.less");
  .trades-bar {
    padding-bottom: 0;
    .box-list-information {
      margin-top: 15px;
      li {
        padding: 0;
        .content {
          padding: 0 15px;
        }
      }
    }

    .box-list-arrow {
      border-bottom: 1px solid @bd;
      margin-bottom: 15px;
      > ul {
        li {
          padding: 0 15px;
          border: 0 none;
        }
      }
    }
  }
</style>
