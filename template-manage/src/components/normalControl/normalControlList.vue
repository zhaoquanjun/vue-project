<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData.curData"
      tooltip-effect="dark"
      :row-style="{height:'108px'}"
      class="content-table"
      @sort-change="sortChange"
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <template slot="empty">
        <div class="empty-table" @click="createTemplatedialogShow">
          <img src="~img/table-empty.png" />
          <p>添加数据</p>
        </div>
      </template>
      <el-table-column label="缩略图" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="siteImg">
            <div class="recommend" v-show="scope.row.isRecommend">推荐</div>
            <img :src="scope.row.controlImg" style="width:100%;height:100%;object-fit:contain;" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="控件名称" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.controlName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="控件分类" min-width="100">
        <template slot-scope="scope">
          <div>
            <div>{{ scope.row.firstTypeName }}</div>
            <div style="margin-top:8px">{{ scope.row.secondTypeName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="displayOrder" sortable="custom" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.displayOrder}}</div>
        </template>
      </el-table-column>
      <el-table-column label="排列" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.rowShowNumber}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="使用量" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.useCount}}</div>
        </template>
      </el-table-column>-->
      <el-table-column label="创建时间" prop="createTime" sortable="custom" min-width="150">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.createTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="控件状态" min-width="100">
        <template slot-scope="scope">
          <div>{{ statusValue(scope.row.controlState) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <div>
            <i
              class="iconfont iconicon-des-setup cl-iconfont"
              @click="editItem(scope.row)"
              style="margin-right:16px"
            ></i>
            <i class="iconfont iconshanchu cl-iconfont" @click="deleteItem(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="cl-pagination pageing" id="pageing" style="margin-bottom:20px">
      <el-pagination
        v-if="listData.totalCount > 0"
        background
        layout="total, slot, sizes, prev, pager, next"
        :current-page="listData.pageIndex"
        :total="listData.totalCount"
        :page-count="listData.totalPages"
        :page-size="listData.pageSize"
        :page-sizes="[10,20,50]"
        @current-change="changePage"
        @size-change="changeSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from "@/utlis/index";
export default {
  props: {
    listData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: { 
    createTemplatedialogShow(){
      this.$emit("createTemplatedialogShow")
    },
    editItem(row) {
      this.$emit("editItem", row);
    },
    changePage(page) {
      this.$emit("changePage", page);
    },
    changeSize(size) {
      this.$emit("changeSize", size);
    },
    //改变排序
    sortChange(row) {
      this.$emit("orderList", row.prop, row.order);
    },
    deleteItem(row) {
      this.$emit("deleteItem", row.id);
    },
    _formatDateTime(date, fmt) {
      return formatDateTime(date, fmt);
    },
    statusValue(status) {
      switch (status) {
        case 1:
          return "上架";
        case 2:
          return "下架";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list /deep/ .el-table__empty-text{
    width: 0;
}
.table-list /deep/ .el-table .ascending .sort-caret.ascending {
  border-bottom-color: $--color-primary;
}
.table-list /deep/ .el-table .descending .sort-caret.descending {
  border-top-color: $--color-primary;
}
.siteImg {
  width: 150px;
  height: 82px;
  position: relative;
  margin-left: 14px;
  .recommend {
    display: inline-block;
    width: 50px;
    height: 22px;
    background: rgba(254, 152, 55, 1);
    border-radius: 2px 0px 10px 0px;
    font-size: $--font-size-small;
    font-weight: $--font-weight-primary;
    color: $--color-white;
    line-height: 22px;
    text-align: center;
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>


