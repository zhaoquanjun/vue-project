<template>
    <m-container>
        <template v-slot:sub-menu>
            <PageSubmenu/>
        </template>
        <template v-slot:container>
            <el-container>
                <el-aside class="tree-aside">
                    <h4 class="pic-type-title">
                        <svg-icon icon-class="img-type-title"></svg-icon>
                        <span>图片分类</span>
                    </h4>
                    <h5 class="title-item">全部分类(12)</h5>
                    <MTree/>
                </el-aside>
                <el-main>
                    <ContentHeader/>
                    <el-main style="background:yellow">
                        <ContentTable/>
                    </el-main>
                </el-main>
            </el-container>
        </template>
    </m-container>
</template>
<script>
import MContainer from "@/components/common/MContainer.vue";
import PageSubmenu from "@/components/common/PageSubmenu.vue";
import MTree from "./MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTabale"
export default {
    components: {
        MContainer,
        PageSubmenu,
        MTree,
        ContentHeader,
        ContentTable
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
    margin: 0 21px;
}
</style>
<style lang="scss" scoped>
.pic-type-title {
    height: 60px;
    line-height: 60px;
    padding-left: 14px;
    border-bottom: 1px solid #e8eaf3;
    span {
        vertical-align: middle;
        padding-left: 10px;
    }
}
.title-item {
    padding: 28px 0 12px 12px;
}
</style>



