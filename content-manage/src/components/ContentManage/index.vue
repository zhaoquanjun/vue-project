<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>图片分类</span>
            </h4>
            <h5 class="title-item">全部分类(12)</h5>
            <m-tree></m-tree>
        </el-aside>
        <el-main  style="height: calc(100vh - 50px);
    overflow-y: auto;">
            <content-header></content-header>
            <el-main>
                 <content-table></content-table>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import MTree from "./MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTable";
export default {
    components: {
        MTree,
        ContentHeader,
        ContentTable
    },
    methods:{
        
    }
};
</script>
<style scoped>
.el-main {
    /* padding: 0; */
}
.el-container /deep/ .tree-aside {
    width: 164px !important;
    height: 100vh;
    background: #fff;
    margin: 0 0 0 13px;
}
</style>
<style lang="scss" scoped>
.pic-type-title {
    height: 60px;
    line-height: 60px;
    padding-left: 14px;
    border-bottom: 1px solid #e8eaf3;
    border-right: 1px solid #e8eaf3;
    box-sizing: border-box;
    span {
        vertical-align: middle;
        padding-left: 10px;
    }
}
.title-item {
    padding: 28px 0 12px 12px;
}
</style>



