<template>
  <div class="account-setting__section">
    <div class="account-setting__manage" :style="{height:scrollHeight+'px'}" v-scrollBar>
      <h4>公众号管理</h4>
      <div class="account-info__area">
        <div class="info-desc__area">
          <div class="account-icon">
            <img :src="accountAvator" alt />
          </div>
          <div class="account-name-certification">
            <h6>{{accountInfo.platformName}}</h6>
            <p>{{accountInfo.type == 0 ? '服务号' : '订阅号'}}</p>
          </div>
        </div>
        <div class="primary-button__nomal">解除绑定</div>
      </div>
      <div class="account-domain__area">
        <div class="domain-title__area">
          <span>推广域名</span>
          <p>www.yunmengclouddream.com</p>
        </div>
        <div class="primary-button__nomal domain-button__area">&nbsp;&nbsp;修改&nbsp;&nbsp;</div>
      </div>
      <div class="account-explain__area">
        <h5>推广域名说明</h5>
        <p>1、推广域名必须是当前网站下解析成功的域名，如未设置推广域名，微信公众号功能将不可用；</p>
        <p>2、公众号发送图文消息时，将在设置的推广域名下打开页面、文章、产品链接；</p>
        <p>3、微信推广可自定义页面、文章、产品分享到微信时显示的封面、标题及描述；使用该功能，请在JS接口安全域名中添加推广域名；
          <a>如何设置？</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      scrollHeight: 500,
      accountAvator: require("img/account/account_type_icon.png"),
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
      console.log('ppp',this.account_info);
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
      margin-top: 13px;
      margin-bottom: 26px;
      height: 100px;
      background: #F8FAFC;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-desc__area {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .account-icon {
          width: 80px;
          height: 80px;
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
            line-height: 22px;width:134px;
            color:rgba(38,38,38,1);
          }
          p {
            position: relative;
            padding-left: 36px;
            width: 90px;
            height: 32px;
            line-height: 32px;
            color:#FFFFFF;
            background: linear-gradient(
              270deg,
              #63DC8C 0%,
              #3ECD6E 100%
            );
            box-shadow: 0px 5px 8px 0px rgba(9, 204, 235, 0.1);
            border-radius: 4px;
            &::after {
              position: absolute;
              top: 8px;
              left: 8px;
              display: block;
              content: "";
              width: 16px;
              height: 16px;
              background: url("~img/account/account_type_icon.png") no-repeat
                center center;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .account-domain__area {
      height:100px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      border:1px solid rgba(229,229,229,1);
      display: flex;
      justify-content: space-between;
      padding: 30px;
      line-height: 14px;
      .domain-title__area {
        width: 80%;
        line-height: 40px;
        display: flex;
        justify-content: flex-start;
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1); 
        p {
          margin-left: 20px;
          border-radius:2px;
          border:1px solid rgba(229,229,229,1);
          padding: 0 10px;
        }
      }
      .domain-button__area {
        height: 34px;
      }
    }
    .account-explain__area {
      margin-top: 20px;
      h5 {
        height:20px;
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-bottom: 8px;
      }
      p {
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:26px;
      }
    }
  }
}
</style>