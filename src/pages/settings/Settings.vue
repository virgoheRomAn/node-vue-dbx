<template>
  <div class="settings-bar">
    <div class="box-list-arrow-content">
      <ul>
        <li class="special">
          <div class="content">
            <span>头像</span>
            <el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" :on-error="handleAvatarError">
              <img v-if="headPhoto" :src="headPhoto">
              <img v-else src="../../assets/img/user/headImg.png">
            </el-upload>
            <em><i class="sprite s-icon-arrow"></i></em>
          </div>
        </li>
        <li v-for="(value,key) in personInfo" :key="key">
          <div class="content" @click="setting(value.type)">
            <span>{{value.title}}</span>
            <label>{{value.text}}</label>
            <em>
              <i v-if="!!value.type" class="sprite s-icon-arrow"></i>
            </em>
          </div>
        </li>

      </ul>
    </div>
    <div class="login-out">
      <el-button class="user-btn" @click="loginout()">退出登录</el-button>
    </div>

  </div>
</template>

<script>
  import {ajax_host} from "@/request/native.js";
  export default {
    name: "settings",
    data() {
      return {
        fileUploadUrl: `${ajax_host}/basic/fileUpload`,
        headPhoto: "",
        userName: "",
        userMobile: "",
        userClassify: "",
        userClassifyCode: "",
        userClassifyInfo: "",
        personInfo: [
          { title: "昵称", text: "", type: "name" },
          { title: "手机号", text: "" },
          { title: "身份信息", text: "", type: "person" },
          { title: "集团信息", text: "", type: "personInfo" }
        ]
      };
    },
    created() {
      this.setData();
    },
    methods: {
      setData() {
        this.userAPI.get(`/userCenter/userExtData`).then(data => {
          this.headPhoto = data.headPortrait || "";
          this.userName = data.nickName || "";
          this.userMobile = data.phoneNum;
          if (!data.staffCode) {
            this.userClassifyCode = "";
            this.userClassify = "会员";
          } else {
            this.userClassifyCode = data.staffCode.substring(0, 2);
            this.userClassify = this.userClassifyCode === "01" ? "业主" : "员工";
          }

          if (data.staffName) {
            let nameAry = data.staffName.split("/");
            this.userClassifyInfo = data.staffName
              .split("/")
              .reverse()
              .join("，");
            this.userClassifyInfo = this.userClassifyInfo.substring(
              1,
              this.userClassifyInfo.length
            );
          }

          this.personInfo = [
            { title: "昵称", text: this.userName, type: "name" },
            { title: "手机号", text: this.userMobile },
            { title: "身份信息", text: this.userClassify, type: "person" },
            {
              title: "集团信息",
              text: this.userClassifyInfo,
              type: "personInfo"
            }
          ];

          if (!this.userClassifyCode) {
            this.personInfo.pop();
          }
        });
      },
      setting(tag) {
        let vue = this;
        switch (tag) {
          case "name":
            this.$prompt("", "请输入昵称", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPlaceholder: this.personInfo[0].text || "请输入昵称",
              inputValidator: function(value) {
                if (value === "" || value === null) {
                  return "昵称不能为空";
                } else if (value.length >= 20) {
                  return "昵称不能超过20个字符";
                }
              }
            })
              .then(({ value }) => {
                this.userAPI
                  .post(`/userCenter/setNickAndHead`, {
                    nickName: value
                  })
                  .then(data => {
                    this.$jBox.success("设置成功", {
                      closeFun: () => {
                        vue.setData();
                      }
                    });
                  });
              })
              .catch(() => {});
            break;
          case "person":
            this.$router.push({ name: "approve" });
            break;
          case "personInfo":
            let cls = this.userClassifyCode === "01" ? "owner" : "staff";
            let tle = this.userClassifyCode === "01" ? "选择小区" : "选择集团";
            this.$router.push({
              name: "approveInfo",
              params: {
                identity: cls
              },
              query: {
                title: tle
              }
            });
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
        this.userAPI.userLogout().then(data => {
          if (data.code === 200) {
            this.$router.push("/");
          }
        });
      }
    }
  };
</script>
