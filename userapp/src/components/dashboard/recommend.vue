<template>
    <div class="content-num-section">
        <p class="section-title">使用推荐</p>
        <el-row class="content" :gutter="16">
            <el-col class="item" :span="6" v-for="(item, index) in recommend" :key="index">
                <div class="item-box">
                    <div class="item-title">{{item.appName}}</div>
                    <div class="item-icon"></div>
                    <span class="item-content">{{item.appDescription}}</span>
                    <div class="item-btn" @click="open(item.appUrl)">查看详情</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ["recommend"],
    methods:{
        open(url) {
            window.open(url)
        }
    }
};
</script>

<style lang="scss" scoped>
.content-num-section {
    margin-top: 10px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
    .section-title {
        padding-left: 19px;
        padding-bottom: 16px;
        padding-top: 19px;
        font-size:18px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(38,38,38,1);
    }
    .content {
        padding: 0 24px 16px;
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            margin-bottom: 16px;

            .item-box {
                width: 100%;
                height: 260px;
                position: relative;
                padding: 0 16px;
                background:rgba(251,251,251,1);
                text-align: center;
                .item-title{
                    margin-top: 29px;
                    font-size:20px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(38,38,38,1);
                    text-align: center;
                    margin-bottom: 18px;
                }
                .item-icon{
                    display: block;
                    width: 40px;
                    height: 40px;
                    background: url("~img/dashboard/board-aliyun.png") no-repeat center;
                    background-size: contain;
                    margin-bottom: 20px;
                    margin: 0 auto 20px;
                }
                .item-content{
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(140,140,140,1);
                    text-align: center;
                }
                .item-btn{
                    text-align: center;
                    height:32px;
                    border:1px solid rgba(0,193,222,1);
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(0,193,222,1);
                    line-height:32px;
                    width: 100%;
                    position: absolute;
                    bottom: 32px;
                    left: 0px;
                    cursor:pointer;
                }
            }
        }
    }
}
</style>
