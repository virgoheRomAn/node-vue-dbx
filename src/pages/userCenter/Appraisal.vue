<template>
  <div class="appraisal-bar">
    <div class="box-list-question">
      <div class="q"><label>{{question.q}}</label></div>
      <ul class="a">
        <li v-for="(value,key,index) in question.a" :key="index" :class="{active:index===currentIndex}">
          <div class="content" @click.stop="selecAnswer($event, key, question.aid[index], question.qid)">
            <span>{{key}}、</span>
            <label>{{value}}</label>
          </div>
        </li>
      </ul>
      <div class="handle">
        <div class="container">
          <a v-if="index !== 0" href="javascript:;" @click="selecQuestion('prev')">上一题</a>
          <label>{{index + 1}}/{{all}}</label>
          <a v-if="index !== all-1" href="javascript:;" @click="selecQuestion('next')">下一题</a>
        </div>
      </div>
    </div>
    <div class="handle-box" v-if="index === all-1">
      <el-button class="user-btn" @click="sure()">确定并提交</el-button>
    </div>
  </div>
</template>

<script>
  import data from "components/data/appraisalData.js";
  export default {
    name: "appraisal",
    data() {
      return {
        index: 0,
        all: 0,
        sid: "",
        question: {},
        questionList: [],
        currentIndex: -1,
        currentAnswer: "",
        currentAry: [],
        answersList: []
      };
    },
    created() {
      this.userAPI.get(`/userCenter/riskQuestions`).then(data => {
        this.sid = data.sid;
        data.typeList.map(item => {
          this.all += item.queList.length;
          item.queList.map(x => {
            let answerText = {},
              answerId = [];
            x.answers.map(m => {
              answerText[m.sn] = m.text;
              answerId.push(m.aid);
            });

            this.questionList.push({
              qid: x.id,
              q: x.content,
              a: answerText,
              aid: answerId
            });
          });
        });
        this.question = this.questionList[0];
      });
    },
    methods: {
      selecAnswer(event, key, aid, qid) {
        let $ele = this.$(event.currentTarget);
        let _index = $ele.parents("li").index();
        this.currentIndex = _index;
        this.currentAnswer = key;
        this.currentAry[this.index] = {
          qIndex: this.index + 1,
          aKey: this.currentAnswer,
          sIndex: this.currentIndex
        };

        this.answersList[this.index] = {
          qid: qid,
          answers: [aid]
        };
      },
      selecQuestion(type) {
        switch (type) {
          case "prev":
            this.index--;
            break;
          case "next":
            if (this.currentIndex === -1) {
              this.$jBox.error("请选择一个答案");
              return false;
            }
            this.index++;
            break;
        }

        this.question = this.questionList[this.index];

        if (!!this.currentAry[this.index]) {
          this.currentIndex = this.currentAry[this.index].sIndex;
        } else {
          this.currentIndex = -1;
        }
      },
      sure() {
        let vue = this;
        if (this.currentIndex === -1) {
          this.$jBox.error("请选择一个答案");
          return false;
        }

        this.userAPI
          .riskAnswerSubmit({
            sid: this.sid,
            questions: this.answersList
          })
          .then(data => {
            this.$router.push({
              name: "appraisalResult",
              query: { redirect: this.$route.query.redirect || "" }
            });
          })
          .catch(data => {
            console.log(data);
          });
      }
    }
  };
</script>

<style lang="less">
  @import url("../../assets/less/_variable.less");
  .appraisal-bar {
    padding: 20px 0;
    .box-list-question {
      .q {
        padding: 0 20px;
      }
      .a {
        li {
          padding: 0 20px;
        }
      }
      .handle {
        padding: 0 20px;
      }
    }
  }
  .result-pop {
    position: relative;
    display: flex;
    flex-direction: column;
    label {
      font-size: @fs-18;
      color: @main;
    }
    em {
      font-size: 24px;
      color: @red;
      margin: 10px 0;
    }
    span {
      color: @main;
      font-size: @fs-14;
      text-align: left;
      line-height: 24px;
    }
  }
</style>
