<template>
    <div class="domain-menu">
        <el-tabs v-model="backupType" @tab-click="handleTabClick('')">
            <el-tab-pane label="域名列表" name="domainList"></el-tab-pane>
            <el-tab-pane label="301重定向" name="301Redirect"></el-tab-pane>
        </el-tabs>
        <button class="backupBtn" @click="handleBtn">{{handlerBtnText}}</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            backupType: "domainList",
            handlerBtnText:"添加域名"
        };
    },
    methods: {
        /**
         * 切换列表
         */
        handleTabClick(backupType) {
           this.backupType = backupType || this.backupType ;
            this.$emit("handleTabClick",this.backupType)
            if(this.backupType=="301Redirect"){
                this.handlerBtnText="添加重定向"
            }else{
                 this.handlerBtnText="添加域名"
            }
        },
        /**
         * 点击右侧btn
         */
        handleBtn() {
           
            this.$emit("handleBtn",this.backupType);
        }
    }
};
</script>

<style scoped>
.domain-menu{
    position: relative;
    height:50px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(215,216,217,1);
    margin-bottom: 12px;
    
}
.domain-menu /deep/ .el-tabs__nav-wrap::after{
    height:0;
}
.el-tabs /deep/ .el-tabs__active-bar.is-top {
    width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item{
    height:50px;
    line-height: 50px;
    margin:0 24px;
    padding: 0;
    color:#262626;
}
.el-tabs /deep/ .el-tabs__item.is-active{
    border-bottom: 2px solid #ff6b00;
}
.backupBtn {
    width: 90px;
    height: 32px;
    background: #ff6b00;
    position: absolute;
    right: 16px;
    top: 9px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.backupBtn:hover{
    opacity: 0.8;
}
</style>

