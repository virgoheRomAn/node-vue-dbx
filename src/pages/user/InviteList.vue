<template>
  <div class="invite-list">
    <div class="search-box">
      <el-input placeholder="搜索：姓名或者手机号" v-model="searchName">
        <i @click="search()" slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>

    <div class="invite-title">
      <label>直接邀请用户合计<em>{{inviteCount}}</em>人</label>
    </div>

    <div class="box-list-information mt-15">
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
      searchName: "",
      inviteCount: "",
      inviteList: []
    };
  },
  created() {
    this.getInviteList();
  },
  methods: {
    search() {
      this.getInviteList(this.searchName);
    },
    getInviteList(username) {
      this.API.get({ url: `/user/myInvite`, params: { username } }).then(
        data => {
          this.inviteList.splice(0, this.inviteList.length);

          this.inviteCount = data.count;
          if (data.list.length !== 0) {
            data.list.map(item => {
              this.inviteList.push({
                userName: item.name,
                userMobile: item.mobile,
                approve: item.idcard_certified === "1" ? "是" : "否",
                time: item.create_time
              });
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/_variable.less");
.invite-list {
  position: relative;
  padding: 15px;
  .search-box {
    margin-bottom: 15px;
    .el-input__inner {
      border: 1px solid @bd;
      padding-left: 10px;
    }
    .el-input__icon {
      font-size: @fs-18;
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
