<template>
  <div class="content-section">
    <p class="section-title">内容中心</p>
    <el-row class="content">
      <el-col class="item" :span="6" v-for="(item, index) in content" :key="index">
        <div class="item-box">
          <div class="item-wrap" @click="jumpToContent(item.url)">
            <div class="item-name">
              <span class="item-img" :class="backgroundImg(item.name)"></span>
              <span class="name">{{ item.name }}</span>
            </div>
            <div class="item-content">
              <span class="item-num">{{ item.num }}</span>
              <span class="item-type">/ {{ item.maxNum }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  articleManageUrl,
  productManageUrl,
  imgManageUrl,
  fileManageUrl
} from "@/environment/index";
export default {
  props: ["contentNumber"],
  data() {
    return {
      content: []
    };
  },
  methods: {
    jumpToContent(url) {
      window.location.href = url;
    },
    backgroundImg(name) {
      switch (name) {
        case "文章":
          return "article";
        case "产品":
          return "product";
        case "图片":
          return "pic";
        case "文件":
          return "file";
      }
    },
    bytesToSize(bytes, flag) {
      if (bytes === 0) return "0 B";
      let k = 1024;
      let sizes = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      let b = bytes / Math.pow(k, i);
      //   if (flag === 1) {
      b = b.toFixed(1);
      //   }
      let storage = b + sizes[i];
      return storage;
    }
  },
  watch: {
    contentNumber() {
      this.content = [
        {
          name: "文章",
          num: this.contentNumber.newsCountInfo.currentVal,
          maxNum: this.contentNumber.newsCountInfo.maxVal,
          url: articleManageUrl
        },
        {
          name: "产品",
          num: this.contentNumber.productCountInfo.currentVal,
          maxNum: this.contentNumber.productCountInfo.maxVal,
          url: productManageUrl
        },
        {
          name: "图片",
          num: this.contentNumber.pictureCountInfo.currentVal,
          maxNum: this.contentNumber.pictureCountInfo.maxVal,
          url: imgManageUrl
        },
        {
          name: "文件",
          num: this.bytesToSize(this.contentNumber.fileStorageInfo.currentVal),
          maxNum: this.bytesToSize(this.contentNumber.fileStorageInfo.maxVal),
          url: fileManageUrl
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.content-section {
  margin-top: $--margin-md;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: $--border-radius-base;
  border: $--border-base;
  .section-title {
    height: 42px;
    padding-left: $--padding-xs;
    font-size: $--font-size-base;
    font-weight: $--font-weight-primary;
    color: $--color-text-primary;
    line-height: 42px;
    border-bottom: $--border-base;
  }
  .content {
    .item:last-of-type .item-box {
      border-right: 1px solid transparent;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-box {
        width: 100%;
        height: 77px;
        border-right: $--border-base;
        display: flex;
        align-items: center;
        .item-wrap {
          margin-left: 12px;
          margin-right: 12px;
          padding-left: 14px;
          padding-right: 8px;
          width: calc(100% - 52px);
          height: 50px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;

          &:hover {
            background: rgba(240, 243, 247, 1);
            border-radius: $--border-radius-base;
          }
          .item-name {
            display: flex;
            align-items: center;
            .item-img {
              margin-right: 8px;
              display: inline-block;
              width: 20px;
              height: 20px;
              vertical-align: top;
            }
            .article {
              background: url("~img/dashboard/board-article.png") no-repeat
                center;
              background-size: contain;
            }
            .product {
              background: url("~img/dashboard/board-product.png") no-repeat
                center;
              background-size: contain;
            }
            .pic {
              background: url("~img/dashboard/board-pic.png") no-repeat center;
              background-size: contain;
            }
            .file {
              background: url("~img/dashboard/board-file.png") no-repeat center;
              background-size: contain;
            }
            .name {
              display: inline-block;
              font-size: $--font-size-small;
              font-weight: $--font-weight-base;
              color: $--color-text-primary;
              line-height: 22px;
            }
          }
          .item-content {
            .item-num {
              display: inline-block;
              font-size: $--font-size-base;
              font-weight: $--font-weight-primary;
              color: $--color-text-primary;
              line-height: 50px;
              margin-right: 4px;
            }
            .item-type {
              display: inline-block;
              font-size: $--font-size-base;
              font-weight: $--font-weight-base;
              color: rgba(161, 168, 177, 1);
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
