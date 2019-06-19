<template>
  <div ref="wrapper" class="bScroll-wrapper">
    <div class="bScroll-content">
      <slot></slot>

      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading>{{pullUpLoadingTxt}}</loading>
          </div>
        </div>
        <div class="pullup-wrapper" v-else></div>
      </slot>
    </div>

    <slot name="pulldown" :pullDownRefresh="pullDownRefresh" :pullDownStyle="pullDownStyle" :beforePullDown="beforePullDown"
      :isPullingDown="isPullingDown" :bubbleY="bubbleY">
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">

        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>

        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading>{{refreshLoadingTxt}}</loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>

      </div>
    </slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Loading from "components/loading/Loading";
import Bubble from "components/bubble/Bubble";

export default {
  name: "scroll",
  props: {
    //数据
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //模式
    probeType: {
      type: Number,
      default: 3
    },
    //点击事件
    click: {
      type: Boolean,
      default: true
    },
    //监听滚动事件
    listenScroll: {
      type: Boolean,
      default: true
    },
    //监听滚动之前事件
    listenBeforeScroll: {
      type: Boolean,
      default: true
    },
    //监听滚动之后事件
    listenScrollEnd: {
      type: Boolean,
      default: true
    },
    //滚动方向
    direction: {
      type: String,
      default: "vertical"
    },
    //滚动条对象
    scrollbar: {
      type: null,
      default: false
    },
    //向下拉刷新对象
    pullDownRefresh: {
      type: null,
      default: false
    },
    //向上拉加载对象
    pullUpLoad: {
      type: null,
      default: false
    },
    //初始位置
    startY: {
      type: Number,
      default: 0
    },
    //刷新延时
    refreshDelay: {
      type: Number,
      default: 20
    },
    //是否自由滚动
    freeScroll: {
      type: Boolean,
      default: false
    },
    //是否开启滚轮
    mouseWheel: {
      type: Boolean,
      default: false
    },
    //回弹
    bounce: {
      default: true
    },
    //缩放
    zoom: {
      default: false
    }
  },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true,
      pullDownStyle: {
        top: "-50px"
      },
      bubbleY: 0,
      pullUploadText: "上拉加载更多"
    };
  },
  computed: {
    pullUpLoadingTxt() {
      return (this.pullUpLoad && this.pullUpLoad.loadingTxt) || "加载中...";
    },
    pullUpTxt() {
      const moreTxt =
        this.pullUploadText ||
        (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) ||
        "上拉加载更多";

      const noMoreTxt =
        (this.pullUpLoad &&
          this.pullUpLoad.txt &&
          this.pullUpLoad.txt.noMore) ||
        "没有更多数据了";

      return this.pullUpDirty ? moreTxt : noMoreTxt;
    },
    refreshTxt() {
      return (this.pullDownRefresh && this.pullDownRefresh.txt) || "刷新成功";
    },
    refreshLoadingTxt() {
      return (
        (this.pullDownRefresh && this.pullDownRefresh.loadingTxt) || "刷新中..."
      );
    }
  },
  created() {
    this.pullDownInitTop = -50;
  },
  mounted() {
    setTimeout(() => {
      this.initScroll();
    }, 20);
  },
  destroyed() {
    this.$refs.scroll && this.$refs.scroll.destroy();
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }

      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === "vertical",
        scrollX: this.freeScroll || this.direction === "horizontal",
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        mouseWheel: this.mouseWheel,
        bounce: this.bounce,
        zoom: this.zoom,
        bounceTime: 300,
        swipeBounceTime: 300
      };

      this.scroll = new BScroll(this.$refs.wrapper, options);

      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          this.pullUpDirty = true;
          if (pos.y < this.scroll.maxScrollY - 30) {
            this.pullUploadText = "释放加载";
            this.allowableLoad = true;
          } else {
            // this.pullUploadText = "上拉加载更多";
          }
          this.$emit("scroll", pos);
        });
      }

      if (this.listenScrollEnd) {
        this.scroll.on("scrollEnd", pos => {
          if (this.allowableLoad) {
            this.allowableLoad = false;
            this.isPullUpLoad = true;
            this.pullUploadText = "加载中...";
            this.$emit("upload", pos);
          }
        });
      }

      if (this.listenBeforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScrollStart");
        });

        this.scroll.on("scrollStart", () => {
          this.$emit("scroll-start");
        });
      }

      if (this.pullDownRefresh) {
        this._initPullDownRefresh();
      }

      if (this.pullUpLoad) {
        this._initPullUpLoad();
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    clickItem(e, item) {
      this.$emit("click", item);
    },
    destroy() {
      this.scroll.destroy();
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false;
        this._reboundPullDown().then(() => {
          this._afterPullDown();
        });
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.scroll.finishPullUp();
        this.pullUpDirty = dirty;
        this.isPullUpLoad = false;
        this.pullUploadText = "上拉加载更多";
        this.refresh();
      } else {
        this.refresh();
      }
    },
    _initPullDownRefresh() {
      this.scroll.on("pullingDown", () => {
        this.beforePullDown = false;
        this.isPullingDown = true;
        this.$emit("pullingDown");
      });

      this.scroll.on("scroll", pos => {
        if (!this.pullDownRefresh) {
          return;
        }
        //刷新图标的位置以及图标canvas变形状态
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
          this.pullDownStyle = `top:${Math.min(
            pos.y + this.pullDownInitTop,
            10
          )}px`;
        } else {
          this.bubbleY = 0;
        }

        //回弹到原来的位置
        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 -
            (this.pullDownRefresh.stop - pos.y)}px`;
        }
      });
    },
    _initPullUpLoad() {
      this.scroll.on("pullingUp", () => {
        this.isPullUpLoad = false;
        // this.$emit("pullingUp");
      });
    },
    _reboundPullDown() {
      //下拉完成，回弹操作
      const { stopTime = 600 } = this.pullDownRefresh;
      return new Promise(resolve => {
        setTimeout(() => {
          this.isRebounding = true;
          this.scroll.finishPullDown();
          resolve();
        }, stopTime);
      });
    },
    _afterPullDown() {
      //下拉回到原来位置，刷新数据
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`;
        this.beforePullDown = true;
        this.isRebounding = false;
        this.refresh();
      }, this.scroll.options.bounceTime);
    }
  },
  watch: {
    data(newVal) {
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.refreshDelay);
    }
  },
  components: {
    Loading,
    Bubble
  }
};
</script>

<style lang="less" rel="stylesheet/stylus">
.bScroll-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #fff;

  .bScroll-content {
    position: relative;
    z-index: 1;
  }
}

.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;

  .after-trigger {
    margin-top: 10px;
  }
}

.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
</style>
