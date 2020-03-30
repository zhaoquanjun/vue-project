<template>
  <div class="home-page" :style="{height:homeHeight}" v-scrollBar>
    <siteInfo
      ref="siteInfo"
      :siteCount="siteCount"
      :isSystem="isSystem"
      @getSites="getSites"
      v-show="isSiteInfoShow&&siteInfoList.length"
    />
    <content-num :contentNumber="contentNumber" />
    <memberManage :contentNumber="contentNumber" />
    <settingCenter :contentNumber="contentNumber" />
    <div style="margin-top:40px;width:100px;height:1px;"></div><!-- 兼容safari 底部不显示问题 -->
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
    if(this.siteList.length > 0){
      this.siteInfoList = this.$store.state.dashboard.siteList;
      this.$refs.siteInfo.getSiteInfo(this.$store.state.dashboard.siteList);
    }
    this.getContentInfo();
    this.amIAdmin();
    this.$Loading.hide();
    this.$nextTick(() => {
      window.addEventListener("resize", this.resizeWindow);
      document.getElementsByClassName("home-page")[0].style.height =
        window.innerHeight - 50 + "px";
    });
  },
  methods: {
    //  获取站点列表
    async getSites() {
      let { data } = await dashboardApi.getSites();
      this.siteInfoList = data;
      this.$store.commit("set_siteList", data);
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
    },
    resizeWindow(){
      document.getElementsByClassName("home-page")[0].style.height =
          window.innerHeight - 50 + "px";
    }
  },
  computed: {
    isSiteInfoShow() {
      return this.$store.state.dashboard.isSiteInfoShow;
    },
    siteList() {
      return this.$store.state.dashboard.siteList;
    }
  },

  watch: {
    siteList() {
      if(this.siteList.length > 0){
        this.siteInfoList = this.$store.state.dashboard.siteList;
        this.$refs.siteInfo.getSiteInfo(this.$store.state.dashboard.siteList);
      }
    }
  },
  beforeDestroy(){
    window.removeEventListener("resize",this.resizeWindow)
  }
};
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.home-page {
  padding: 0 16px;
  background: rgba(244, 245, 246, 1);
  position: relative;
}
</style>
