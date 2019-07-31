
<template>
    <div class="setPwd">
        <el-alert :closable="false" :title="tipTitle" type="success"></el-alert>
        <template v-if="!isSetPassWord">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="pwd-form">
                <el-form-item prop="passWrod" class="verification-code">
                    <el-input
                        type="password"
                        v-model="ruleForm.passWrod"
                        auto-complete="new-password"
                        placeholder="输入设置密码"
                        minlength="6"
                        maxlength="16"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="beSurePwd" class="verification-code">
                    <el-input
                        type="password"
                        v-model="ruleForm.beSurePwd"
                        auto-complete="new-password"
                        placeholder="输入确认密码"
                        minlength="6"
                        maxlength="16"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template v-else>
            <el-form :model="ruleFormCode" :rules="rules" ref="ruleForm" class="pwd-form">
                <el-form-item prop="verification" class="verification-code">
                    <el-input
                        type="verification"
                        v-model="ruleFormCode.code"
                        autocomplete="on"
                        placeholder="验证码"
                        @input="changeInput"
                        maxlength="6"
                    ></el-input>
                    <el-button class="verification-text" @click="send" :disabled="disabled=!show">
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </template>
        <div class="footer">
            <button class="confirm footer-btn" v-if="isSetPassWord" @click="nextStep">下一步</button>
            <button class="confirm footer-btn" v-else @click="submitForm('ruleForm')">确定</button>
            <button class="cancel footer-btn" @click="close">取消</button>
        </div>
    </div>
</template>
<script>
const TIME_COUNT = 60; //更改倒计时时间
import {
    updateUserPwd,
    sendSourcePhoneCode,
    changeUserPwd,
    isInvalidCode
} from "@/api/index.js";
    export default {
        props: ["isSetPassWord", "sourcePhone"],
        data() {
            var regex1 = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$,.!%*#?&]{6,16}$");
            var regex2 = new RegExp("^(?=.*\\d)(?=.*[@$,.!%*#?&])[A-Za-z\\d@$,.!%*#?&]{6,16}$");
            var regex3 = new RegExp("^(?=.*[A-Za-z])(?=.*[@$,.!%*#?&])[A-Za-z\\d@$,.!%*#?&]{6,16}$");

        var checPwd = (rule, value, callback) => {            
            if (!regex1.test(value) && !regex2.test(value) && !regex3.test(value)) {
                callback(new Error("长度为6-16位,数字、字母及标点符号至少包含两种！"));
            }
            if (value.length > 16) {
                callback(new Error("密码长度不能超过16位！"));
            } else if (value.length < 6) {
                callback(new Error("密码长度最低为6位！"));
            } else {
                callback();
            }
            let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/;
        };
        var checBeSurePwd = (rule, value, callback) => {
            if (!regex1.test(value) && !regex2.test(value) && !regex3.test(value)) {
                callback(new Error("长度为6-16位,数字、字母及标点符号至少包含两种！"));
            }
            if (value.length > 16) {
                callback(new Error("密码长度不能超过16位！"));
            } else if (value.length < 6) {
                callback(new Error("密码长度最低为6位！"));
            } else if (value !== this.ruleForm.passWrod) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            show: true, // 初始启用按钮
            count: "", // 初始化次数
            timer: null,
            isModifi: false,
            tipTitle:
                "设置登录密码，可使用手机号+密码登录管理平台，为保证帐号更加安全，建议您定期修改密码",
            ruleForm: {
                passWrod: "",
                beSurePwd: ""
            },
            ruleFormCode: {
                phone: "",
                code: ""
            },

            rules: {
                passWrod: [
                    {
                        validator: checPwd,
                        trigger: "blur",
                        required: true
                    }
                ],
                beSurePwd: [
                    {
                        validator: checBeSurePwd,
                        trigger: "blur",
                        required: true
                    }
                ]
            },
            phone: "",
            code: ""
        };
    },
    mounted() {
        this.tipTitle = this.isSetPassWord
            ? "为保证帐号更加安全，建议您定期修改密码"
            : this.tipTitle;
    },
    methods: {
        async send() {
            let { status } = await sendSourcePhoneCode(this.sourcePhone);
            if (status === 200) {
                this.$message({
                    type: "success",
                    message: "发送成功!"
                });
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.show = true;
                            clearInterval(this.timer); // 清除定时器
                            this.timer = null;
                        }
                    }, 1000);
                }
            } else {
                this.$message({
                    type: "failed",
                    message: "发送失败!"
                });
            }
        },
        changeInput() {},
        close() {
            this.$store.commit("CLOSERIGHTPANNEL", false);
        },
        submitForm(formName) {
            //  如果已经设置过密码 调修改接口

            this.$refs[formName].validate(valid => {
                console.log(valid);
                if (valid) {
                    this.setPaw();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        async setPaw() {
            let option = this.ruleForm;
            console.log(option);
            let { status } = await updateUserPwd(option);
            if (status === 200) {
                this.isSetPassWord = true;                
                 this.$message({
                    type: "success",
                    message: "设置成功!"
                });                
                this.$store.commit("CLOSERIGHTPANNEL", false);
                this.$emit('setPwdTitleAndBtn');
            }
        },
        async modifyPaw() {
            let option = {
                phone: this.phone,
                code: this.code,
                ...this.ruleForm
            };
            let { status } = await changeUserPwd(option);
            if (status === 200) {
                 this.$message({
                    type: "success",
                    message: "修改成功!"
                });
                 this.$store.commit("CLOSERIGHTPANNEL", false);
            }
        },
        // 点击下一步
        async nextStep() {
            if (!this.isSetPassWord) {
                this.submitForm("ruleForm");
                return;
            }
            let code = this.ruleFormCode.code;
            if (!code) {
                this.$message({
                    type: "warning",
                    message: "请输入验证码!"
                });
            } else {
                let { status } = await isInvalidCode(this.sourcePhone, code);
                if (status === 200) {
                    this.isModifi = true;
                    this.isSetPassWord = false;
                    if (!this.isModifi) {
                        this.$store.commit("CLOSERIGHTPANNEL", false);
                        this.timer = setTimeout(() => {
                            this.$store.commit("CLOSERIGHTPANNEL", true);
                        }, 500);
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: "验证失败!"
                    });
                }
            }
        }
    },
    computed:{
        pannelShow(){
            return this.$store.state.isRightPanelShow
        }
    },
    watch:{
        pannelShow(){
            this.$refs.ruleForm.clearValidate()
             this.ruleForm = {
                passWrod: "",
                beSurePwd: ""
            };
              this.ruleFormCode = {
                phone: "",
                code: ""
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "./style/personal";
.setPwd {
    padding: 10px;
    .pwd-form {
        padding-top: 20px;
    }
}
.verification-code {
    position: relative;
}
.verification-text {
    position: absolute;
    top: 1px;
    bottom: 1px;
    right: 1px;
    border: none;
    color: red;
}
</style>
