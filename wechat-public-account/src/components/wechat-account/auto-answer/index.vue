<template>
    <div class="auto-answer">
        <WechatTitle title="自动回复" />
        <div class="answer-tabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="1"></el-tab-pane>
                <el-tab-pane label="收到消息回复" name="2"></el-tab-pane>
                <el-tab-pane label="关键词回复" name="3"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="reply-wrap">
            <reply-content
                ref="replycontent"
                v-if="activeName!=='3' || addAnswer===false"
                :isPicture="isPicture"
                @changeAnswerMode="changeAnswerMode"
            >
                <!-- 添加关键词回复 addAnswer===false" 下方出现 -->
                <keyword-answer v-show="addAnswer===false" slot="keyword" :addAnswer="addAnswer"></keyword-answer>
                <!-- 图片 -->
                <Picture v-show="answerWay===1 && addAnswer"></Picture>
                <!-- 文字 -->
                <anser-text v-show="answerWay===2"></anser-text>
                <!-- 图文 -->
                <image-text v-show="answerWay===3" :isPicture="true"></image-text>
            </reply-content>
            <!-- 初始关键词回复 begin -->
            <keyword-answer
                :addAnswer="addAnswer"
                v-if="activeName==='3'&&addAnswer===true"
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
import ImageText from "@/components/wechat-account/auto-answer/image-text.vue";
import KeywordAnswer from "@/components/wechat-account/auto-answer/keyword-answer.vue";
import * as autoAnswerApi from "@/api/request/autoAnswerApi.js";
export default {
    data() {
        return {
            activeName: "1",
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
        KeywordAnswer,
        ImageText
    },
    mounted(){
        this._getReplyDetail(1)
    },
    methods: {
        //获取回复详情
        async _getReplyDetail(replyType) {
            let data = await autoAnswerApi.getReplyDetail(replyType);
            console.log(data, "获取回复详情");
        },
        //获取关键词回复列表
        async _getKeywordReplyList() {
            let data = await autoAnswerApi.getKeywordReplyList();
            console.log(data, "获取关键词回复列表");
        },
        //删除回复信息
        async _removeReply() {
            let data = await autoAnswerApi.removeReply();
            console.log(data, "删除回复信息");
        },
        //删除关键词回复信息
        async _removeKeywordReply() {
            let data = await autoAnswerApi.removeKeywordReply();
            console.log(data, "删除关键词回复信息");
        },
        //新增关键词回复信息
        async _addKeywordReply() {
            let data = await autoAnswerApi.addKeywordReply();
            console.log(data, "新增关键词回复信息");
        },
        //新增或者覆盖回复信息
        async _addOrOverrideReply() {
            let data = await autoAnswerApi.addOrOverrideReply();
            console.log(data, "新增或者覆盖回复信息");
        },
        //编辑关键词回复信息
        async _updateKeywordReply() {
            let data = await autoAnswerApi.updateKeywordReply();
            console.log(data, "编辑关键词回复信息");
        },
        handleClick(tab, event) {
            this.answerWay = 1;
            this.addAnswer = this.isPicture = true;
            if (this.activeName !== "3") {
                 this._getReplyDetail(this.activeName)
                this.$nextTick(() => {
                    this.$refs.replycontent.radio = 1;
                });
            }else if(this.activeName === "3"){
                this._getKeywordReplyList()
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
.el-tabs /deep/ .el-tabs__header {
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