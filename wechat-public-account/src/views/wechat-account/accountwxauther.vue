<template>
  <div class="account-setting__section">
    <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
    />
    <div class="account-setting__content">
      <div class="account-setting__bind--box">
        <SpeedProgress />
        <div class="account-setting__bind">
          <img :src="wechanIcon" alt />
          <p>请先绑定微信公众号</p>
          <div @click="_handleWxAuth">授权绑定微信公众号</div>
        </div>
        <div class="account-bind__tips">
          <p>1、请确定您有一个正常使用的微信公众号，且您是公众号管理员；</p>
          <p>2、请确定您授权的微信公众号是认证的服务号或订阅号。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import SpeedProgress from "@/components/common/speedProgress";
import ChangeSite from "@/components/common/changeSite";
import { wxAuth } from "@/api/request/account.js";
export default {
  data() {
    return {
      title: "账号设置",
      wechanIcon: require("img/account/wechat_icon.png")
    };
  },
  components: {
    ChangeSite,
    SpeedProgress,
    PageSubNav
  },
  methods: {
    getSiteId(siteId) {
      this.siteId = siteId;
      // this.getSiteInfo(siteId);
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      // this.getSiteInfo(siteId);
    },
    // 微信授权
    async _handleWxAuth() {
      let data = await wxAuth();
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
  padding: 0 32px;
  height: 100%;
  .account-setting__content {
    position: relative;
    height: calc(100% - 103px);
    min-height: 600px;
    .account-setting__bind--box {
      width: 100%;
      height: calc(100% - 266px);
      .account-setting__bind {
        width:290px;
        height:225px;
        margin: 0 auto;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(243,243,243,1);
        border-radius:3px;
        border:1px solid rgba(99,220,140,1);
        img {
          width: 85px;
          height: 61px;
          margin: 48px 0 12px;
        }
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:20px;
        }
        div {
          cursor: pointer;
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          margin-top: 20px;
          color:rgba(99,220,140,1);
          line-height:20px;
        }
      }
      .account-bind__tips {
        width: 418px;
        margin: 40px auto 0;
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:30px;
        }
      }
    }
  }
}
</style>