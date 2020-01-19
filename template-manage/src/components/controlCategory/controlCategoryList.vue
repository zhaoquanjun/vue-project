<template>
  <div class="table-list" id="table-list">
    <el-table ref="multipleTable" :data="listData" tooltip-effect="dark" class="content-table">
      <template slot="empty">
        <div class="empty-table" style="cursor:default">
          <img src="~img/table-empty-default.png" />
          <p>无数据</p>
        </div>
      </template>
      <el-table-column prop="templateName" label="一级分类" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.parentId?"":scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" label="二级分类" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.parentId?scope.row.name:""}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="控件模板数量" min-width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.combinedControlPublishCount+scope.row.normalControlPublishCount }}
            /
            {{scope.row.combinedControlTotalCount+scope.row.normalControlTotalCount}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.createTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <div>
            <i
              class="iconfont iconbianji cl-iconfont"
              @click="editItem(scope.row)"
              style="margin-right:16px"
            ></i>
            <i
              class="iconfont iconshanchu cl-iconfont"
              v-show="!(scope.row.combinedControlTotalCount+scope.row.normalControlTotalCount)"
              @click="deleteItem(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatDateTime } from "@/utlis/index";
export default {
  props: {
    listData: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    deleteItem(row) {
      this.$emit("deleteItem", [row.id]);
    },
    editItem(row) {
      this.$emit("editItem", row);
    },
    _formatDateTime(date, fmt) {
      return formatDateTime(date, fmt);
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list /deep/ .el-table__empty-text{
    width: 0;
}
.moreList {
  width: 76px;
  .moreListItem {
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    text-align: center;
    color: $--color-text-primary;
    font-size: $--font-size-small;
    line-height: 30px;
    &:hover {
      background: $--background-color-hover;
    }
  }
}
</style>