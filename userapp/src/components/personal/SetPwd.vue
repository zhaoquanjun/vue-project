
<template>
    <div class="setPwd">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">          
            <el-form-item prop="verification" class="verification-code">
                <el-input 
                            v-model="ruleForm.password"
                            autocomplete="on"
                            placeholder="输入设置密码">

                </el-input>
                <el-input 
                            v-model="ruleForm.confirmPassword"
                            autocomplete="on"
                            placeholder="输入确认密码">

                </el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!--<button class="confirm footer-btn" @click="modify">保存</button>
    <button class="cancel footer-btn" @click="close">取消</button>-->
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ruleForm: {
                    password: "",
                    confirmPassword: ''
                },
            }
        },
        method: {
            modify() {
                if (this.ruleForm.password == this.ruleForm.confirmPassword) {

                }
            },
            close() {
                 
            }
        }
    }
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
    /*@at-root*/
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
        .footer-btn

    {
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