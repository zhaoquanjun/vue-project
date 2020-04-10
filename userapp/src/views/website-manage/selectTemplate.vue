<template>
  <el-container class="member-container">
    <el-main class="member-content">
      <el-row style="padding:0 32px">
        <ChangeSite @getSiteId="getSiteId" @getSiteName="getSiteName" @getCurSiteinfo="getCurSiteinfo"></ChangeSite>
      </el-row>
      <el-row class="wrap">
        <div class="tempalte-selected__section">
          <div class="text">选择网站模板，立即开启网站管理</div>
          <img src="~img/siteManage/selectTemplate.png" alt class="backgroundImg" />
          <button
            class="cl-button cl-button--primary"
            v-show="curSiteinfo.language=='zh-CN'"
            @click="showTemplate"
          >选择模版</button>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            :content="curSiteinfo.anyChineseSiteHasBeenInitialized?'建议先完成中文站的搭建再整体进行外文站点初始化':'请先完成中文站点的模板选择'"
          >
            <button
              v-show="curSiteinfo.language!='zh-CN'"
              class="cl-button cl-button--primary"
              :class="{'disabled':!curSiteinfo.anyChineseSiteHasBeenInitialized}"
              @click="showTemplate"
            >初始化站点</button>
          </el-tooltip>
        </div>
      </el-row>
    </el-main>
    <SelectTemplateDialog ref="selectTemplateDialog" :siteId="siteId" :siteName="siteName"></SelectTemplateDialog>
    <InitializedDialog
      ref="initializedDialog"
      :curSiteinfo="curSiteinfo"
      :siteId="siteId"
    ></InitializedDialog>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import InitializedDialog from "@/components/dashboard/initializedDialog.vue";
import * as templateApi from "@/api/request/templateApi";
import { getLanguage } from "@/configure/appCommon";
import { designerUrl } from "@/environment/index";

export default {
  components: {
    PageSubmenu,
    ChangeSite,
    SelectTemplateDialog,
    InitializedDialog
  },
  data() {
    return {
      siteId: 0,
      siteName: "",
      curSiteinfo: {}
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
    getCurSiteinfo(curSiteinfo) {
      this.curSiteinfo = curSiteinfo;
    },
    // 显示选择模版弹框
    showTemplate() {
      if (this.curSiteinfo.language == "zh-CN") {
        this.$refs.selectTemplateDialog.showTemplate();
      } else {
        this.$refs.initializedDialog.showInitializedDialog();
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.member-container {
  position: relative;
  height: 100vh;
}
.disabled{
  cursor: not-allowed;
  background-color: $--border-color-base;
  border-color: $--border-color-base;
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
