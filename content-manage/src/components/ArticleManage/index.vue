<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>文章分类</span>
            </h4>
            <h5 class="title-item" @click="resetCategoryId">全部分类</h5>
            <m-tree 
            :treeResult="treeResult"
            :articleSearchOptions="articleSearchOptions"
            @getList="getArticleListAsync"
            @create="newCategory"
            @batchRemove="batchRemoveCategory"
            @rename="renameCategory"
            ></m-tree>
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
import * as articleManageApi from "@/api/request/articleManageApi";
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
        this.getArticleListAsync();
        this.getTreeAsync();
    },
    methods: {
        async getArticleListAsync(options) {
            let { data } = await articleManageApi.getArticleList((options = this.articleSearchOptions));
            this.articlePageResult = data;
        },
        async getTreeAsync() {
            let { data } = await articleManageApi.getArticleCategory();
            this.treeResult = data;
        },
        resetCategoryId() {
            this.articleSearchOptions.categoryId = null;
            this.getArticleListAsync();
        },
        async renameCategory(id, newName) {
            await articleManageApi.reName(id, newName);
            this.getTreeAsync();
        },
        async newCategory(entity) {
             await articleManageApi.create(entity);
             this.getTreeAsync();
        },
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await articleManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTreeAsync();
        },
        async batchRemoveCategory(idList) {
            this.$confirm(
                "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let { status } = await articleManageApi.deleteNewsCategory(idList);
                            if (status === 200) {
                                this.getTreeAsync();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        } else {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        }
                    }
                }
            );
        },
    }
};
</script>
<style scoped>
.el-main {
    /* padding: 0; */
}
.el-container {
    padding-bottom: 30px;
}
.el-container .el-aside {
    overflow: visible !important;
}
.el-container .tree-aside {
    width: 220px !important;
    height: 100vh;
    background: #fff;
    margin: 0 0 0 13px;
}
.el-container .el-dialog__body {
    padding-top: 0;
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



