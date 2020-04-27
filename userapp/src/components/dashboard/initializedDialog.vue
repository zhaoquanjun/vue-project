<template>
  <div>
    <el-dialog
      width="0"
      :visible.sync="initializedDialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="initializedDialog" :style="{width:'430px'}">
        <div v-show="initializedStep == 'before'">
          <div class="dialog-head">
            <span class="dialog-headTitle">初始化站点</span>
            <span class="dialog-close" @click="closeInitializedDialog">
              <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
            </span>
          </div>
          <div v-show="initializedSourceSiteList.length > 1" class="dialog-site">
            <div class="dialog-siteTitle">请选择参考网站</div>
            <el-select v-model="initializedSourceSiteId" style="width:180px" placeholder="请选择">
              <el-option
                v-for="item in initializedSourceSiteList"
                :key="item.siteId"
                :label="item.siteName"
                :value="item.siteId"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-language">
            <div
              :class="{'dialog-noChineseSite': initializedSourceSiteList.length == 1}"
              class="dialog-languageTitle"
            >请选择语言</div>
            <el-select v-model="initializedSiteLanguage" style="width:112px" placeholder="请选择">
              <el-option
                v-for="item in initializedSiteLanguageList"
                :key="item.language"
                :label="item.label"
                :value="item.language"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-tips">* 建议完成【中文站】后，再进行站点初始化</div>
          <div class="dialog-footer">
            <button
              @click="closeInitializedDialog"
              class="cl-button cl-button--primary_notbg cl-button--small"
            >取消</button>
            <Debounce :time="1000" !isDebounce>
              <button
                @click="initializedSite"
                class="cl-button cl-button--primary cl-button--small"
              >确定</button>
            </Debounce>
          </div>
        </div>
        <div v-show="initializedStep == 'start'">
          <div class="dialog-head">
            <span class="dialog-headTitle">站点初始化</span>
            <span class="dialog-close" @click="closeInitializedDialog">
              <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
            </span>
          </div>
          <div class="translation-wrap" v-show="initializedType == 'translation'">
            <div class="translation-img"></div>
            <el-progress :percentage="translationPercentage"></el-progress>
            <div class="translation-text">阿里智能AI正在为您翻译…</div>
            <ul class="translation-tips">
              <li>
                <i class="iconfont iconicon-des-right1"></i>最先进的端到端深度学习框架，千万级多语学习库；
              </li>
              <li>
                <i class="iconfont iconicon-des-right1"></i>多样化应用场景，单机单句百毫秒级解码，整站翻译只需几秒；
              </li>
              <li>
                <i class="iconfont iconicon-des-right1"></i>智能纠错系统，翻译服务可靠性高达99.99%
              </li>
            </ul>
          </div>
          <div class="copy-wrap" v-show="initializedType == 'copy'">
            <div class="copy-img"></div>
            <el-progress :percentage="copyPercentage"></el-progress>
            <div class="copy-text">正在创建站点，请稍后…</div>
          </div>
        </div>
        <div v-show="initializedStep == 'after'">
          <div class="dialog-head">
            <span class="dialog-headTitle">{{getDialogTitle()}}</span>
            <span class="dialog-close" @click="closeInitializedDialog">
              <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
            </span>
          </div>
          <div class="initializedAfter-wrap">
            <div class="initializedAfter-left">
              <i v-if="initializedStatus == 'success'" class="iconfont iconxingzhuangjiehe"></i>
              <i v-else class="iconfont iconyiwen"></i>
            </div>
            <div class="initializedAfter-right">
              <div v-show="initializedStatus == 'success'">
                <div
                  v-show="initializedType == 'copy'"
                  class="initializedAfter-text copySite"
                >站点初始化成功！</div>
                <div v-show="initializedType == 'translation'" class="translationSite">
                  <div class="initializedAfter-text">外文站点初始化成功！</div>
                  <div v-show="siteCount == 2">
                    已开启
                    <span class="primaryColor">自动翻译</span>
                  </div>
                  <div class="dialog-tips">*机器翻译结果存在误差，可能需要您手动订正。</div>
                </div>
              </div>
              <div v-show="initializedStatus == 'fail'">
                <div class="initializedAfter-text copySite">连接超时，网站初始化失败，请稍后再试！</div>
              </div>
              <div style="width:300px" v-show="initializedStatus == 'error'">
                <div class="initializedAfter-text translationSite">站点初始化成功！</div>
                <div
                  class="initializedAfter-errorInfo"
                >单篇文章/产品最大可翻译字符为5000，以下超限内容本次翻译失败，已被忽略。您可缩减内容后手动操作翻译。</div>
                <ul class="initializedFailList-wrap">
                  <li v-for="(item, index) in initializedErrorList" :key="index">
                    <span class="initializedFailList-type">{{getPageType(item.type)}}</span>
                    <span class="initializedFailList-symbol">//</span>
                    <span class="initializedFailList-name">{{item.name}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <div class="countdownTime" v-show="initializedStatus == 'success'">
              {{countdownTimeNum}}s进入预览
            </div>
            <a
              class="preview-btn"
              :href="`//${curSiteinfo.secondDomain}`"
              target="_blank"
              v-show="initializedStatus == 'success'"
              @click="completeInitialized"
            >
              <button class="cl-button cl-button--primary_notbg cl-button--small">预览</button>
            </a>
            <button
              @click="completeInitialized"
              class="cl-button cl-button--primary cl-button--small"
            >关闭</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as dashboardApi from "@/api/request/dashboardApi";

export default {
  props: ["curSiteinfo", "siteId", "siteCount"],
  data() {
    return {
      initializedDialog: false,
      initializedStep: "before",
      initializedType: "translation",
      initializedSourceSiteId: 0,
      initializedSourceSiteList: [],
      initializedSiteLanguage: "en-US",
      initializedSiteLanguageList: [
        {
          language: "zh-CN",
          label: "中文"
        },
        {
          language: "en-US",
          label: "英文"
        },
        {
          language: "ja-JP",
          label: "日文"
        },
        {
          language: "es-ES",
          label: "西班牙语"
        },
        {
          language: "ko-KR",
          label: "韩语"
        }
      ],
      initializedStatus: "success",
      initializedErrorList: [],
      translationPercentage: 0,
      copyPercentage: 0,
      countdownTimeNum: 5,
      previewTimer: null
    };
  },
  methods: {
    async getChineseSiteInfo() {
      let { data } = await dashboardApi.getChineseSiteInfo();
      this.initializedSourceSiteList = data.chineseSiteList;
      this.initializedSourceSiteId = data.chineseSiteList[0].siteId;
    },
    showInitializedDialog() {
      if(this.curSiteinfo.anyChineseSiteHasBeenInitialized) {
        this.getChineseSiteInfo();
        this.initializedSiteLanguage = "en-US";
        this.initializedDialog = true;
        this.initializedStep = "before";
      }
    },
    closeInitializedDialog() {
      this.initializedDialog = false;
    },
    completeInitialized() {
      this.initializedDialog = false;
      clearInterval(this.previewTimer);
      this.previewTimer = null;
      this.$emit("getSites");
      this.$store.dispatch("getTranslateSwitch");
      if (this.$route.path == "/website/selectTemplate") {
        this.$router.push({
          path: "/website/mysite/siteinfo"
        });
      }
    },
    async initializedSite() {
      if (this.initializedSiteLanguage == "zh-CN") {
        this.initializedType = "copy";
      } else {
        this.initializedType = "translation";
      }
      this.initializedStep = "start";
      try {
        let para = {
          language: this.initializedSiteLanguage,
          needTranslateProduct: true,
          needTranslateNews: true,
          sourceSiteId: this.initializedSourceSiteId,
          translateTargetSiteId: this.siteId
        };
        let { data, status } = await dashboardApi.translate(para);
        if (status == 200) {
          this.initializedStatus = "success";
        } else {
          this.initializedStatus = "fail";
        }
        if (this.initializedSiteLanguage == "zh-CN") {
          this.copyPercentage = 100;
          let timer = setTimeout(() => {
            this.countdownTimeNum = 5;
            this.initializedStep = "after";
            this.previewTimer = setInterval(()=>{
              this.countdownTimeNum--;
              if(this.countdownTimeNum == 0){
                clearInterval(this.previewTimer);
                this.previewTimer = null;
                let a = document.getElementsByClassName("preview-btn")[0]
                a.click();
                this.completeInitialized();
              }
            }, 1000)
            this.copyPercentage = 0;
            this.getChineseSiteInfo();
            clearTimeout(timer)
          }, 1000);
        } else {
          this.getTranslateProgress(data.translateId);
        }
      } catch (e) {
        console.log(e);
        this.initializedStatus = "fail";
        this.initializedStep = "after";
      }
    },
    // 获取翻译进度
    async getTranslateProgress(translateId) {
      let timer = setInterval(async () => {
        let { data } = await dashboardApi.getTranslateProgress(translateId);
        this.translationPercentage = Number(
          data.progressPercentStr.substring(
            0,
            data.progressPercentStr.length - 1
          )
        );
        if (data.isTranslateIdExist == true && data.progressPercent == 1) {
          clearInterval(timer);
          if (data.failedCount > 0) {
            this.initializedErrorList = [];
            this.initializedStatus = "error";
            if (data.pageProgress) {
              this.pushAttrToList(
                "page",
                data.pageProgress.failedList,
                this.initializedErrorList
              );
            }
            if (data.productProgress) {
              this.pushAttrToList(
                "product",
                data.productProgress.failedList,
                this.initializedErrorList
              );
            }
            if (data.newsProgress) {
              this.pushAttrToList(
                "news",
                data.newsProgress.failedList,
                this.initializedErrorList
              );
            }
          } else {
            this.initializedStatus = "success";
          }
          setTimeout(() => {
            this.countdownTimeNum = 5;
            this.initializedStep = "after";
            if(this.initializedStatus == "success") {
              this.previewTimer = setInterval(()=>{
                this.countdownTimeNum--;
                if(this.countdownTimeNum == 0){
                  clearInterval(this.previewTimer)
                  this.previewTimer = null;
                  // let newWindow = window.open();
                  // newWindow.location.href = `//${this.curSiteinfo.secondDomain}`
                  let a = document.getElementsByClassName("preview-btn")[0]
                  a.click();
                  this.completeInitialized();
                }
              }, 1000)
            }
            this.translationPercentage = 0;
          }, 1000);
        }
      }, 2000);
    },
    // type转化为文字
    getPageType(type) {
      if (type == "page") {
        return "页面";
      } else if (type == "product") {
        return "产品";
      } else if (type == "news") {
        return "文章";
      }
    },
    // 根据状态转换标题
    getDialogTitle() {
      if (this.initializedStatus == "success") {
        return "完成";
      } else if (this.initializedStatus == "error") {
        return "提示";
      } else if (this.initializedStatus == "fail") {
        return "失败";
      }
    },
    // 将翻译失败的push到数组中
    pushAttrToList(attrOne, attrSec, list) {
      attrSec.forEach(item => {
        list.push({
          type: attrOne,
          name: item.sourceEntityDesc
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .initializedDialog {
    background: #ffffff;
    position: fixed;
    z-index: 2200;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    transition: width 0.2s linear;
    background-color: "#fff";
    color: #262626;
    overflow: hidden;
    padding: 24px 24px 32px;
    box-sizing: border-box;
    .dialog-site {
      margin-top: 16px;
      .dialog-siteTitle {
        display: inline-block;
        font-size: $--font-size-base;
        color: $--color-text-primary;
        line-height: 20px;
        width: 98px;
        text-align: right;
        margin-right: 12px;
      }
    }
    .dialog-language {
      margin-top: 16px;
      .dialog-languageTitle {
        display: inline-block;
        font-size: $--font-size-base;
        color: $--color-text-primary;
        line-height: 20px;
        width: 98px;
        text-align: right;
        margin-right: 12px;
      }
      .dialog-noChineseSite {
        width: 70px;
      }
    }
    .dialog-tips {
      font-size: $--font-size-small;
      color: $--color-text-regular;
      margin-top: 16px;
    }
    .translation-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .translation-img {
        display: inline-block;
        width: 93px;
        height: 73px;
        background: url("~img/dashboard/translationImg.png") no-repeat center;
        background-size: contain;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      .translation-text {
        margin-top: 8px;
        font-size: $--font-size-small;
        color: $--color-primary;
      }
      .translation-tips {
        margin-top: 22px;
        li {
          font-size: $--font-size-small;
          color: $--color-text-primary;
          line-height: 24px;
          i {
            margin-right: 8px;
          }
        }
      }
    }
    .copy-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .copy-img {
        display: inline-block;
        width: 76px;
        height: 73px;
        background: url("~img/dashboard/copyImg.png") no-repeat center;
        background-size: contain;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      .copy-text {
        margin-top: 8px;
        margin-bottom: 36px;
        font-size: $--font-size-small;
        color: $--color-primary;
      }
    }
    .initializedAfter-wrap {
      width: 100%;
      display: flex;
      // align-items: center;
      .initializedAfter-left {
        margin-left: 24px;
        margin-right: 12px;
        margin-top: 40px;
        .iconxingzhuangjiehe {
          font-size: 32px;
          color: $--color-success;
        }
        .iconyiwen {
          font-size: 32px;
          color: $--color-primary;
        }
      }
      .initializedAfter-right {
        .initializedAfter-text {
          font-size: 14px;
          font-weight: $--font-weight-primary;
          color: $--color-text-primary;
        }
        .copySite {
          margin-top: 48px;
        }
        .translationSite {
          margin-top: 40px;
        }
        .primaryColor {
          line-height: 26px;
          color: $--color-primary;
        }
        .dialog-tips {
          margin-top: 8px;
        }
        .initializedAfter-errorInfo {
          margin-top: 8px;
          font-size: $--font-size-small;
          line-height: 20px;
        }
        .initializedFailList-wrap {
          margin-top: 16px;
          width: 100%;
          padding: 10px 16px;
          border: $--border-base;
          box-sizing: border-box;
          li span {
            line-height: 16px;
          }
          .initializedFailList-type {
            color: $--color-primary;
            font-size: $--font-size-small;
          }
          .initializedFailList-symbol {
            color: $--color-text-secondary;
            font-size: $--font-size-small;
          }
          .initializedFailList-name {
            color: $--color-text-regular;
            font-size: $--font-size-small;
            margin-left: 6px;
          }
        }
      }
    }
    /deep/ .el-progress {
      .el-progress-bar {
        width: 303px;
      }
      .el-progress-bar__outer {
        width: 257px;
        background-color: #f0f3f7;
        .el-progress-bar__inner {
          background-color: $--color-primary;
        }
      }
      .el-progress__text {
        font-size: $--font-size-base;
        color: $--color-text-regular;
        margin-left: 25px;
      }
    }
  }
  .dialog-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dialog-headTitle {
      font-size: 16px;
      font-weight: 600;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .dialog-close {
      cursor: pointer;
    }
  }
  .dialog-footer {
    margin-top: 36px;
    text-align: right;
    width: 100%;
    .preview-btn {
      margin-right: 16px;
    }
    .countdownTime{
      display: inline-block;
      color: $--color-warning;
      font-size: $--font-size-small;
      margin-right: 16px;
    }
  }
</style>
