<template>
  <div class="account-setting__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="account-setting__content">
      <div class="account-setting__bind--box">
        <div class="account-setting__bind">
          <div class="bind-icon__area">
            <img :src="wechanIcon" alt />
          </div>
          <div
            class="bind-button--normal primary-button__nomal--shadow"
            @click="_handleWxAuth"
          >微信公众号授权绑定</div>
        </div>
      </div>
      <div class="account-bind__tips border">
        <h4>授权须知</h4>
        <ul>
          <li v-for="(item, index) in bindPrompt" :key="index">{{index + 1 + '、' + item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import { wxAuth } from "@/api/request/account.js";
export default {
  data() {
    return {
      title: "账号设置",
      wechanIcon: require("img/account/wechat_icon.png"),
      bindPrompt: [
        "只有微信公众号管理员才可以进行授权",
        "只有认证的服务号才能进行微信支付，订阅号、未认证服务号无法开通微信支付功能",
        "只有认证的服务号或订阅号才能使用顶级域名进行微信推广"
      ]
    };
  },
  components: {
    PageSubNav
  },
  methods: {
    // 微信授权
    async _handleWxAuth() {
      let data = await wxAuth({infoType: 'WeixinOA'});
      let oA = document.createElement("a");
      oA.setAttribute("href", data.data);
      oA.setAttribute("id", "authBtn");
      oA.setAttribute("target", "_blank");
      document.body.appendChild(oA);
      let btn = document.getElementById("authBtn");
      btn.click();
      if (btn) document.body.removeChild(document.getElementById("authBtn"));
      this.$confirm("提示", {
        title: "提示",
        showCancelButton: false,
        message: this.$createElement("div", null, '是否授权成功'),
        callback: async action => {
          if (action === "confirm") {
            this.$router.push('/wechataccount/accountsetting')
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 32px 32px 0;
  height: 100%;
  .account-setting__content {
    position: relative;
    height: calc(100% - 103px);
    min-height: 600px;
    .account-setting__bind--box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 266px);
      .account-setting__bind {
        text-align: center;
        .bind-icon__area {
          margin: 0 auto 21px;
          width: 140px;
          height: 140px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .account-bind__tips {
      position: absolute;
      left: 0;
      bottom: 48px;
      width: 100%;
      text-align: left;
      h4 {
        font-size: 16px;
        font-family: "PingFangSC";
        font-weight: 500;
        height: 70px;
        line-height: 70px;
        padding-left: 32px;
        border-bottom: 1px solid #c9d9dc;
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
}
</style>