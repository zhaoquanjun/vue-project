<template>
    <div class="set-phone-number">
        <div class="modify-title">
            <p>修改手机号后，可以使用新手机登录管理平台</p>
            <p>您关联的账户下的成员列表中的手机号会一同修改</p>
        </div>
        <div class="from-row">
            <get-sms
                ref="getSms"
                :sourcePhone="sourcePhone"
                :is-modifi="isModifi"
                @refreshIndex="_refreshIndex"
            ></get-sms>
        </div>
        <div class="footer pannel-footer">
            <button class="confirm footer-btn" v-if="!isModifi" @click="nextStep">下一步</button>
            <button class="confirm footer-btn" v-else @click="modify ">确认修改</button>
            <button class="cancel footer-btn" @click="close">取消</button>
        </div>
    </div>
</template> 
<script>
import NoCaptcha from "../common/no-captcha";
import GetSms from "./GetSms";
import { isInvalidCode } from "@/api/index.js";
export default {
    props: ["sourcePhone"],
    components: { NoCaptcha, GetSms },
    data() {
        return {
            value: "",
            isModifi: false,
            input: "123",
            options: [
                {
                    value: "中国大陆",
                    label: "+86"
                },
                {
                    value: "香港",
                    label: "+852"
                },
                {
                    value: "台湾",
                    label: "+886"
                },
                {
                    value: "美国",
                    label: "+1"
                },
                {
                    value: "英国",
                    label: "+44"
                },
                {
                    value: "日本",
                    label: "+81"
                },
                {
                    value: "俄罗斯",
                    label: "+7"
                },
                {
                    value: "意大利",
                    label: "+39"
                }
            ],
            value: "+86"
        };
    },
    methods: {
        async nextStep() {
            let code = this.$refs.getSms.ruleForm.verification;

            if (!this.$refs.getSms.submitForm1()) {
                return false;
            } else {
                let { status } = await isInvalidCode(code);
                if (status === 200) {
                    this.$refs.getSms.resetTimer();
                    this.isModifi = true;
                    if (!this.isModifi) {
                        this.$store.commit("CLOSERIGHTPANNEL", false);
                        this.timer = setTimeout(() => {
                            this.$store.commit("CLOSERIGHTPANNEL", true);
                        }, 500);
                    }
                } else {
                    this.$notify({
                        customClass: "notify-error",
                        message: `验证失败!`,
                        showClose: false,
                        duration: 1500
                    });
                }
            }
        },
        async modify() {
            this.$refs.getSms.submitForm("ruleForm");
            // alert('确认修改')
        },
        close() {
            this.isModifi = false;
            this.$store.commit("CLOSERIGHTPANNEL", false);
        },
        _refreshIndex() {
            this.isModifi = false;
            this.$emit("getUserProfileAsync");
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
    padding: 32px;
    .modify-title {
        color: #35b24b;
        padding: 8px;
        background: rgba(242, 255, 234, 1);
        border: 1px solid rgba(199, 221, 185, 1);
        p {
            line-height: 20px;
            text-align: center;
        }
    }
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


