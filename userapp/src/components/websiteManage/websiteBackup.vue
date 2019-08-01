<template>
  <el-container class="member-container">
    <el-aside style="width:120px">
      <page-submenu :submenu-list="submenuList">
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <ChangeSite @chooseWebsite="chooseWebsite" />
      <el-row style="padding:24px 17px">
        <el-row class="user-list">
          <span class="member-list-title fs14">网站备份</span>
        </el-row>
        <el-tabs v-model="backupType" type="card" @tab-click="handleClick">
          <el-tab-pane label="手动备份" name="manual"></el-tab-pane>
          <el-tab-pane label="自动备份" name="auto"></el-tab-pane>
        </el-tabs>
        <button class="backupBtn" @click="backup" v-show="showBackup">备份当前版本</button>
        <el-main>
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
                    <span slot="reference" >
                        <div @mouseenter="_handleShowEditorIcon(scope.row.id)" @mouseleave="_handleHideEditorIcon(scope.row.id)">
                            <div class="remark-desc">{{scope.row.description}}</div>
                            <svg-icon v-if="active == scope.row.id" icon-class="remark" class="remark" :data-type="'remarkIcon'+ scope.$index" :ref="'remarkIcon'+ scope.$index" ></svg-icon>
                        </div>
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
                        <button
                          class="popover-btn save"
                          @click="saveInputValue(scope.$index,scope.row)"
                        >保存</button>
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
          <div class="backupTip">
            <div style="margin-bottom:10px">1、系统将在您更换网站模版与还原备份包时自动备份当前站点设计</div>
            <div>2、手动与自动备份包最多可分别保留20个，自动备份包数量已满时，最早的自动备份包会被删除</div>
          </div>
          <el-dialog
            width="0"
            :visible.sync="backupShow"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <div class="right-pannel" :style="{width:'470px'}">
              <div class="pannel-head">
                <span>
                  <span>备份当前版本</span>
                </span>
                <span class="close-pannel" @click="closeDialog">X</span>
              </div>
              <div class="tips">温馨提示：备份当前站点设计页面，包括电脑版、手机版和Pad版</div>
              <div class="remark">
                <span class="remarkTitle">备注</span>
                <el-input
                  type="textarea"
                  :rows="6"
                  v-model="remarkInfo"
                  placeholder="请输入备注信息（非必填）"
                  maxlength="30"
                  class="remarkInput"
                  show-word-limit
                  :style="{width: '440px'}"
                ></el-input>
              </div>
              <div class="confirm">
                <button class="confirmBtn" @click="backupSite">确定</button>
              </div>
            </div>
          </el-dialog>
          <el-dialog width="0" :visible.sync="backuping" :show-close="false">
            <div class="circleprogress" :style="{width:'270px'}">
              <div class="circleWrap">
                <div class="circle">
                  <div class="circleBox"></div>
                </div>
                <div class="hideCircle"></div>
              </div>
              <span class="backuping">正在还原网站</span>
            </div>
          </el-dialog>
        </el-main>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import RightPannel from "../RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import { sendTargetPhoneCode } from "@/api/index.js";
import { formatDateTime } from "@/api/index";
import * as siteBackupApi from "@/api/request/siteBackupApi";
export default {
  components: {
    RightPannel,
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      submenuList: [
        { name: "网站备份", url: "/website/backup" },
        { name: "我的网站", url: "/website/mysite" },
        { name: "公司信息", url: "/website/companyinfo" },
        { name: "域名管理", url: "/website/sitedomain" },
        { name: "邮件服务器", url: "/website/email" }
      ],
      active: -1,
      showBackup: true,
      siteName: "",
      siteId: 0,
      remarkValue: "",
      siteInfo: [],
      manualSite: [],
      autoSite: [],
      backupType: "manual",
      backupShow: false,
      backuping: false,
      // recovery: false,
      remarkInfo: ""
    };
  },
  mounted() {
    this.getSiteInfo();
    this.getBackupSite();
  },
  methods: {
      chooseWebsite(siteId){
          this.getBackupSite()
      },
    /**
     * 获取站点信息
     */
    async getSiteInfo() {
      let { data } = await siteBackupApi.getSiteInfo(2);
      console.log(data);
      this.siteName = data.siteName;
      this.siteId = data.id;
    },
    /**
     * 切换手动备份和自动备份
     */
    handleClick() {
      if (this.backupType === "manual") {
        this.siteInfo = this.manualSite;
        this.showBackup = true;
      } else if (this.backupType === "auto") {
        this.siteInfo = this.autoSite;
        this.showBackup = false;
      }
    },
    /**
     * 获取备份信息
     */
    async getBackupSite() {
      let manualData = await siteBackupApi.getBackupSite(2, false);
      this.manualSite = manualData.data.items;
      let autoData = await siteBackupApi.getBackupSite(2, true);
      this.autoSite = autoData.data.items;
      if (this.backupType === "manual") {
        this.siteInfo = this.manualSite;
      } else if (this.backupType === "auto") {
        this.siteInfo = this.autoSite;
      }
      for (var i = 0; i < this.manualSite.length; i++) {
        this.manualSite[i].backupTime = formatDateTime(
          this.manualSite[i].backupTime,
          "yyyy-MM-dd hh:mm:ss"
        );
        this.manualSite[i].dataSize =
          this.manualSite[i].dataSize.toFixed(5) + "M";
      }
      for (var i = 0; i < this.autoSite.length; i++) {
        this.autoSite[i].backupTime = formatDateTime(
          this.autoSite[i].backupTime,
          "yyyy-MM-dd hh:mm:ss"
        );
        this.autoSite[i].dataSize = this.autoSite[i].dataSize.toFixed(5) + "M";
      }

      console.log(this.siteInfo);
    },
    /**
     * 还原站点
     */
    async recovery(scope) {
      let message = [];
      message.push(
        this.$createElement("p", null, "确定要将网站还原至该备份版本吗？")
      );
      message.push(
        this.$createElement(
          "p",
          null,
          "还原后系统会自动备份当前站点设计，可在自动备份列表中查看。"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        message: this.$createElement(
          "div",
          {
            style:
              "font-size:14px;font-family:PingFangSC-Regular;font-weight:400;color:rgba(38,38,38,1);"
          },
          message
        ),
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "messageBoxClass",
        type: "warning",
        callback: async action => {
          console.log(action);
          if (action === "confirm") {
            this.backuping = true;
            await siteBackupApi
              .recoverySite(
                scope.row.siteId,
                scope.row.siteName,
                scope.row.fileName
              )
              .then(res => {
                console.log(res.status);
                if (res.status === 200) {
                  this.$message({
                    type: "success",
                    message: "网站还原成功"
                  });
                  this.getBackupSite();
                  this.backuping = false;
                } else {
                  this.$message({
                    type: "error",
                    message: "系统正忙，请稍后再试！"
                  });
                  this.backuping = false;
                }
              });
          }
        }
      });
    },
    /**
     * 备份当前版本
     */
    async backup() {
      if (this.manualSite.length < 20) {
        let { status } = await siteBackupApi.getBackupCount(2);
        if (status == 200) {
          this.remarkInfo = "";
          this.backupShow = true;
        } else {
          this.$message({
            type: "error",
            message: "系统正忙，请稍后再试！"
          });
        }
      } else {
        this.$confirm(`最多保留20个手动备份包，请删除后再备份!`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      }
    },
    async backupSite() {
      let { status } = await siteBackupApi.backupSite(
        this.siteName,
        this.siteId,
        this.remarkInfo
      );
      if (status == 200) {
        this.$message({
          type: "success",
          message: "备份成功"
        });
        this.getBackupSite();
      } else {
        this.$message({
          type: "error",
          message: "备份失败，请稍后再试！"
        });
      }
      this.backupShow = false;
    },
    /**
     * 下载备份
     */
    async downloadBackup(scope) {
      this.$confirm(`确定下载该备份包？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async action => {
          console.log(action);
          if (action === "confirm") {
            var res = await siteBackupApi.exportBackup(
              scope.row.siteName,
              scope.row.siteId,
              scope.row.fileName
            );
            console.log(res);
            var a = document.createElement("a");
            var binaryData = [];
            binaryData.push(res.data);
            a.href = window.URL.createObjectURL(
              new Blob(binaryData, { type: "application/dat" })
            );
            var names = scope.row.fileName.split("_");
            var filename = scope.row.siteName + "_" + names[1] + "_" + names[2];
            a.download = filename; // Set the file name.
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      });
    },
    /**
     * 删除备份
     */
    async deleteBackup(scope) {
      this.$confirm(`备份包删除后不可恢复，确定要删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async action => {
          console.log(action);
          if (action === "confirm") {
            let { status } = await siteBackupApi.deleteBackup(
              scope.row.id,
              scope.row.fileName,
              scope.row.siteId
            );
            console.log(status);
            if (status === 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getBackupSite();
            } else {
              this.$message({
                type: "error",
                message: "系统正忙，请稍后再试！"
              });
            }
          }
        }
      });
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.backupShow = false;
    },
    /**
     * 修改备注
     */
    showRemark(row) {
      this.remarkValue = row.description ? row.description : "";
    },
    cancelInput(id) {
      this.$refs[`popover-${id}`].doClose();
      this.remarkValue = "";
    },
    async saveInputValue(index, row) {
      this.$refs[`popover-${index}`].doClose();
      await siteBackupApi.updateDescription(row.id, this.remarkValue);
      this.getBackupSite();
      // this.siteInfo[index].description = this.remarkValue
      // this.$set(this.siteInfo[index], "description", this.remarkValue)
    },
    _handleShowEditorIcon(id) {
        this.active = id;
    },
    _handleHideEditorIcon(id) {
        this.active = -1;
    }
  }
};
</script>
<style>
.messageBoxClass {
  width: 500px;
}
</style>

<style scoped>
.el-dialog {
  right: 0;
}
.el-tabs {
  margin-top: 24px;
}
.el-tabs /deep/ .el-tabs__item {
  width: 88px;
  height: 38px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  border-bottom: 1px solid #e4e7ed;
  background: rgba(245, 245, 245, 1);
  vertical-align: top;
  border-top: 2px solid transparent;
}
.el-tabs /deep/ .is-active {
  color: rgba(1, 192, 222, 1);
  border-top: 2px solid rgb(72, 201, 226);
  border-bottom: 1px solid transparent;
  background: rgb(255, 255, 255);
}
.backupBtn {
  width: 110px;
  height: 32px;
  background: rgba(0, 193, 222, 1);
  position: absolute;
  right: 16px;
  top: 70px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.el-table /deep/ thead th {
  padding: 0;
  height: 35px;
  background: #00c1de !important;
  color: #fff;
  font-weight: 400;
  font-size: 12px;
}
.content-table {
  width: 100%;
  box-sizing: border-box;
}
.remark-desc {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 81%;

}
.backupTip {
  margin-top: 24px;
  margin-bottom: 32px;
  font-size: 12px;
  font-weight: 500;
  color: #262626;
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

.handle-btn-wrap {
  width: 70%;
  display: flex;
  justify-content: space-between;
  .handle-btn {
    width: 17px;
    height: 16px;
  }
  .backup-btn {
    background: url("~img/siteManage/backup.png") no-repeat center;
    background-size: 100%;
    &:hover {
      background: url("~img/siteManage/backup-on.png") no-repeat center;
      background-size: 100%;
    }
  }
  .download-btn {
    background: url("~img/siteManage/download.png") no-repeat center;
    background-size: 100%;
    &:hover {
      background: url("~img/siteManage/download-on.png") no-repeat center;
      background-size: 100%;
    }
  }
  .delete-btn {
    background: url("~img/siteManage/delete.png") no-repeat center;
    background-size: 100%;
    &:hover {
      background: url("~img/siteManage/delete-on.png") no-repeat center;
      background-size: 100%;
    }
  }
}
// 右侧弹框
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .pannel-head {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      padding: 0 10px;
    }
    .auth-title {
      margin-right: 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
  .tips {
    width: 440px;
    height: 32px;
    background: rgba(242, 255, 234, 1);
    border: 1px solid rgba(199, 221, 185, 1);
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 182, 57, 1);
    line-height: 32px;
    text-align: center;
    margin: 15px;
  }
  .remarkTitle {
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    margin-left: 15px;
  }
  .remarkInput {
    width: 470px;
    margin: 15px 15px 0 15px;
  }
  .confirm {
    position: absolute;
    width: 470px;
    height: 64px;
    bottom: 0px;
    border-top: 1px solid #efefef;
    .confirmBtn {
      margin: 16px;
      width: 58px;
      height: 32px;
      background: rgba(0, 193, 222, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
  }
}
// 修改备注
.textareaWrap {
  background: #fff;
  position: relative;
  .btn-wrap {
    text-align: right;
    padding-top: 10px;
    button {
      width: 63px;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      border: none;
    }
    .cancel {
      border: 1px solid #eeeeee;
      margin-right: 10px;
    }
    .save {
      background: #00c1de;
      color: #fff;
    }
  }
}
//网站还原中
.circleprogress {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  width: 270px;
  height: 199px;
  margin-left: -135px;
  margin-top: -100px;
  left: 50%;
  top: 50%;
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .circle {
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 50%;
    background-image: -webkit-linear-gradient(
      to top left,
      #45a9fe 0%,
      #00c1de 90%
    );
    background-image: -moz-linear-gradient(
      to top left,
      #45a9fe 0%,
      #00c1de 90%
    );
    background-image: linear-gradient(to top left, #45a9fe 0%, #00c1de 90%);
    .circleBox {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #fff;
    }
  }
  .circleWrap {
    position: absolute;
    left: 50%;
    top: 54px;
    margin-left: -28px;
    width: 56px;
    height: 56px;
    -webkit-animation: rotate 2s linear infinite;
  }
  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  .hideCircle {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 0px;
    right: 0px;
    background: #fff;
    z-index: 2500;
  }
  .backuping {
    position: absolute;
    top: 123px;
    left: 92px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
  }
}
</style>
