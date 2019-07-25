<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">网站管理</span>
            </el-row>
            <el-row>
                <SiteInfo />
            </el-row>
            <DomainMenu @handleBtn="righPanelShow" />
            <button @click="_oneKeyEnableHttps">开启https</button>
            <button @click="_resolveCdnByAliYunToken">解析cdn</button>
            <el-button @click="_pauseCdn">暂停cdn加速</el-button>
            <el-button @click="_reopenCdn">打开cdn加速</el-button>
            <el-button @click="_removeAliYunToken">删除阿里云token</el-button>
            <el-button @click="_disableHttps">禁用https</el-button>
            <el-button @click="_deleteCdnDomain">删除</el-button>
            <el-main>
                <DomainList
                    :tableData="domainListData"
                    @_deleteCdnDomain="_deleteCdnDomain"
                    @oneKeyEnableHttps="_oneKeyEnableHttps"
                    @disableHttps="_disableHttps"
                ></DomainList>
            </el-main>
        </el-main>
        <el-dialog width="0" :visible.sync="backupShow" :show-close="false">
            <div class="right-pannel" :style="{width:'470px'}">
                <div class="pannel-head">
                    <span>
                        <span>备份当前版本</span>
                        <el-tooltip
                            class="item"
                            effect="light"
                            content="可批量为多个成员增加权限，该操作不会删除"
                            placement="bottom-end"
                        ></el-tooltip>
                    </span>
                    <span class="close-pannel" @click="closeDialog">X</span>
                </div>
                <div class="tips">温馨提示：备份当前站点设计页面，包括电脑版、手机版和Pad版</div>
                <div class="remark">
                    <span class="remarkTitle">备注</span>
                    <el-input
                        v-model="remarkInfo"
                        placeholder="请输入备注信息（非必填）"
                        maxlength="30"
                        class="remarkInput"
                        show-word-limit
                        :style="{width: '440px'}"
                    ></el-input>
                </div>
                <div class="pannel-footer">
                    <button class="footer-btn confirmBtn" @click="handleConfirm">确定</button>
                    <button class="footer-btn cancel" @click="handleCancel">取消</button>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import RightPannel from "../RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import SiteInfo from "_c/websiteManage/domain/site-info.vue";
import DomainMenu from "_c/websiteManage/domain/domain-menu.vue";
import DomainList from "_c/websiteManage/domain/domain-list.vue";
import { sendTargetPhoneCode } from "@/api/index.js";
import { formatDateTime } from "@/api/index";
import * as domainApi from "@/api/request/domainApi";
import { getSiteInfo } from "@/api/request/siteBackupApi";
export default {
    components: {
        RightPannel,
        PageSubmenu,
        SiteInfo,
        DomainMenu,
        DomainList
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
            siteInfoImg: "",
            siteName: "",
            siteId: 0,
            secondDomain: "",
            remarkValue: "",
            siteInfo: [],
            manualSite: [],
            autoSite: [],

            backupShow: false,
            backuping: false,
            // recovery: false,
            remarkInfo: "",
            /////////////
            domainListData: []
        };
    },
    mounted() {
        this._getCdnDomainList();
        this.getSiteInfo();
    },
    methods: {
        /**
         * 获取站点信息
         */
        async getSiteInfo() {
            let { data } = await getSiteInfo(2);
            console.log(data);
            this.siteInfoImg = data.siteImage;
            this.siteName = data.siteName;
            this.secondDomain = data.secondDomain;
            this.siteId = data.id;
        },
        /**
         * 获取域名列表
         */
        async _getCdnDomainList() {
            let { data } = await domainApi.getCdnDomainList();
            this.domainListData = data;
            console.log(data);
        },
        async handleConfirm() {
            let data = await domainApi.bindDomainAndEnableCdn({
                domain: "xxx.net"
            });
            console.log(data,'000-------')
        },
        /**
         * 解析域名
         */
        async _resolveCdnByAliYunToken() {
            let params = {
                siteId: 2,
                resolveType: "CNAME",
                domain: "xatest.clouddream.net",
                resolveValue: "xatest.clouddream.net.m.alikunlun.com",
                isForceUpdate: false
            };
            let data = await domainApi.resolveCdnByAliYunToken(params);
        },
        /**
         * 开启https
         */
        async _oneKeyEnableHttps(domainId) {
            alert(domainId);
            let data = await domainApi.oneKeyEnableHttps(domainId);
        },
        /**
         * 关闭https
         */
        async _disableHttps(domainId) {
            let data = await domainApi.disableHttps(domainId);
            console.log(data);
        },

        async _pauseCdn() {
            let data = await domainApi.pauseCdn(4);
            console.log(data);
        },
        async _reopenCdn() {
            let data = await domainApi.reopenCdn(4);
            console.log(data);
        },
        async _removeAliYunToken() {
            let data = await domainApi.removeAliYunToken();
            console.log(data);
        },

        /**
         * 删除当前域名
         */
        async _deleteCdnDomain(domainId, index) {
            this.$confirm("提示", {
                message:
                    "确定删除该域名?域名删除后, 您将无法访问该网站.强烈建议您在删除前修改该域名的cname解析. ",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                callback: async action => {
                    if (action === "confirm") {
                        let { data, status } = await domainApi.deleteCdnDomain(
                            domainId
                        );
                        if (status === 200) {
                            this.domainListData.splice(index, 1);
                        }
                    }
                }
            });
        },
        righPanelShow() {
            this.backupShow = true;
        },
        /**
         * 关闭弹框
         */
        handleCancel() {
            this.backupShow = false;
        },
        closeDialog() {
            this.backupShow = false;
        }
    }
};
</script>

<style scoped>
.el-dialog {
    right: 0;
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
