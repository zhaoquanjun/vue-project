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
            <i class="iconfont iconqiehuanxingshiyi" style="font-size:16px;"></i>
          </span>
          <div v-show="$store.state.dashboard.autoTranslateShow" class="autoTranslate-wrap">
            <div class="autoTranslate-text">自动翻译</div>
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content">中文站的文章/产品/页面保存成功后，执行自动翻译<br/>（*对有修订记录的文章/产品/页面，不做操作）</div>
              <el-switch v-model="$store.state.dashboard.autoTranslateSwitch" :width="20" @change="changeAutoTranslate" class="autoTranslate-switch"></el-switch>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div>
        <div class="head-right head-item">
          <span class="operatingBtn">
            <i
              class="iconfont iconbianzu1"
              style="margin-right:3px;font-size:16px;vertical-align:middle"
            ></i>
            <b class="item-btn">帮助</b>
          </span>
          <span class="operatingBtn">
            <i
              class="iconfont iconbianzu2"
              style="margin-right:3px;font-size:16px;vertical-align:middle"
            ></i>
            <b class="item-btn">通知</b>
          </span>
          <span
            style="line-height:50px"
            @mouseenter="dropdownAvatarShow"
            @mouseleave="dropdownAvatarhide"
          >
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
              @clear="search"
              clearable
              class="input-with-select"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer;float:right;color:#D7D8D9"
                slot="suffix"
                @click="search"
              ></i>
            </el-input>
          </div>
          <div class="search-empty" v-show="!appList.length">
            <div class="empty-table" v-show="!appList.length" style="cursor:default">
              <img src="~img/table-empty-default.png" />
              <p>无数据</p>
            </div>
          </div>
          <el-col
            :span="24"
            class="appitem"
            v-show="appList.length"
            v-for="(item, index) in appList"
            :key="index"
            style="padding:0px"
          >
            <div class="appTitle">
              <div class="appNameWrap">
                <div :class="{'templateApp':item.isTemplateApp,'normalApp':!item.isTemplateApp}"></div>
                <span class="appName">{{item.productName}}{{item.isTemplateApp?"_"+item.appId:""}}</span>
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
                <span class="versionText">{{item.name?item.name:"备注"}}</span>
                <el-popover
                  :ref="`popover-${index}`"
                  placement="bottom"
                  width="300"
                  trigger="click"
                  style="padding:0"
                  @show="showRemark(item)"
                >
                  <button style="margin-left:8px" slot="reference">
                    <i
                      class="iconfont iconbianji cl-iconfont is-square"
                      v-show="item.isSystem&&!isExpiredWeek(item)"
                    ></i>
                  </button>
                  <div class="textareaWrap">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 3}"
                      placeholder="请输入内容"
                      v-model="appName"
                      maxlength="40"
                      show-word-limit
                      resize="none"
                    ></el-input>
                    <div class="btn-wrap">
                      <button
                        class="cl-button cl-button--primary_notbg cl-button--small"
                        slot="refenrence"
                        @click="cancelInput(index)"
                      >取消</button>
                      <button
                        class="cl-button cl-button--primary cl-button--small"
                        @click="saveInputValue(item, index)"
                      >保存</button>
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
                <a
                  class="renewal cl-button cl-button--primary_notbg"
                  v-show="item.isSystem&&!isExpiredWeek(item)"
                  :href="aliMarketUrl"
                  target="_blank"
                >续费</a>
                <button
                  class="choseApp cl-button cl-button--primary"
                  @click="choseApp(item)"
                  :disabled="isExpired(item)||(item.releaseTime&&isreleased(item))"
                  :class="{'is-disabled':isExpired(item)||(item.releaseTime&&isreleased(item))}"
                  v-if="!item.isCurrentApp"
                >进入管理</button>
                <button
                  class="choseApp is-disabled cl-button cl-button--primary"
                  @click="choseApp(item)"
                  disabled
                  v-if="item.isCurrentApp"
                >当前管理</button>
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
      //是非显示短信配置提示语
      setLocal('isShowTips','1')
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
    async changeAutoTranslate(){
      let { data } = await dashboardApi.switchAutoTranslateStatus();
      this.$store.commit("set_autoTranslateSwitch", data);
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
      this.appName = item.name == "备注" ? "" : item.name;
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
    // 判断是否过期7天
    isExpiredWeek(item) {
      if (new Date() - new Date(item.expiredTime) > 1000 * 60 * 60 * 24 * 7) {
        return true;
      }
      if (
        item.releaseTime &&
        new Date() - new Date(item.releaseTime) > 1000 * 60 * 60 * 24 * 7
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
.header /deep/ .el-table__empty-text{
    width: 0;
}
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
.iconlogo1 {
  font-size: 24px;
}
.header {
  font-size: $--font-size-base;
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
      display: inline-block;
      width: 60px;
      height: 50px;
      box-sizing: border-box;
      padding: 0;
      text-align: center;
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
      margin-left: 32px;
      padding: 0;
      .headAppNameInfo {
        padding: 0;
        margin-right: 12px;
      }
      &:hover {
        .headAppNameInfo {
          color: $--color-primary;
        }
        i {
          color: $--color-primary;
        }
      }
    }
    .autoTranslate-wrap{
      display: inline-block;
      margin-left: 30px;
      .autoTranslate-text{
        display: inline-block;
        font-size: $--font-size-small;
      }
      .autoTranslate-switch {
        margin-left: 8px;
      }
      /deep/ .el-switch{
        .el-switch__core{
          width: 20px;
          height: 12px;
          &:after{
            width: 10px;
            height: 10px;
            top: 0;
          }
        }
      }
      /deep/ .el-switch.is-checked{
        .el-switch__core{
          &:after{
            margin-left: -11px;
          }
        }
      }
    }
    .operatingBtn {
      cursor: pointer;
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
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
    color: $--color-text-primary;
    position: absolute;
    z-index: 10000;
    right: 0;
    top: 50px;
    border-radius: $--border-radius-base;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    padding: 9px 0;
    dd {
      padding: 0 30px;
      line-height: 32px;
      &:hover {
        color: $--color-primary;
        background: $--background-color-hover;
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
  font-size: $--font-size-medium;
  color: $--color-text-primary;
  font-weight: $--font-weight-primary;
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
        background: $--color-primary;
        margin-right: 12px;
      }
      display: flex;
      align-items: center;
      font-size: $--font-size-medium;
      color: $--color-text-primary;
      font-weight: $--font-weight-primary;
    }
    .input-with-select {
      width: 260px;
    }
  }
  .search-empty{
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 76px);
    width: 100%;
  }
  .appitem {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-bottom: 24px;
    width: 800px;
    height: 140px;
    background: $--color-white;
    border-radius: $--border-radius-base;
    padding-left: 0px;
    transition: all 0.2s linear;
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
          font-size: $--font-size-medium;
          color: $--color-text-primary;
          font-weight: $--font-weight-primary;
        }
      }
      .appMember {
        float: right;
        margin-right: 24px;
        font-size: $--font-size-small;
        color: $--color-text-primary;
        font-weight: $--font-weight-primary;
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
          font-size: $--font-size-base;
          font-weight: $--font-weight-base;
          color: rgba(153, 153, 153, 1);
          margin-left: 24px;
          line-height: 22px;
        }
      }
      .expired {
        margin-top: 8px;
        line-height: normal;
        .expiredText {
          font-size: $--font-size-base;
          font-weight: $--font-weight-base;
          color: rgba(153, 153, 153, 1);
          margin-left: 24px;
        }
      }
      .isExpiredSoon {
        margin-left: 24px;
        display: inline-block;
        width: 57px;
        height: 19px;
        background: rgba(250, 100, 0, 0.2);
        border-radius: $--border-radius-base;
        font-size: $--font-size-small;
        font-weight: $--font-weight-primary;
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
        border-radius: $--border-radius-base;
        font-size: $--font-size-small;
        font-weight: $--font-weight-primary;
        color: rgba(251, 77, 104, 1);
        line-height: 19px;
        text-align: center;
      }
      .choseApp {
        position: absolute;
        right: 24px;
        bottom: 16px;
      }
      .renewal {
        position: absolute;
        right: 130px;
        bottom: 16px;
        box-sizing: border-box;
        line-height: 1;
      }
    }
  }
  .appitem:last-of-type {
    margin-bottom: 40px;
  }
}
</style>