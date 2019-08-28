<template>
    <div class="auto-answer">
        <WechatTitle title="自动回复"/>
        <div class="answer-tabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="first"></el-tab-pane>
                <el-tab-pane label="收到消息回复" name="second"></el-tab-pane>
                <el-tab-pane label="关键词回复" name="third"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="reply-wrap">
            <!--  :isPicture="true" -->
            <reply-content>
               <!-- <Picture ></Picture> -->
                <anser-text></anser-text>
            </reply-content>
        </div>
    </div>
</template>
<script>
import WechatTitle from "@/components/common/WechatTitle.vue";
import ReplyContent from "@/components/wechat-account/auto-answer/reply-content.vue";
import Picture from "@/components/wechat-account/auto-answer/picture.vue";
import AnserText from "@/components/wechat-account/auto-answer/anser-text.vue"
export default {
    data() {
        return {
            activeName: "first"
        };
    },
    components:{
        WechatTitle,ReplyContent,Picture,AnserText
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style scoped>
.el-tabs /deep/ .el-tabs__item{
    background:rgba(245,245,245,1);
    font-size: 16px;
    padding: 0 12px;
    font-weight: 400;
    color: #262626;
    height: 70px;
    line-height: 70px;
    border-top: 3px solid transparent;
    box-sizing: border-box;
   
}
.el-tabs /deep/ .is-active{
    background: #fff;
    border-top: 3px solid #09CCEB;
    
}
</style>
<style lang="scss" scoped>
.auto-answer {
    padding: 32px;
    .answer-tabs {
        padding-top: 32px;
    }
    .reply-wrap{
        padding: 32px;
    }
}
</style>