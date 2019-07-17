<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">网站备份</span>
            </el-row>
            <el-row>
                <div class="siteBox">
                    <div class="siteInfo">
                        <div class="siteImg"></div>
                        <!-- <img :src="siteInfoImg" alt="" class="siteImg"> -->
                        <span class="siteName">{{siteName}}</span>
                        <span class="secondDomain">{{secondDomain}}</span>
                        <button class="changeSite">切换站点</button>
                    </div>
                </div>
            </el-row>
            <el-tabs v-model="backupType" type="card" @tab-click="handleClick">
                <el-tab-pane label="手动备份" name="manual"></el-tab-pane>
                <el-tab-pane label="自动备份" name="auto"></el-tab-pane>
            </el-tabs>
            <button class="backupBtn" @click="backup">备份当前版本</button>
            <el-main>
                <div class="table-wrap" id="table-list">
                    <el-table
                        ref="multipleTable"
                        :data="siteInfo"
                        tooltip-effect="dark"
                        class="content-table"
                    >
                        <el-table-column prop="siteName" label="站点名称"></el-table-column>
                        <el-table-column prop="backupTime" label="备份时间"></el-table-column>
                        <el-table-column prop="dataSize" label="备份包大小"></el-table-column>
                        <el-table-column prop="userName" label="备份人"></el-table-column>
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
                                    <span slot="reference">
                                        <div class="remark-desc">{{scope.row.description}}</div>
                                        <svg-icon icon-class="remark"></svg-icon>
                                    </span>
                                    <div class="textareaWrap">
                                        <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 3, maxRows: 3}"
                                            placeholder="请输入内容"
                                            v-model="remarkValue"
                                            maxlength="100"
                                            show-word-limit
                                            resize="none"
                                        ></el-input>
                                        <div class="btn-wrap">
                                            <button
                                                class="popover-btn cancel"
                                                slot="refenrence"
                                                type="primary"
                                                @click="cancelInput(scope.$index)"
                                            >取消</button>
                                            <button class="popover-btn save" @click="saveInputValue(scope.$index,scope.row)">保存</button>
                                        </div>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div class="handle-btn-wrap">
                                    <button class="handle-btn backup-btn" @click="recovery( scope )"></button>
                                    <button class="handle-btn download-btn" @click="downloadBackup( scope )"></button>
                                    <button class="handle-btn delete-btn" @click="deleteBackup( scope )"></button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog
                    width="0"
                    :visible.sync = "backupShow"
                    :show-close="false"
                >
                    <div class="right-pannel" :style="{width:'470px'}">
                        <div class="pannel-head">
                            <span>
                                <span>备份当前版本</span>
                                <el-tooltip
                                    class="item"
                                    effect="light"
                                    content="可批量为多个成员增加权限，该操作不会删除"
                                    placement="bottom-end"
                                >
                                </el-tooltip>
                            </span>
                            <span class="close-pannel" @click="closeDialog">X</span>
                        </div>
                        <div class="tips">
                            温馨提示：备份当前站点设计页面，包括电脑版、手机版和Pad版
                        </div>
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
                            >
                            </el-input>
                        </div>
                        <div class="confirm">
                            <button class="confirmBtn" @click="backupSite">确定</button>
                        </div>
                    </div>
                </el-dialog>
            </el-main>
        </el-main>

    </el-container>
</template>

<script>
import RightPannel from "../RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import { sendTargetPhoneCode } from '@/api/index.js';
import * as siteBackupApi from "@/api/request/siteBackupApi";
export default {
  components:{
        RightPannel,
        PageSubmenu,
  },
  data() {
        return {
            submenuList: [
                { name: "网站备份", url: "/website/backup" },
                { name: "我的网站", url: "/website/mysite" },
                { name: "公司信息", url: "/website/companyinfo" },
                { name: "域名管理", url: "/website/sitedomain" }
            ],
            siteInfoImg: "",
            siteName: "",
            siteId: 0,
            secondDomain: "",
            remarkValue: "",
            siteInfo: [],
            manualSite: [],
            autoSite: [],
            backupType: "manual",
            backupShow: false,
            // recovery: false,
            remarkInfo: ""
        }
  },
  mounted() {
      this.getSiteInfo()
      this.getBackupSite()
  },
  methods: {
        /**
         * 获取站点信息
         */
        async getSiteInfo() {
            let { data } = await siteBackupApi.getSiteInfo(2);
            console.log(data)
            this.siteInfoImg = data.siteImage;
            this.siteName = data.siteName;
            this.secondDomain = data.secondDomain;
            this.siteId = data.id
        },
        /**
         * 切换手动备份和自动备份
         */
        handleClick() {
            if (this.backupType === "manual") {
                this.siteInfo = this.manualSite;
            } else if (this.backupType === "auto") {
                this.siteInfo = this.autoSite;
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
            console.log(this.siteInfo)
        },
        /**
         * 还原站点
         */
        async recovery(scope) {
            console.log(scope)
            // await siteBackupApi.recoverySite()
            this.$confirm(
                "确定要将网站还原至该备份版本吗？\n还原后系统会自动备份当前站点设计，可在自动备份列表中查看。",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let { status } = await siteBackupApi.recoverySite(scope.row.siteId, scope.row.siteName, scope.row.fileName)
                            console.log(status);
                            console.log(status === 200);
                            if (status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "网站还原成功"
                                });
                                this.getBackupSite()
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "系统正忙，请稍后再试！"
                                })
                            }
                        } 
                    }
                }
            );
        },
        /**
         * 备份当前版本
         */
        async backup(){
            let { status } = await siteBackupApi.getBackupCount(2)
            if (status == 200) {
                this.backupShow = true
            }else{
                this.$message({
                    type: "error",
                    message: "系统正忙，请稍后再试！"
                })
            }
        },
        async backupSite() {
            await siteBackupApi.backupSite(this.siteName, this.siteId, "备注").then(() => {
                this.backupShow = false;
            })
        },
        /**
         * 下载备份
         */
        async downloadBackup(scope) {
            this.$confirm(
                `确定下载该备份包`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            // await siteBackupApi.exportBackup(scope.row.siteName, scope.row.siteId, scope.row.fileName)
                            // window.open(`http://api.designer.console.wezhan.cn/api/v1/backup/exportbackup?siteName=${scope.row.siteName}&siteId=${scope.row.siteId}&backupName=${scope.row.fileName}`)
                            var eleLink = document.createElement('a');
                            eleLink.download = "filename";
                            eleLink.style.display = 'none';
                            // 字符内容转变成blob地址
                            var blob = new Blob(`http://api.designer.console.wezhan.cn/api/v1/backup/exportbackup?siteName=${scope.row.siteName}&siteId=${scope.row.siteId}&backupName=${scope.row.fileName}`);
                            eleLink.href = URL.createObjectURL(blob);
                            // 触发点击
                            document.body.appendChild(eleLink);
                            eleLink.click();
                            // 然后移除
                            document.body.removeChild(eleLink);
                            // console.log(status === 200);
                            // if (status === 200) {
                                
                            // } else {
                            //     this.$message({
                            //         type: "error",
                            //         message: "系统正忙，请稍后再试！"
                            //     })
                            // }
                        } 
                    }
                }
            );
        },
        /**
         * 删除备份
         */
        async deleteBackup(scope){
            this.$confirm(
                `备份包删除后不可恢复，确定要删除吗？`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let { status } = await siteBackupApi.deleteBackup(scope.row.id, scope.row.fileName, scope.row.siteId)
                            console.log(status);
                            if (status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                                this.getBackupSite()
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "系统正忙，请稍后再试！"
                                })
                            }
                        } 
                    }
                }
            );
        },
        /**
         * 关闭弹框
         */
        closeDialog() {
            this.backupShow = false
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
            await siteBackupApi.updateDescription(row.id, this.remarkValue)
            this.siteInfo[index].description = this.remarkValue
        },
  },
}
</script>

<style scoped>
.el-dialog{
    right: 0
}
.siteBox{
    height: 116px;
    margin-top: 12px;
    background: rgba(245,246,250,1);
    padding-top: 11px;
    padding-bottom: 11px;
    padding-left: 9px
}
.siteBox .siteInfo{
    width: 473px;
    height: 116px;
    background: #fff;
    position: relative;
}
.siteImg{
    display: inline-block;
    width: 200px;
    height: 115px;
    margin-right: 24px;
    vertical-align: top;
}
.siteName{
    position: absolute;
    top: 12px;
    display: inline-block;
    font-size:16px;
    font-weight:400;
    color:rgba(38,38,38,1);
}
.secondDomain{
    position: absolute;
    top: 40px;
    display: inline-block;
    font-size:14px;
    font-weight:400;
    color:rgba(38,38,38,1);
    line-height:20px;
}
.changeSite{
    position: absolute;
    top: 71px;
    width:80px;
    height:32px;
    background:rgba(0,193,222,1);
    font-size:12px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:32px;
}
.el-tabs{
    margin-top: 24px
}
.el-tabs /deep/ .el-tabs__item{
    width: 88px;
    height: 38px;
    font-size: 12px;
    font-weight: 400;
    color:rgba(51,51,51,1);
    line-height: 36px;
    border-bottom: 1px solid #E4E7ED;
    background:rgba(245,245,245,1);
    vertical-align: top;
    border-top: 2px solid transparent;
}
.el-tabs /deep/ .is-active{
    color:rgba(1,192,222,1);
    border-top: 2px solid rgb(72,201,226);
    border-bottom: 1px solid transparent;
    background: rgb(255, 255, 255)
}
.backupBtn{
    width: 110px;
    height: 32px;
    background:rgba(0,193,222,1);
    position: absolute;
    right: 16px;
    top: 217px;
    font-size:12px;
    font-weight:400;
    color:rgba(255,255,255,1);
}
.el-table /deep/ thead  th {
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
.remark-desc{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 81%;
}   
</style>

<style lang="scss" scoped>
.member-container {
    position: relative;
    .member-content {
        padding: 21px 14px;
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
    overflow:hidden;
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
    .tips{
        width: 440px;
        height: 32px;
        background:rgba(242,255,234,1);
        border:1px solid rgba(199,221,185,1);
        font-size:12px;
        font-weight:500;
        color:rgba(0,182,57,1);
        line-height: 32px;
        text-align: center;
        margin: 15px;
    }
    .remarkTitle{
        font-size:14px;
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-left: 15px;
    }
    .remarkInput{
        width: 470px;
        margin: 15px 15px 0 15px;
    }
    .confirm{
        position: absolute;
        width: 470px;
        height: 64px;
        bottom: 0px;
        border-top: 1px solid #EFEFEF;
        .confirmBtn{
            margin: 16px;
            width:58px;
            height:32px;
            background:rgba(0,193,222,1);
            font-size:12px;
            font-weight:400;
            color:rgba(255,255,255,1);
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
</style>
