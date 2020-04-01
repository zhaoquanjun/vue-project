<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <el-row>
        <ChangeSite
          @chooseWebsite="chooseWebsite"
          @getSiteId="getSiteId"
          @getSiteName="getSiteName"
        />
        <el-row class="user-list">
          <span class="member-list-title fs14">网站备份</span>
          <button
            class="backupBtn cl-button cl-button--primary"
            @click="backup"
            v-show="showBackup"
          >备份当前版本</button>
        </el-row>
        <el-main>
          <div class="domain-menu">
            <el-tabs v-model="backupType" @tab-click="handleClick">
              <el-tab-pane label="手动备份" name="manual"></el-tab-pane>
              <el-tab-pane label="自动备份" name="auto"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="table-list" id="table-list">
            <el-table
              ref="multipleTable"
              :data="siteInfo"
              tooltip-effect="dark"
              class="content-table"
              :default-sort="{prop: 'backupTime', order: 'descending'}"
            >
              <template slot="empty">
                <div class="empty-table" style="cursor:default">
                  <img src="~img/memberManage/table-empty-default.png" />
                  <p>无数据</p>
                </div>
              </template>
              <el-table-column label="站点名称" show-overflow-tooltip min-width="200">
                <template slot-scope="scope">
                  <div class="overflow">{{scope.row.siteName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="backupTime" label="备份时间" min-width="200"></el-table-column>
              <!-- <el-table-column prop="dataSize" label="备份包大小" min-width="150"></el-table-column> -->
              <el-table-column label="备份人" show-overflow-tooltip min-width="200">
                <template slot-scope="scope">
                  <div class="overflow">{{scope.row.userName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="备注" show-overflow-tooltip min-width="220">
                <template slot-scope="scope">
                  <el-popover
                    :ref="`popover-${scope.$index}`"
                    placement="bottom"
                    width="317"
                    trigger="click"
                    style="padding:0;width:100%"
                    @show="showRemark(scope.row)"
                  >
                    <span slot="reference">
                      <div
                        style="height:32px;line-height:32px;width:100%"
                        @mouseenter="_handleShowEditorIcon(scope.row.id)"
                        @mouseleave="_handleHideEditorIcon(scope.row.id)"
                      >
                        <div
                          class="remark-desc"
                        >{{!scope.row.description?" ":scope.row.description}}</div>
                        <i
                          v-if="active == scope.row.id"
                          class="iconfont iconicon-dash-edit cl-iconfont"
                          :data-type="'remarkIcon'+ scope.$index"
                          :ref="'remarkIcon'+ scope.$index"
                        ></i>
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
                          class="cl-button cl-button--primary_notbg cl-button--small"
                          slot="refenrence"
                          @click="cancelInput(scope.$index)"
                        >取消</button>
                        <button
                          class="cl-button cl-button--primary cl-button--small"
                          @click="saveInputValue(scope.$index,scope.row)"
                        >保存</button>
                      </div>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                  <div class="handle-btn-wrap">
                    <el-tooltip content="还原备份包" placement="top" :disabled="disabled">
                      <button @click="recovery( scope )">
                        <i class="iconfont iconhuifu cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                    <!-- <el-tooltip content="下载备份包" placement="top" :disabled="disabled">
                      <button @click="downloadBackup( scope )">
                        <i class="iconfont iconxiazai cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip> -->
                    <el-tooltip content="删除备份包" placement="top" :disabled="disabled">
                      <button @click="deleteBackup( scope )">
                        <i class="iconfont iconshanchu cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="backupTip">
            <div>1、系统将在您更换网站模版与还原备份包时自动备份当前站点设计</div>
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
                <span>备份当前版本</span>
                <span class="close-pannel" @click="closeDialog">
                  <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
                </span>
              </div>
              <div class="tips">温馨提示：备份当前站点设计页面，包括电脑版、手机版</div>
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
                <button class="confirmBtn cl-button cl-button--primary" @click="backupSite">确定</button>
                <button class="cl-button cl-button--primary_notbg" @click="closeDialog">取消</button>
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
import RightPannel from "_c/RightPannel";
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
      remarkInfo: "",
      disabled: false,
      _getRecoverySiteStatusTimer: null,
      count: 0
    };
  },
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
      this.getBackupSite(siteId);
    },
    // 获取siteName
    getSiteName(siteName) {
      this.siteName = siteName;
    },
    // 选择切换网站
    chooseWebsite(siteId) {
      this.siteId = siteId;
      this.getBackupSite(siteId);
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
    async getBackupSite(siteId) {
      this.$Loading.show();
      let manualData = await siteBackupApi.getBackupSite(siteId, false);
      this.manualSite = manualData.data.items;
      let autoData = await siteBackupApi.getBackupSite(siteId, true);
      this.autoSite = autoData.data.items;
      this.$Loading.hide();
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
        this.manualSite[i].dataSize = this.bytesToSize(
          this.manualSite[i].dataSize * 1024 * 1024
        );
      }
      for (var i = 0; i < this.autoSite.length; i++) {
        this.autoSite[i].backupTime = formatDateTime(
          this.autoSite[i].backupTime,
          "yyyy-MM-dd hh:mm:ss"
        );
        this.autoSite[i].dataSize = this.bytesToSize(
          this.autoSite[i].dataSize * 1024 * 1024
        );
      }
    },
    bytesToSize(bytes, flag) {
      if (bytes === 0) return "0 B";
      let k = 1024;
      let sizes = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      let b = bytes / Math.pow(k, i);
      //   if (flag === 1) {
      b = b.toFixed(2);
      //   }
      let storage = b + sizes[i];
      return storage;
    },
    /**
     * 还原站点
     */
    async recovery(scope) {
      this.disabled = true;
      let message = [];
      message.push(
        this.$createElement(
          "p",
          { style: "color: #262626" },
          "确定要将网站还原至该备份版本吗？"
        )
      );
      message.push(
        this.$createElement(
          "p",
          { style: "color: #8C8C8C;width:350px" },
          "还原后系统会自动备份当前站点设计，可在自动备份列表中查看。"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        message: this.$createElement("div", null, message),
        iconClass: "icon-warning",
        type: "warning",
        callback: async action => {
          if (action === "confirm") {
            this.backuping = true;
            await siteBackupApi
              .recoverySite(
                scope.row.siteId,
                scope.row.siteName,
                scope.row.fileName
              )
              .then(res => {
                if (res.status === 200) {
                  this._getRecoverySiteStatus(scope.row.siteId);
                } else {
                  this.$notify({
                    customClass: "notify-error",
                    message: `系统正忙，请稍后再试！`,
                    duration: 2000,
                    showClose: false
                  });
                  this.backuping = false;
                }
              });
          }
          let timer = setTimeout(() => {
            this.disabled = false;
            clearTimeout(timer);
            timer = null;
          }, 5);
        }
      });
    },

    /**
     * 获取站点还原状态信息
     */
    async _getRecoverySiteStatus(siteId) {
      this.count ++;
      let data = await siteBackupApi.getRecoverySiteStatus(siteId);
      if(this._getRecoverySiteStatusTimer) clearInterval(this._getRecoverySiteStatusTimer);
      // 每隔5s请求一次，3分钟后停止请求，提示还原失败
      if(data.status === 200 && this.count <= 36) {
        if(data.data.code === 1) {
          this.$notify({
            customClass: "notify-success",
            message: `网站还原成功`,
            duration: 2000,
            showClose: false
          });
          this.getBackupSite(this.siteId);
          this.count = 0
          this.backuping = false;
        } else if(data.data.code === -1){
          this.$notify({
            customClass: "notify-error",
            message: `网站还原失败`,
            duration: 2000,
            showClose: false
          });
          this.count = 0
          this.backuping = false;
        } else if(data.data.code === 0) {
          this._getRecoverySiteStatusTimer = setInterval(()=>{
            this._getRecoverySiteStatus(siteId)
          },5000)
        }
      }else {
        this.$notify({
          customClass: "notify-error",
          message: `网站还原失败`,
          duration: 2000,
          showClose: false
        });
        this.count = 0;
        this.backuping = false;
      }
    },

    /**
     * 备份当前版本
     */
    async backup() {
      if (this.manualSite.length < 20) {
        let { status } = await siteBackupApi.getBackupCount(this.siteId);
        if (status == 200) {
          this.remarkInfo = "";
          this.backupShow = true;
        } else {
          this.$notify({
            customClass: "notify-error",
            message: `系统正忙，请稍后再试！`,
            duration: 2000,
            showClose: false
          });
        }
      } else {
        this.$confirm(`最多保留20个手动备份包，请删除后再备份!`, "提示", {
          iconClass: "icon-warning",
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
        this.$notify({
          customClass: "notify-success",
          message: `备份成功`,
          duration: 2000,
          showClose: false
        });
        this.getBackupSite(this.siteId);
      } else {
        this.$notify({
          customClass: "notify-error",
          message: `备份失败，请稍后再试！`,
          duration: 2000,
          showClose: false
        });
      }
      this.backupShow = false;
    },
    /**
     * 下载备份
     */
    async downloadBackup(scope) {
      this.disabled = true;
      let message = [];
      message.push(
        this.$createElement(
          "p",
          { style: "color: #262626" },
          "确定下载该备份包？"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        message: this.$createElement("div", null, message),
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            var res = await siteBackupApi.exportBackup(
              scope.row.siteName,
              scope.row.siteId,
              scope.row.fileName
            );
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
          let timer = setTimeout(() => {
            this.disabled = false;
            clearTimeout(timer);
            timer = null;
          }, 5);
        }
      });
    },
    /**
     * 删除备份
     */
    async deleteBackup(scope) {
      this.disabled = true;
      let message = [];
      message.push(
        this.$createElement(
          "p",
          { style: "color: #262626" },
          "备份包删除后不可恢复，确定要删除吗？"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        message: this.$createElement("div", null, message),
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { status } = await siteBackupApi.deleteBackup(
              scope.row.id,
              scope.row.fileName,
              scope.row.siteId
            );
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `删除成功`,
                duration: 2000,
                showClose: false
              });
              this.getBackupSite(this.siteId);
            } else {
              this.$notify({
                customClass: "notify-error",
                message: `系统正忙，请稍后再试！`,
                duration: 2000,
                showClose: false
              });
            }
          }
          let timer = setTimeout(() => {
            this.disabled = false;
            clearTimeout(timer);
            timer = null;
          }, 5);
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
      this.getBackupSite(this.siteId);
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
<style lang="scss" scoped>
.el-dialog {
  right: 0;
}
.content-table /deep/ .el-tooltip .el-popover__reference {
  width: 100%;
}
.backupBtn {
  position: absolute;
  right: 16px;
  top: -9px;
}
.content-table {
  width: 100%;
  box-sizing: border-box;
}
.overflow {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.remark-desc {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 32px);
  vertical-align: text-bottom;
}
.iconicon-dash-edit {
  color: #262626;
  vertical-align: text-bottom;
  margin-left: 5px;
  &:hover {
    color: $--color-primary;
  }
}
.backupTip {
  margin-top: 16px;
  margin-bottom: 32px;
  width: 100%;
  height: 72px;
  padding: 16px;
  border: $--border-base;
  background: $--color-white;
  font-size: $--font-size-small;
  font-weight: $--font-weight-base;
  line-height: 20px;
  box-sizing: border-box;
}

.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      margin: 24px 0;
      position: relative;
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
    }
  }
}
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin-bottom: 12px;
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.domain-menu /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
}
.table-list /deep/ .el-table__empty-text{
    width: auto;
}
.handle-btn-wrap {
  width: 70%;
  display: flex;
  justify-content: space-between;
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
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      padding: 0 16px;
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
      margin-left: 16px;
      margin-top: 16px;
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
      #FFD7BA 0%,
      $--color-primary 90%
    );
    background-image: -moz-linear-gradient(
      to top left,
      #FFD7BA 0%,
      $--color-primary 90%
    );
    background-image: linear-gradient(to top left, #FFD7BA 0%, $--color-primary 90%);
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
