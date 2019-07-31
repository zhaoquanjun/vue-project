<template>
  <el-container class="member-container">
    <el-aside style="width:120px">
      <page-submenu :submenu-list="submenuList">
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <ChangeSite />
      <el-row style="padding:23px">
        <div style="border-bottom:10px solid #F6F8FA">
          <div class="mySiteTitle">我的网站</div>
          <div class="siteWrap">
            <div>
              <div class="siteinfoItem siteName">
                <span>网站名称：</span>
                <span class="siteinfoName">{{siteName}}</span>
              </div>
              <div class="siteinfoItem siteLanguage">
                <span>网站语言：</span>
                <span>{{language == "zh-CN" ? "中文" : language}}</span>
              </div>
              <div class="siteinfoItem siteDomain">
                <span>网站地址：</span>
                <span class="siteinfoDomain">{{secondDomain}}</span>
              </div>
              <div class="siteinfoItem siteTime">
                <span>发布时间：</span>
                <span>未发布</span>
              </div>
            </div>
            <button class="btn release">发布</button>
            <button class="btn prev">预览</button>
            <button class="btn design">设计</button>
          </div>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import * as siteBackupApi from "@/api/request/siteBackupApi";
// import SiteDomain from "@/components/websiteManage/siteDomain.vue";
export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      submenuList: [
        { name: "网站备份", url: "/website/backup" },
        { name: "我的网站", url: "/website/mysite" },
        { name: "公司信息", url: "/website/companyinfo" },
        { name: "域名管理", url: "/website/sitedomain" },
        { name: "邮件服务器", url: "/website/email" }
      ],
      siteName: "",
      siteId: 0,
      secondDomain: "",
      language: ""
    };
  },
  computed: {},
  mounted() {
    this.getSiteInfo();
  },
  methods: {
    /**
     * 获取站点信息
     */
    async getSiteInfo() {
      let { data } = await siteBackupApi.getSiteInfo(2);
      console.log(data);
      this.siteName = data.siteName;
      this.secondDomain = data.secondDomain;
      this.siteId = data.id;
      this.language = data.language;
    }
  }
};
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.mySiteTitle {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  margin-top: 9px;
  margin-bottom: 15px;
}
.siteWrap {
  height: 233px;
  position: relative;
  .siteinfoItem {
    margin-left: 339px;
    position: absolute;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
    }
  }
  .siteName {
    top: 58px;
  }
  .siteLanguage {
    top: 94px;
  }
  .siteDomain {
    top: 132px;
  }
  .siteTime {
    top: 168px;
  }
  .siteinfoName {
    color: rgba(38, 38, 38, 1);
  }
  .siteinfoDomain {
    color: rgba(0, 194, 222, 1);
  }
  .btn {
    position: absolute;
    right: 50px;
    width: 110px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(1, 192, 222, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(1, 192, 222, 1);
  }
  .release {
    top: 48px;
  }
  .prev {
    top: 100px;
  }
  .design {
    background: rgba(1, 192, 222, 1);
    color: rgba(255, 255, 255, 1);
    top: 153px;
  }
}
</style>

