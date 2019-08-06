<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="head-left head-item">
          <span>
            <svg-icon icon-class="logo"></svg-icon>
          </span>
          <span>云 · 速成美站</span>
          <span
            class="designTitle"
            @click="designer"
            @mouseenter="dropdownDesignShow"
            @mouseleave="dropdownDesignhide"
          >
            进入设计
            <!-- <ul class="intoDesign" v-show="isdropdownDesignShow">
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
            </ul>-->
          </span>
          <span @click="changeApp">
            {{headAppName}}
            <span class="changeAppImg"></span>
          </span>
        </div>
      </el-col>
      <el-col :span="8" :offset="8">
        <div class="head-right head-item">
          <span>
            <i class="iconfont iconfabu" style="vertical-align: -3px;"></i>
            <b class="item-btn">立即发布</b>
          </span>
          <span>
            <svg-icon icon-class="t-help"></svg-icon>
            <b class="item-btn">帮助</b>
          </span>
          <span>
            <svg-icon icon-class="t-notifi"></svg-icon>
            <b class="item-btn">通知</b>
          </span>
          <span @mouseenter="dropdownAvatarShow" @mouseleave="dropdownAvatarhide">
            <p class="avatar">
              <img :src="headUrl" alt />
            </p>
            <dl class="login-set dropdown-avatar-menu" v-show="isdropdownAvatarShow">
              <dd @click="pannelShow">个人设置</dd>
              <dd @click="signOut">退出控制台</dd>
            </dl>
          </span>
        </div>
      </el-col>
      <div class="my-chose-app">
        <el-dialog
          title="我的应用"
          :fullscreen="true"
          :visible.sync="changeAppShow"
          :center="true"
          :close-on-click-modal="false"
          style="margin-top:50px"
        >
          <div class="appBackground">
            <div>
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
                  <el-popover
                    v-show="item.isSystem"
                    :ref="`popover-${index}`"
                    placement="bottom"
                    width="317"
                    trigger="click"
                    style="padding:0"
                    @show="showRemark(index)"
                  >
                    <span slot="reference">
                      <svg-icon icon-class="remark" class="remark"></svg-icon>
                    </span>
                    <div class="textareaWrap">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 3}"
                        placeholder="请输入内容"
                        v-model="remarkValue"
                        maxlength="30"
                        show-word-limit
                        resize="none"
                      ></el-input>
                      <div class="btn-wrap">
                        <button
                          class="popover-btn cancel"
                          slot="refenrence"
                          @click="cancelInput(index)"
                        >取消</button>
                        <button class="popover-btn save" @click="saveInputValue(index)">保存</button>
                      </div>
                    </div>
                  </el-popover>
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
                  <button class="renewal" v-show="item.isSystem">续费</button>
                  <el-button
                    class="choseApp"
                    @click="choseApp(item)"
                    :disabled="isExpired(item)"
                    :class="{'disabled':isExpired(item)}"
                    v-if="curAppId != item.appId"
                  >进入应用</el-button>
                  <el-button
                    class="choseCurApp"
                    @click="choseApp(item)"
                    disabled
                    v-if="curAppId == item.appId"
                  >我的应用</el-button>
                </div>
              </el-col>
            </div>
          </div>
        </el-dialog>
      </div>
    </el-row>
  </div>
</template>
<script>
import securityService from "@/services/authentication/securityService";
import { getApplication } from "@/api/request/dashboardApi";
import { getApplicationsByUserId } from "@/api/request/dashboardApi";
import * as dashboardApi from "@/api/request/dashboardApi";
import { formatDateTime, getShortUrlByInviation } from "@/api/index";
import { setLocal } from "@/libs/local.js";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      isdropdownAvatarShow: false,
      isdropdownDesignShow: false,
      // appName: "",
      appList: [],
      changeAppShow: false,
      remarkValue: "",
      curAppId: ""
    };
  },
  created() {
    this.getCurApp();
  },
  methods: {
    designer() {
      location.href = "//designer.console.wezhan.cn";
    },
    signOut() {
      securityService.signOut(location.href);
    },
    pannelShow() {
      this.$router.push({
        name: "personal"
      });
      //this.$store.commit("CLOSERIGHTPANNEL",true)
    },
    dropdownAvatarShow() {
      this.isdropdownAvatarShow = true;
    },
    dropdownAvatarhide() {
      this.isdropdownAvatarShow = false;
    },
    dropdownDesignShow() {
      this.isdropdownDesignShow = true;
    },
    dropdownDesignhide() {
      this.isdropdownDesignShow = false;
    },
    /**
     * 获取app信息
     */
    // async getAppName() {
    //   let { data } = await getApplication();
    //   this.appName = data.name;
    // },
    /**
     * 获取app列表
     */
    async getAppList() {
      let { data } = await getApplicationsByUserId();
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
      setLocal("appid", item.appId);
      this.$store.commit("SETAPPID", item.appId);
      console.log(item.appId);
      await dashboardApi.updateUserLastAppIdAndCookie(item.appId);
      window.location.href = "http://dashboard.console.wezhan.cn/board";
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.changeAppShow = false;
    },
    //显示切换app弹框
    changeApp() {
      this.changeAppShow = true;
      // this.getAppName();
      this.getAppList();
    },
    // 判断是否过期
    isExpired(item) {
      if (new Date(item.expiredTime) < new Date()) {
        return true;
      }
    },
    /**
     * 修改appName
     */
    showRemark(index) {
      this.remarkValue = this.appList[index].name
        ? this.appList[index].name
        : "";
    },
    cancelInput(index) {
      this.$refs[`popover-${index}`][0].doClose();
      this.remarkValue = "";
    },
    async saveInputValue(index) {
      if (!this.remarkValue) {
        this.$message({
          type: "failed",
          message: "请输入公司名称"
        });
        return;
      }
      this.$refs[`popover-${index}`][0].doClose();
      await dashboardApi.UpdateAppName(this.remarkValue);
      this.appList[index].name = this.remarkValue;
    },
    // 获取当前appId
    getCurApp() {
      this.curAppId = Cookies.get("AppId")
        ? Cookies.get("AppId")
        : this.$store.state.dashboard.appid;
    }
  },
  computed: {
    headUrl() {
      let avatar = this.$store.state.user.userInfo.headImageUrl;
      if (avatar) {
        return avatar;
      } else {
        return require("../../assets/defualtAvatar.png");
      }
    },
    headAppName() {
      let appName = this.$store.state.user.userInfo.appName;
      return appName;
    }
  }
};
</script>
<style>
.v-modal {
  z-index: 1000 !important;
}
</style>

<style lang="scss" scoped>
.disabled {
  opacity: 0.2;
}
.header {
  padding: 0 10px;
  font-size: 14px;
  background: linear-gradient(to right, #08cceb 50%, #81dca0);
  color: #fff;
  position: relative;
  //     position: fixed;
  // width: 100%;
  // top: 0;
  // left: 0;
  // z-index: 1000;
  .head-item {
    span {
      display: inline-block;
      // vertical-align: middle;
      padding: 0 15px;
      // margin-right: 10px;
      .item-btn {
        vertical-align: middle;
        padding-left: 5px;
      }
    }
    .changeAppImg {
      width: 15px;
      height: 11px;
      padding-left: 5px;
      background: url("~img/dashboard/board-changeApp.png") no-repeat center;
      background-size: contain;
    }
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
    background: #131518;
    position: absolute;
    z-index: 100;
    right: 0;
    top: 50px;
    color: #fff;
    padding: 10px 30px;
    dd {
      line-height: 30px;
    }
  }
  .designTitle {
    cursor: pointer;
    position: relative;
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
.appBackground {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 245, 245, 1);
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  .appitem {
    position: relative;
    margin-top: 32px;
    // width: 900px;
    // height: 165px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    padding-left: 0px;
    //   &:hover {
    //     background: rgba(175, 175, 175, 1);
    //     border-radius: 2px;
    //     opacity: 0.7;
    //     filter: blur(10px);
    //   }
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
        font-family: PingFangSC-Regular;
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
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
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
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
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
      height: 32px;
      background: rgba(0, 193, 222, 1);
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 12px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
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
      width: 90px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 193, 222, 1);
      margin-left: 32px;
      // position: absolute;
      // bottom: 27px;
      // left: 419px;
    }
  }
}
// 修改app
.textareaWrap {
  background: #fff;
  position: relative;
  .btn-wrap {
    text-align: right;
    padding-top: 10px;
    button {
      width: 63px;
      height: 25px;
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
.remark {
  margin-left: 20px;
}
</style>


