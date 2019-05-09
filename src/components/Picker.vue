<template>
  <transition name="picker-fade">
    <div class="picker" v-show="state===1" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div class="picker-panel" v-show="state===1" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel" @click="cancel">{{cancelTxt}}</span>
            <span class="confirm" @click="confirm">{{confirmTxt}}</span>
            <h1 class="picker-title">{{title}}</h1>
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px"></div>
            <div class="mask-bottom border-top-1px"></div>
            <div class="wheel-wrapper" ref="wheelWrapper">
              <div class="wheel" v-for="data in pickerData">
                <ul class="wheel-scroll">
                  <li v-for="item in data" class="wheel-item">{{item.text}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="picker-footer"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from "assets/plugins/betterScroll";

  const STATE_HIDE = 0;
  const STATE_SHOW = 1;

  const COMPONENT_NAME = "picker";
  const EVENT_SELECT = "select";
  const EVENT_VALUE_CHANGE = "valuechange";
  const EVENT_CANCEL = "cancel";
  const EVENT_CHANGE = "change";

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      title: {
        type: String
      },
      cancelTxt: {
        type: String,
        default: "cancel"
      },
      confirmTxt: {
        type: String,
        default: "confirm"
      },
      selectedIndex: {
        type: Array,
        default() {
          return [];
        }
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        state: STATE_HIDE,
        pickerData: this.data.slice(),
        pickerSelectedIndex: this.selectedIndex,
        pickerSelectedVal: [],
        pickerSelectedText: []
      };
    },
    created() {
      if (!!this.pickerSelectedIndex && !this.pickerSelectedIndex.length) {
        this.pickerSelectedIndex = [];
        for (let i = 0; i < this.pickerData.length; i++) {
          this.pickerSelectedIndex[i] = 0;
        }
      }
    },
    methods: {
      confirm() {
        if (!this._canConfirm()) {
          return;
        }
        this.hide();

        let changed = false;
        for (let i = 0; i < this.pickerData.length; i++) {
          let index = this.wheels[i].getSelectedIndex();
          this.pickerSelectedIndex[i] = index;

          let value = null;
          if (this.pickerData[i].length) {
            value = this.pickerData[i][index].code;
          }

          if (this.pickerSelectedVal[i] !== value) {
            changed = true;
          }
          this.pickerSelectedText[i] = this.pickerData[i][index].text;
          this.pickerSelectedVal[i] = this.pickerData[i][index].code;
        }

        this.$emit(
          EVENT_SELECT,
          this.pickerSelectedVal,
          this.pickerSelectedIndex,
          this.pickerSelectedText
        );

        if (changed) {
          this.$emit(
            EVENT_VALUE_CHANGE,
            this.pickerSelectedVal,
            this.pickerSelectedIndex,
            this.pickerSelectedText
          );
        }
      },
      cancel() {
        this.hide();
        this.$emit(EVENT_CANCEL);
      },
      show() {
        if (this.state === STATE_SHOW) {
          return;
        }
        this.state = STATE_SHOW;

        if (!this.wheels || this.dirty) {
          this.$nextTick(() => {
            this.wheels = [];
            let wheelWrapper = this.$refs.wheelWrapper;
            for (let i = 0; i < this.pickerData.length; i++) {
              this._createWheel(wheelWrapper, i);
            }
            this.dirty = false;
          });
        } else {
          for (let i = 0; i < this.pickerData.length; i++) {
            this.wheels[i].enable();
            this.wheels[i].wheelTo(this.pickerSelectedIndex[i]);
          }
        }
      },
      hide() {
        this.state = STATE_HIDE;

        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].disable();
        }
      },
      refill(datas) {
        let ret = [];
        if (!datas.length) {
          return ret;
        }
        datas.forEach((data, index) => {
          ret[index] = this.refillColumn(index, data);
        });
        return ret;
      },
      refillColumn(index, data) {
        if (this.state !== STATE_SHOW) {
          return;
        }
        const wheelWrapper = this.$refs.wheelWrapper;
        let scroll = wheelWrapper.children[index].querySelector(".wheel-scroll");
        let wheel = this.wheels[index];
        if (scroll && wheel) {
          let oldData = this.pickerData[index];
          this.$set(this.pickerData, index, data);
          let selectedIndex = wheel.getSelectedIndex();
          let dist = 0;
          if (oldData.length) {
            let oldValue = oldData[selectedIndex].value;
            for (let i = 0; i < data.length; i++) {
              if (data[i].value === oldValue) {
                dist = i;
                break;
              }
            }
          }
          this.pickerSelectedIndex[index] = dist;
          this.$nextTick(() => {
            wheel = this._createWheel(wheelWrapper, index);
            wheel.wheelTo(dist);
          });
          return dist;
        }
      },
      setData(data) {
        this.pickerData = data.slice();
        this.dirty = true;
      },
      setSelectedIndex(index) {
        this.pickerSelectedIndex = index;
      },
      scrollTo(index, dist) {
        if (!this.wheels) return false;
        const wheel = this.wheels[index];
        this.pickerSelectedIndex[index] = dist;
        wheel.wheelTo(dist);
      },
      refresh() {
        if (!this.wheels) return false;
        this.$nextTick(() => {
          this.wheels.forEach((wheel, index) => {
            wheel.refresh();
          });
        });
      },
      _createWheel(wheelWrapper, i) {
        if (!this.wheels[i]) {
          this.wheels[i] = new BScroll(wheelWrapper.children[i], {
            wheel: {
              selectedIndex: this.pickerSelectedIndex[i],
              wheelWrapperClass: "wheel-scroll",
              wheelItemClass: "wheel-item"
            },
            probeType: 3
          });

          this.wheels[i].on("scrollEnd", () => {
            let currentIndex = i;
            let selectIndex = this.wheels[i].getSelectedIndex();

            this.$emit(
              EVENT_CHANGE,
              currentIndex,
              selectIndex,
              this.pickerData[currentIndex][selectIndex],
              this.wheels[currentIndex].items[selectIndex]
            );
          });
        } else {
          this.wheels[i].refresh();
        }

        return this.wheels[i];
      },
      _canConfirm() {
        return this.wheels.every(wheel => {
          return !wheel.isInTransition;
        });
      }
    },
    watch: {
      data(newData) {
        this.setData(newData);
      }
    }
  };
</script>

<style scoped lang="less">
  @import url("../assets/plugins/betterScroll/index.less");
</style>
