<template>
    <div class="auto-answer">
        <WechatTitle title="自动回复" />
        <div class="answer-tabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="first"></el-tab-pane>
                <el-tab-pane label="收到消息回复" name="second"></el-tab-pane>
                <el-tab-pane label="关键词回复" name="third"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="reply-wrap">
          
            <reply-content
                ref="replycontent"
                v-if="activeName!=='third' || addAnswer===false"
                :isPicture="isPicture"
                @changeAnswerMode="changeAnswerMode"
            >
                <!-- 添加关键词回复 addAnswer===false" 下方出现 -->
                <keyword-answer v-if="addAnswer===false" slot="keyword" :addAnswer="addAnswer"></keyword-answer>
                <!-- 图片 -->
                <Picture :isPicture="isPicture" v-if="answerWay===1 && addAnswer"></Picture>
                <!-- 文字 -->
                <anser-text v-if="answerWay===2"></anser-text>
                <!-- 图文 -->
                <div v-if="false"></div>
                
            </reply-content>
            <!-- 初始关键词回复 begin -->
            <keyword-answer
                :addAnswer="addAnswer"
                v-if="activeName==='third'&&addAnswer===true"
                slot="keyword"
                @handlerAddAnswer="handlerAddAnswer"
            ></keyword-answer>
            <!-- 初始关键词回复 end -->
        </div>
    </div>
</template>
<script>
import WechatTitle from "@/components/common/WechatTitle.vue";
import ReplyContent from "@/components/wechat-account/auto-answer/reply-content.vue";
import Picture from "@/components/wechat-account/auto-answer/picture.vue";
import AnserText from "@/components/wechat-account/auto-answer/anser-text.vue";
import KeywordAnswer from "@/components/wechat-account/auto-answer/keyword-answer.vue";
export default {
    data() {
        return {
            activeName: "first",
            isPicture: true,
            answerWay: 1,
            addAnswer: true
        };
    },
    components: {
        WechatTitle,
        ReplyContent,
        Picture,
        AnserText,
        KeywordAnswer
    },
    methods: {
        handleClick(tab, event) {
            this.answerWay = 1;
            this.addAnswer =this.isPicture= true;
            if (this.activeName !== "third") {
                this.$nextTick(()=>{
                    this.$refs.replycontent.radio = 1;
                })
            }
        },
        changeAnswerMode(value) {
            this.isPicture = value === 1 ? true : false;
            this.answerWay = value;
        },
        handlerAddAnswer(value) {
            this.addAnswer = value;
        }
    }
};
</script>
<style scoped>
.el-tabs /deep/ .el-tabs__item {
    background: rgba(245, 245, 245, 1);
    font-size: 14px;
    padding: 0 24px;
    font-weight: 400;
    color: #262626;
    height: 60px;
    line-height: 57px;
    border-top: 3px solid transparent;
    box-sizing: border-box;
}
.el-tabs /deep/ .el-tabs__header{
    margin: 0;
}
.el-tabs /deep/ .is-active {
    background: #fff;
    border-top: 3px solid #09cceb;
}
</style>
<style lang="scss" scoped>
.auto-answer {
    padding: 32px;
    .answer-tabs {
        padding-top: 32px;
    }
    .reply-wrap {
        padding: 32px;
    }
}
</style>