<template>
  <div class="module-container">
    <div class="approve-bar">
      <div class="box-list-title">
        <h2 class="title">{{title}}</h2>
        <div class="container">
          <div class="box-list-arrow-content">
            <ul>
              <li>
                <div class="content" @click="showPicker">
                  <span>{{text}}</span>
                  <label>{{result}}</label>
                  <em><i class="sprite s-icon-arrow"></i></em>
                </div>
              </li>
            </ul>
          </div>

          <div class="handle-box">
            <el-button class="user-btn" @click="sure()">确定</el-button>
            <el-button class="user-btn line" @click="jump()">跳过</el-button>
          </div>
        </div>
      </div>
    </div>

    <picker @select="handleSelect(arguments)" :data="dataObject.data" :selected-index="selectedIndex" ref="picker"
      :title="title" @change="handleChange" cancelTxt="取消" confirmTxt="确定"></picker>
  </div>

</template>

<script>
  import Picker from "components/Picker";

  async function ajaxData(code, vue) {
    return new Promise(async (resolve, reject) => {
      try {
        let data_a = null;
        let data_b = null;
        let data_c = null;

        let loading = vue.$jBox.loading("获取中...");

        data_a = await vue.getData(code);
        data_a.map(item => {
          vue.dataObject.data[0].push({
            code: item.cfCode,
            text: item.cfName
          });
        });

        data_b = await vue.getData(data_a[0].cfCode);
        data_b.map(item => {
          vue.dataObject.data[1].push({
            code: item.cfCode,
            text: item.cfName
          });
        });

        if (code !== "01") {
          data_c = await vue.getData(data_b[0].cfCode);
          data_c.map(item => {
            vue.dataObject.data[2].push({
              code: item.cfCode,
              text: item.cfName
            });
          });
        }

        vue.$jBox.close(loading);
        resolve(data_a, data_b, data_c);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async function changeAjaxData(cfCode, code, vue, index) {
    return new Promise(async (resolve, reject) => {
      try {
        let data_b = null;
        let data_c = null;
        let ary_b = [];
        let ary_c = [];
        let loading = "";

        if (cfCode !== "01") {
          if (index !== 2) {
            loading = vue.$jBox.loading("获取中...");

            data_b = await vue.getData(code);
            ary_b = vue.dataObject.data[index + 1];
            ary_b.splice(0, ary_b.length);
            data_b.map(item => {
              ary_b.push({
                code: item.cfCode,
                text: item.cfName
              });
            });

            if (index !== 1) {
              data_c = await vue.getData(data_b[0].cfCode);
              ary_c = vue.dataObject.data[index + 2];
              ary_c.splice(0, ary_c.length);
              data_c.map(item => {
                ary_c.push({
                  code: item.cfCode,
                  text: item.cfName
                });
              });
            }
          }
        } else {
          if (index !== 1) {
            loading = vue.$jBox.loading("获取中...");

            data_b = await vue.getData(code);
            ary_b = vue.dataObject.data[index + 1];
            ary_b.splice(0, ary_b.length);
            data_b.map(item => {
              ary_b.push({
                code: item.cfCode,
                text: item.cfName
              });
            });
          }
        }

        vue.$jBox.close(loading);
        resolve({ data_b, data_c });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  export default {
    name: "setting-approve-info",
    components: {
      Picker
    },
    data() {
      return {
        title: "选择集团信息",
        text: "集团信息",
        result: "请选择",

        dataObject: {
          data: [[], [], []],
          type: ""
        },
        tempIndex: [0, 0, 0],
        selectedIndex: [0, 0, 0]
      };
    },
    created() {
      let vue = this;
      let classify = this.$route.params.identity;
      if (!classify || (classify !== "staff" && classify !== "owner")) {
        this.$jBox.error("请重新选择身份", {
          closeFun: () => {
            vue.$router.push({ name: "approve" });
          }
        });
        return false;
      }

      let cfCode = classify === "staff" ? "02" : classify === "owner" ? "01" : "";
      this.cfCode = cfCode;

      if (!cfCode) {
        this.$jBox.error("身份编码错误", {
          closeFun: () => {
            vue.$router.push({ name: "approve" });
          }
        });
        return false;
      }

      this.title = cfCode === "01" ? "选择小区信息" : "选择集团信息";
      this.text = cfCode === "01" ? "小区信息" : "集团信息";
      this.tempIndex = cfCode === "01" ? [0, 0] : [0, 0, 0];
      this.selectedIndex = cfCode === "01" ? [0, 0] : [0, 0, 0];
      this.dataObject.data = cfCode === "01" ? [[], []] : [[], [], []];

      ajaxData(cfCode, this);
    },
    methods: {
      getData(cfCode) {
        return new Promise((resolve, reject) => {
          this.$ajax
            .get(`/basic/userClassfl/${cfCode}`)
            .then(data => {
              resolve(data.data.data);
            })
            .catch(data => {
              reject(data);
            });
        });
      },
      showPicker() {
        this.$refs.picker.setData(this.dataObject.data);
        this.$refs.picker.show();
      },
      handleSelect(args) {
        let value = [...args][0];
        let text = [...args][2];
        this.result = "";
        text.map(item => {
          this.result += item + "，";
        });
        this.resultVal = value;
        this.result = this.result.substring(0, this.result.length - 1);
      },
      handleChange(currentIndex, selectIndex, selectVal, selectItem) {
        if (selectIndex !== this.tempIndex[currentIndex]) {
          changeAjaxData(this.cfCode, selectVal.code, this, currentIndex).then(
            data => {
              let all = this.cfCode === "01" ? 1 : 2;
              for (let i = all; i > currentIndex; i--) {
                this.tempIndex.splice(i, 1, 0);
                this.$refs.picker.scrollTo(i, 0);
              }

              this.tempIndex.splice(currentIndex, 1, selectIndex);
              this.$refs.picker.setData(this.dataObject.data);
            }
          );
        }
      },
      jump() {
        this.$router.push("/index");
      },
      sure() {
        if (!this.resultVal) {
          this.$jBox.error(`请选择${this.text}`);
          return false;
        }

        let vue = this;
        let loading = vue.$jBox.loading("设置中...");
        this.userAPI
          .post(`/userCenter/setStaffCode`, {
            staffCode: this.resultVal.pop()
          })
          .then(data => {
            this.$jBox.close(loading, null, () => {
              if (data.code !== 200) {
                vue.$jBox.error(data.message);
              } else {
                vue.$jBox.success("设置成功", {
                  closeFun: () => {
                    vue.$router.push({ name: "usercenter" });
                  }
                });
              }
            });
          });
      }
    }
  };
</script>
<style lang="less">
</style>

