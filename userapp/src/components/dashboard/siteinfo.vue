<template>
   <div class="content-num-section">
        <!-- <p class="section-title">我的站点</p>
        <el-row class="content" :gutter="16">
            <el-col class="item" :span="24" v-for="(item, index) in siteInfo" :key="index">
                <div class="item-box">{{item.siteName}}</div>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
export default {
    props: ["siteInfo"],
    data() {
        return {

        };
    },
    
    created() {
        // this.a();
        // console.log(this.siteInfo)
    },
    methods:{
        a(){
            console.log(this.siteInfo)
        }
    },
    mounted(){
        this.a()
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
</style>
