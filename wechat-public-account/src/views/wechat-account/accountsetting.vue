<template>
  <div class="account-setting__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="account-setting__bind" v-if="!author">
      <div class="bind-icon__area">
        <img src alt />
      </div>
      <div class="bind-button--normal primary-button__nomal" @click="_handleWxBind">微信公众号授权绑定</div>
      <div class="account-bind__tips">
        <h4>授权须知</h4>
        <ul>
          <li v-for="(item, index) in bindPrompt" :key="index">{{index + 1 + '、' + item}}</li>
        </ul>
      </div>
    </div>
    <div class="account-setting__certification" v-if="author && !certification">
      <div class="warm-prompt__area">
        温馨提示：微信接口限制，未认证的订阅号无法通过第三方编辑自定义菜单，请您先对绑定
        <span @click="_handleCertification">微信公众号进行认证</span>，再使用该功能。
      </div>
      <div class="certification-content__area">
        <div class="certification-icon__area">
          <img src alt />
        </div>
        <p class="certification-desc">请先认证再使用该功能</p>
        <div class="certification-button--normal primary-button__nomal">去认证</div>
      </div>
    </div>
    <div class="account-setting__manage" v-if="author && certification">
      <h4>微信公众号信息</h4>
      <div class="account-info__area">
        <div class="info-desc__area">
          <div class="account-icon">
            <img src alt />
          </div>
          <div class="account-name-certification">
            <h6>公众号名称{{}}</h6>
            <p>认证的服务号</p>
          </div>
        </div>
        <div class="rebind-button__normal primary-button__nomal">更换账号</div>
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
import pageSubNav from "_c/common/WechatTitle";
export default {
  data() {
    return {
      bindPrompt: [
        "只有微信公众号管理员才可以进行授权",
        "只有认证的服务号才能进行微信支付，订阅号、未认证服务号无法开通微信支付功能",
        "只有认证的服务号或订阅号才能使用顶级域名进行微信推广"
      ],
      data: [
        {
          title:
            "微信推广（可自定义页面、文章、产品分享到微信时显示的封面、标题、描述）",
          condition: "的服务号或订阅号,并且设置了JS接口安全域名"
        }
      ],
      title: '账号设置',
      author: false,
      certification: false
    };
  },
  components: {
    pageSubNav
  },
  methods: {
    // 微信授权
    _handleWxBind() {},
    // 微信认证
    _handleCertification() {}
  }
};
</script>

<style lang="scss" scoped>
.account-setting__section {
  padding: 32px 32px 0;
  .account-setting__bind {
    text-align: center;
    .bind-icon__area {
      margin: 176px auto 21px;
      width: 140px;
      height: 140px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bind-button--normal {
      margin-bottom: 215px;
    }
    .account-bind__tips {
      border: 1px solid #e5e5e5;
      text-align: left;
      h4 {
        font-size: 16px;
        font-family: "PingFangSC";
        font-weight: 500;
        height: 70px;
        line-height: 70px;
        padding-left: 32px;
        border-bottom: 1px solid #e5e5e5;
      }
      ul {
        padding: 24px 32px 32px;
        li {
          padding-bottom: 16px;
          font-size: 14px;
          font-family: "PingFangSC";
          font-weight: 400;
        }
      }
    }
  }
  .account-setting__certification {
    text-align: center;
    .warm-prompt__area {
      margin-top: 16px;
      padding: 7px 11px 8px;
      font-size: 12px;
      font-family: "PingFangSC";
      font-weight: 500;
      color: #fe9837;
      text-align: left;
      background: rgba(255, 248, 242, 1);
      border-radius: 2px;
      border: 1px solid rgba(250, 223, 197, 1);
      span {
        color: #0595e6;
        cursor: pointer;
      }
    }
    .certification-icon__area {
      margin: 167px auto 10px;
      width: 178px;
      height: 145px;
    }
    .certification-desc {
      margin-bottom: 16px;
      font-size: 16px;
      font-family: P "ingFangSC";
      font-weight: 400;
      line-height: 22px;
      text-align: center;
    }
  }
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
              background: url() no-repeat center center;
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