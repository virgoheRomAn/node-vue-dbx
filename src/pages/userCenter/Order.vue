<template>
  <div class="better-scroll-box">
    <div class="bscroll-container header" :class="{'footer':isManagement}" id="container">

      <div class="bscroll-header">
        <div class="tab-bar">
          <div class="tab-nav">
            <div class="item" :class="{'active':activeName==='All'}" @click="check('All')"><label>全部</label></div>
            <div class="item" :class="{'active':activeName==='Unpaid'}" @click="check('Unpaid')"><label>待支付</label></div>
            <div class="item" :class="{'active':activeName==='Guarantee'}" @click="check('Guarantee')"><label>保障中</label></div>
            <div class="item" :class="{'active':activeName==='Lost'}" @click="check('Lost')"><label>已失效</label></div>
            <label class="tab-line animate-transtion" :style="lineStyle"></label>
          </div>
        </div>
      </div>

      <scroll-item ref="scroll" class="wrapper" :data="dataList" :pullUpLoad="pullUpLoadObj" @upload="onPullingUp">
        <div class="trades-bar order-bar user-center-bar">
          <div class="person-trades" v-show="activeName==='All'">
            <div class="box-list-information mt-0">
              <ul :class="{management:isManagement}">
                <li v-for="(item,index) in orderAllList" :key="index">
                  <div class="container">
                    <div class="box-list-arrow">
                      <ul class="auto">
                        <li>
                          <span><b>{{item.name}}</b><i :class="item.cls">{{item.status}}</i></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content column">
                      <div class="item">
                        <span>投保人：</span>
                        <label>{{item.user}}</label>
                      </div>
                      <div class="item">
                        <span>被保人：</span>
                        <label>{{item.beneficiary}}</label>
                      </div>
                      <div class="item">
                        <span>投保金额：</span>
                        <label>{{item.money}}</label>
                      </div>
                      <div class="item">
                        <span>购买日期：</span>
                        <label>{{item.time}}</label>
                      </div>
                      <div class="item">
                        <span>保单号：</span>
                        <label>{{item.no}}</label>
                      </div>
                      <div class="item">
                        <span>保单地址：</span>
                        <a :href="item.down">{{item.down}}</a>
                      </div>
                      <div class="item">
                        <div class="handle">
                          <a href="javascript:;" @click.stop="deleteItem(item.id)">删除保单</a>
                          <a href="javascript:;" @click.stop="copyItem(item.no,item.down)">复制保单</a>
                        </div>
                      </div>
                    </div>

                    <div class="checkbox-box" @click.stop="checkItem(index)" v-show="isManagement">
                      <el-checkbox class="checked" v-model="item.checkedItem"></el-checkbox>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="person-trades" v-show="activeName==='Unpaid'">
            <div class="box-list-information mt-0">
              <ul>
                <li v-for="(item,index) in orderUnpaidList" :key="index">
                  <div class="container">
                    <div class="box-list-arrow">
                      <ul class="auto">
                        <li>
                          <span><b>{{item.name}}</b><i :class="item.cls">{{item.status}}</i></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content column">
                      <div class="item">
                        <span>投保人：</span>
                        <label>{{item.user}}</label>
                      </div>
                      <div class="item">
                        <span>被保人：</span>
                        <label>{{item.beneficiary}}</label>
                      </div>
                      <div class="item">
                        <span>投保金额：</span>
                        <label>{{item.money}}</label>
                      </div>
                      <div class="item">
                        <span>购买日期：</span>
                        <label>{{item.time}}</label>
                      </div>
                      <div class="item">
                        <span>保单号：</span>
                        <label>{{item.no}}</label>
                      </div>
                      <div class="item">
                        <span>保单地址：</span>
                        <a :href="item.down">{{item.down}}</a>
                      </div>
                      <div class="item">
                        <div class="handle">
                          <a href="javascript:;" @click.stop="deleteItem(item.id)">删除保单</a>
                          <a href="javascript:;" @click.stop="copyItem(item.no,item.down)">复制保单</a>
                        </div>
                      </div>
                    </div>

                    <div class="checkbox-box" @click.stop="checkItem(index)" v-show="isManagement">
                      <el-checkbox class="checked" v-model="item.checkedItem"></el-checkbox>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="person-trades" v-show="activeName==='Guarantee'">
            <div class="box-list-information mt-0">
              <ul>
                <li v-for="(item,index) in orderGuaranteeList" :key="index">
                  <div class="container">
                    <div class="box-list-arrow">
                      <ul class="auto">
                        <li>
                          <span><b>{{item.name}}</b><i :class="item.cls">{{item.status}}</i></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content column">
                      <div class="item">
                        <span>投保人：</span>
                        <label>{{item.user}}</label>
                      </div>
                      <div class="item">
                        <span>被保人：</span>
                        <label>{{item.beneficiary}}</label>
                      </div>
                      <div class="item">
                        <span>投保金额：</span>
                        <label>{{item.money}}</label>
                      </div>
                      <div class="item">
                        <span>购买日期：</span>
                        <label>{{item.time}}</label>
                      </div>
                      <div class="item">
                        <span>保单号：</span>
                        <label>{{item.no}}</label>
                      </div>
                      <div class="item">
                        <span>保单地址：</span>
                        <a :href="item.down">{{item.down}}</a>
                      </div>
                      <div class="item">
                        <div class="handle">
                          <a href="javascript:;" @click.stop="deleteItem(item.id)">删除保单</a>
                          <a href="javascript:;" @click.stop="copyItem(item.no,item.down)">复制保单</a>
                        </div>
                      </div>
                    </div>

                    <div class="checkbox-box" @click.stop="checkItem(index)" v-show="isManagement">
                      <el-checkbox class="checked" v-model="item.checkedItem"></el-checkbox>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="person-trades" v-show="activeName==='Lost'">
            <div class="box-list-information mt-0">
              <ul>
                <li v-for="(item,index) in orderLostList" :key="index">
                  <div class="container">
                    <div class="box-list-arrow">
                      <ul class="auto">
                        <li>
                          <span><b>{{item.name}}</b><i :class="item.cls">{{item.status}}</i></span>
                        </li>
                      </ul>
                    </div>
                    <div class="content column">
                      <div class="item">
                        <span>投保人：</span>
                        <label>{{item.user}}</label>
                      </div>
                      <div class="item">
                        <span>被保人：</span>
                        <label>{{item.beneficiary}}</label>
                      </div>
                      <div class="item">
                        <span>投保金额：</span>
                        <label>{{item.money}}</label>
                      </div>
                      <div class="item">
                        <span>购买日期：</span>
                        <label>{{item.time}}</label>
                      </div>
                      <div class="item">
                        <span>保单号：</span>
                        <label>{{item.no}}</label>
                      </div>
                      <div class="item">
                        <span>保单地址：</span>
                        <a :href="item.down">{{item.down}}</a>
                      </div>
                      <div class="item">
                        <div class="handle">
                          <a href="javascript:;" @click.stop="deleteItem(item.id)">删除保单</a>
                          <a href="javascript:;" @click.stop="copyItem(item.no,item.down)">复制保单</a>
                        </div>
                      </div>
                    </div>

                    <div class="checkbox-box" @click.stop="checkItem(index)" v-show="isManagement">
                      <el-checkbox class="checked" v-model="item.checkedItem"></el-checkbox>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </scroll-item>

      <div class="bscroll-footer" v-if="isManagement">
        <label>
          <el-checkbox v-model="checkAll" @change="checkAllBtn">全选</el-checkbox>
        </label>
        <div class="handle">
          <a href="javascript:;" @click.stop="batchDel()">批量删除</a>
          <a href="javascript:;" @click.stop="batchCopy()">批量复制</a>
        </div>
      </div>

      <div class="data-list-none pt-40" v-if="!somethingData">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
    </div>

    <div class="management-fixed">
      <a v-if="!isManagement" href="javascript:;" @click="()=>{this.isManagement=true}">保单<br>管理</a>
      <a v-else href="javascript:;" @click="()=>{this.isManagement=false}">管理<br>完成</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "order",
  data() {
    return {
      activeName: "All",
      lineStyle: {},
      somethingData: false,
      isManagement: false,
      checkAll: false,

      pageNum: 1,
      pageSize: 10,
      tab: "0",
      pullUpLoadObj: false,
      dataList: [],
      orderAllList: [],
      orderUnpaidList: [],
      orderGuaranteeList: [],
      orderLostList: []
    };
  },
  created() {
    this.getOrderList(this.pageNum, this.pageSize, this.tab)
      .then(data => {
        this.isPullUpload(data, this.pageSize);
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    this.move();
  },
  methods: {
    move() {
      let _width_ = this.$(".tab-nav .item.active").width();
      let _left_ = this.$(".tab-nav .item.active").position().left + 15;

      this.lineStyle = {
        width: `${_width_}px`,
        left: `${_left_}px`
      };
    },
    check(name) {
      this.activeName = name;
      this.isManagement = false;
      this.checkAll = false;

      this.$nextTick(() => {
        this.move();
        this.pageNum = 1;

        if (this.activeName === "All") {
          this.tab = "0";
        } else if (this.activeName === "Unpaid") {
          this.tab = "1";
        } else if (this.activeName === "Guarantee") {
          this.tab = "2";
        } else if (this.activeName === "Lost") {
          this.tab = "4";
        }

        let array = this[`order${this.activeName}List`];
        array.splice(0, array.length);

        this.getOrderList(this.pageNum, this.pageSize, this.tab)
          .then(data => {
            this.isPullUpload(data, this.pageSize);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    isError() {
      this.somethingData = this[`order${this.activeName}List`].length !== 0;
    },
    isPullUpload(data, pageSize) {
      if (data.length === pageSize) {
        this.pageNum++;
        this.pullUpLoadObj = {
          threshold: 20
        };
      } else {
        this.pullUpLoadObj = false;
      }

      if (!!data) {
        this.handleData(data);
      }
      this.isError();
    },
    deleteItem(id) {
      this.$jBox.warn("是否确认删除该保单？", {
        title: "删除确认",
        content: { text_dir: "center" },
        confirm: () => {
          this.API.post({
            url: `/usercenter/orderDel`,
            params: { id },
            text: "删除中..."
          })
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    copyItem(no, url) {
      let copyText = `保单号：${no}\n下载地址：${url}`;
      this.$copyText(copyText).then(
        e => {
          this.$jBox.success("复制成功");
        },
        e => {
          this.$jBox.error("复制失败");
        }
      );
    },
    batchDel() {
      let orderList = this[`order${this.activeName}List`];
      let checkNumber = this.detectionItemChecked();
      let orderId = "";

      if (checkNumber === 0) {
        this.$jBox.error("请选勾选一条数据");
        return false;
      }

      orderList.map(item => {
        if (item.checkedItem) {
          orderId += item.id + ",";
        }
      });

      orderId = orderId.substring(0, orderId.length - 1);

      this.$jBox.warn("是否删除选中保单？", {
        title: "删除确认",
        content: { text_dir: "center" },
        confirm: () => {
          this.API.post({
            url: `/usercenter/orderDel`,
            params: { id: orderId },
            text: "删除中..."
          })
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    batchCopy() {
      let orderList = this[`order${this.activeName}List`];
      let copyText = "";
      let checkNumber = this.detectionItemChecked();

      if (checkNumber === 0) {
        this.$jBox.error("请选勾选一条数据");
        return false;
      }

      orderList.map(item => {
        if (item.checkedItem) {
          copyText += `保单号：${item.no}\n下载地址：${item.down}\n`;
        }
      });

      this.$copyText(copyText).then(
        e => {
          this.$jBox.success("复制成功");
        },
        e => {
          this.$jBox.error("复制失败");
        }
      );
    },
    checkItem(index) {
      let orderList = this[`order${this.activeName}List`];
      let status = orderList[index].checkedItem;
      orderList[index].checkedItem = !status;

      let checkNumber = this.detectionItemChecked();
      this.checkAll = checkNumber === orderList.length;
    },
    checkAllBtn(val) {
      this[`order${this.activeName}List`].map(item => {
        item.checkedItem = val;
      });
    },
    detectionItemChecked() {
      let orderList = this[`order${this.activeName}List`];
      let checkNumber = 0;
      orderList.map((item, index) => {
        if (!!item.checkedItem) {
          checkNumber++;
        }
      });

      return checkNumber;
    },

    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    destroy() {
      this.$refs.scroll && this.$refs.scroll.destroy();
    },
    refresh() {
      this.$refs.scroll && this.$refs.scroll.refresh();
    },

    getOrderList(pageNum, pageSize, tab, type = true) {
      return new Promise((resolve, reject) => {
        this.API.post({
          url: `/usercenter/order`,
          params: { pageNum, pageSize, tab },
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
      if (data.length === 0) return false;
      let array = this[`order${this.activeName}List`];
      this.dataList = array;

      data.map(item => {
        array.push({
          cls: this.$G.getArrayValueById(
            item.tag,
            this.CONST.ORDERSTATUS,
            "code",
            "cls"
          ),
          name: item.name,
          status: this.$G.getArrayValueById(item.tag, this.CONST.ORDERSTATUS),
          user: item.holder_name,
          beneficiary: item.beibaoren,
          money: item.money,
          time: item.buy_time,
          no: item.pol_order_id,
          down: item.file_url,
          id: item.id,
          checkedItem: false
        });
      });
    },
    onPullingUp() {
      if (!!this.pullUpLoadObj) {
        this.getOrderList(this.pageNum, this.pageSize, this.tab, false)
          .then(data => {
            setTimeout(() => {
              if (data.length !== 0) {
                this.pageNum++;
              }
              if (data.length !== this.pageSize) {
                this.$refs.scroll && this.$refs.scroll.forceUpdate();
              }

              this.handleData(data);
              if (this.checkAll) {
                this.checkAllBtn(true);
              }
            }, 1500);
          })
          .catch(() => {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          });
      }
    }
  }
};
</script>
<style lang="less">
.order-bar {
  padding: 20px 20px 0 !important;
  .box-list-information > ul > li {
    margin-top: 20px;
    margin-bottom: 0;
    border: 0 none;
    &:first-child {
      margin-top: 0;
    }
    .content .item span {
      text-align: right;
      width: 70px;
    }
  }
  .box-list-arrow {
    margin-bottom: 0;
    border-bottom: 0 none;
    padding: 5px 15px 0;
  }
}

.management-fixed {
  position: fixed;
  bottom: 15%;
  right: 10px;
  z-index: 99;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 10px;
    line-height: 12px;
  }
}
</style>
