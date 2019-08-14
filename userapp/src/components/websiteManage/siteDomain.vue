<template>
    <el-container class="member-container">
        <el-aside class="submenu-aside">
            <page-submenu>
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content page-scroll">
            <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
            <div style="padding: 24px 17px;">
                <el-row class="user-list">
                    <span class="member-list-title fs14">域名管理</span>
                </el-row>

                <DomainMenu
                    ref="domainMenu"
                    @handleTabClick="handleTabClick"
                    @handleBtn="righPanelShow"
                />
                <el-main>
                    <DomainList
                        v-if="showType"
                        :tableData="domainListData"
                        @_deleteCdnDomain="_deleteCdnDomain"
                        @oneKeyEnableHttps="_oneKeyEnableHttps"
                        @disableHttps="_disableHttps"
                        @resolveCdnByAliYunToken="_resolveCdnByAliYunToken"
                        @reopenCdn="_reopenCdn"
                        @pauseCdn="_pauseCdn"
                        @getCdnDomainList="_getCdnDomainList"
                    ></DomainList>
                    <RedirectDomainList v-else ref="redirectDomainList" @toSet="toSet"></RedirectDomainList>
                </el-main>
                <div class="handle-guide">
                    <template v-if="showType">
                        <h3>操作指引</h3>
                        <ul>
                            <li>1、域名添加后，请根据“域名解析”中的解析步骤完成域名解析；</li>
                            <li>2、域名解析第一步（生成解析记录值）完成后，可使用一键解析自动完成域名解析，也可前往阿里云控制台自行设置解析；</li>
                            <li>3、添加域名时会自动为您开启CDN，可在域名解析中手动关闭；</li>
                            <li>4、已开启CDN且解析成功的域名，可在域名列表中选择开启HTTPS;</li>
                        </ul>
                    </template>
                    <template v-else>
                        <h3>310重定向说明</h3>
                        <ul>
                            <li>1、310重定向是指从源域名跳转到目标域名的操作，有绑定且解析成功的域名才能使用此功能。</li>
                            <li>2、310重定向应用场景：①帮助保留流向301冲向页面的链接；②实现权重转移。</li>
                            <li>3、为使得301重定向成功生效，请在添加信息后发布一次网站。</li>
                            <li>4、301重定向可能不会马上生效，请耐心等待10-15分钟。</li>
                        </ul>
                    </template>
                </div>
            </div>
        </el-main>
        <el-dialog
            width="0"
            :visible.sync="backupShow"
            :show-close="false"
            :close-on-click-modal="false"
        >
            <BindDomain
                v-if="showType"
                :domain-amount="domainAmount"
                @closeDialog="closeDialog"
                @getCdnDomainList="_getCdnDomainList"
                @resolveCdnByAliYunToken="_resolveCdnByAliYunToken"
            ></BindDomain>
            <AddRedirectDomain
                v-else
                :domain-list="getActiveAndNotInUseDomainList"
                @closeDialog="closeDialog"
                @get301List="_get301List"
            />
        </el-dialog>
    </el-container>
</template>

<script>
import RightPannel from "_c/RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import DomainMenu from "_c/websiteManage/domain/domain-menu.vue";
import DomainList from "_c/websiteManage/domain/domain-list.vue";
import BindDomain from "_c/websiteManage/domain/bind-domain.vue";
import AddRedirectDomain from "_c/websiteManage/domain-redirect/add.vue";
import ChangeSite from "_c/websiteManage/changeSite.vue";
// 301重定向 begin
import RedirectDomainList from "_c/websiteManage/domain-redirect/index.vue";
import * as domainRedirectApi from "@/api/request/domainRedirectApi";
// 301 end
import { sendTargetPhoneCode } from "@/api/index.js";
import { formatDateTime } from "@/api/index";
import * as domainApi from "@/api/request/domainApi";
import { getSiteInfo } from "@/api/request/siteBackupApi";
import Cookies from "js-cookie";

export default {
    components: {
        RightPannel,
        PageSubmenu,

        DomainMenu,
        DomainList,
        BindDomain,
        ChangeSite,
        RedirectDomainList,
        AddRedirectDomain
    },
    data() {
        return {
            domainListData: [], // table列表
            backupShow: false,
            flag: false,
            domainAmount: 0,
            resolveDomainData: "",
            curSiteId: "",
            showType: true,
            getActiveAndNotInUseDomainList: [],
            domainValue:"",
        };
    },
    created() {
        window.callback = function() {
            console.log("重新打开窗口");
        };
    },
    mounted() {
        // this._getCdnDomainList();
        // this.getSiteInfo();
    },
    methods: {
        // 获取siteId
        getSiteId(siteId) {
            this._getCdnDomainList(siteId);
            this.curSiteId = siteId;
            Cookies("SiteId", siteId);
        },
        // 选择切换网站
        chooseWebsite(siteId) {
            this._getCdnDomainList(siteId);
        },
        async _isAliYunTokenSet() {
            let { data } = await domainApi.isAliYunTokenSet();

            return data;
        },
        async _removeAliYunToken() {
            await domainApi.removeAliYunToken();
        },
        /**
         * 获取站点信息
         */
        async getSiteInfo(siteId) {
            let { data } = await getSiteInfo(siteId);
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
        async _getCdnDomainList(siteId) {
            siteId = siteId || this.curSiteId;
            let { data } = await domainApi.getCdnDomainList(siteId);
            this.domainListData = data;

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
                isForceUpdate: opt.isForceUpdate
            };
            let { data } = await domainApi.resolveCdnByAliYunToken(params);
            if (!data.isSuccess && data.redirectUrl) {
                window.open(data.redirectUrl);
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this._isAliYunTokenSet().then(data => {
                        if (data) {
                            clearInterval(this.timer);
                            this._resolveCdnByAliYunToken(
                                this.resolveDomainData
                            );
                        }
                    });
                }, 2000);
            }
            if (
                !data.isSuccess &&
                !data.redirectUrl &&
                !data.isExistResolveCdnRecord
            ) {
                this.$notify({
                    customClass: "notify-error",
                    message: data.errorMessage,
                    duration: 1500,
                    showClose: false
                });
            }
            if (data.isExistResolveCdnRecord) {
                this.$confirm("提示", {
                    title: "提示",
                    message: `${opt.curDomain}解析记录值已存在，是否覆盖？`,
                    iconClass: "icon-warning",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resolveDomainData.isForceUpdate = true;
                            this._resolveCdnByAliYunToken(
                                this.resolveDomainData
                            );
                        }
                    }
                });
                //confirm()//ok: this.isForceUpdate() isForceUpdate:true
            }
            // data.is
            if (data.isSuccess ) {
               
                // this.$notify({
                //     customClass: "notify-success",
                //     message: `大约需要5分钟解析成功`,
                //     duration: 2000,
                //     showClose: false
                // });
                let message = [];
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #262626" },
                        `${this.resolveDomainData.curDomain}，添加解析成功！`
                    )
                );
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #8C8C8C" },
                        "解析生效需要一定的时间，如网站不能正常访问，请耐心等待。"
                    )
                );
                this.$confirm("提示", {
                    title: "提示",
                     iconClass: "icon-success",
                    message: this.$createElement("div", null, message),
                    confirmButtonText: "确定",
                    closeOnClickModal: false
                });
                this._getCdnDomainList(this.curSiteId);
            }
        },
        /**
         * 开启https
         */
        async _oneKeyEnableHttps(domainId) {
            let { data, status } = await domainApi.oneKeyEnableHttps(domainId);
            if (status === 200) {
                //

                if (!data.isSuccess) {
                    this.$confirm("提示", {
                        title: "提示",
                        message:
                            "申请失败！请在发布网站并确保可正常访问后重试。",
                        showCancelButton: false,
                        iconClass: "icon-warning",
                        callback: async action => {
                            if (action === "confirm") {
                            }
                        }
                    });
                } else {
                    this.$notify({
                        customClass: "notify-success",
                        title: "成功",
                        message: "证书申请成功！",
                        duration: 1500,
                        showClose: false
                    });
                }
                this._getCdnDomainList(this.curSiteId);
            }
        },
        /**
         * 关闭https
         */
        async _disableHttps(domainId) {
            let { data, status } = await domainApi.disableHttps(domainId);
            if (status === 200) {
                //
                this.$notify({
                    customClass: "notify-success",
                    title: "成功",
                    message: "HTTPS关闭成功！",
                    duration: 1500,
                    showClose: false
                });
                this._getCdnDomainList(this.curSiteId);
            }
        },
        /**
         * 关闭cnd加速
         */
        async _pauseCdn(siteDomainId) {
            let { data, status } = await domainApi.pauseCdn(siteDomainId);
            if (status === 200) {
                this.$notify({
                    customClass: "notify-success",
                    message: "已成功关闭CDN",
                    duration: 1500,
                    showClose: false
                });
                this._getCdnDomainList();
            }
        },
        /** 开启cdn加速 */
        async _reopenCdn(siteDomainId) {
            let { data, status } = await domainApi.reopenCdn(siteDomainId);
            if (status === 200) {
                this.$notify({
                    message: "已开启CDN，等待服务器审核",
                    customClass: "notify-success",
                    duration: 1500,
                    showClose: false
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
                title: "提示",
                message:
                    "确定删除该域名?域名删除后, 您将无法访问该网站.强烈建议您在删除前修改该域名的cname解析. ",
                iconClass: "icon-warning",
                callback: async action => {
                    if (action === "confirm") {
                        let { data, status } = await domainApi.deleteCdnDomain(
                            domainId
                        );
                        if (status === 200) {
                            this.domainListData.splice(index, 1);
                            this.domainAmount--;
                            this.$notify({
                                customClass: "notify-success",
                                message: `域名删除成功`,
                                duration: 2000,
                                showClose: false
                            });
                        }
                    }
                }
            });
        },
        //// 301 ////
        async _getActiveAndNotInUseDomainList() {
            let {
                data
            } = await domainRedirectApi.getActiveAndNotInUseDomainList();
            this.getActiveAndNotInUseDomainList = data;
        },
        _get301List() {
            this.$refs.redirectDomainList._get301List();
        },
        righPanelShow() {
            this.backupShow = true;
        },

        closeDialog() {
            this.backupShow = false;
        },
        handleTabClick(type) {
            if (type === "domainList") {
                this.showType = true;
            } else {
                this.showType = false;
                this._getActiveAndNotInUseDomainList();
            }
        },
        toSet() {
            this.$refs.domainMenu.handleTabClick("domainList");
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
.handle-guide {
    margin-top: 48px;
    border: 1px solid #e1e6ea;

    h3 {
        border-bottom: 1px solid #e1e6ea;
        padding: 24px 32px;
    }
    ul {
        padding: 16px 32px;
        li {
            padding-bottom: 16px;
            color: #8c8c8c;
        }
    }
}
</style>
