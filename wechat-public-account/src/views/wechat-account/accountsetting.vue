<template>
  <div class="account-setting__section">
    <div class="account-setting__bind">
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
    <div class="account-setting__certification">
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
    <div class="account-setting__manage">
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
      <div class="account-advance__area"></div>
      <p class="account-remove__bind">如何解除绑定</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bindPrompt: [
        "只有微信公众号管理员才可以进行授权",
        "只有认证的服务号才能进行微信支付，订阅号、未认证服务号无法开通微信支付功能",
        "只有认证的服务号或订阅号才能使用顶级域名进行微信推广"
      ]
    };
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
  padding: 0 32px;
  .account-setting__bind {
    display: none;
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
    display: none;
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
            width: 130px;
            height: 32px;
            background: linear-gradient(
              270deg,
              rgba(229, 252, 255, 1) 0%,
              rgba(143, 240, 255, 1) 100%
            );
            box-shadow: 0px 5px 8px 0px rgba(9, 204, 235, 0.1);
            border-radius: 4px;
            ::after {
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
    .account-remove__bind {
      padding-top: 32px;
      font-size: 16px;
      font-family: "PingFangSC";
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 22px;
    }
  }
}
</style>