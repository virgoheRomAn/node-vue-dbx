<template>
  <div class="approve-bar">
    <div class="box-list-title">
      <h2 class="title">会员身份认证</h2>
      <div class="container">
        <div class="box-list-arrow isImg">
          <ul>
            <li>
              <a href="/usercenter/settings/approveInfo/staff?title=选择公司">
                <label><img src="../../assets/img/user/headImg.png"></label>
                <span>我是员工</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a href="/usercenter/settings/approveInfo/owner?title=选择小区">
                <label><img src="../../assets/img/user/headImg1.png"></label>
                <span>我是业主</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
            <li>
              <a href="javascript:;" @click="sure()">
                <label><img src="../../assets/img/user/headImg2.png"></label>
                <span>我是会员</span>
                <em><i class="sprite s-icon-arrow"></i></em>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="warning-box">
      <label>温情提示</label>
      <span>1、如果您是协信的员工或业主、请认证个人信息。 </span>
      <span>2、如果您既是员工又是业主，请选择员工认证。</span>
      <span>3、如果您是会员，请选择会员。</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "setting-approve",
    methods: {
      sure() {
        let vue = this;
        let loading = vue.$jBox.loading("设置中...");
        this.userAPI
          .post(`/userCenter/setStaffCode`, {
            staffCode: ""
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
  .approve-bar {
    position: relative;
    padding: 30px 15px;
    .warning-box {
      margin-top: 50px;
    }

    .box-list-arrow-content {
      > ul {
        li {
          &:first-child {
            .content {
              span {
                top: 0;
              }
            }
          }
        }
      }
    }

    // .box-list-arrow-content {
    //   > ul {
    //     li {
    //       &:first-child {
    //         .content {
    //           span {
    //             top: 20px;
    //           }
    //         }
    //       }
    //       .content {
    //         position: relative;
    //         padding-left: 85px;
    //         span {
    //           position: absolute;
    //           top: 20px;
    //           left: 0;
    //           font-size: 16px;
    //         }
    //         label {
    //           font-size: 16px;
    //         }
    //         em {
    //           width: 20px;
    //           i {
    //             transform: scale(1.5);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
</style>

