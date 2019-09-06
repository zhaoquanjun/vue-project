
<template>
    <div class="login">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            @submit.native.prevent
        >
            <div v-if="isModifi">
                <el-form-item prop="verification" class="verification-code">
                    <el-input
                        :key="0"
                        type="verification"
                        v-model="ruleForm.verification"
                        autocomplete="on"
                        placeholder="短信验证码"
                        maxlength="6"
                    ></el-input>
                    <button class="verification-text" @click="send" :disabled="disabled=!show">
                        <span v-show="show">发送验证码</span>
                        <span v-show="!show" class="count">{{count}}秒后可重新获取</span>
                    </button>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item prop="phone">
                    <el-input :key="1" v-model="ruleForm.phone" autocomplete="on" placeholder="手机号">
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
                                <span
                                    style="float: right; color: #8492a6; font-size: 13px"
                                >{{ item.value }}</span>
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item prop="verification" class="verification-code">
                    <el-input
                        key="verification"
                        type="verification"
                        v-model="ruleForm.verification"
                        autocomplete="on"
                        placeholder="验证码"
                        maxlength="6"
                    ></el-input>
                    <button
                        class="verification-text"
                        @click="sendChangePhoneCode"
                        :disabled="disabled=!show"
                    >
                        <span v-show="show">发送验证码</span>
                        <span v-show="!show" class="count">{{count}}秒后可重新获取</span>
                    </button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
 
<script>
import { updateUserPhone, sendSourcePhoneCode, sendTargetPhoneCode} from "@/api/index.js";
const TIME_COUNT = 60; //更改倒计时时间
export default {
    props: ["sourcePhone", "isModifi"],
    created() {},
    data() {
        var checkPhone = (rule, value, callback) => {
            console.log(this.activeName);
            if (!value) {
                return callback(new Error("手机号不能为空"));
            } else {
                const reg = /^1[3|4|5|7|8]\d{9}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                    // if(this.activeName!="first1"){
                    //     return callback(new Error("不能与当前手机号相同"));
                    // }
                    callback();
                } else {
                    return callback(
                        new Error("您输入的手机号格式有误,请重新输入")
                    );
                }
            }
        };
        return {
            show: true, // 初始启用按钮
            count: "", // 初始化次数
            timer: null,
            activeName: "first",
            ruleForm: {
                phone: "",
                verification: ""
            },
            rules: {
                phone: [{ validator: checkPhone, trigger: "blur" }],
                verification: [
                    {
                        required: true,
                        message: "请输入短信验证码",
                        trigger: "blur"
                    }
                ]
            },
            checked: false,
            isPwd: true,
            options: [
                {
                    value: "中国大陆",
                    label: " +86"
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
    mounted() {},
    methods: {
        async send() {
            let { status } = await sendSourcePhoneCode();
            if (status === 200) {
                this.$notify({
                    customClass: "notify-success",
                    message: "发送成功",
                    duration: 1500,
                    showClose: false
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
                            this.count = "";
                        }
                    }, 1000);
                }
            } else {
                this.$notify({
                    customClass: "notify-error",
                    message: "发送失败",
                    duration: 1500,
                    showClose: false
                });
            }
        },
        async sendChangePhoneCode() {
            let targetPhone = this.ruleForm.phone; //this.value + this.ruleForm.phone;
            if (this.ruleForm.phone == "" || this.ruleForm.phone == null) {
                // this.$message({
                //     type: "failed",
                //     message: "请先填写要绑定的手机号码!"
                // });
            } else {
                let { status } = await sendTargetPhoneCode(
                    this.sourcePhone,
                    targetPhone
                );
                if (status === 200) {
                    this.$notify({
                        customClass: "notify-success",
                        message: "发送成功",
                        duration: 1500,
                        showClose: false
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
                                this.count = "";
                            }
                        }, 1000);
                    }
                } else {
                    this.$notify({
                        customClass: "notify-error",
                        message: "发送失败",
                        duration: 1500,
                        showClose: false
                    });
                }
            }
        },

        change(item) {
            this.value = item;
        },
        changeInput() {
            this.$emit("getSmsCode", this.ruleForm.verification);
        },
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    console.log(this.$refs[formName]);
                    let { status } = await updateUserPhone(
                        this.ruleForm.phone,
                        this.ruleForm.verification
                    );
                    if (status === 200) {
                        this.$message({
                            type: "success",
                            message: "修改成功!"
                        });
                        this.$store.commit("CLOSERIGHTPANNEL", false);
                        this.$emit("refreshIndex");
                    } else {
                        this.$message({
                            type: "failed",
                            message: "修改失败!"
                        });
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        submitForm1() {
            let result;
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    result = true;
                    return true;
                } else {
                    result = false;
                    return false;
                }
            });
            return result;
        },
        resetTimer() {
            clearInterval(this.timer); // 清除定时器
            this.timer = null;
            this.count = "";
            this.show = true;
            this.ruleForm.verification = "";
        }
    },
    computed: {
        pannelShow() {
            return this.$store.state.isRightPanelShow;
        }
    },

    watch: {
        pannelShow() {
            this.$refs.ruleForm.clearValidate();
            (this.ruleForm = {
                phone: "",
                verification: ""
            }),
                (this.show = true);
        }
    }
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
.el-select {
    width: 70px;
}
.dropdown__item {
    width: 150px;
}
.el-input--small .el-input__icon {
    line-height: 30px;
}
.el-input--prefix .el-input__inner {
    padding-left: 100px;
}
/* .el-select-dropdown{
  left: 262px !important;
} */
.el-scrollbar__wrap {
    width: 150px;
}
</style>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form /deep/ .el-form-item {
    margin-bottom: 30px;
}
.el-form-item.is-error /deep/ .el-input__inner {
    border-color: #e5e5e5;
}

.verification-code {
    position: relative;
}
.verification-code .el-button:hover,
.verification-code .el-button.is-disabled {
    background: transparent;
}
.verification-text {
    position: absolute;
    top: 1px;
    bottom: 1px;
    right: 1px;
    border: none;
    color: #00c1de;
    font-weight: 400;
    padding: 0 10px;
}
.count {
    color: #8c8c8c;
}
</style>