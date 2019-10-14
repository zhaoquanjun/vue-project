<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="head-left head-item">
          <span class="logo-icon">
            <i class="iconfont iconicon-logo" style="font-size: 24px;"></i>
          </span>
          <span @click="changeApp" class="headAppName">
            <span class="headAppNameInfo">{{headAppName?headAppName:"公司名称"}}</span>
            <i class="iconfont iconqiehuanxingshiyi" style="font-size:16px;vertical-align:middle"></i>
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="head-right head-item">
          <span style="cursor: pointer">
            <i
              class="iconfont iconbianzu1"
              style="margin-right:3px;font-size:16px;vertical-align:middle"
            ></i>
            <b class="item-btn">帮助</b>
          </span>
          <span style="cursor: pointer">
            <i
              class="iconfont iconbianzu2"
              style="margin-right:3px;font-size:16px;vertical-align:middle"
            ></i>
            <b class="item-btn">通知</b>
          </span>
          <span @mouseenter="dropdownAvatarShow" @mouseleave="dropdownAvatarhide">
            <p class="avatar" style="cursor: pointer">
              <img :src="headUrl" alt />
            </p>
            <dl class="login-set dropdown-avatar-menu" v-if="isdropdownAvatarShow">
              <dd @click="pannelShow">个人设置</dd>
              <dd @click="signOut">退出控制台</dd>
            </dl>
          </span>
        </div>
      </el-col>
      <div class="my-chose-app">
        <el-dialog
          :fullscreen="true"
          :visible.sync="changeAppShow"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          :append-to-body="false"
          :show-close="false"
          style="margin-top:50px"
          :modal="false"
          class="myApp"
        >
          <div slot="title">
            <div class="myAppTitle">
              我的应用
              <span
                style="float:right;margin-right:32px;cursor:pointer;"
                @click="closeChangeApp"
              >
                <i
                  class="iconfont iconguanbi"
                  style="color:#262626;font-size:16px;vertical-align:middle"
                ></i>
              </span>
            </div>
          </div>
          <div class="appBackground" v-scrollBar>
            <el-col
              :span="24"
              class="appitem"
              v-for="(item, index) in appList"
              :key="index"
              style="padding:0px"
            >
              <div class="appTitle">
                <span class="appName" v-if="item.name">{{item.name}}</span>
                <span class="appName" v-else>公司名称</span>
                <span
                  class="appMember"
                  :style="{color:item.isSystem? '#35B24B':'#0070CC'}"
                >{{item.isSystem ? "管理员" : "成员"}}</span>
              </div>
              <div class="version">
                <span class="versionText">应用版本</span>
                <span class="versionText">{{item.productName}}</span>
              </div>
              <div class="expired">
                <span class="expiredText">有效期</span>
                <span class="expiredText" style="margin-left:46px">{{item.expired}}</span>
                <div class="isExpired" v-show="isExpired(item)">已过期</div>
                <div class="isExpired" v-show="item.releaseTime&&isreleased(item)">已释放</div>
                <a class="renewal" v-show="item.isSystem" :href="aliMarketUrl" target="_blank">续费</a>
                <el-button
                  class="choseApp"
                  @click="choseApp(item)"
                  :disabled="isExpired(item)||(item.releaseTime&&isreleased(item))"
                  :class="{'disabled':isExpired(item)||(item.releaseTime&&isreleased(item))}"
                  v-if="curAppId != item.appId"
                >进入应用</el-button>
                <el-button
                  class="choseApp disabled"
                  @click="choseApp(item)"
                  disabled
                  v-if="curAppId == item.appId"
                >当前应用</el-button>
              </div>
            </el-col>
          </div>
        </el-dialog>
      </div>
    </el-row>
  </div>
</template>
<script>
import securityService from "@/services/authentication/securityService";
import {
  personalUrl,
  dashboardUrl,
  aliMarketUrl
} from "@/environment/index.js";
import * as dashboardApi from "@/api/request/dashboardApi";
import { formatDateTime } from "@/api/index";
import { setLocal, getLocal } from "@/libs/local.js";
export default {
  data() {
    return {
      aliMarketUrl: aliMarketUrl,
      isdropdownAvatarShow: false,
      appList: [],
      changeAppShow: false,
      curAppId: ""
    };
  },
  created() {
    this.getCurApp();
  },
  methods: {
    signOut() {
      securityService.signOut(location.href);
    },
    pannelShow() {
      if (this.changeAppShow) {
        this.changeAppShow = false;
      }
      location.href = personalUrl;
    },
    dropdownAvatarShow() {
      this.isdropdownAvatarShow = true;
    },
    dropdownAvatarhide() {
      this.isdropdownAvatarShow = false;
    },
    /**
     * 获取app列表
     */
    async getAppList() {
      let { data } = await dashboardApi.getApplicationsByUserId();
      this.appList = data;
      for (var i = 0; i < this.appList.length; i++) {
        this.appList[i].expired =
          formatDateTime(this.appList[i].createTime, "yyyy年MM月dd日") +
          "-" +
          formatDateTime(this.appList[i].expiredTime, "yyyy年MM月dd日");
      }
    },
    //切换app 选择新的app
    async choseApp(item) {
      setLocal("ymId", item.appId);
      this.$store.commit("SETAPPID", item.appId);
      let { data, status } = await dashboardApi.updateUserLastAppIdAndCookie(
        item.appId
      );
      if (status === 200) {
        let { data } = await dashboardApi.getCurSiteId();
        this.$store.commit("SETSITEID", data);
        window.location.href = dashboardUrl;
      }
    },
    /**
     * 关闭弹框
     */
    closeChangeApp() {
      this.changeAppShow = false;
    },
    //显示切换app弹框
    changeApp() {
      if (this.changeAppShow) {
        this.changeAppShow = false;
      } else {
        this.getCurApp();
        this.getAppList();
        this.changeAppShow = true;
        this.$nextTick(() => {
          window.addEventListener("resize", () => {
            document.getElementsByClassName("appBackground")[0].style.height =
              window.innerHeight - 142 + "px";
          });
          document.getElementsByClassName("appBackground")[0].style.height =
            window.innerHeight - 142 + "px";
        });
      }
    },
    // 判断是否过期
    isExpired(item) {
      if (new Date(item.expiredTime) < new Date()) {
        return true;
      }
    },
    // 是否被释放
    isreleased(item) {
      if (new Date(item.releaseTime) < new Date()) {
        return true;
      }
    },
    // 获取当前appId
    getCurApp() {
      this.curAppId = getLocal("ymId")
        ? getLocal("ymId")
        : this.$store.state.dashboard.appId;
    }
  },
  computed: {
    headUrl() {
      let avatar = this.$store.state.user.userInfo.headImageUrl;
      if (avatar) {
        return avatar;
      } else {
        return require("@/assets/defualtAvater.png");
      }
    },
    headAppName() {
      let appName = getLocal("userInfo")
        ? getLocal("userInfo").appName
        : this.$store.state.user.userInfo.appName;
      return appName;
    }
  }
};
</script>
<style scoped>
.myApp /deep/ .el-dialog {
  overflow: hidden;
}
.myApp /deep/ .el-dialog__body {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.disabled {
  opacity: 0.2;
}
.iconlogo1 {
  font-size: 24px;
}
.header {
  padding: 0 10px;
  font-size: 14px;
  background: linear-gradient(to right, #08cceb 50%, #81dca0);
  color: #fff;
  position: relative;
  .head-item {
    .logo-icon {
      border-right: 1px solid hsla(0, 0%, 100%, 0.3);
      width: 60px;
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      padding: 0;
      margin-left: -10px;
      height: 50px;
      vertical-align: top;
    }
    span {
      display: inline-block;
      padding: 0 15px;
      .item-btn {
        vertical-align: middle;
        padding-left: 5px;
      }
    }
    .headAppName {
      cursor: pointer;
      display: flex;
      justify-content: center;
      padding: 0;
      margin-left: 16px;
      height: 40px;
      line-height: 40px;
      width: 250px;
      &:hover {
        background: #06bdda;
        border-radius: 2px;
      }
      .headAppNameInfo {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 60px;
        max-width: 150px;
        vertical-align: middle;
        padding-left: 0;
        padding-right: 6px;
      }
    }
  }
  .head-left {
    display: flex;
    align-items: center;
  }
  .head-right {
    text-align: right;
  }
  .avatar {
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login-set {
    cursor: pointer;
    text-align: left;
    background: #fff;
    color: #a1a8b1;
    position: absolute;
    z-index: 10000;
    right: 0;
    top: 50px;
    border-radius: 2px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    padding: 9px 0;
    dd {
      padding: 0 30px;
      line-height: 32px;
      &:hover {
        color: #262626;
        background: #e0faff;
      }
    }
  }
  .intoDesign {
    width: 120px;
    text-align: left;
    position: absolute;
    z-index: 100;
    left: 0;
    top: 49px;
    font-size: 12px;
    background: #181c20;
    padding: 4px 0;
    padding-left: 20px;
    box-sizing: border-box;

    li {
      cursor: pointer;
      line-height: 20px;
      padding: 4px;
      &:hover {
        color: #00c1de;
      }
    }
  }
  .my-chose-app {
    position: relative;
  }
  .my-chose-app .dialog-fade-enter-active {
    animation: my-dialog-fade-in 0.3s;
  }
  .my-chose-app .dialog-fade-leave-active {
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
}
.myAppTitle {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
  padding: 12px 0 22px;
}
.appBackground {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 245, 245, 1);
  border-top: 1px solid #eee;
  width: 100%;
  height: 100%;
  .appitem {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 32px;
    width: 900px;
    height: 165px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    padding-left: 0px;
    &:hover {
      box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
      transform: translate(-50%, -2px);
    }
    .appTitle {
      width: 100%;
      height: 55px;
      border-bottom: 1px solid #eee;
      .appName {
        margin-left: 32px;
        font-size: 17px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 55px;
      }
      .appMember {
        float: right;
        margin-right: 35px;
        font-size: 14px;
        font-weight: 400;
        line-height: 55px;
      }
    }
    .version {
      margin-top: 25px;
      margin-bottom: 2px;
      line-height: 22px;
      .versionText {
        font-size: 14px;
        font-weight: 400;
        color: #a1a8b1;
        margin-left: 32px;
        line-height: 22px;
      }
    }
    .expired {
      height: 32px;
      margin-bottom: 26px;
      line-height: 32px;
      .expiredText {
        font-size: 14px;
        font-weight: 400;
        color: #a1a8b1;
        margin-left: 32px;
      }
    }
    .isExpired {
      margin-left: 30px;
      display: inline-block;
      width: 56px;
      height: 20px;
      background: rgba(241, 85, 51, 1);
      border-radius: 2px;
      text-align: center;
      font-size: 10px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
    }
    .choseApp {
      position: absolute;
      right: 32px;
      bottom: 28px;
      width: 90px;
      height: 40px;
      background: rgba(0, 193, 222, 1);
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      padding: 0px;
    }
    .choseCurApp {
      position: absolute;
      right: 32px;
      bottom: 28px;
      width: 90px;
      height: 32px;
      background: rgba(140, 140, 140, 1);
      border-radius: 2px;
      font-size: 12px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
      padding: 0px;
    }
    .renewal {
      display: inline-block;
      width: 90px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 193, 222, 1);
      line-height: 40px;
      text-align: center;
      margin-left: 32px;
    }
  }
  .appitem:last-of-type {
    margin-bottom: 40px;
  }
}
</style>