<template>
  <div class="siteBox" v-if="siteInfoList.length != 1">
    <el-col :span="24" class="siteInfo">
      <span class="siteName">{{ siteName }}</span>
      <a class="secondDomain" :href="secondDomain" target="_blank">{{secondDomain}}</a>
      <span class="language">{{_getLanguage(language)}}</span>
      <button class="changeSite" @click="changeSite" v-show="siteInfoList.length != 0">切换站点</button>
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
          <span class="close-pannel" @click="closeDialog">
            <i class="iconfont iconX" style="font-size:14px;color:#ccc"></i>
          </span>
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
              <img :src="item.siteImage" alt class="itemSiteImageBackground" />
              <div class="siteLanguage">{{_getLanguage(item.language)}}</div>
              <div class="modal" v-if="item.siteId != curSiteId">
                <button class="choseSite" @click="choseSite(item)">选择网站</button>
              </div>
              <div class="curModal" v-show="item.siteId == curSiteId">当前选择</div>
            </div>
            <div>
              <div class="itemSiteName">{{item.siteName}}</div>
              <a
                class="itemSiteDomain"
                href="item.secondDomain"
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
import { setLocal, getLocal } from "@/libs/local.js";
import { getLanguage } from "@/configure/appCommon";
import { getApplication } from "@/api/request/dashboardApi";
import Cookies from "js-cookie";
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
  computed: {
    mySiteId() {
      return this.$store.state.dashboard.siteId;
    }
  },
  methods: {
    getSiteId() {
      if (this.mySiteId) {
        this.curSiteId = this.mySiteId;
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
      // setLocal("siteid", item.siteId);
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
  height: 69px;
  border-bottom: 1px solid #eee;
  .siteInfo {
    width: 100%;
    height: 69px;
    position: relative;
    .siteName {
      font-size: 14px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 69px;
      position: absolute;
      left: 44px;
    }
    .secondDomain {
      font-size: 12px;
      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      line-height: 69px;
      position: absolute;
      right: 226px;
    }
    .language {
      font-size: 12px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 69px;
      position: absolute;
      right: 154px;
    }
    .changeSite {
      width: 90px;
      height: 32px;
      border: 1px solid rgba(1, 192, 222, 1);

      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      position: absolute;
      top: 19px;
      right: 32px;
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
    padding: 24px;
    border-bottom: 1px solid #eee;
    .dialogTitleText {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
    }
  }

  .close-pannel {
    float: right;
    cursor: pointer;
  }
  .templateItem {
    // padding: 5px;
    padding-top: 32px;
    .itemSiteImage {
      position: relative;
      width: 100%;
      transition: all 0.3s ease-in;
      .itemSiteImageHeader {
        width: 100%;
      }
      .siteLanguage {
        position: absolute;
        top: 40px;
        right: 12px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        padding:0 12px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 22px;
      }
      .itemSiteImageBackground {
        margin-top: -2px;
        width: 100%;
        height: 100%;
      }
      .choseSite {
        width: 90px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
      }
      .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: rgba(0, 0, 0, 0.7);
      }
      &:hover {
        transform: translateY(-10px);
        .modal {
          opacity: 1;
        }
      }
      .curModal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        background: rgba(0, 0, 0, 0.7);
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
    }
    .itemSiteName {
      font-size: 16px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 24px;
      margin-bottom: 14px;
      margin-top: 14px;

      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .itemSiteDomain {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: rgba(0, 193, 222, 1);
    }
  }
}
</style>
