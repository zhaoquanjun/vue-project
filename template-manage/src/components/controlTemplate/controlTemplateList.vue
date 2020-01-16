<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData.curData"
      tooltip-effect="dark"
      @sort-change="sortChange"
      class="content-table"
      :row-style="{height:'70px'}"
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <template slot="empty">
        <div class="empty-table" @click="createTemplatedialogShow">
          <img src="~img/table-empty.png" />
          <p>添加数据</p>
        </div>
      </template>
      <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">
            {{scope.row.templateName}}
            <el-popover
              :ref="`popoverName-${scope.row.siteId}`"
              placement="bottom"
              width="200"
              trigger="click"
              style="padding:0;display:inline-block;overflow:visible;"
              @show="showName(scope.row)"
            >
              <i v-show="scope.row.siteId" slot="reference" class="iconfont iconbianji"></i>
              <div class="textareaWrap">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3}"
                  placeholder="请输入内容"
                  v-model="nameText"
                  @blur="blurName"
                  maxlength="20"
                  show-word-limit
                  resize="none"
                ></el-input>
                <div class="ym-form-item__error" v-show="errorTemplateNameTips">请输入模板名称</div>
                <div class="btn-wrap">
                  <button
                    class="cl-button cl-button--primary_notbg cl-button--small"
                    slot="refenrence"
                    @click="cancelName(scope.row.siteId)"
                  >取消</button>
                  <button
                    class="cl-button cl-button--primary cl-button--small"
                    @click="saveNameValue(scope.row, scope.row.siteId)"
                  >保存</button>
                </div>
              </div>
            </el-popover>
          </div>
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
                <i v-show="scope.row.siteId" slot="reference" class="iconfont iconbianji"></i>
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
import * as templateApi from "@/api/request/templateApi";
import * as controlApi from "@/api/request/controlTemplateApi";
export default {
  props: {
    listData: {
      type: Object
    }
  },
  data() {
    return {
      isRemarkShowId: "",
      nameText: "",
      errorTemplateNameTips: false,
      remarkText: ""
    };
  },
  methods: {
    createTemplatedialogShow(){
      this.$emit("createTemplatedialogShow");
    },
    changePage(page) {
      this.$emit("changePage", page);
    },
    changeSize(size) {
      this.$emit("changeSize", size);
    },
    // 修改名称
    showName(row) {
      this.nameText = row.templateName;
    },
    // 取消修改名称
    cancelName(siteId) {
      this.$refs[`popoverName-${siteId}`].doClose();
      this.nameText = "";
      this.errorTemplateNameTips = false;
    },
    blurName() {
      if (this.nameText == "") {
        this.errorTemplateNameTips = true;
      } else {
        this.errorTemplateNameTips = false;
      }
    },
    //修改名称确认
    async saveNameValue(row, siteId) {
      if (this.nameText == "") {
        this.errorTemplateNameTips = true;
        return;
      }
      this.$refs[`popoverName-${siteId}`].doClose();
      this.errorTemplateNameTips = false;
      let para = {
        id: row.id,
        templateName: this.nameText
      };
      let { status } = await controlApi.updateTemplateName(para);
      if (status == 200) {
        row.templateName = this.nameText;
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
        path: "/template/controlmanege/composemanage",
        query: {
          siteId: row.siteId,
          templateName: row.templateName,
          secondDomain: row.domain
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
.table-list /deep/ .el-table__empty-text{
    width: 0;
}
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
.iconbianji {
  &:hover {
    color: $--color-primary;
  }
}
</style>


