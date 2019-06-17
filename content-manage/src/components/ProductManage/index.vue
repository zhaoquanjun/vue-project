<template>
  <el-container>
    <el-aside class="tree-aside">
      <h4 class="product-type-title">
        <svg-icon icon-class="img-type-title"></svg-icon>
        <span>产品分类</span>
      </h4>
      <h5 class="title-item">全部分类{{totalSum}}</h5>
      <category-tree :category-tree-data="categoryTreeData" :search-option="searchOption"
      @getProductList="_getProductList"
      @rename="renameCategory"></category-tree>
    </el-aside>
    <el-main>
      <product-header :search-option="searchOption" @getProductList="_getProductList"/>
      <el-main>
        <product-table
          :product-list-data="productListData"
          :search-option="searchOption"
          :category-tree-data="categoryTreeData"
          @getProductList="_getProductList"
        ></product-table>
      </el-main>
    </el-main>
    <!-- <el-dialog>
      <add-product :tree-result="categoryTreeData"/>
    </el-dialog> -->
  </el-container>
</template>
<script>
import CategoryTree from "./CategoryTree";
import ProductHeader from "./ProductHeader";
import ProductTable from "./ProductTable";
import AddProduct from "./AddProduct";
import * as productManageApi from "@/api/request/productManageApi";

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
      searchOption: {
        pageSize: 5,
        pageIndex: 1,
        sortOrder: "name_asc",
        categoryId: null,
        name: ""
      },
      totalSum: 0
    };
  },
  mounted() {
    this._getProductList({});
    this._getCategoryTree();
  },
  methods: {
    async _getProductList() {
      let { data } = await productManageApi.getProductList(this.searchOption);
      this.productListData = data;
    },
    async _getCategoryTree() {
      let { data } = await productManageApi.getCategoryTree();
      this.categoryTreeData = data.categoryTree;
    },
    async renameCategory(id,newName){
      
    }
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
.product-type-title {
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



