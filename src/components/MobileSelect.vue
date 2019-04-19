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
      tempIndex: [0, 0, 0],
      pickerSelect: this.selectedIndex || []
    };
  },
  created() {
    //获取省市区
    if (this.cityPicker) {
      this.$ajax
        .get("/static/city.json", {
          baseURL: ""
        })
        .then(res => {
          let cityData = res.data.data;
          let provinces = this.$G.formatPickerData(
            cityData.province,
            "provinceName",
            "provinceId"
          );
          let cities = this.$G.formatPickerData(
            cityData.city,
            "cityName",
            "cityId"
          );
          let areas = this.$G.formatPickerData(
            cityData.area,
            "areaName",
            "areaId"
          );

          this.provinces = provinces;
          this.cities = cities;
          this.areas = areas;

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
          let initAreas = this.$G.getCountyData(addressCode[1], this.areas);

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
          let aIndex = this.$G.getArrayIndexByVal(
            addressCode[2],
            initAreas,
            "code"
          );

          if (initAreas.length === 0) {
            aIndex = 0;
          }

          this.tempIndex = [pIndex, cIndex, aIndex];
        } else {
          this.tempIndex = [0, 0, 0];
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
      let aList = this.$G.getCountyData(
        cList[this.tempIndex[1]].cityId,
        this.areas
      );

      if (aList.length === 0) {
        aList.push({
          areaId: null,
          areaName: "区县",
          cityId: null,
          code: null,
          text: "区县"
        });
      }

      this.pickerData.splice(0, this.pickerData.length);
      this.pickerData.push(pList, cList, aList);

      return { pList, cList, aList, initData: this.cityInitData };
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
          for (let i = 2; i > currentIndex; i--) {
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
