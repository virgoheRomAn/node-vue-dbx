<template>
  <div class="settings-bar">
    <div class="box-list-arrow-content">
      <ul>
        <li class="special">
          <div class="content">
            <span>头像</span>

            <div class="avatar-uploader">
              <div class="el-upload">
                <img v-if="headPhoto" :src="headPhoto">
                <img v-else src="../../assets/img/user/headImg.png">

                <input ref="headImage" type="file" accept="image/*" @change="uploadImg($event,'headImage')">
              </div>
            </div>

            <em><i class="sprite s-icon-arrow"></i></em>
          </div>
        </li>
        <li v-for="(item,key) in personInfo" :key="key" v-if="!item.picker">
          <div class="content" @click="setting(item.type,item.text,key)">
            <span>{{item.title}}</span>
            <label>{{item.text}}</label>
            <em v-if="!!item.type">
              <i class="sprite s-icon-arrow"></i>
            </em>
          </div>
        </li>

        <mobile-select v-else ref="addressPicker" title="选择省市区" resultField="address" :pickerData="addressAry" :editor="false"
          :cityInitData="userInfo.address" :cityPicker="true" :linkage="true" @init="pickerInit" @select="selectResult"
          @change="addressChange">
          <template slot="text">
            <span>居住省市区</span>
            <label @click="showPicker('addressPicker')" :class="{'disable':!userInfo.address.text}">{{userInfo.address.text
              || "请选择省市区"}}</label>
          </template>
        </mobile-select>

      </ul>
    </div>
    <div class="login-out">
      <el-button class="user-btn radius" @click="loginout()">退出登录</el-button>
    </div>

    <popup-box id="popupBox" ref="popupBox" :isFooter="true" :isTitle="false" containerCls="fullscreen" @show="popShow"
      @ensure="ensure">
      <template slot="cont">
        <vue-cropper ref="cropper" :img="option.img" :mode="option.mode" :outputType="option.outputType" :info="true"
          :canMove="option.canMove" :canMoveBox="option.canMoveBox" :fixed="true" :centerBox="true" :fixedBox="option.fixedBox"
          :fixedNumber="option.fixedNumber" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight" @cropMoving="cropMoving"></vue-cropper>
      </template>
    </popup-box>

  </div>
</template>

<script>
import { ajax_host } from "@/request/native.js";
export default {
  name: "settings",
  data() {
    return {
      fileUploadUrl: `${ajax_host}/basic/fileUpload`,
      headPhoto: "",
      personInfo: [
        { title: "昵称", text: "", type: "name" },
        { title: "手机号", text: "", type: "phone" },
        { title: "邮箱", text: "", type: "emall" },
        { title: "省份城市", text: "", type: "city", picker: true },
        { title: "资质认证", text: "" },
        { title: "登陆密码", text: "", type: "password" },
        { title: "提现密码", text: "", type: "payPSD" }
      ],

      addressAry: [],
      userInfo: {
        address: {
          code: "",
          text: ""
        }
      },
      option: {
        img: "",
        mode: "100% auto",
        outputType: "png",
        fixedBox: false,
        fixedNumber: [1, 1],
        canMove: true,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: window.screen.width,
        autoCropHeight: window.screen.width,
        cropData: {}
      }
    };
  },
  created() {
    this.getUserInfo()
      .then(data => {
        this.headPhoto = data.portrait;

        this.personInfo = [
          { title: "昵称", text: data.username, type: "" },
          { title: "手机号", text: data.mobile, type: "" },
          { title: "邮箱", text: data.email, type: "" },
          {
            title: "省份城市",
            text: "",
            type: "",
            picker: true
          },
          { title: "资质认证", text: data.approve === 0 ? "未认证" : "已认证" },
          { title: "登陆密码", text: "", type: "password" },
          { title: "提现密码", text: "", type: "payPSD" }
        ];

        this.userInfo = {
          address: {
            code: [data.provinceId, data.cityId],
            text: `${data.provinceName}，${data.cityName}`
          }
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    getUserInfo() {
      return new Promise((resolve, reject) => {
        this.API.get({ url: `/usercenter/userInfo` })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cropMoving(data) {
      this.option.cropData = data;
    },
    uploadImg(e, id) {
      let file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$jBox.error("请上传图片文件！");
        return false;
      }
      let reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }

        this.option.img = data;
      };
      reader.readAsArrayBuffer(file);
      this.$refs.popupBox.show();
    },
    popShow() {
      this.$refs.headImage.value = "";
    },
    ensure() {
      this.$refs.cropper.getCropData(data => {
        this.headPhoto = data;
      });
    },
    pickerInit(data) {
      let p = this.$G.getArrayValueById(data.initData.code[0], data.pList);
      let c = this.$G.getArrayValueById(data.initData.code[1], data.cList);

      let cAry = [p, c];
      this.userInfo.address.text = cAry.join("，");
    },
    showPicker(ref) {
      if (this.$G.isArray(this.$refs[ref])) {
        this.$refs[ref][0].showPicker();
      } else {
        this.$refs[ref].showPicker();
      }
    },
    selectResult(field, text, value) {
      if (!!parseInt(field)) {
        this.contactsInfo[parseInt(field) - 1].result = {
          text: text,
          code: value
        };
      } else {
        this.userInfo[field] = { text: text, code: value };
      }
    },
    addressChange(currentIndex, selectIndex) {
      this.$refs.addressPicker.setAddressData();
    },
    setting(type, text, key) {
      let title = this.personInfo[key].title;
      switch (type) {
        case "name":
        case "emall":
          this.$jBox.prompt("", `请输入${title}`, {
            prompt_input_value: text,
            prompt_validator: function(value) {
              if (value === "" || value === null) {
                return `${title}不能为空`;
              } else if (value.length >= 20) {
                return `${title}不能超过20个字符`;
              }
            },
            confirm: opt => {
              this.personInfo[key].text = opt.prompt.value;
            }
          });
          break;
        case "phone":
          this.$router.push(`/usercenter/s/psd/changepay`);
          break;
        case "password":
          this.$router.push(`/usercenter/s/psd/changelogin`);
          break;
        case "payPSD":
          this.$router.push(`/usercenter/s/psd/vermobile/changepaypwd`);
          break;
        case "bank":
          this.$router.push(`/usercenter/s/bank/change`);
          break;
      }
    },
    handleAvatarError(res, file) {
      let vue = this;
      vue.$jBox.close(vue.loading, null, function() {
        vue.$jBox.error("上传失败！");
      });
    },
    handleAvatarSuccess(res, file) {
      let vue = this;
      let fileToken = res.data.fileToken;

      this.userAPI
        .post(
          `/userCenter/setNickAndHead`,
          {
            headPortrait: fileToken
          },
          false
        )
        .then(data => {
          this.$jBox.close(this.loading, null, () => {
            vue.$jBox.success("设置成功", {
              closeFun: () => {
                vue.setData();
              }
            });
          });
        })
        .catch(e => {
          console.log(e);
          vue.$jBox.close(vue.loading, null, function() {
            vue.$jBox.error("设置失败");
          });
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type == "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$jBox.error("上传头像图片只能是<br> JPG或PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$jBox.error("上传头像图片大小不能超过 2MB!");
        return false;
      }

      this.loading = this.$jBox.loading("上传中...");
      return isJPG && isLt2M;
    },
    loginout() {
      this.USER.userLogout().then(data => {
        if (data.code === 200) {
          this.$router.push("/");
        }
      });
    }
  }
};
</script>
