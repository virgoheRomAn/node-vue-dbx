<template>
  <div class="better-scroll-box">
    <div class="bscroll-container" id="container">

      <scroll-item ref="scroll" class="wrapper" :data="list" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="trades-bar user-center-bar">

          <person-assets class="bg mt-0" :userHandle="false" :see_total_assets="false" :user_assets_field="user_assets_field"
            :total_assets_type="true" :ajax_user_count="false" :ajax_count_data="user_count_data"></person-assets>

          <div class="box-list-arrow-content mt-5 mb-25">
            <ul>
              <li>
                <div class="content" @click="selectTime()">
                  <span>查询时间</span>
                  <label :class="{'disable':!search.time}">{{search.timeTxt}}</label>
                  <em><i class="sprite s-icon-arrow"></i></em>
                </div>
              </li>
            </ul>
          </div>

          <div class="person-trades">
            <div class="box-list-information">
              <ul>
                <li v-for="(item,key) in list" :key="key">
                  <div class="box-list-arrow">
                    <ul class="small">
                      <li>
                        <a :href="'/product/s/details/'+item.code">
                          <span><b>{{item.type}}</b></span>
                          <em><i class="sprite s-icon-arrow"></i></em>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="content">
                    <div class="item row2">
                      <span>保费：</span>
                      <label>{{item.insurance_amount}}元</label>
                    </div>
                    <div class="item row2">
                      <span>推广费：</span>
                      <label>{{item.generalize_amount}}元</label>
                    </div>
                    <div class="item row2">
                      <span>数量：</span>
                      <label>{{item.num}}</label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </scroll-item>

      <div class="data-list-none pt-40" v-if="list.length === 0">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
    </div>

    <popup-box id="popupBox" ref="popupBox" titleCls="center border mb-20">
      <span slot="title">选择查询时间范围</span>
      <template slot="cont">
        <calendar-item ref="calendar" :range="true" :events="calendar.events" :value="calendar.value" :begin="calendar.begin"
          :end="calendar.end" @select="calendarSelect"></calendar-item>
      </template>
    </popup-box>
  </div>
</template>

<script>
import $G from "@/assets/js/global";
export default {
  name: "trades",
  data() {
    return {
      search: {
        time: "",
        timeTxt: "查询时间范围",
        startTime: "",
        endTime: ""
      },
      calendar: {
        value: [],
        begin: [this.CONST.DATE.getFullYear(), 1, 1],
        end: [
          this.CONST.DATE.getFullYear(),
          this.CONST.DATE.getMonth() + 1,
          this.CONST.DATE.getDate()
        ],
        events: {},
        timestamp: Date.now()
      },
      pageNum: 1,
      pageSize: 10,
      pullUpLoadObj: false,
      list: [],
      user_count_data: {
        totalAssets: "0",
        currentBalance: "0"
      },
      user_assets_field: ["已生效总推广费", "待生效推广费"]
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

          if (!!data) {
            this.handleData(data);
          }
        }
      },
      {
        // fun: this.getUserCount,
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
        this.list.push({
          type: item.source_text,
          num: item.number,
          insurance_amount: this.$G.moneyFormat(item.insurance_amount, 2),
          generalize_amount: this.$G.moneyFormat(item.generalize_amount, 2)
        });
      });
    },
    ajaxListData(pageNum, pageSize, type) {
      return new Promise((resolve, reject) => {
        this.MOCK.get({
          url: `/usercenter/income`,
          params: { pageSize, pageNum },
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
    },
    selectTime() {
      this.calendar.value = this.search.time ? this.search.time : [];

      this.$refs.calendar.init();

      this.$refs.popupBox.show();
    },
    calendarSelect(result) {
      this.search.timeTxt =
        result.begin.join("-") + " 至 " + result.end.join("-");
      this.search.time = [result.begin, result.end];
      this.search.startTime = result.begin.join("-");
      this.search.endTime = result.end.join("-");
      this.$refs.popupBox.hide();
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
        .item {
          span {
            width: auto;
          }
          label {
            padding: 0 0 0 5px;
          }
        }
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
