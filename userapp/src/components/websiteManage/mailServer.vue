<template>
  <el-container class="member-container">
    <el-aside style="width:100px">
      <page-submenu :submenu-list="submenuList">
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content" style="padding:32px">
      <el-row class="user-list">
        <span class="member-list-title fs14">邮件服务器</span>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form
            :model="mailDetail"
            :rules="rules"
            ref="mailDetail"
            label-width="100px"
            class="demo-ruleForm"
            style="margin-top:40px"
          >
            <el-form-item label="邮件服务器" prop="host">
              <el-input v-model="mailDetail.host"></el-input>
            </el-form-item>
            <el-form-item label="SSL" prop="SSL">
              <el-switch v-model="mailDetail.enableSsl"></el-switch>
            </el-form-item>
            <el-form-item label="邮件账号" prop="accountName">
              <el-input v-model="mailDetail.accountName"></el-input>
            </el-form-item>
            <el-form-item label="邮件密码" prop="password">
              <el-input v-model="mailDetail.password"></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port">
              <el-input v-model="mailDetail.port">25</el-input>
            </el-form-item>
            <el-form-item label="发件人姓名" prop="fromAlias">
              <el-input v-model="mailDetail.fromAlias"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="createBtn" @click="submitForm('mailDetail')">立即创建</el-button>
              <!-- <el-button @click="resetForm('mailDetail')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import { getExternalUserInfo, removeExternalUser } from "@/api/index.js";
import * as mailServerApi from "@/api/request/mailServerApi";
export default {
  components: {
    PageSubmenu
  },
  data() {
    return {
      mailDetail: {
        id: 0,
        host: null,
        enableSsl: false,
        accountName: null,
        password: null,
        port: 25,
        fromAlias: null
      },
      rules: {
        host: [
          { required: true, message: "请输入邮件服务器", trigger: "blur" }
        ],
        accountName: [
          { required: true, message: "请输入邮件账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入邮件密码", trigger: "blur" }
        ],
        port: [{ required: true, message: "请填写端口", trigger: "blur" }],
        fromAlias: [
          { required: true, message: "请填写发件人姓名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getMailAccountDetail();
  },
  methods: {
    async getMailAccountDetail() {
      let { data } = await mailServerApi.getMailAccountDetail();
      this.mailDetail = data;
      console.log(data, "000-----");
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      if (this.mailDetail.id > 0) {
        this.editMailAccount("mailDetail");
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.insertMailAccount();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //插入邮件配置
    async insertMailAccount() {
      let { status, data } = await mailServerApi.createMailAccount(
        this.mailDetail
      );
      if (status === 200) {
        this.$message({
          type: "success",
          message: "添加成功!"
        });
      }
    },
    // 编辑提交
    editMailAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveMailAccount();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑保存邮件配置
    async saveMailAccount() {
      let { status, data } = await mailServerApi.editMailAccount(
        this.mailDetail
      );
      if (status === 200) {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
      }
    },
    /**
     * 重置表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>

<style lang="scss" scoped>
.member-container {
  position: relative;
  .user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 24px;
    .member-list-title {
      border-left: 4px solid #01c0de;
      padding-left: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.createBtn {
  background: rgba(1, 192, 222, 1);
  border: none;
  border-radius: 2px;
}
</style>
