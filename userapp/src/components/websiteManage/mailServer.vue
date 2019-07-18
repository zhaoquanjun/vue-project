<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">邮件服务器</span>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="邮件服务器" prop="mailServer">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="SSL" prop="SSL">
                            <el-switch v-model="ruleForm.SSL"></el-switch>
                        </el-form-item>
                        <el-form-item label="邮件账号" prop="mailAccount">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="邮件密码" prop="mailPassword">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="发件人姓名" prop="senderName">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                </el-form>
                </el-col>
            </el-row>
            
        </el-main>

    </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import { getExternalUserInfo, removeExternalUser } from '@/api/index.js';
export default {
  components:{
      PageSubmenu
  },
  data() {
        return {
            submenuList: [
                    { name: "网站备份", url: "/website/backup" },
                    { name: "我的网站", url: "/website/mysite" },
                    { name: "公司信息", url: "/website/companyinfo" },
                    { name: "域名管理", url: "/website/sitedomain" },
                    { name: "邮件服务器", url: "/website/email" },
            ],
            ruleForm: {
                mailServer: '',
                SSL: false,
                mailAccount: '',
                mailPassword: '',
                port: '',
                senderName: ''
            },
            rules: {
                mailServer: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                mailAccount: [
                    { required: true, message: '请选择活动区域', trigger: 'blur' }
                ],
                mailPassword: [
                    { required: true, message: '请选择活动资源', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            }
        }
  },
  methods: {
        /**
         * 提交表单
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /**
         * 重置表单
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
  },
}
</script>

<style scoped>

</style>

<style lang="scss" scoped>
.member-container {
    position: relative;
    .member-content {
        padding: 21px 14px;
    }
    .user-list {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        .member-list-title {
            border-left: 2px solid #01c0de;
            padding-left: 10px;
        }
    }
}
</style>
