<template>
  <transition name="custom-container" enter-active-class="animate fadeIn" leave-active-class="animate fadeOut">
    <div :id="id" class="popup-box" v-show="state===1" @click.self="cancel()">
      <transition name="custom-box" enter-active-class="animate slideInUp" leave-active-class="animate slideOutDown">
        <div class="container" v-show="state===1" :class="containerCls" :style="popupStyle">
          <div class="box">
            <div v-if="isTitle" class="title" :class="titleCls">
              <slot name="title"></slot>
              <label class="close" :class="colseCls" @click="cancel()">
                <slot name="closeBtn"></slot>
              </label>
            </div>

            <div class="content" :class="contentCls">
              <slot name="nav"></slot>
              <div class="cont">
                <slot name="cont"></slot>
              </div>
            </div>

            <div v-if="isFooter" class="footer" :class="footerCls">
              <div class="button">
                <a href="javascript:;" @click="cancel()">取消</a>
                <a href="javascript:;" @click="sure($event)">确定</a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "popup-box",
    props: {
      id: {
        type: String,
        default: null
      },
      isTitle: {
        type: Boolean,
        default: true
      },
      isFooter: {
        type: Boolean,
        default: false
      },
      popupStyle: {
        type: Object,
        default: null
      },
      containerCls: {
        type: String,
        default: "bottom"
      },
      titleCls: {
        type: String,
        default: null
      },
      colseCls: {
        type: String,
        default: null
      },
      contentCls: {
        type: String,
        default: null
      },
      footerCls: {
        type: String,
        default: "black"
      }
    },
    data() {
      return {
        state: 0
      };
    },
    methods: {
      show() {
        this.state = 1;
        this.$emit("show", this.id);
      },
      hide() {
        this.state = 0;
        this.$emit("hide", this.id);
      },
      cancel() {
        this.hide();
      },
      sure(event) {
        this.hide();
        this.$emit("ensure", event);
      }
    }
  };
</script>

<style lang="less">
  @import url("../assets/less/_variable.less");
  .popup-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: block;

    .container {
      position: absolute;
      z-index: 100;
      background: #ffffff;
      width: 100%;
      &.fullscreen {
        width: 100%;
        height: 100%;
      }
      &.bottom {
        bottom: 0;
        left: 0;
      }
      &.left {
        top: 0;
        left: 0;
      }
      &.right {
        top: 0;
        right: 0;
      }
      &.left,
      &.right {
        width: 70%;
        height: 100%;
      }
      &.bottom {
        width: 100%;
        height: auto;
      }

      > .box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        > .title {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 50px;
          padding: 0 15px;
          &.border {
            border-bottom: 1px solid @bd;
          }
          &.big {
            height: 70px;
            > span {
              font-size: @fs-20;
              color: @black;
            }
            > .close {
              background-size: 20px 20px;
            }
          }
          &.center {
            > span {
              display: block;
              width: 100%;
              text-align: center;
            }
            > .close {
              position: absolute;
              top: 50%;
              right: 15px;
              margin-top: -20px;
            }
          }
          > span {
            font-size: 16px;
            color: @g-333;
          }
          > .close {
            position: relative;
            top: -3px;
            display: block;
            width: 50px;
            height: 40px;
            background: url("../assets/img/icon/close.png") no-repeat center right;
            background-size: 15px 15px;
          }
        }

        > .content {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          overflow: hidden;
          .cont {
            display: block;
            width: 100%;
            flex: 1;
            overflow-x: hidden;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            transform: translate3d(0, 0, 0);
          }
        }

        > .footer {
          display: block;
          height: 50px;
          border-top: 1px solid @bd;

          &.black {
            background: @black;
            border-top: 1px solid #4e4e4e;
            .button a {
              color: @white;
            }
          }
          .button {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            a {
              display: block;
              text-align: center;
              font-size: @fs-15;
              color: @g-333;
            }
          }
        }
      }
    }
  }
</style>

