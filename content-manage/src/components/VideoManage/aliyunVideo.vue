<template>
  <div>
    <div class="notConfigured-wrap" v-if="!configured">
      <div style="text-align:center">
        <div class="notConfigured-content">
          <div class="notConfigured-img"></div>
          <div class="notConfigured-title">阿里云视频</div>
          <div class="notConfigured-text">视频播放更稳定、更流畅</div>
        </div>
        <a :href="akskUrl">
          <button class="cl-button cl-button--primary notConfigured-btn">立即配置</button>
        </a>
      </div>
    </div>
    <div class="configured-wrap" v-if="configured">
      <div class="configured-header">
        <el-input
          size="medium"
          v-model="picSearchOptions.keyword"
          placeholder="输入视频名称搜索"
          @keyup.enter.native="getListOfAli"
          style="width:270px"
          v-show="!deleteIdList.length"
        >
          <i
            class="el-icon-search el-input__icon"
            style="cursor: pointer;"
            slot="suffix"
            @click="getListOfAli"
          ></i>
        </el-input>
        <button
          class="cl-button cl-button--primary"
          v-show="!deleteIdList.length"
          @click="uploadVideo"
        >上传视频</button>
        <div v-show="deleteIdList.length">
          <span>
            已选
            <i style="color:#fe9837;">{{deleteIdList.length}}</i> 个文件
          </span>
          <button class="cl-button cl-button--text_danger" @click="batchDelete">删除</button>
        </div>
      </div>
      <div class="configured-table">
        <el-table
          ref="multipleTable"
          :data="aliyunVideoData.list"
          tooltip-effect="dark"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <template slot="empty">
            <div class="empty-table" style="cursor:default">
              <img src="~img/table-empty.png" />
              <p>无数据</p>
            </div>
          </template>
          <el-table-column type="selection"></el-table-column>

          <el-table-column label="视频名称" min-width="400">
            <template slot-scope="scope">
              <div class="cover">
                <img width="100%" height="100%" :src="scope.row.coverUrl" />
                <span class="play" @click="viewPic(scope.row)">
                  <div class="play-btn">
                    <span></span>
                  </div>
                </span>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                  <div class="file-title cursor-p">{{scope.row.title}}</div>
                </el-tooltip>
                <div class="format">
                  <div class="sizeStr">{{scope.row.durationStr}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="sizeStr"
            sortable="custom"
            min-width="200"
            label="大小"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTimeStr"
            sortable="custom"
            label="上传时间"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="80" v-if="$store.state.dashboard.isContentwrite">
            <template slot-scope="scope">
              <div class="handle-btn-wrap">
                <button class="more-operate delete-btn" @click="batchRemove(scope.row)">
                  <i class="iconfont iconshanchu cl-iconfont is-square"></i>
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="上传" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
      <span slot="title">
        <span class="fs14">
          上传{{displayName}}
          <el-tooltip
            class="item"
            effect="dark"
            placement="right"
            content="一次最多可上传10个视频，单个视频大小不超过2G"
          >
            <i class="iconfont iconyiwen"></i>
          </el-tooltip>
        </span>
      </span>
      <chunk-upload
        v-if="dialogTableVisible"
        :displayName="displayName"
        :uploadType="contentType"
        :node-data="nodeData"
        :apiHost="apiHost"
        :noCategory="true"
        @getList="getListOfAli"
        @closeDialog="closeDialog"
      />
      <!-- :accept="'video/*'" -->
    </el-dialog>
    <div id="img-list-dialog">
      <div class="mask" v-show="videoVisible" style="text-align:center;">
        <button class="closeBtn">
          <i class="el-icon-close icon-close" @click="closeVideoVisible()"></i>
        </button>
        <video ref="video" class="video" :src="fullOssUrl" controls="controls" />
      </div>
    </div>
  </div>
</template>
<script>
import * as videoManageApi from "@/api/request/videoManageApi";
import environment from "@/environment/index.js";
import { akskUrl } from "@/environment/index.js";
import ChunkUpload from "@/components/common/ChunkUpload";
export default {
  props: [],
  components: {
    ChunkUpload
  },
  data() {
    return {
      akskUrl: akskUrl,
      configured: false,
      searchInput: "",
      tableHeight: 500,
      aliyunVideoData: {},
      picSearchOptions: {
        pageSize: 50,
        pageIndex: 1,
        orderByType: "createtime",
        isDescending: true,
        categoryIdList: [],
        keyword: "",
        isDelete: false
      },
      displayName: "视频",
      contentType: "Video",
      nodeData: {
        label: "全部分类",
        id: 0
      },
      apiHost: environment.contentApi,
      dialogTableVisible: false,
      fullOssUrl: "",
      videoVisible: false,
      deleteIdList: []
    };
  },
  mounted() {},
  methods: {
    init() {
      this.getAksk();
    },
    async getAksk() {
      let { data } = await videoManageApi.getAksk();
      if (data.vodAuthorization) {
        this.configured = true;
        this.getListOfAli();
        this.$nextTick(() => {
          window.addEventListener("resize", () => {
            this.tableHeight = window.innerHeight - 240;
          });
          this.tableHeight = window.innerHeight - 240;
        });
      } else {
        this.configured = false;
      }
    },
    // 获取列表
    async getListOfAli() {
      this.$Loading.show();
      let { data } = await videoManageApi.getListOfAli(this.picSearchOptions);
      this.aliyunVideoData = data;
      this.$Loading.hide();
    },
    handleSelectionChange(list) {
      this.deleteIdList = [];
      list.forEach(item => {
        this.deleteIdList.push(item.id);
      });
    },
    sortChange(row) {
      if (row.prop == "sizeStr") {
        this.picSearchOptions.orderByType = "filesize";
      } else if (row.prop == "createTimeStr") {
        this.picSearchOptions.orderByType = "createtime";
      }
      if (row.order == "ascending") {
        this.picSearchOptions.isDescending = false;
      } else {
        this.picSearchOptions.isDescending = true;
      }
      this.getListOfAli();
    },
    batchRemove(row) {
      this.batchRemoveItem([row.id]);
    },
    batchDelete() {
      this.batchRemoveItem(this.deleteIdList);
    },
    // 批量删除列表
    async batchRemoveItem(idlist) {
      this.$confirm(
        `删除后，${this.displayName}将被移动到回收站，可在回收站中恢复，是否确定删除？`,
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              let { status, data } = await videoManageApi.deleteVideo(idlist);
              if (status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1500
                });
                setTimeout(() => {
                  this.getListOfAli();
                }, 800);
              }
            }
          }
        }
      );
    },
    async viewPic(row) {
      if (!row.isLoadFinish) {
        this.$notify({
          customClass: "notify-error",
          message: `视频正在加载中,请稍后点击播放`,
          showClose: false,
          duration: 2000
        });
        return;
      }
      let { data } = await videoManageApi.getVideoPlayUrl(row.id);
      this.fullOssUrl = data;
      this.videoVisible = true;
      this.$nextTick(() => {
        this.$refs.video.play();
      });
    },
    closeVideoVisible() {
      this.videoVisible = false;
    },
    uploadVideo() {
      this.dialogTableVisible = true;
    },
    // 关闭上传文件弹窗
    closeDialog() {
      this.dialogTableVisible = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/styles/content-manage/manege-table.scss";
.el-input /deep/ .el-input__inner {
  padding-right: 50px;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
  display: flex;
  align-items: center;
}
.el-table /deep/ .ascending .sort-caret.ascending {
  border-bottom-color: $--color-primary;
}
.el-table /deep/ .descending .sort-caret.descending {
  border-top-color: $--color-primary;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: $--background-color-hover;
}
.file-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  margin-bottom: 30px;
}
.cover {
  position: relative;
  width: 150px !important;
  height: 100px !important;
  img {
    object-fit: cover;
  }
  .play {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    .play-btn {
      width: 34px;
      height: 34px;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: url("~img/cover.png") no-repeat center;
    }
  }
}
.closeBtn {
  position: absolute;
  top: 20px;
  right: 57px;
  .icon-close {
    font-size: 24px;
    color: #fff;
    padding: 4px;
    &:hover {
      color: $--color-primary;
    }
  }
}
.video {
  cursor: pointer;
  outline: none;
  height: 50%;
  width: 800px;
  margin-top: 150px;
}
.notConfigured-wrap {
  margin: 16px;
  border: $--border-base;
  width: calc(100% - 32px);
  height: 267px;
  background: $--color-white;
  display: flex;
  justify-content: center;
  align-items: center;
  .notConfigured-content {
    width: 300px;
    height: 147px;
    background: $--background-color-hover;
    padding-top: 35px;
    box-sizing: border-box;
    .notConfigured-img {
      width: 35px;
      height: 26px;
      background: url("~img/aliyunVideo.png") no-repeat center;
      background-size: contain;
      margin: auto;
    }
    .notConfigured-title {
      font-size: $--font-size-small;
      color: $--color-text-primary;
      font-weight: $--font-weight-base;
      margin-top: 16px;
    }
    .notConfigured-text {
      font-size: $--font-size-small;
      color: $--color-text-regular;
      font-weight: $--font-weight-base;
      margin-top: 8px;
    }
  }
  .notConfigured-btn {
    margin-top: 24px;
  }
}
.configured-wrap {
  margin: 16px;
  width: calc(100% - 32px);
  .configured-header {
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    border: $--border-base;
    background: $--color-white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .el-input__icon {
      color: $--border-color-base;
    }
  }
  .configured-table {
    margin-top: 16px;
  }
}
</style>


