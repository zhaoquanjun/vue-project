<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>文章分类</span>
            </h4>
            <!-- <h5 class="title-item" @click="resetCategoryId">全部分类</h5> -->
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
            <content-header
                :count="count"
                :is-batch-header-show="isBatchHeaderShow"
                :article-search-options="articleSearchOptions"
                @getArticleList="getArticleList"
                @addArticle="addArticle"
                @batchMove="batchMoveNews"
                @batchCopy="batchCopyNews"
                @batchRemove="batchRemoveNews"
                @batchTop="batchTopNews"
                @batchPublish="batchPublishNews"
                @changeOperateName="changeOperateName"
            ></content-header>
            <el-main>
                <content-table
                    v-if="articlePageResult !== null"
                    :article-page-result="articlePageResult"
                    :article-search-options="articleSearchOptions"
                    :tree-result="treeResult"
                    @getArticleList="getArticleList"
                    @batchMove="batchMoveNews"
                    @batchCopy="batchCopyNews"
                    @batchRemove="batchRemoveNews"
                    @batchTop="batchTopNews"
                    @batchPublish="batchPublishNews"
                    @handleEditArticle="handleEditArticle"
                    @moveClassify="moveClassify"
                    @handleSelectionChange="handleSelectionChange"
                    @changeOperateName="changeOperateName"
                ></content-table>
                <el-dialog
                    width="0"
                    style="z-index:10"
                    :close-on-click-modal="false"
                    :show-close="false"
                    :visible.sync="isInvitationPanelShow"
                ></el-dialog>
                <right-pannel
                    :style="{width:isInvitationlWidth+'px'}"
                    @closeRightPanel="cancelUpdateCategory"
                >
                    <span slot="title-text">{{operateName}}文章分类</span>
                    <div class="category-content">
                            <span name="cur-tip">{{operateName}}至</span>
                        </div>
                    <SelectTree
                        :categoryName="curArticleInfo.categoryName"
                        :tree-result="treeResult"
                        @chooseNode="chooseNode"
                    />

                    <div slot="footer" class="pannle-footer">
                        <button @click="handOperateArticle" class="sure">确定</button>
                        <button @click="cancelUpdateCategory" class="cancel">取消</button>
                    </div>
                </right-pannel>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import MTree from "./MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTable";
import RightPannel from "../ImgManage/RightPannel";
import SelectTree from "@/components/common/SelectTree";
import * as articleManageApi from "@/api/request/articleManageApi";
export default {
    components: {
        MTree,
        ContentHeader,
        ContentTable,
        RightPannel,
        SelectTree
    },
    data() {
        return {
            articlePageResult: null,
            treeResult: null,
            curArticleInfo: "",
            moveToClassiFy: "",
            newsIdList: "",
            count: 0,
            idsList: [],
            rightPanelType: 1, // 1 移动文章 2 复制文章
            selectCategory:"",
            operateName:"移动",

            isInvitationPanelShow: false,
            articleSearchOptions: {
                title: "",
                categoryId: 0,
                newsOrderColumns: "createtime",
                topStatus: null,
                publishStatus: null,
                pageIndex: 1,
                pageSize: 10,
                isDescending: true
            }
        };
    },
    mounted() {
        this.getArticleList();
        this.getTreeAsync();
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 331 : 0;
        },
        isBatchHeaderShow() {
            console.log(this.idsList)
            return this.idsList.length > 1 ? true : false;
        }
    },
    methods: {
        // 移动分类 或是 复制到分类
        changeOperateName(operate){
            this.operateName = operate;
        },
        /**
         * 获取多选的列表
         */
        handleSelectionChange(list) {
            console.log(list)
            this.idsList = [];
            this.count = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
        },
        async getArticleList(options) {
            let { data } = await articleManageApi.getArticleList(
                (options = this.articleSearchOptions)
            );
            this.articlePageResult = data;
            this.articlePageResult.list.forEach( (item, index) => {
                item.createTimePrt = this.articlePageResult.list[index].createTimePrt.split(" ")[0]
            } )
        },
        // 批量删除
        async batchRemoveNews(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
            this.$confirm(
                "删除后，网站中引用的文章列表将不再显示该文章，是否确定删除？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {status, data } = await articleManageApi.batchRemove(true,idlist);
                            if (status === 200) {
                                // this.getTree();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getTreeAsync();
                                this.getArticleList();
                            }
                        } else {
                            // this.$message({
                            //     type: "info",
                            //     message: "已取消删除"
                            // });
                        }
                    }
                }
            );
        },
        // 批量置顶
        async batchTopNews(idlist, isTop) {
            idlist = idlist == null ? this.idsList : idlist;
            var message = "置顶";
            if (isTop) message = "取消置顶";
            this.$confirm("您确定要" + message + "文章吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                callback: async action => {
                    console.log(action);
                    if (action === "confirm") {
                        let { status, data } = await articleManageApi.batchTop(
                            !isTop,
                            idlist
                        );
                        if (status === 200) {
                            // this.getTree();
                            this.$message({
                                type: "success",
                                message: message + "成功!"
                            });
                            this.getArticleList();
                        }
                    } else {
                        // this.$message({
                        //     type: "info",
                        //     message: "已取消" + message
                        // });
                    }
                }
            });
        },
        // 批量上下线
        async batchPublishNews(idlist, isPublish) {
            idlist = idlist == null ? this.idsList : idlist;
            var message = "上线";
            if (isPublish) message = "下线";
            this.$confirm("您确认要" + message + "文章吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                callback: async action => {
                    console.log(action);
                    if (action === "confirm") {
                        let {
                            status,
                            data
                        } = await articleManageApi.batchPublish(
                            !isPublish,
                            idlist
                        );
                        if (status === 200) {
                            // this.getTree();
                            this.$message({
                                type: "success",
                                message: message + "成功!"
                            });
                            this.getArticleList();
                        }
                    } else {
                        // this.$message({
                        //     type: "info",
                        //     message: "已取消" + message
                        // });
                    }
                }
            });
        },
        // 批量移动分类
        async batchMoveNews(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
            this.isInvitationPanelShow = true;
            this.rightPanelType = 1;
            this.newsIdList = idlist;
        },
        // 批量复制分类
        async batchCopyNews(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
            this.isInvitationPanelShow = true;
            this.rightPanelType = 2;
            this.newsIdList = idlist;
        },
        //选择移动分类时的节点
        chooseNode(node) {
            console.log(node);
            this.moveToClassiFy = node;
        },
        cancelUpdateCategory() {
            this.isInvitationPanelShow = false;
        },
        moveClassify(b, data) {
            this.isInvitationPanelShow = b;
            this.curArticleInfo = data;
        },
        // 判断是 移动还是复制
        handOperateArticle(){
            switch(this.rightPanelType){
                case 1:
                    this.updateCategoryArticle();
                    break;
                case 2:
                    this.copyArticle(); 
                    break; 
            }
        },
        // 点击确定按钮 更新文章所属分类
        async updateCategoryArticle() {
            if (!this.moveToClassiFy) {
                this.$message({
                    type: "error",
                    message: "请选择移动的分类!"
                });
                return;
            }
            let cateId = this.moveToClassiFy.id;

            let { data, status } = await articleManageApi.batchMove(
                cateId,
                this.newsIdList
            );
            if (status == 200) {
                this.$message({
                    type: "success",
                    message: "移动成功!"
                });
                this.isInvitationPanelShow = false;
                this.getTreeAsync();
                this.getArticleList();
            }
        },
        // 点击确定按钮 复制
        async copyArticle() {
            if (!this.moveToClassiFy) {
                this.$message({
                    type: "error",
                    message: "请选择要复制到的分类!"
                });
                return;
            }
            let cateId = this.moveToClassiFy.id;

            let { data, status } = await articleManageApi.batchCopy(
                cateId,
                this.newsIdList
            );
            if (status == 200) {
                this.$message({
                    type: "success",
                    message: "复制成功!"
                });
                this.isInvitationPanelShow = false;
                this.getTreeAsync();
                this.getArticleList();
            }
        },
        closeRightPanel() {
            this.isInvitationPanelShow = true;
        },
        async getArticleListAsync(options) {
            let { data } = await articleManageApi.getArticleList(
                (options = this.articleSearchOptions)
            );
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
            //await articleManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTreeAsync();
        },
        async batchRemoveCategory(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
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
                            let {
                                status
                            } = await articleManageApi.deleteNewsCategory(
                                idList
                            );
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
        /**获取编辑产品详情 */
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            this.articleDetail = data;
            this.articleDetail.NewId = data.id;
            this.imageUrl = data.pictureUrl;
        },
        addArticle() {
            if(this.selectCategory == null){
                this.$router.push({
                    path: "/news/create"
                });
            } else{
                this.$router.push({
                    path: "/news/create",
                    query: { categoryName: this.selectCategory.Label }
                });
            }
        },
        handleEditArticle(row) {
            console.log(row);
            this.$router.push({
                path: "/news/create",
                query: { id: row.id, categoryName: row.categoryName }
            });
        }
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



