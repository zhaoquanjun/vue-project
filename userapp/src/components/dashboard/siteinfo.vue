<template>
  <div class="site-section">
    <el-row class="content">
      <div v-if="siteInfo.length != 2">
        <el-col
          :ref="`siteInfo-${index}`"
          :class="{active: index == curIndex, prevActive: item.prev, nextActive: item.next, prevActivePrev: item.prevPrev}"
          class="item"
          v-for="(item, index) in siteInfo"
          :key="index"
          @click.native="handleClick(index)"
        >
          <div class="siteImg">
            <img :src="item.image" alt class="siteImgBackground" />
          </div>
          <div class="siteName">{{item.siteName}}</div>
          <div class="siteText siteLanguage">
            <span>语言：</span>
            {{_getLanguage(item.language)}}
          </div>
          <div class="siteText isPublished">{{item.isPublished ? "已发布" : "未发布"}}</div>
          <div v-show="index == curIndex" class="siteManageWrap">
            <div class="siteManage siteManageLeft" @click="toSiteManage(item.siteId)">
              <div class="arrowLeft"></div>网站管理
            </div>
            <div class="siteManage" @click="toDesign(item.siteId)">
              进入设计
              <div class="arrowRight"></div>
            </div>
          </div>
        </el-col>
        <div class="leftModul" @click="leftClick"></div>
        <div class="rightModul" @click="rightClick"></div>
      </div>

      <div style="height:300px;" v-if="siteInfo.length == 2">
        <div class="siteInfoTwo" v-for="(item, index) in siteInfo" :key="index">
          <div class="siteImg">
            <img :src="item.image" alt class="siteImgBackground" />
          </div>
          <div class="siteName">{{item.siteName}}</div>
          <div class="siteText siteLanguage">
            <span>语言：</span>
            {{_getLanguage(item.language)}}
          </div>
          <div class="siteText isPublished">{{item.isPublished ? "已发布" : "未发布"}}</div>
          <div class="siteManageWrap">
            <div class="siteManage siteManageLeft" @click="toSiteManage(item.siteId)">
              <div class="arrowLeft"></div>网站管理
            </div>
            <div class="siteManage" @click="toDesign(item.siteId)">
              进入设计
              <div class="arrowRight"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="sliderWrap" v-show="siteInfo.length > 2">
        <div
          class="slider"
          :class="{sliderActive: index == curIndex}"
          v-for="(item, index) in siteInfo"
          :key="index"
          @click="changeSlider(index)"
        ></div>
      </div>

      <div
        v-show="isCanCreate"
        :class="{createSiteNumOne:siteInfo.length == 1,createSiteNumTwo:siteInfo.length == 2,createSiteNumThree:siteInfo.length > 2}"
        @click="showCreate"
      ></div>
    </el-row>
    <el-dialog
      width="0"
      :visible.sync="createShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="right-pannel" :style="{width:'600px'}">
        <div class="pannel-head">
          <span class="headTitle">创建网站</span>
          <span class="close-pannel" @click="closeDialog">
            <i class="iconfont iconX" style="font-size:12px;color:#ccc"></i>
          </span>
        </div>
        <div>
          <div class="createSiteName">
            <span class="createSiteNameTitle">请设置您的网站名称：</span>
            <el-input v-model="createSiteName" placeholder="请输入内容" class="createSiteNameInput"></el-input>
          </div>
          <div style="margin-top:24px;margin-left:32px;">
            <div class="createSiteLanguageTitle">请选择您的网站语言：</div>
            <el-radio-group v-model="radio" class="radio">
              <el-radio label="zh-CN">中文</el-radio>
              <el-radio label="en-US">英文</el-radio>
              <el-radio label="ja-JP">日语</el-radio>
              <el-radio label="es-ES">西班牙语</el-radio>
              <el-radio label="ko-KR">韩语</el-radio>
            </el-radio-group>
          </div>
          <div class="create">
            <el-button
              class="createBtn"
              :disabled="radio == '' || createSiteName == ''"
              :class="{disabled: radio == '' || createSiteName == ''}"
              @click="createSite"
            >立即创建</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as dashboardApi from "@/api/request/dashboardApi";
import LeftNavComponents from "_c/Aside/LeftNavComponents";
import { designerUrl, mySiteUrl } from "@/environment/index";
import { getLanguage } from "@/configure/appCommon";

export default {
  props: ["siteInfo", "isCanCreate"],
  data() {
    return {
      isFirst: true,
      siteId: 1,
      curIndex: 0,
      createShow: false,
      createSiteName: "",
      radio: "",
      lock: true
    };
  },
  mounted() {},
  computed: {
    mySiteId() {
      return this.$store.state.dashboard.siteId;
    }
  },
  watch: {
    siteInfo() {
      if (this.isFirst) {
        if (this.mySiteId) {
          this.siteId = this.mySiteId;
          this.initial();
        } else {
          this.getCurSiteId().then(() => {
            this.initial();
          });
        }
      }
    }
  },
  methods: {
    changeSlider(index) {
      console.log(index);
      this.curIndex = index;
      this.handleClick(index);
    },
    leftClick() {
      if (this.curIndex == 0) {
        this.handleClick(this.siteInfo.length - 1);
      } else {
        this.handleClick(this.curIndex - 1);
      }
    },
    rightClick() {
      if (this.curIndex == this.siteInfo.length - 1) {
        this.handleClick(0);
      } else {
        this.handleClick(this.curIndex + 1);
      }
    },
    /**
     * 获取当前siteId
     */
    async getCurSiteId() {
      let { data } = await dashboardApi.getCurSiteId();
      this.siteId = data;
      this.$store.commit("SETSITEID", this.siteId);
    },
    initial() {
      this.isFirst = false;
      if (this.siteInfo.length > 3) {
        for (let i = 0; i < this.siteInfo.length; i++) {
          if (this.siteInfo[i].siteId == this.siteId) {
            this.curIndex = i;
            if (i == 0) {
              this.$set(
                this.siteInfo[this.siteInfo.length - 2],
                "prevPrev",
                true
              );
              this.$set(this.siteInfo[this.siteInfo.length - 1], "prev", true);
            } else if (i == 1) {
              this.$set(
                this.siteInfo[this.siteInfo.length - 1],
                "prevPrev",
                true
              );
              this.$set(this.siteInfo[i - 1], "prev", true);
            } else {
              this.$set(this.siteInfo[i - 1], "prev", true);
              this.$set(this.siteInfo[i - 2], "prevPrev", true);
            }
            if (i == this.siteInfo.length - 1) {
              this.$set(this.siteInfo[0], "next", true);
            } else {
              this.$set(this.siteInfo[i + 1], "next", true);
            }
          }
        }
      } else if (this.siteInfo.length == 3) {
        for (let i = 0; i < this.siteInfo.length; i++) {
          if (this.siteInfo[i].siteId == this.siteId) {
            this.curIndex = i;
            this.$set(this.siteInfo[i - 1], "prev", true);
            this.$set(this.siteInfo[i + 1], "next", true);
          }
        }
      }
    },
    handleClick(index) {
      // console.log(this.$refs[`siteInfo-${index}`][0].style);
      // if (index == 0 || index == this.siteInfo.length - 1) return;
      // this.curIndex = index;
      if (this.siteInfo.length == 1) {
        this.lock = false;
      }

      if (this.lock) {
        this.lock = false;
        for (let i = 0; i < this.siteInfo.length; i++) {
          this.$set(this.siteInfo[i], "prev", false);
          this.$set(this.siteInfo[i], "next", false);
          this.$set(this.siteInfo[i], "prevPrev", false);
        }

        if (index == 0) {
          this.$set(this.siteInfo[this.siteInfo.length - 1], "prev", true);
        } else {
          this.$set(this.siteInfo[index - 1], "prev", true);
        }
        if (index == this.siteInfo.length - 1) {
          this.$set(this.siteInfo[0], "next", true);
        } else {
          this.$set(this.siteInfo[index + 1], "next", true);
        }

        // if(this.siteInfo.length != 4 && !(index == 3 || index < this.curIndex)){
        if (this.siteInfo.length != 3) {
          if (index == 0) {
            this.$set(
              this.siteInfo[this.siteInfo.length - 2],
              "prevPrev",
              true
            );
          } else if (index == 1) {
            this.$set(
              this.siteInfo[this.siteInfo.length - 1],
              "prevPrev",
              true
            );
          } else {
            this.$set(this.siteInfo[index - 2], "prevPrev", true);
          }
        }

        // }

        // setTimeout(() => {
        //   for (let i = 0; i < this.siteInfo.length; i++) {
        //     this.$set(this.siteInfo[i], "prevPrev", false);
        //   }
        this.lock = true;
        // }, 500);

        this.curIndex = index;
        // this.$set(this.siteInfo[index - 2], "prevPrev", true);
      }
    },
    // 跳转至设计器
    toDesign(siteId, themeColor, themeFont) {
      window.location.href = `${designerUrl}?siteId=${siteId}`;
    },
    // 跳转至我的网站
    toSiteManage(siteId) {
      this.$store.commit("SETSITEID", siteId);
      window.location.href = mySiteUrl;
    },
    // 转换语言
    _getLanguage(language) {
      return getLanguage(language);
    },
    showCreate() {
      this.createShow = true;
    },
    closeDialog() {
      this.radio = "";
      this.createSiteName = "";
      this.createShow = false;
    },
    // 创建site
    async createSite() {
      let { status } = await dashboardApi.CreateSite(
        this.radio,
        this.createSiteName
      );
      if (status == 200) {
        this.radio = "";
        this.createSiteName = "";
        this.$emit("getDashboardData");
        this.createShow = false;
        this.$notify({
          customClass: "notify-success",
          message: `创建成功`,
          duration: 2000,
          showClose: false
        });
      }
    }
  }
};
</script>

<style scoped>
.createSiteNameInput /deep/ .el-input__inner {
  margin-top: 16px;
  width: 536px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 229, 229, 1);
}
.radio /deep/ .is-checked .el-radio__inner {
  background: #00c1de;
  border-color: #00c1de;
}
.radio /deep/ .el-radio {
  margin-right: 17px;
}
.radio /deep/ .el-radio__label {
  font-size: 12px;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 20px;
}
.radio /deep/ .is-checked .el-radio__label {
  font-size: 12px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
</style>

<style lang="scss" scoped>
.disabled {
  opacity: 0.4;
}
.site-section {
  margin-top: 40px;
  margin-bottom: 49px;
  width: 100%;
  height: 331px;
  position: relative;
  .content {
    overflow: hidden;
    width: 94%;
    height: 331px;
    position: relative;
    margin-left: 3%;
    margin-right: 3%;
    .leftModul {
      position: absolute;
      left: 0;
      bottom: 31px;
      width: 17%;
      height: 300px;
      cursor: pointer;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(93, 209, 255, 0) 100%
      );
    }
    .rightModul {
      position: absolute;
      right: 0;
      bottom: 31px;
      width: 17%;
      height: 300px;
      cursor: pointer;
      background: linear-gradient(
        90deg,
        rgba(146, 170, 254, 0) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    }
    .item:nth-child(3n + 1) {
      background: linear-gradient(
        315deg,
        rgba(8, 204, 235, 1) 0%,
        rgba(129, 220, 160, 1) 100%
      );
      // background: url("~img/dashboard/board-greenbackground.png") no-repeat
      //   center;
      // background-size: contain;
    }
    .item:nth-child(3n + 2) {
      background: linear-gradient(
        315deg,
        rgba(70, 180, 254, 0.79) 0%,
        rgba(28, 218, 254, 0.79) 100%
      );
    }
    .item:nth-child(3n + 3) {
      background: linear-gradient(
        315deg,
        rgba(175, 149, 241, 0.79) 0%,
        rgba(58, 144, 253, 0.79) 100%
      );
    }
    .item {
      position: absolute;
      width: 26%;
      height: 180px;
      right: -1px;
      bottom: 31px;
      transform: translateX(100%);
      border-radius: 3px;
      transition: all 0.3s ease;
      opacity: 0;
      .siteImg {
        width: 46%;
        height: 72%;
        float: left;
        margin-top: 24px;
        margin-left: 21px;
        cursor: pointer;
        .siteImgBackground {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .siteName {
        overflow: hidden;
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        margin-top: 33px;
        padding-left: 30px;
        padding-right: 20px;

        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .siteText {
        overflow: hidden;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 17px;
        padding-left: 30px;
      }
      .siteLanguage {
        margin-top: 8px;
      }
      .isPublished {
        margin-top: 16px;
      }
    }
    .active {
      width: 43%;
      height: 300px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.14);
      opacity: 1;
      .siteImg {
        margin-top: 43px;
        margin-left: 30px;
      }
      .siteName {
        font-size: 22px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        margin-top: 57px;
        padding-left: 30px;
      }
      .siteText {
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        margin-left: 30px;
      }
      .siteLanguage {
        margin-top: 16px;
      }
      .isPublished {
        margin-top: 30px;
      }
    }
    .prevActive {
      height: 180px;
      left: 0;
      transform: translateX(0);
      opacity: 0.79;
      cursor: pointer;
    }
    .nextActive {
      height: 180px;
      left: 74%;
      // right: 0;
      transform: translateX(0);
      opacity: 0.79;
      cursor: pointer;
    }
    .prevActivePrev {
      left: 0;
      transform: translateX(-100%);
    }
    .hidden {
      opacity: 0;
    }
    .createSiteNumOne {
      position: absolute;
      right: 20%;
      top: 5px;
      width: 6%;
      padding-bottom: 6%;
      max-width: 60px;
      background: url("~img/dashboard/board-createSite.png") no-repeat center;
      background-size: contain;
      cursor: pointer;
    }
    .createSiteNumTwo {
      position: absolute;
      right: 5%;
      top: 5px;
      width: 6%;
      padding-bottom: 6%;
      max-width: 60px;
      background: url("~img/dashboard/board-createSite.png") no-repeat center;
      background-size: contain;
      cursor: pointer;
    }
    .createSiteNumThree {
      position: absolute;
      right: 0px;
      top: 23px;
      width: 6%;
      padding-bottom: 6%;
      max-width: 60px;
      background: url("~img/dashboard/board-createSite.png") no-repeat center;
      background-size: contain;
      cursor: pointer;
    }
    .sliderWrap {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);

      .slider {
        width: 8px;
        height: 8px;
        background: rgba(229, 229, 229, 1);
        border-radius: 50%;
        float: left;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.3s linear;
      }
      .sliderActive {
        width: 20px;
        height: 8px;
        background: rgba(54, 210, 207, 1);
        border-radius: 4px;
      }
    }
    .siteInfoTwo {
      width: 33%;
      height: 300px;
      position: absolute;
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.14);
      opacity: 1;
    }
    .siteInfoTwo:nth-child(1) {
      left: 15.5%;
      background: linear-gradient(
        315deg,
        rgba(70, 180, 254, 0.79) 0%,
        rgba(28, 218, 254, 0.79) 100%
      );
    }
    .siteInfoTwo:nth-child(2) {
      left: 51.5%;
      background: linear-gradient(
        315deg,
        rgba(8, 204, 235, 1) 0%,
        rgba(129, 220, 160, 1) 100%
      );
    }
    .siteImg {
      width: 46%;
      height: 72%;
      float: left;
      margin-top: 24px;
      margin-left: 21px;
      cursor: pointer;
      .siteImgBackground {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .siteName {
      overflow: hidden;
      font-size: 22px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      margin-top: 57px;
      padding-left: 30px;

      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .siteText {
      overflow: hidden;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      padding-left: 30px;
    }
    .siteLanguage {
      margin-top: 16px;
    }
    .isPublished {
      margin-top: 32px;
    }
    .siteManageWrap {
      overflow: hidden;
      padding-left: 15px;
      margin-top: 45px;
      .siteManage {
        width: 100px;
        height: 30px;
        padding: 8px 10px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        cursor: pointer;
        .arrowLeft {
          display: inline-block;
          width: 14px;
          height: 13px;
          margin-right: 5px;
          background: url("~img/dashboard/board-arrowLeftMax.png") no-repeat
            center;
          background-size: contain;
          vertical-align: inherit;
        }
        .arrowRight {
          display: inline-block;
          width: 14px;
          height: 13px;
          margin-left: 5px;
          background: url("~img/dashboard/board-arrowRightMax.png") no-repeat
            center;
          background-size: contain;
          vertical-align: inherit;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
      }
      // .siteManageLeft {
      // margin-right: 15px;
      // }
    }
  }
}
.right-pannel {
  width: 600px;
  height: 356px;
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .pannel-head {
    height: 70px;
    overflow: hidden;
    border-bottom: 2px solid #efefef;
    .headTitle {
      font-size: 16px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 70px;
      margin-left: 32px;
      margin-top: 24px;
    }
    .close-pannel {
      line-height: 70px;
      float: right;
      cursor: pointer;
      margin-right: 32px;
    }
  }
  .createSiteName {
    margin-top: 24px;
    padding-left: 32px;
    .createSiteNameTitle {
      font-size: 12px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
  }
  .createSiteLanguageTitle {
    font-size: 12px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    margin-bottom: 16px;
  }
  .create {
    margin-top: 30px;
    width: 100%;
    height: 80px;
    border-top: 2px solid #eee;
    text-align: center;
    .createBtn {
      width: 116px;
      height: 32px;
      background: rgba(1, 192, 222, 1);
      border-radius: 2px;
      padding: 0px;
      margin-top: 24px;
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
  }
}
@media screen and (max-width: 1912px) {
  .site-section .content .item .siteManageWrap {
    margin-top: 25px;
  }
  .site-section .content .siteManageWrap {
    margin-top: 25px;
  }
}
@media screen and (max-width: 1500px) {
  .site-section {
    margin-top: 22px;
    margin-bottom: 29px;
    height: 180px;
    .content {
      height: 180px;
      .leftModul {
        height: 156px;
      }
      .rightModul {
        height: 156px;
      }
      .item {
        height: 94px;
        .siteImg {
          margin-top: 15px;
          margin-left: 11px;
        }
        .siteName {
          margin-top: 20px;
          padding-left: 18px;
          font-size: 10px;
          line-height: 14px;
        }
        .siteText {
          font-size: 10px;
          line-height: 14px;
          padding-left: 18px;
        }
        .siteLanguage {
          margin-top: 2px;
        }
        .isPublished {
          margin-top: 6px;
        }
        .details {
          margin-top: 21px;
        }
      }
      .active {
        height: 156px;
        .siteImg {
          margin-top: 25px;
          margin-left: 16px;
        }
        .siteName {
          margin-top: 20px;
          padding-left: 18px;
          font-size: 16px;
          line-height: 22px;
        }
        .siteText {
          font-size: 14px;
          line-height: 20px;
          padding-left: 18px;
        }
        .siteLanguage {
          margin-top: 2px;
        }
        .isPublished {
          margin-top: 6px;
        }
        .siteManageWrap {
          margin-top: 15px;
          padding-left: 10px;
          .siteManage {
            width: 82px;
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            padding: 5px;
            .arrowLeft {
              width: 7px;
              height: 6px;
              margin-right: 5px;
              background: url("~img/dashboard/board-arrowLeftMin.png") no-repeat
                center;
              background-size: contain;
              vertical-align: middle;
            }
            .arrowRight {
              width: 7px;
              height: 6px;
              margin-left: 5px;
              background: url("~img/dashboard/board-arrowRightMin.png")
                no-repeat center;
              background-size: contain;
              vertical-align: middle;
            }
          }
        }
      }
      .prevActive {
        height: 94px;
      }
      .nextActive {
        height: 94px;
      }
      .sliderWrap {
        .slider {
          width: 4px;
          height: 4px;
          margin-left: 6px;
          transition: all 0.3s linear;
        }
        .sliderActive {
          width: 10px;
          height: 4px;
        }
      }
      .createSiteNumOne {
        right: 20%;
        top: 5px;
        width: 3.5%;
        padding-bottom: 3.5%;
      }
      .createSiteNumTwo {
        right: 5%;
        top: 5px;
        width: 3.5%;
        padding-bottom: 3.5%;
      }
      .createSiteNumThree {
        top: 9px;
        width: 3.5%;
        padding-bottom: 3.5%;
      }
      .siteInfoTwo {
        height: 156px;
      }
      .siteImg {
        margin-top: 25px;
        margin-left: 16px;
      }
      .siteName {
        margin-top: 20px;
        padding-left: 18px;
        font-size: 16px;
        line-height: 22px;
      }
      .siteText {
        font-size: 14px;
        line-height: 20px;
        padding-left: 18px;
      }
      .siteLanguage {
        margin-top: 2px;
      }
      .isPublished {
        margin-top: 6px;
      }
      .details {
        margin-top: 21px;
      }
      .siteManageWrap {
        margin-top: 5px;
        padding-left: 10px;
        .siteManage {
          width: 82px;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          padding: 5px;
          .arrowLeft {
            width: 7px;
            height: 6px;
            margin-right: 5px;
            background: url("~img/dashboard/board-arrowLeftMin.png") no-repeat
              center;
            background-size: contain;
            vertical-align: middle;
          }
          .arrowRight {
            width: 7px;
            height: 6px;
            margin-left: 5px;
            background: url("~img/dashboard/board-arrowRightMin.png") no-repeat
              center;
            background-size: contain;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1420px) {
  .site-section .content .active .siteManageWrap {
    margin-top: 5px;
  }
}
</style>
