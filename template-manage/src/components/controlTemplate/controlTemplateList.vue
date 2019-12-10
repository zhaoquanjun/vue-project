<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData"
      tooltip-effect="dark"
      @sort-change="sortChange"
      class="content-table"
      :row-style="{height:'70px'}"
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
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
      <el-table-column prop="createTime" label="开通时间" sortable="custom" min-width="200">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.createTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" sortable="custom" min-width="200">
        <template slot-scope="scope">
          <div>{{ _formatDateTime(scope.row.updateTime, "yyyy/MM/dd hh:mm") }}</div>
        </template>
      </el-table-column>
      <el-table-column label="模板状态" min-width="100">
        <template slot-scope="scope">
          <div>{{statusValue(scope.row.templateState)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="管理员|备注" min-width="200">
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.designerPhone}}</p>
            <p style="margin-top:8px">
              {{scope.row.remark}}
              <el-popover
                :ref="`popover-${scope.row.siteId}`"
                placement="bottom"
                width="200"
                trigger="click"
                style="padding:0;display:inline-block;overflow:visible;"
                @show="showRemark(scope.row)"
              >
                <i v-show="scope.row.siteId" slot="reference" class="iconfont iconicon-dash-edit"></i>
                <div class="textareaWrap">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    placeholder="请输入内容"
                    v-model="remarkText"
                    maxlength="40"
                    show-word-limit
                    resize="none"
                  ></el-input>
                  <div class="btn-wrap">
                    <button
                      class="cl-button cl-button--primary_notbg cl-button--small"
                      slot="refenrence"
                      @click="cancelInput(scope.row.siteId)"
                    >取消</button>
                    <button
                      class="cl-button cl-button--primary cl-button--small"
                      @click="saveInputValue(scope.row, scope.row.siteId)"
                    >保存</button>
                  </div>
                </div>
              </el-popover>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <i
            class="iconfont iconicon-des-setup cl-iconfont"
            :class="{'disabled':scope.row.templateState != 3}"
            @click="jumpToManage(scope.row)"
          ></i>
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
import * as templateApi from "@/api/request/templateApi";
export default {
  props: {
    listData: {
      type: Array
    }
  },
  data() {
    return {
      isRemarkShowId: "",
      remarkText: ""
    };
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
    // 修改备注 弹窗
    showRemark(row) {
      this.remarkText = row.remark;
    },
    // 备注弹窗取消
    cancelInput(siteId) {
      this.$refs[`popover-${siteId}`].doClose();
      this.remarkText = "";
    },
    //备注弹窗确认
    async saveInputValue(row, siteId) {
      this.$refs[`popover-${siteId}`].doClose();
      let { status } = await templateApi.updateTemplateRemark(
        row.siteId,
        this.remarkText
      );
      if (status == 200) {
        row.remark = this.remarkText;
        this.$notify({
          customClass: "notify-success",
          message: `保存成功`,
          duration: 1500,
          showClose: false
        });
      } else {
        this.$notify({
          customClass: "notify-error",
          message: `保存失败`,
          duration: 1500,
          showClose: false
        });
      }
    },
    //改变排序
    sortChange(row) {
      this.$emit("orderList", row.prop, row.order);
    },
    jumpToManage(row) {
      if (row.templateState != 3) {
        return;
      }
      this.$router.push({
        path: "/template/composemanage",
        query: {
          siteId: row.siteId,
          templateName: row.templateName
        }
      });
    },
    _formatDateTime(date, fmt) {
      return formatDateTime(date, fmt);
    },
    statusValue(status) {
      switch (status) {
        case 0:
          return "开通中";
        case 3:
          return "开通成功";
        case 2:
          return "开通失败";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list /deep/ .el-table .ascending .sort-caret.ascending {
  border-bottom-color: $--color-primary;
}
.table-list /deep/ .el-table .descending .sort-caret.descending {
  border-top-color: $--color-primary;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
// popover 弹框样式
.textareaWrap {
  background: $--color-white;
  margin: 0;
  position: relative;
  .btn-wrap {
    text-align: right;
    padding-top: 16px;
  }
}
</style>


