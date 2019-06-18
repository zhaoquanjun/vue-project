<template>
    <el-container id="product-manage">
        <el-aside class="tree-aside">
            <h4 class="product-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>产品分类</span>
            </h4>
            <h5 class="title-item">全部分类</h5>
            <category-tree :tree-result="treeResult"
                           :product-search-options="productSearchOptions"
                           @getProList="getProList"
                           @create="newCategory"
                           @batchRemove="batchRemoveCategory"
                           @rename="renameCategory"
                           @modifyNode="modifyNodeCategory"></category-tree>
        </el-aside>
        <el-main>
            <product-header :product-search-options="productSearchOptions"
                            @getProductList="getProList"
                            @showAddDialog="showAddDialog" />
            <el-main>
                <product-table :product-list-data="productListData"
                               :product-search-options="productSearchOptions"
                               :category-tree-data="categoryTreeData"
                               @getProductList="getProList"></product-table>
            </el-main>
        </el-main>
        <el-dialog>
            <add-product :tree-result="categoryTreeData" />
        </el-dialog>
    </el-container>
</template>
<script>
    import CategoryTree from "./CategoryTree";
    import ProductHeader from "./ProductHeader";
    import ProductTable from "./ProductTable";
    import AddProduct from "./AddProduct";
    import * as productManageApi from "@/api/request/productManageApi";
    import * as productCategoryManageApi from "@/api/request/productCategoryManageApi";

    export default {
        components: {
            CategoryTree,
            ProductHeader,
            ProductTable,
            AddProduct
        },
        data() {
            return {
                productListData: {},
                categoryTreeData: null,
                productSearchOptions: {
                    pageSize: 10,
                    pageIndex: 1,
                    orderByType: 1,
                    isDescending: true,
                    proCategoryId: null,
                    keyword: "",
                    isDelete: false
                },
                totalSum: 0,
                addDialogVisible: true,
                treeResult: null
            };
        },
        mounted() {
            this.getProList();
            this.getTree();
        },
        methods: {
            async getProList() {
                let { data } = await productManageApi.getProductList(this.productSearchOptions);
                this.productListData = data;
            },
            async getTree() {
                let { data } = await productCategoryManageApi.get();
                this.treeResult = data.treeArray;
                this.totalSum = data.totalSum;
            },
            async newCategory(entity) {
                console.log(entity);
                await productCategoryManageApi.create(entity);
                this.getTree();
            }, async batchRemoveCategory(idList) {
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
                                } = await productCategoryManageApi.batchRemove(idList);
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
            async renameCategory(id, newName) {
                await productCategoryManageApi.rename(id, newName);
                this.getTree();
            },
            async modifyNodeCategory(id, parentId, idOrderByArr) {
                await productCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
                this.getTree();
            },
            showAddDialog() { }
        }
    };
</script>
<style scoped>
    #product-manage {
        padding-bottom: 30px;
    }

        #product-manage .el-aside {
            overflow: visible !important;
        }

        #product-manage .tree-aside {
            width: 220px !important;
            height: 100vh;
            background: #fff;
            margin: 0 0 0 13px;
        }

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
    .product-type-title {
        height: 60px;
        line-height: 60px;
        padding-left: 14px;
        border-bottom: 1px solid #e8eaf3;
        border-right: 1px solid #e8eaf3;
        box-sizing: border-box;
        span

    {
        vertical-align: middle;
        padding-left: 10px;
    }

    }

    .title-item {
        padding: 28px 0 12px 12px;
    }
</style>



