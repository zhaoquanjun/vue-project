<template>
  <div class="header">
    <div class="headerWrap">
      <div>
        <div class="head-left head-item">
          <span class="logo-icon">
            <i class="iconfont iconicon-logo" style="font-size: 24px;line-height:50px"></i>
          </span>
          <span @click="changeApp" class="headAppName">
            <span class="headAppNameInfo">已购买服务</span>
            <i class="iconfont iconqiehuanxingshiyi" style="font-size:16px;vertical-align:middle"></i>
          </span>
        </div>
      </div>
      <div>
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
          <span style="line-height:50px" @mouseenter="dropdownAvatarShow" @mouseleave="dropdownAvatarhide">
            <p class="avatar" style="cursor: pointer">
              <img :src="headUrl" alt />
            </p>
            <dl class="login-set dropdown-avatar-menu" v-if="isdropdownAvatarShow">
              <dd @click="pannelShow">个人设置</dd>
              <dd @click="signOut">退出控制台</dd>
            </dl>
          </span>
        </div>
      </div>
    </div>
    <div class="my-chose-app">
      <el-dialog
        :fullscreen="true"
        :visible.sync="changeAppShow"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        :show-close="false"
        :modal="false"
        class="myApp"
      >
        <div slot="title">
          <div class="myAppTitle">
            已购买的服务
            <span style="cursor:pointer;" @click="closeChangeApp">
              <i class="iconfont iconguanbi is-circle cl-iconfont" style="font-size:17px;"></i>
            </span>
          </div>
        </div>
        <div class="appBackground" v-scrollBar>
          <div class="app-title">
            <span class="app-title-text">
              <span class="app-title-border"></span>
              已购买的服务
            </span>
            <el-input
              v-model="keyword"
              placeholder="输入服务名称或备注内容搜索"
              @keyup.enter.native="search"
              clearable
              class="input-with-select"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer;float:right"
                slot="suffix"
                @click="search"
              ></i>
            </el-input>
          </div>
          <el-col
            :span="24"
            class="appitem"
            v-for="(item, index) in appList"
            :key="index"
            style="padding:0px"
          >
            <div class="appTitle">
              <div class="appNameWrap">
                <div :class="{'templateApp':item.isTemplateApp,'normalApp':!item.isTemplateApp}"></div>
                <span class="appName">{{item.productName}}</span>
              </div>
              <span>
                <i
                  class="iconfont"
                  :class="{'iconicon-guanliyuan' : item.isSystem,'iconicon-chengyuan1':!item.isSystem}"
                  style="margin-right:5px;font-size:14px"
                ></i>
                <span class="appMember">{{item.isSystem ? "管理员" : "成员"}}</span>
              </span>
            </div>
            <div class="appInfo">
              <div class="version">
                <span class="versionText">{{item.name}}</span>
                <el-popover
                  :ref="`popover-${index}`"
                  placement="bottom"
                  width="317"
                  trigger="click"
                  style="padding:0"
                  @show="showRemark(item)"
                >
                  <button slot="reference">
                    <i class="iconfont iconbianji" v-show="item.isSystem"></i>
                  </button>
                  <div class="textareaWrap">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 3}"
                      placeholder="请输入内容"
                      v-model="appName"
                      maxlength="30"
                      show-word-limit
                      resize="none"
                    ></el-input>
                    <div class="btn-wrap">
                      <button class="cancel" slot="refenrence" @click="cancelInput(index)">取消</button>
                      <button class="save" @click="saveInputValue(item, index)">保存</button>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div class="expired">
                <span class="expiredText">有效期</span>
                <span class="expiredText" style="margin-left:16px">{{item.expired}}</span>
                <div class="isExpiredSoon" v-show="isExpiredSoon(item)">即将过期</div>
                <div class="isExpired" v-show="isExpired(item)">已过期</div>
                <div class="isExpired" v-show="item.releaseTime&&isreleased(item)">已释放</div>
                <a class="renewal" v-show="item.isSystem" :href="aliMarketUrl" target="_blank">续费</a>
                <el-button
                  class="choseApp"
                  @click="choseApp(item)"
                  :disabled="isExpired(item)||(item.releaseTime&&isreleased(item))"
                  :class="{'disabled':isExpired(item)||(item.releaseTime&&isreleased(item))}"
                  v-if="!item.isCurrentApp"
                >进入管理</el-button>
                <el-button
                  class="choseApp disabled"
                  @click="choseApp(item)"
                  disabled
                  v-if="item.isCurrentApp"
                >当前管理</el-button>
              </div>
            </div>
          </el-col>
        </div>
      </el-dialog>
    </div>
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
import { getCookie } from "@/libs/cookie";
export default {
  data() {
    return {
      aliMarketUrl: aliMarketUrl,
      isdropdownAvatarShow: false,
      appList: [],
      changeAppShow: false,
      appName: "",
      keyword: ""
    };
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
    async search() {
      let { data } = await dashboardApi.getApplicationsByUserId(this.keyword);
      this.appList = data;
      for (var i = 0; i < this.appList.length; i++) {
        this.appList[i].expired =
          formatDateTime(this.appList[i].createTime, "yyyy年MM月dd日") +
          "-" +
          formatDateTime(this.appList[i].expiredTime, "yyyy年MM月dd日");
      }
    },
    // 显示修改appName弹框
    showRemark(item) {
      this.appName = item.name ? item.name : "";
    },
    // 取消修改
    cancelInput(index) {
      this.$refs[`popover-${index}`][0].doClose();
      this.appName = "";
    },
    // 修改appName
    async saveInputValue(item, index) {
      this.$refs[`popover-${index}`][0].doClose();
      let para = {
        appId: item.appId,
        appName: this.appName
      };
      let { status } = await dashboardApi.updateAppName(para);
      if (status == 200) {
        item.name = this.appName;
        if (item.appId == this.$store.state.dashboard.appId) {
          this.$store.dispatch("_getAppHeadInfo");
        }
      }
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
      this.$store.commit("SETAPPID", item.appId);
      let { data, status } = await dashboardApi.updateUserLastAppIdAndCookie(
        item.appId
      );
      if (status === 200) {
        this.$store.dispatch("_getAppHeadInfo");
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
        this.getAppList();
        this.changeAppShow = true;
        this.$nextTick(() => {
          window.addEventListener("resize", () => {
            document.getElementsByClassName("appBackground")[0].style.height =
              window.innerHeight - 50 + "px";
          });
          document.getElementsByClassName("appBackground")[0].style.height =
            window.innerHeight - 50 + "px";
        });
      }
    },
    // 判断是否过期
    isExpired(item) {
      if (new Date(item.expiredTime) < new Date()) {
        return true;
      }
    },
    // 判断是否即将过期
    isExpiredSoon(item) {
      if (
        new Date(item.expiredTime) - new Date() < 1000 * 60 * 60 * 24 * 30 &&
        new Date(item.expiredTime) > new Date()
      ) {
        return true;
      }
    },
    // 是否被释放
    isreleased(item) {
      if (new Date(item.releaseTime) < new Date()) {
        return true;
      }
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
      let appName = this.$store.state.user.userInfo.appName;
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
.myApp /deep/ .el-dialog__header {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.textareaWrap {
  background: #fff;
  position: relative;
  .btn-wrap {
    text-align: right;
    padding-top: 16px;
    button {
      width: 63px;
      height: 32px;
      line-height: 25px;
      font-size: 12px;
      border: none;
    }
    .cancel {
      border: 1px solid #eeeeee;
      margin-right: 10px;
    }
    .save {
      background: #00c1de;
      color: #fff;
    }
  }
}
.iconbianji {
  color: #262626;
  margin-left: 16px;
  padding: 8px;
  &:hover {
    background: rgba(240, 243, 247, 1);
    border-radius: 4px;
  }
}
.disabled {
  opacity: 0.3;
}
.iconlogo1 {
  font-size: 24px;
}
.header {
  // padding: 0 10px;
  font-size: 14px;
  background: $--color-white;
  color: $--color-text-primary;
  position: relative;
  .headerWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .head-item {
    .logo-icon {
      width: 60px;
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      padding: 0;
      // margin-left: -10px;
      height: 50px;
      vertical-align: top;
      background: $--color-primary;
      .iconfont {
        color: $--color-white;
      }
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
      align-items: center;
      padding: 0;
      margin-left: 16px;
      height: 40px;
      line-height: 40px;
      width: 250px;
      &:hover {
        // background: #06bdda;
        // border-radius: 2px;
        .headAppNameInfo {
          color: $--color-primary;
        }
        i {
          color: $--color-primary;
        }
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
    margin-right: 10px;
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
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  .app-title {
    margin-left: 50%;
    transform: translateX(-50%);
    height: 76px;
    width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .app-title-text {
      .app-title-border {
        display: inline-block;
        width: 2px;
        height: 17px;
        background: rgba(9, 204, 235, 1);
        margin-right: 12px;
      }
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
    }
    .input-with-select {
      width: 260px;
    }
  }
  .appitem {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-bottom: 24px;
    width: 800px;
    height: 140px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    padding-left: 0px;
    &:hover {
      box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
      transform: translate(-50%, -2px);
    }
    .appTitle {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .appNameWrap {
        display: flex;
        align-items: center;
        .templateApp {
          margin-left: 24px;
          display: inline-block;
          width: 29px;
          height: 21px;
          background: url("~img/templateApp.png") no-repeat center;
          background-size: contain;
        }
        .normalApp {
          margin-left: 24px;
          display: inline-block;
          width: 29px;
          height: 21px;
          background: url("~img/normalApp.png") no-repeat center;
          background-size: contain;
        }
        .appName {
          margin-left: 16px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
        }
      }
      .appMember {
        float: right;
        margin-right: 24px;
        font-size: 12px;
        font-weight: 600;
        color: rgba(38, 38, 38, 1);
      }
    }
    .appInfo {
      width: 100%;
      height: 90px;
      background: rgba(250, 250, 252, 1);
      border-radius: 2px 2px 0px 0px;
      .version {
        line-height: normal;
        padding-top: 21px;
        .versionText {
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-left: 24px;
          line-height: 22px;
        }
      }
      .expired {
        margin-top: 8px;
        line-height: normal;
        .expiredText {
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-left: 24px;
          line-height: 22px;
        }
      }
      .isExpiredSoon {
        margin-left: 24px;
        display: inline-block;
        width: 57px;
        height: 19px;
        background: rgba(250, 100, 0, 0.2);
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(250, 100, 0, 1);
        line-height: 19px;
        text-align: center;
      }
      .isExpired {
        margin-left: 24px;
        display: inline-block;
        width: 46px;
        height: 19px;
        background: rgba(251, 77, 104, 0.2);
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(251, 77, 104, 1);
        line-height: 19px;
        text-align: center;
      }
      .choseApp {
        position: absolute;
        right: 24px;
        bottom: 16px;
        width: 90px;
        height: 32px;
        background: rgba(255, 106, 0, 1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 32px;
        border: none;
        padding: 0px;
        margin: 0;
      }
      .renewal {
        position: absolute;
        right: 130px;
        bottom: 16px;
        display: inline-block;
        width: 90px;
        height: 32px;
        border-radius: 2px;
        border: 1px solid rgba(255, 106, 0, 1);
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 106, 0, 1);
        line-height: 32px;
        text-align: center;
        margin-left: 32px;
        margin: 0;
        box-sizing: border-box;
      }
    }
  }
  .appitem:last-of-type {
    margin-bottom: 40px;
  }
}
</style>