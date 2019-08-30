<template>
    <div class="auto-answer">
        <WechatTitle title="自动回复" />
        <div class="answer-tabs">
            <el-tabs v-model="replyType" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="1"></el-tab-pane>
                <el-tab-pane label="收到消息回复" name="2"></el-tab-pane>
                <el-tab-pane label="关键词回复" name="3"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="reply-wrap">
            <reply-content
                ref="replycontent"
                v-if="replyType!=='3' || addAnswer===false"
                :isPicture="isPicture"
                :is-set="isSet"
                @changeAnswerMode="changeAnswerMode"
                @handlerSave="handlerSave"
                @handlerDelete="handlerDelete"
            >
                <!-- 添加关键词回复 addAnswer===false" 下方出现 -->
                <keyword-answer v-show="addAnswer===false" slot="keyword" :addAnswer="addAnswer"></keyword-answer>
                <!-- 图片 -->
                <Picture v-show="msgType===1 && addAnswer"></Picture>
                <!-- 文字 -->
                <anser-text
                    :serve-text="replycontentData.textMsg.text"
                    v-show="msgType===2"
                    @handlerText="handlerText"
                ></anser-text>
                <!-- 图文 -->
                <image-text
                    v-show="msgType===3"
                    :isPicture="true"
                    :news-msg="replycontentData.newsMsg"
                    @handlerSaveImgText="handlerSaveImgText"
                ></image-text>
            </reply-content>
            <!-- 初始关键词回复 begin -->
            <keyword-answer
                :addAnswer="addAnswer"
                :keyword-data="keywordData"
                v-if="replyType==='3'&&addAnswer===true"
                slot="keyword"
                @handlerAddAnswer="handlerAddAnswer"
                @removeKeywordReply="_removeKeywordReply"
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
import { trim, notify } from "@/utlis/index.js";
export default {
    data() {
        return {
            replyType: "1", //replyType 回复类型
            isPicture: true,
            msgType: 1, //msgType 消息类型
            addAnswer: true,
            replycontentData: {
                imageMsg: {
                    picUrl: ""
                },
                textMsg: {
                    text: ""
                },
                newsMsg: [
                  
                ]
            },
            myText: "",
            lastSaveId: "",
            isSet: false, // 是否设置过回复
            replyDetail: "", // 接口返回
            keywordData: "" //关键词列表
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
    mounted() {
        this._getReplyDetail(1);
    },
    methods: {
        //获取回复详情
        async _getReplyDetail(replyType) {
            let data = await autoAnswerApi.getReplyDetail(replyType);
            console.log(data, "获取回复详情");
            let jsonData = data.data;
            this.replyDetail = jsonData;
            if (jsonData.isSet) {
                if (jsonData.msgType === 1) {
                    this.replycontentData.imageMsg = jsonData.data;
                } else if (jsonData.msgType === 2) {
                    this.replycontentData.textMsg = jsonData.data;
                } else if (jsonData.msgType === 3) {
                    this.replycontentData.newsMsg = jsonData.data;
                }
            }
        },
        //获取关键词回复列表
        async _getKeywordReplyList() {
            let { data } = await autoAnswerApi.getKeywordReplyList();
            this.keywordData = data;
            console.log(data, "获取关键词回复列表");
        },
        //删除回复信息
        async _removeReply(id) {
            let { data, status } = await autoAnswerApi.removeReply(id);
            if (status === 200) {
                this._getReplyDetail(this.replyType);
                this.resetReplycontentData();
                notify(this, "删除成功", "success");
                this.isSet = false;
            }
            console.log(data, "删除回复信息");
        },
        //删除关键词回复信息
        async _removeKeywordReply(id) {
            let data = await autoAnswerApi.removeKeywordReply();
            console.log(data, "删除关键词回复信息");
        },
        //新增关键词回复信息
        async _addKeywordReply(option) {
            let data = await autoAnswerApi.addKeywordReply(option);
            console.log(data, "新增关键词回复信息");
        },
        //新增或者覆盖回复信息
        async _addOrOverrideReply(option) {
            let { data, status } = await autoAnswerApi.addOrOverrideReply(
                option
            );
            console.log(data, "新增或者覆盖回复信息");
            if (status === 200) {
                this.$notify({
                    customClass: "notify-success",
                    message: `保存成功`,
                    showClose: false,
                    duration: 1500
                });
                this.isSet = true;
                this.replyDetail.id = data;
            }
        },
        //编辑关键词回复信息
        async _updateKeywordReply() {
            let data = await autoAnswerApi.updateKeywordReply();
            console.log(data, "编辑关键词回复信息");
        },
        // 保存
        handlerSave() {
            let option = {
                replyType: this.replyType,
                msgType: this.msgType,
                content: {}
            };
            if (this.replyType != 3) {
                if (this.msgType == 1) {
                    let picUrl = this.replycontentData.imageMsg.picUrl;
                    if (!trim(picUrl)) {
                        notify(this, "无法保存，请完善页面信息!", "error");
                        return;
                    }
                    option.content = {
                        imageMsg: {
                            picUrl: picUrl
                        }
                    };
                } else if (this.msgType == 2) {
                    let text = this.replycontentData.textMsg.text;
                    if (!trim(text)) {
                        notify(this, "无法保存，请完善页面信息!", "error");
                        return;
                    }
                    option.content = {
                        textMsg: {
                            text: text
                        }
                    };
                }
            } else if (this.replyType == 3) {
                let newsMsg = this.replycontentData.newsMsg;
                let option = {
                    msgType: this.msgType,
                    newsMsg:[  {
                        title: "string",
                        description: "string",
                        picUrl: "string",
                        url: "string"
                    }],
                    keywordList: [
                        {
                            keyword: "string",
                            matchType: "Contains"
                        }
                    ]
                };
                this._addKeywordReply(option);
                return;
            }
            this._addOrOverrideReply(option);
        },
        handlerSaveImgText(list) {
            console.log(list);
            this.replycontentData.newsMsg = list;
        },
        // 删除回复
        handlerDelete() {
            let message = [];
            message.push(
                this.$createElement(
                    "p",
                    { style: "color: #262626" },
                    ` 您确认要删除被关注时回复么?`
                )
            );
            message.push(
                this.$createElement(
                    "p",
                    { style: "color: #8C8C8C" },
                    "删除后，关注该公众号用户后台再无法接收该消息"
                )
            );

            this.$confirm("提示", {
                title: "提示",
                iconClass: "icon-warning",
                message: this.$createElement("div", null, message),
                callback: async action => {
                    if (action === "confirm") {
                        this._removeReply(this.replyDetail.id);
                    }
                }
            });
        },
        // 文字回复输入
        handlerText(text) {
            this.replycontentData.textMsg.text = text;
        },
        // 切换菜单
        handleClick(tab, event) {
            this.resetReplycontentData();
            this.msgType = 1;
            this.addAnswer = this.isPicture = true;
            if (this.replyType !== "3") {
                this._getReplyDetail(this.replyType);
                this.$nextTick(() => {
                    this.$refs.replycontent.radio = 1;
                });
            } else if (this.replyType === "3") {
                this._getKeywordReplyList();
            }
        },
        // 重置replycontentData
        resetReplycontentData() {
            this.replycontentData = {
                imageMsg: {
                    picUrl: ""
                },
                textMsg: {
                    text: ""
                },
                newsMsg: []
            };
        },
        // 改变回复方式
        changeAnswerMode(value) {
            this.isPicture = value === 1 ? true : false;
            this.msgType = value;
            console.log(this.replyType, this.msgType);
            console.log(this.replyDetail);
            if (
                this.replyType == this.replyDetail.replyType &&
                this.msgType == this.replyDetail.msgType
            ) {
                this.isSet = this.replyDetail.isSet;
            } else {
                this.isSet = false;
            }
        },
        // 添加关键词回复
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