<template>
  <div class="better-scroll-box">
    <div class="bscroll-container" id="container">

      <scroll-item ref="scroll" class="wrapper" :data="list" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="capital-bar">
          <div class="box-list-title">
            <h2 class="title">提现记录</h2>
            <div class="person-trades">
              <div class="box-list-record">
                <ul>
                  <li v-for="(item,key) in list" :key="key">
                    <div class="content cut">
                      <label>
                        <span>{{item.type}}</span>
                        <em>{{item.time}}</em>
                      </label>
                      <p>{{item.info}}</p>
                      <span>{{item.amount}}元</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="h-15" v-if="!pullUpLoadObj"></div>
      </scroll-item>

      <div class="data-list-none pt-40" v-if="list.length === 0">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import $G from "@/assets/js/global";

export default {
  name: "capital",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      pullUpLoadObj: false,
      list: []
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
      }
    ];
    this.__G__.ajaxParataxisDataStep(this, obj);
  },
  methods: {
    handleData(data) {
      data.map(item => {
        this.list.push({
          type: "提现",
          time: item.time,
          info: item.info,
          amount: this.$G.moneyFormat(item.amount, 2)
        });
      });
    },
    ajaxListData(pageNum, pageSize, type) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/usercenter/withdrawRecord`,
          params: {
            pageSize,
            pageNum
          },
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
.capital-bar {
  padding: 30px 20px 20px;
  .box-list-information {
    margin-top: 15px;
    li {
      padding: 0;
      .content {
        padding: 0 15px;
      }
    }
  }
}
</style>
