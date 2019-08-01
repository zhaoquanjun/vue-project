<template>
  <div class="siteBox">
    <el-col :span="24" class="siteInfo">
      <span class="siteName">{{ siteName }}</span>
      <span class="secondDomain">{{ secondDomain }}</span>
      <span class="language">{{ language == "zh-CN" ? "中文" : language }}</span>
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
          <span class="close-pannel" @click="closeDialog">X</span>
        </div>
        <el-row :gutter="10">
          <el-col
            class="templateItem"
            :span="siteNum()"
            v-for="(item, index) in siteInfoList"
            :key="index"
          >
            <div class="itemSiteImage">
              <img src class />
              <div class="modal">
                <button class="choseSite" @click="choseSite(item)">选择网站</button>
              </div>
            </div>
            <div>
              <div class="itemSiteName">{{item.siteName}}</div>
              <div class="itemSiteDomain">{{item.secondDomain}}</div>
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
export default {
  components: {},
  data() {
    return {
      siteName: "",
      siteId: 0,
      secondDomain: "",
      language: "",
      changeSiteShow: false,
      siteInfoList: []
    };
  },
  computed: {},
  mounted() {
    this.getSiteInfo(this.$store.state.dashboard.siteId);
    this.getSites();
  },
  methods: {
    /**
     * 获取站点信息
     */
    async getSiteInfo(siteId) {
      let { data } = await siteBackupApi.getSiteInfo(siteId);
      console.log(data);
      this.siteName = data.siteName;
      this.secondDomain = data.secondDomain;
      this.siteId = data.id;
      this.language = data.language;
    },
    /**
     * 获取站点列表
     */
    async getSites() {
      let { data } = await dashboardApi.getSites();
      console.log(data);
      this.siteInfoList = data;
    },
    /**
     * 切换站点
     */
    changeSite() {
      this.changeSiteShow = true;
    },
    // 选择新的site
    async choseSite(item) {
      console.log(item);
      this.changeSiteShow = false;
      setLocal("siteid", item.siteId);
      this.$store.commit("SETSITEID", item.siteId);
      await dashboardApi.updateUserLastSiteIdAndCookie(item.siteId);
      this.$emit("chooseWebsite", item.siteId);
      this.getSiteInfo(item.siteId);
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
      console.log(this.siteInfoList.length);
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
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 69px;
      position: absolute;
      left: 44px;
    }
    .secondDomain {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      line-height: 69px;
      position: absolute;
      right: 226px;
    }
    .language {
      font-size: 12px;
      font-family: PingFangSC-Regular;
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
      font-size: 12px;
      font-family: PingFangSC-Regular;
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
  padding: 20px;
  .dialogTitle {
    height: 71px;
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
    height: 275px;
    padding: 5px;
    .itemSiteImage {
      position: relative;
      width: 100%;
      height: 200px;
      background: green;
      transition: all 0.3s ease-in;
      .choseSite {
        width: 90px;
        height: 32px;
        background: rgba(1, 192, 222, 1);
        font-size: 12px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
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
    }
    .itemSiteName {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      margin-bottom: 14px;
      margin-top: 14px;
    }
    .itemSiteDomain {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 193, 222, 1);
    }
  }
}
</style>
