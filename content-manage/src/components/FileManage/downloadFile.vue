<template>
    <div class="download-file">
        <div class="download-pwd">
            <h4 class="title">该文件进行了加密</h4>
            <el-input
                class="input-border"
                placeholder="请输入下载密码"
                type="password"
                v-model="ruleForm.pass"
                autocomplete="off"
            ></el-input>
            <div class="ym-form-item__error" v-if="error.pwdTip">{{error.pwdErrorText}}</div>
            <button class="btn-small btn-bglightblue download-btn" @click="handlerDownload">确定</button>
        </div>
    </div>
</template>
<script>
import { download } from "@/api/request/fileManageApi";
import { trim } from "@/utlis/index.js";
export default {
    data() {
        return {
            ruleForm:{
                pass:""
            },
              error: {
                pwdTip: false,
                pwdErrorText: ""
            }
        };
    },
    mounted() {
        this._download();
    },
    methods: {
        handlerDownload(){
            this._download();
        },  
        async _download(row) {
            if(!this.checkPwd()) return;
            let option = {
                appId: this.$route.query.appId,
                id: this.$route.query.id,
                type: this.$route.query.type
            };
            let { data } = await download(option);
            var a = document.createElement("a");
            var binaryData = [];
            binaryData.push(data);
            a.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: "application/dat" })
            );
            a.download = "123"; // Set the file name.
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
       
        checkPwd() {
           
            let pwdReg = /^[a-zA-Z0-9\p{P}\p{S}]{6,16}$/;
            if(!trim(this.ruleForm.pass)){
                 this.error.pwdTip = true;
                this.error.pwdErrorText = "请输入密码";
            };
            if (trim(this.ruleForm.pass) && !pwdReg.test(this.ruleForm.pass)) {
                this.error.pwdTip = true;
               
                this.error.pwdErrorText = "密码设置不符合要求";
                return false;
            } else {
                this.error.pwdTip = false;
                this.error.pwdErrorText = "";
                return true;
            }
           
        },
    }
};
</script>
<style lang='scss' scoped>
.download-pwd /deep/ .el-input {
    padding-top: 32px;
}
.download-pwd /deep/ .input-border .el-input__inner {
    border: none;
    border-bottom: $--border-base;
    border-radius: 0;
}
</style>
<style scoped lang="scss">
.ym-form-item__error {
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
.download-file {
    width: 100%;
    height: 100%;
    background: lightblue;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;

    .download-pwd {
        width: 520px;
        height: 224px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.11);
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 32px;
        box-sizing: border-box;
        .title {
            line-height: 25px;
            font-size: $--font-size-large;
            font-weight: 500;
        }
        .download-btn {
            margin-top: 22px;
            padding: 12px 20px;
            float: right;
        }
    }
}
</style>
