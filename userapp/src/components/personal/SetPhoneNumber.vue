<template>
    <div class="set-phone-number">
        <el-row class="demo-autocomplete"></el-row>
        <el-alert :closable="false" title="修改手机号后，可以使用新手机登录管理平台，您关联的账户下的成员列表中的手机号会一同修改" type="success"></el-alert>
        <!-- <no-captcha></no-captcha> -->
        <!-- <div class="modifi-phone">

        <div class="smsCodeWrap">
            <el-input
                class="smsInput"
                prefix-icon="el-icon-date"
                size="small"
                v-model="input"
                placeholder="请输入内容"
            >
              <el-select
              slot="prefix"
                style="z-index:10000"
                size="small"
                @change="change"
                v-model="value"
                placeholder="请选择"
            >
                <el-option
                    popper-class="dropdown__item"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
            </el-input>


    <!-- <button class="sendSms">发送验证码</button>-->
        <!-- </div>
    </div>-->
        <div class="from-row">
            <get-sms ref="getSms" :sourcePhone="sourcePhone"  :is-modifi="isModifi"></get-sms>
        </div>
        <div class="footer">
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
            value: "中国大陆"
        };
    },
    methods: {       
        async nextStep() {
            let code = this.$refs.getSms.ruleForm.verification
            if (code==null) {
                this.$message({
                    type: "failed",
                    message: "请输入验证码!"
                });
            } else {
            let { status } = await isInvalidCode(this.sourcePhone, code);
            if (status === 200) {
                this.isModifi = true;
                if (!this.isModifi) {
                    this.$store.commit("CLOSERIGHTPANNEL", false);
                    this.timer = setTimeout(() => {
                        this.$store.commit("CLOSERIGHTPANNEL", true);
                    }, 500);
                }  
            } else {
                this.$message({
                    type: "failed",
                    message: "验证失败!"
                });
                }
            }                    
        },
        async modify(){
            this.$refs.getSms.submitForm("ruleForm");            
          // alert('确认修改')
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


