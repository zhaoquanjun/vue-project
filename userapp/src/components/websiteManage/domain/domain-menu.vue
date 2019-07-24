<template>
    <div>
         <el-tabs v-model="backupType" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="手动备份" name="manual"></el-tab-pane>
                <el-tab-pane label="自动备份" name="auto"></el-tab-pane>
            </el-tabs>
            <button class="backupBtn" @click="handleBtn">添加域名</button>
    </div>
</template>
<script>
export default {
    data(){
        return {
             backupType: "manual",
        }
    },
    methods:{
        /**
         * 切换列表
         */
        handleTabClick() {
           
        },
        /**
         * 点击右侧btn
         */
        handleBtn(){

        }
    }
}
</script>

<style scoped>
.el-tabs{
    margin-top: 24px
}
.el-tabs /deep/ .el-tabs__item{
    width: 88px;
    height: 38px;
    font-size: 12px;
    font-weight: 400;
    color:rgba(51,51,51,1);
    line-height: 36px;
    border-bottom: 1px solid #E4E7ED;
    background:rgba(245,245,245,1);
    vertical-align: top;
    border-top: 2px solid transparent;
}
.el-tabs /deep/ .is-active{
    color:rgba(1,192,222,1);
    border-top: 2px solid rgb(72,201,226);
    border-bottom: 1px solid transparent;
    background: rgb(255, 255, 255)
}
.backupBtn{
    width: 110px;
    height: 32px;
    background:rgba(0,193,222,1);
    position: absolute;
    right: 16px;
    top: 217px;
    font-size:12px;
    font-weight:400;
    color:rgba(255,255,255,1);
}
</style>

