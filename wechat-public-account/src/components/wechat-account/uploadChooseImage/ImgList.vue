<template>
  <div class="table-wrap" id="table-list">
    <el-table
      ref="multipleTable"
      :data="imgPageResult.list"
      tooltip-effect="dark"
      class="content-table"
      max-height="400px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>

      <el-table-column label="图片名称">
        <template slot-scope="scope">
          <img :src="scope.row.zoomOssUrl" class="cover" />
          <span>{{scope.row.title}}</span>
          <!-- <input v-model="scope.row.title" />
          <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
        </template>
      </el-table-column>

      <el-table-column prop="categoryName" label="分类"></el-table-column>

      <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>

      <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
            <button class="handle-btn move-btn" @click="handleMove(scope.row)"></button>
            <button class="handle-btn look-btn" @click="viewPic( scope.row)">
              <span class="move-icon"></span>
            </button>
            <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
              <span class="delete-icon"></span>
              <!-- <svg-icon icon-class="l-recyclebin"></svg-icon> -->
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageing" id="pageing">
      <slot name="paging"></slot>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="imgPageResult.totalRecord"
        :page-count="imgPageResult.totalPage"
        :page-size="picSearchOptions.pageSize"
        :page-sizes="[5,10,15,20,50,100]"
        @current-change="changePage"
        @size-change="changeSize"
      ></el-pagination>
    </div>
    <!-- :title="picTitle" -->
    <div id="img-list-dialog">
      <el-dialog :visible.sync="imgVisible" :modal-append-to-body="false">
        <!-- //<img :src="picUrl"> -->
        <el-carousel :autoplay="false" arrow="always" indicator-position="none" :loop="false">
          <el-carousel-item v-for="item in imgPageResult.list" :key="item.id">
            <h3>
              <img :src="item.fullOssUrl" />
            </h3>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ["imgPageResult", "picSearchOptions", "treeResult"],
  data() {
    return {
      imgList: [],
      picInfo: {},
      imgVisible: false,
      multipleSelection: [],
      picUrl: null,
      picTitle: null,
      categoryVisable: false,
      changeCategoryPicId: null
    };
  },

  methods: {
    /**
     * 单选或全选操作
     */
    handleSelectionChange(list) {
      this.multipleSelection = list;
      this.$emit("handleSelectionChange", list);
    },
    /**
     * 移动分类
     */
    handleMove(row) {
      this.categoryVisable = true;
      this.changeCategoryPicId = row.id;
      this.$emit("moveClassify", true, row);
    },
    changeCategory(data) {
      this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
      this.categoryVisable = false;
    },
    rename(id, newName) {
      this.$emit("rename", id, newName);
    },
    /**
     * 查看大图
     */
    viewPic(row) {
      this.picUrl = row.fullOssUrl;
      this.picTitle = row.title;
      this.imgVisible = true;
    },

    changePage(page) {
      this.picSearchOptions.pageIndex = page;
      this.$emit("getPicList");
    },
    changeSize(size) {
      this.picSearchOptions.pageSize = size;
      this.$emit("getPicList");
    },
    batchRemove(row) {
      this.$emit("batchRemove", [row.id]);
    }
  }
};
</script>


<style lang="scss" scoped>
#table-list {
  padding: 44px;
  .handle-btn-wrap {
    span {
      display: block;
    }
    .move-icon {
      width: 16px;
      height: 16px;
      background: url("~img/account/img_move.png") no-repeat center center;
      background-size: 100% 100%;
      &:hover {
        background: url("~img/account/img_move_active.png") no-repeat center
          center;
        background-size: 100% 100%;
      }
    }
    .preview-icon {
      width: 16px;
      height: 16px;
      background: url("~img/account/img_preview.png") no-repeat center center;
      background-size: 100% 100%;
      &:hover {
        background: url("~img/account/img_preview_active.png") no-repeat
          center center;
        background-size: 100% 100%;
      }
    }
    .delete-icon {
      width: 16px;
      height: 16px;
      background: url("~img/account/img_delete.png") no-repeat center center;
      background-size: 100% 100%;
      &:hover {
        background: url("~img/account/img_delete_active.png") no-repeat
          center center;
        background-size: 100% 100%;
      }
    }
    .selected-icon {
      width: 16px !important;
      height: 16px !important;
      background: url("~img/account/img_selected.png") no-repeat center
        center;
      background-size: 100% 100%;
    }
  }
}
.pageing {
  padding-top: 40px;
}
</style>

<style scoped>
#table-list /deep/ .el-table {
  height: 432px;
}
.pageing /deep/ .el-pagination {
  font-size: 14px;
}
.pageing /deep/ .el-pagination .el-pagination span:not([class*="suffix"]) {
  height: 32px;
  line-height: 32px;
}
.pageing /deep/ .el-pagination .el-pagination .el-pagination__jump {
  height: 32px;
}
.pageing /deep/ .el-pagination .el-pagination .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.pageing /deep/ .el-pagination .el-pagination button {
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}
.pageing /deep/ .el-pagination .el-pagination .el-pager li.number {
  widows: 32px;
  height: 32px;
  line-height: 32px;
}
#table-list /deep/ .el-table .el-table__body-wrapper {
  overflow-y: auto;
  height: 400px;
}
#table-list /deep/ table > thead tr:first-of-type > th:first-of-type label {
  display: none;
}
</style>
