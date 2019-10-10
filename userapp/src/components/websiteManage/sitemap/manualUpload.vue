<template>
  <el-main style="padding:0 32px">
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="true"
      @file-added="onFileAdded"
      class="uploader-example"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-list uploadType="File" class="uploadList">
        <div class="fileImg" v-show="isUpload">
          <i class="iconfont iconshanchu1 fileRemove" @click="fileRemove"></i>
        </div>
        <div v-show="isUpload" class="fileName">robots.txt</div>
        <div v-show="isUpload" class="fileName" style="margin-top:5px">{{date?date:""}}</div>
        <div v-show="isUpload" v-if="progressFlag" class="progress">
          <el-progress :percentage="progressPercent" status="success"></el-progress>
        </div>
      </uploader-list>
      <uploader-drop>
        <uploader-btn :attrs="attrs" class="uploadIcon" v-show="!isUpload">
          <i class="iconfont iconicon-add" style="color:#09CCEB;line-height:60px;font-size:25px"></i>
        </uploader-btn>
        <span v-show="!isUpload">将sitemap文件拖拽到此处或</span>
        <uploader-btn :attrs="attrs" v-show="!isUpload">点击上传</uploader-btn>
        <div class="uploadText" v-show="isUpload">
          拖拽替换文件或
          <uploader-btn style="color:#09CCEB">点击上传</uploader-btn>
        </div>
        <div class="uploadTextRemark">只支持XML文件</div>
      </uploader-drop>
    </uploader>
    <div class="tip">如何选择手动上传</div>
  </el-main>
</template>
<script>
import * as sitemapApi from "@/api/request/sitemapApi";
import environment from "@/environment/index.js";
import { formatDateTime } from "@/api/index";
export default {
  props: ["siteId"],
  data() {
    return {
      options: {
        target: ``,
        testChunks: false,
        allowDuplicateUploads: true,
        headers: {
          appId: this.$store.state.dashboard.appId,
          Authorization:
            "Bearer " + this.$store.state.user.accessToken.Authorization
        }
      },
      uploadAction: "",
      attrs: {
        accept: "*/*"
      },
      fileList: [],
      isUpload: false,
      progressFlag: false,
      progressPercent: 0,
      file: {},
      date: ""
    };
  },
  methods: {
    init() {
      this.hasUploadFile(this.siteId);
      this.preview(this.siteId);
      this.$set(
        this.options,
        "target",
        `${environment.uploadSitemapUrl}${this.siteId}`
      );
      console.log(this.options);
    },
    async hasUploadFile(siteId) {
      let { data } = await sitemapApi.hasUploadFile(siteId);
      this.isUpload = data.hasUpload;
      this.date = formatDateTime(data.createTime, "yyyy-MM-dd");
    },
    async preview(siteId) {
      let { data } = await sitemapApi.preview(siteId);
    },
    onFileAdded(file) {
      this.options.headers.Authorization =
        "Bearer " + this.$store.state.user.accessToken.Authorization;
      this.options.headers.appId = this.$store.state.dashboard.appId;
      this.$set(
        this.options,
        "target",
        `${environment.uploadSitemapUrl}${this.siteId}`
      );
      //   if (file.name != "robots.txt") {
      //     this.$notify({
      //       customClass: "notify-error",
      //       message: `请上传文件名为“robots”的txt文件`,
      //       duration: 1500,
      //       showClose: false
      //     });
      //     file.pause(file);
      //     file.cancel(file);
      //     return;
      //   }
      if (file.size > 4 * 1024) {
        this.$notify({
          customClass: "notify-error",
          message: `文件大小不可超过4K`,
          duration: 1500,
          showClose: false
        });
        file.pause();
        file.cancel(file);
        return;
      }
      this.file = file;
      // this.fileList.push(file);
      this.isUpload = true;
      this.progressFlag = true;
      this.progressPercent = 100;
      // file.resume();
      this.$notify({
        customClass: "notify-success",
        message: `上传成功`,
        duration: 1500,
        showClose: false
      });
      this.date = this.getNowFormatDate();
    },
    fileRemove() {
      this.$confirm(`您确定要删除当前robots文件么？删除后不可恢复。`, "提示", {
        iconClass: "icon-warning",
        callback: action => {
          if (action === "confirm") {
            sitemapApi.remove(this.siteId).then(res => {
              if (res.status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功`,
                  duration: 2000,
                  showClose: false
                });
                this.fileList.splice(0, 1);
                this.isUpload = false;
              } else {
                this.$notify({
                  customClass: "notify-error",
                  message: `系统正忙，请稍后再试！`,
                  duration: 2000,
                  showClose: false
                });
              }
            });
          }
        }
      });
    },
    // 获取当前时间
    getNowFormatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + "-" + month + "-" + strDate;
      return currentdate;
    }
  }
};
</script>
<style scoped>
.upload /deep/ .el-upload {
  width: 100%;
  height: 429px;
}
.upload /deep/ .el-upload .el-upload-dragger {
  width: 100%;
  height: 429px;
}
.upload /deep/ .el-upload-list {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -10px;
}
.upload /deep/ .el-upload-list .el-upload-list__item-name {
  font-size: 16px;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 22px;
  height: 70px;
  margin-right: 0px;
  text-align: center;
}
.upload /deep/ .el-upload-list__item-name .el-icon-document {
  font-size: 50px;
  line-height: 50px;
  height: 50px;
  display: block;
  text-align: center;
}
.uploader-example /deep/ .uploader-file {
  border: none;
  height: 200px;
}
.uploader-example /deep/ .uploader-file-name {
  font-size: 16px;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 22px;
  width: 100%;
  text-align: center;
}
.uploader-example /deep/ .uploader-file-icon {
  display: block;
  margin: auto;
}
.uploader-example /deep/ .uploader-file-size {
  display: none;
}
.uploader-example /deep/ .uploader-file-meta {
  display: none;
}
.uploader-example /deep/ .uploader-file-status {
  display: none;
}
.uploader-example /deep/ .uploader-file-actions {
  display: none;
}

.progress /deep/ .el-progress-bar__inner {
  background-color: #09cceb;
}
.progress /deep/ .el-progress {
  width: 150px;
}
</style>
<style lang="scss" scoped>
.uploader-example {
  position: relative;
  //   height: 470px;
  margin-top: 20px;
  padding: 20px;
  background: rgba(230, 249, 253, 1);
  border-radius: 2px;
  border: 1px dashed rgba(9, 204, 235, 1);
  .uploader-drop {
    padding: 0;
    height: 430px;
    background: #fff;
    border-radius: 2px;
    border: 1px dashed rgba(215, 215, 215, 1);
    text-align: center;
    line-height: 68px;
    span {
      font-size: 16px;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
      line-height: 22px;
    }
    .uploadIcon {
      display: block;
      margin: 142px auto 0;
      width: 60px;
      height: 60px;
      background: rgba(9, 204, 235, 0.1);
      border-radius: 4px;
      &:hover {
        background: rgba(9, 204, 235, 0.1) !important;
      }
    }
    .uploader-btn {
      // border: 1px solid #09cceb;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      border: none;
      color: #09cceb;
      padding: 0;
      &:hover {
        background: transparent;
      }
    }
    .uploadText {
      font-size: 16px;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
      line-height: 22px;
      margin: auto;
      margin-top: 275px;
      margin-bottom: 16px;
      width: 184px;
    }
    .uploadTextRemark {
      font-size: 16px;
      font-weight: 400;
      color: rgba(185, 203, 207, 1);
      line-height: 22px;
      margin: auto;
      width: 248px;
    }
  }
  .uploadList {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -25px;
    transform: translate(-50%, -50%);
    z-index: 1;
    text-align: center;
    .fileName {
      font-size: 16px;
      font-weight: 400;
      color: rgba(185, 203, 207, 1);
      line-height: 22px;
    }
    .fileImg {
      margin: auto;
      width: 92px;
      height: 109px;
      background: url("~img/upload/upload.png") no-repeat center;
      background-size: cover;
      text-align: center;
      &:hover {
        .fileRemove {
          display: inline-block;
        }
      }
      .fileRemove {
        color: #63dc8c;
        line-height: 109px;
        font-size: 20px;
        display: none;
        &:hover {
          opacity: 0.7;
          cursor: pointer;
        }
      }
    }
  }
}
.tip {
  display: inline-block;
  margin-top: 32px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(9, 204, 235, 1);
  line-height: 22px;
  cursor: pointer;
}
</style>

