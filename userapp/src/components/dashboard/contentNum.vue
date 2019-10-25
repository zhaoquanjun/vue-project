<template>
  <div class="content-section">
    <p class="section-title">内容管理</p>
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
  margin-top: 32px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    height: 64px;
    padding-left: 25px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 64px;
    border-bottom: 1px solid #e5e5e5;
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
        height: 100px;
        border-right: 1px solid #eee;

        .item-wrap {
          margin-top: 27px;
          margin-left: 12px;
          margin-right: 12px;
          padding-left: 14px;
          padding-right: 8px;
          height: 50px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;

          &:hover {
            background: rgba(240, 243, 247, 1);
            border-radius: 2px;
          }
          .item-name {
            .item-img {
              margin-top: 10px;
              margin-right: 8px;
              display: inline-block;
              width: 32px;
              height: 32px;
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
              font-size: 18px;
              font-weight: 400;
              color: rgba(38, 38, 38, 1);
              line-height: 25px;
              margin-top: 14px;
            }
          }
          .item-content {
            .item-num {
              display: inline-block;
              font-size: 32px;
              font-weight: 500;
              color: rgba(38, 38, 38, 1);
              line-height: 50px;
              margin-right: 4px;
            }
            .item-type {
              display: inline-block;
              font-size: 14px;
              font-weight: 400;
              color: rgba(185, 203, 207, 1);
              line-height: 20px;
              margin-top: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
