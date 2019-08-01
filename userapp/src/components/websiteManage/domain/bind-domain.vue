<template>
    <div class="right-pannel" :style="{width:'470px'}">
        <div class="pannel-head">
            <span>
                <span>添加域名</span>
                <el-tooltip
                    class="item"
                    effect="light"
                    content="可批量为多个成员增加权限，该操作不会删除"
                    placement="bottom-end"
                ></el-tooltip>
            </span>
            <span class="close-pannel" @click="handleCancel">X</span>
        </div>

        <div class="domain-wrap">
            <el-form @submit.native.prevent>
                <el-form-item style="color:#262626" label="域名">
                    <el-input v-model="domainValue" placeholder="请输入备注信息（非必填" @change="changeInput"></el-input>
                    <div class="el-form-item__error" v-if="onerrorTip">{{onerrorText}}</div>
                </el-form-item>
            </el-form>
            <div class="tips">
                <h4 class="tips-title">温馨提示：</h4>
                <p class="tips-item">
                    <span>1、仅支持添加阿里云域名，非阿里云域名，请先将域名转入阿里云后再添加。</span>
                    <span class="islink">
                        <a
                            href="https://help.aliyun.com/document_detail/54077.html?spm=a2c4g.11186623.2.10.61ca4c07hLv73n"
                            target="_blank"
                        >如何将域名转入阿里云？</a>
                    </span>
                </p>
                <p class="tips-item">
                    <span>2、系统将自动为您的域名开启CDN，可在域名列表中手动关闭。</span>
                    <span class="islink">
                        <a
                            href="https://help.aliyun.com/document_detail/27101.html"
                            target="_blank"
                        >为什么要开启CDN？</a>
                    </span>
                </p>
            </div>
        </div>
        <div class="pannel-footer">
            <button
                class="footer-btn confirmBtn"
                :disabled="disabled"
                @click="handleConfirm"
            >{{btnText}}</button>
            <button class="footer-btn cancel" @click="handleCancel">取消</button>
        </div>
    </div>
</template>
<script>
import { bindDomainAndEnableCdn } from "@/api/request/domainApi";
export default {
    props: ["domainAmount"],
    data() {
        return {
            domainValue: "",
            onerrorTip: false,
            onerrorText: "",
            disabled: false,
            btnText: "确定"
        };
    },
    methods: {
        async handleConfirm() {
            if (this.domainAmount == 10) {
                this.$notify({
                    message: "每个站点最多只能绑定10个域名",
                    type: "warning",
                    duration: 1500
                });
                return false;
            }
            if (!this.changeInput()) return;
            this.disabled = true;
            this.btnText = "添加中";
            let { data, status } = await bindDomainAndEnableCdn({
                domain: this.domainValue
            });
            if (status === 200 && !data.isSuccess) {
                this.onerrorTip = true;
                this.onerrorText = data.msg;
                this.disabled = false;
                this.btnText = "确定";
                return;
            }
            if (status === 200 && data.isSuccess) {
                this.clickConfirmBtnSet();
                this.$emit("getCdnDomainList"); //添加成功后刷新域名列表
                // this.onerrorTip = false;
                let message = [];
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #262626" },
                        `${this.domainValue}，添加成功！可授权阿里云账号完成一键解析`
                    )
                );
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #8C8C8C" },
                        "如已存在解析记录，将会修改原有记录"
                    )
                );
                this.$confirm("提示", {
                    title: "提示",
                    message: this.$createElement("div", null, message),
                    confirmButtonText: "授权并一键解析",
                    cancelButtonText: "暂不授权",
                    type: "success",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            this.$emit("resolveCdnByAliYunToken", { id: data.id, isForceUpdate:false} );
                            this.handleCancel();
                        } else {
                            this.elemnetConfirm(
                                "warning",
                                "您可在域名列表中继续完成解析设置。",
                                `域名未解析！`
                            );
                            this.handleCancel();
                        }
                    }
                });
            }

            //    this.onerrorTip=true;
            //    this.onerrorText="不好是"
        },
        changeInput() {
            if (this.domainValue === "") {
                this.onerrorTip = true;
                this.onerrorText = "请输入域名";
                return false;
            } else if (!this.testDomain(this.domainValue)) {
                this.onerrorTip = true;
                this.onerrorText = "请输入正确格式的域名";
                return false;
            } else {
                this.onerrorTip = false;
                this.onerrorText = "";
                return true;
            }
        },
        // 提示框封装方法
        elemnetConfirm(type, content1, content2, callback) {
            let message = [];
            if (content1) {
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #262626" },
                        content1
                    )
                );
            }
            if (content2) {
                message.push(
                    this.$createElement(
                        "p",
                        { style: "color: #8C8C8C" },
                        content2
                    )
                );
            }
            this.$confirm("提示", {
                title: "提示",
                message: this.$createElement("div", null, message),
                confirmButtonText: "确定",
                type: type,
                callback: async action => {
                    if (action === "confirm") {
                    } else {
                    }
                }
            });
        },
        // 域名正则
        testDomain(domain) {
            var reg = /^([a-z0-9\-\u4E00-\u9FA5]*[\.])+([a-z\u4E00-\u9FA5]{2,10})$/;
            return reg.test(domain);
        },

        /**
         * 关闭弹框
         */
        handleCancel() {
            this.domainValue = "";
            this.onerrorTip = false;
            this.onerrorText = "";
            this.$emit("closeDialog");
        },
        clickConfirmBtnSet() {
            this.backupShow = false;
            this.disabled = false;
            this.btnText = "确定";
        }
    }
};
</script>
<style scoped lang="scss">
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
        overflow: hidden;
        margin-top: 36px;
        padding: 10px;
        background: rgba(242, 255, 234, 1);
        border: 1px solid rgba(199, 221, 185, 1);
        font-size: 12px;
        color: rgba(0, 182, 57, 1);
        text-align: left;
        line-height: 17px;
        h4,
        p {
            line-height: 17px;
        }
        .tips-title {
            font-weight: 500;
            padding-bottom: 8px;
        }
        .tips-item {
            padding-bottom: 8px;
        }
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
.domain-wrap {
    padding: 0 16px;
    // 绑定域名的错误提示
    .el-form-item__error {
        color: #262626;
        padding-top: 8px;
        &::before {
            display: inline-block;
            content: "";
            width: 13px;
            height: 13px;
            vertical-align: bottom;
            padding-right: 8px;
            background: url("~img/jian-icon.png") no-repeat center;
            background-size: contain;
        }
    }
}
.islink {
    padding-top: 3px;
    cursor: pointer;
    display: block;
    padding-left: 17px;
    color: blue;
}
</style>

