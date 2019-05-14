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
                        <a :href="'/usercenter/s/incomedetails/'+item.type">
                          <span><b>{{item.name}}</b></span>
                          <em><i class="sprite s-icon-arrow"></i></em>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="content">
                    <div class="item row1">
                      <span>保费：</span>
                      <label>{{item.insurance_amount}}元</label>
                    </div>
                    <div class="item row1">
                      <span>推广费：</span>
                      <label>{{item.generalize_amount}}元</label>
                    </div>
                    <div class="item row1">
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
        fun: this.ajaxListData(
          this.search.startTime,
          this.search.endTime,
          false
        ),
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
        fun: this.getUserCount(),
        callback: data => {
          if (!!data) {
            this.user_count_data.totalAssets = data.effect_amount;
            this.user_count_data.currentBalance = data.await_amount;
          }
        }
      }
    ];
    this.__G__.ajaxParataxisDataStep(this, obj);
  },
  methods: {
    getUserCount() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/profitInfo`, type: false })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    ajaxListData(startTime, endTime, type) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/usercenter/incomeRecord`,
          params: { startTime, endTime },
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
    handleData(data) {
      this.list.splice(0, this.list.length);
      data.map(item => {
        this.list.push({
          name: item.source_text,
          num: item.number,
          insurance_amount: this.$G.moneyFormat(item.insurance_amount, 2),
          generalize_amount: this.$G.moneyFormat(item.generalize_amount, 2),
          type: item.type.toString()
        });
      });
    },
    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    onPullingUp() {
      this.ajaxListData(this.search.startTime, this.search.endTime, false)
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
        result.begin.join("/") + " 至 " + result.end.join("/");
      this.search.time = [result.begin, result.end];
      this.search.startTime = result.begin.join("/");
      this.search.endTime = result.end.join("/");
      this.$refs.popupBox.hide();

      this.ajaxListData(this.search.startTime, this.search.endTime, true).then(
        data => {
          this.handleData(data);
        }
      );
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
