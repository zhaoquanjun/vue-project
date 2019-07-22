<template>
  <div class="home-page">
    <p class="welcome-words">今日，2019年6月22日星期六，欢迎您回到云速成美站控制台。</p>
   
    <el-row style="display: flex;">
      <el-col >
        <siteinfo />
        <plugins :plugins="dashboardData.pluginList" v-if="dashboardData.pluginList && dashboardData.pluginList.length > 0" />
        <content-num :contentNumber="contentNumber" v-if="Object.keys(contentNumber).length > 0" />
        <recommend :recommend="recommend" />
      </el-col>
     
      <!-- <div class="board-right" style="margin-left:19px"></div> -->
      <el-row>
        <el-row class="appInfo">
          <el-col class="appName">
            <span>{{appInfo.name}}</span>
          </el-col>
          <el-col class="appVersion">
            <span>{{appInfo.skuId}}</span>
          </el-col>
          <el-col class="appTime">
            <span>{{appInfo.time}}</span>
          </el-col>
        </el-row>

        <el-row class="designCheats">
          <h3>设计秘籍</h3>
          <el-table
            :data="versionInfo"
            :stripe="true"
            style="width: 100%">
            <el-table-column
              prop="versionDescription"
              label="版本"
              width="180">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="时间"
              width="180">
            </el-table-column>
          </el-table>
        </el-row>

        <el-row class="versionUpdate">
          <h3>版本更新</h3>
          <el-table
            :data="versionInfo"
            :stripe="true"
            style="width: 100%">
            <el-table-column
              prop="versionDescription"
              label="版本"
              width="180">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="时间"
              width="180">
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-row>
      
  </div>
</template>

<script>
import siteinfo from '@/components/dashboard/siteinfo';
import Plugins from '@/components/dashboard/plugins';
import ContentNum from '@/components/dashboard/contentNum';
import recommend from '@/components/dashboard/recommend';
import { getUserDashboard } from "@/api/index";
import { formatDateTime } from "@/api/index";
import * as dashboardApi from "@/api/request/dashboardApi";
export default {
  data() {
    return {
      appInfo: {},
      versionInfo: [],
      dashboardData: {},
      contentNumber: {},
      recommend: []
    }
  },
  components: {
    siteinfo,
    Plugins,
    ContentNum,
    recommend
  },
  created() {
    this.getDashboardData();
    this.getAppInfo();
    this.getVersions();
    this.getRecommends()
  },
  methods: {
    async getDashboardData() {
      let { data } = await getUserDashboard();
      console.log(data)
      this.dashboardData = data
        this.contentNumber = {
            newsCount: data.contentsNumber.newsCount,
            filesCount: data.contentsNumber.filesCount,
            picturesCount: data.contentsNumber.picturesCount,
            productsCount: data.contentsNumber.productsCount
        }
    },
    async getAppInfo () {
      let { data } = await dashboardApi.getApplication();
      console.log(data)
      this.appInfo = data;
      this.appInfo.time = formatDateTime(this.appInfo.createTime, 'yyyy年mm月dd日') + '-' + formatDateTime(this.appInfo.expiredTime, 'yyyy年mm月dd日')
    },
    async getVersions () {
      let { data } = await dashboardApi.getVersions()
      console.log(data)
      this.versionInfo = data
      for(var i = 0; i < this.versionInfo.length; i++){
        this.versionInfo[i].updateTime = formatDateTime(this.versionInfo[i].updateTime, 'MM.dd')
      }
    },
    async getRecommends () {
      let { data } = await dashboardApi.getRecommends()
      console.log(data)
      this.recommend = data;
    },
  }
}
</script>

<style lang="scss" scoped>
  .home-page {
    padding: 0 24px 32px;
    background:rgba(245,245,246,1);
    overflow: hidden;
    .welcome-words {
      padding: 24px 0 16px;
      color: #262626;
      line-height:17px;
    }
  }
  .board-right{
    min-width: 269px;
    min-height: 680px;
    background: url("~img/board-right.png") no-repeat center;
    background-size: cover;
    
  }
  .appInfo{
    margin-left: 10px;
    width: 442px;
    height: 140px;
    background: #fff;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.15);
    .appName{
      height: 45px
    }
    .appVersion{
      height: 45px
    }
    .appTime{
      height: 45px
    }
  }
  .designCheats{
    background: #fff;
    margin-left: 10px;
    margin-top: 20px;
  }
  .versionUpdate{
    background: #fff;
    margin-left: 10px;
    margin-top: 20px;
  }
</style>
