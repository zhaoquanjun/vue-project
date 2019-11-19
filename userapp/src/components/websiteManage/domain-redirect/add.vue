<template>
    <div class="right-pannel" :style="{width:'470px'}">
        <div class="pannel-head">
            <span>
                <span>{{title}}</span>
            </span>
            <span class="close-pannel" @click="handleCancel">X</span>
        </div>

        <div class="domain-wrap">
            <el-form ref="ruleForm" @submit.native.prevent label-width="80px" :model="form">
                <el-form-item style="color:#262626" label="源域名:">
                    <el-select
                        v-model="form.sourceDomain"
                        placeholder="请选择"
                        :popper-append-to-body="false"
                    >
                        <el-option
                            v-for="(item,index) in domainList"
                            :key="index"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                    <div
                        class="el-form-item__error"
                        v-if="error.souceErrorTip"
                    >{{error.souceOnerrorText}}</div>
                </el-form-item>
                <el-form-item style="color:#262626" label="目标域名:">
                    <el-input v-model="form.targetDomain" placeholder="请输入目标域名" @blur="changeInput"></el-input>
                    <div class="el-form-item__error" v-if="error.onerrorTip">{{error.onerrorText}}</div>
                </el-form-item>
            </el-form>
        </div>
        <div class="pannel-footer">
            <button
                class="footer-btn btn-bglightblue"
                :disabled="disabled"
                @click="handleConfirm"
            >确定</button>
            <button class="footer-btn cancel btn-lightblue" @click="handleCancel">取消</button>
        </div>
    </div>
</template>
<script>
import {
    addDomainRedirection,
    modifyDomainRedirection
} from "@/api/request/domainRedirectApi";
export default {
    props: ["domainList", "sourceDomain", "_targetDomain", "isEditor", "id",],
    data() {
        return {
            disabled: false,
            error: {
                souceErrorTip: false,
                souceOnerrorText: "",
                onerrorTip: false,
                onerrorText: ""
            },
            form: {
                sourceDomain: "",
                targetDomain: ""
            },
            title:""
        };
    },
    mounted() {
        if (!!this.isEditor) {
            this.form.sourceDomain = this.sourceDomain;
            this.form.targetDomain = this._targetDomain;
             this.title="编辑"
        }else{
                this.title="添加"
            }
          
    },
    methods: {
        async handleConfirm() {
            if (!this.changeInput()) return;

            let option = {
                targetDomain: this.form.targetDomain,
                sourceDomain: this.form.sourceDomain
            };
            if (!!this.isEditor) {
                this.editorDomain(option);
               
                return;
            }
            let { data, status } = await addDomainRedirection(option);
            if (status === 200) {
                this.handleCancel();
                this.$confirm("提示", {
                    title: "提示",
                    message: "为保证301重定向生效，请点击发布您的网站。",
                    confirmButtonText: "立即发布",
                    cancelButtonText: "稍后发布",
                    iconClass: "icon-success",
                    closeOnClickModal: false,
                    callback: async action => {
                        if (action === "confirm") {
                        } else {
                            this.$emit("get301List");
                           
                        }
                    }
                });
            }
        },
        async editorDomain(option) {
            let { data, status } = await modifyDomainRedirection(
                option,
                this.id
            );
            if (status === 200) {
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `编辑成功`,
                    duration: 1500,
                    showClose: false
                });
                this.$emit("get301List");
                this.handleCancel();
            }
        },
        changeInput() {
            if (!this.form.sourceDomain) {
                this.error.souceErrorTip = true;
                this.error.souceOnerrorText = "请选择源域名";
                return false;
            } else {
                this.error.souceErrorTip = false;
                this.error.souceOnerrorText = "";
            }

            if (this.form.targetDomain === "") {
                this.error.onerrorTip = true;
                this.error.onerrorText = "请输入目标域名";
                return false;
            } else if (!this.testDomain(this.form.targetDomain)) {
                this.error.onerrorTip = true;
                this.error.onerrorText = "请输入正确格式的域名";
                return false;
            } else if (this.form.sourceDomain == this.form.targetDomain) {
                this.error.onerrorTip = true;
                this.error.onerrorText = "目标域名和源域名不可相同";
                return false;
            } else {
                this.error.onerrorTip = false;
                this.error.onerrorText = "";
                return true;
            }
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
            this.$emit("closeDialog");
            this.resetForm();
        },
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            (this.error = {
                souceErrorTip: false,
                souceOnerrorText: "",
                onerrorTip: false,
                onerrorText: ""
            }),
                (this.form = {
                    sourceDomain: "",
                    targetDomain: ""
                });
        },
        clickConfirmBtnSet() {
            this.backupShow = false;
            this.disabled = false;
            this.btnText = "确定";
            this.$$emit("get301List");
        }
    }
};
</script>
<style scoped>
/* .el-form /deep/ .el-select {
    width: 100%;
}
.el-form /deep/ .el-form-item {
    margin-bottom: 30px;
}
.el-form /deep/ .el-select /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #262626;
}
.el-form /deep/ .el-form-item__content .el-select .selected {
    background-color: #e0faff;
}
.el-form /deep/ .el-form-item__content .el-select .selected span {
    color: #262626;
    font-weight: 400;
}
.el-form /deep/ .el-form-item__content .el-select .selected::after {
    content: "";
    width: 22px;
    height: 22px;
    background: url("~img/element-icon/dui.png") no-repeat center;
    background-size: contain;
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 6px;
} */
</style>

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
        background: #f5ffef;
        border: 1px solid #86dea4;
        font-size: 12px;
        color: #63dc8c;
        text-align: left;
        line-height: 25px;
        h4,
        p {
            line-height: 25px;
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
}
.domain-wrap {
    padding: 40px 16px 0;
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
</style>

