<template>
  <el-container class="member-container">
    <el-aside style="width:120px">
      <page-submenu :submenu-list="submenuList">
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <el-row>
        <ChangeSite></ChangeSite>
      </el-row>
      <el-row class="wrap">
        <el-col :span="8" style="min-width: 500px; max-width: 688px;">
          <img src="~img/siteManage/selectTemplate.png" alt class="backgroundImg" />
        </el-col>
        <el-col :span="8">
          <div class="tempalte-selected__section">
            <el-col class="textOne">选择网站模板，立即开启网站管理</el-col>
            <el-col class="textTwo">建立您的第一个专业网站。</el-col>
            <button class="select" @click="showTemplate">选择模版</button>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <div class="my-chose-template">
      <el-dialog title="选择模版" width="100%" :fullscreen="true" :visible.sync="templateShow">
        <div style="border-top:1px solid #eee">
          <div>
            <el-tabs v-model="templateType" type="card">
              <el-tab-pane label="模版库" name="manual"></el-tab-pane>
              <el-tab-pane label="已有网站" name="auto"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
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
      templateShow: false,
      templateType: "manual"
    };
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * 显示选择模版弹框
     */
    showTemplate() {
      this.templateShow = true;
    }
  }
};
</script>
<style scoped>
.el-tabs {
  margin-top: 24px;
}
.el-tabs /deep/ .el-tabs__item {
  height: 38px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  border-bottom: 1px solid #e4e7ed;
  background: rgba(245, 245, 245, 1);
  vertical-align: top;
  border-top: 2px solid transparent;
}
.el-tabs /deep/ .is-active {
  color: rgba(1, 192, 222, 1);
  border-top: 2px solid rgb(72, 201, 226);
  border-bottom: 1px solid transparent;
  background: rgb(255, 255, 255);
}
</style>

<style lang="scss" scoped>
.member-container {
  position: relative;
}

.wrap {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  .backgroundImg {
    width: 100%;
  }
  .tempalte-selected__section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .textOne {
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
  }
  .textTwo {
    margin-top: 16px;
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .select {
    margin-top: 32px;
    margin-left: 63px;
    width: 202px;
    height: 44px;
    border: 1px solid rgba(0, 193, 222, 1);
    font-size: 12px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 193, 222, 1);
    line-height: 44px;
    &:hover {
      background: rgba(1, 192, 222, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}

.my-chose-template .dialog-fade-enter-active {
  animation: my-dialog-fade-in 0.3s;
}
.my-chose-template .dialog-fade-leave-active {
  animation: my-dialog-fade-out 0.3s;
}
@keyframes my-dialog-fade-in {
  0% {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes my-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
@media screen and (max-width: 1650px) {
  .wrap .textOne, .wrap .textTwo {
    font-size: 24px !important;
  }
  .wrap .select {
    width: 180px;
    height: 40px;
    line-height: 40px;
  }
}
@media screen and (max-width: 1440px) {
  .wrap .textOne, .wrap .textTwo {
    font-size: 20px !important;
  }
  .wrap .select {
    width: 140px;
    height: 30px;
    line-height: 30px;
  }
}
@media screen and (max-width: 1260px) {
  .wrap .textOne, .wrap .textTwo {
    font-size: 16px !important;
  }
}
</style>
