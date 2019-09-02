<template>
  <div class="content-num-section">
    <p class="section-title">内容管理</p>
    <el-row class="content">
      <el-col class="item" :span="6" v-for="(item, index) in content" :key="index">
        <div class="item-box" @click="jumpToContent(item.url)">
          <div class="item-name">
            <span>{{ item.name }}</span>
          </div>
          <div class="item-content">
            <span class="item-num">{{ item.num }}</span>
            <span class="item-type">{{ item.type }}</span>
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
    }
  },
  watch: {
    contentNumber() {
      this.content = [
        {
          name: "文章",
          num: this.contentNumber.newsCount,
          type: "/ 篇",
          url: articleManageUrl
        },
        {
          name: "产品",
          num: this.contentNumber.productsCount,
          type: "/ 个",
          url: productManageUrl
        },
        {
          name: "图片",
          num: this.contentNumber.picturesCount,
          type: "/ 张",
          url: imgManageUrl
        },
        {
          name: "文件",
          num: this.contentNumber.filesCount,
          type: "/ 个",
          url: fileManageUrl
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.content-num-section {
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    padding-left: 25px;
    padding-bottom: 20px;
    padding-top: 20px;
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    line-height: 25px;
  }
  .content {
    .item:first-of-type {
      background: url("~img/dashboard/board-contentLeftImgMax.png") no-repeat;
      background-position: left bottom;
      background-size: contain;
    }
    .item:last-of-type {
      background: url("~img/dashboard/board-contentRightImgMax.png") no-repeat;
      background-position: right bottom;
      background-size: contain;
    }
    .item:last-of-type .item-box {
      border-right: 1px solid transparent;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-box {
        width: 100%;
        height: 75px;
        margin-bottom: 32px;
        border-right: 1px solid #eee;
        cursor: pointer;
        span {
          display: block;
        }
        .item-name {
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 18px;
            font-weight: 300;
            color: rgba(38, 38, 38, 1);
            line-height: 25px;
          }
        }
        .item-content {
          display: flex;
          justify-content: center;
          align-items: center;
          //   vertical-align: top;
        }
        .item-num {
          display: inline;
          margin-right: 5px;
          font-size: 36px;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 50px;
          //   vertical-align: top;
        }
        .item-type {
          display: inline;
          font-size: 14px;
          font-weight: 300;
          color: rgba(185, 203, 207, 1);
          line-height: 20px;
          //   vertical-align: top;
        }
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  .content-num-section {
    .section-title {
      padding-top: 12px;
      padding-left: 13px;
      padding-bottom: 7px;
      font-size: 16px;
      line-height: 22px;
    }
    .content {
      .item:first-of-type {
        background: url("~img/dashboard/board-contentLeftImgMin.png") no-repeat;
        background-position: left bottom;
        background-size: contain;
      }
      .item:last-of-type {
        background: url("~img/dashboard/board-contentRightImgMax.png") no-repeat;
        background-position: right bottom;
        background-size: contain;
      }
      .item .item-box {
        height: 54px;
        margin-bottom: 17px;
        .item-name span {
          font-size: 14px;
          line-height: 20px;
        }
        .item-num {
          font-size: 28px;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
