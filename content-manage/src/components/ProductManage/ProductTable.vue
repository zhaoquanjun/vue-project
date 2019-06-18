<template>
  <div class="table-wrap">
    <el-table
      ref="multipleTable"
      :data="productListData.data"
      tooltip-effect="dark"
      class="content-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>

      <el-table-column label="产品图片">
        <template slot-scope="scope">
          <img src="../../assets/avatar.jpeg" class="cover">
          <!-- <img :src="scope.row.thumbnailPicUrl" class="cover"> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称"/>

      <el-table-column prop="price" label="当前价格"></el-table-column>

      <el-table-column prop="orginalPrice" label="原始价格" show-overflow-tooltip></el-table-column>

      <el-table-column label="是否上架" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
            <button class="handle-btn" @click="handleDelete(scope.$index, scope.row)">
              <svg-icon icon-class="l-recyclebin"></svg-icon>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageing">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="productListData.totalCount"
        :page-count="productListData.totalPages"
        :page-size="productListData.pageSize"
        :page-sizes="[5, 10, 15]"
        @current-change="changePage"
        @size-change="changeSize"
      ></el-pagination>
    </div>
    <el-dialog width="400px" :visible.sync="imgVisible" class="img-dialog">
      <el-card :body-style="{ padding: '0px' }">
        <img src="../../assets/avatar.jpeg" width="100%" height="100%">
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["productListData", "searchOption", "treeResult"],
  data() {
    return {
      imgVisible: false,
      multipleSelection: []
    };
  },

  methods: {
    /**
     * 单选或全选操作
     */
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    /**
     * 移动分类
     */
    handleMove(index, row) {
      console.log(index, row);
    },
    /**
     * 删除操作
     */
    handleDelete(index, row) {
      console.log(index, row);
    },
    changePage(page) {
      this.searchOption.pageIndex = page;
      this.$emit("getProductList");
    },
    changeSize(size) {
      this.searchOption.pageSize = size;
      this.$emit("getProductList");
    }
  }
};
</script>
<style >
.el-table .has-gutter th {
  padding: 0;
  height: 32px;
  background: #00c1de !important;
}
.el-table th > .cell {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
}
.el-table .el-table__row {
  height: 60px;
  /* line-height: 60px; */
}
.table-wrap {
  margin: 0 21px;
}
</style>
<style >
.el-pagination.is-background .el-pager /deep/ li:not(.disabled).active {
  background-color: #01c0de !important;
}

.el-pagination /deep/ .el-pagination__total {
  color: #8c8c8c;
}
.el-pagination.is-background .el-pager /deep/ li {
  font-weight: 400;
  color: #252525;
  background-color: #fff !important;
  border: 1px solid rgba(229, 229, 229, 1);
}
.el-pager /deep/ .active {
  background-color: #01c0de !important;
}
</style>

<style lang="scss" scoped>
.content-table {
  width: 100%;
  box-sizing: border-box;
}
.handle-btn-wrap {
  display: flex;
  justify-content: space-between;
}
.handle-btn {
  //padding-right: 54px;
}
.cover {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 10px;
}
.pageing {
  float: right;
  margin-top: 24px;
}
</style>
