<template>
  <div
    class="article-box"
    style="overflow: auto;
    height: calc(100vh - 60px);"
  >
    <header class="article-bg">
      <div class="article-crumbs">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item
            class="text-regular"
            :to="{ path: '/content/product' }"
            >内容管理</el-breadcrumb-item
          >
          <el-breadcrumb-item
            class="text-regular"
            :to="{ path: '/content/product' }"
            >产品管理</el-breadcrumb-item
          >
          <el-breadcrumb-item class="text-regular">{{
            isEditor == 1 ? "编辑产品" : "新增产品"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </header>
    <el-container class="article-container" style>
      <el-header style="height:32px">
        <div class="article-head">
          <div class="article-headTitle">
            {{ isEditor == 1 ? "编辑产品" : "新增产品" }}
          </div>
          <div class="article-btn">
            <button
              class="cl-button cl-button--small cl-button--primary_notbg"
              @click="_handleGoBack"
            >
              返回
            </button>
            <button
              class="cl-button cl-button--small cl-button--primary_notbg"
              v-if="isEdit"
              @click="preview"
            >
              预览
            </button>
            <Debounce :time="1000" !isDebounce>
              <button
                class="cl-button cl-button--small cl-button--primary"
                @click="submitForm"
              >
                保存
              </button>
            </Debounce>
          </div>
        </div>
      </el-header>
      <div class="domain-menu">
        <el-tabs v-model="productType" @tab-click="tabClick">
          <el-tab-pane label="产品信息" name="product"></el-tab-pane>
          <el-tab-pane label="电商设置" name="store"></el-tab-pane>
        </el-tabs>
      </div>
      <el-main style="overflow:hidden">
        <div class="articleContent" v-show="productType == 'product'">
          <div class="articleContentLeft">
            <leftContent
              ref="articleContent"
              @changeSaveWay="changeSaveWay"
              @handlerClickNewAdd="handlerClickNewAdd"
              @changePreviewId="changePreviewId"
              @clearStoreInfo="clearStoreInfo"
            />
          </div>
          <div class="articleContentRight">
            <RightContent :fileList="fileList" ref="articleRight" />
          </div>
        </div>
        <div class="storeContent" v-show="productType == 'store'">
          <storeContent
            ref="storeContent"
            :storeData="storeData"
          ></storeContent>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as productManageApi from "@/api/request/productManageApi";
import environment from "@/environment/index.js";
import RightContent from "./content-detail/RightContent";
import leftContent from "./content-detail/LeftContent";
import StoreContent from "./content-detail/storeContent";
export default {
  props: {
    uploadPicUrl: {
      type: String,
      default: environment.uploadPicUrl
    }
  },
  data() {
    return {
      disableRefObj: { inSaveProcess: false },
      fileList: [],
      detailData: {},
      isEdit: false,
      previewId: "",
      siteId: 0,
      productType: "product",
      storeData: {}
    };
  },

  components: {
    RightContent,
    leftContent,
    StoreContent
  },
  created() {},
  methods: {
    _handleGoBack() {
      this.$router.push("/content/product");
    },
    tabClick() {},
    submitForm() {
      // let flieUrls = [
      //     ...this.$refs.articleRight.fileList1,
      //     ...this.$refs.articleRight.fileList2
      // ];
      let flieUrls = this.$refs.articleRight.newFileList;
      // let fileList = flieUrls.map(item => {
      //     return item.response;
      // });
      if (
        this.$refs.storeContent.errorOriginalPrice ||
        this.$refs.storeContent.errorPrice
      ) {
        this.productType = "store";
        return;
      }
      let fileList = this.$refs.articleRight.newFileList;
      let storeInfo = this.$refs.storeContent.storePrice;
      if (this.isEdit) {
        this.$refs.articleContent.editArticle(
          "contentForm",
          fileList,
          storeInfo
        );
        return;
      }
      // editArticle
      let isEditor = this.$route.query.isEditor;
      if (isEditor) {
        this.$refs.articleContent.editArticle(
          "contentForm",
          fileList,
          storeInfo
        );
      } else {
        this.$refs.articleContent.submitForm(
          "contentForm",
          fileList,
          storeInfo
        );
      }
    },
    async getArticleDetail(id) {
      let { data } = await productManageApi.getProductDetail(id);
      let thumbnailPicUrlList = data.thumbnailPicUrlList;
      this.storeData = data;
      thumbnailPicUrlList.forEach(item => {
        this.fileList.push(item);
      });
    },
    changeSaveWay(isEdit) {
      this.isEdit = isEdit;
    },
    handlerClickNewAdd() {
      this.fileList = [];
    },
    changePreviewId(id, siteId) {
      this.previewId = id;
      this.siteId = siteId;
    },
    // 新增下一篇时清空价格信息
    clearStoreInfo() {
      this.productType = "product";
      this.$refs.storeContent.clearStoreInfo();
    },
    /**
     * 预览
     */
    async preview() {
      console.log(this.previewId);
      if (this.previewId) {
        let { data } = await productManageApi.GetContentPrevAddress(
          "ProductDetail",
          this.siteId == null ? 0 : this.siteId
        );
        var prevAddress = data;
        //var a = document.createElement('a');
        //a.setAttribute('href', prevAddress + this.previewId + '.html');
        //a.setAttribute('target', '_blank');
        //a.click();
        if (prevAddress) {
          let newWindow = window.open();
          newWindow.location.href = prevAddress + this.previewId + ".html";
        }
      }
    }
  },
  mounted() {
    var id = this.$route.query.id;
    if (id != null || id != undefined) {
      this.getArticleDetail(id);
    }
  },
  computed: {
    isEditor() {
      return this.$route.query.isEditor;
    }
  }
};
</script>

<style lang="scss" scoped>
.article-crumbs /deep/ .el-breadcrumb__item {
  .el-breadcrumb__inner {
    font-weight: 400;
    color: #262626;
    font-size: $--font-size-small;
  }
  .el-breadcrumb__separator {
    color: $--color-text-regular;
  }
}
.article-crumbs /deep/ .text-regular {
  .el-breadcrumb__inner {
    color: $--color-text-regular;
  }
}
</style>
<style lang="scss" scoped>
.article-box {
  background: #f9fafc;
}
.article-bg {
  width: 100%;
  height: 170px;
  background: url("~img/content-icon/content-detaiBg.png") no-repeat center;
  overflow: hidden;
  background-size: cover;
  .article-crumbs {
    width: 80%;
    margin: 0 32px;
    padding-top: 15px;
  }
}
.article-container {
  width: 100%;
  margin-top: -115px;
  // margin-left: -40px;
}
.article-head {
  margin: 0 10%;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .article-headTitle {
    font-size: 16px;
    font-weight: 500;
    color: $--color-text-primary;
  }
}
.articleContent {
  margin: 0 10%;
  width: 80%;
  display: flex;
  .articleContentLeft {
    width: calc(100% - 361px);
    display: inline-block;
  }
  .articleContentRight {
    width: 345px;
    display: inline-block;
    padding-left: 16px;
  }
}
.storeContent {
  margin: 0 10%;
  width: 80%;
  border: $--border-base;
  background: $--color-white;
}
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  width: 80%;
  margin: 16px 10%;
  .cl-button {
    position: absolute;
    right: 16px;
    top: 9px;
  }
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.domain-menu /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
}
</style>
