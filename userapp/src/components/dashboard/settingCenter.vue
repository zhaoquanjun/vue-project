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
        <div class="item-mask">
          <div class="item-info">
            <div>到期时间：{{expiredTime}}</div>
          </div>
          <div>
            <a class="item-btn" :href="aliMarketUrl" target="_blank">去续费</a>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon video"></div>
          <div class="item-text-wrap">
            <div class="item-text">一分钟快速上手</div>
          </div>
        </div>
        <div class="item-mask">
          <div class="item-info">
            <div>一分钟快速上手 01:28</div>
          </div>
          <div class="item-play"></div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon website"></div>
          <div class="item-text-wrap">
            <div class="item-text">{{link}}</div>
          </div>
        </div>
        <div class="item-mask">
          <div class="item-info">
            <div>{{link}}</div>
            <div>统一登录地址</div>
          </div>
          <div>
            <button
              class="item-btn"
              v-clipboard:copy="link"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >{{copyInfo}}</button>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon assistant"></div>
          <div class="item-text">云建站助手</div>
        </div>
        <div class="item-mask">
          <div class="item-info">
            <div>云建站助手</div>
          </div>
          <div class="assistant"></div>
        </div>
      </div>
      <div class="item">
        <div class="item-box">
          <div class="item-icon member"></div>
          <div class="item-text-wrap">
            <div class="item-text">成员协作</div>
            <div class="cl-text--orange memberNum">{{contentNumber.managerCount}}</div>
          </div>
        </div>
        <div class="item-mask">
          <div class="item-info">
            <div>成员协作</div>
            <div>成员数量：{{contentNumber.managerCount}}</div>
          </div>
          <div>
            <button class="item-btn" @click="jumpTo('member')">去管理</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { aliMarketUrl } from "@/environment/index";
export default {
  props: ["contentNumber"],
  data() {
    return {
      aliMarketUrl: aliMarketUrl,
      expiredTime: "",
      link: "login.clouddream.net",
      copyInfo: "复制"
    };
  },
  methods: {
    jumpTo(type) {
      if (type == "member") {
        this.$router.push({
          path: "/role"
        });
      }
    },
    onCopy() {
      this.copyInfo = "已复制";
      let timer = setTimeout(() => {
        this.copyInfo = "复制";
        clearTimeout(timer);
      }, 1500);
    },
    onError() {}
  }
};
</script>

<style lang="scss" scoped>
.content-num-section {
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
  .item-wrap {
    height: 77px;
    width: 100%;
    box-sizing: border-box;
    .item:last-of-type {
      border-right: 1px solid transparent;
    }
    .item {
      display: inline-block;
      width: 20%;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid #eeeeee;
      vertical-align: top;
      position: relative;
      &:hover {
        .item-mask {
          opacity: 1;
        }
      }
      .item-box {
        padding-left: 16px;
        padding-right: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 100%;
        height: 100%;
        .item-icon {
          margin-right: 18px;
          display: inline-block;
        }
        .item-text-wrap {
          width: calc(100% - 78px);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .item-text {
          display: inline-block;
          font-size: $--font-size-small;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 20px;
          text-align: left;
        }
        .memberNum {
          display: inline-block;
          font-size: $--font-size-small;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          line-height: 22px;
        }
        .tianmao {
          width: 32px;
          height: 30px;
          background: url("~img/dashboard/board-tianmao.png") no-repeat center;
          background-size: contain;
        }
        .video {
          width: 19px;
          height: 20px;
          background: url("~img/dashboard/board-video.png") no-repeat center;
          background-size: contain;
        }
        .website {
          width: 27px;
          height: 20px;
          background: url("~img/dashboard/board-website.png") no-repeat center;
          background-size: contain;
        }
        .assistant {
          width: 52px;
          height: 52px;
          background: url("~img/dashboard/board-assistant.png") no-repeat center;
          background-size: contain;
        }
        .member {
          width: 27px;
          height: 20px;
          background: url("~img/dashboard/board-member.png") no-repeat center;
          background-size: contain;
        }
      }
      .item-mask {
        transition: all 0.2s linear;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 107, 0, 0.94);
        padding: 0 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-info {
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-white;
          line-height: 17px;
        }
        .item-btn {
          display: inline-block;
          width: 76px;
          height: 32px;
          border-radius: $--border-radius-base;
          border: 1px solid rgba(255, 255, 255, 1);
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-white;
          line-height: 32px;
          text-align: center;
        }
        .item-play{
          cursor: pointer;
          width: 32px;
          height: 32px;
          background: url("~img/dashboard/board-play.png") no-repeat center;
          background-size: contain;
        }
        .assistant {
          width: 52px;
          height: 52px;
          background: url("~img/dashboard/board-assistant.png") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
}
</style>
