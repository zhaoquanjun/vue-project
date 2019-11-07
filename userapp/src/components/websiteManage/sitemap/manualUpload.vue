<template>
  <el-main style="padding:0 32px">
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="true"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-error="onFileError"
      class="uploader-example"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-list uploadType="File" class="uploadList">
        <div class="fileImg" v-show="isUpload">
          <div class="fileRemove" @click="fileRemove">
            <i class="iconfont iconshanchu"></i>
          </div>
        </div>
        <div v-show="isUpload" class="fileName">sitemap.xml</div>
        <div v-show="isUpload" class="fileName" style="margin-top:5px">{{date?date:""}}</div>
        <div v-show="isUpload" v-if="progressFlag" class="progress">
          <el-progress :percentage="progressPercent"></el-progress>
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
        <div class="uploadTextRemark">请上传文件名为“sitemap”的xml文件</div>
      </uploader-drop>
    </uploader>
    <div class="tip">如何选择手动上传</div>
  </el-main>
</template>
<script>
import * as sitemapApi from "@/api/request/sitemapApi";
import securityService from "@/services/authentication/securityService";
import environment from "@/environment/index.js";
import { formatDateTime } from "@/api/index";
export default {
  data() {
    return {
      siteId: 0,
      options: {
        target: ``,
        testChunks: false,
        allowDuplicateUploads: true,
        headers: {
          Authorization: ""
        }
      },
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
    async init(siteId) {
      this.siteId = siteId;
      this.hasUploadFile(this.siteId);
      // this.preview(this.siteId);
      this.$set(
        this.options,
        "target",
        `${environment.uploadSitemapUrl}${this.siteId}`
      );
      if (this.$store.state.dashboard.appId) {
        this.options.headers.appId = this.$store.state.dashboard.appId;
      }
      let data = await securityService.getUser();
      if (data && data.access_token) {
        this.options.headers.Authorization = "Bearer " + data.access_token;
      }
      this.$refs.uploader.resetOption();
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
      if (file.name != "sitemap.xml") {
        this.$notify({
          customClass: "notify-error",
          message: `请上传文件名为“sitemap”的xml文件`,
          duration: 1500,
          showClose: false
        });
        file.pause(file);
        return;
      }
      if (file.size > 100 * 1024) {
        this.$notify({
          customClass: "notify-error",
          message: `文件大小不可超过100K`,
          duration: 1500,
          showClose: false
        });
        file.pause();
        return;
      }
    },
    onFileSuccess(file) {
      this.file = file;
      // this.fileList.push(file);
      this.isUpload = true;
      this.progressFlag = true;
      this.progressPercent = 0;
      let timer = null;
      timer = setInterval(() => {
        this.progressPercent++;
        if (this.progressPercent == 100) {
          this.progressFlag = false;
          clearInterval(timer); // 清除定时器
          timer = null;
          this.$notify({
            customClass: "notify-success",
            message: `上传成功`,
            duration: 1500,
            showClose: false
          });
          this.date = this.getNowFormatDate();
        }
      }, 1);
      // file.resume();
    },
    onFileError(rootFile, file, response, chunk) {
      this.$notify({
        customClass: "notify-error",
        message: `${JSON.parse(response).message}`,
        duration: 1500,
        showClose: false
      });
    },
    fileRemove() {
      this.$confirm(`您确定要删除当前sitemap文件吗？删除后不可恢复。`, "提示", {
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
      width: 280px;
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
      margin-top: 8px;
    }
    .fileImg {
      margin: auto;
      width: 64px;
      height: 81px;
      background: url("~img/upload/upload.png") no-repeat center;
      background-size: cover;
      text-align: center;
      &:hover {
        .fileRemove {
          display: inline-block;
        }
      }
      .fileRemove {
        margin-top: 25px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(38, 43, 65, 0.8);
        display: none;
        &:hover {
          opacity: 0.7;
          cursor: pointer;
        }
        .iconshanchu {
          color: #fff;
          font-size: 20px;
          line-height: 34px;
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

