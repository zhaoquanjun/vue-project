<template>
  <div class="home-page">
    <p class="welcome-words">
      今日，2019年6月22日星期六，欢迎您回到云速成美站控制台。
    </p>
    <el-row style="display: flex;">
      <el-col :span="18">
        <siteinfo :siteInfo="siteInfoList" />
        <plugins
          :plugins="dashboardData.pluginList"
          v-if="dashboardData.pluginList && dashboardData.pluginList.length > 0"
        />
        <content-num
          :contentNumber="contentNumber"
          v-if="Object.keys(contentNumber).length > 0"
        />
        <recommend :recommend="recommend" />
      </el-col>
      <!-- <div class="board-right" style="margin-left:19px"></div> -->
      <el-col :span="6">
        <el-row class="appInfo">
          <el-col class="appName">
            <span>{{ appInfo.name }}</span>
          </el-col>
          <el-col class="appVersion">
            <span>{{ appInfo.productName }}</span>
          </el-col>
          <div class="appLine"></div>
          <el-col class="appTime">
            <span>{{ appInfo.time }}</span>
          </el-col>
          <button class="renewalBtn">续费</button>
        </el-row>

        <el-row class="designCheats">
          <h3 class="designCheatsTitle">设计秘籍</h3>
          <div class="designItem" v-for="(item, index) in versionInfo" :key="index">
            <div class="designDiv" :class="designColor(index)"></div>
            <div class="designInfo">{{ item.versionDescription }}</div>
            <div class="designNoread" v-show="!designIsread">去阅读</div>
            <div class="designReaded" v-show="designIsread"></div>
          </div>
        </el-row>

        <el-row class="versionUpdate">
          <h3 class="versionTitle">版本更新</h3>
          <div class="versionItem" v-for="(item, index) in versionInfo" :key="index">
            <div class="versionInfo">{{ item.versionDescription }}</div>
            <div class="versionDate">{{ item.updateTime }}</div>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import siteinfo from "@/components/dashboard/siteinfo";
import Plugins from "@/components/dashboard/plugins";
import ContentNum from "@/components/dashboard/contentNum";
import recommend from "@/components/dashboard/recommend";
import { getUserDashboard } from "@/api/index";
import { formatDateTime } from "@/api/index";
import * as dashboardApi from "@/api/request/dashboardApi";
export default {
  data() {
    return {
      siteInfoList: [],
      appInfo: {},
      versionInfo: [],
      dashboardData: {},
      contentNumber: {},
      recommend: [],
      designIsread: false,
    };
  },
  components: {
    siteinfo,
    Plugins,
    ContentNum,
    recommend
  },
  created() {
    this.getSiteInfo();
    this.getDashboardData();
    this.getAppInfo();
    this.getVersions();
    this.getRecommends();
  },
  methods: {
    /**
     * 获取site列表
     */
    async getSiteInfo() {
      let { data } = await dashboardApi.getSites();
      console.log(data);
      this.siteInfoList = data;
    },
    /**
     * 获取dashboard
     */
    async getDashboardData() {
      let { data } = await getUserDashboard();
      console.log(data);
      this.dashboardData = data;
      this.contentNumber = {
        newsCount: data.contentsNumber.newsCount,
        filesCount: data.contentsNumber.filesCount,
        picturesCount: data.contentsNumber.picturesCount,
        productsCount: data.contentsNumber.productsCount
      };
    },
    /**
     * 获取app信息
     */
    async getAppInfo() {
      let { data } = await dashboardApi.getApplication();
      console.log(data);
      this.appInfo = data;
      this.appInfo.time = formatDateTime(this.appInfo.createTime, "yyyy年MM月dd日") + "-" + formatDateTime(this.appInfo.expiredTime, "yyyy年MM月dd日");

    },
    /**
     * 获取版本更新列表
     */
    async getVersions() {
      let { data } = await dashboardApi.getVersions();
      console.log(data);
      this.versionInfo = data;
      for (var i = 0; i < this.versionInfo.length; i++) {
        this.versionInfo[i].updateTime = formatDateTime(
          this.versionInfo[i].updateTime,
          "MM.dd"
        );
      }
    },
    /**
     * 获取应用推荐列表
     */
    async getRecommends() {
      let { data } = await dashboardApi.getRecommends();
      console.log(data);
      this.recommend = data;
    },
    /**
     * 设计秘籍内容颜色变化
     */
    designColor(index) {
      switch (index) {
        case 1:
          return "designColorBlue";
        case 2:
          return "designColorRed";
        case 3:
          return "designColorYellow";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  padding: 0 24px 32px;
  background: rgba(245, 245, 246, 1);
  overflow: hidden;
  .welcome-words {
    padding: 24px 0 16px;
    color: #262626;
    line-height: 17px;
  }
}
.board-right {
  min-width: 269px;
  min-height: 680px;
  background: url("~img/board-right.png") no-repeat center;
  background-size: cover;
}
.appInfo {
  margin-right: 10px;
  margin-left: 29px;
  height: 250px;
  background:rgba(0,193,222,1);
  box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
  position: relative;
  .appName {
    position: absolute;
    top: 40px;
    left: 22px;
    font-size:26px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .appVersion {
    position: absolute;
    top: 100px;
    left: 22px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .appLine{
    // width:100%;
    height:1px;
    background: #fff;
    position: absolute;
    top: 154px;
    left: 15px;
  }
  .appTime {
    position: absolute;
    bottom: 39px;
    left: 22px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .renewalBtn{
    position: absolute;
    bottom: 33px;
    left: 270px;
    width:89px;
    height:32px;
    background:rgba(135,223,236,1);
    opacity:0.56;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
}
.designCheats {
  margin: 24px 10px 24px 28px;
  background:rgba(255,255,255,1);
  box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
  padding-bottom: 10px;
  .designCheatsTitle{
    font-size:18px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(38,38,38,1);
    margin-top: 20px;
    margin-left: 16px;
    margin-bottom: 24px;
  }
  .designItem{
    margin: 0px 22px 16px 16px;
    height:70px;
    border-radius:3px;
    border:1px solid rgba(238,238,238,1);
    position: relative;
    .designDiv{
      width:5px;
      height:70px;
      background:rgba(0,193,222,1);
      border-radius:3px 0px 0px 3px;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    .designColorBlue{
      background:rgba(0,114,211,1);
    }
    .designColorRed{
      background:rgba(242,102,102,1);
    }
    .designColorYellow{
      background:rgba(243,175,67,1);
    }
    .designInfo{
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height: 70px;
      margin-left: 30px;
    }
    .designNoread{
      position: absolute;
      right: 23px;
      top: 30px;
      width:36px;
      height:17px;
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,193,222,1);
    }
  }
}
.versionUpdate {
  background:rgba(255,255,255,1);
  box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
  margin-right: 10px;
  margin-left: 28px;
  padding-bottom: 10px;
  .versionTitle{
    font-size:18px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(38,38,38,1);
    margin-top: 20px;
    margin-left: 17px;
    margin-bottom: 19px;
  }
  .versionItem{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(38,38,38,1);
    position: relative;
    margin-left: 16px;
    margin-bottom: 10px;
    margin-right: 25px;
    .versionInfo{
      position: absolute;
      left: 0px;
      color: #262626;
    }
    .versionDate{
      position: absolute;
      right: 0px;
      color: #B5B5B5;
    }
  }

}
</style>
