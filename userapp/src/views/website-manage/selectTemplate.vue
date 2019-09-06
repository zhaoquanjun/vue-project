<template>
  <el-container class="member-container">
    <el-main class="member-content">
      <el-row>
        <ChangeSite @getSiteId="getSiteId" @getSiteName="getSiteName"></ChangeSite>
      </el-row>
      <el-row class="wrap">
        <el-col :span="8" style="min-width: 500px; max-width: 688px;">
          <img src="~img/siteManage/selectTemplate.png" alt class="backgroundImg" />
        </el-col>
        <el-col :span="8">
          <div class="tempalte-selected__section">
            <el-col class="textOne">选择网站模板，立即开启网站管理</el-col>
            <el-col class="textTwo">建立您的第一个专业网站。</el-col>
            <button class="select" @click="showTemplate">选择模版</button>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <SelectTemplateDialog ref="selectTemplateDialog" :siteId="siteId" :siteName="siteName"></SelectTemplateDialog>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import * as templateApi from "@/api/request/templateApi";
import { getLanguage } from "@/configure/appCommon";
import { designerUrl } from "@/environment/index";

export default {
  components: {
    PageSubmenu,
    ChangeSite,
    SelectTemplateDialog
  },
  data() {
    return {
      siteId: 0,
      siteName: ""
    };
  },
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
    },
    // 获取siteName
    getSiteName(siteName) {
      this.siteName = siteName;
    },
    // 显示选择模版弹框
    showTemplate() {
      this.$refs.selectTemplateDialog.showTemplate();
    }
  }
};
</script>


<style lang="scss" scoped>
.member-container {
  position: relative;
  height: 100vh;
}
.wrap {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  .backgroundImg {
    width: 100%;
  }
  .tempalte-selected__section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .textOne {
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
  }
  .textTwo {
    margin-top: 16px;
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .select {
    margin-top: 32px;
    margin-left: 63px;
    width: 202px;
    height: 44px;
    border: 1px solid rgba(0, 193, 222, 1);
    font-size: 12px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 193, 222, 1);
    line-height: 44px;
    &:hover {
      background: rgba(1, 192, 222, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
@media screen and (max-width: 1650px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 24px !important;
  }
  .wrap .select {
    width: 180px;
    height: 40px;
    line-height: 40px;
  }
}
@media screen and (max-width: 1440px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 20px !important;
  }
  .wrap .select {
    width: 140px;
    height: 30px;
    line-height: 30px;
  }
}
@media screen and (max-width: 1260px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 16px !important;
  }
}
</style>
