
<template>
    <div class="setPwd">
        <el-alert :closable="false" :title="tipTitle" type="success"></el-alert>
        <template v-if="!isSetPassWord">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="pwd-form">
                <el-form-item prop="password" class="verification-code">
                    <el-input
                        type="password"
                        v-model="ruleForm.password"
                        autocomplete="on"
                        placeholder="输入设置密码"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="beSurePwd" class="verification-code">
                    <el-input
                        type="password"
                        v-model="ruleForm.beSurePwd"
                        autocomplete="on"
                        placeholder="输入确认密码"
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
                    ></el-input>
                    <el-button class="verification-text" @click="send" :disabled="disabled=!show">
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </template>
        <div class="footer">
            <button class="confirm footer-btn" v-if="!isModifi" @click="nextStep">下一步</button>
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
        var checPwd = (rule, value, callback) => {
            
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
            if (value.length > 16) {
                callback(new Error("密码长度不能超过16位！"));
            } else if (value.length < 6) {
                callback(new Error("密码长度最低为6位！"));
            } else if (value !== this.ruleForm.password) {
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
                password: "",
                beSurePwd: ""
            },
            ruleFormCode: {
                phone: "",
                code: ""
            },

            rules: {
                password: [
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
                    this.isSetPassWord ? this.modifyPaw() : this.setPaw();
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
