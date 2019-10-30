<template>
    <div class="auto-answer">
        <ChangeSite
            @chooseWebsite="chooseWebsite"
            @getSiteId="getSiteId"
        />
        <div class="answer-tabs">
            <el-tabs v-model="replyType" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="1"></el-tab-pane>
                <el-tab-pane label="收到消息回复" name="2"></el-tab-pane>
                <el-tab-pane label="关键词回复" name="3"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="reply-wrap" :style="{height:scrollHeight+'px'}" v-scrollBar>
            <reply-content
                ref="replycontent"
                v-if="replyType!=='3' || addAnswer===false"
                :isPicture="msgType==1?true:false"
                :is-set="isSet"
                :msg-type="msgType"
                :replyType="replyType"
                @handlerCancel="handlerCancel"
                @changeAnswerMode="changeAnswerMode"
                @handlerSave="handlerSave"
                @handlerDelete="handlerDelete"
            >
            <!-- 添加关键词回复 addAnswer===false" 下方出现 -->
            <keyword-answer
                v-if="replyType==='3' && addAnswer===false"
                slot="keyword"
                ref="keywordAnswer"
                :addAnswer="addAnswer"
                :keyword-data="keywordData"
                :propKeywordList="propKeywordList"
            ></keyword-answer>
            <!-- 图片 -->
            <Picture
                :keyword-data="keywordData"
                ref="pictureComponent"
                :image-msg="replycontentData.imageMsg.picUrl"
                v-show="(msgType===1 && addAnswer) || (replyType=='3' && !addAnswer && msgType==1)"
                @handlerPic="handlerPic"
            ></Picture>
            <!-- 文字 -->
            <anser-text
                :keyword-data="keywordData"
                :serve-text="replycontentData.textMsg.text"
                v-show="msgType===2"
                @handlerText="handlerText"
            ></anser-text>
            <!-- 图文 -->
            <image-text
                :keyword-data="keywordData"
                ref="newMsg"
                v-show="msgType===3"
                :news-msg="replycontentData.newsMsg"
                :replyType= 'replyType'
                @handlerSaveImgText="handlerSaveImgText"
            ></image-text>
            </reply-content>
            <!-- 初始关键词回复 begin -->
            <keyword-answer
                :addAnswer="addAnswer"
                :keyword-data="keywordData"
                :searchOption="searchOption"
                v-if="replyType==='3'&&addAnswer===true"
                slot="keyword"
                @handlerAddAnswer="handlerAddAnswer"
                @removeKeywordReply="_removeKeywordReply"
                @getKeywordReplyList="_getKeywordReplyList"
            ></keyword-answer>
            <!-- 初始关键词回复 end -->
        </div>
    </div>
</template>
<script>
import ChangeSite from "@/components/common/changeSite";
import ReplyContent from "@/components/wechat-account/auto-answer/reply-content.vue";
import Picture from "@/components/wechat-account/auto-answer/picture.vue";
import AnserText from "@/components/wechat-account/auto-answer/anser-text.vue";
import ImageText from "@/components/wechat-account/auto-answer/image-text.vue";
import KeywordAnswer from "@/components/wechat-account/auto-answer/keyword-answer.vue";
import * as autoAnswerApi from "@/api/request/autoAnswerApi.js";
import { trim, notify } from "@/utlis/index.js";
import {getLocal} from '@/libs/local'
import { log } from 'util';
export default {
    data() {
        return {
            model: {
                PageIndex: null,
                Type: null,
                Href: null
            },
            canHandlerSave: true,
            replyType: "1", //replyType 回复类型
            msgType: 1, //msgType 消息类型
            addAnswer: true,
            siteId: this.$store.state.dashboard.siteId || getLocal("ymSd"),
            replycontentData: {
                imageMsg: {
                    picUrl: ""
                },
                textMsg: {
                    text: ""
                },
                newsMsg: []
            },
            myText: "",
            lastSaveId: "",
            editorId: '',
            id: '',
            isSet: false, // 是否设置过回复
            replyDetail: "", // 接口返回
            keywordData: "", //关键词列表,
            searchOption: {
                pageSize: 10,
                pageIndex: 1,
                Keyword: "",
                SiteId: this.$store.state.dashboard.siteId || getLocal("ymSd")
            },
            keywordContentData: {
                msgType: "",
                keywordList: [],
                imageMsg: {},
                textMsg: { text: "" },
                newsMsg: []
            },
            isShowPopup: false,
            scrollHeight: 500,
            propKeywordList: ""
        };
    },
    components: {
        ChangeSite,
        ReplyContent,
        Picture,
        AnserText,
        KeywordAnswer,
        ImageText
    },
    created() {
        let wx_status = this.$store.state.wxaccount.wx_status || getLocal("wx_status")
        if (!wx_status.isCertification) {
            this._getWxIsAuth()
        }
    },
    mounted() {
        this._getReplyDetail(1);
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.scrollHeight = window.innerHeight - 290;
            });
            this.scrollHeight = window.innerHeight - 290;
        });
    },
    methods: {
        getSiteId(siteId) {
        },
        // 切换站点刷新信息
        chooseWebsite(siteId) {
            this._getWxIsAuth()
        },
        async _getWxIsAuth() {
            await this.$store.dispatch('_getWxStatus')
            let wx_status = this.$store.state.wxaccount.wx_status
            this.siteId = this.$store.state.dashboard.siteId
            this.searchOption.SiteId = this.$store.state.dashboard.siteId
            if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
                this.$router.replace({path:'/wechat/wxauther' });
            }
        },
        //获取回复详情
        async _getReplyDetail(replyType) {
            let data = await autoAnswerApi.getReplyDetail(this.siteId,replyType);
            this.replyDetail = data.data.data;
            this.id = data.data.id;
            this.msgType = data.data.msgType;
            this.isSet = data.data.isSet;
            let jsonData = data.data.data;
            if (data.data.msgType) {
                this.msgType = data.data.msgType;
            } else {
                this.msgType = 1;
            }
            if (jsonData && jsonData.imageMsg) {
                this.replycontentData.imageMsg.picUrl = jsonData.imageMsg.picUrl;
            } else {
                this.replycontentData.imageMsg.picUrl = '';
            }
            if (jsonData && jsonData.textMsg) {
                this.replycontentData.textMsg.text = jsonData.textMsg.text;
            } else {
                this.replycontentData.textMsg.text = '';
            }
            if (jsonData && jsonData.newsMsg) {
                this.replycontentData.newsMsg = jsonData.newsMsg;
            } else {
                this.replycontentData.newsMsg = [];
            }
        },
        //获取关键词回复列表
        async _getKeywordReplyList(option) {
            let { data } = await autoAnswerApi.getKeywordReplyList(
                this.searchOption
            );
            if(data) {
                this.keywordData = data;
                this.searchOption.Keyword = ''
            }
        },
        //删除回复信息
        async _removeReply(siteId,id) {
            console.log('this.replyDetail',this.replyDetail)
            let { data, status } = await autoAnswerApi.removeReply(siteId,id);
            if (status === 200) {
                if (this.replyType != 3) {
                    this._getReplyDetail(this.replyType);
                }
                this.resetReplycontentData();
                notify(this, "删除成功", "success");
                this.isSet = false;
            } else {
                notify(this, "删除失败", "error");
            }
        },
        //删除关键词回复信息
        async _removeKeywordReply(id) {
            this.$confirm("提示", {
                title: "提示",
                iconClass: "icon-warning",
                message: "确定要删除本条回复内容吗？",
                callback: async action => {
                    if (action === "confirm") {
                        let {
                            data,
                            status
                        } = await autoAnswerApi.removeKeywordReply(id,this.siteId);
                        if (status == 200 ) {
                            this.$notify({
                                customClass: "notify-success",
                                message: `删除成功`,
                                showClose: false,
                                duration: 1500
                            });
                        } else {
                            notify(this, "删除失败", "error");
                        }
                        this._getKeywordReplyList(this.searchOption);
                    }
                }
            });
        },
        //
        handlerCancel(){
            this.replyType = '3',
            this.addAnswer = true
        },
        //新增关键词回复信息
        async _addKeywordReply(option) {
            let { data, status } = await autoAnswerApi.addKeywordReply(option,this.siteId);
            if (status === 200) {
                this.canHandlerSave = true
                this.$notify({
                    customClass: "notify-success",
                    message: `保存成功`,
                    showClose: false,
                    duration: 1500
                });
                if (this.replyType == 3) {
                    this.addAnswer = true;
                    this._getKeywordReplyList(this.searchOption);
                }
                this.isSet = true;
                this.replyDetail.id = data;
            } else {
                this.canHandlerSave = true
                notify(this, "保存失败", "error");
            }
        },
        //新增或者覆盖回复信息
        async _addOrOverrideReply(option) {
            let { data, status } = await autoAnswerApi.addOrOverrideReply(option);
            if (status === 200) {
                this.canHandlerSave = true
                this.$notify({
                    customClass: "notify-success",
                    message: `保存成功`,
                    showClose: false,
                    duration: 1500
                });
                if (this.replyType == 3) {
                    this.addAnswer = true;
                    this._getKeywordReplyList(this.searchOption);
                }
                this.isSet = true;
                this.replyDetail.id = data;
            } else {
                this.canHandlerSave = true
                notify(this, "保存失败", "error");
            }
        },
        //编辑关键词回复信息
        async _updateKeywordReply(option, editorId) {
            let data = await autoAnswerApi.updateKeywordReply(option, editorId, this.siteId);
            if(data.status && data.status === 200) {
                this.canHandlerSave = true
                this.$notify({
                    customClass: "notify-success",
                    message: `保存成功`,
                    showClose: false,
                    duration: 1500
                });
                this.addAnswer = true;
                this._getKeywordReplyList(this.searchOption);
                this.isSet = true;
                this.replyDetail.id = data;
            } else {
                this.canHandlerSave = true
                notify(this, "保存失败", "error");
            }
        },
        // 保存
        async handlerSave() {
            if(!this.canHandlerSave) {
                return
            }
            this.canHandlerSave = false
            let option = {
                siteId: this.siteId,
                replyType: this.replyType,
                msgType: this.msgType,
                publicPlatformReplyInput: {
                    imageMsg: '',
                    textMsg: '',
                    newsMsg: ''
                }
            };
            if (this.replyType != 3) {
                //图片
                let picUrl = this.replycontentData.imageMsg.picUrl;
                    option.publicPlatformReplyInput.imageMsg = {
                        picUrl: picUrl
                    };
                //文字
                let text = this.replycontentData.textMsg.text;
                    option.publicPlatformReplyInput.textMsg = {
                        text: text
                    };
                //图文
                let curEditorItem = this.$refs.newMsg.curEditorItem;
                let newsMsg = this.replycontentData.newsMsg;
                option.publicPlatformReplyInput.newsMsg = newsMsg;
                //校验
                if (this.msgType == 1) {
                    if (!trim(picUrl)) {
                        notify(this, "请添加图片", "error");
                        this.canHandlerSave = true
                        return;
                    }
                } else if (this.msgType == 2) {
                    if (!trim(text)) {
                        notify(this, "请输入内容", "error");
                        this.canHandlerSave = true
                        return;
                    }
                } else if (this.msgType == 3) {
                    if (newsMsg.length === 0) {
                        notify(this, "请添加图文", "error");
                        this.canHandlerSave = true
                        return;
                    }
                }
            } else if (this.replyType == 3) {
                let keywordList = this.$refs.keywordAnswer.keywordList;
                let flag = keywordList.every((item, index) => {
                    if (!trim(item.keyword)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                if (!flag) {
                    notify(this, "无法保存，请完善页面信息!", "error");
                    this.canHandlerSave = true
                    return
                }
                let option = {
                    msgType: this.msgType,
                    keywordList
                };
                let newOption;
                if (this.msgType == 1) {
                    let picUrl = this.replycontentData.imageMsg.picUrl;
                    if (!trim(picUrl)) {
                        notify(this, "无法保存，请完善页面信息!", "error");
                        this.canHandlerSave = true
                        return;
                    }
                    newOption = {
                        ...option,
                        imageMsg: { ...this.replycontentData.imageMsg }
                    };
                } else if (this.msgType == 2) {
                    let text = this.replycontentData.textMsg.text;
                    if (!trim(text)) {
                        notify(this, "无法保存，请完善页面信息!", "error");
                        this.canHandlerSave = true
                        return;
                    }
                    newOption = {
                        ...option,
                        textMsg: { ...this.replycontentData.textMsg }
                    };
                } else if (this.msgType == 3) {
                    let newsMsg = this.replycontentData.newsMsg;
                    if (newsMsg.length === 0) {
                        notify(this, "无法保存，请完善页面信息!", "error");
                        this.canHandlerSave = true
                        return;
                    }

                    newOption = { ...option, newsMsg: newsMsg };
                }
                if (this.editorId) {
                    this._updateKeywordReply(newOption, this.editorId);
                } else {
                    this._addKeywordReply(newOption);
                }
                return;
            }
            this._addOrOverrideReply(option);
        },
        handlerSaveImgText(list) {
            this.replycontentData.newsMsg = list;
        },
        // 删除回复
        handlerDelete() {
            let answerText = "";
            switch (parseFloat(this.replyType)) {
                case 1:
                    answerText = "被关注时";
                    break
                case 2:
                    answerText = "收到消息";
                    break
                case 3:
                    answerText = "关键词";
                    break
            }
            let message = [];
            message.push(
                this.$createElement(
                    "p",
                    { style: "color: #262626" },
                    ` 您确认要删除${answerText}回复么?`
                )
            );
            message.push(
                this.$createElement(
                    "p",
                    { style: "color: #8C8C8C" },
                    "删除后，关注该公众号用户再无法接收该消息"
                )
            );

            this.$confirm("提示", {
                title: "提示",
                iconClass: "icon-warning",
                message: this.$createElement("div", null, message),
                callback: async action => {
                    if (action === "confirm") {
                        this._removeReply(this.siteId,this.id);
                    }
                }
            });
        },
        // 文字回复输入
        handlerText(text) {
            this.replycontentData.textMsg.text = text;
        },
        handlerPic(picUrl) {
            this.replycontentData.imageMsg.picUrl = picUrl;
        },
        // 切换菜单
        handleClick(tab, event) {
            this.resetReplycontentData();
            this.msgType = 1;
            this.addAnswer = true;
            if (this.replyType !== "3") {
                this._getReplyDetail(this.replyType);
                this.$nextTick(() => {
                    this.$refs.replycontent.radio = 1;
                });
            } else if (this.replyType === "3") {
                this._getKeywordReplyList(this.searchOption);
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
            this.msgType = value;
            if (
                this.replyDetail &&
                this.replyType == this.replyDetail.replyType &&
                this.msgType == this.replyDetail.msgType
            ) {
                this.isSet = this.replyDetail.isSet;
            } else {
                this.isSet = false;
            }
        },
        // 添加关键词回复
        handlerAddAnswer(value, item) {
            this.addAnswer = value;
            //清空缓存
            this.msgType = 1;
            this.replycontentData={
                imageMsg: {
                    picUrl: ""
                },
                textMsg: {
                    text: ""
                },
                newsMsg: []
            };
            if (item && JSON.parse(item).keywordList) {
                let items = JSON.parse(item)
                this.replyDetail = items;
                this.propKeywordList = items.keywordList;
                this.msgType = items.msgType;
                this.isSet = true;
                this.editorId = items.id;
                if (items.msgType === 1) {
                    this.replycontentData.imageMsg = items.data.imageMsg;
                } else if (items.msgType === 2) {
                    this.replycontentData.textMsg = items.data.textMsg;
                } else if (items.msgType === 3) {
                    this.replycontentData.newsMsg = items.data.newsMsg;
                } 
            } else {
                this.propKeywordList = "";
            }
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
    padding: 16px 32px 0;
    .answer-tabs {
        padding-top: 32px;
    }
    .reply-wrap {
        padding: 24px 0 0 0;
        position: relative;
        //  overflow-y: auto;
    }
}
</style>