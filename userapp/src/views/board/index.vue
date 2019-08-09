<template>
  <div class="home-page page-scroll">
    <el-row style="display: flex;">
      <div class="leftContent">
        <div class="welcome-wrap">
          <p class="welcome-words">{{userName}}，欢迎回到微站后台</p>
          <p class="siteIntroduction">以下是您当前的站点</p>
        </div>

        <siteinfo :siteInfo="siteInfoList" :siteCount="siteCount" />
        <plugins :plugins="pluginList" />
        <content-num :contentNumber="contentNumber" />
        <recommend :recommend="recommend" />
      </div>
      <div class="rightContent">
        <el-row class="appInfo">
          <el-col class="appName">
            <span>{{ appInfo.name }}</span>
            <el-popover
              v-show="appInfo.isSystem"
              ref="popover"
              placement="bottom"
              width="317"
              trigger="click"
              style="padding:0;cursor: pointer;"
              @show="showRemark"
            >
              <span slot="reference">
                <i class="iconfont iconbianji" style="color:#09CCEB;margin-left:23px"></i>
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
            <button class="renewalBtn" v-show="appInfo.isSystem">续费</button>
          </el-col>
        </el-row>

        <el-row class="designCheats">
          <h3 class="designCheatsTitle">设计秘籍</h3>
          <div class="designItem" v-for="(item, index) in designCheats" :key="index">
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
          <div class="versionImg"></div>
          <!-- <img  src="~img/dashboard/board-versionImg.png" alt /> -->
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
export default {
  data() {
    return {
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
      designIsread: false
    };
  },
  components: {
    siteinfo,
    Plugins,
    ContentNum,
    recommend
  },
  created() {
    this.getDashboardData();
    this.getAppExpandInfo();
  },
  methods: {
    /**
     * 获取dashboard信息
     * app信息 site列表 内容管理数量 plugin列表
     */
    async getDashboardData() {
      let { data } = await getUserDashboard();
      this.pluginList = data.pluginList;
      this.contentNumber = {
        newsCount: data.contentsNumber.newsCount,
        filesCount: data.contentsNumber.filesCount,
        picturesCount: data.contentsNumber.picturesCount,
        productsCount: data.contentsNumber.productsCount
      };
      this.appInfo = data.appInfo;
      this.appInfo.time =
        formatDateTime(this.appInfo.createTime, "yyyy年MM月dd日") +
        "-" +
        formatDateTime(this.appInfo.expiredTime, "yyyy年MM月dd日");
      this.siteCount = data.appInfo.siteCount;
      this.siteInfoList = data.siteCarousels;
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
    /**
     * 修改appName
     */
    showRemark() {
      this.remarkValue = this.appInfo.name ? this.appInfo.name : "";
    },
    cancelInput() {
      this.$refs[`popover`].doClose();
      this.remarkValue = "";
    },
    async saveInputValue() {
      if (!this.remarkValue) {
        this.$message({
          type: "failed",
          message: "请输入公司名称"
        });
        return;
      }
      this.$refs[`popover`].doClose();
      await dashboardApi.UpdateAppName(this.remarkValue);
      this.$store.dispatch("_getAppHeadInfo"); //
      this.appInfo.name = this.remarkValue;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.leftContent {
  margin-right: 487px;
  width: 100%;
}
.rightContent {
  position: absolute;
  right: 0;
  width: 487px;
}
.home-page {
  padding: 0 24px 32px;
  background: rgba(255, 255, 255, 1);

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
    // position: absolute;
    // bottom: 33px;
    // left: 270px;
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
    line-height: 20px;
  }
}
.designCheats {
  margin: 24px 10px 24px 28px;
  padding-bottom: 10px;
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .designCheatsTitle {
    font-size: 18px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    margin-top: 20px;
    margin-left: 16px;
    margin-bottom: 24px;
  }
  .designItem {
    margin: 0px 22px 16px 16px;
    height: 70px;
    border-radius: 3px;
    border: 1px solid rgba(238, 238, 238, 1);
    position: relative;
    cursor: pointer;
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
      display: -webkit-box;
      width: 60%;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .designNoread {
      position: absolute;
      right: 23px;
      top: 30px;
      // width: 36px;
      // height: 17px;
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
  // opacity: 0.17;
  .versionTitle {
    font-size: 18px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 25px;
    margin-top: 20px;
    margin-left: 17px;
    margin-bottom: 19px;
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
    .versionInfo {
      float: left;
      color: #262626;
      width: 80%;
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
      }
      .appVersion {
        margin-left: 21px;
      }
      .appLine {
        margin-top: 15px;
        margin-left: 21px;
      }
      .appTime {
        margin-top: 16px;
        margin-left: 21px;
      }
      .renewalBtn {
        margin-top: 16px;
        margin-left: 0px;
        // margin-bottom: 20px;
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
