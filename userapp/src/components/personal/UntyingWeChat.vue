<template>
    <div class="set-phone-number">
        <el-row class="demo-autocomplete"></el-row>
        <el-alert title="解绑后，将不能使用钉钉登录管理平台" v-if="this.provider=='DingDing'" type="success"></el-alert>
        <el-alert title="解绑后，将不能使用支付宝登录管理平台" v-else-if="this.provider=='Alipay'" type="success"></el-alert>
        <el-alert title="解绑后，将不能使用微信登录管理平台" v-else type="success"></el-alert>
        <div class="from-row">
            <get-sms ref="getSms" :sourcePhone="sourcePhone"  :is-modifi="isModifi"></get-sms>
        </div>
        <div class="footer">
            <button class="confirm footer-btn" @click="untyIng ">解绑</button>
            <button class="cancel footer-btn" @click="close">取消</button>
        </div>
    </div>
</template>
<script>
    import NoCaptcha from "../common/no-captcha";
    import GetSms from "./GetSms";    
    import { isInvalidCode } from "@/api/index.js";
    export default {
    props: ["sourcePhone","provider"],
    components: { NoCaptcha, GetSms },
    data() {
        return {
            value: "",
            isModifi:false,
        };
    },
    methods: {       
        async untyIng() {
            let code = this.$refs.getSms.ruleForm.verification
            if (code==null) {
                this.$message({
                    type: "failed",
                    message: "请输入验证码!"
                });
            } else {
                let { status } = await isInvalidCode(this.sourcePhone, code);
                if (status === 200) {
                    this.$emit("removeExternalUserAsync",this.provider);
                } else {
                    this.$message({
                        type: "failed",
                        message: "验证失败!"
                    });
                }
            }                    
        },
        close() {            
            this.$store.commit("CLOSERIGHTPANNEL", false);
        }
     },
    mounted() {}
};
</script>
<style>
.el-select-dropdown {
    z-index: 10000 !important;
}
.el-autocomplete-suggestion {
    width: 150px;
}
.el-select .el-input__inner {
    border: none;
    padding: 0;
    padding-left: 5px;
    height: 30px;
}
</style>


<style lang="scss" scoped>
.set-phone-number {
    padding: 0 15px;
}
.smsCodeWrap {
    position: relative;
}
.el-select {
    position: absolute;
    width: 60px;
    left: 30px;
    top: 1px;
    bottom: 1px;
}
.dropdown__item {
    width: 150px;
}
// .sendSms {
//   border: none;
//   position: absolute;
//   right: 2px;
//   top: 1px;
//   bottom: 1px;
// }
.modifi-phone {
    padding-top: 20px;
    .phone-title {
        padding-bottom: 20px;
    }
}

//////@at-root
.from-row {
    margin-top: 30px;
}

.footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px 17px;
    border-top: 1px solid #efefef;
    .footer-btn {
        width: 63px;
        height: 32px;
        background: rgba(0, 193, 222, 1);
        color: #fff;
    }
    .cancel {
        margin-left: 20px;
        background: #fff;
        border: 1px solid rgba(0, 193, 222, 1);
        color: rgba(0, 193, 222, 1);
    }
}
</style>


