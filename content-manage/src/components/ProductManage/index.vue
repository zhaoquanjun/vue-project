<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>产品分类</span>
            </h4>
            <m-tree
                :is-product="true"
                :tree-result="treeResult"
                :list-options="productSearchOptions"
                @create="newCategory"
                @batchRemove="batchRemoveCategory"
                @rename="updateCategory"
                @getList="contentTableList"
                @modifyNode="modifyNodeCategory"
                @chooseCategoryNode="chooseCategoryNode"
            ></m-tree>
        </el-aside>
        <el-main>
            <content-header
                v-if="$store.state.dashboard.isContentwrite"
                :count="count"
                :article-search-options="productSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                :idsList="idsList"
                @contentTableList="contentTableList"
                @addArticle="addArticle"
                @batchSwitchStatus="batchSwitchStatus"
                @batchMove="batchMoveNews"
            ></content-header>
            <el-main>
                <content-table
                    ref="table"
                    v-if="articlePageResult !== null"
                    :article-page-result="articlePageResult"
                    :article-search-options="productSearchOptions"
                    :tree-result="treeResult"
                    @contentTableList="contentTableList"
                    @batchMove="batchMoveNews"
                    @batchSwitchStatus="batchSwitchStatus"
                    @handleEditArticle="handleEditArticle"
                    @moveClassify="moveClassify"
                    @handleSelectionChange="handleSelectionChange"
                ></content-table>

                <el-dialog
                    width="0"
                    style="z-index:10"
                    :close-on-click-modal="false"
                    :show-close="false"
                    :visible.sync="isInvitationPanelShow"
                >
                </el-dialog>
                   <right-pannel
                        :style="{width:isInvitationlWidth+'px'}"
                        @closeRightPanel="cancelUpdateCategory"
                    >
                        <!-- 分类设置 -->
                        <span slot="title-text">分类设置</span>

                        <template v-if="clickType === 'permission'">
                            <div class="category-content">
                                <span name="cur-tip">{{switchVal?"仅登录用户可访问":"全部用户可访问"}}</span>
                            </div>

                            <el-switch v-model="switchVal"></el-switch>
                        </template>
                        <template v-else>
                            <div class="category-content">
                                <span name="cur-tip">{{tipText}}</span>
                                <!-- 移动至 -->
                            </div>

                            <CheckTree
                                ref="checkTree"
                                :isright-pannel="true"
                                :tree-result="treeResult"
                                @chooseNode="chooseNode"
                            ></CheckTree>
                        </template>
                        <div slot="footer" class="pannle-footer">
                            <button @click="updateCategoryArticle" class="sure">确定</button>
                            <button @click="cancelUpdateCategory" class="cancel">取消</button>
                        </div>
                    </right-pannel>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
// import CategoryTree from "./CategoryTree";
import CheckTree from "./CheckTree";
import MTree from "@/components/ImgManage/MTree";
import ContentHeader from "./ProductHeader";
import ContentTable from "./ProductTable";
import RightPannel from "../ImgManage/RightPannel";
import * as productManageApi from "@/api/request/productManageApi";
import * as productCategoryManageApi from "@/api/request/productCategoryManageApi";

export default {
    components: {
        MTree,
        CheckTree,
        ContentHeader,
        ContentTable,
        RightPannel
    },
    data() {
        return {
            clickType: "", // 选择的是那种类型  移动 | 复制 ……
            panelTitle: "分类设置", // 右侧面板提示title
            tipText: "移动至",
            switchVal: true, // 是否仅登录用户可看
            articlePageResult: null,
            treeResult: null,
            curArticleInfo: "",
            moveToClassiFy: "",
            count: 0,
            idsList: [],
            isInvitationPanelShow: false,
            productSearchOptions: {
                pageSize: 10, //11
                pageIndex: 1, //1
                orderByType: 1, //1 创建时间 2:名字
                isDescending: true, // 倒叙 或 正序
                keyword: "", //1
                isDelete: false, //1
                isOnSell: null, //is 上架
                categoryIdList: [], //1,
                isTop: null
            }
        };
    },
    mounted() {
        this.contentTableList();

        this.getTree();
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 331 : 0;
        },
        isBatchHeaderShow() {
            console.log(this.idsList.length);
            return this.idsList.length > 0 ? true : false;
        }
    },
    methods: {
        // zxb 获取table列表
        async contentTableList(options) {
            let { data } = await productManageApi.getProductList(
                (options = this.productSearchOptions)
            );
            this.articlePageResult = data;
            this.articlePageResult.list.forEach((item, index) => {
                item.createTimeStr = this.articlePageResult.list[
                    index
                ].createTimeStr.split(" ")[0];
            });
        },
        //z 批量删除 批量置顶 批量上下线
        async batchSwitchStatus(options) {
            let stateTip;
            if (options.switchType === 1) {
                stateTip = `删除后，网站中引用的文章列表将不再显示该产品，是否确定删除？`;
            } else if (options.switchType === 2) {
                console.log(options);
                var message = options.flag ? "取消置顶" : "置顶";

                stateTip = "您确定要" + message + "文章吗？";
                options.flag = !options.flag;
            } else if (options.switchType === 3) {
                var message = options.flag ? "下架" : "上架";
                options.flag = !options.flag;
                stateTip = "您确定要" + message + "产品吗？";
            } else if (options.switchType === 4) {
                var message = options.flag ? "全部" : "仅登录";
                options.flag = options.flag;
                stateTip = "您确定要设置" + message + "用户可访问吗？";
            }

            this.$confirm(stateTip, "提示", {
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
                        } = await productManageApi.batchSwitchStatus(options);
                        if (status === 200) {
                            // this.getTree();
                            this.$notify({
                                customClass: "notify-success", //  notify-success ||  notify-error
                                message: `成功!`,
                                showClose: false,
                                duration: 1000
                            });
                            this.contentTableList();
                        }
                    }
                }
            });
        },
        // 批量移动分类
        async batchMoveNews(type) {
            this.isInvitationPanelShow = true;
            this.clickType = type;
            if (type === "permission") {
                this.panelTitle = "访问权限";
            } else if (type === "copy") {
                this.tipText = "复制至";
            } else if (type === "batchmove") {
                this.tipText = "移动至";
            }
        },
        //选择移动分类时的节点
        chooseNode(node) {
            console.log(node);
            this.moveToClassiFy = node;
        },
        // 点击左侧分类树菜单时的节点
        chooseCategoryNode(data) {
            console.log(data, "0000000");
            this.selectCategory = data;
        },
        cancelUpdateCategory() {
            // this.$refs.checkTree.resetChecked(); // 清空选中的 树结构
            this.isInvitationPanelShow = false;
        },
        moveClassify(data, flag) {
            if (flag === "move") {
                this.tipText = "移动至";
            } else if (flag === "copy") {
                this.tipText = "复制至";
            }

            this.isInvitationPanelShow = true;
            this.curArticleInfo = data;
            this.type = flag;
        },
        // 点击确定按钮 移动 复制 更新文章分类
        async updateCategoryArticle(params) {
            //批量设置访问权限
            if (this.clickType === "permission") {
                let options = {
                    switchType: 4,
                    flag: this.switchVal,
                    idList: this.idsList
                };
                this.batchSwitchStatus(options);
                return;
            }
            let checkNodes = this.$refs.checkTree.getCheckedNodes();
            if (!checkNodes || checkNodes.length < 1) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `请选择移动的分类!`,
                    showClose: false,
                    duration: 1500
                });
                return;
            }
            let categoryIdList = checkNodes.map(item => {
                return item.id;
            });
            let cateIdsAry = [];
            if (this.idsList.length > 1) {
                cateIdsAry = this.idsList;
            } else {
                let cateId = this.curArticleInfo.id;
                cateIdsAry.push(cateId);
            }
            let options = {
                idList: cateIdsAry,
                categoryIdList: categoryIdList
            };
            // 复制
            if (this.type === "copy" || this.clickType === "batchCopy") {
                this.copy(options);
                return;
            }
            // 移动
            this.move(options);
        },
        async move(options) {
            let { data, status } = await productManageApi.batchChangeCategory(
                options
            );
            if (status == 200) {
                this.$refs.checkTree.resetChecked(); // 清空选中的 树结构

                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `移动成功!`,
                    showClose: false,
                    duration: 1500
                });
                this.isInvitationPanelShow = false;
                this.contentTableList();
            }
        },
        async copy(options) {
            let { data, status } = await productManageApi.copyBatchProduct(
                options
            );
            if (status == 200) {
                if (
                    Array.isArray(options.idList) &&
                    options.idList.length > 1
                ) {
                    this.$notify({
                        customClass: "notify-success", //  notify-success ||  notify-error
                        message: `批量复制成功!`,
                        showClose: false,
                        duration: 1000
                    });
                } else {
                    this.$confirm("复制成功是否前往编辑产品", "提示", {
                        confirmButtonText: "立即前往",
                        cancelButtonText: "暂不前往",
                        type: "success",
                        customClass: "medium",
                        iconClass: "icon-success",
                        callback: async action => {
                            if (action === "confirm") {
                                this.$router.push({
                                    path: "/product/create",
                                    query: {
                                        id: data,
                                        isEditor: 1
                                    }
                                });
                            } else {
                            }
                        }
                    });
                }
                this.isInvitationPanelShow = false;
                this.contentTableList();
                this.$refs.checkTree.resetChecked();
            }
        },

        async getArticleListAsync(options) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            let { data } = await articleManageApi.getArticleList(
                (options = this.productSearchOptions)
            );
            loading.close();
            this.articlePageResult = data;
        },
        /**
         * z 点击 全部分类 刷新树结构
         */
        resetCategoryId() {
            this.productSearchOptions.categoryIdList = [];
            this.getArticleListAsync();
        },
        /**
         * 获取 tree 结构
         */
        async getTree() {
            let { data } = await productCategoryManageApi.get();
            this.treeResult = data.treeArray;
            this.totalSum = data.totalSum;
        },
        /**
         * z新增分类
         */
        async newCategory(entity) {
            console.log(entity, "000000");
            await productCategoryManageApi.create(entity);
            this.getTree();
        },
        /**
         *z 更新 tree 分类
         */
        async updateCategory(id, newName, thumbnailPicUrl) {
            await productCategoryManageApi.update(id, newName, thumbnailPicUrl);
            this.getTree();
        },

        /**
         *z 删除分类
         */
        async batchRemoveCategory(idList) {
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
                            } = await productCategoryManageApi.batchRemove(
                                idList
                            );
                            if (status === 200) {
                                this.getTree();
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1500
                                });
                            }
                        }
                    }
                }
            );
        },
        /**
         * z 修改分类
         */
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await productCategoryManageApi.modifyNode(
                id,
                parentId,
                idOrderByArr
            );
            this.getTree();
        },
        /**获取编辑产品详情 */
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            this.articleDetail = data;
            this.articleDetail.NewId = data.id;
            this.imageUrl = data.pictureUrl;
        },
        /**
         * 获取多选的列表
         */
        handleSelectionChange(list) {
            this.idsList = [];
            this.count = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
        },
        addArticle() {
            if (!this.selectCategory) {
                this.$router.push({
                    path: "/product/create"
                });
            } else {
                this.$router.push({
                    path: "/product/create",
                    query: {
                        categoryName: this.selectCategory.label || "全部分类",
                        categoryId: this.selectCategory.id || 0
                    }
                });
            }
        },
        handleEditArticle(row) {
            console.log(row);
            this.$router.push({
                path: "/product/create",
                query: { id: row.id, isEditor: 1 }
            });
        },
        /**
         * 关闭右侧面板
         */
        closeRightPanel() {
            this.isInvitationPanelShow = true;
        },
        getIdsList() {
            return this.idList;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../style/contentDetail.scss";
</style>



