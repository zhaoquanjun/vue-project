<template>
  <div class="content-num-section">
    <p class="section-title">设置中心</p>
    <div class="item-wrap">
      <div class="item">
        <div class="item-box">
          <div class="item-icon tianmao"></div>
          <div class="item-text-wrap">
            <div class="item-text">
              <span>云·速成美站</span>
              <span style="white-space:nowrap;">【天猫专享】</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon video"></div>
          <div class="item-text-wrap">
            <div class="item-text">一分钟快速上手</div>
            <div class="item-videoLength">1:49</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon website"></div>
          <div class="item-text-wrap">
            <div class="item-text">ac.clouddream.net</div>
            <div class="collection">收藏</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon assistant"></div>
          <div class="item-text">云建站助手</div>
        </div>
      </div>
      <div class="item">
        <div class="item-box" @click="jumpTo('member')">
          <div class="item-icon member"></div>
          <div class="item-text-wrap">
            <div class="item-text">成员协作</div>
            <div class="memberNum">{{contentNumber.managerCount}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["contentNumber"],
  methods: {
    jumpTo(type) {
      if (type == "member") {
        this.$router.push({
          path: "/role"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content-num-section {
  margin-top: 32px;
  margin-bottom: 40px;
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
  .item-wrap {
    height: 125px;
    width: 100%;
    box-sizing: border-box;
    .item:last-of-type {
      border-right: 1px solid transparent;
    }
    .item {
      display: inline-block;
      width: 20%;
      height: 100%;
      //   padding-left: 32px;
      box-sizing: border-box;
      border-right: 1px solid #eeeeee;
      vertical-align: top;
      .item-box {
        // margin-left: 8px;
        // margin-right: 40px;
        margin-top: 24px;
        margin: 24px auto 0 auto;
        padding-left: 16px;
        padding-right: 16px;
        height: 80px;
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 80%;
        &:hover {
          background: rgba(240, 243, 247, 1);
          border-radius: 2px;
        }
        .item-icon {
          width: 60px;
          height: 50px;
          margin-right: 18px;
          //   margin-top: 14px;
          display: inline-block;
          vertical-align: top;
          min-width: 50px;
        }
        .item-text-wrap {
          width: calc(100% - 78px);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .item-text {
          vertical-align: top;
          display: inline-block;
          //   margin-top: 27px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 20px;
          text-align: left;
          // word-wrap: break-word;
          // word-break: break-all;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
        .item-videoLength {
          vertical-align: top;
          display: inline-block;
          font-size: 16px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(38, 38, 38, 1);
          line-height: 22px;
        }
        .collection {
          vertical-align: top;
          display: inline-block;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: rgba(5, 149, 230, 1);
          line-height: 20px;
        }
        .memberNum {
          vertical-align: top;
          display: inline-block;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(5, 149, 230, 1);
          line-height: 22px;
        }
        .tianmao {
          background: url("~img/dashboard/board-tianmao.png") no-repeat center;
          background-size: contain;
        }
        .video {
          background: url("~img/dashboard/board-video.png") no-repeat center;
          background-size: contain;
        }
        .website {
          background: url("~img/dashboard/board-website.png") no-repeat center;
          background-size: contain;
        }
        .assistant {
          background: url("~img/dashboard/board-assistant.png") no-repeat center;
          background-size: contain;
        }
        .member {
          background: url("~img/dashboard/board-member.png") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
}
</style>
