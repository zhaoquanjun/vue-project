export default {
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
            if (data.isSuccess) {
                this.$notify({
                    customClass: "notify-success",
                    message: `大约需要5分钟解析成功`,
                    duration: 2000,
                    showClose: false
                });
                this._getCdnDomainList(this.curSiteId)
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
        righPanelShow() {
            this.backupShow = true;
        },

        closeDialog() {
            this.backupShow = false;
        },
        handleTabClick(type) {
            if (type === "domainList") {

            } else {
                this.showType = false
            }
        }
    }
}