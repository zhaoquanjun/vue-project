<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <div style="padding: 24px 32px;">
        <el-row class="user-list">
          <span class="member-list-title fs14">Robots.txt</span>
        </el-row>
      </div>
      <el-row class="siteContent" style="padding:0 32px">
        <!-- <el-upload
          class="upload"
          drag
          :show-file-list="false"
          :action="uploadAction"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-progress="uploadFileProcess"
          :on-success="uploadSuccess"
          :before-remove="remove"
        >
          <div class="uploadIcon" v-show="!isUpload">
            <i
              class="iconfont iconicon-test3"
              style="color:#09CCEB;line-height:60px;font-size:25px"
            ></i>
          </div>
          <div class="uploadText" v-show="!isUpload">
            将Robots文件拖拽到此处或
            <span style="color:#09CCEB">点击上传</span>
          </div>
          <div class="uploadText" style="margin-top:260px" v-show="isUpload">
            拖拽替换文件或
            <span style="color:#09CCEB">点击上传</span>
          </div>
          <div class="uploadTextRemark">只支持Robots文件</div>

          <div v-show="fileList.length" class="file" v-if="isUpload">
            <div v-for="(item,index) in fileList" :key="index">
              <div class="fileImg" v-show="isUpload">
                <i class="iconfont iconshanchu fileRemove" @click="remove"></i>
              </div>
              <span>{{item.name}}</span>
              <div v-if="progressFlag">
                <el-progress :percentage="progressPercent"></el-progress>
              </div>
            </div>
          </div>
        </el-upload>-->

        <uploader
          ref="uploader"
          :options="options"
          :autoStart="false"
          @file-added="onFileAdded"
          class="uploader-example"
        >
          <uploader-unsupport></uploader-unsupport>
          <uploader-list uploadType="File" class="uploadList">
            <div class="fileImg" v-show="isUpload">
              <i class="iconfont iconshanchu fileRemove" @click="fileRemove"></i>
            </div>
            <div v-show="isUpload" class="fileName">{{file.name?file.name:"Robots.txt"}}</div>
            <div v-show="isUpload" v-if="progressFlag" class="progress">
              <el-progress :percentage="progressPercent" status="success"></el-progress>
            </div>
          </uploader-list>
          <uploader-drop>
            <uploader-btn :attrs="attrs" class="uploadIcon" v-show="!isUpload">
              <i
                class="iconfont iconicon-test3"
                style="color:#09CCEB;line-height:60px;font-size:25px"
              ></i>
            </uploader-btn>
            <span v-show="!isUpload">将Robots文件拖拽到此处或</span>
            <uploader-btn :attrs="attrs" v-show="!isUpload">点击上传</uploader-btn>
            <div class="uploadText" v-show="isUpload">
              拖拽替换文件或
              <uploader-btn style="color:#09CCEB">点击上传</uploader-btn>
            </div>
            <div class="uploadTextRemark">只支持Robots文件</div>
            <!-- <uploader-btn :directory="true">选择文件夹</uploader-btn> -->
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
          appId: this.$store.state.dashboard.appId,
          Authorization:
            "Bearer " + this.$store.state.user.accessToken.Authorization
        }
      },
      uploadAction: "",
      headers: {
        appId: "",
        Authorization: ""
      },
      attrs: {
        accept: "*/*" //'video/*'
      },
      fileList: [],
      isUpload: false,
      progressFlag: false,
      progressPercent: 0,
      file: {}
    };
  },
  methods: {
    async hasUploadFile(siteId) {
      let { data } = await robotsApi.hasUploadFile(siteId);
      this.isUpload = data.hasUpload;
    },
    async preview(siteId) {
      let { data } = await robotsApi.preview(siteId);
      console.log(data);
    },
    // resetOption() {},
    // 获取siteId
    getSiteId(siteId) {
      this.curSiteId = siteId;
      // this.options.target = `${environment.uploadRobotsUrl}${this.curSiteId}`;
      // this.uploadAction = `${environment.uploadRobotsUrl}${this.curSiteId}`;
      this.$set(
        this.options,
        "target",
        `${environment.uploadRobotsUrl}${this.curSiteId}`
      );
      this.hasUploadFile(siteId);
      this.preview(siteId);
      console.log(this.$refs);
      console.log(this.$refs.uploader);
      this.$refs.uploader.resetOption();
    },
    // 选择切换网站
    chooseWebsite(siteId) {
      this.curSiteId = siteId;
      this.$set(
        this.options,
        "target",
        `${environment.uploadRobotsUrl}${this.curSiteId}`
      );
      this.$refs.uploader.resetOption();
      this.hasUploadFile(siteId);
      this.preview(siteId);
      this.file = {};
      this.progressFlag = false
    },
    onFileAdded(file) {
      if (this.fileList.length > 0) {
        this.fileList.splice(0, 1);
      }
      this.options.headers.Authorization =
        "Bearer " + this.$store.state.user.accessToken.Authorization;
      this.options.headers.appId = this.$store.state.dashboard.appId;
      let fileType = file.name.split(".").pop();
      console.log(file);
      if (fileType != "txt") {
        this.$notify({
          customClass: "notify-error",
          message: `上传失败，请上传txt格式文件`,
          duration: 1500,
          showClose: false
        });
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
        file.cancel(file);
        return;
      }
      this.file = file;
      this.fileList.push(file);
      this.isUpload = true;
      this.progressFlag = true;
      this.progressPercent = 100;
      file.resume();
      console.log(this.fileList);
    },
    fileRemove() {
      this.$confirm(`您确定要删除当前robots文件么？删除后不可恢复。`, "提示", {
        iconClass: "icon-warning",
        callback: action => {
          console.log(action);
          if (action === "confirm") {
            robotsApi.remove(this.curSiteId).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功`,
                  duration: 2000,
                  showClose: false
                });
                console.log(this.fileList);
                this.fileList.splice(0, 1);
                console.log(this.fileList);
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
    // 上传成功
    uploadSuccess(res, file) {
      console.log(file + "success");
      console.log(this.fileList + "success");
    },
    remove() {
      this.$confirm(`您确定要删除当前robots文件么？删除后不可恢复。`, "提示", {
        iconClass: "icon-warning",
        callback: action => {
          console.log(action);
          if (action === "confirm") {
            robotsApi.remove(this.curSiteId).then(res => {
              console.log(res);
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
    beforeUpload(file) {
      console.log(file);
      this.isUpload = true;
      this.headers.Authorization =
        "Bearer " + this.$store.state.user.accessToken.Authorization;
      this.headers.appId = this.$store.state.dashboard.appId;
      this.$nextTick(() => {
        let uploadFile = document.getElementsByClassName(
          "el-upload-list__item-name"
        )[0];

        // let div = document.createElement("div");
        // div.setAttribute("class", "uploadText");
        // div.innerHTML = "拖拽替换文件或";
        // let span = document.createElement("span");
        // span.setAttribute("style", "color:#09CCEB");
        // span.innerHTML = "点击上传";
        // div.appendChild(span);
        // uploadFile.appendChild(div);
        // let uploadFileIcon = document.getElementsByClassName(
        //   "el-icon-document"
        // )[0];
      });
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
</style>
<style lang="scss" scoped>
.member-container {
  position: relative;
  .member-content {
    padding: 0px 0px 21px;
  }
  .user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    .member-list-title {
      border-left: 2px solid #01c0de;
      padding-left: 10px;
    }
  }
}
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
      margin-top: 270px;
      margin-bottom: 16px;
      width: 181px;
    }
    .uploadTextRemark {
      font-size: 16px;
      font-weight: 400;
      color: rgba(185, 203, 207, 1);
      line-height: 22px;
      margin: auto;
      width: 133px;
    }
  }
  .uploadList {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
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
      .progress {
        width: 200px;
        margin: auto;
      }
    }
  }
}
.upload {
  position: relative;
  padding: 20px;
  background: rgba(230, 249, 253, 1);
  border-radius: 2px;
  border: 1px dashed rgba(9, 204, 235, 1);
  .uploadIcon {
    margin: 142px auto 24px;
    width: 60px;
    height: 60px;
    background: rgba(9, 204, 235, 0.1);
    border-radius: 4px;
  }
  .uploadText {
    font-size: 16px;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
    line-height: 22px;
  }
  .uploadTextRemark {
    font-size: 16px;
    font-weight: 400;
    color: rgba(185, 203, 207, 1);
    line-height: 22px;
    margin-top: 16px;
  }
  .file {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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
      .progress {
        width: 200px;
        margin: auto;
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

