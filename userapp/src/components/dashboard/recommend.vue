<template>
    <div class="content-num-section">
        <p class="section-title">使用推荐</p>
        <el-row class="content" :gutter="16">
            <el-col class="item" :span="6" v-for="(item, index) in recommend" :key="index">
                <div class="item-box">
                        <div class="item-title">{{item.appName}}</div>
                        <div class="item-icon"></div>
                        <span class="item-content">{{item.appDescription}}</span>
                        <div class="item-btn">查看详情</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ["recommend"],
    data() {
        return {

        };
    },
    created() {

    },
    methods:{

    }
};
</script>

<style lang="scss" scoped>
.content-num-section {
    margin-top: 10px;
    background: #fff;
    .section-title {
        padding-left: 16px;
        padding-bottom: 16px;
        padding-top: 14px;
        font-size: 14px;
        line-height: 18px;
    }
    .content {
        padding: 0 24px 16px;
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            margin-bottom: 16px;
            border: 1px solid black;
            .item-box {
                width: 100%;
                height: 260px;
                // display: flex;
                // justify-content: space-between;
                // align-items: center;
                padding: 0 16px;
                background: #f5f5f5;
                
                .item-title{
                    color: rgba(38, 38, 38, 1);
                    font-size: 16px;
                    text-align: center;
                }
                .item-icon{
                    height: 100px;
                }
                .item-content{
                    font-size: 14px;
                    color: #8c8c8c;
                }
                .item-btn{
                    text-align: center;
                    background: #00c1de;
                }
            }
        }
    }
}
</style>
