<template>
  <div class="article-content" id="article-content">
    <el-form
      class="base-ariticle"
      @submit.native.prevent
      :model="detailData"
      :rules="rules"
      ref="contentForm"
    >
      <div class="content-item">
        <el-row>
          <el-col :span="24">
            <div class="content-title">基本信息</div>
          </el-col>
        </el-row>
        <el-form-item label prop="name">
          <el-input
            class="contentDetail-title"
            placeholder="请输入产品标题（必填）"
            v-model.trim="detailData.name"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label prop="summary" class="desc-textarea">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            placeholder="请输入产品简介"
            v-model="detailData.description"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="flexSpace">
            <div>
              <span style="font-size:12px">分类</span>
              <span class="select-sort category">
                <div class="product-category" @click.stop="multipleCatagory">
                  <ul class="category-list">
                    <li
                      style="display:inline-block"
                      v-for="item in detailData.productCategoryList"
                      :key="item.id"
                      @click.stop
                    >
                      <div class="category-item">
                        <span>{{ item.displayName }}</span>
                        <i
                          v-if="item.id != 0"
                          class="el-icon-close"
                          @click="removeCategory(item.id)"
                        ></i>
                      </div>
                    </li>
                  </ul>
                  <span
                    @click.stop="multipleCatagory"
                    class="el-select__caret"
                    :class="[
                      isCheckTreeShow === true
                        ? 'el-icon-arrow-up'
                        : 'el-icon-arrow-down'
                    ]"
                  ></span>
                </div>
                <div
                  class="multipleCatagory"
                  :style="{ height: isCheckTreeShow ? 'auto' : 0 }"
                >
                  <DetailCheckTree
                    ref="detailCheckTree"
                    :tree-result="treeResult"
                    :categoryName="categoryName"
                    :categoryId="categoryId"
                    @chooseNode="chooseNode"
                  />
                </div>
              </span>
            </div>
            <div>
              <span style="font-size:12px">状态</span>
              <span class="select-sort">
                <el-select
                  size="small"
                  v-model="detailData.isOnSell"
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
            <div class="content-title">产品详情</div>
          </el-col>
        </el-row>
        <el-form-item label prop="contentDetail">
          <!-- quill-editor 编辑一-->
          <quill-detail
            :siteId="siteId"
            :quillId="quillContentId"
            :detailContent="detailData.contentDetail"
            @detailContentChange="detailContentChange1"
          ></quill-detail>
        </el-form-item>
      </div>
      <div class="content-item set-article">
        <el-collapse v-model="activeName0" accordion>
          <el-collapse-item title="规格详情" name="1">
            <el-form-item label prop="specificationContent">
              <!-- quill-editor 编辑一-->
              <quill-detail
                :siteId="siteId"
                :quillId="quillDetailId"
                :detailContent="detailData.specificationContent"
                @detailContentChange="detailContentChange"
              ></quill-detail>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="content-item set-article">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="产品设置" name="1">
            <el-form-item label="时间">
              <div>
                <div style="float:left">
                  <el-col>
                    <el-form-item prop="createTime">
                      <el-date-picker
                        type="datetime"
                        v-model="detailData.publishTime"
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
                        detailData.defaultSiteId == 0
                          ? siteOptions[0] && siteOptions[0].siteId
                          : detailData.defaultSiteId
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

            <el-form-item></el-form-item>
            <el-form-item label="置顶" prop="delivery">
              <el-switch v-model="detailData.isTop"></el-switch>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="content-item seo-key">
        <el-collapse v-model="activeName1" accordion>
          <el-collapse-item title="搜索引擎优化" name="1">
            <el-form-item label="seo标题" prop="seoTitle">
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">不填写则默认使用产品标题</div>
                <i class="iconfont iconyiwen"></i>
              </el-tooltip>
              <el-input
                class="contentDetail-title"
                maxlength="100"
                show-word-limit
                placeholder="seo标题"
                v-model="detailData.seoTitle"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="position:relative"
              label="seo关键词"
              prop="seoKeyword"
            >
              <ul class="keyword-list" ref="metaKeywordList">
                <li v-for="(item, index) in detailData.seoKeyword" :key="index">
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
                  @keyup.enter.native="keywords(metaKeyword, 'seoKeyword')"
                  @blur="keywords(metaKeyword, 'seoKeyword')"
                ></el-input>
              </ul>
              <div class="el-form-item__error" v-if="isOutSeo">
                每篇文章最多填写5个关键词！
              </div>
              <!-- <el-input placeholder="seo关键词" v-model="detailData.seoKeyword"></el-input> -->
            </el-form-item>

            <el-form-item label="自定义地址" prop="customUrl">
              <el-input
                placeholder="请输入自定义地址"
                class="address"
                v-model="detailData.customUrl"
              ></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="content-item seo-key"></div>
    </el-form>
  </div>
</template>
<script>
import environment from "@/environment/index";
import * as productManageApi from "@/api/request/productManageApi";
import * as productCategoryManageApi from "@/api/request/productCategoryManageApi";
import DetailCheckTree from "./DetailCheckTree";
const viewAuth = [
  { name: "全选", id: 0 },
  { name: "登录用户", id: 1 },
  { name: "未登录用户", id: 2 }
];

import ModalContent from "@/components/ImgManage/index.vue";
import QuillDetail from "@/components/ProductManage/QuillDetail.vue";
import QuillContentDetail from "@/components/ProductManage/QuillDetail.vue";

export default {
  components: {
    ModalContent,
    DetailCheckTree,
    QuillDetail,
    QuillContentDetail
  },
  provide: {
    popper: true
  },
  data() {
    return {
      isCheckTreeShow: false,
      isOutSeo: false,
      isOutSearch: false,
      checkAll: false,
      checkedviewAuth: [{ name: "登录用户", id: 1 }],
      viewAuth: viewAuth,
      isIndeterminate: true,
      options: [
        {
          value: true,
          label: "上架"
        },
        {
          value: false,
          label: "下架"
        }
      ],
      value: "上架",
      options1: [
        {
          value: "选项1",
          label: "全部分类1"
        },
        {
          value: "选项2",
          label: "全部分类2"
        }
      ],
      value2: ["全部分类1", "全部分类2"],

      siteOptions: [],
      activeName: "",
      activeName0: "",
      activeName1: "",
      categoryName: [],
      categoryId: [],
      treeResult: null,
      detailData: {
        name: "",
        description: "",
        detailContent: "",
        price: 1, //
        costPrice: 1, //
        originalPrice: 1, //
        seoKeyword: [],
        searchKeyword: [],
        seoDescription: "",
        skuId: "", //
        publishTime: new Date(),
        customUrl: "",
        accessRoleList: [1],
        thumbnailPicUrlList: [],
        relatedProductList: [
          {
            id: "string",
            name: "string"
          }
        ],
        productCategoryList: [
          // {
          //     id: 1,
          //     displayName: "", //
          //     thumbnailPicUrl: "2" //
          // }
        ],
        params: { name: 1 }, //
        isTop: false,
        isLoggedInCanView: false,
        isOnSell: true,
        isTemplate: false, //
        isSkuSwitchOn: false, //
        isNeedShipping: false, //
        isAllowComment: true,
        defaultSiteId: 0,
        specificationContent: "",
        Language: "zh-CN"
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入产品标题",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ]
      },
      isModalShow: false,
      editorOption: {},
      keywordValue: "",
      metaKeyword: "",
      selectRangeIndex: 0,
      selectVideoRangeIndex: 0,
      videoShow: false,
      checkedList: [],
      ratio: [],
      origin: [],
      quillDetailId: "quill-specificationContent",
      quillContentId: "quill-contentDetail",
      siteId: 0
    };
  },
  created() {
    this.getTree();
  },
  mounted() {
    document.addEventListener("click", e => {
      e.stopPropagation();
      if (this.isCheckTreeShow) {
        this.multipleCatagory();
      }
      return false;
    });
    let categoryId = this.$route.query.categoryId;
    let categoryName = this.$route.query.categoryName;
    if (categoryId) {
      this.detailData.productCategoryList = [
        { id: categoryId, displayName: categoryName }
      ];
      this.categoryId = [categoryId];
    } else {
      this.detailData.productCategoryList = [
        { id: 0, displayName: "全部分类" }
      ];
    }
    var id = this.$route.query.id;
    this.curProduct = id;
    if (id != null || id != undefined) {
      this.getArticleDetail(id);
      this.$emit("changeSaveWay", true);
    }
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
      if (name === "seoKeyword") {
        if (this.detailData.seoKeyword.length >= 5 || !value) {
          return;
        }
        this.metaKeyword = "";
        this.detailData.seoKeyword.push(value);
      } else {
        if (this.detailData.searchKeyword.length >= 5 || !value) {
          return;
        }
        this.keywordValue = "";
        this.detailData.searchKeyword.push(value);
      }
    },
    removeCurKeyWord(index) {
      this.detailData.searchKeyword.splice(index, 1);
    },
    removeCurmetaKeyWord(index) {
      this.detailData.seoKeyword.splice(index, 1);
    },
    async getArticleDetail(id) {
      let { data } = await productManageApi.getProductDetail(id);
      this.categoryId = [];

      if (Object.keys(data.seoKeyword).length < 1) {
        data.seoKeyword = [];
      } else {
        data.seoKeyword = data.seoKeyword.split(",");
      }
      if (Object.keys(data.searchKeyword).length < 1) {
        data.searchKeyword = [];
      } else {
        data.searchKeyword = data.searchKeyword.split(",");
      }
      this.detailData = data;
      this.detailData.NewId = data.id;
      document
        .getElementById(this.quillContentId)
        .querySelector(".ql-editor").innerHTML = this.detailData.detailContent;
      document
        .getElementById(this.quillDetailId)
        .querySelector(
          ".ql-editor"
        ).innerHTML = this.detailData.specificationContent;
      this.categoryIdList(this.detailData.productCategoryList);
      this.$emit("changePreviewId", id, this.detailData.defaultSiteId);
    },
    categoryIdList(list) {
      this.categoryId = [];
      list.forEach(item => {
        this.categoryId.push(item.id);
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新建提交
    submitForm(formName, fileList, storeInfo) {
      this.detailData.thumbnailPicUrlList = fileList;
      this.detailData.currencyType = storeInfo.storeTypeValue;
      this.detailData.originalPrice = storeInfo.originalPrice;
      this.detailData.price = storeInfo.price;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var html = document
            .getElementById(this.quillContentId)
            .querySelector(".ql-editor").innerHTML;
          var specification = document
            .getElementById(this.quillDetailId)
            .querySelector(".ql-editor").innerHTML;
          this.detailData.detailContent = html;
          this.detailData.specificationContent = specification;
          this._createSave();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新建确认保存
    async _createSave() {
      let { status } = await productManageApi.createProduct(this.detailData);
      status === 200 && this._complateCreate();
    },
    // 编辑提交
    editArticle(formName, fileList, storeInfo) {
      if (fileList && fileList.length > 0) {
        this.detailData.thumbnailPicUrlList = fileList;
      }
      this.detailData.currencyType = storeInfo.storeTypeValue;
      this.detailData.originalPrice = storeInfo.originalPrice;
      this.detailData.price = storeInfo.price;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveArticle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑确认保存
    async saveArticle() {
      var html = document
        .getElementById(this.quillContentId)
        .querySelector(".ql-editor").innerHTML;
      var specification = document
        .getElementById(this.quillDetailId)
        .querySelector(".ql-editor").innerHTML;
      this.detailData.detailContent = html;
      this.detailData.specificationContent = specification;
      this.editSave();
    },
    /**
     * 保存
     */
    async editSave() {
      let { status } = await productManageApi.update(
        this.curProduct,
        this.detailData
      );
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
            this.$emit("clearStoreInfo");
            this.resetForm("contentForm");
            this.resetDetail();
            this.$emit("changeSaveWay", false);
            this.$emit("changePreviewId", "", 0);
            this.$emit("handlerClickNewAdd");
            this.$route.query.isEditor = 0;
          } else {
            this.detailData.id = this.curProduct;
            this.$emit("changeSaveWay", true);
            this.$emit(
              "changePreviewId",
              this.detailData.NewId,
              this.detailData.defaultSiteId
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
            this.$emit("clearStoreInfo");
            this.resetForm("contentForm");
            this.resetDetail();
            this.$emit("changeSaveWay", false);
            this.$emit("changePreviewId", "", 0);
            this.$emit("handlerClickNewAdd");
            // this.$refs.detailCheckTree.resetChecked();
          } else {
            this.$emit("changeSaveWay", true);
            this.$emit(
              "changePreviewId",
              this.curProduct,
              this.detailData.defaultSiteId
            );
          }
        }
      });
    },
    /**
     * 获取 tree 结构
     */
    async getTree() {
      let { data } = await productCategoryManageApi.get();
      this.treeResult = data.treeArray;
    },
    chooseNode(data, boolean) {
      if (boolean) {
        if (!this.categoryId.includes(data.id)) {
          if (this.detailData.productCategoryList.length >= 5) {
            this.$notify({
              customClass: "notify-error",
              message: `一个产品最多设置五个分类!`,
              showClose: false,
              duration: 1500
            });
            return;
          }
          if (this.detailData.productCategoryList[0].id == 0) {
            this.$refs.detailCheckTree.setChecked(0);
          }
          this.detailData.productCategoryList.push({
            displayName: data.label,
            id: data.id,
            thumbnailPicUrl: data.thumbnailPicUrl
          });
        }
        if (this.detailData.productCategoryList[0].id == 0) {
          if (this.$route.query.isEditor != 1)
            this.detailData.productCategoryList.splice(0, 1);
        }
      } else {
        this.categoryId = [];
        this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
          item => {
            if (item.id != data.id) {
              this.categoryId.push(item.id);
              return true;
            }
          }
        );

        if (this.detailData.productCategoryList.length == 0) {
          this.detailData.productCategoryList = [
            { id: 0, displayName: "全部分类" }
          ];
        }
      }
    },
    //  移除已选择的分类
    removeSeletedCategory(cur) {
      let productCategoryList = this.detailData.productCategoryList;
      this.detailData.productCategoryList = productCategoryList.filter(item => {
        return item.displayName != cur;
      });
    },
    onEditorChange({ editor, html, text }) {
      this.detailData.detailContent = html;
    },
    fullScreenHandler() {
      //console.log('fullScreenHandler');
    },
    resetDetail() {
      let detailData = {
        name: "",
        description: "",
        detailContent: "",
        price: 1, //
        costPrice: 1, //
        originalPrice: 1, //
        seoKeyword: [],
        searchKeyword: [],
        seoDescription: "",
        skuId: "", //
        publishTime: new Date(),
        customUrl: "",
        accessRoleList: [1],
        thumbnailPicUrlList: [],
        relatedProductList: [
          {
            id: "string",
            name: "string"
          }
        ],

        params: { name: 1 }, //
        isTop: false,
        isOnSell: true,
        isTemplate: false, //
        isSkuSwitchOn: false, //
        isNeedShipping: false, //
        isAllowComment: true,
        defaultSiteId: 0,
        Language: "zh-CN"
      };
      this.detailData = { ...this.detailData, ...detailData };
      document
        .getElementById(this.quillContentId)
        .querySelector(".ql-editor").innerHTML = "";
      document
        .getElementById(this.quillDetailId)
        .querySelector(".ql-editor").innerHTML = "";
    },
    multipleCatagory() {
      this.isCheckTreeShow = !this.isCheckTreeShow;
    },

    removeCategory(id) {
      this.$refs.detailCheckTree.setChecked(id);
      this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
        item => {
          return item.id != id;
        }
      );
    },
    //获取app下所有站点
    async getSiteList() {
      let { data } = await productManageApi.getSiteList();
      this.siteOptions = data;
      this.siteId = this.siteOptions[0].siteId;
    },
    changeSiteId(siteId) {
      this.siteId = siteId;
      this.detailData.defaultSiteId = siteId;
    },
    detailContentChange(html) {
      this.detailData.specificationContent = html;
    },
    detailContentChange1(html) {
      this.detailData.contentDetail = html;
    }
  },

  watch: {
    "detailData.searchKeyword"() {
      if (this.detailData.searchKeyword.length >= 5) {
        this.isOutSearch = true;
      } else {
        this.isOutSearch = false;
      }
    },
    "detailData.seoKeyword"() {
      if (this.detailData.seoKeyword.length >= 5) {
        this.isOutSeo = true;
      } else {
        this.isOutSeo = false;
      }
    },
    deep: true
  }
};
</script>

<style scoped lang="scss">
@import "../../style/contentDetail";
.address /deep/ .el-input__inner {
  height: 35px;
  line-height: 35px;
}
.category {
  position: relative;
  vertical-align: middle;
}
.product-category {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  min-height: 20px;
  width: 250px;
  border: $--border-base;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  .category-list {
    .category-item {
      display: inline-block;
      border: $--border-base;
      color: #fff;
      border-radius: 30px;
      padding: 5px 10px;
      margin-bottom: 5px;
      font-size: $--font-size-small;
      margin-right: 5px;
      background: $--color-primary;
      .el-icon-close {
        cursor: pointer;
        color: #fff;
      }
    }
  }
  .el-select__caret {
    color: #c0c4cc;
    font-size: $--font-size-small;
    cursor: pointer;
  }
}

.multipleCatagory {
  height: 0;
  margin-top: 12px;
  width: 238px;
  position: absolute;
  background: #fff;
  z-index: 10;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}
.modal-footer {
  height: 60px;
  position: absolute;
  bottom: -11px;
  right: 16px;
  width: 100%;
  z-index: 100;
  text-align: right;
  padding-top: 0;
}
</style>

<style lang="scss">
.el-textarea /deep/ .el-input__count {
  background: #fff;
  bottom: 1px;
  right: 16px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
  padding-bottom: 50px;
}
.article-content /deep/ .el-collapse-item__content {
  font-size: $--font-size-base;
}
.article-content /deep/ .el-collapse-item__header {
  font-size: $--font-size-base;
  font-weight: 600;
}
.article-content /deep/ .el-form-item__label {
  font-size: $--font-size-small;
}
.set-article /deep/ .el-select {
  width: 220px;
}
.flexSpace {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
