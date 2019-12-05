<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData"
      tooltip-effect="dark"
      :row-style="{height:'130px'}"
      class="content-table"
    >
      <template slot="empty">
        <div class="empty-table">
          <img src="~img/table-empty.png" />
          <p>无数据</p>
        </div>
      </template>
      <el-table-column type="selection" :selectable="selectable"></el-table-column>
      <el-table-column prop="templateName" label="缩略图" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.templateName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" label="控件名称" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.controlName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="控件类型" min-width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.firstTypeName }}</div>
          <div>{{ scope.row.secondTypeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.displayOrder}}</div>
        </template>
      </el-table-column>
      <el-table-column label="使用量" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.useCount}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.updateTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="150">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.updateTime, "yyyy/MM/dd hh:mm") }}</div>
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
            <i class="iconfont iconchakan cl-iconfont" style="margin-right:16px"></i>
            <el-dropdown trigger="click" @command="handleMore($event,scope.row)" placement="bottom">
              <i class="iconfont iconsangedian cl-iconfont"></i>
              <el-dropdown-menu slot="dropdown" class="moreList">
                <el-dropdown-item class="moreListItem" command="setting">设置</el-dropdown-item>
                <el-dropdown-item class="moreListItem" command="update">更新</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="list-footer" v-show="listData.totalRecord > 0">
      <div
        class="cl-pagination pageing"
        id="pageing"
        :class="{'noJumper':listData.totalPage <= 10}"
      >
        <slot name="paging"></slot>
        <el-pagination
          v-if="listData.totalRecord > 0"
          background
          :layout="listData.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
          :total="listData.totalRecord"
          :page-size="listData.pageSize"
          :page-sizes="[10,20,50]"
          @current-change="changePage"
          @size-change="changeSize"
        >
          <div class="sizes-title">，每页显示</div>
          <button v-if="listData.totalPage > 10" class="paging-confirm">跳转</button>
        </el-pagination>
      </div>
    </div>-->
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
        this.$emit("update", row);
      }
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
    // 单选或全选操作
    // handleSelectionChange(list) {
    //   this.$emit("handleSelectionChange", list);
    // },
    // cancelSelect() {
    //   this.$refs.multipleTable.clearSelection();
    // },
    // chosePriority(row) {
    //   let para = {
    //     idList: [row.id],
    //     priority: row.priority
    //   };
    //   this.$emit("update", para);
    // },
    // chosefrequency(row) {
    //   let para = {
    //     idList: [row.id],
    //     frequency: row.frequencyStr
    //   };
    //   this.$emit("update", para);
    // },
    // remove(row) {
    //   this.$emit("remove", [row.id]);
    // },
    // changePage(page) {
    //   this.$emit("chagePage", page);
    // },
    // changeSize(size) {
    //   this.$emit("changeSize", size);
    // }
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


