<template>
  <div class="packet-bar">
    <div class="box-list-arrow-content">
      <ul>
        <li>
          <div class="content" @click="showPicker">
            <span>选择时间</span>
            <label>{{year}}年{{month}}月</label>
            <em><i class="sprite s-icon-arrow"></i></em>
          </div>
        </li>
      </ul>
    </div>
    <div class="box-packet-list" v-if="packetList.length !== 0">
      <ul>
        <li v-for="(value,key) in packetList" :key="key" @click="open(value.coupon_id,value.coupon_info)" :class="{disabled:value.coupon_status!=='0'}">
          <div class="left">
            <label>{{value.coupon_info}}<em>元</em></label>
          </div>
          <div class="right">
            <label>{{value.coupon_name}}</label>
            <span>有效日期至：{{value.coupon_expiry_date}}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="data-list-none pt-40" v-else>
      <label><img src="../../assets/img/404.png" /></label>
      <span>暂无数据</span>
    </div>

    <picker @select="handleSelect(arguments)" :data="dataObject" :selected-index="selectedIndex" ref="picker" title="选择查询红包时间"
      cancelTxt="取消" confirmTxt="确定"></picker>
  </div>
</template>

<script>
  import Picker from "components/Picker";
  export default {
    name: "packet",
    components: {
      Picker
    },
    data() {
      return {
        pageNum: "1",
        pageSize: "1000",
        year: "",
        month: "",
        packetList: [],

        dataObject: [[], []],
        selectedIndex: [2, 0]
      };
    },
    created() {
      this.year = this.$G.getNowTime().getYear();
      this.month = this.$G.zero(this.$G.getNowTime().getMonth(), 2);

      [this.year - 2, this.year - 1, this.year].forEach(item => {
        this.dataObject[0].push({
          code: item,
          text: item
        });
      });

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
        this.dataObject[1].push({
          code: this.$G.zero(item, 2),
          text: this.$G.zero(item, 2)
        });
      });

      this.selectedIndex[1] = parseInt(this.month) - 1;

      this.getPacket();
    },
    methods: {
      getPacket() {
        this.userAPI
          .post(`userCenter/myCoupons`, {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            year: this.year,
            month: this.month
          })
          .then(data => {
            if (data.code !== 200) {
              this.$jBox.error(data.message);
              return false;
            }
            if (data.data.length === 0) {
              this.packetList = [];
            } else {
              this.handleData(data.data);
            }
          });
      },
      handleData(data) {
        this.packetList = [];
        data.map(item => {
          this.packetList.push({
            coupon_id: item.coupon_id,
            coupon_expiry_date: item.coupon_expiry_date,
            coupon_name: item.coupon_name,
            coupon_info: item.coupon_info ? parseInt(item.coupon_info) : "",
            coupon_status: item.coupon_status
          });
        });
      },
      open(id, acount) {
        let vue = this;
        this.userAPI
          .post(`/userCenter/useCoupons`, {
            couponId: id
          })
          .then(data => {
            if (data.code !== 200) {
              this.$jBox.error(data.message);
              return false;
            }
            this.$jBox.success("提现到余额成功！", {
              closeFun: () => {
                vue.getPacket();
              }
            });
          });
      },
      showPicker() {
        this.$refs.picker.setData(this.dataObject);
        this.$refs.picker.show();
      },
      handleSelect(args) {
        let value = [...args][0];
        this.year = value[0].toString();
        this.month = value[1];
        this.getPacket();
      }
    }
  };
</script>

<style lang="less">
  .packet-bar {
    padding: 0 0 15px 0;
    .box-list-arrow-content {
      z-index: 100;
      > ul li {
        padding: 0 15px;
        .content {
          padding: 15px 0;
          span,
          label {
            font-size: 15px;
            color: #375c91;
          }
          span {
            color: #4a4a4a;
          }
        }
      }
    }
    .box-packet-list {
      padding: 0 15px;
    }
  }
</style>
