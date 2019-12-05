<template>
  <el-container class="member-container">
    <el-main class="member-content">
      <el-row style="padding:0 32px">
        <ChangeSite @getSiteId="getSiteId" @getSiteName="getSiteName"></ChangeSite>
      </el-row>
      <el-row class="wrap">
        <div class="tempalte-selected__section">
          <div class="text">选择网站模板，立即开启网站管理</div>
          <img src="~img/siteManage/selectTemplate.png" alt class="backgroundImg" />
          <button class="cl-button cl-button--primary" @click="showTemplate">选择模版</button>
        </div>
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
  height: calc(100% - 160px);
  display: flex;
  justify-content: center;
  align-items: center;

  .tempalte-selected__section {
    display: flex;
    flex-flow: column;
    align-items: center;
    .text {
      font-size: $--font-size-extra-large;
      color: $--color-text-primary;
    }
    .backgroundImg {
      margin-top: 12px;
      width: 300px;
      margin-bottom: 12px;
    }
  }
}
</style>
