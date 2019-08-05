<template>
  <div class="site-section">
    <el-row class="content">
      <el-col
        :class="{'active':siteId == item.siteId,'activePrev':item.prev, 'activeNext': item.next}"
        class="item"
        v-for="(item, index) in siteInfo"
        :key="index"
        @click.native="handleClick(item,index)"
      >
        <div class="siteImg"></div>
        <div class="siteName">{{item.siteName}}</div>
        <div class="siteText siteLanguage">
          <span>语言：</span>
          {{item.language == "zh-CN" ? "中" : "EN"}}
        </div>
        <div class="siteText isPublished">{{item.isPublished ? "已发布" : "未发布"}}</div>
        <div class="siteText details" v-show="siteId == item.siteId">查看详情</div>
      </el-col>
    </el-row>
    <!-- <el-dialog
                width="0"
                :visible.sync = "createShow"
                :show-close="false"
                :close-on-click-modal="false"
        >
            <div class="right-pannel" :style="{width:'470px'}">
                <div class="pannel-head">
                    <span>
                        <span>创建网站</span>
                    </span>
                    <span class="close-pannel" @click="closeDialog">X</span>
                </div>
                <div>
                    <div>
                        <span>请设置您的网站名称：</span>
                        <el-input v-model="createSiteName" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        
                    </div>
                    <el-button :disabled="false">立即创建</el-button>
                </div>
            </div>
    </el-dialog>-->
  </div>
</template>

<script>
export default {
  props: ["siteInfo"],
  data() {
    return {
      createShow: false,
      createSiteName: "",
      siteId: 2
    };
  },

  created() {
    this.initial();
  },
  methods: {
    initial() {
      for (let i = 0; i < this.siteInfo.length; i++) {
        if (this.siteInfo[i].siteId == this.siteId) {
          this.$set(this.siteInfo[i - 1], "prev", true);
          this.$set(this.siteInfo[i + 1], "next", true);
        }
      }
    },
    handleClick(item, index) {
      this.siteId = item.siteId;
      for (let i = 0; i < this.siteInfo.length; i++) {
        this.$set(this.siteInfo[i], "prev", false);
        this.$set(this.siteInfo[i], "next", false);
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
    },
    showCreate() {
      this.createShow = true;
    },
    closeDialog() {
      this.createShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.site-section {
  margin-top: 40px;
  margin-bottom: 49px;
  //   border: 1px solid #000;
  width: 100%;
  height: 331px;
  position: relative;
  .content {
    overflow: hidden;
    width: 100%;
    height: 331px;
    position: relative;
    .item:nth-child(3n + 1) {
      background: linear-gradient(
        315deg,
        rgba(70, 180, 254, 0.79) 0%,
        rgba(28, 218, 254, 0.79) 100%
      );
      //   background: linear-gradient(
      //     90deg,
      //     rgba(255, 255, 255, 1) 0%,
      //     rgba(146, 170, 254, 0) 100%
      //   );
    }
    .item:nth-child(3n + 2) {
      background: linear-gradient(
        315deg,
        rgba(8, 204, 235, 1) 0%,
        rgba(129, 220, 160, 1) 100%
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
      .siteImg {
        width: 46%;
        height: 72%;
        float: left;
        margin-top: 24px;
        margin-left: 21px;
      }
    //   .siteImg :after {
    //     clear: both;
    //     content: ".";
    //     display: block;
    //     width: 0;
    //     height: 0;
    //     visibility: hidden;
    //   }
      .siteName {
        // display: inline-block;
        font-size: 22px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        margin-top: 33px;
        padding-left: 30px;
      }
      .siteText {
        // display: inline-block;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        margin-left: 30px;
      }
      .siteLanguage {
        margin-top: 8px;
      }
      .isPublished {
        margin-top: 16px;
      }
      .details {
          margin-top: 60px;
      }
    }
    .active {
      width: 43%;
      height: 300px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.14);
    }
    .active.active {
      animation: active-in 1s;
    }
    .active.hidden {
      animation: active-out 1s;
    }
    @keyframes active-in {
      from {
        height: 180px;
        transform: translateX(0);
      }
    }
    @keyframes active-out {
      to {
        // height: 300px;
        left: 0px;
        transform: translateX(0);
      }
    }
    .activePrev {
      left: 0px;
      transform: translateX(0);
      opacity: 0.79;
    }
    .activePrev.active {
      animation: activePrev-in 1s;
    }
    .activePrev.hidden {
      animation: activePrev-out 1s;
    }
    @keyframes activePrev-in {
      from {
        height: 300px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.14);
      }
    }
    @keyframes activePrev-out {
      to {
        transform: translateX(-100%);
      }
    }
    .activeNext {
      transform: translateX(0);
      opacity: 0.79;
    }
    .activeNext.active {
      animation: activeNext-in 1s;
    }
    .activeNext.hidden {
      animation: activeNext-out 1s;
    }
    @keyframes activeNext-in {
      from {
        transform: translateX(100%);
      }
    }
    @keyframes activeNext-out {
      to {
        height: 300px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.14);
      }
    }
  }
}
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  left: 50%;
  margin-left: -235px;
  top: 50%;
  // margin-top:
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .pannel-head {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      padding: 0 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
}
</style>
