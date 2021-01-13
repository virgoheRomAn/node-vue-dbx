<template>
  <div class="footer-bar">
    <div class="footer">
      <ul>
        <li>
          <router-link to="/index">
            <label>
              <i class="sprite s-icon-index"></i>
              <span>首页</span>
            </label>
          </router-link>
        </li>
        <li>
          <router-link to="/invite/s/index">
            <label>
              <i class="sprite s-icon-invite"></i>
              <span>邀请</span>
            </label>
          </router-link>
        </li>
        <li>
          <router-link to="/usercenter">
            <label>
              <i class="sprite s-icon-mine"></i>
              <span>我的</span>
            </label>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import CONST from "@/assets/js/const";
export default {
  name: "fb-footer",
  methods: {
    jump() {
      let userInfo = this.__G__.getItem([CONST.USERINFO]);
      if (!userInfo) {
        this.$router.push({
          name: "login",
          query: { redirect: this.$route.fullPath },
        });
        return false;
      } else {
        this.$router.push({
          path: "invite/s/index",
        });
      }
    },
  },
};
</script>
