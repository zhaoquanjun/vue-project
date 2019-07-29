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
            <el-table-column prop="domain" label="域名"></el-table-column>
            <el-table-column prop="httpsStatusDesc" label="HTTPS状态">
                <template slot-scope="scope">
                    <!-- <el-switch
                        v-model="scope.row.httpsStatus"
                        @change="swichChange(scope.row.httpsStatus,scope.row,scope.$index)"
                    ></el-switch>-->
                    <template
                        v-if="scope.row.cdnDomainResolveStatus===2 && scope.row.cdnStatus===5"
                    >
                        <!-- v-model="scope.row.httpsStatus" -->
                        <el-switch
                            :value="scope.row.httpsStatus==4"
                            @change="swichChange(scope.row.httpsStatus,scope.row,scope.$index)"
                        ></el-switch>
                    </template>
                    <span v-else>—</span>
                </template>
            </el-table-column>
            <el-table-column prop="cdnDomainResolveStatusDesc" label="解析状态"></el-table-column>
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
                            <!-- <el-col :span="7">
                                <div class="step-content">
                                    <div class="step-item">
                                        <span class="circle " :class="stepClass(props.row)">2</span>
                                        <span class="step-desc">配置解析</span>
                                    </div>
                                    <span class="step-bar"></span>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div class="step-content">
                                    <div class="step-item">
                                        <span class="circle " :class="stepClass(props.row)">3</span>
                                        <span class="step-desc">等待解析生效</span>
                                    </div>
                                    <span class="step-bar"></span>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <div class="step-content">
                                    <div class="step-item">
                                        <span class="circle " :class="stepClass(props.row)">4</span>
                                        <span class="step-desc">解析成功</span>
                                    </div>
                                </div>
                            </el-col>-->
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
                                        v-if="props.row.cdnDomainResolveStatus===2"
                                    >{{props.row.cdnDomainResolveStatusDesc}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="step-explain">
                            <el-col :span="7" v-if="active >= 0">
                                <div>
                                    <div
                                        class="explain-item"
                                    >解析类型: {{props.row.cdnDomainResolveType?props.row.cdnDomainResolveType:'—'}}</div>
                                    <div
                                        class="explain-item"
                                    >解析记录值: {{props.row.cdnDomainResolveValue?props.row.cdnDomainResolveValue:'—'}}</div>
                                </div>
                            </el-col>
                            <el-col :span="7" v-if="active >= 1">
                                <div>
                                    <div class="explain-item">
                                        使用“一键解析”自动完成域名解析或前往阿里云控制台
                                        <br />自行设置解析
                                    </div>
                                    <div class="explain-item islink">如何进行域名解析？</div>
                                    <button
                                        class="explain-item wezhan-btn"
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
                                    <div class="explain-item">解析成功！可根据您的需 要，在域名列表中选择开 启HTTPS。</div>
                                    <div class="explain-item islink">为什么要开启HTTPS</div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div class="cnd-status">
                                <span>CDN状态：</span>
                                <span
                                    :class="props.row.cdnStatus===4?'cndStop':''"
                                >{{props.row.cdnStatusDesc}}</span>
                                <button
                                    class="open-cnd-btn"
                                    v-if="props.row.cdnStatus!==2 && props.row.cdnStatus!==5"
                                    @click="reopenCdn(props.row.id)"
                                >开启</button>
                                <button
                                    class="open-cnd-btn"
                                    v-if="props.row.cdnStatus===5"
                                    @click="pauseCdn(props.row.id)"
                                >关闭</button>
                            </div>
                        </el-row>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  width="150">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <!-- <button class="resolve-set" @click="expandSelect(scope.row,scope.row)">解析设置</button> -->
                        <button
                            class="handle-btn delete-btn"
                            @click="handleDelete(scope.row,scope.$index)"
                        ></button>
                    </div>
                </template>
            </el-table-column>
            
        </el-table>
    </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
    props: ["tableData"],
    data() {
        return {
            value: true,
            domainStepName: [
                "生成解析记录值",
                "配置解析",
                "等待解析生效",
                "解析成功"
            ],
            active: 0,
            expands: [],
            entdatas: [],
            entexpands: [],
            getRowKeys(row) {
                return row.id;
            }
        };
    },
    mounted() {},
    methods: {
        //一键解析域名
        resolveCdnByAliYunToken(row) {
            let params = {
                resolveType: row.cdnDomainResolveType,
                domain: row.domain,
                resolveValue: row.cdnDomainResolveValue,
                isForceUpdate: false
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
                        confirmButtonText: "发布网站并申请",
                        cancelButtonText: "已发布，直接申请",
                        type: "success"
                    }
                )
                    .then(() => {
                        // 发布网站并申请 暂时无此接口 后续增加
                    })
                    .catch(() => {
                        this.$emit("oneKeyEnableHttps", domainId);
                    });
            } else {
                this.$confirm("确定要停用HTTPS吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "success"
                }).then(() => {
                    this.$emit("disableHttps", domainId);
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
            console.log(row);
            // if (index === 2) {
            //     this.active = 2;
            // }
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
        elemnetConfirm(type, content, callback, index, status, title) {
            let message = [];
            content.forEach(item => {
                message.push(
                    this.$createElement("p", { style: "color: #262626" }, item)
                );
            });
            this.$confirm("提示", {
                title: title || "提示",
                message: this.$createElement("div", null, message),
                confirmButtonText: "确定",
                type: type,
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
        rowExpand(row, event, column) {
            Array.prototype.remove = function(val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.entexpands.indexOf(row.id) < 0) {
                this.entexpands = [];
                row.id = this.generateUUID();
                this.entexpands.push(row.id);
                alert(1);
            } else {
                this.entexpands.remove(row.id);
            }
        },
        generateUUID() {
            var d = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
                }
            );
            return uuid;
        }
    },
    watch: {
        tableData() {
            this.$nextTick(() => {
                let eles = document.getElementsByClassName(
                    "el-table__expand-icon"
                );
                for (let i = 0; i < eles.length; i++) {
                    let ele = eles[i];
                   
                    ele.innerHTML = "<span style='color: #00c1de;' >解析设置</span>";

                  
                }
            });
        }
    }
};
</script>
<style scoped>
@import "../../../styles/table.css";
</style>

<style scoped>
.el-table /deep/ .el-table__body .cell {
    color: #262626;
}
.el-table /deep/ .el-table__expanded-cell {
    background: #eee;
    padding: 16px 32px;
}
/* .el-table /deep/ .el-table__expand-column .cell{
        width: 160px;
} */

.el-table /deep/ .el-table__expand-icon{
    transform:rotate(0deg)
}
.el-table /deep/ .el-table__expanded-cell:hover {
    background: #eee !important;
}

</style>
<style lang="scss" scoped>



.relove-step {
    margin-top: 12px;
    background: #eeeeee;
    color: #262626;
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
            line-height: 17px;
            padding-bottom: 11px;
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
    justify-content:flex-end;
    .handle-btn {
        width: 17px;
        height: 16px;
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
.wezhan-btn {
    width: 90px;
    padding: 10px 0;
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
</style>

