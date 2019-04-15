<template>
  <div class="invite-list">
    <div class="assets-info">
      <ul>
        <li v-for="(value,key,index) in informationDict">
          <span>{{value}}</span>
          <label>{{information[key]}}</label>
        </li>
      </ul>
    </div>
    <div class="list-info">
      <div class="box-list-table">
        <ul>
          <li class="title">
            <span>被邀请人</span>
            <span>注册时间</span>
            <span>首投时间</span>
            <span>总投资金额</span>
          </li>
          <template v-if="inviteList.length !== 0">
            <li v-for="(value,key) in inviteList">
              <span>{{value.userName}}</span>
              <span>{{value.registDate}}</span>
              <span>{{value.firstOrderDate}}</span>
              <span>{{value.totalTaBalance}}</span>
            </li>
          </template>
          <li class="data-none" v-else>暂无数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "invitList",
    data() {
      return {
        inviteList: [],
        information: {
          totalYearAmount: "0",
          totalincome: "0",
          cumulativeInviter: "0"
        },
        informationDict: {
          totalYearAmount: "累计推荐年化金额",
          totalincome: "累计推荐收益",
          cumulativeInviter: "推荐人数"
        }
      };
    },
    created() {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      this.userAPI.get(`/userCenter/myInvite`).then(data => {
        this.information.totalYearAmount = data.totalYearAmount
          ? this.$G.count.div(data.totalYearAmount, 100)
          : "0";
        this.information.totalincome = data.totalincome
          ? this.$G.count.div(data.totalincome, 100)
          : "0";
        this.information.cumulativeInviter = data.cumulativeInviter || "0";

        if (data.inviteList.length !== 0) {
          data.inviteList.map(item => {
            this.inviteList.push({
              userName: item.userName
                ? item.userName.replace(reg, "$1****$2")
                : "--",
              registDate: item.registDate
                ? this.$G.getDateByTime(item.registDate, "date")
                : "--",
              firstOrderDate: item.firstOrderDate
                ? this.$G.getDateByTime(item.firstOrderDate, "date")
                : "--",
              totalTaBalance: item.totalTaBalance
                ? this.$G.count.div(item.totalTaBalance, 100)
                : "--"
            });
          });
        }
      });
    }
  };
</script>

<style lang="less">
  @import url("../../assets/less/_variable.less");
  .invite-list {
    position: relative;
    padding: 15px;
    .assets-info {
      background: @main;
      padding: 0 20px;
      border-radius: 5px;
      ul {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        padding: 20px 0;
        color: #fff;
        li {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            font-size: @fs-10;
          }
          label {
            font-size: 24px;
            margin-top: 8px;
          }
        }
      }
    }
    .list-info {
      margin-top: 15px;
    }
  }
</style>
