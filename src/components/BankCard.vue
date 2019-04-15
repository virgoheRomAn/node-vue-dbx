<template>
  <div class="banks-card">
    <div class="item" :class="cardClass" @click="$emit('card-details')">
      <label class="card-name">
        <i class="sprite s-icon-bank-zs" :class="bankCardInfo.icon"></i>
        <span>{{bankCardInfo.name}}</span>
      </label>
      <label class="card-no">
        <span class="dot"><i></i><i></i><i></i><i></i></span>
        <span class="dot"><i></i><i></i><i></i><i></i></span>
        <span class="dot"><i></i><i></i><i></i><i></i></span>
        <span>{{cardNo}}</span>
      </label>
      <label class="card-limit">
        <span>单笔限额{{singleStroke}}元</span>
        <em>|</em>
        <span>单日限额{{singleDay}}元</span>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bankCard",
    props: {
      cardClass: {
        type: String,
        default: null
      },
      cardInfo: {
        type: null,
        default: false
      },
      callback: {
        type: null,
        default: false
      }
    },
    data() {
      return {
        bankCardInfo: {}
      };
    },
    mounted() {
      let vue = this;

      this.userAPI.get(`/userCenter/userExtData`).then(data => {
        if (Object.keys(data).length !== 0 && data && data.bankCardNo) {
          let bankCardInfo = {
            icon: "s-icon-bank-zs",
            name: data.bankCardName,
            cardNo: data.bankCardNo,
            singleDay: data.payDayLimit,
            singleStroke: data.payOneLimit
          };

          this.bankCardInfo = !!this.cardInfo
            ? Object.assign(bankCardInfo, this.cardInfo)
            : bankCardInfo;

          this.callback && this.callback.call(this, data);
        } else {
          let html = `您还没有绑定银行卡，请先绑定银行卡！`;
          vue.$jBox.confirm(html, {
            title: "错误提示",
            confirmType: 1,
            icon: { iconDir: "h" },
            css: {
              titleCSS: { borderBottom: "0 none" },
              introCSS: { padding: "6px 30px 40px" }
            },
            btn: {
              array: [
                {
                  text: "确定",
                  callback: () => {
                    vue.$router.push({ name: "addBank" });
                  }
                }
              ]
            }
          });
          return false;
        }
      });
    },
    computed: {
      cardNo: function() {
        return (
          this.bankCardInfo.cardNo &&
          this.bankCardInfo.cardNo.substring(
            this.bankCardInfo.cardNo.length - 4,
            this.bankCardInfo.cardNo.length
          )
        );
      },
      singleStroke: function() {
        return (
          this.bankCardInfo.singleStroke &&
          this.$G.moneyFormat(this.bankCardInfo.singleStroke, 0)
        );
      },
      singleDay: function() {
        return (
          this.bankCardInfo.singleDay &&
          this.$G.moneyFormat(this.bankCardInfo.singleDay, 0)
        );
      }
    }
  };
</script>

<style lang="less">
  @import url("../assets/less/_variable.less");
  .banks-card {
    position: relative;
    width: 100%;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: @main;
      border-radius: 5px;
      margin-bottom: 15px;
      padding: 15px 25px;
      &:last-child {
        margin-bottom: 0;
      }
      .card-name {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
        i {
          display: block;
          width: 25px;
          height: 25px;
        }
        span {
          flex: 1;
          font-size: @fs-15;
          color: @white;
          padding-left: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .card-no {
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          color: @white;
          font-size: @fs-20;
          height: 28px;
          &.dot {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 15px;
            i {
              background: rgba(255, 2552, 255, 0.5);
              display: block;
              width: 9px;
              height: 9px;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
        }
      }
      .card-limit {
        display: flex;
        align-items: center;
        width: 100%;
        color: @white;
        font-size: @fs-10;
        em {
          position: relative;
          top: -1px;
          margin: 0 10px;
        }
      }
    }
  }
</style>
