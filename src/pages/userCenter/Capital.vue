<template>
  <div class="better-scroll-box">
    <div class="bscroll-container" id="container">

      <scroll ref="scroll" class="wrapper" :data="list" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="capital-bar user-center-bar">

          <!-- <person-assets class="bg mt-0" :userHandle="false" :see_total_assets="false"></person-assets> -->
          <person-assets class="bg mt-0" :userHandle="false" :see_total_assets="false" :ajax_user_count="false"
            :ajax_count_data="user_count_data"></person-assets>

          <div class="person-trades">
            <div class="box-list-record">
              <ul>
                <li v-for="(item,key) in list" :key="key">
                  <div class="content" :class="{'add':item.status==='101','cut':item.status==='102'}">
                    <label>
                      <span>{{item.name}}</span>
                      <em>{{item.time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.statusText}}</em>
                    </label>
                    <span>{{item.status === '102'?"-":"+"}}{{item.money}}元</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="h-15" v-if="!pullUpLoadObj"></div>
      </scroll>

      <div class="data-list-none pt-40" v-if="list.length === 0">
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
    name: "capital",
    components: {
      Scroll,
      PersonAssets
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        isShowHeader: false,
        pullUpLoadObj: false,
        list: [],
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
            type: "1",
            name: item.transType,
            time: item.createTime,
            status: item.type,
            statusText: item.transStatus,
            money: this.$G.moneyFormat(
              this.$G.count.div(item.transAmount, 100),
              2
            )
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
              `/userCenter/cashFlow`
            )
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

    .box-list-record {
      border: 1px solid @bd;
      border-radius: 5px;
      margin-top: 15px;
      > ul {
        li {
          padding: 0 15px;
          &:last-child {
            border-bottom: 0 none;
          }
        }
      }
    }
  }
</style>
