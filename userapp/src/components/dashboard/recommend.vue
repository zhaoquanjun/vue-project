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
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    padding-left: 25px;
    padding-bottom: 14px;
    padding-top: 20px;
    font-size: 18px;
    font-family: PingFangSC-Semibold;
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
          font-family: AlibabaPuHuiTiR;
          color: rgba(38, 38, 38, 1);
          line-height: 27px;
          margin-top: 12px;
          margin-bottom: 17px;
        }
        .item-icon {
          display: block;
          width: 40px;
          height: 40px;
          background: url("~img/dashboard/board-aliyun.png") no-repeat center;
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
          font-family: PingFangSC-Regular;
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
            font-family: PingFangSC-Regular;
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
</style>
