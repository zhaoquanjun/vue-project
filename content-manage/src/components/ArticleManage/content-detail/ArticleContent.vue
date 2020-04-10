<template>
  <div class="article-content" id="article-content">
    <el-form
      class="base-ariticle"
      @submit.native.prevent
      :model="articleDetail"
      :rules="rules"
      ref="articleDetail"
    >
      <div class="content-item">
        <el-row>
          <el-col :span="24">
            <div class="content-title">基本信息</div>
          </el-col>
        </el-row>
        <el-form-item label prop="title">
          <el-input
            class="contentDetail-title"
            placeholder="请输入文章标题（必填）"
            v-model.trim="articleDetail.title"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label prop="summary" class="desc-textarea">
          <el-input
            type="textarea"
            placeholder="请输入文章简介"
            :autosize="{ minRows: 3, maxRows: 3 }"
            v-model="articleDetail.summary"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <div style="float:left">
              <span style="font-size:12px">分类</span>
              <span class="select-sort" style="width:200px;">
                <SelectTree
                  size="small"
                  placeholder="请选择"
                  :categoryName="categoryName"
                  :categoryId="categoryId"
                  :tree-result="treeResult"
                  @chooseNode="chooseNode"
                />
              </span>
            </div>
            <div style="float:right">
              <span style="font-size:12px">状态</span>
              <span class="select-sort">
                <el-select
                  size="small"
                  v-model="articleDetail.isPublish"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="content-item">
        <el-row>
          <el-col :span="24">
            <div class="content-title">文章详情</div>
          </el-col>
        </el-row>
        <el-form-item label prop="contentDetail">
          <!-- quill-editor 编辑一-->
          <quill-detail
            :siteId="siteId"
            :quillId="quillContentId"
            :detailContent="articleDetail.contentDetail"
            @detailContentChange="detailContentChange"
          ></quill-detail>
        </el-form-item>
      </div>
      <div class="content-item set-article">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="文章设置" name="1">
            <el-form-item label="时间">
              <div>
                <div style="float:left">
                  <el-col>
                    <el-form-item prop="publishTime">
                      <el-date-picker
                        type="datetime"
                        v-model="articleDetail.publishTime"
                        placeholder="选择日期时间"
                        style="width: 100%;"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </div>
                <div style="float:left;margin-left: 35px;">
                  <span
                    style="padding: 0 12px 0 0;color: #606266;font-size:12px;"
                    >预览网站</span
                  >
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      将在所选网站的二级域名下打开预览页面
                    </div>
                    <i class="iconfont iconyiwen"></i>
                  </el-tooltip>
                  <span class="select-sort">
                    <el-select
                      size="small"
                      :value="
                        articleDetail.defaultSiteId == 0
                          ? siteOptions[0] && siteOptions[0].siteId
                          : articleDetail.defaultSiteId
                      "
                      placeholder="请选择"
                      @change="changeSiteId"
                    >
                      <el-option
                        v-for="item in siteOptions"
                        :key="item.siteId"
                        :label="item.siteName"
                        :value="item.siteId"
                      ></el-option>
                    </el-select>
                  </span>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="置顶" prop="delivery">
              <el-switch v-model="articleDetail.isTop"></el-switch>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="content-item seo-key">
        <el-collapse v-model="activeName1" accordion>
          <el-collapse-item title="搜索引擎优化" name="1">
            <el-form-item label="SEO标题" prop="metaTitle">
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">不填写则默认使用文章标题</div>
                <i class="iconfont iconyiwen"></i>
              </el-tooltip>
              <el-input
                class="contentDetail-title"
                maxlength="100"
                show-word-limit
                placeholder="SEO标题"
                v-model="articleDetail.metaTitle"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="position:relative"
              label="SEO关键词"
              prop="metaKeywords"
            >
              <ul class="keyword-list" ref="metaKeywordList">
                <li
                  v-for="(item, index) in articleDetail.metaKeywords"
                  :key="index"
                >
                  {{ item }}
                  <i
                    class="el-icon-close"
                    @click.stop="removeCurmetaKeyWord(index)"
                  ></i>
                </li>
                <el-input
                  maxlength="10"
                  ref="metaKeywordsInput"
                  placeholder="每个关键词之间用回车键分离"
                  v-model="metaKeyword"
                  @keyup.enter.native="keywords(metaKeyword, 'metaKeywords')"
                  @blur="keywordsBlur(metaKeyword, 'metaKeywords')"
                ></el-input>
              </ul>
              <div class="el-form-item__error" v-if="isOutSeo">
                每篇文章最多填写5个关键词！
              </div>
              <!-- <el-input placeholder="SEO关键词" v-model="articleDetail.metaKeywords"></el-input> -->
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
  </div>
</template>
<script>
import environment from "@/environment/index";
import * as articleManageApi from "@/api/request/articleManageApi";
import SelectTree from "@/components/common/SelectTree";
import { formatDate } from "@/utlis/date.js";

import ModalContent from "@/components/ImgManage/index.vue";
import QuillDetail from "@/components/ProductManage/QuillDetail.vue";
export default {
  components: {
    SelectTree,
    ModalContent,
    QuillDetail
  },
  provide: {
    popper: true
  },
  data() {
    var checkWord = (rule, value, callback) => {
      if (value.length > 4) {
        callback("每篇文章最多填写5个关键词！");
      } else {
        callback();
      }
    };
    return {
      isOutSeo: false,
      isOutSearch: false,
      treeResult: null,
      categoryName: "全部分类",
      categoryId: -1,
      options: [
        {
          value: true,
          label: "上线"
        },
        {
          value: false,
          label: "下线"
        }
      ],
      siteOptions: [],
      value: true,
      activeName: "",
      activeName1: "",
      NewId: "",
      articleDetail: {
        NewId: "",
        title: "",
        categoryId: 0,
        summary: "",
        contentDetail: "",
        searchKeywords: [],
        isPublish: true,
        isLoggedInCanView: false,
        publishTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        isTop: false,
        metaTitle: "",
        metaKeywords: [],
        metaDescription: "",
        pictureUrl: "",
        defaultSiteId: 0,
        Language: this.$route.query.language || "zh-CN"
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入文章标题",
            trigger: "blur"
          }
        ]
      },
      isModalShow: false,
      editorOption: {},
      keywordValue: "",
      metaKeyword: "",
      isNewAdd: false,
      selectRangeIndex: 0,
      selectVideoRangeIndex: 0,
      videoShow: false,
      checkedList: [],
      ratio: [],
      origin: [],
      quillContentId: "quill-contentDetail",
      siteId: 0
    };
  },
  created() {
    var id = this.$route.query.id;
    this.NewId = id;
    this.articleDetail.categoryId = this.$route.query.categoryId;
    if (id != null || id != undefined) {
      this.getArticleDetail(id);
      this.$emit("changeOperateName", "编辑");
      this.$emit("changeSaveWay", true);
    }
    this.getTreeAsync();
    this.getSiteList();
  },
  methods: {
    textIndent(ele, width) {
      this.$nextTick(() => {
        ele.style.textIndent = width + "px";
      });
    },
    keywords(value, name) {
      this.metaKeyword = this.keywordValue = "";
      if (name === "metaKeywords") {
        if (this.articleDetail.metaKeywords.length >= 5 || !value) {
          this.isOutSeo = true;
          return;
        }
        this.isOutSeo = false;
        this.articleDetail.metaKeywords.push(value);
      } else {
        if (this.articleDetail.searchKeywords.length >= 5 || !value) {
          this.isOutSearch = true;
          return;
        }
        this.isOutSearch = false;
        this.articleDetail.searchKeywords.push(value);
      }
    },
    keywordsBlur(value, name) {
      this.metaKeyword = this.keywordValue = "";
      if (name === "metaKeywords") {
        this.isOutSeo = false;
      } else {
        this.isOutSearch = false;
      }
    },
    removeCurKeyWord(index) {
      this.articleDetail.searchKeywords.splice(index, 1);
    },
    removeCurmetaKeyWord(index) {
      this.articleDetail.metaKeywords.splice(index, 1);
    },
    async getTreeAsync() {
      let { data } = await articleManageApi.getArticleCategory({
        language: this.articleDetail.Language
      });
      this._setTreeNodeDisabled(data);
      this.treeResult = data;
      var categoryName = this.$route.query.categoryName;
      if (categoryName != null || categoryName != undefined) {
        this.categoryName = categoryName;

        this.categoryId = parseFloat(this.$route.query.categoryId);
      } else {
        this.categoryId = 0;
      }
    },
    _setTreeNodeDisabled(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].id < 0) {
          data[i].disabled = true
        }
        if (data[i].children && data[i].children.length > 0) {
          this._setTreeNodeDisabled(data[i].children)
        }
      }
    },
    async getArticleDetail(id) {
      let { data } = await articleManageApi.getArticleDetail(id);
      if (Object.keys(data.metaKeywords).length < 1) {
        data.metaKeywords = [];
      } else {
        data.metaKeywords = data.metaKeywords.split(",");
      }
      if (Object.keys(data.searchKeywords).length < 1) {
        data.searchKeywords = [];
      } else {
        data.searchKeywords = data.searchKeywords.split(",");
      }
      this.articleDetail = data;
      document
        .getElementById(this.quillContentId)
        .querySelector(
          ".ql-editor"
        ).innerHTML = this.articleDetail.contentDetail;
      this.articleDetail.NewId = data.id;
      this.$emit("changePreviewId", id, this.articleDetail.defaultSiteId);
    },
    //选择移动分类时的节点
    chooseNode(node) {
      if (node.id >= 0) {
        this.articleDetail.categoryId = node.id;
        this.categoryName = node.label;
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新建保存
    submitForm(formName, imageUrl) {
      this.articleDetail.pictureUrl = imageUrl;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.type = "create";
          var html = document
            .getElementById(this.quillContentId)
            .querySelector(".ql-editor").innerHTML;
          this.articleDetail.contentDetail = html;
          this._createSave();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新建确认保存
    async _createSave() {
      let { status, data } = await articleManageApi.createArticle(
        this.articleDetail
      );
      this.NewId = data;
      this.articleDetail.NewId = data;
      console.log(this.NewId, "-=-=-=");
      status === 200 && this._complateCreate();
    },
    // 编辑保存
    editArticle(formName, imageUrl) {
      this.articleDetail.pictureUrl = imageUrl;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.type = "edit";
          var html = document
            .getElementById(this.quillContentId)
            .querySelector(".ql-editor").innerHTML;
          this.articleDetail.contentDetail = html;
          this.editSave();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 保存
     */
    async editSave() {
      let { status } = await articleManageApi.editArticle(this.articleDetail);
      status === 200 && this._completeEdit();
    },
    /**
     * 完成编辑
     */
    _completeEdit() {
      this.$confirm("保存成功!", "提示", {
        confirmButtonText: "新增下一篇",
        customClass: "medium",
        iconClass: "icon-success",
        cancelButtonText: "关闭",
        callback: async action => {
          if (action === "confirm") {
            this.resetForm("articleDetail");
            this.resetDetail();
            this.$emit("changeSaveWay", false);
            this.$emit("changePreviewId", "", 0);
            this.$route.query.id = false;
          } else {
            console.log(this.NewId, "-=-=-=");
            this.articleDetail.NewId = this.$route.query.id || this.NewId;
            this.$emit("changeSaveWay", true);
            this.$emit(
              "changePreviewId",
              this.articleDetail.NewId,
              this.articleDetail.defaultSiteId
            );
          }
        }
      });
    },
    /**
     * 完成新建
     */
    _complateCreate() {
      this.$confirm("保存成功!", "提示", {
        confirmButtonText: "新增下一篇",
        iconClass: "icon-success",
        cancelButtonText: "关闭",
        callback: async action => {
          if (action === "confirm") {
            this.resetForm("articleDetail");
            this.resetDetail();
            this.$emit("changeSaveWay", false);
            this.$emit("changePreviewId", "", 0);
          } else {
            this.$emit("changeSaveWay", true);
            this.$emit(
              "changePreviewId",
              this.NewId,
              this.articleDetail.defaultSiteId
            );
          }
        }
      });
    },
    onEditorChange({ editor, html, text }) {
      this.articleDetail.contentDetail = html;
    },
    resetDetail() {
      this.articleDetail = {
        NewId: "",
        title: "",
        categoryId: this.articleDetail.categoryId,
        summary: "",
        contentDetail: "",
        searchKeywords: [],
        isPublish: true,
        publishTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        isTop: false,
        metaTitle: "",
        metaKeywords: [],
        metaDescription: "",
        pictureUrl: "",
        defaultSiteId: 0,
        Language: "zh-CN"
      };
      document.getElementsByClassName("ql-editor")[0].innerHTML = "";
    },
    //获取app下所有站点
    async getSiteList() {
      let { data } = await articleManageApi.getSiteList();
      this.siteOptions = data;
      this.siteId = this.siteOptions[0].siteId;
    },
    changeSiteId(siteId) {
      this.siteId = siteId;
      this.articleDetail.defaultSiteId = siteId;
    },
    detailContentChange(html) {
      this.articleDetail.contentDetail = html;
    }
  },
  watch: {
    "articleDetail.searchKeywords"() {
      if (this.articleDetail.searchKeywords.length < 5) {
        this.isOutSearch = false;
      }
    },
    "articleDetail.metaKeywords"() {
      if (this.articleDetail.metaKeywords.length < 5) {
        this.isOutSeo = false;
      }
    },
    deep: true,
    immediate: true
  }
};
</script>

<style scoped lang="scss">
@import "@/components/style/contentDetail.scss";
</style>
<style scoped lang="scss">
.quill-editor /deep/ .ql-container {
  height: 420px;
  overflow: hidden;
}
.el-textarea /deep/ .el-input__count {
  background: #fff;
  bottom: 1px;
  right: 22px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
  padding-bottom: 50px;
}
.select-sort /deep/ .el-select {
  width: 220px;
}
.article-content /deep/ .el-collapse-item__header {
  font-size: $--font-size-base;
  font-weight: 600;
}
.article-content /deep/ .el-form-item__label {
  font-size: $--font-size-small;
}
</style>

<style lang="scss">
/* 字体大小 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "字体大小";
}
/* 标题 */
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "标题";
}
/* 字体 */
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "字体";
}

.editor-fullscreen {
  background: white;
  margin: 0 !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  .ql-editor {
    position: relative;
    height: 100%;
  }
  .fullscreen-editor {
    border-radius: 0;
    border: none;
  }
  .ql-container {
    height: calc(100vh - 3rem - 24px) !important;
    margin: 0 auto;
    overflow-y: auto;
  }
}
</style>
<style lang="scss" scoped>
#content {
  overflow: hidden;
}
#videoContent {
  position: fixed;
  width: 1170px;
  // height: 840px;
  margin: auto;
  z-index: 1020;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  box-shadow: 0px 2px 32px 4px rgba(0, 0, 0, 0.13);
  border: $--border-base;
  border-radius: $--border-radius-base;
}
#videoContent .modal-header {
  background: rgb(255, 255, 255);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: $--border-base;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
  }
}
#videoContent .el-container {
  background: #fff;
  height: 773px;
}
#videoContent .el-dialog {
  margin-top: 5vh !important;
  width: 80%;
  overflow: hidden;
}
#videoContent .el-dialog__body {
  padding-top: 0;
}

.modal-footer {
  float: right;
  height: 88px;

  position: absolute;
  bottom: -11px;
  right: 16px;
  width: 100%;
  z-index: 100;
  text-align: right;
  padding-top: 0;
  button {
    margin-top: 24px;
  }
}
</style>
