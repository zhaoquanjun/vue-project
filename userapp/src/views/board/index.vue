<template>
  <div class="home-page page-scroll">
    <el-row style="display: flex;" class="mainBackground">
      <div class="leftContent">
        <div class="welcome-wrap">
          <p class="welcome-words">
            <span class="welcome-words" style="font-weight:400">{{userName}}</span>
            <span class="welcome-words">，欢迎回到微站后台</span>
          </p>
          <p
            class="siteIntroduction"
            v-if="$store.state.dashboard.isSiteInfoShow"
            v-show="siteInfoList.length"
          >以下是您当前的站点</p>
        </div>
        <siteinfo
          v-if="$store.state.dashboard.isSiteInfoShow"
          :siteInfo="siteInfoList"
          :isCanCreate="isCanCreate"
          :isSystem="isSystem"
          @getDashboardData="getDashboardData"
          v-show="siteInfoList.length"
        />
        <plugins :plugins="pluginList" />
        <content-num :contentNumber="contentNumber" />
        <recommend :recommend="recommend" />
      </div>
      <div class="rightContent">
        <el-row class="appInfo">
          <el-col class="appName">
            <span class="appNameInfo">{{ appInfo.name }}</span>
            <el-popover
              v-show="appInfo.isSystem"
              ref="popover"
              placement="bottom"
              width="317"
              trigger="manual"
              v-model="editPopover"
              style="padding:0;"
              class="popover"
            >
              <span slot="reference" @click="showRemark">
                <i class="iconfont iconbianji editIcon"></i>
              </span>
              <div class="textareaWrap">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3}"
                  placeholder="请输入公司名称"
                  v-model="remarkValue"
                  maxlength="15"
                  show-word-limit
                  resize="none"
                  @blur="textBulr"
                ></el-input>
                <div class="ym-form-item__error" v-show="isNullInput">请输入公司名称</div>
                <div class="btn-wrap">
                  <button class="popover-btn cancel" slot="refenrence" @click="cancelInput">取消</button>
                  <button class="popover-btn save" @click="saveInputValue">保存</button>
                </div>
              </div>
            </el-popover>
          </el-col>
          <el-col class="appVersion">
            <span>{{ appInfo.productName }}</span>
          </el-col>
          <el-col class="appLine">
            <div class="appLineInside"></div>
          </el-col>
          <el-col class="appTime">
            <span>{{ appInfo.time }}</span>
            <a class="renewalBtn" v-show="appInfo.isSystem" :href="aliMarketUrl" target="_blank">续费</a>
          </el-col>
        </el-row>

        <el-row class="designCheats">
          <h3 class="designCheatsTitle">
            设计秘籍
            <div class="more">
              更多
              <i
                class="iconfont iconjiantou"
                style="font-size:12px;color:#09CCEB;margin-left:3px"
              ></i>
            </div>
          </h3>
          <div class="designItem" v-for="(item, index) in designCheats" :key="index">
            <div class="designDiv" :class="designColor(index)"></div>
            <div class="designInfo">{{ item.versionDescription }}</div>
            <div class="designNoread" v-show="!designIsread">去阅读</div>
            <div class="designReaded" v-show="designIsread"></div>
          </div>
        </el-row>

        <el-row class="versionUpdate">
          <h3 class="versionTitle">
            版本更新
            <div class="more">
              更多
              <i
                class="iconfont iconjiantou"
                style="font-size:12px;color:#09CCEB;margin-left:3px"
              ></i>
            </div>
          </h3>
          <div class="versionItem" v-for="(item, index) in versionInfo" :key="index">
            <div class="versionInfo">{{ item.versionDescription }}</div>
            <div class="versionDate">{{ item.updateTime }}</div>
          </div>
          <div class="versionImg"></div>
        </el-row>
      </div>
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
import { aliMarketUrl } from "@/environment/index";
export default {
  data() {
    return {
      aliMarketUrl: aliMarketUrl,
      siteInfoList: [],
      siteCount: 0,
      appInfo: {},
      versionInfo: [],
      pluginList: [],
      contentNumber: {
        newsCount: 0,
        filesCount: 0,
        picturesCount: 0,
        productsCount: 0
      },
      recommend: [],
      designCheats: [
        {
          versionDescription: "域名支持一键解析"
        },
        {
          versionDescription: "域名支持一键解析"
        },
        {
          versionDescription: "域名支持一键解析"
        },
        {
          versionDescription: "域名支持一键解析"
        },
        {
          versionDescription: "域名支持一键解析域名支持一键解析域名支持一键解析"
        }
      ],
      remarkValue: "",
      designIsread: false,
      isCanCreate: true,
      isSystem: false,
      isNullInput: false,
      editPopover: false
    };
  },
  components: {
    siteinfo,
    Plugins,
    ContentNum,
    recommend
  },
  created() {},
  methods: {
    /**
     * 获取dashboard信息
     * app信息 site列表 内容管理数量 plugin列表
     */
    async getDashboardData() {
      const loading = this.$loading({
        lock: true,
        spinner: "loading-icon",
        background: "rgba(255, 255, 255, 0.75)"
      });
      let { data, status } = await getUserDashboard();
      if (status === 200) {
        loading.close();
      }
      this.pluginList = data.pluginList;
      this.contentNumber = {
        newsCount: data.contentsNumber.newsCount,
        filesCount: data.contentsNumber.filesCount,
        picturesCount: data.contentsNumber.picturesCount,
        productsCount: data.contentsNumber.productsCount
      };
      this.appInfo = data.appInfo;
      this.isSystem = data.appInfo.isSystem;
      this.appInfo.time =
        formatDateTime(this.appInfo.createTime, "yyyy年MM月dd日") +
        "-" +
        formatDateTime(this.appInfo.expiredTime, "yyyy年MM月dd日");
      this.siteCount = data.appInfo.siteCount;
      this.siteInfoList = data.siteCarousels;
      if (this.siteCount == this.siteInfoList.length) {
        this.isCanCreate = false;
      }
    },
    /**
     * 获取 设计秘籍列表，版本更新列表，应用推荐列表
     */
    async getAppExpandInfo() {
      let { data } = await dashboardApi.getAppExpandInfo();
      this.recommend = data.appRecommends;
      this.versionInfo = data.versionUpdates;
      for (var i = 0; i < this.versionInfo.length; i++) {
        this.versionInfo[i].updateTime = formatDateTime(
          this.versionInfo[i].updateTime,
          "MM.dd"
        );
      }
    },
    // 获取appName
    async getAppHeadInfo() {
      this.$store.dispatch("_getAppHeadInfo");
    },
    /**
     * 修改appName
     */
    showRemark() {
      this.remarkValue = this.appInfo.name ? this.appInfo.name : "";
      this.editPopover = true;
    },
    // 取消修改
    cancelInput() {
      this.$refs[`popover`].doClose();
      this.remarkValue = "";
      this.editPopover = false;
      this.isNullInput = false;
    },
    // input失去焦点
    textBulr() {
      if (!this.remarkValue) {
        this.isNullInput = true;
      } else {
        this.isNullInput = false;
      }
    },
    // 保存appName
    async saveInputValue() {
      if (!this.remarkValue) {
        this.isNullInput = true;
        return;
      }
      this.$refs[`popover`].doClose();
      await dashboardApi.UpdateAppName(this.remarkValue);
      this.$store.dispatch("_getAppHeadInfo");
      this.appInfo.name = this.remarkValue;
      this.editPopover = false;
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
  },
  computed: {
    userName() {
      let userName = this.$store.state.user.userInfo.userName;
      let phone = this.$store.state.user.userInfo.phone;
      return userName ? userName : phone;
    },
    appId() {
      this.getDashboardData();
      this.getAppExpandInfo();
      this.getAppHeadInfo();
      return this.$store.state.dashboard.appId;
    }
  },
  watch: {
    appId() {}
  }
};
</script>
<style scoped>
.textareaWrap /deep/ .el-input__count {
  right: 25px;
}
.popover /deep/ .el-popover__reference{
  outline: none;
}
</style>
<style lang="scss" scoped>
.leftContent {
  margin-right: 487px;
  width: 100%;
  background: url("~img/dashboard/board-backgroundLeft.png");
  background-repeat: no-repeat;
  background-position: 17% top;
  background-size: 31%;
}
.rightContent {
  position: absolute;
  right: 0;
  width: 487px;
}
.home-page {
  padding: 0 24px 32px;
  background: rgba(255, 255, 255, 1);
  .mainBackground {
    background: url("~img/dashboard/board-backgroundRight.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-size: 38%;
  }
  .welcome-wrap {
    margin-top: 64px;
    text-align: center;
    .welcome-words {
      font-size: 40px;
      font-weight: 300;
      color: rgba(38, 38, 38, 1);
      line-height: 56px;
    }
    .siteIntroduction {
      margin-top: 8px;
      font-size: 20px;
      font-weight: 300;
      color: rgba(181, 181, 181, 1);
      line-height: 28px;
    }
  }
}
.board-right {
  min-width: 269px;
  min-height: 680px;
  background: url("~img/board-right.png") no-repeat center;
  background-size: cover;
}
.appInfo {
  margin-top: 125px;
  margin-right: 10px;
  margin-left: 29px;
  height: 231px;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  position: relative;
  .appName {
    margin-top: 34px;
    margin-left: 28px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 37px;
    width: 420px;
    .editIcon {
      color: #09cceb;
      margin-left: 20px;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: rgba(9, 204, 235, 0.09);
        border-radius: 2px;
      }
    }
    .appNameInfo {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: calc(100% - 60px);
      vertical-align: middle;
    }
  }
  .appVersion {
    margin-top: 16px;
    margin-left: 28px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
  }
  .appLine {
    margin-left: 28px;
    margin-right: 17px;
    margin-top: 23px;
    width: 403px;
    display: inline-block;
    .appLineInside {
      width: 100%;
      height: 1px;
      background: #eeeeee;
      opacity: 0.38;
    }
  }
  .appTime {
    margin-top: 34px;
    margin-left: 28px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(161, 168, 177, 1);
    line-height: 20px;
  }
  .renewalBtn {
    display: inline-block;
    margin-left: 37px;
    width: 92px;
    height: 32px;
    background: linear-gradient(
      270deg,
      rgba(129, 220, 160, 1) 0%,
      rgba(8, 204, 235, 1) 100%
    );
    box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.14);
    border-radius: 16px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
}
.designCheats {
  margin: 24px 10px 24px 28px;
  padding-bottom: 10px;
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .designCheatsTitle {
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    margin-top: 20px;
    margin-left: 16px;
    margin-bottom: 24px;
    .more {
      cursor: pointer;
      float: right;
      margin-right: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 20px;
    }
  }
  .designItem {
    margin: 0px 22px 16px 16px;
    height: 70px;
    border-radius: 3px;
    border: 1px solid rgba(238, 238, 238, 1);
    position: relative;
    cursor: pointer;
    &:hover {
      background-color: #f6fdfe;
    }
    .designDiv {
      width: 5px;
      height: 70px;
      background: rgba(165, 231, 240, 1);
      border-radius: 3px 0px 0px 3px;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    .designColorBlue {
      background: rgba(121, 185, 241, 1);
    }
    .designColorRed {
      background: rgba(246, 143, 143, 1);
    }
    .designColorYellow {
      background: rgba(241, 200, 134, 1);
    }
    .designInfo {
      font-size: 14px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 70px;
      margin-left: 30px;

      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 60%;
    }
    .designNoread {
      position: absolute;
      right: 23px;
      top: 30px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 193, 222, 1);
    }
  }
}
.versionUpdate {
  margin-right: 10px;
  margin-left: 28px;
  background: linear-gradient(
    360deg,
    rgba(0, 193, 222, 0.17) 0%,
    rgba(188, 245, 253, 0.17) 100%
  );
  border-radius: 3px;
  .versionTitle {
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    line-height: 25px;
    margin-top: 20px;
    margin-left: 17px;
    margin-bottom: 19px;
    .more {
      cursor: pointer;
      float: right;
      margin-right: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 20px;
    }
  }
  .versionItem {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    margin-left: 16px;
    margin-bottom: 10px;
    margin-right: 25px;
    cursor: pointer;
    &:hover {
      .versionInfo {
        color: rgba(9, 204, 235, 1);
      }
    }
    .versionInfo {
      // float: left;
      color: #262626;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: calc(100% - 60px);
      width: 80%;
    }
    .versionDate {
      float: right;
      color: #80bbc4;
    }
  }
  .versionImg {
    float: right;
    margin-top: 25px;
    width: 339px;
    height: 190px;
    background: url("~img/dashboard/board-versionImgMax.png") no-repeat center;
    background-size: cover;
  }
}
// 修改app
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
@media screen and (max-width: 1500px) {
  .home-page .welcome-wrap {
    margin-top: 34px;
    .welcome-words {
      font-size: 28px;
      line-height: 40px;
    }
    .siteIntroduction {
      margin-top: 0;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .leftContent {
    margin-right: 339px;
  }
  .rightContent {
    margin-left: 29px;
    width: 310px;
    .appInfo {
      height: 210px;
      margin-top: 71px;
      margin-left: 0px;
      margin-right: 0px;
      .appName {
        margin-top: 24px;
        margin-left: 21px;
        font-size: 18px;
        line-height: 25px;
        width: 289px;
      }
      .appVersion {
        margin-left: 21px;
      }
      .appLine {
        margin-top: 15px;
        margin-left: 21px;
        width: 273px;
      }
      .appTime {
        margin-top: 16px;
        margin-left: 21px;
        width: 287px;
      }
      .renewalBtn {
        margin-top: 16px;
        margin-left: 0px;
      }
    }
    .designCheats {
      margin: 21px 0px 20px;
      .designCheatsTitle {
        margin-top: 14px;
        margin-left: 14px;
        margin-bottom: 22px;
        font-size: 15px;
        line-height: 21px;
      }
      .designItem {
        height: 50px;
        margin: 0px 12px 16px;
        .designDiv {
          height: 50px;
        }
        .designInfo {
          line-height: 50px;
        }
        .designNoread {
          top: 20px;
        }
      }
    }
    .versionUpdate {
      margin: 0px;
      .versionTitle {
        margin-top: 12px;
        margin-left: 13px;
        margin-bottom: 15px;
        font-size: 16px;
        line-height: 22px;
      }
      .versionItem {
        margin-left: 12px;
        margin-bottom: 4px;
        margin-right: 12px;
      }
      .versionImg {
        width: 195px;
        height: 109px;
        background: url("~img/dashboard/board-versionImgMin.png") no-repeat
          center;
        background-size: cover;
      }
    }
  }
}
</style>
