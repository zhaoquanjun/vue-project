<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>产品分类</span>
            </h4>
            <h5 class="title-item" @click="resetCategoryId">全部分类</h5>
            <!--   @getProList="getArticleList" -->
            <category-tree
                :tree-result="treeResult"
                :product-search-options="productSearchOptions"
                @create="newCategory"
                @batchSwitchStatus="batchRemoveCategory"
                @update="updateCategory"
                @modifyNode="modifyNodeCategory"
            ></category-tree>
        </el-aside>
        <el-main>
            <content-header
                :count="count"
                :article-search-options="productSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                :idsList="idsList"
                @contentTableList="contentTableList"
                @addArticle="addArticle"
                @batchSwitchStatus="batchSwitchStatus"
            ></content-header>
            <el-main>
                <content-table
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
                ></el-dialog>
                <right-pannel
                    :style="{width:isInvitationlWidth+'px'}"
                    @closeRightPanel="closeRightPanel"
                >
                    <span slot="title-text">移动文章分类</span>
                    <span slot="cur-name">{{curArticleInfo.categoryName}}</span>
                    <span slot="move-to-name">{{moveToClassiFy.label}}</span>
                    <CheckTree
                        ref="checkTree"
                        :isright-pannel="true"
                        :tree-result="treeResult"
                        @chooseNode="chooseNode"
                    ></CheckTree>
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
import CategoryTree from "./CategoryTree";
import CheckTree from "./CheckTree";
import ContentHeader from "./ProductHeader";
import ContentTable from "./ProductTable";
import RightPannel from "../ImgManage/RightPannel";
import * as productManageApi from "@/api/request/productManageApi";
import * as productCategoryManageApi from "@/api/request/productCategoryManageApi";


export default {
    components: {
        CategoryTree,
        CheckTree,
        ContentHeader,
        ContentTable,
        RightPannel
    },
    data() {
        return {
            articlePageResult: null,
            treeResult: null,
            curArticleInfo: "",
            moveToClassiFy: "",
            newsIdList: "",
            count:0,
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
                categoryId: null //1
            }
        };
    },
    mounted() {
        this.contentTableList();

        this.getTreeAsync();
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 331 : 0;
        },
         isBatchHeaderShow() {
            console.log(this.idsList.length);
            return this.idsList.length > 1 ? true : false;
        }
    },
    methods: {
        // zxb 获取table列表 
        async contentTableList(options) {
            let { data } = await productManageApi.getProductList(
                (options = this.productSearchOptions)
            );
            this.articlePageResult = data;
        },
        //z 批量删除 批量置顶 批量上下线
        async batchSwitchStatus(options) {
             let stateTip;
            if(options.switchType === 1){
                stateTip = `删除后，网站中引用的文章列表将不再显示该文章，是否确定删除？`;
            }else if(options.switchType === 2){
                console.log(options)
                 var message = options.flag ? "取消置顶": "置顶";
                    
                    stateTip = "您确定要" + message + "文章吗？";
                     options.flag = !options.flag;
                  
            }else if(options.switchType === 3){
                 var message = options.flag? "下架": "上架";
                     options.flag = !options.flag;
                    stateTip = "您确定要" + message + "产品吗？";
            }
            
            this.$confirm(stateTip,"提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await productManageApi.batchSwitchStatus(options);
                            if (status === 200) {
                                // this.getTree();
                                this.$message({
                                    type: "success",
                                    message: "成功!"
                                });
                                this.contentTableList();
                            }
                        } else {
                            this.$message({
                                type: "info",
                                message: "已取消"
                            });
                        }
                    }
                }
            );
            
          
        },
        // 批量移动分类
        async batchMoveNews(idlist) {
            this.isInvitationPanelShow = true;
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
        // 点击确定按钮 移动更新文章分类  
        async updateCategoryArticle() {
            console.log(this.curArticleInfo)
            let checkNodes = this.$refs.checkTree.getCheckedNodes()
            console.log(checkNodes)
            if (!checkNodes || checkNodes.length<1) {
                this.$message({
                    type: "error",
                    message: "请选择移动的分类!"
                });
                return;
            }
            let cateId = this.curArticleInfo.id;
            let CategoryIdList=[];
             checkNodes.forEach((item)=>{
                 CategoryIdList.push(item.id)
            })
            let options = {
                IdList:[cateId],
                CategoryIdList:CategoryIdList
            }
            let { data, status } = await productManageApi.batchChangeCategory(options);
            if (status == 200) {
                this.$message({
                    type: "success",
                    message: "移动成功!"
                });
                this.isInvitationPanelShow = false;
                this.contentTableList();
            }
        },

        async getArticleListAsync(options) {
            let { data } = await articleManageApi.getArticleList(
                (options = this.productSearchOptions)
            );
            this.articlePageResult = data;
        },
       /**
        * z 点击 全部分类 刷新树结构
        */
        resetCategoryId() {
            this.productSearchOptions.categoryId = null;
            this.getArticleListAsync();
        },
        /**
         * 获取 tree 结构
         */
         async getTreeAsync() {
            let { data } = await productCategoryManageApi.get();
             this.treeResult = data.treeArray;
                this.totalSum = data.totalSum;
        },
        /**
         * z新增分类
         */
        async newCategory(entity) {
            console.log(entity);
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
        handleSelectionChange(list){
            this.idsList = [];
            this.count = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
        },
        addArticle() {
            this.$router.push({
                path: "/createProduct"
            });
        },
        handleEditArticle(row) {
            console.log(row);
            this.$router.push({
                path: "/createProduct",
                query: { id: row.id }
            });
        },
        /**
         * 关闭右侧面板
         */
         closeRightPanel() {
            this.isInvitationPanelShow = true;
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



