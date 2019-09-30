<template>
  <div class="spread-setting__section">
    <div class="spread-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
    </div>
    <div class="answer-tabs">
      <el-tabs v-model="replyType" type="card" @tab-click="handleClick">
        <el-tab-pane label="页面推广" name="1"></el-tab-pane>
        <el-tab-pane label="文章推广" name="2"></el-tab-pane>
        <el-tab-pane label="产品推广" name="3"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ChangeSite from "@/components/common/changeSite";
import { unBind } from "@/api/request/account.js";
import { notify } from "@/utlis/index.js";
export default {
  data() {
    return {
      siteId: this.$store.state.dashboard.siteId,
      replyType: '1'
    };
  },
  components: {
    ChangeSite
  },
  created() {
    this._getWxIsAuth();
  },
  methods: {
    handleClick() {
      console.log('www')
    },
    getSiteId(siteId) {
      console.log('000')
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      console.log(this.$store.state.wxaccount)
      if (!wx_status.isAuth || !wx_status.isCertification) {
        this.$router.replace({path:'/wechataccount/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    }
  }
};
</script>
<style scoped>
.el-tabs /deep/ .el-tabs__item {
    background: rgba(245, 245, 245, 1);
    font-size: 14px;
    padding: 0 32px;
    font-weight: 400;
    color: #262626;
    height: 60px;
    line-height: 57px;
    border-top: 3px solid transparent;
    box-sizing: border-box;
}
.el-tabs /deep/ .el-tabs__header {
    margin: 0;
}
.el-tabs /deep/ .is-active {
    background: #fff;
    border-top: 3px solid #09cceb;
}
</style>
<style lang="scss" scoped>
.spread-setting__section {
    padding: 32px;
    .answer-tabs {
        padding-top: 32px;
    }
    .reply-wrap {
        padding: 32px 0;
        position: relative;
        //  overflow-y: auto;
    }
}
</style>