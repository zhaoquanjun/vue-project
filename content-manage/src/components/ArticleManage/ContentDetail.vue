<template>
  <div style="margin-left:20px">
    <el-form
      :model="articleDetail"
      :rules="rules"
      ref="articleDetail"
      label-width="100px"
      v-if="JSON.parse(JSON.stringify(articleDetail)) !== {}"
    >
      <el-form-item label prop="title">
        <el-input placeholder="请输入文章标题（必填）" v-model="articleDetail.title"></el-input>
      </el-form-item>
      <el-form-item label prop="summary">
        <el-input type="textarea" :rows="10" placeholder="请输入文章简介" v-model="articleDetail.summary"></el-input>
      </el-form-item>
      <el-form-item label prop="contentDetail">
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入文章详情"
          v-model="articleDetail.contentDetail"
        ></el-input>
      </el-form-item>
      <el-form-item label prop="searchKeywords">
        <el-input placeholder="搜索关键词" v-model="articleDetail.searchKeywords"></el-input>
      </el-form-item>
      <el-form-item label="时间" required>
        <el-col :span="11">
          <el-form-item prop="createTime">
            <el-date-picker
              type="datetime"
              v-model="articleDetail.createTime"
              placeholder="选择日期时间"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="允許評論" prop="isTop">
        <el-switch v-model="articleDetail.isTop"></el-switch>
      </el-form-item> -->
      <el-form-item label="置頂" prop="delivery">
        <el-switch v-model="articleDetail.isTop"></el-switch>
      </el-form-item>
      <el-form-item label="seo标题" prop="metaTitle">
        <el-input placeholder="seo标题" v-model="articleDetail.metaTitle"></el-input>
      </el-form-item>
      <el-form-item label="seo关键词" prop="metaKeywords">
        <el-input placeholder="seo关键词" v-model="articleDetail.metaKeywords"></el-input>
      </el-form-item>
      <el-form-item label="文章描述" prop="metaDescription">
        <el-input placeholder="文章描述" v-model="articleDetail.metaDescription"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('articleDetail')">立即创建</el-button>
        <el-button @click="resetForm('articleDetail')">重置</el-button>
        <el-button type="primary" @click="editArticle('articleDetail')">编辑保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as articleManageApi from "@/api/request/articleManageApi";
export default {
  data() {
    return {
      articleDetail: {
        NewId: "",
        title: "",
        summary: "",
        contentDetail: "",
        searchKeywords: "",
        createTime: new Date(),
        isTop: false,
        metaTitle: "",
        metaKeywords: "",
        metaDescription: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        createTime: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    var id = this.$route.query.id;
    if (id != null || id != undefined) {
      this.getArticleDetail(id);
    }
  },
  mounted() {},
  methods: {
    async getArticleDetail(id) {
      let { data } = await articleManageApi.getArticleDetail(id);
      this.articleDetail = data;
      this.articleDetail.NewId = data.id;
    },
    // 新建保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.insertArticle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //插入文章
    async insertArticle() {
      let { status, data } = await articleManageApi.createArticle(
        this.articleDetail
      );
      if (status === 200) {
        this.$message({
          type: "success",
          message: "添加成功!"
        });
        this.$router.push(`/create?id=${data}`);
      }
    },
    // 编辑提交
    editArticle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.saveArticle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑保存文章
    async saveArticle() {
      let { status, data } = await articleManageApi.editArticle(
        this.articleDetail
      );
      if (status === 200) {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
      }
    },
  }
};
</script>

