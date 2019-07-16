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
                        <button class="changeSite">切换站点</button>
                    </div>
                </div>
            </el-row>
            <el-tabs v-model="backupType" type="card" @tab-click="handleClick">
                <el-tab-pane label="手动备份" name="first"></el-tab-pane>
                <el-tab-pane label="自动备份" name="second"></el-tab-pane>
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
                        <el-table-column prop="appId" label="站点名称"></el-table-column>
                        <el-table-column prop="backupTime" label="备份时间"></el-table-column>
                        <el-table-column prop="dataSize" label="备份包大小"></el-table-column>
                        <el-table-column prop="userId" label="备份人"></el-table-column>
                        <el-table-column prop="description" label="备注" show-overflow-tooltip></el-table-column>

                        <el-table-column label="操作">
                            <!-- <template slot-scope="scope"> -->
                                <div class="handle-btn-wrap">
                                    <button class="handle-btn backup-btn" >
                                        <!-- @click="handleMove(scope.row)" -->
                                    </button>
                                    <button class="handle-btn download-btn" >
                                        <!-- @click="viewPic( scope.row,scope.$index)" -->
                                    </button>
                                    <button class="handle-btn delete-btn" >
                                        <!-- @click="batchRemove( scope.row)" -->
                                    </button>
                                </div>
                            <!-- </template> -->
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog
                    width="0"
                    :visible.sync = "backupShow"
                    :show-close="false"
                >
                    <!-- <right-pannel :style="{width: '470px'}">
                        <span slot="title-text">设置相关产品</span>
                    </right-pannel> -->
                    <div class="right-pannel" :style="{width:'470px'}">
                        <div class="pannel-head">
                            <span>
                                <span>设置相关产品</span>
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
            siteInfo: [],
            backupType: "first",
            backupShow: false,
            remarkInfo: ""
        }
  },
  mounted() {
      this.getBackupSite()
  },
  methods: {
        /**
         * 获取备份站点信息
         */
        async getBackupSite() {
            let { data } = await siteBackupApi.getBackupSite(2, false)
            console.log(data)
            this.siteInfo = data;
            
        },
        /**
         * 备份当前版本
         */
        async backupSite() {
            await siteBackupApi.backupSite("111")
        },
        /**
         * 切换手动备份和自动备份
         */
        handleClick() {
            console.log(123)
        },
        /**
         * 备份当前版本
         */
        backup(){
            this.backupShow = true
        },
        /**
         * 关闭弹框
         */
        closeDialog() {
            this.backupShow = false
        }
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
    background: #fff
}
.changeSite{
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
</style>
