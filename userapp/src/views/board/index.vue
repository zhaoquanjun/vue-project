<template>
  <div class="home-page">
    <p class="welcome-words">今日，2019年6月22日星期六，欢迎您回到云速成美站控制台。</p>
   
    <el-row style="display: flex;">
      <el-col >
        <plugins :plugins="dashboardData.pluginList" v-if="dashboardData.pluginList && dashboardData.pluginList.length > 0" />
        <content-num :contentNumber="contentNumber" v-if="Object.keys(contentNumber).length > 0" />
      </el-col>
     
        <div class="board-right" style="margin-left:19px"></div>
      
    </el-row>
  </div>
</template>

<script>
import Plugins from '@/components/dashboard/plugins';
import ContentNum from '@/components/dashboard/contentNum';
import { getUserDashboard } from "@/api/index";
export default {
  data() {
    return {
      dashboardData: {},
      contentNumber: {}
    }
  },
  components: {
    Plugins,
    ContentNum
  },
  created() {
    this.getDashboardData();
  },
  methods: {
    async getDashboardData() {
      let {data, status} = await getUserDashboard();
      this.dashboardData = data
        this.contentNumber = {
            newsCount: data.contentsNumber.newsCount,
            filesCount: data.contentsNumber.filesCount,
            picturesCount: data.contentsNumber.picturesCount,
            productsCount: data.contentsNumber.productsCount
        }
    }
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
    height: 640px;
    background: url("~img/board-right.png") no-repeat center;
    background-size: cover;
    
  }
</style>
