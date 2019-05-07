<template>
  <li>
    <div class="content">
      <slot name="text"></slot>
      <em><i class="sprite s-icon-arrow" v-if="editor"></i></em>
    </div>
    <picker @select="handleSelect(arguments)" :data="pickerData" :selected-index="pickerSelect" ref="picker" :title="title"
      @change="handleChange" cancelTxt="取消" confirmTxt="确定"></picker>
  </li>
</template>

<script>
export default {
  name: "mobile-select",
  props: {
    resultSplit: {
      type: String,
      default: "，"
    },
    resultField: {
      type: null,
      default: null
    },
    editor: {
      type: Boolean,
      default: true
    },
    pickerData: {
      type: Array,
      default: null
    },
    initData: {
      type: Object,
      default: null
    },
    cityInitData: {
      type: Object,
      default: null
    },
    selectedIndex: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    linkage: {
      type: Boolean,
      default: false
    },
    cityPicker: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      provinces: [],
      cities: [],
      areas: [],
      tempIndex: [0, 0],
      pickerSelect: this.selectedIndex || []
    };
  },
  created() {
    //获取省市区
    if (this.cityPicker) {
      this.API.get({ url: `/basic/city`, type: false }).then(data => {
        let provinces = this.$G.formatPickerData(
          data.province,
          "provinceName",
          "provinceId"
        );
        let cities = this.$G.formatPickerData(data.city, "cityName", "cityId");

        this.provinces = provinces;
        this.cities = cities;

        this.init();
      });
    }
  },
  watch: {
    cityInitData(val) {
      this.init();
    },
    pickerData() {
      this.$refs.picker && this.$refs.picker.refresh();
    }
  },
  methods: {
    init() {
      let initData = {};

      if (this.cityPicker) {
        if (this.$G.isArray(this.cityInitData.code)) {
          let addressCode = this.cityInitData.code;
          let initProvince = this.provinces;
          let initCities = this.$G.getCityData(addressCode[0], this.cities);

          let pIndex = this.$G.getArrayIndexByVal(
            addressCode[0],
            initProvince,
            "code"
          );
          let cIndex = this.$G.getArrayIndexByVal(
            addressCode[1],
            initCities,
            "code"
          );

          pIndex = pIndex < 0 ? 0 : pIndex;
          cIndex = cIndex < 0 ? 0 : cIndex;

          this.tempIndex = [pIndex, cIndex];
        } else {
          this.tempIndex = [0, 0];
        }

        this.$refs.picker && this.$refs.picker.setSelectedIndex(this.tempIndex);
        initData = this.setAddressData();

        this.$G.isArray(this.cityInitData.code) && this.$emit("init", initData);
      }
    },
    setAddressData() {
      let pList = this.provinces;
      let cList = this.$G.getCityData(
        pList[this.tempIndex[0]].provinceId,
        this.cities
      );

      this.pickerData.splice(0, this.pickerData.length);
      this.pickerData.push(pList, cList);

      return { pList, cList, initData: this.cityInitData };
    },
    showPicker() {
      if (!this.editor) return false;
      this.pickerSelect.splice(0, this.pickerSelect.length);

      if (this.initData && !this.selectedIndex) {
        if (!!this.initData.code && this.$G.isArray(this.initData.code)) {
          this.initData.code.map((item, index) => {
            this.pickerSelect.push(
              this.$G.getArrayIndexByVal(item, this.pickerData[index], "code")
            );
          });
        } else {
          this.pickerSelect = [
            this.$G.getArrayIndexByVal(
              this.initData.code,
              this.pickerData[0],
              "code"
            )
          ];
        }
      }

      if (!this.cityInitData) {
        if (this.$refs.picker) {
          if (!!this.initData.code) {
            this.$refs.picker.setSelectedIndex(this.pickerSelect);
          }
          this.$refs.picker.show();
        }
      } else {
        this.$refs.picker.show();
      }
    },
    handleSelect(args) {
      if (!this.resultField) return false;

      let value = [...args][0];
      let text = [...args][2];
      let valueStr = value.join("-");
      let textStr = text.join(this.resultSplit);

      if (this.pickerData.length > 1) {
        this.$emit("select", this.resultField, textStr, value, ...args);
      } else {
        this.$emit("select", this.resultField, textStr, valueStr, ...args);
      }
    },
    handleChange(currentIndex, selectIndex, value) {
      if (this.linkage) {
        if (selectIndex !== this.tempIndex[currentIndex]) {
          for (let i = 1; i > currentIndex; i--) {
            this.tempIndex.splice(i, 1, 0);
            this.$refs.picker.scrollTo(i, 0);
          }
          this.tempIndex.splice(currentIndex, 1, selectIndex);

          this.$emit("change", currentIndex, selectIndex, value);
        }
      } else {
        if (this.pickerData.length > 1) {
          this.$emit("change", currentIndex, selectIndex, value);
        }
      }
    }
  }
};
</script>

<style>
</style>
