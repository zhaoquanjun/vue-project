<template>
    <div class="set-phone-number">
        <div class="modify-title">
            <p v-if="this.provider=='DingDing'">解绑后，将不能使用钉钉登录管理平台</p>
            <p v-else-if="this.provider=='Alipay'">解绑后，将不能使用支付宝登录管理平台</p>
            <p v-else>解绑后，将不能使用微信登录管理平台</p>
        </div>
       
        <div class="from-row">
            <get-sms ref="getSms" :sourcePhone="sourcePhone" :is-modifi="isModifi"></get-sms>
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
    props: ["sourcePhone", "provider"],
    components: { NoCaptcha, GetSms },
    data() {
        return {
            value: "",
            isModifi: false
        };
    },
    methods: {
        async untyIng() {
            let code = this.$refs.getSms.ruleForm.verification;
            if (!code) {
                this.$refs.getSms.submitForm1()
                return
            } else {
                let { status } = await isInvalidCode(this.sourcePhone, code);
                if (status === 200) {
                    this.$emit("removeExternalUserAsync", this.provider);
                } else {
                    this.$message({
                        type: "warning",
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
@import "./style/personal";
.set-phone-number {
    padding: 32px;
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


</style>


