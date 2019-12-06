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
      <el-table-column prop="templateName" label="缩略图" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="siteImg">
            <div class="recommend" v-show="scope.row.isRecommend">推荐</div>
            <img :src="scope.row.controlImg" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" label="控件名称" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.controlName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="控件分类" min-width="100">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.firstTypeName }}</p>
            <p>{{ scope.row.secondTypeName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.displayOrder}}</div>
        </template>
      </el-table-column>
      <el-table-column label="排列" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.rowShowNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column label="使用量" min-width="100">
        <template slot-scope="scope">
          <div>{{scope.row.useCount}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
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
            <i class="iconfont iconicon-des-setup cl-iconfont" style="margin-right:16px"></i>
            <i class="iconfont iconshanchu cl-iconfont" @click="deleteItem(scope.row)"></i>
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


