<template>
  <el-main>
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
          <el-progress :percentage="progressPercent" style="width:150px"></el-progress>
        </div>
      </uploader-list>
      <uploader-drop>
        <uploader-btn :attrs="attrs" class="uploadIcon" v-show="!isUpload"></uploader-btn>
        <div class="uploadtip" v-show="!isUpload">将sitemap文件拖拽到此处或点击上传按钮</div>
        <div class="uploadText" v-show="isUpload">拖拽替换文件或点击上传按钮</div>
        <div class="uploadTextRemark">请上传文件名为“sitemap”的xml文件</div>
        <uploader-btn class="uploadBtn" :attrs="attrs">上传</uploader-btn>
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
<style lang="scss" scoped>
.uploader-example {
  position: relative;
  padding: 10px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  .uploader-drop {
    padding: 0;
    height: 350px;
    background: $--color-white;
    border-radius: $--border-radius-base;
    border: 1px dashed $--border-color-base;
    text-align: center;
    .uploadIcon {
      display: block;
      margin: 110px auto 0;
      width: 44px;
      height: 32px;
      padding: 0;
      border: none;
      background: url("~img/upload/uploadfile.png") no-repeat center;
      background-size: cover;
    }
    .uploadBtn {
      width: 72px;
      height: 32px;
      line-height: 32px;
      margin-top: 12px;
      padding: 0;
      background: $--color-primary;
      border-radius: $--border-radius-base;
      color: $--color-white;
      background-color: $--button-primary-background-color;
      border-color: $--button-primary-background-color;
      &:hover {
        background-color: $--button-hover-primary-background-color;
      }
    }
    .uploadtip {
      width: 230px;
      font-size: $--font-size-small;
      color: $--color-primary;
      font-weight: $--font-weight-base;
      margin: auto;
      margin-top: 12px;
    }
    .uploadText {
      font-size: $--font-size-small;
      color: $--color-primary;
      font-weight: $--font-weight-base;
      margin: auto;
      margin-top: 190px;
      width: 184px;
    }
    .uploadTextRemark {
      font-size: $--font-size-small;
      color: #a1a8b1;
      font-weight: $--font-weight-base;
      margin: auto;
      margin-top: 8px;
      width: 200px;
    }
  }
  .uploader-dragover {
    border: 1px dashed $--color-primary !important;
    background: $--color-white !important;
    .uploadIcon {
      display: block;
      margin: 110px auto 0;
      width: 44px;
      height: 32px;
      padding: 0;
      border: none;
      background: url("~img/upload/uploadfileHover.png") no-repeat center;
      background-size: cover;
    }
  }
  .uploadList {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40px;
    transform: translate(-50%, -50%);
    z-index: 1;
    text-align: center;
    .fileName {
      font-size: $--font-size-small;
      color: #a1a8b1;
      font-weight: $--font-weight-base;
      margin-top: 8px;
    }
    .fileImg {
      margin: auto;
      width: 44px;
      height: 56px;
      background: url("~img/upload/upload.png") no-repeat center;
      background-size: cover;
      text-align: center;
      &:hover {
        .fileRemove {
          display: inline-block;
        }
      }
      .fileRemove {
        margin-top: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(38, 43, 65, 0.8);
        display: none;
        &:hover {
          opacity: 0.7;
          cursor: pointer;
        }
        .iconshanchu {
          color: #fff;
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
  }
}
.tip {
  display: inline-block;
  position: absolute;
  margin-top: 32px;
  font-size: $--font-size-base;
  font-weight: $--font-weight-primary;
  color: $--color-primary;
  cursor: pointer;
}
</style>

