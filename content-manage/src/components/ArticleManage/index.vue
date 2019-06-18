<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>文章分类</span>
            </h4>
            <h5 class="title-item">全部分类(12)</h5>
            <m-tree></m-tree>
        </el-aside>
        <el-main>
            <content-header  :article-search-options="articleSearchOptions"
                             @getArticleList="getArticleList"></content-header>
            <el-main>
                 <content-table
                 v-if="articlePageResult !== null"
                 :article-page-result="articlePageResult"
                 :article-search-options="articleSearchOptions"
                 :tree-result="treeResult"
                 @getArticleList="getArticleList"></content-table>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import MTree from "./MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTable";
import { getArticalList } from "@/api/request/articleManageApi";
export default {
    components: {
        MTree,
        ContentHeader,
        ContentTable
    },
    data() {
        return {
            articlePageResult: null,
            treeResult: null,
            dialogTableVisible:false,
            articleSearchOptions: { title: "", categoryId: 0, orderCondition: 0, OrderByTopOrder: null, publishStatus: null, pageIndex: 1, pageSize: 10, isDescending: true }
        };
    },
    mounted() {
        this.getArticleList();
    },
    methods: {
        async getArticleList(options) {
            let { data } = await getArticalList((options = this.articleSearchOptions));
            this.articlePageResult = data;
        },
        // resetCategoryId() {
        //     this.picSearchOptions.picCategoryId = null;
        //     this.getPicList();
        // },
        // async changeCategoryPic(categoryId, idList) {
        //     await imgManageApi.changeCategory(categoryId, idList);
        //     this.getPicList();
        // },
        // async renamePic(id, newname) {
        //     await imgManageApi.rename(id, newname);
        //     this.getPicList();
        // },
        // async getTree() {
        //     let { data } = await imgCategoryManageApi.get();
        //     this.treeResult = data.treeArray;
        //     this.totalSum = data.totalSum;
        // },
        // async newCategory(entity) {
        //     console.log(entity);
        //     await imgCategoryManageApi.create(entity);
        //     this.getTree();
        //     }
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



