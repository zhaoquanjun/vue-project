<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="user-list">
        <span class="member-list-title fs14">Robots.txt</span>
      </el-row>
      <el-row>
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
          <uploader-drop>
            <div>
              <uploader-btn :attrs="attrs" class="uploadIcon" v-show="!isUpload"></uploader-btn>
              <div class="fileImg" v-show="isUpload">
                <div class="fileRemove" @click="fileRemove">
                  <i class="iconfont iconshanchu"></i>
                </div>
              </div>
              <div v-show="isUpload" class="fileName">robots.txt</div>
              <div v-show="isUpload" class="fileName" style="margin-top:5px">{{date?date:""}}</div>
              <div v-show="isUpload" v-if="progressFlag" class="progress">
                <el-progress :percentage="progressPercent" style="width:150px;margin:auto"></el-progress>
              </div>
              <div class="uploadtip" v-show="!isUpload">将Robots文件拖拽到此处或点击上传按钮</div>
              <div class="uploadtip" v-show="isUpload">拖拽替换文件或点击上传按钮</div>
              <div class="uploadTextRemark">请上传文件名为“robots”的txt文件</div>
              <uploader-btn class="uploadBtn" :attrs="attrs">上传</uploader-btn>
            </div>
          </uploader-drop>
        </uploader>
        <div class="tip">Robots文件写法？</div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import environment from "@/environment/index.js";
import * as robotsApi from "@/api/request/robotsApi";
import securityService from "@/services/authentication/securityService";
import { formatDateTime } from "@/api/index";

export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      curSiteId: "",
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
    async hasUploadFile(siteId) {
      let { data } = await robotsApi.hasUploadFile(siteId);
      this.isUpload = data.hasUpload;
      this.date = formatDateTime(data.createTime, "yyyy-MM-dd");
    },
    async preview(siteId) {
      let { data } = await robotsApi.preview(siteId);
    },
    // 获取siteId
    async getSiteId(siteId) {
      this.curSiteId = siteId;
      this.hasUploadFile(siteId);
      this.$set(
        this.options,
        "target",
        `${environment.uploadRobotsUrl}${this.curSiteId}`
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
    // 选择切换网站
    async chooseWebsite(siteId) {
      this.curSiteId = siteId;
      this.$set(
        this.options,
        "target",
        `${environment.uploadRobotsUrl}${this.curSiteId}`
      );
      if (this.$store.state.dashboard.appId) {
        this.options.headers.appId = this.$store.state.dashboard.appId;
      }
      let data = await securityService.getUser();
      if (data && data.access_token) {
        this.options.headers.Authorization = "Bearer " + data.access_token;
      }
      this.$refs.uploader.resetOption();
      this.hasUploadFile(siteId);
      this.file = {};
      this.progressFlag = false;
    },
    onFileAdded(file) {
      if (file.name != "robots.txt") {
        this.$notify({
          customClass: "notify-error",
          message: `请上传文件名为“robots”的txt文件`,
          duration: 1500,
          showClose: false
        });
        file.pause(file);
        file.cancel(file);
        return;
      }
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
          clearInterval(timer); // 清除定时器
          timer = null;
          this.$notify({
            customClass: "notify-success",
            message: `上传成功`,
            duration: 1500,
            showClose: false
          });
          this.date = this.getNowFormatDate();
          this.progressFlag = false;
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
      this.$confirm(`您确定要删除当前robots文件吗？删除后不可恢复。`, "提示", {
        iconClass: "icon-warning",
        callback: action => {
          if (action === "confirm") {
            robotsApi.remove(this.curSiteId).then(res => {
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
.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      margin: 24px 0;
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
    }
  }
}
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    text-align: center;
    .uploadIcon {
      display: block;
      margin: auto;
      width: 44px;
      height: 32px;
      padding: 0;
      border: none;
      background: url("~img/upload/uploadfile.png") no-repeat center;
      background-size: cover;
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
    .fileName {
      font-size: $--font-size-small;
      color: #a1a8b1;
      font-weight: $--font-weight-base;
      margin-top: 8px;
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
      font-size: $--font-size-small;
      color: $--color-primary;
      font-weight: $--font-weight-base;
      margin-top: 8px;
    }
    .uploadTextRemark {
      font-size: $--font-size-small;
      color: #a1a8b1;
      font-weight: $--font-weight-base;
      margin-top: 8px;
    }
  }
  .uploader-dragover {
    border: 1px dashed $--color-primary !important;
    background: $--color-white !important;
    .uploadIcon {
      display: block;
      margin: auto;
      width: 44px;
      height: 32px;
      padding: 0;
      border: none;
      background: url("~img/upload/uploadfileHover.png") no-repeat center;
      background-size: cover;
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

