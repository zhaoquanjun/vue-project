<template>
    <div class="auto-answer">
        <WechatTitle title="自动回复"/>
        <div class="answer-tabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="被关注时回复" name="first">被关注时回复</el-tab-pane>
                <el-tab-pane label="收到消息回复" name="second">收到消息回复</el-tab-pane>
                <el-tab-pane label="关键词回复" name="third">关键词回复</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import WechatTitle from "@/components/common/WechatTitle.vue"
export default {
    data() {
        return {
            activeName: "first"
        };
    },
    components:{
        WechatTitle
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
    background: #E5E5E5;
    font-size: 16px;
    font-weight: 400;
    color: #262626;
    padding: 24px 12px;
}
.el-tabs /deep/ .is-active{
    background: #fff;
}
</style>
<style lang="scss" scoped>

.auto-answer {
    padding: 32px;
  
    .answer-tabs {
        padding-top: 32px;
    }
}
</style>