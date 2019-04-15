<template>
  <div class="better-scroll-box">
    <div class="bscroll-container">
      <scroll ref="scroll" class="wrapper" :data="list" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp">
        <div class="message-bar">
          <div class="box-list-message">
            <ul>
              <li v-for="(item,key) in list" :key="key">
                <h2>
                  <label><span>{{item.title}}</span></label>
                  <span>{{item.time}}</span>
                </h2>
                <div class="content">
                  <label>{{item.content}}</label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroll>

      <div class="data-list-none pt-40" v-if="list.length === 0">
        <label><img src="../../assets/img/404.png" /></label>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from "@/components/Scroll";

  export default {
    name: "message",
    components: {
      Scroll
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        list: [],

        pullUpLoadObj: false
      };
    },
    created() {
      this.ajaxListData(this.pageNum, this.pageSize).then(data => {
        if (data.length === this.pageSize) {
          this.pageNum++;
          this.pullUpLoadObj = {
            threshold: 20
          };
        } else {
          this.pullUpLoadObj = false;
        }

        setTimeout(() => {
          this.$refs.scroll.initScroll();
        }, 20);
        this.handleData(data);
      });
    },
    methods: {
      handleData(data) {
        data.map(item => {
          this.list.push({
            id: item.messageId,
            title: item.titleMessage,
            time: this.$G.getDateByTime(item.createTime),
            content: item.message
          });
        });
      },
      ajaxListData(pageNum, pageSize, type) {
        return new Promise((resolve, reject) => {
          this.userAPI
            .post(`/userCenter/myMessage`, {
              pageSize,
              pageNum,
              type
            })
            .then(data => {
              if (data.code !== 200) {
                reject(data);
              } else {
                resolve(data.data);
              }
            })
            .catch(data => {
              reject(data);
            });
        });
      },
      scrollTo(x, y, t) {
        this.$refs.scroll.scrollTo(x, y, t, "swipeBounce");
      },
      onPullingUp() {
        this.ajaxListData(this.pageNum, this.pageSize, false).then(data => {
          setTimeout(() => {
            if (data.length !== 0) {
              this.pageNum++;
            }
            if (data.length !== this.pageSize) {
              this.$refs.scroll && this.$refs.scroll.forceUpdate();
            }

            this.handleData(data);
          }, 1500);
        });
      }
    }
  };
</script>

<style lang="less">
  .message-bar {
    padding: 20px 15px 0;
  }
</style>
