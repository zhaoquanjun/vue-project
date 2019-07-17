
<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <div v-if="!isModifi">
                <el-form-item prop="verification" class="verification-code">
                    <el-input
                        type="verification"
                        v-model="ruleForm.verification"
                        autocomplete="on"
                        placeholder="验证码"
                        @input="changeInput"
                    ></el-input>
                    <el-button class="verification-text" @click="send" :disabled="disabled=!show">
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </el-button>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item prop="phone">
                    <el-input v-model.number="ruleForm.phone" autocomplete="on" placeholder="手机号">
                        <span slot="prefix">
                            <svg-icon icon-class="search-icon"></svg-icon>
                        </span>
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
                        type="verification"
                        v-model="ruleForm.verification"
                        autocomplete="on"
                        placeholder="验证码"
                        @input="changeInput"
                    ></el-input>
                    <el-button class="verification-text" @click="sendChangePhoneCode" :disabled="disabled=!show">
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
 
<script>
    import { watch } from "fs"; 
    import { updateUserPhone } from "@/api/index.js";
    import { sendSourcePhoneCode } from "@/api/index.js";
    import { sendTargetPhoneCode } from "@/api/index.js"; 
const TIME_COUNT = 60; //更改倒计时时间
export default {        
    props: ["sourcePhone","isModifi"],
    created() {},
    data() {
        var checkPhone = (rule, value, callback) => {
            console.log(this.activeName);
            if (!value) {
                return callback(new Error("手机号不能为空"));
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                    // if(this.activeName!="first1"){
                    //     return callback(new Error("不能与当前手机号相同"));
                    // }
                    callback();
                } else {
                    return callback(new Error("您输入的手机号格式有误,请重新输入"));
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
                password: ""
            },
            rules: {
                phone: [{ validator: checkPhone, trigger: "blur" }],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 16,
                        message: "长度在 6 到 16 个字符",
                        trigger: "blur"
                    }
                ]
                //verification: [
                //    {
                //        required: true,
                //        message: "请输入验证码",
                //        trigger: "blur"
                //    },
                //    { trigger: "blur" }
                //]
            },
            checked: false,
            isPwd: true,
            options: [
                {
                    value: "+86" ,
                    label: "中国大陆"
                },
                {
                    value: "+852",
                    label: "香港"
                },
                {
                    value: "+886",
                    label: "台湾"
                },
                {
                    value: "+1",
                    label: "美国"
                },
                {
                    value:"+44",
                    label: "英国" 
                },
                {
                    value: "+81" ,
                    label: "日本"
                },
                {
                    value: "+7",
                    label: "俄罗斯"
                },
                {
                    value: "+39",
                    label: "意大利"
                }
            ],
            value: "+86"
        };
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
        async sendChangePhoneCode() {
            console.log(this.value+this.ruleForm.phone);
            let targetPhone = this.ruleForm.phone;//this.value + this.ruleForm.phone;
            if (this.ruleForm.phone == null) {
                this.$message({
                    type: "failed",
                    message: "请先填写要绑定的手机号码!"
                });
            }else{
                let { status } = await sendTargetPhoneCode(this.sourcePhone,targetPhone);
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
                    let { status } = await updateUserPhone(this.ruleForm.phone,this.ruleForm.verification);
                    if (status === 200) {
                        this.$message({
                            type: "success",
                            message: "修改成功!"
                        });
                    } else {
                        this.$message({
                            type: "failed",
                            message: "改失败!"
                        });
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    },
    computed: {},
    watch: {
        isModifi() {
            console.log("我变化了");
            console.log(this.ruleForm.verification);
            this.ruleForm.verification = "";
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
