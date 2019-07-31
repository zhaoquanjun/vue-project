<template>
   <div class="content-num-section">
        <!-- <p class="section-title">我的站点</p> -->
        <!-- <el-row class="content" :gutter="16">
            <el-col class="item" :span="6" v-for="(item, index) in siteInfo" :key="index" @click="a">
                <div class="item-box">{{item.siteName}}</div>
                <div>{{item.language == "zh-CN" ? "中" : "EN"}}</div>
                <div>{{item.isPublished ? "已发布" : "未发布"}}</div>
            </el-col>
            <div @click="showCreate">+</div>
        </el-row> -->
        <!-- <el-dialog
                width="0"
                :visible.sync = "createShow"
                :show-close="false"
                :close-on-click-modal="false"
        >
            <div class="right-pannel" :style="{width:'470px'}">
                <div class="pannel-head">
                    <span>
                        <span>创建网站</span>
                    </span>
                    <span class="close-pannel" @click="closeDialog">X</span>
                </div>
                <div>
                    <div>
                        <span>请设置您的网站名称：</span>
                        <el-input v-model="createSiteName" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        
                    </div>
                    <el-button :disabled="false">立即创建</el-button>
                </div>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
export default {
    props: ["siteInfo"],
    data() {
        return {
            createShow: false,
            createSiteName: ""
        };
    },
    
    created() {
        // this.a();
        // console.log(this.siteInfo)
    },
    methods:{
        showCreate() {
            this.createShow = true
        },
        closeDialog() {
            this.createShow = false;
        },
    },
    mounted(){
        console.log(this.siteInfo)
    },
};
</script>

<style lang="scss" scoped>
.content-num-section {
    margin-top: 10px;
    background: #fff;
    margin-bottom: 10px;
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
            padding: 0 16px;
            margin-bottom: 16px;
            border: 1px solid black;
            
        }
    }
}
.right-pannel {
    background: #ffffff;
    position: fixed;
    z-index: 2200;
    left: 50%;
    margin-left: -235px;
    top: 50%;
    // margin-top: 
    box-shadow: 0 0 3px #ccc;
    transition: width 0.2s linear;
    background-color: "#fff";
    color: #262626;
    overflow:hidden;
    .pannel-head {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #efefef;
        span {
            padding: 0 10px;
        }
        .close-pannel {
            float: right;
            cursor: pointer;
        }
    }
}
</style>
