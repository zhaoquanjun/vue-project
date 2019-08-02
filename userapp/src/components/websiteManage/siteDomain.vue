<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">域名管理</span>
            </el-row>
            <el-row>
                <SiteInfo :site-info="siteInfo" />
            </el-row>
            <DomainMenu @handleBtn="righPanelShow" />
            <el-main>
                <DomainList
                    :tableData="domainListData"
                    @_deleteCdnDomain="_deleteCdnDomain"
                    @oneKeyEnableHttps="_oneKeyEnableHttps"
                    @disableHttps="_disableHttps"
                    @resolveCdnByAliYunToken="_resolveCdnByAliYunToken"
                    @reopenCdn="_reopenCdn"
                    @pauseCdn="_pauseCdn"
                    @getCdnDomainList="_getCdnDomainList"
                ></DomainList>
            </el-main>
        </el-main>
        <el-dialog
            width="0"
            :visible.sync="backupShow"
            :show-close="false"
            :close-on-click-modal="false"
        >
            <BindDomain
                :domain-amount="domainAmount"
                @closeDialog="closeDialog"
                @getCdnDomainList="_getCdnDomainList"
                @resolveCdnByAliYunToken="_resolveCdnByAliYunToken"
            ></BindDomain>
        </el-dialog>
    </el-container>
</template>

<script>
import RightPannel from "_c/RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import SiteInfo from "_c/websiteManage/domain/site-info.vue";
import DomainMenu from "_c/websiteManage/domain/domain-menu.vue";
import DomainList from "_c/websiteManage/domain/domain-list.vue";
import BindDomain from "_c/websiteManage/domain/bind-domain.vue";
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
        DomainList,
        BindDomain
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
            domainListData: [], // table列表
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
            domainAmount: 0,
            siteInfo: {},
            resolveDomainData:""
        };
    },
    created() {
        window.callback = function() {
            console.log("重新打开窗口");
        };
    },
    mounted() {
        this._getCdnDomainList();
        this.getSiteInfo();
    },
    methods: {
        async _removeAliYunToken() {
            await domainApi.removeAliYunToken();
        },
        /**
         * 获取站点信息
         */
        async getSiteInfo() {
            let { data } = await getSiteInfo(2);
            console.log(data, "000000");
            this.siteInfo = data;
            // this.siteInfoImg = data.siteImage;
            // this.siteName = data.siteName;
            // this.secondDomain = data.secondDomain;
            // this.siteId = data.id;
        },
        /**
         * 获取域名列表
         */
        async _getCdnDomainList() {
            let { data } = await domainApi.getCdnDomainList();
            this.domainListData = data;
            console.log(
                this.domainListData,
                "this.domainListDatathis.domainListData"
            );
            this.domainAmount = data.length;
        },

        /**
         * 解析域名
         */
        async _resolveCdnByAliYunToken(opt) {
            this.resolveDomainData = opt;
            let params = {
                id: opt.id,
                siteId: this.$store.state.dashboard.siteId,
                isForceUpdate: opt.isForceUpdate,

            };
            let { data } = await domainApi.resolveCdnByAliYunToken(params);
            if (!data.isSuccess && data.redirectUrl) {
                window.open(data.redirectUrl);
            }
            if (!data.isSuccess && !data.redirectUrl) {
                this.$notify({
                    message: data.errorMessage,
                    type: "error",
                    duration: 1500
                });
            }
            if (data.isExistResolveCdnRecord) {
                this.$confirm("提示", {
                    message: `${opt.curDomain}解析记录值已存在，是否覆盖？`,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        if (action === "confirm") {
                            this._resolveCdnByAliYunToken(this.resolveDomainData)
                        }
                    }
                });
                //confirm()//ok: this.isForceUpdate() isForceUpdate:true
            }
            // data.is
            if (data.isSuccess) {
                this.$notify({
                    message: "大约需要5分钟解析成功",
                    type: "error",
                    duration: 1500
                });
            }
        },
        /**
         * 开启https
         */
        async _oneKeyEnableHttps(domainId) {
            let { data, status } = await domainApi.oneKeyEnableHttps(domainId);
            if (status === 200) {
                //
                this.$notify({
                    title: "成功",
                    message: "证书申请成功！",
                    type: "success",
                    duration: 1500
                });
            }
        },
        /**
         * 关闭https
         */
        async _disableHttps(domainId) {
            let data = await domainApi.disableHttps(domainId);
            console.log(data);
        },
        /**
         * 关闭cnd加速
         */
        async _pauseCdn(siteDomainId) {
            let { data, status } = await domainApi.pauseCdn(siteDomainId);
            if (status === 200) {
                this.$notify({
                    message: "已成功关闭CDN",
                    type: "success",
                    duration: 1500
                });
                this._getCdnDomainList();
            }
        },
        /** 开启cdn加速 */
        async _reopenCdn(siteDomainId) {
            let data = await domainApi.reopenCdn(siteDomainId);
            if (status === 200) {
                this.$notify({
                    message: "已开启CDN，等待服务器审核",
                    type: "success",
                    duration: 1500
                });
                this._getCdnDomainList();
            }
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
                            this.domainAmount--;
                        }
                    }
                }
            });
        },
        righPanelShow() {
            this.backupShow = true;
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
</style>
