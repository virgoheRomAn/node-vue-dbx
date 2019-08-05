<template>
  <div class="better-scroll-box">
    <div class="bscroll-container" id="container">

      <scroll-item ref="scroll" class="wrapper" :data="list" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="trades-bar user-center-bar pb-0">

          <div class="person-trades">
            <div class="box-list-information mt-0">
              <ul>
                <li v-for="(item,key) in list" :key="key">
                  <template v-if="item.regTime">
                    <div class="box-list-arrow">
                      <ul class="small">
                        <li>
                          <span><b>{{item.remark}}</b></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content row">
                      <div class="item row1">
                        <span>被邀请人：</span>
                        <label>{{item.sellerName}}</label>
                      </div>
                      <div class="item row1">
                        <span>注册时间：</span>
                        <label>{{item.regTime}}</label>
                      </div>
                      <div class="item row1">
                        <span>出单产品：</span>
                        <label>{{item.productName}}</label>
                      </div>
                      <div class="item row1">
                        <span>出单时间：</span>
                        <label>{{item.effectiveDate}}</label>
                      </div>
                      <div class="item row1">
                        <span>奖励金额：</span>
                        <label>{{item.money}}元</label>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="box-list-arrow">
                      <ul class="small">
                        <li>
                          <span><b>{{item.productName}}</b></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content row">
                      <div class="item row2">
                        <span>投保人：</span>
                        <label>{{item.holderName}}</label>
                      </div>
                      <div class="item row2">
                        <span>保费：</span>
                        <label>{{item.money}}元</label>
                      </div>
                      <div class="item row2">
                        <span>生效日期：</span>
                        <label>{{item.effectiveDate}}</label>
                      </div>
                      <div class="item row2">
                        <span>推广费：</span>
                        <label>{{item.profit}}元</label>
                      </div>
                      <div class="item row1">
                        <span>状态：</span>
                        <label class="tc-main">{{item.isEffective==="0"?"待生效":"已生效"}}</label>
                      </div>
                    </div>
                  </template>
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
  </div>
</template>

<script>
export default {
  name: "incomeDetails",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      pullUpLoadObj: false,
      list: []
    };
  },
  created() {
    this.ajaxListData(this.pageSize, this.pageNum, true).then(data => {
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

      if (!!data) {
        this.handleData(data);
      }
    });
  },
  methods: {
    ajaxListData(pageSize, pageNum, type) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/usercenter/profitDetails`,
          params: { pageSize, pageNum, type: this.$route.params.type },
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
      //this.list.splice(0, this.list.length);
      if (!!data) {
        data.map(item => {
          this.list.push(item);
        });
      }
    },
    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    onPullingUp() {
      this.ajaxListData(this.pageSize, this.pageNum, false)
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

<style>
</style>
