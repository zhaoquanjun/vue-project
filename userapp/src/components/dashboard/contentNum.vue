<template>
  <div class="content-num-section">
    <p class="section-title">内容</p>
    <el-row class="content" :gutter="16">
      <el-col class="item" :span="12" v-for="(it, idx) in content" :key="idx">
        <div class="item-box">
          <div class="item-l">
            <span></span>
            <span>{{it.name}}</span>
          </div>
          <div class="item-r">{{it.num}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['contentNum'],
  data() {
    return {
      content: []
    };
  },
  created() {
    this.content = [
      {name: '文章', num: this.contentNum.newsCount},
      {name: '产品', num: this.contentNum.productsCount},
      {name: '图片', num: this.contentNum.picturesCount},
      {name: '文件', num: this.contentNum.filesCount},
    ]
  }
};
</script>

<style lang="scss" scoped>
.content-num-section {
  background: #fff;
  .section-title {
    padding-left: 16px;
    padding-bottom: 8px;
    padding-top: 14px;
    font-size: 14px;
    line-height: 18px;
  }
  .content {
    padding: 0 24px 16px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      margin-bottom: 16px;
      .item-box {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        background: #f5f5f5;
        span {
          display: block;
        }
        .item-l {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span:first-of-type {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          span:last-of-type {
            line-height: 17px;
            color: #8c8c8c;
          }
        }
        .item-r {
          color: #00c1de;
        }
      }
    }
  }
}
</style>
