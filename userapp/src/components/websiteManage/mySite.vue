<template>
  <el-container class="member-container">
    <el-aside style="width:120px">
      <page-submenu :submenu-list="submenuList">
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="siteContent">
        <div class="mySiteTitle" style="margin-top: 9px">我的网站</div>
        <div class="siteWrap">
          <div class="siteImg"></div>
          <div class="siteinfoWrap">
            <div class="siteinfoItem siteName" style="margin-top:26px">
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
          <div class="siteinfoBackImg"></div>
          <button class="siteinfoBtn release">发布</button>
          <button class="siteinfoBtn prev">预览</button>
          <button class="siteinfoBtn design">设计</button>
        </div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">网站信息</div>
        <div class="siteTypeWrap">
          <div class="siteType">网站类型</div>
          <div class="siteTypeSelect">
            <el-select v-model="value" placeholder="请选择站点类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="siteIndustry">所属行业</div>
          <div class="siteIndustrySelect">
            <el-select v-model="value" placeholder="请选择所属行业">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <button class="saveBtn">保存</button>
        </div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">流量统计</div>
        <div style="height:401px"></div>
      </el-row>
      <el-row style="padding:23px">
        <div class="mySiteTitle">网站设置</div>
        <div class="siteSettingWrap" style="margin-top:32px">
          <span class="siteSetting">网站icon</span>
          <span class="siteSetting showAliService">显示阿里云服务信息</span>
          <el-switch
            v-model="isShowAliServiceValue"
            active-color="#01C0DE"
            style="margin-left:16px"
          ></el-switch>
        </div>
        <div class="siteSettingWrap">
          <span class="siteSetting">启用Powered by</span>
          <el-switch v-model="isOpenPoweredValue" active-color="#01C0DE" style="margin-left:38px"></el-switch>
          <span class="siteSetting rightClickSave">禁止右键保存图片</span>
          <el-switch
            v-model="isRightClickSaveValue"
            active-color="#01C0DE"
            style="margin-left:16px"
          ></el-switch>
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
      language: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      isShowAliServiceValue: false,
      isOpenPoweredValue: false,
      isRightClickSaveValue: false
    };
  },
  computed: {},
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.getSiteInfo(siteId);
    },
    /**
     * 获取站点信息
     */
    async getSiteInfo(siteId) {
      console.log(siteId);
      let { data } = await siteBackupApi.getSiteInfo(siteId);
      console.log(data);
      this.siteName = data.siteName;
      this.secondDomain = data.secondDomain;
      this.siteId = data.id;
      this.language = data.language;
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      console.log(siteId);
      this.getSiteInfo(siteId);
    }
  }
};
</script>
<style scoped>
.siteTypeSelect {
  display: inline-block;
  margin-left: 24px;
}
.siteTypeSelect /deep/ .el-input__inner {
  width: 225px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(229, 229, 229, 1);
}
.siteTypeSelect /deep/ .el-input__icon {
  line-height: 32px;
}
.siteIndustrySelect {
  display: inline-block;
  margin-left: 24px;
}
.siteIndustrySelect /deep/ .el-input__inner {
  width: 225px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(229, 229, 229, 1);
}
.siteTypeSelect /deep/ .el-input__icon {
  line-height: 32px;
}
</style>
<style lang="scss" scoped>
.member-content {
  background: #fff;
}
.mySiteTitle {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  margin-bottom: 15px;
}
.siteContent {
  padding: 23px;
  border-bottom: 10px solid #f6f8fa;
}
.siteWrap {
  width: 100%;
  height: 201px;
  position: relative;
  padding-top: 32px;
  .siteImg {
    display: inline-block;
    width: 259px;
    height: 169px;
    margin-left: 32px;
    background: green;
    vertical-align: top;
  }
  .siteinfoWrap {
    display: inline-block;
    margin-left: 24px;
    // height: 233px;
  }
  .siteinfoItem {
    // margin-left: 339px;
    // position: absolute;
    margin-top: 16px;
    span {
      margin-left: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
    }
  }
  .siteinfoBackImg {
    // display: inline-block;
    // width: 956px;
    // background: url("~img/siteManage/mysiteBackground.png") no-repeat center;
    // background-size: 100%;
  }
  .siteinfoName {
    color: rgba(38, 38, 38, 1);
  }
  .siteinfoDomain {
    color: rgba(0, 194, 222, 1);
  }
  .siteinfoBtn {
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
.siteTypeWrap {
  position: relative;
  .siteType {
    display: inline-block;
    margin-top: 37px;
    margin-left: 29px;
    margin-bottom: 37px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .siteIndustry {
    display: inline-block;
    margin-top: 37px;
    margin-left: 97px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .saveBtn {
    position: absolute;
    bottom: 32px;
    right: 50px;
    width: 110px;
    height: 32px;
    background: rgba(1, 192, 222, 1);
    border-radius: 2px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
  }
}

.siteSettingWrap {
  margin-top: 17px;
  margin-left: 31px;
  .siteSetting {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .showAliService {
    margin-left: 310px;
  }
  .rightClickSave {
    margin-left: 184px;
  }
}
</style>

