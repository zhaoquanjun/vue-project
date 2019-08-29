<template>
  <div class="account-setting__bind">
    <div class="bind-icon__area">
      <img :src="wechanIcon" alt />
    </div>
    <div class="bind-button--normal primary-button__nomal" @click="_handleWxBind">微信公众号授权绑定</div>
    <div class="account-bind__tips border">
      <h4>授权须知</h4>
      <ul>
        <li v-for="(item, index) in bindPrompt" :key="index">{{index + 1 + '、' + item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {wxAuth} from "@/api/request/account.js";
export default {
  data() {
    return {
      wechanIcon: require('img/account/wechat_icon.png'),
      bindPrompt: [
        "只有微信公众号管理员才可以进行授权",
        "只有认证的服务号才能进行微信支付，订阅号、未认证服务号无法开通微信支付功能",
        "只有认证的服务号或订阅号才能使用顶级域名进行微信推广"
      ],
    }
  },
  methods: {
    // 微信授权
    async _handleWxBind() {
      let data = await wxAuth();
      location.href = data;
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>