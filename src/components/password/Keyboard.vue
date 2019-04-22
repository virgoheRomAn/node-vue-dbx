<template>
  <transition enter-to-class="active" enter-active-class="animated-bottom-enter" leave-active-class="animated-bottom">
    <div class="keyboard-bar" :class="keyboardCls" :style="keyboardStyle" v-if="show" @click.self="hideKeyBoard()">
      <div class="container">
        <ul>
          <li v-for="(item,key) in keys" :key="key">
            <span @click="keyBtn($event)">{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "keyboard",
  props: {
    keyboardCls: {
      type: String,
      default: ""
    },
    keyboardStyle: {
      type: Object,
      default: null
    },
    showBox: {
      type: Boolean,
      default: false
    },
    callback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      index: "",
      keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "清空", "0", "删除"]
    };
  },
  computed: {
    show() {
      return this.showBox ? this.showBox : this.$store.getters.isKeyBoardShow;
    },
    ...mapState({
      payPassword: state => state.payPassword
    })
  },
  methods: {
    ...mapActions(["showKeyBoard", "hideKeyBoard"]),
    keyBtn(e) {
      let ele = e.currentTarget;
      let $this = this.$(ele);
      let text = $this.text();
      let index = $this.parents("li").index();
      let psd = "";
      if (index !== 9 && index !== 11) {
        this.$store.state.psdIndex++;
        if (this.$store.state.psdIndex <= 6) {
          this.$store.dispatch("addPayPasswore", text);
          if (this.$store.state.psdIndex === 6) {
            this.payPassword.map(item => {
              psd += item;
            });
            this.callback && this.callback.call(this, psd);
            this.$store.dispatch("hideKeyBoard");
          }
        }
      } else if (index === 9) {
        this.$store.dispatch("emptyPayPassword");
      } else if (index === 11) {
        this.$store.state.psdIndex--;
        this.$store.dispatch("delPayPassword", {
          index: this.$store.state.psdIndex,
          number: 1
        });
      }
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/_variable");
.keyboard-bar {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 8888;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  &.black {
    background: rgba(0, 0, 0, 0.5);
  }

  &.static {
    position: relative;
    > .container {
      position: relative;
    }
  }

  > .container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: @white;
    ul {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      border-top: 1px solid @bd;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33.33%;
        height: 60px;
        background: @white;
        font-size: 24px;
        border-right: 1px solid @bd;
        border-bottom: 1px solid @bd;
        &:active {
          background: #dfe4ea;
        }

        &:nth-child(3n) {
          border-right: 0 none;
        }
        &:nth-last-child(1),
        &:nth-last-child(2),
        &:nth-last-child(3) {
          border-bottom: 0 none;
        }

        &:nth-last-child(1),
        &:nth-last-child(3) {
          background: #dfe4ea;
          font-size: 18px;
          &:active {
            background: @white;
          }
        }
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
