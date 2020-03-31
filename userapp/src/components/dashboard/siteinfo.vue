<template>
  <div class="content-section">
    <p class="section-title">网站中心</p>
    <el-row class="content">
      <div class="sitelist-wrap">
        <ul class="sitelist">
          <li
            class="sitelist-item"
            v-for="(item, index) in siteInfo"
            :key="index"
            :class="{'sitelist-curitem':item.siteId == siteId}"
            @click="changeSite(item)"
          >{{item.siteName}}</li>
          <div
            class="sitelist-addSite"
            @click="createUninitializedSite"
            v-show="isSystem&&siteInfo.length < siteCount"
          ></div>
        </ul>
        <!-- <div class="sitelist-add">
          <div class="site-num-wrap">
            <div class="site-num">{{siteInfo.length}}</div>
            <div class="site-total">/ {{siteCount}}</div>
          </div>
        </div>-->
      </div>
      <div class="site-operating">
        <div class="site-edit">
          <div class="site-img"></div>
          <span class="site-name">{{curSiteinfo.siteName}}</span>
          <span class="site-language">{{_getLanguage(curSiteinfo.language)}}</span>
          <i
            class="iconfont iconicon-dash-edit editIcon"
            v-show="isSystem&&curSiteinfo.hasBeenInitialized"
            @click="changeSiteInfoShow"
          ></i>
        </div>
        <div class="site-btn">
          <button
            class="cl-button cl-button--primary"
            @click="jumpTo('template')"
            v-show="!curSiteinfo.hasBeenInitialized&&curSiteinfo.language=='zh-CN'"
          >选择模版</button>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            :content="curSiteinfo.anyChineseSiteHasBeenInitialized?'建议先完成中文站的搭建再整体进行外文站点初始化':'请先完成中文站点的模板选择'"
          >
            <button
              class="cl-button cl-button--primary"
              :class="{'disabled':!curSiteinfo.anyChineseSiteHasBeenInitialized}"
              @click="showInitializedDialog"
              v-show="!curSiteinfo.hasBeenInitialized&&curSiteinfo.language!='zh-CN'"
            >初始化站点</button>
          </el-tooltip>
          <a
            class="preview-btn"
            :href="`//${curSiteinfo.secondDomain}`"
            target="_blank"
            v-show="curSiteinfo.hasBeenInitialized"
          >
            <button class="cl-button cl-button--primary_notbg">预览</button>
          </a>
          <a
            :href="`${designerUrl}?siteId=${curSiteinfo.siteId}`"
            v-show="curSiteinfo.hasBeenInitialized"
          >
            <button class="cl-button cl-button--primary">设计站点</button>
          </a>
        </div>
      </div>
      <el-row class="site-wrap">
        <el-col :span="8" class="site-item">
          <div class="site-title">上线</div>
          <div class="siteInfo-wrap">
            <div class="siteInfo-item" :class="{'disabled':!curSiteinfo.hasBeenInitialized&&curSiteinfo.language!='zh-CN'}" @click="jumpTo('template')">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.siteTemplate, 'siteInfo-icon-green':curSiteTodoinfo.siteTemplate}"
                ></span>
                <span class="siteInfo-title">站点模版</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">{{curSiteTodoinfo.siteTemplate?'更换模版':'选择模版'}}</span>
              </div>
            </div>
            <div class="siteInfo-item" @click="jumpTo('domain')">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.siteDomain, 'siteInfo-icon-green':curSiteTodoinfo.siteDomain}"
                ></span>
                <span class="siteInfo-title">站点域名</span>
                <el-dropdown :hide-timeout="500" placement="bottom-start">
                  <span
                    class="siteInfo-domain"
                  >{{curSiteTodoinfo.resolvedDomainList?curSiteTodoinfo.resolvedDomainList[0]:""}}</span>
                  <el-dropdown-menu slot="dropdown" class="siteDomainDrop">
                    <!-- 域名默认为http 若域名为https的会自动跳到https -->
                    <a
                      class="siteDomainDropList"
                      v-for="(item, index) in curSiteTodoinfo.resolvedDomainList"
                      :key="index"
                      :href="`http://${curSiteTodoinfo.resolvedDomainList[index]}`"
                      target="_blank"
                    >
                      <span class="siteDomainDropItem">{{curSiteTodoinfo.resolvedDomainList[index]}}</span>
                      <i class="iconfont iconchakan"></i>
                    </a>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <a class="siteInfo-item" :href="`https://beian.aliyun.com`" target="_blank">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.domainHasBeenRecord, 'siteInfo-icon-green':curSiteTodoinfo.domainHasBeenRecord}"
                ></span>
                <span class="siteInfo-title">网站备案</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">去备案</span>
              </div>
            </a>
          </div>
        </el-col>
        <el-col :span="8" class="site-item">
          <div class="site-title">推广</div>
          <div class="siteInfo-wrap">
            <div class="siteInfo-item" @click="jumpTo('seo')">
              <div class="siteInfo-left">
                <!-- <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.seo, 'siteInfo-icon-green':curSiteTodoinfo.seo}"
                ></span>-->
                <span class="siteInfo-title">网站地图</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <div
              class="siteInfo-item"
              @click="jumpTo('wechat')"
              v-show="$store.state.dashboard.isWechataccountShow"
            >
              <div class="siteInfo-left">
                <!-- <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.weChatAccount, 'siteInfo-icon-green':curSiteTodoinfo.weChatAccount}"
                ></span>-->
                <span class="siteInfo-title">公众号</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <!-- <div class="siteInfo-item">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.trafficStatistics, 'siteInfo-icon-green':curSiteTodoinfo.trafficStatistics}"
                ></span>
                <span class="siteInfo-title">流量统计</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>-->
          </div>
        </el-col>
        <el-col :span="8" class="site-item">
          <div class="site-title">管理</div>
          <div class="siteInfo-wrap">
            <div class="siteInfo-item" @click="jumpTo('siteInfo')">
              <div class="siteInfo-left">
                <!-- <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.emailServices, 'siteInfo-icon-green':curSiteTodoinfo.emailServices}"
                ></span>-->
                <span class="siteInfo-title">我的站点</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <div class="siteInfo-item" @click="jumpTo('backup')">
              <div class="siteInfo-left">
                <!-- <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.siteBackUp, 'siteInfo-icon-green':curSiteTodoinfo.siteBackUp}"
                ></span>-->
                <span class="siteInfo-title">备份</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <!-- <div class="siteInfo-item">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.sms, 'siteInfo-icon-green':curSiteTodoinfo.sms}"
                ></span>
                <span class="siteInfo-title">短信</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>-->
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog
      width="0"
      :visible.sync="initializedDialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="initializedDialog" :style="{width:'430px'}">
        <div v-show="initializedStep == 'before'">
          <div class="dialog-head">
            <span class="dialog-headTitle">初始化外文站点</span>
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
          <div class="dialog-tips">* 建议完成【中文站】后，再进行外文站的初始化</div>
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
            <span class="dialog-headTitle">初始化外文站点</span>
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
                  <div>
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
                >单篇文章/产品最大可翻译字符为4000，以下超限内容本次翻译失败，已被忽略。您可缩减内容后手动操作翻译。</div>
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
    <el-dialog
      width="0"
      :visible.sync="changeSiteShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="right-pannel" :style="{width:'430px'}">
        <div class="pannel-head">
          <span class="headTitle">设置站点</span>
          <span class="close-pannel" @click="closeChangeDialog">
            <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
          </span>
        </div>
        <div class="createSiteName">
          <span class="createSiteTitle">站点名称</span>
          <el-input
            v-model.trim="changeSiteName"
            @blur="blurSiteName(changeSiteName)"
            placeholder="请输入内容"
            class="createSiteNameInput"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSiteName">{{errorSiteNameText}}</div>
        </div>
        <div v-show="siteInfo.length == 1" style="margin-top:16px">
          <div class="createSiteTitle">站点语言</div>
          <el-radio-group v-model="changeRadio" @change="changeLanguage" class="radio">
            <el-radio label="zh-CN">中文</el-radio>
            <el-radio label="en-US">英文</el-radio>
            <el-radio label="ja-JP">日文</el-radio>
            <el-radio label="es-ES">西班牙语</el-radio>
            <el-radio label="ko-KR">韩语</el-radio>
          </el-radio-group>
          <div class="ym-form-item__error" v-show="errorSiteLanguage">{{errorSiteLanguageText}}</div>
        </div>
        <div class="create">
          <button
            @click="closeChangeDialog"
            class="cl-button cl-button--primary_notbg cl-button--small"
          >取消</button>
          <Debounce :time="1000" !isDebounce>
            <button @click="changeSiteInfo" class="cl-button cl-button--primary cl-button--small">确定</button>
          </Debounce>
        </div>
      </div>
    </el-dialog>
    <SelectTemplateDialog
      ref="selectTemplateDialog"
      :siteId="curSiteinfo.siteId"
      :siteName="curSiteinfo.siteName"
      :templateId="curSiteinfo.templateId"
      :isChangeTemplate="curSiteTodoinfo.siteTemplate"
      @getTodoInfo="getTodoInfo"
      @changeTemplateId="changeTemplateId"
    ></SelectTemplateDialog>
  </div>
</template>

<script>
import * as dashboardApi from "@/api/request/dashboardApi";
import { designerUrl, wechatSpreadUrl } from "@/environment/index";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import { getLanguage } from "@/configure/appCommon";
import { getCookie } from "@/libs/cookie";

export default {
  props: ["siteCount", "isSystem"],
  data() {
    return {
      designerUrl: designerUrl,
      wechatSpreadUrl: wechatSpreadUrl,
      siteId: 0,
      siteInfo: [],
      curSiteinfo: {},
      curSiteTodoinfo: {},
      createShow: false,
      createSiteName: "",
      radio: "",
      errorSiteName: false,
      errorSiteNameText: "",
      errorSiteLanguage: false,
      errorSiteLanguageText: "站点语言不能为空",
      changeSiteShow: false,
      changeSiteName: "",
      changeRadio: "",
      copySiteShow: false,
      copySiteName: "",
      copyRadio: "",
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
      countdownTimeNum: 5
    };
  },
  components: {
    SelectTemplateDialog
  },
  computed: {
    isSiteInfoShow() {
      return this.$store.state.dashboard.isSiteInfoShow;
    }
  },
  methods: {
    async getChineseSiteInfo() {
      let { data } = await dashboardApi.getChineseSiteInfo();
      this.initializedSourceSiteList = data.chineseSiteList;
      this.initializedSourceSiteId = data.chineseSiteList[0].siteId;
    },
    getSiteInfo(info) {
      this.siteInfo = info;
      if (this.$store.state.dashboard.siteId) {
        this.siteId = this.$store.state.dashboard.siteId;
        this.siteInfo.forEach(item => {
          if (item.siteId == this.siteId) {
            this.curSiteinfo = item;
          }
        });
        this.getTodoInfo(this.siteId);
      } else {
        this.getCurSiteId().then(() => {
          this.siteInfo.forEach(item => {
            if (item.siteId == this.siteId) {
              this.curSiteinfo = item;
            }
          });
          this.getTodoInfo(this.siteId);
        });
      }
    },
    // 选择模板后的回调
    changeTemplateId(id) {
      this.curSiteinfo.templateId = id;
      this.$emit("getSites");
      this.getChineseSiteInfo();
    },
    async changeSite(item) {
      if (item.siteId != this.siteId) {
        this.siteId = item.siteId;
        this.curSiteinfo = item;
        this.getTodoInfo(this.siteId);
        this.$store.commit("SETSITEID", this.siteId);
        await dashboardApi.updateUserLastSiteId(this.siteId);
      }
    },
    jumpTo(type) {
      if (!this.curSiteinfo.hasBeenInitialized&&this.curSiteinfo.language=='zh-CN') {
        this.$refs.selectTemplateDialog.showTemplate();
        return;
      }
      if (type == "domain") {
        this.$router.push({
          path: "/website/mysite/sitedomain"
        });
      } else if (type == "template") {
        if (!this.curSiteinfo.hasBeenInitialized&&this.curSiteinfo.language!='zh-CN') {
          return;
        }
        this.$refs.selectTemplateDialog.showTemplate();
      } else if (type == "seo") {
        this.$router.push({
          path: "/website/seo/sitemap"
        });
      } else if (type == "siteInfo") {
        this.$router.push({
          path: "/website/mysite/siteinfo"
        });
      } else if (type == "backup") {
        this.$router.push({
          path: "/website/sitemanage/backup"
        });
      } else if (type == "wechat") {
        window.location.href = this.wechatSpreadUrl;
      }
    },
    async getTodoInfo(siteId) {
      let { data } = await dashboardApi.getTodoInfo(siteId);
      this.curSiteTodoinfo = data;
    },
    // 创建未初始化站点
    async createUninitializedSite() {
      let { data, status } = await dashboardApi.createSite(
        "「未设置」网站名称"
      );
      if (status == 200) {
        this.$notify({
          customClass: "notify-success",
          message: `创建成功`,
          duration: 2000,
          showClose: false
        });
        this.$store.commit("SETSITEID", data);
        await dashboardApi.updateUserLastSiteId(data);
        this.$emit("getSites");
      }
    },
    showInitializedDialog() {
      if(this.curSiteinfo.anyChineseSiteHasBeenInitialized){
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
      this.$emit("getSites");
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
            let previewTimer = setInterval(()=>{
              this.countdownTimeNum--;
              if(this.countdownTimeNum == 0){
                clearInterval(previewTimer);
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
              let previewTimer = setInterval(()=>{
                this.countdownTimeNum--;
                if(this.countdownTimeNum == 0){
                  clearInterval(previewTimer)
                  console.log(`//${this.curSiteinfo.secondDomain}`)
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
    },
    // 点击语言radio
    changeLanguage() {
      this.errorSiteLanguage = false;
    },
    // 创建站点Inputblur
    blurSiteName(name) {
      if (name == "") {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能为空";
        return;
      } else {
        this.errorSiteName = false;
        this.errorSiteNameText = "";
      }
      if (name.length > 20) {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能超过20个字符，请重新输入";
        return;
      } else {
        this.errorSiteName = false;
        this.errorSiteNameText = "";
      }
    },
    // 展示修改site信息弹框
    changeSiteInfoShow() {
      this.changeSiteName = this.curSiteinfo.siteName;
      this.changeRadio = this.curSiteinfo.language;
      this.changeSiteShow = true;
    },
    // 关闭修改site弹窗
    closeChangeDialog() {
      this.changeSiteShow = false;
    },
    // 确定修改site信息
    async changeSiteInfo() {
      if (this.changeSiteName == "") {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能为空";
        return;
      }
      if (this.changeSiteName.length > 20) {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能超过20个字符，请重新输入";
        return;
      }
      let para = {
        siteId: this.siteId,
        siteName: this.changeSiteName,
        language: this.changeRadio
      };
      let { data, status } = await dashboardApi.updateSiteInfo(para);
      if (status == 200) {
        this.curSiteinfo.siteName = this.changeSiteName;
        this.curSiteinfo.language = this.changeRadio;
        this.changeSiteShow = false;
        this.$notify({
          customClass: "notify-success",
          message: `修改成功`,
          duration: 2000,
          showClose: false
        });
      }
    },
    // 转换语言
    _getLanguage(language) {
      return getLanguage(language);
    },
    // 跳转至设计器
    toDesign() {
      window.location.href = `${designerUrl}?siteId=${this.curSiteinfo.siteId}`;
    },
    /**
     * 获取当前siteId
     */
    async getCurSiteId() {
      let { data } = await dashboardApi.getCurSiteId();
      this.siteId = data;
      this.$store.commit("SETSITEID", this.siteId);
    }
  }
};
</script>
<style lang="scss" scoped>
.createSiteDrop {
  width: 100px;
  height: 84px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: $--border-radius-base;
  box-sizing: border-box;
  .createSiteDropText {
    font-size: $--font-size-small;
    font-weight: $--font-weight-base;
    color: $--color-text-primary;
    line-height: 32px;
    padding: 0;
    height: 32px;
    text-align: center;
    &:hover {
      background: $--background-color-selected;
      color: $--color-primary;
    }
  }
}
.siteDomainDrop {
  width: 300px;
  max-height: 135px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: $--border-radius-base;
  box-sizing: border-box;
  overflow-x: auto;
  .siteDomainDropList {
    width: 284px;
    height: 30px;
    margin-left: 4px;
    padding-right: 8px;
    padding-left: 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    &:hover {
      background: $--background-color-selected;
      .iconchakan {
        display: inline-block;
        color: $--color-primary;
      }
    }
    .siteDomainDropItem {
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
      color: $--color-text-primary;
      line-height: 30px;
    }
    .iconchakan {
      display: none;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
.content-section {
  margin-top: $--margin-md;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: $--border-radius-base;
  border: $--border-base;
  .section-title {
    height: 45px;
    padding-left: $--padding-xs;
    font-size: $--font-size-base;
    font-weight: 500;
    line-height: 45px;
    border-bottom: $--border-base;
  }
  .content {
    width: 100%;
    padding: 0 24px;
    .sitelist-wrap {
      width: 100%;
      height: 52px;
      border-bottom: $--border-base;
      display: flex;
      justify-content: space-between;
      .sitelist {
        width: 100%;
        margin-top: 21px;
        display: inline-block;
        .sitelist-item:first-child {
          border-left: $--border-base;
        }
        .sitelist-item {
          display: inline-block;
          height: 32px;
          width: 19%;
          padding: 0 16px;
          text-align: center;
          font-size: 12px;
          line-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          box-sizing: border-box;
          border-top: $--border-base;
          border-bottom: $--border-base;
          border-right: $--border-base;
          background: #fff;
          z-index: 1;
          cursor: pointer;
          &:hover {
            color: $--color-primary;
          }
        }
        .sitelist-curitem {
          border-top: 2px solid $--color-primary;
          border-bottom: 1px solid transparent;
          color: $--color-primary;
        }
        .sitelist-addSite {
          display: inline-block;
          width: 26px;
          height: 26px;
          background: url("~img/dashboard/board-add.png") no-repeat center;
          background-size: contain;
          vertical-align: top;
          margin-top: 3px;
          margin-left: 8px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .sitelist-add {
        display: inline-block;
        height: 52px;
        .site-num-wrap {
          display: inline-block;
          vertical-align: top;
          margin-right: 8px;
          .site-num {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            margin-top: 17px;
            margin-right: 4px;
          }
          .site-total {
            display: inline-block;
            font-size: 12px;
            font-weight: 400;
            color: rgba(161, 168, 177, 1);
            line-height: 17px;
            margin-top: 20px;
          }
        }
      }
    }
    .site-operating {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 $--padding-md;
      box-sizing: border-box;
      border-left: 1px solid $--border-color-base;
      border-right: 1px solid $--border-color-base;
      .site-edit {
        min-width: 350px;
        height: 60px;
        display: flex;
        align-items: center;
        .site-img {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url("~img/dashboard/board-siteIcon.png") no-repeat center;
          background-size: contain;
          margin-right: 16px;
        }
        .site-name {
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          color: rgba(38, 38, 38, 1);
        }
        .site-language {
          margin-left: 24px;
          font-size: $--font-size-small;
          font-weight: 400;
          color: rgba(161, 168, 177, 1);
        }
        .editIcon {
          margin-left: 15px;
          font-size: 14px;
          cursor: pointer;
          color: $--color-primary;
          padding: 8px;
          background: transparent;
          &:hover {
            background-color: $--background-color-hover;
            border-radius: 2px;
          }
        }
      }
      .site-btn {
        .disabled {
          cursor: not-allowed;
          background-color: $--border-color-base;
          border-color: $--border-color-base;
        }
        .preview-btn {
          margin-right: 16px;
        }
      }
    }
    .site-wrap {
      border-top: $--border-base;
      border-bottom: $--border-base;
      height: 125px;
      margin-bottom: $--margin-lg;
      .site-item:first-of-type {
        background: rgba(248, 250, 252, 1);
        background-image: url("~img/dashboard/board-siteBackground1.png");
        background-repeat: no-repeat;
        background-position: 80% top;
        background-size: 140px;
        border-left: $--border-base;
        .siteInfo-wrap .siteInfo-item {
          &:hover {
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
          }
        }
      }
      .site-item {
        height: 100%;
        border-right: $--border-base;
        background-image: url("~img/dashboard/board-siteBackground2.png");
        background-repeat: no-repeat;
        background-position: 80% top;
        background-size: 140px;
        // padding: 0 28px 0 42px;
        .site-title {
          display: inline-block;
          margin-top: 12px;
          margin-left: 27px;
          font-size: $--font-size-base;
          font-weight: 500;
        }
        .siteInfo-wrap {
          margin-top: 7px;
          .siteInfo-item {
            height: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 16px;
            margin-right: 16px;
            padding-left: 14px;
            padding-right: 22px;
            cursor: pointer;
            &:hover {
              background: rgba(240, 243, 247, 1);
              border-radius: 2px;
            }
            .siteInfo-left {
              display: flex;
              align-items: center;
              .siteInfo-icon-red {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: rgba(251, 77, 104, 1);
                margin-right: 8px;
              }
              .siteInfo-icon-green {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: rgba(99, 220, 140, 1);
                margin-right: 8px;
              }
              .siteInfo-icon-gray {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: rgba(161, 168, 177, 1);
                margin-right: 8px;
              }
              .siteInfo-title {
                font-size: 12px;
                font-weight: 400;
                color: $--color-text-primary;
                line-height: 20px;
              }
              .siteInfo-domain {
                margin-left: 16px;
                font-size: 12px;
                font-weight: 400;
                color: $--color-primary;
                line-height: 20px;
              }
            }
            .siteInfo-right {
              .siteInfo-btn {
                font-size: 12px;
                font-weight: 400;
                color: $--color-text-primary;
                line-height: 20px;
              }
            }
          }
          .disabled{
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .right-pannel {
    width: 520px;
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
    padding: 28px 24px 40px;
    .pannel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .headTitle {
        font-size: 16px;
        font-weight: 600;
        color: rgba(38, 38, 38, 1);
        line-height: 22px;
      }
      .close-pannel {
        line-height: 22px;
        cursor: pointer;
      }
    }
    .createSiteName {
      margin-top: 16px;
      .createSiteNameInput {
        margin-top: 16px;
      }
    }
    .createSiteTitle {
      font-size: 14px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
      margin-bottom: 16px;
    }
    .create {
      margin-top: 30px;
      width: 100%;
      text-align: right;
    }
  }
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
          line-height: 16px;
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
}
</style>
