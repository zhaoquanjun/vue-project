<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData"
      tooltip-effect="dark"
      :row-style="{height:'108px'}"
      class="content-table"
    >
      <template slot="empty">
        <div class="empty-table">
          <img src="~img/table-empty.png" />
          <p>无数据</p>
        </div>
      </template>
      <el-table-column prop="templateName" label="一级分类" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.templateName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" label="二级分类" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.controlName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="控件模板数量" min-width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.firstTypeName }}</div>
          <div>{{ scope.row.secondTypeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.creaetTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <div>
            <i class="iconfont iconbianji cl-iconfont" style="margin-right:16px"></i>
            <i class="iconfont iconshanchu cl-iconfont"></i>
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
    // 更多操作下拉菜单
    handleMore(command, row) {
      console.log(command, row);
      if (command == "setting") {
        this.$emit("setting", row);
      } else if (command == "update") {
        this.$emit("update", [row.pageId]);
      }
    },
    handleSelectionChange(list) {
      console.log(list);
      let idList = [];
      list.forEach((item, index) => {
        idList.push(item.pageId);
      });
      this.$emit("selectBatchUpdate", idList);
    },
    selectable(row) {
      if (row.controlState == 1) {
        return true;
      } else if (row.controlState == 3) {
        return false;
      }
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