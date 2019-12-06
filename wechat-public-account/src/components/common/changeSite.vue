<template>
  <div class="siteBox" v-if="siteInfoList.length != 1">
    <el-col :span="24" class="siteInfo">
      <el-tooltip :content="siteName" placement="bottom" :disabled="siteName.trim().length < 30">
        <span class="siteName">
          <span class="siteIconTriangle"></span>
          <span class="siteIconTriangle" style="border-left-color:#ff964b;margin-left:-3px;"></span>
          {{siteName && siteName.trim().length > 30 ? siteName.slice(0, 30) + '...' : siteName}}
        </span>
      </el-tooltip>
      <a class="secondDomain" :href="`http://${secondDomain}`" target="_blank">{{secondDomain}}</a>
      <span class="language">{{_getLanguage(language)}}</span>
      <button class="changeSite" @click="changeSite" v-show="siteInfoList.length != 0">
        <i
          class="iconfont iconqiehuanxingshier"
          style="color:#ff6b00;font-size:12px;margin-right:5px;"
        ></i>
        切换站点
      </button>
    </el-col>
    <el-dialog
      width="0"
      :visible.sync="changeSiteShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="right-pannel" :style="computeSiteNum()">
        <div class="dialogTitle">
          <span class="dialogTitleText">切换网站</span>
          <i class="iconfont iconguanbi cl-iconfont is-circle" @click="closeDialog"></i>
        </div>
        <el-row :gutter="20" style="padding:0 30px; padding-bottom:30px;">
          <el-col
            class="templateItem"
            :span="siteNum()"
            v-for="(item, index) in siteInfoList"
            :key="index"
          >
            <div class="itemSiteImage">
              <img src="~img/siteManage/siteHeader.png" class="itemSiteImageHeader" />
              <div
                class="itemSiteImageBackground"
                :style="{background: 'url(' + (item.siteImage ) + ') no-repeat center/cover'}"
              >
                <div class="modal" v-if="item.siteId != curSiteId">
                  <button
                    class="choseSite cl-button cl-button--primary"
                    @click="choseSite(item)"
                  >选择网站</button>
                </div>
                <div class="siteLanguageWrap">
                  <div class="curSite" v-show="item.siteId == curSiteId">当前选择</div>
                  <div class="siteLanguage">{{_getLanguage(item.language)}}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="itemSiteName">{{item.siteName}}</div>
              <a
                class="itemSiteDomain"
                :href="`http://${item.secondDomain}`"
                target="_blank"
              >{{item.secondDomain}}</a>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as siteBackupApi from "@/api/request/siteBackupApi";
import * as dashboardApi from "@/api/request/dashboardApi";
import { setLocal } from "@/libs/local.js";
import { getLanguage } from "@/configure/appCommon";
import { getCookie } from "@/libs/cookie";
export default {
  props: ["changeSiteName", "changeSiteLanguage"],
  components: {},
  data() {
    return {
      curSiteId: 0,
      siteName: "",
      siteId: 0,
      secondDomain: "",
      language: "",
      changeSiteShow: false,
      siteInfoList: []
    };
  },
  mounted() {
    this.getSiteId();
    this.getSites();
  },
  watch: {
    changeSiteName() {
      this.siteName = this.changeSiteName;
    },
    changeSiteLanguage() {
      this.language = this.changeSiteLanguage;
    }
  },
  methods: {
    getSiteId() {
      if (this.$store.state.dashboard.siteId) {
        this.curSiteId = this.$store.state.dashboard.siteId;
        this.$emit("getSiteId", this.curSiteId);
        this.getSiteInfo(this.curSiteId);
      } else {
        this.getCurSiteId().then(() => {
          this.getSiteInfo(this.curSiteId);
        });
      }
    },
    /**
     * 获取当前siteId
     */
    async getCurSiteId() {
      let { data } = await dashboardApi.getCurSiteId();
      this.curSiteId = data;
      this.$emit("getSiteId", this.curSiteId);
      this.$store.commit("SETSITEID", this.curSiteId);
    },
    _getLanguage(language) {
      return getLanguage(language);
    },
    /**
     * 获取站点信息
     */
    async getSiteInfo(siteId) {
      let { data } = await siteBackupApi.getSiteInfo(siteId);
      this.siteName = data.siteName;
      this.secondDomain = data.secondDomain;
      this.siteId = data.siteId;
      this.language = data.language;
      this.$emit("getSiteName", this.siteName);

    },
    /**
     * 获取站点列表
     */
    async getSites() {
      let { data } = await dashboardApi.getSites();
      this.siteInfoList = data;
    },
    /**
     * 显示切换弹框
     */
    changeSite() {
      this.changeSiteShow = true;
      this.getSites();
    },
    // 选择新的site
    async choseSite(item) {
      this.changeSiteShow = false;
      this.$store.commit("SETSITEID", item.siteId);
      await dashboardApi.updateUserLastSiteId(item.siteId);
      this.$emit("chooseWebsite", item.siteId);
      this.getSiteInfo(item.siteId);
      this.curSiteId = item.siteId;
    },
    /**
     * 关闭弹框
     */
    async closeDialog() {
      this.changeSiteShow = false;
    },
    siteNum() {
      switch (this.siteInfoList.length) {
        case 2:
          return 12;
        default:
          return 8;
      }
    },
    // 计算site个数
    computeSiteNum() {
      switch (this.siteInfoList.length) {
        case 2:
          return { width: "35%" };
        case 3:
          return { width: "50%" };
        default:
          return { width: "50%" };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.siteBox {
  width: 100%;
  height: 40px;
  .siteInfo {
    width: 100%;
    height: 40px;
    background: rgba(255, 107, 0, 0.14);
    position: relative;
    .siteIconTriangle {
      display: inline-block;
      width: 5px;
      height: 0;
      border: 5px solid transparent;
      border-right: 0;
      border-left: 5px solid #ff6b00;
    }
    .siteName {
      font-size: 12px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      margin: 14px 16px;
    }
    .secondDomain {
      font-size: 12px;
      font-weight: 400;
      color: #ff6b00;
      margin-left: 6px;
      line-height: 40px;
      &:hover {
        opacity: 0.8;
      }
    }
    .language {
      font-size: 12px;
      font-weight: 400;
      color: #ff6b00;
      padding: 2px 4px;
      margin-left: 16px;
      background: rgba(255, 200, 161, 1);
      line-height: 40px;
    }
    .changeSite {
      font-size: 12px;
      font-weight: 400;
      color: #262626;
      position: absolute;
      right: 16px;
      line-height: 40px;
      &:hover {
        color: #ff6b00;
      }
    }
  }
}
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .dialogTitle {
    padding: 24px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .dialogTitleText {
      font-size: $--font-size-medium;
      font-weight: $--font-weight-primary;
      color: $--color-text-primary;
    }
  }
  .templateItem {
    padding-top: 24px;
    .itemSiteImage {
      position: relative;
      width: 100%;
      transition: all 0.3s ease-in;
      .itemSiteImageHeader {
        width: 100%;
      }
      .siteLanguageWrap {
        position: absolute;
        top: 0;
        left: 0;
        .curSite {
          display: inline-block;
          margin-left: 8px;
          margin-top: 10px;
          width: 87px;
          height: 32px;
          background: $--color-black-light;
          text-align: center;
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-white;
          line-height: 32px;
        }
        .siteLanguage {
          display: inline-block;
          margin-left: 8px;
          margin-top: 10px;
          background: $--color-white;
          border-radius: $--border-radius-base;
          padding: 0 10px;
          height: 32px;
          text-align: center;
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-text-primary;
          line-height: 32px;
        }
      }
      .itemSiteImageBackground {
        margin-top: -2px;
        width: 100%;
        padding-bottom: 62%;
        position: relative;
      }
      .choseSite {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      &:hover {
        transform: translateY(-10px);
        .modal {
          opacity: 1;
        }
      }
    }
    .itemSiteName {
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
      color: $--color-text-primary;
      line-height: 17px;
      margin-top: 16px;

      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
    .itemSiteDomain {
      display: block;
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
      line-height: 17px;
      color: $--color-primary;
    }
  }
}
</style>
