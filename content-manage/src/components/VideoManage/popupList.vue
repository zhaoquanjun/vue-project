<template>
  <div class="table-wrap" id="table-list">
    <div class="table">
      <div class="tableTitle">
        <div>视频名称</div>
        <div>大小</div>
        <div>时长</div>
        <div>上传时间</div>
      </div>
      <div v-show="imgPageResult.list && imgPageResult.list.length > 0" style="overflow:hidden">
        <ul class="tableList">
          <li
            v-for="(item, i) in imgPageResult.list"
            :key="i"
            class="tableListItem"
            @click="check(item)"
            :class="{checked:isChecked(item)}"
          >
            <div class="contentTitle">
              <div class="cover">
                <img width="100%" height="100%" :src="item.coverUrl" />
                <span class="play" @click="viewPic(item,i)">
                  <img src="~img/cover.png" alt />
                </span>
              </div>
              <div class="titleWrap" v-if="(index == i)">
                <el-input
                  type="text"
                  size="small"
                  ref="renameInput"
                  placeholder="请输入内容"
                  v-model="item.title"
                  maxlength="50"
                  show-word-limit
                  @blur="rename(item.id, item)"
                ></el-input>
                <div class="format">格式： {{formatterFileExt(item.fileExtension)}}</div>
              </div>
              <div class="titleWrap" v-else>
                <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                  <div class="file-title cursor-p" @click="rename(item.id, item, i)">{{item.title}}</div>
                </el-tooltip>
                <div class="format">格式： {{formatterFileExt(item.fileExtension)}}</div>
              </div>
            </div>

            <div class="contentInfo contentSize">{{item.sizeStr}}</div>
            <div class="contentInfo contentDuration">{{item.durationStr}}</div>
            <div class="contentInfo contentTime">{{item.createTimeStr}}</div>
          </li>
        </ul>
      </div>
      <div v-show="imgPageResult.list && imgPageResult.list.length == 0" class="empty-table">
        <img src="~img/table-empty.png" />
        <p>无数据</p>
      </div>
    </div>
    <div class="list-footer">
      <div class="storage-wrap">
        <div style="display:flex;justify-content: space-between;">
          <span class="title">已用空间</span>
          <span class="storage-content">{{storageUsage.currentUsage}} / {{storageUsage.maxSize}}</span>
        </div>
        <div class="use-storage">
          <div class="progress-bar" :style="{'width':storageUsage.prograss+'%'}"></div>
        </div>
      </div>
      <div class="storage-wrap">
        <div style="display:flex;justify-content: space-between;">
          <span class="title">已用流量</span>
          <span class="storage-content">{{usageTraffic.currentUsage}} / {{usageTraffic.maxSize}}</span>
        </div>
        <div class="use-storage">
          <div class="progress-bar" :style="{'width':usageTraffic.prograss+'%'}"></div>
        </div>
      </div>
      <div class="cl-paganation pageing" id="pageing">
        <slot name="paging"></slot>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="imgPageResult.totalRecord"
          :page-count="imgPageResult.totalPage"
          :page-size="picSearchOptions.pageSize"
          @current-change="changePage"
          @size-change="changeSize"
        ></el-pagination>
      </div>
    </div>
    <div id="img-list-dialog">
      <el-dialog :visible.sync="imgVisible" :modal-append-to-body="false" @close="closeDialog">
        <video ref="video" class="video" :src="fullOssUrl" controls="controls" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
    adminDownload,
    getStorageUsage,
    getCurrentUsageTraffic
} from "@/api/request/contentCommonApi.js";
export default {
  props: ["imgPageResult", "picSearchOptions", "treeResult"],
  data() {
    return {
      picInfo: {},
      index: -1, //
      isRename: true, // 重命名图片名称
      initial: 0,
      imgVisible: false,
      multipleSelection: [],
      picUrl: null,
      picTitle: null,
      categoryVisable: false,
      changeCategoryPicId: null,
      imgList: "",
      fullOssUrl: "",
      loadingShow: true,
      tableHeight: 500,
      storageUsage: {},
      usageTraffic: {},
      checkedList: []
    };
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.tableHeight = window.innerHeight - 290;
      });
      this.tableHeight = window.innerHeight - 290;
    });
    this._getStorageUsage();
    this._getCurrentUsageTraffic();
  },
  methods: {
    check(item) {
      if (this.checkedList.length > 0) {
        if (item.id == this.checkedList[0].id) {
          this.checkedList.splice(0, 1);
        } else {
          this.checkedList.splice(0, 1);
          this.checkedList.push(item);
        }
      } else {
        this.checkedList.push(item);
      }
        console.log(this.checkedList)
      this.$emit("getChecked", this.checkedList);
    },
    isChecked(item) {
      if (this.checkedList.length > 0) {
        if (item.id == this.checkedList[0].id) {
          return true;
        }
      }
      return false;
    },
    bytesToSize(bytes, flag) {
      if (bytes === 0) return "0 B";
      let k = 1024;
      let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      let b = bytes / Math.pow(k, i);
      if (flag === 1) {
        b = b.toFixed(2);
      }
      let storage = b + sizes[i];
      return storage;
    },
    // 获取使用的内存
    async _getStorageUsage() {
      let { data } = await getStorageUsage("Video");
      this.storageUsage = {
        maxSize: this.bytesToSize(data.maxSize),
        currentUsage: this.bytesToSize(data.currentUsage, 1),
        prograss: (data.currentUsage / data.maxSize) * 100
      };
    },
    // 获取使用的流量
    async _getCurrentUsageTraffic() {
      let { data } = await getCurrentUsageTraffic("Video");

      this.usageTraffic = {
        maxSize: this.bytesToSize(data.maxSize),
        currentUsage: this.bytesToSize(data.currentUsage, 1),
        prograss: (data.currentUsage / data.maxSize) * 100
      };
      if (data.currentUsage >= data.maxSize) {
        this.$notify({
          customClass: "notify-error",
          message: `您的视频流量剩余量为0，为不影响您的网站效果，请及时联系管理员！!`,
          duration: 1500
        });
      }
    },
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
    changeCategory(data) {
      this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
      this.categoryVisable = false;
    },
    //去左右空格;
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 重命名图片名称
    rename(id, row, index) {
      //   debugger;
      if (row.title) this.newName = row.title;
      if (!this.trim(row.title)) {
        row.title = this.newName;
        this.$notify({
          customClass: "notify-error",
          message: `视频名称不能为空`,
          showClose: false,
          duration: 2000
        });
        return false;
      }
      if (isNaN(index)) {
        this.index = -1;
        this.$emit("rename", id, row.title);
        return;
      }
      this.index = index;
      this.$nextTick(() => {
        this.$refs.renameInput[0].focus();
      });
    },
    /**
     *
     */
    viewPic(row, index) {
      if (!row.isLoadFinish) {
        this.$notify({
          customClass: "notify-error",
          message: `视频正在加载中,请稍后点击播放`,
          showClose: false,
          duration: 2000
        });
        return;
      }
      this.imgList = this.imgPageResult.list;
      this.picInfo = this.imgList[index];
      this._adminDownload(row);
    },
    async _adminDownload(row) {
      let type = row.fileType;
      let id = row.id;
      let { data } = await adminDownload(type, id);
      this.fullOssUrl = data;
      this.imgVisible = true;
      this.$nextTick(() => {
        this.$refs.video.play();
      });
    },
    changePage(page) {
      this.picSearchOptions.pageIndex = page;
      this.$emit("getList");
    },
    changeSize(size) {
      this.picSearchOptions.pageSize = size;
      this.$emit("getList");
    },
    closeDialog() {
      this.$refs.video.pause();
    },
    formatterFileExt(fileExt) {
      if (fileExt) {
        if (fileExt.substring(0, 1) == ".") return fileExt.substring(1);
        return fileExt;
      }
      return "";
    }
  }
};
</script>
<style scoped>
.el-input /deep/ .el-input__inner {
  padding-right: 50px;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
  display: flex;
  align-items: center;
}
.titleWrap /deep/ .el-input {
  margin-top: -10px;
}
/* .el-table /deep/ .el-table__body-wrapper .el-table__row .cell {
  display: flex;
  align-items: center;
} */
#table-list /deep/ .el-table td {
  border-bottom: 1px solid #e5e5e5;
}
/* table 头部颜色 和 高度 */
#table-list /deep/ .el-table thead th {
  padding: 0;
  height: 50px;
  background: #fff !important;
}
#table-list /deep/ .el-table thead th .cell {
    color: #a1a8b1;
    font-weight: 400;
    font-size: 14px;
}
</style>
<style lang="scss" scoped>
.table {
  height: 537px;
  width: 870px;
  border: 1px solid #e5e5e5;
  .tableTitle {
    width: 100%;
    height: 51px;
    border-bottom: 1px solid #e5e5e5;
    div {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: rgba(161, 168, 177, 1);
      line-height: 51px;
      box-sizing: border-box;
    }
    div:nth-child(1) {
      padding-left: 30px;
      width: 475px;
    }
    div:nth-child(2) {
      width: 80px;
    }
    div:nth-child(3) {
      width: 130px;
    }
    div:nth-child(4) {
      width: 178px;
    }
  }
  .tableList {
    height: 486px;
    margin-right: -15px;
    overflow-y: auto;
    .tableListItem {
      height: 160px;
      border: 2px solid transparent;
      border-bottom: 1px solid #e5e5e5;
    }
    .checked {
      border: 2px solid #09cceb;
    }
  }
}
.file-title {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
  overflow: hidden;
  max-width: 190px;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  margin-bottom: 30px;
}
.titleWrap {
  display: inline-block;
  padding-top: 24px;
}
.format {
  font-size: 14px;
  font-weight: 400;
  color: rgba(161, 168, 177, 1);
  line-height: 20px;
  white-space: unset !important;
  margin-top: 24px;
}
.cover {
  display: inline-block;
  position: relative;
  width: 190px;
  height: 130px;
  margin-right: 16px;
  vertical-align: top;
  .play {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    border-radius: 2px;
    text-align: center;
    img {
      width: 30px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.contentInfo {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 160px;
  display: inline-block;
  vertical-align: top;
}
.contentTitle {
  display: inline-block;
  width: 475px;
  padding: 16px;
  box-sizing: border-box;
}
.contentSize {
  width: 80px;
}
.contentDuration {
  width: 130px;
}
.contentTime {
  width: 178px;
}
.video {
  cursor: pointer;
  outline: none;
  width: 800px;
  height: 700px;
}
.table-content {
  margin-right: 16px;
  // border: 1px solid #e5e5e5;
  border-radius: 2px;
  .handle-btn-wrap {
    justify-content: flex-start;
    span {
      i {
        // font-size: 23px;
        color: #8a8585;
      }
    }
    .edit-icon {
      margin-right: 32px;
      cursor: pointer;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        right: -10px;
        bottom: -10px;
        left: -10px;
      }
    }
    .edit-icon:hover i,
    .more-operate:hover i {
      color: #09cceb;
    }
    .more-operate {
      position: relative;
      cursor: pointer;
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        right: -10px;
        bottom: -10px;
        left: -10px;
      }
    }
  }
}
.operate-section {
  display: none;
  position: absolute;
  z-index: 19;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  li {
    cursor: pointer;
    padding: 8px 16px;
    line-height: 17px;
    &:hover {
      color: #00c1de;
      background: rgba(0, 193, 222, 0.2);
    }
  }
}
.img-name {
  cursor: pointer;
  width: 80%;
}
.storage-wrap {
  // float: left;
  // margin-top: 24px;
  margin-right: 28px;
  line-height: 25px;
  .use-storage {
    display: inline-block;
    width: 186px;
    background: rgba(109, 114, 120, 0.09);
    padding: 4px;
    border-radius: 30px;

    .progress-bar {
      height: 5px;
      width: 100%;
      border-radius: 30px;
      background: linear-gradient(
        270deg,
        rgba(21, 232, 247, 1) 0%,
        rgba(9, 204, 235, 1) 100%
      );
      box-shadow: 0px 0px 4px 0px rgba(105, 242, 255, 1);
    }
  }
  .title {
    font-size: 14px;
  }
  .storage-content {
    font-size: 14px;
    color: #666666;
  }
}
.list-footer {
  padding: 24px 0 24px 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  .pageing {
    margin-top: 0;
    padding-bottom: 0;
    margin-left: auto;
    margin-right: 0;
  }
}

#table-list {
  .el-table td {
    padding: 19px 0;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f0fcfe;
  }
  .el-table-column--selection {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
    }
    .el-checkbox__inner::after {
      left: 6px;
      top: 3px;
    }
  }
}
</style>


