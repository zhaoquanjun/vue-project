<template>
  <div class="home-page" :style="{height:homeHeight}" v-scrollBar>
    <div class="welcome-wrap">
      <div class="welcome-text">
        <span class="welcome-word">今日</span>
        <span class="welcome-word" style="font-weight:400">，{{curDate}}，欢迎您回到云速成美站控制台</span>
      </div>
      <div class="img"></div>
    </div>
    <!-- <siteinfo
          ref="siteInfo"
          :siteInfo="siteInfoList"
          :isCanCreate="isCanCreate"
          :isSystem="isSystem"
          @getDashboardData="getDashboardData"
          v-show="siteInfoList.length && $store.state.dashboard.isSiteInfoShow"
    />-->
    <siteInfo
      ref="siteInfo"
      :siteCount="siteCount"
      :isSystem="isSystem"
      v-show="siteInfoList.length"
    />
    <content-num :contentNumber="contentNumber" />
    <memberManage :contentNumber="contentNumber" />
    <settingCenter />
  </div>
</template>

<script>
import siteInfo from "@/components/dashboard/siteinfo";
import ContentNum from "@/components/dashboard/contentNum";
import memberManage from "@/components/dashboard/memberManage";
import settingCenter from "@/components/dashboard/settingCenter";

import * as dashboardApi from "@/api/request/dashboardApi";
export default {
  data() {
    return {
      homeHeight: 0,
      siteInfoList: [],
      siteCount: 0,
      contentNumber: {},
      isSystem: false
    };
  },
  components: {
    siteInfo,
    ContentNum,
    memberManage,
    settingCenter
  },
  mounted() {
    this.$Loading.show();
    this.getSites();
    this.getContentInfo();
    this.amIAdmin();
    this.$Loading.hide();
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        document.getElementsByClassName("home-page")[0].style.height =
          window.innerHeight - 50 + "px";
      });
      document.getElementsByClassName("home-page")[0].style.height =
        window.innerHeight - 50 + "px";
    });
  },
  methods: {
    //  获取站点列表
    async getSites() {
      let { data } = await dashboardApi.getSites();
      this.siteInfoList = data;
      this.$refs.siteInfo.getSiteInfo(this.siteInfoList);
    },
    async getContentInfo() {
      let { data } = await dashboardApi.getContentInfo();
      this.contentNumber = data;
      this.siteCount = this.contentNumber.siteMaxCount;
    },
    async amIAdmin() {
      let { data } = await dashboardApi.amIAdmin();
      this.isSystem = data;
    }
  },
  computed: {
    appId() {
      return this.$store.state.dashboard.appId;
    },
    curDate() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month = myDate.getMonth() + 1;
      let date = myDate.getDate();
      let day = myDate.getDay();
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      let week = weeks[day];
      let curDate = year + "年" + month + "月" + date + "日" + week;
      return curDate;
    }
  },
  watch: {
    appId() {}
  }
};
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.home-page {
  padding: 0 24px 32px;
  background: rgba(244, 245, 246, 1);
  position: relative;
  .welcome-wrap {
    height: 65px;
    display: flex;
    justify-content: space-between;
    .welcome-text {
      margin-top: 28px;
      .welcome-word {
        font-size: 14px;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 20px;
      }
    }
    .img {
      width: 173px;
      height: 60px;
      margin-top: 5px;
      background: url("~img/dashboard/board-background.png") no-repeat center;
      background-size: contain;
    }
  }
}
</style>
