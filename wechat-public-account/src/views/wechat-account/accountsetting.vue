<template>
  <div class="account-setting__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="account-setting__manage">
      <h4>微信公众号信息</h4>
      <div class="account-info__area">
        <div class="info-desc__area">
          <div class="account-icon">
            <img :src="accountAvator" alt />
          </div>
          <div class="account-name-certification">
            <h6>{{accountInfo.platformName}}</h6>
            <p>{{accountInfo.type == 0 ? '认证的服务号' : '认证的订阅号'}}</p>
          </div>
        </div>
        <div class="rebind-button__normal primary-button__nomal--shadow">更换账号</div>
      </div>
      <div class="account-advance__area">
        <h6>公众号高级功能</h6>
        <ul class="advance-list__area">
          <li>
            <p class="list-columns__1">功能</p>
            <p class="list-columns__2">条件</p>
            <p class="list-columns__3">操作</p>
          </li>
          <li v-for="(item, index) in data" :key="index">
            <p class="list-columns__1">{{item.title}}</p>
            <p class="list-columns__2">{{item.condition}}</p>
            <p class="list-columns__3">去推广</p>
          </li>
        </ul>
      </div>
      <p class="account-remove__bind">如何解除绑定</p>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      data: [
        {
          title:
            "微信推广（可自定义页面、文章、产品分享到微信时显示的封面、标题、描述）",
          condition: "的服务号或订阅号,并且设置了JS接口安全域名"
        }
      ],
      accountAvator: require("img/account/account_type_icon.png"),
      title: "账号设置",
      accountInfo: {
        platformName: "公众号名称",
        platformAvator: "",
        platformType: 0
      }
    };
  },
  components: {
    PageSubNav
  },
  created() {
    this._getWxIsAuth();
    setTimeout(() => {
      console.log(this.account_info);
    }, 5000);
  },
  computed: {
    ...mapGetters(["account_info"])
  },
  methods: {
    // 校验是否已经授权认证
    async _getWxIsAuth() {}
  }
};
</script>

<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 32px 32px 0;
  height: 100%;
  .account-setting__manage {
    h4 {
      padding-top: 32px;
      font-size: 16px;
      font-family: "PingFangSC";
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .account-info__area {
      margin-top: 48px;
      margin-bottom: 72px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-desc__area {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .account-icon {
          width: 120px;
          height: 120px;
          box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
        .account-name-certification {
          margin-left: 32px;
          h6 {
            margin-bottom: 16px;
            font-size: 16px;
            font-family: "PingFangSC";
            font-weight: 500;
            line-height: 22px;
          }
          p {
            position: relative;
            padding-left: 38px;
            width: 130px;
            height: 32px;
            line-height: 32px;
            color: #09cceb;
            background: linear-gradient(
              270deg,
              rgba(229, 252, 255, 1) 0%,
              rgba(143, 240, 255, 1) 100%
            );
            box-shadow: 0px 5px 8px 0px rgba(9, 204, 235, 0.1);
            border-radius: 4px;
            &::after {
              position: absolute;
              top: 2px;
              left: 2px;
              display: block;
              content: "";
              width: 28px;
              height: 28px;
              background: url("~img/account/account_type_icon.png") no-repeat
                center center;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .account-advance__area {
      position: relative;
      padding: 32px 0;
      &::before {
        position: absolute;
        left: -32px;
        top: 0;
        display: block;
        content: "";
        height: 1px;
        width: calc(100% + 64px);
        background: #e5e5e5;
      }
      &::after {
        position: absolute;
        left: -32px;
        bottom: 0;
        display: block;
        content: "";
        height: 1px;
        width: calc(100% + 64px);
        background: #e5e5e5;
      }
      h6 {
        margin-bottom: 36px;
        font-size: 16px;
        font-family: "PingFangSC";
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 22px;
      }
      .advance-list__area {
        border: 1px solid #e5e5e5;
        li {
          display: flex;
          align-items: center;
          padding: 24px 32px;
          p {
            display: inline-block;
            font-size: 16px;
            font-family: "PingFangSC";
            font-weight: 500;
            line-height: 22px;
          }
          p.list-columns__1,
          p.list-columns__2 {
            width: 45%;
          }
          p.list-columns__3 {
            width: 10%;
            color: #0595e6;
            cursor: pointer;
          }
        }
        li:first-of-type {
          border-bottom: 1px solid #e5e5e5;
          p {
            color: #a1a8b1;
          }
        }
      }
    }
    .account-remove__bind {
      padding-top: 32px;
      font-size: 16px;
      font-family: "PingFangSC";
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 22px;
      cursor: pointer;
    }
  }
}
</style>