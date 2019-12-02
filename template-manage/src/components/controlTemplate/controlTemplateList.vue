<template>
  <div class="table-list" id="table-list">
    <el-table ref="multipleTable" :data="listData" tooltip-effect="dark" class="content-table">
      <template slot="empty">
        <div class="empty-table">
          <img src="~img/table-empty.png" />
          <p>无数据</p>
        </div>
      </template>
      <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.templateName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" label="模板数量（上架/全部）" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.onSaleCount}}/{{scope.row.composeCount}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="开通时间" min-width="100">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.createTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="200">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.updateTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="模板状态" min-width="200">
        <template slot-scope="scope">
          <div>{{scope.row.templateState}}</div>
        </template>
      </el-table-column>
      <el-table-column label="管理员|备注" min-width="200">
        <template slot-scope="scope">
          <p>{{scope.row.designerPhone}}</p>
          <p>{{scope.row.remark}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <div>
            <button class="hoverBtn" style="margin-right:16px">
              <i class="iconfont iconshanchu"></i>
            </button>
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
    _formatDateTime(date, fmt) {
      return formatDateTime(date, fmt);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


