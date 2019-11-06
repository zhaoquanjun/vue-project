<template>
    <div class="table-list" id="table-list">
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            class="content-table"
            @expand-change="expandSelect"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/memberManage/table-empty.png" />
                    <span>暂无数据</span>
                </div>
            </template>
            <el-table-column prop="domain" label="域名" class="domain-name" min-width="230">
                <template slot-scope="scope">
                    <span class="domain-name">{{scope.row.domain}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="httpsStatusDesc" label="HTTPS状态" min-width="390">
                <template slot-scope="scope">
                    <!-- <el-switch
                        v-model="scope.row.httpsStatus"
                        @change="swichChange(scope.row.httpsStatus,scope.row,scope.$index)"
                    ></el-switch>-->
                    <span v-if="!scope.row.isInAliDns">仅阿里云域名可开启https,请将域名转移到阿里云后再操作</span>
                    <template
                        v-else-if="scope.row.cdnDomainResolveStatus===2 && scope.row.cdnStatus===5 &&scope.row.httpsStatus!==1 && scope.row.isInAliDns"
                    >
                        <!-- v-model="scope.row.httpsStatus" -->
                        <el-switch
                            :value="scope.row.httpsStatus==4"
                            @change="swichChange(scope.row.httpsStatus,scope.row,scope.$index)"
                        ></el-switch>
                    </template>
                    <span v-else-if="scope.row.httpsStatus===1">{{scope.row.httpsStatusDesc}}</span>
                    <span v-else>—</span>
                </template>
            </el-table-column>
            <el-table-column prop="cdnDomainResolveStatusDesc" label="解析状态" min-width="100">
                <template slot-scope="props">
                    <el-tooltip
                        v-if="props.row.cdnDomainResolveStatus!==2"
                        class="item"
                        effect="dark"
                        content="请根据“域名解析”中的解析步骤完成域名解析"
                        placement="top-start"
                    >
                        <span
                            class="resolve-status"
                            :class="resolveStatus(props.row.cdnDomainResolveStatus)"
                        >{{props.row.cdnDomainResolveStatusDesc}}</span>
                    </el-tooltip>
                    <span
                        v-else
                        class="resolve-status"
                        :class="resolveStatus(props.row.cdnDomainResolveStatus)"
                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" type="expand" label="操作">
                <template slot-scope="props">
                    <div class="relove-step">
                        <el-row>
                            <el-col
                                :span="index===3?3:7"
                                v-for="(item,index) in domainStepName"
                                :key="index"
                            >
                                <div class="step-content">
                                    <div class="step-item">
                                        <div
                                            class="circle"
                                            :class="[stepClass(props.row,2),[active>=index?'circleOn':'circleOff']]"
                                        >
                                            <span>{{index+1}}</span>
                                        </div>

                                        <span
                                            class="step-desc"
                                            :class="[active>=index?'':'cndStop']"
                                        >{{item}}</span>
                                    </div>
                                    <span v-if="index<3" class="step-bar"></span>
                                </div>
                            </el-col>
                        
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <div class="step-content">
                                    <span
                                        class="relove-msg"
                                        v-if="props.row.cdnDomainResolveStatus===0"
                                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div class="step-content">
                                    <span
                                        class="relove-msg"
                                        v-if="props.row.cdnDomainResolveStatus===1"
                                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div class="step-content">
                                    <span
                                        class="relove-msg"
                                        v-if="props.row.cdnDomainResolveStatus===2"
                                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <div class="step-content">
                                    <span
                                        class="relove-msg"
                                        v-if="props.row.cdnDomainResolveStatus===3"
                                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="step-explain" :gutter="20">
                            <el-col :span="7" v-if="active >= 0">
                                <div>
                                    <div
                                        class="explain-item"
                                    >解析类型 :&nbsp; {{props.row.cdnDomainResolveType?props.row.cdnDomainResolveType:'—'}}</div>
                                    <div
                                        class="explain-item"
                                    >解析记录值 : &nbsp;{{props.row.cdnDomainResolveValue?props.row.cdnDomainResolveValue:'—'}}</div>
                                </div>
                            </el-col>
                            <el-col :span="7" v-if="active >= 1">
                                <div>
                                    <div class="explain-item">使用“一键解析”自动完成域名解析或前往阿里云控制台自行设置解析</div>
                                    <div class="explain-item islink">如何进行域名解析？</div>
                                    <button
                                        v-if="props.row.isInAliDns"
                                        class="wezhan-btn btn-small btn-lightblue"
                                        @click="resolveCdnByAliYunToken(props.row)"
                                    >一键解析</button>
                                </div>
                            </el-col>
                            <el-col :span="7" v-if="active >= 2">
                                <div>
                                    <div
                                        class="explain-item"
                                    >{{props.row.cdnDomainResolveType}}的解析存在一定的延时，请耐心等待</div>
                                </div>
                            </el-col>
                            <el-col :span="3" v-if="active >= 3">
                                <div>
                                    <div class="explain-item">解析成功！可根据您的需要,在域名列表中选择开启HTTPS。</div>
                                    <div class="explain-item islink">为什么要开启HTTPS</div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div class="cnd-status">
                                <span>CDN状态：</span>
                                <span
                                    v-if="props.row.cdnStatus===3"
                                    style="cursor: pointer;"
                                    @click="notPassTip"
                                >{{props.row.cdnStatusDesc}}</span>
                                <span
                                    v-else
                                    :class="props.row.cdnStatus===4?'cndStop':''"
                                >{{props.row.cdnStatusDesc}}</span>
                                <button
                                    class="open-cnd-btn"
                                    v-if="props.row.cdnStatus!==2 && props.row.cdnStatus!==5 && props.row.isInAliDns"
                                    @click="reopenCdn(props.row.id)"
                                >开启</button>
                                <button
                                    class="open-cnd-btn"
                                    v-if="props.row.cdnStatus===5 && props.row.isInAliDns"
                                    @click="pauseCdn(props.row.id)"
                                >关闭</button>
                            </div>
                        </el-row>
                    </div>
                </template>
            </el-table-column>
            <el-table-column min-width="60">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <!-- <button class="resolve-set" @click="expandSelect(scope.row,scope.row)">解析设置</button> -->
                        <button
                            class="handle-btn delete-btn"
                            @click="handleDelete(scope.row,scope.$index)"
                        >
                            <i class="iconfont iconshanchu" style="color:#262626"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="提示" :visible.sync="passTip" width="50%">
            <span>
                审核未通过？请排查以下事项并在调整后重新开启
                <br />
                <br />● 内容不合规：
                <br />
                <br />无法正常访问或内容不含有任何实质信息
                <br />
                <br />游戏私服类
                <br />
                <br />传奇类游戏、纸牌类游戏
                <br />
                <br />盗版软件等无版权下载网站
                <br />
                <br />P2P类金融网站
                <br />
                <br />彩票类网站
                <br />
                <br />违规医院和药品类网站
                <br />
                <br />涉黄、涉毒、涉赌等
                <br />
                <br />自动超时拒绝：您的域名因不符合CDN接入规则而拒绝，请您
                <br />
                <br />查看之前的反馈结果，合规后可再行申请提交审核
                <br />
                <br />● 域名已被添加至CDN域名列表。
                <br />
                <br />处理方式：
                <br />
                <br />a、登录您的阿里云账户删除该域名并在该页面“重新提交”。
                <br />
                <br />b、如果您未添加过该域名，请在阿里云提交工单并等待处理。 如何提交工单?
                <br />
                <br />● 中文域名暂不支持开启CDN。
                <br />
                <br />
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: ["tableData"],
    data() {
        return {
            domainStepName: [
                "生成解析记录值",
                "配置解析",
                "等待解析生效",
                "解析成功"
            ],
            active: 0,
            expands: [],
            getRowKeys(row) {
                return row.id;
            },

            passTip: false
        };
    },
    mounted() {
        this.resetExpandText();
    },
    methods: {
        //一键解析域名
        resolveCdnByAliYunToken(row) {
            let params = {
                id: row.id,
                isForceUpdate: false,
                curDomain: row.domain
            };
            this.$emit("resolveCdnByAliYunToken", params);
        },
        //开启cdn
        reopenCdn(siteDomainId) {
            let openTip = [
                "确定开启CDN吗?",
                "开启CDN后，原有的域名解析将失效，",
                "请在开启CDN后进行域名解析，以确保网站能够正常访问。"
            ];
            let open = () => {
                this.$emit("reopenCdn", siteDomainId);
            };
            this.elemnetConfirm("warning", openTip, open);
        },
        //关闭cdn
        pauseCdn(siteDomainId) {
            let closeTip = [
                " 确定停用CDN吗?",
                "停用CDN后，原有的域名解析将失效，",
                "请在停用CDN后进行域名解析，以确保网站能够正常访问。"
            ];
            let close = () => {
                this.$emit("pauseCdn", siteDomainId);
            };
            this.elemnetConfirm("warning", closeTip, close);
        },
        // 是否开启HTTPS
        swichChange(status, row, index) {
            console.log(row, "00000000");
            let openTip = [
                "将为您申请免费证书，请发布您的网站并确保可正常访问！"
            ];
            let closeTip = ["确定要停用HTTPS吗？"];
            let domainId = row.id;
            // let open = () => {
            //     this.$emit("oneKeyEnableHttps", domainId);
            // };
            // let close = () => {
            //     this.$emit("disableHttps", domainId);
            // };
            // console.log(status);
            if (status !== 4) {
                this.$confirm(
                    "将为您申请免费证书，请发布您的网站并确保可正常访问！",
                    "开启HTTPS",
                    {
                        distinguishCancelAndClose: true,
                        confirmButtonText: "发布网站并申请",
                        cancelButtonText: "已发布，直接申请",
                        iconClass: "icon-success"
                    }
                )
                    .then(() => {
                        this.$emit("publishdata",domainId);
                    })
                    .catch(action => {
                        if (action === "cancel") {
                            this.$emit("oneKeyEnableHttps", domainId);
                        }
                    });
            } else {
                this.$confirm("确定要停用HTTPS吗？", "提示", {
                    iconClass: "icon-success",
                    callback: action => {
                        if (action === "confirm") {
                            this.$emit("disableHttps", domainId);
                        } else {
                        }
                    }
                });
            }
        },
        // 删除域名列表
        handleDelete(row, index) {
            console.log(row, index, "0----");
            let domainId = row.id;
            this.$emit("_deleteCdnDomain", domainId, index);
        },
        stepClass(row, index) {
            if (
                row.cdnDomainResolveStatus === 0 &&
                !row.cdnDomainResolveValue
            ) {
                this.active = 0;
                return;
            } else if (row.cdnDomainResolveStatus === 0) {
                this.active = 1;
                return;
            } else if (row.cdnDomainResolveStatus === 1) {
                this.active = 2;
                return;
            } else if (row.cdnDomainResolveStatus === 2) {
                this.active = 3;
                return;
            }
        },
        resolveStatus(status, cdnStatus) {
            switch (status) {
                case 0:
                    return "domainStatus0";
                case 1:
                    return "domainStatus1";
                case 2:
                    return "domainStatus2";
                case 3:
                    return "domainStatus3";
                default:
                    return "domainStatus0";
            }
        },
        elemnetConfirm(type, content, callback, index, status, title) {
            let message = [];
            content.forEach((item, index) => {
                if (index == 0) {
                    message.push(
                        this.$createElement(
                            "p",
                            { style: "color: #262626" },
                            item
                        )
                    );
                } else {
                    message.push(
                        this.$createElement(
                            "p",
                            { style: "color: #8C8C8C" },
                            item
                        )
                    );
                }
            });
            this.$confirm("提示", {
                title: title || "提示",
                message: this.$createElement("div", null, message),
                type: type,
                iconClass: `icon-${type}`,
                // customClass:"large", // 弹窗大小  large / medium / small
                callback: async action => {
                    if (action === "confirm") {
                        callback(this);
                    } else {
                        console.log(this, "----");
                    }
                }
            });
        },

        // 折叠面板每次只能展开一行
        expandSelect(row, expandedRows) {
            console.log(row, expandedRows);
            var that = this;
            if (expandedRows.length) {
                that.expands = [];
                if (row) {
                    that.expands.push(row.id);
                }
            } else {
                that.expands = [];
            }
        },
        notPassTip() {
            this.passTip = true;
        },
        resetExpandText() {
            this.$nextTick(() => {
                let eles = document.getElementsByClassName(
                    "el-table__expand-icon"
                );
                for (let i = 0; i < eles.length; i++) {
                    let ele = eles[i];
                    ele.innerHTML =
                        "<span class='hoverBtn' style='color: #00c1de;font-size:14px' >域名解析</span>";
                }
            });
        }
    },
    watch: {
        tableData() {
            this.resetExpandText();
        }
    }
};
</script>
<style>
.hoverBtn{
    padding: 8px;
    background: transparent;
}
.hoverBtn:hover{
    background:rgba(9,204,235,0.09);
}
</style>
<style scoped>
.el-table /deep/ thead :first-child > .cell {
    padding-left: 40px;
}

.el-table /deep/ thead th {
    padding: 0;
    height: 35px;
    background: #00c1de !important;
    color: #fff;
    font-weight: 400;
    font-size: 12px;
}

.el-table /deep/ .el-table__body .cell {
    color: #262626;
}

.el-table /deep/ .el-table__expanded-cell {
    background: #eee;
    padding: 16px 32px;
}

.el-table /deep/ th > .cell {
    text-align: left;
}

/* .el-table /deep/ .el-table__expand-column .cell{
            width: 160px;
    } */

.el-table /deep/ .el-table__expand-icon {
    height: 40px;
    transform: rotate(0deg);
}

.el-table /deep/ .el-table__expanded-cell:hover {
    background: #eee !important;
}
</style>
<style lang="scss" scoped>
.table-list {
    border: 1px solid #e1e6ea;
}
.relove-step {
    margin-top: 12px;
    background: #eeeeee;
    color: #262626;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: -52px;
        right: 199px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent #eee transparent;
    }
    &:hover {
        background: #eeeeee !important;
    }

    .step-content {
        display: flex;
        align-items: center;
        .step-item {
            flex: none;
            padding: 0 16px;
            .circle {
                display: inline-block;
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                border: 1px solid transparent;
                box-sizing: border-box;
            }

            .circleOn {
                color: #fff;
                background: #00c1de;
            }

            .circleOff {
                color: #b5b5b5;
                border: 1px solid #b5b5b5;
            }

            .step-desc {
                padding-left: 8px;
                font-weight: 500;
            }
        }

        .step-bar {
            width: 100%;
            height: 2px;
            background: #b5b5b5;
        }

        .relove-msg {
            padding-left: 44px;
            color: #8c8c8c;
            line-height: 18px;
            padding-top: 5px;
        }
    }

    .step-explain {
        padding: 20px 30px 22px;
        margin-top: 12px;
        background: #fff;
        color: #262626;
        .explain-item {
            line-height: 25px;
            padding-bottom: 11px;
            word-wrap: break-word;
        }

        .islink {
            color: #00c1de;
            padding-bottom: 16px;
        }
    }

    .cnd-status {
        padding: 10px;
        background: #fff;
        margin-top: 20px;
        color: #262626;
    }
}

.handle-btn-wrap {
    width: 70%;
    display: flex;
    justify-content: flex-end;
    .delete-btn {
        padding: 8px;
        background: transparent;
        &:hover {
            background: rgba(240, 243, 247, 1);
        }
    }
}

.wezhan-btn {
    width: 90px;
    color: #fff;
    background: rgba(0, 193, 222, 1);
}

.open-cnd-btn {
    margin-left: 15px;
    width: 55px;
    height: 24px;
    line-height: 24px;
    color: #fff;
    background: rgba(0, 193, 222, 1);
}

.cndStop {
    color: #b5b5b5;
}

.domainStatus0 {
    color: #f15533;
}

.domainStatus1 {
    color: #f5a623;
}

.domainStatus2 {
    color: #00b539;
}

.domainStatus3 {
    color: #8c8c8c;
}

.domain-name {
    padding-left: 30px;
}
</style>

