<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>文章分类</span>
            </h4>
            <m-tree
                :treeResult="treeResult"
                :list-options="articleSearchOptions"
                :isArticle="true"
                @chooseCategoryNode="chooseNode"
                @create="newCategory"
                @batchRemove="batchRemoveCategory"
                @rename="renameCategory"
                @getList="getArticleList"
                @modifyNode="modifyNodeCategory"
            ></m-tree>
        </el-aside>
        <el-main>
            <content-header
                v-if="$store.state.dashboard.isContentwrite"
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
                        :categoryId="curArticleInfo.categoryId"
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
import MTree from "@/components/ImgManage/MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTable";
import RightPannel from "../ImgManage/RightPannel";
import SelectTree from "@/components/common/SelectTree";
import * as articleManageApi from "@/api/request/articleManageApi";
import { isArray } from "util";
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
            selectCategory: "",
            operateName: "移动",

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
            console.log(this.idsList);
            return this.idsList.length > 1 ? true : false;
        }
    },
    methods: {
        // 移动分类 或是 复制到分类
        changeOperateName(operate) {
            this.operateName = operate;
        },

        /**
         * 获取多选的列表
         */
        handleSelectionChange(list) {
            console.log(list);
            this.idsList = [];
            this.count = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
        },
        async getArticleList(options) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            let { data } = await articleManageApi.getArticleList(
                (options = this.articleSearchOptions)
            );
            loading.close();
            this.articlePageResult = data;
            this.articlePageResult.list.forEach((item, index) => {
                item.createTimePrt = this.articlePageResult.list[
                    index
                ].createTimePrt.split(" ")[0];
            });
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
                    customClass: "medium",
                    iconClass: "icon-warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await articleManageApi.batchRemove(
                                true,
                                idlist
                            );
                            if (status === 200) {
                                // this.getTree();
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1000
                                });
                                this.getTreeAsync();
                                this.getArticleList();
                            }
                        } else {
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
                customClass: "medium",
                iconClass: "icon-warning",
                callback: async action => {
                    console.log(action);
                    if (action === "confirm") {
                        let { status, data } = await articleManageApi.batchTop(
                            !isTop,
                            idlist
                        );
                        if (status === 200) {
                            // this.getTree();
                            this.$notify({
                                customClass: "notify-success", //  notify-success ||  notify-error
                                message: `${message}成功!`,
                                showClose: false,
                                duration: 1000
                            });
                            this.getArticleList();
                        }
                    } else {
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
                customClass: "medium",
                iconClass: "icon-warning",
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
                            this.$notify({
                                customClass: "notify-success", //  notify-success ||  notify-error
                                message: `${message}成功!`,
                                showClose: false,
                                duration: 1000
                            });
                            this.getArticleList();
                        }
                    } else {
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
        async batchCopyNews(idlist, row) {
            if (idlist && idlist.length <= 1) {
                this.row = row;
            }
            idlist = idlist == null ? this.idsList : idlist;
            this.isInvitationPanelShow = true;
            this.rightPanelType = 2;
            this.newsIdList = idlist;
        },
        // 拖拽移动分类
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await articleManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTreeAsync();
        },
        //选择移动分类时的节点
        chooseNode(node) {
            console.log(node, "nnnnnnnnnn");
            this.moveToClassiFy = node;
        },
        // 点击左侧分类树菜单时的节点
        chooseCategoryNode(data) {
            this.selectCategory = data;
        },
        cancelUpdateCategory() {
            this.isInvitationPanelShow = false;
        },
        moveClassify(b, data) {
            this.isInvitationPanelShow = b;
            this.curArticleInfo = data;
        },
        // 判断是 移动还是复制
        handOperateArticle() {
            switch (this.rightPanelType) {
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
            let cateId = this.moveToClassiFy?this.moveToClassiFy.id:this.curArticleInfo.categoryId;
            let { data, status } = await articleManageApi.batchMove(
                cateId,
                this.newsIdList
            );
            if (status == 200) {
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `移动成功!`,
                    showClose: false,
                    duration: 1000
                });
                this.isInvitationPanelShow = false;
                this.getTreeAsync();
                this.getArticleList();
            }
        },
        // 点击确定按钮 复制
        async copyArticle() {
            console.log(this.row, "-------");
            // if (!this.moveToClassiFy) {
            //     this.$notify({
            //         customClass: "notify-error", //  notify-success ||  notify-error
            //         message: `请选择要复制到的分类!`,
            //         showClose: false,
            //         duration: 2000
            //     });
            //     return;
            // }
            let cateId =
                (this.moveToClassiFy && this.moveToClassiFy.id) ||
                this.row.categoryId;
            let { data, status } = await articleManageApi.batchCopy(
                cateId,
                this.newsIdList
            );
            if (status == 200) {
                //  this.$notify({
                //     customClass: "notify-success", //  notify-success ||  notify-error
                //     message: `复制成功!`,
                //     duration: 1000
                // });
                if (
                    Array.isArray(this.newsIdList) &&
                    this.newsIdList.length > 1
                ) {
                    this.$notify({
                        customClass: "notify-success", //  notify-success ||  notify-error
                        message: `批量复制成功!`,
                        showClose: false,
                        duration: 1000
                    });
                } else {
                    this.$confirm("复制成功是否前往编辑文章", "提示", {
                        confirmButtonText: "立即前往",
                        cancelButtonText: "暂不前往",
                        type: "success",
                        customClass: "medium",
                        iconClass: "icon-success",
                        callback: async action => {
                            if (action === "confirm") {
                                this.$router.push({
                                    path: "/news/create",
                                    query: {
                                        id: this.newsIdList,
                                        categoryName: this.moveToClassiFy.label,
                                        categoryId: this.moveToClassiFy.id
                                    }
                                });
                            } else {
                            }
                        }
                    });
                }

                this.isInvitationPanelShow = false;
                this.getTreeAsync();
                this.getArticleList();
            }
        },
        // 关闭panel
        closeRightPanel() {
            this.isInvitationPanelShow = true;
        },
       
        // 获取文章分类的树菜单
        async getTreeAsync() {
            let { data } = await articleManageApi.getArticleCategory();
            this.treeResult = data;
        },
    
        // 重命名分类名称
        async renameCategory(id, newName) {
            await articleManageApi.reName(id, newName);
            this.getTreeAsync();
        },
        /** 新增分类 */
        async newCategory(entity) {
            await articleManageApi.create(entity);
            this.getTreeAsync();
        },
        // async modifyNodeCategory(id, parentId, idOrderByArr) {
        //     //await articleManageApi.modifyNode(id, parentId, idOrderByArr);
        //     this.getTreeAsync();
        // },
        /**
         * 删除分类
         */
        async batchRemoveCategory(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
            this.$confirm(
                "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass: "medium",
                    iconClass: "icon-warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status
                            } = await articleManageApi.deleteNewsCategory(
                                idlist
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
        // async getArticleDetail(id) {
        //     let { data } = await articleManageApi.getArticleDetail(id);
        //     this.articleDetail = data;
        //     this.articleDetail.NewId = data.id;
        //     this.imageUrl = data.pictureUrl;
        // },
        // 点击新增跳转到详情页
        addArticle() {
            if (!this.selectCategory) {
                this.$router.push({
                    path: "/news/create"
                });
            } else {
                this.$router.push({
                    path: "/news/create",
                    query: {
                        categoryName: this.selectCategory.label || "全部分类",
                        categoryId: this.selectCategory.id || 0
                    }
                });
            }
        },
        // 编辑文章跳转到详情页
        handleEditArticle(row) {
            this.$router.push({
                path: "/news/create",
                query: {
                    id: row.id,
                    categoryName: row.categoryName,
                    categoryId: row.categoryId
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../style/contentDetail.scss";
</style>



