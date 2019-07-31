<template>
  <div class="table-wrap" id="table-list">
    <el-table
      ref="multipleTable"
      :data="siteInfo"
      tooltip-effect="dark"
      class="content-table"
      :default-sort="{prop: 'backupTime', order: 'descending'}"
    >
      <el-table-column prop="siteName" label="站点名称"></el-table-column>
      <el-table-column prop="backupTime" label="备份时间"></el-table-column>
      <el-table-column prop="dataSize" label="备份包大小"></el-table-column>
      <el-table-column prop="userName" label="备份人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="description" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover
            :ref="`popover-${scope.$index}`"
            placement="bottom"
            width="317"
            trigger="click"
            style="padding:0"
            @show="showRemark(scope.row)"
          >
            <span slot="reference">
              <div class="remark-desc">{{scope.row.description}}</div>
              <svg-icon icon-class="remark"></svg-icon>
            </span>
            <div class="textareaWrap">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 3}"
                placeholder="请输入内容"
                v-model="remarkValue"
                maxlength="30"
                show-word-limit
                resize="none"
              ></el-input>
              <div class="btn-wrap">
                <button
                  class="popover-btn cancel"
                  slot="refenrence"
                  @click="cancelInput(scope.$index)"
                >取消</button>
                <button class="popover-btn save" @click="saveInputValue(scope.$index,scope.row)">保存</button>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
            <el-tooltip content="还原备份包" placement="top">
              <button class="handle-btn backup-btn" @click="recovery( scope )"></button>
            </el-tooltip>
            <el-tooltip content="下载备份包" placement="top">
              <button class="handle-btn download-btn" @click="downloadBackup( scope )"></button>
            </el-tooltip>
            <el-tooltip content="删除备份包" placement="top" visible-arrow="false">
              <button class="handle-btn delete-btn" @click="deleteBackup( scope )"></button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as siteBackupApi from "@/api/request/siteBackupApi";
import * as dashboardApi from "@/api/request/dashboardApi";
export default {
  props: ["siteInfo"],

  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * 获取站点信息
     */
  }
};
</script>
<style lang="scss" scoped>
</style>
