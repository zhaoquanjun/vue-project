<template>
  <div class="account-setting__section">
    <div class="account-setting__certification">
      <div class="warm-prompt__area">
        温馨提示：微信接口限制，未认证的订阅号无法通过第三方编辑自定义菜单，请您先对绑定
        <span @click="_handleCertification">微信公众号进行认证</span>，再使用该功能。
      </div>
      <div class="certification-content__area">
        <div class="certification-icon__area">
          <img :src="certificationIcon" alt />
        </div>
        <p class="certification-desc">请先认证再使用该功能</p>
        <div class="certification-button--normal primary-button__nomal--shadow" @click="_handleCertification">去认证</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      certificationIcon: require("img/account/account_certification.png"),
      certificationHref: 'https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN'
    };
  },
  methods: {
    // 微信认证
    _handleCertification() {
      let oA = document.createElement("a");
      oA.setAttribute("href", this.certificationHref);
      oA.setAttribute("id", "authBtn");
      oA.setAttribute("target", "_blank");
      document.body.appendChild(oA);
      let btn = document.getElementById("authBtn");
      btn.click();
      if (btn) document.body.removeChild(document.getElementById("authBtn"));
      this.$confirm("提示", {
        title: "提示",
        showCancelButton: false,
        message: this.$createElement("div", null, '是否认证成功'),
        callback: async action => {
          if (action === "confirm") {
            location.reload();
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
  padding: 16px 32px 0;
  height: 100%;
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
}
</style>