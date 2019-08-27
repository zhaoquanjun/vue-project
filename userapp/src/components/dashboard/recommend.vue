<template>
  <div class="content-num-section">
    <p class="section-title">实用推荐</p>
    <el-row class="content">
      <el-col class="item" :span="6" v-for="(item, index) in recommend" :key="index">
        <div class="item-box">
          <div class="item-icon"></div>
          <div class="item-title">{{item.appName}}</div>
          <div class="item-content-wrap">
            <span class="item-content">{{item.appDescription}}</span>
          </div>
          <div class="item-btn">
            <a class="item-link" :href="item.appUrl" target="_blank">查看详情</a>
            <div class="item-arrow"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["recommend"]
};
</script>

<style lang="scss" scoped>
.content-num-section {
  margin-top: 40px;
  margin-bottom: 50px;
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    padding-left: 25px;
    padding-bottom: 14px;
    padding-top: 20px;
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
  }
  .content {
    .item:last-of-type {
      border-right: 1px solid transparent;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 34px;
      border-right: 1px solid #eeeeee;

      .item-box {
        width: 100%;
        height: 197px;
        position: relative;
        padding: 0 16px;
        text-align: center;
        align-items: center;
        justify-content: center;

        .item-title {
          text-align: center;
          font-size: 20px;
          color: rgba(38, 38, 38, 1);
          line-height: 27px;
          margin-top: 12px;
          margin-bottom: 17px;
        }
        .item-icon {
          display: block;
          width: 40px;
          height: 40px;
          background: url("~img/dashboard/board-aliyunMax.png") no-repeat center;
          background-size: contain;
          margin: 7px auto 0px;
        }
        .item-content-wrap {
          display: inline-block;
          width: 60%;
          height: 40px;
          margin: 0px auto;
        }
        .item-content {
          font-size: 14px;
          font-weight: 400;
          color: rgba(140, 140, 140, 1);
          line-height: 20px;
          text-align: center;

          display: -webkit-box;
          word-break: break-all;
          text-overflow: ellipsis;
          -webkit-text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .item-btn {
          margin-top: 27px;
          margin-bottom: 5px;
          .item-link {
            font-size: 16px;
            font-weight: 400;
            color: rgba(0, 193, 222, 1);
            line-height: 22px;
            margin-right: 7px;
          }
          .item-arrow {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: url("~img/dashboard/board-arrow.png") no-repeat center;
            background-size: contain;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  .content-num-section {
    margin-top: 32px;
    .section-title {
      padding-top: 12px;
      padding-left: 13px;
      font-size: 16px;
      line-height: 22px;
    }
    .content .item .item-box .item-title {
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 9px;
    }
    .content .item .item-box .item-icon {
      width: 31px;
      height: 31px;
      background: url("~img/dashboard/board-aliyunMin.png") no-repeat center;
      background-size: contain;
    }
    .content .item .item-box .item-content-wrap {
      height: 60px;
    }
    .content .item .item-box .item-content {
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .content .item .item-box .item-btn {
      margin-top: 17px;
      .item-link {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
</style>
