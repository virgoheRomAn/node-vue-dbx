<template>
  <div class="better-scroll-box">
    <div class="bscroll-container header big">
      <div class="bscroll-header">
        <div class="invite-container">
          <div class="invite-list">
            <div class="search-box">
              <el-input ref="searchInput" placeholder="搜索：姓名或者手机号" v-model="searchName" clearable @clear="clear">
                <i @click="search()" slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>

            <div class="invite-title">
              <label>下级用户总数<em>{{inviteLowerCount}}</em>，直接邀请用户合计<em>{{inviteCount}}</em>人</label>
            </div>
          </div>
        </div>
      </div>
      <scroll-item ref="scroll" class="wrapper" :data="inviteList" :pullUpLoad="pullUpLoadObj" @upload="onPullingUp">
        <div class="invite-container">
          <div class="invite-list pt-0 pb-0">
            <div class="box-list-information">
              <ul>
                <li v-for="(item,key) in inviteList" :key="key">
                  <div class="content row">
                    <div class="item row2">
                      <span>姓名：</span>
                      <label>{{item.userName}}</label>
                    </div>
                    <div class="item row2">
                      <span>手机号：</span>
                      <label>{{item.userMobile}}</label>
                    </div>
                    <div class="item row2">
                      <span>是否认证：</span>
                      <label class="tc-red">{{item.approve}}</label>
                    </div>
                    <div class="item row1">
                      <span>注册时间：</span>
                      <label>{{item.time}}</label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </scroll-item>
    </div>
    <div class="data-list-none pt-40" v-if="inviteList.length === 0">
      <label><img src="../../assets/img/404.png" /></label>
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "invitList",
  data() {
    return {
      pageNum: 1,
      pageSize: 30,
      pullUpLoadObj: false,
      searchName: "",
      inviteCount: "",
      inviteLowerCount: "",
      inviteList: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    clear() {
      this.$refs.searchInput.focus();
    },
    init() {
      this.ajaxListData(this.pageNum, this.pageSize, this.searchName).then(
        data => {
          if (data.list.length === this.pageSize) {
            this.pageNum++;
            this.pullUpLoadObj = {
              threshold: 20
            };
          } else {
            this.pullUpLoadObj = false;
          }
          
          setTimeout(() => {
            this.$refs.scroll && this.$refs.scroll.initScroll();
          }, 20);

          this.handleData(data);
        }
      );
    },
    search() {
      this.pageNum = 1;
      this.inviteList.splice(0, this.inviteList.length);
      this.init();
    },
    ajaxListData(pageNum, pageSize, username, type = true) {
      return new Promise((resolve, reject) => {
        this.API.get({
          url: `/user/myInvite`,
          params: {
            pageNum,
            pageSize,
            username
          },
          type
        })
          .then(data => {
            resolve(data);
          })
          .catch(data => {
            reject(data);
          });
      });
    },
    handleData(data) {
      this.inviteCount = data.count;
      this.inviteLowerCount = data.countall;
      if (data.list.length > 0) {
        data.list.map(item => {
          this.inviteList.push({
            userName: item.name,
            userMobile: item.mobile,
            approve: item.idcard_certified === "1" ? "是" : "否",
            time: item.create_time
          });
        });
      }
    },
    scrollTo(x, y, t) {
      this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
    },
    onPullingUp() {
      this.ajaxListData(
        this.pageNum,
        this.pageSize,
        this.searchName,
        false
      ).then(data => {
        setTimeout(() => {
          if (data.list.length !== 0) {
            this.pageNum++;
          }
          if (data.list.length !== this.pageSize) {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          }

          this.handleData(data);
        }, 500);
      });
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/_variable.less");
.invite-list {
  position: relative;
  z-index: 1000;
  padding: 15px;
  .search-box {
    margin-bottom: 15px;
    .el-input__inner {
      border: 1px solid @bd;
      padding-left: 10px;
    }
    .el-input__icon {
      font-size: @fs-18;

      &.el-icon-search {
        float: right;
      }
    }
  }

  .invite-title {
    display: block;
    font-size: @fs-14;
    color: @g-666;
    background: @g-f5f5;
    text-align: center;
    padding: 10px 15px;
    em {
      font-size: @fs-16;
      color: @main;
      margin: 0 5px;
    }
  }
}
</style>
