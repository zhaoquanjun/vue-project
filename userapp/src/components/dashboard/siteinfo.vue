<template>
  <div class="content-section">
    <p class="section-title">网站管理</p>
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
        </ul>
        <div class="sitelist-add">
          <div class="site-num-wrap">
            <div class="site-num">{{siteInfo.length}}</div>
            <div class="site-total">/ {{siteCount}}</div>
          </div>
          <div
            class="sitelist-addSite"
            v-show="isSystem&&siteInfo.length < siteCount"
            @click="addSite"
          ></div>
        </div>
      </div>
      <div class="site-operating">
        <div class="site-edit">
          <div class="site-img"></div>
          <span class="site-name">{{curSiteinfo.siteName}}</span>
          <span class="site-language">{{_getLanguage(curSiteinfo.language)}}</span>
          <i
            class="iconfont iconicon-dash-edit editIcon"
            v-show="isSystem"
            @click="changeSiteInfoShow"
          ></i>
        </div>
        <div class="site-btn">
          <button
            class="template-btn"
            @click="jumpTo('template')"
            v-show="!curSiteTodoinfo.siteTemplate"
          >选择模版</button>
          <a
            class="preview-btn"
            :href="`//${curSiteinfo.secondDomain}`"
            target="_blank"
            v-show="curSiteTodoinfo.siteTemplate"
          >预览</a>
          <a
            class="design-btn"
            :href="`${designerUrl}?siteId=${curSiteinfo.siteId}`"
            v-show="curSiteTodoinfo.siteTemplate"
          >设计站点</a>
        </div>
      </div>
      <el-row class="site-wrap">
        <el-col :span="8" class="site-item">
          <div class="site-title">上线</div>
          <div class="siteInfo-wrap">
            <div class="siteInfo-item" @click="jumpTo('template')">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-red':!curSiteTodoinfo.siteTemplate, 'siteInfo-icon-green':curSiteTodoinfo.siteTemplate}"
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
                  :class="{'siteInfo-icon-red':!curSiteTodoinfo.siteDomain, 'siteInfo-icon-green':curSiteTodoinfo.siteDomain}"
                ></span>
                <span class="siteInfo-title">站点域名</span>
                <span
                  class="siteInfo-domain"
                >{{curSiteTodoinfo.resolvedDomainList?curSiteTodoinfo.resolvedDomainList[0]:""}}</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <a class="siteInfo-item" :href="`https://beian.aliyun.com`" target="_blank">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-red':!curSiteTodoinfo.domainHasBeenRecord, 'siteInfo-icon-green':curSiteTodoinfo.domainHasBeenRecord}"
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
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.seo, 'siteInfo-icon-green':curSiteTodoinfo.seo}"
                ></span>
                <span class="siteInfo-title">SEO</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <div class="siteInfo-item" @click="jumpTo('wechat')">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.weChatAccount, 'siteInfo-icon-green':curSiteTodoinfo.weChatAccount}"
                ></span>
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
            <div class="siteInfo-item" @click="jumpTo('backup')">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.siteBackUp, 'siteInfo-icon-green':curSiteTodoinfo.siteBackUp}"
                ></span>
                <span class="siteInfo-title">备份</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>
            <!-- <div class="siteInfo-item">
              <div class="siteInfo-left">
                <span
                  :class="{'siteInfo-icon-gray':!curSiteTodoinfo.emailServices, 'siteInfo-icon-green':curSiteTodoinfo.emailServices}"
                ></span>
                <span class="siteInfo-title">邮件服务</span>
              </div>
              <div class="siteInfo-right">
                <span class="siteInfo-btn">管理</span>
              </div>
            </div>-->
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
      :visible.sync="createShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="right-pannel" :style="{width:'520px'}">
        <div class="pannel-head">
          <span class="headTitle">新建站点</span>
          <span class="close-pannel" @click="closeCreateDialog">
            <i class="iconfont iconguanbi" style="font-size:16px;color:#262626"></i>
          </span>
        </div>
        <div class="createSiteName">
          <span class="createSiteTitle">站点名称</span>
          <el-input
            v-model="createSiteName"
            @blur="blurSiteName(createSiteName)"
            placeholder="请输入内容"
            class="createSiteNameInput"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSiteName">{{errorSiteNameText}}</div>
        </div>
        <div style="margin-top:16px">
          <div class="createSiteTitle">站点语言</div>
          <el-radio-group v-model="radio" @change="changeLanguage" class="radio">
            <el-radio label="zh-CN">中文</el-radio>
            <el-radio label="en-US">英文</el-radio>
            <el-radio label="ja-JP">日文</el-radio>
            <el-radio label="es-ES">西班牙语</el-radio>
            <el-radio label="ko-KR">韩语</el-radio>
          </el-radio-group>
          <div class="ym-form-item__error" v-show="errorSiteLanguage">{{errorSiteLanguageText}}</div>
        </div>
        <div class="create">
          <button @click="closeCreateDialog" class="cancelBtn">取消</button>
          <button @click="createSite" class="createBtn">确定</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      width="0"
      :visible.sync="changeSiteShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="right-pannel" :style="{width:'520px'}">
        <div class="pannel-head">
          <span class="headTitle">设置站点</span>
          <span class="close-pannel" @click="closeChangeDialog">
            <i class="iconfont iconguanbi" style="font-size:16px;color:#262626"></i>
          </span>
        </div>
        <div class="createSiteName">
          <span class="createSiteTitle">站点名称</span>
          <el-input
            v-model="changeSiteName"
            @blur="blurSiteName(changeSiteName)"
            placeholder="请输入内容"
            class="createSiteNameInput"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSiteName">{{errorSiteNameText}}</div>
        </div>
        <div style="margin-top:16px">
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
          <button @click="closeChangeDialog" class="cancelBtn">取消</button>
          <button @click="changeSiteInfo" class="createBtn">确定</button>
        </div>
      </div>
    </el-dialog>
    <SelectTemplateDialog
      ref="selectTemplateDialog"
      :siteId="curSiteinfo.siteId"
      :siteName="curSiteinfo.siteName"
      :templateId="curSiteinfo.templateId"
      :isChangeTemplate="curSiteTodoinfo.siteTemplate"
    ></SelectTemplateDialog>
  </div>
</template>

<script>
import * as dashboardApi from "@/api/request/dashboardApi";
import { designerUrl, wechatSpreadUrl } from "@/environment/index";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import { getLanguage } from "@/configure/appCommon";
import { getLocal } from "@/libs/local.js";

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
      changeRadio: ""
    };
  },
  components: {
    SelectTemplateDialog
  },
  methods: {
    getSiteInfo(info) {
      this.siteInfo = info;
      if (this.mySiteId) {
        this.siteId = this.mySiteId;
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
    changeSite(item) {
      if (item.siteId != this.siteId) {
        this.siteId = item.siteId;
        this.curSiteinfo = item;
        this.getTodoInfo(this.siteId);
        this.$store.commit("SETSITEID", this.siteId);
      }
    },
    jumpTo(type) {
      if (type == "domain") {
        this.$router.push({
          path: "/website/mysite/sitedomain"
        });
      } else if (type == "template") {
        this.$refs.selectTemplateDialog.showTemplate();
      } else if (type == "seo") {
        this.$router.push({
          path: "/website/seo/sitemap"
        });
      } else if (type == "backup") {
        this.$router.push({
          path: "/website/mysite/backup"
        });
      } else if (type == "wechat") {
        window.location.href = this.wechatSpreadUrl;
      }
    },
    async getTodoInfo(siteId) {
      let { data } = await dashboardApi.getTodoInfo(siteId);
      this.curSiteTodoinfo = data;
    },
    closeCreateDialog() {
      this.radio = "";
      this.createSiteName = "";
      this.createShow = false;
      this.errorSiteName = false;
      this.errorSiteNameText = "";
      this.errorSiteLanguage = false;
    },
    addSite() {
      this.createShow = true;
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
    // 创建site
    async createSite() {
      if (this.createSiteName == "") {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能为空";
        return;
      }
      if (this.createSiteName.length > 20) {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能超过20个字符，请重新输入";
        return;
      }
      if (this.radio == "") {
        this.errorSiteLanguage = true;
        return;
      }
      let { status } = await dashboardApi.CreateSite(
        this.radio,
        this.createSiteName
      );
      if (status == 200) {
        this.radio = "";
        this.createSiteName = "";
        this.$emit("getSites");
        this.createShow = false;
        this.$notify({
          customClass: "notify-success",
          message: `创建成功`,
          duration: 2000,
          showClose: false
        });
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
  },
  computed: {
    mySiteId() {
      this.siteId = getLocal("ymSd")
        ? getLocal("ymSd")
        : this.$store.state.dashboard.siteId;
      return this.siteId;
    }
  }
};
</script>
<style scoped>
.createSiteNameInput /deep/ .el-input__inner {
  margin-top: 16px;
  /* width: 536px;
  height: 32px; */
  /* background: rgba(255, 255, 255, 1); */
  /* border: 1px solid rgba(229, 229, 229, 1); */
}
.radio /deep/ .is-checked .el-radio__inner {
  background: #00c1de;
  border-color: #00c1de;
}
.radio /deep/ .el-radio {
  margin-right: 17px;
}
.radio /deep/ .el-radio__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
.radio /deep/ .is-checked .el-radio__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
</style>
<style lang="scss" scoped>
.content-section {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    height: 64px;
    padding-left: 25px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 64px;
    border-bottom: 1px solid #e5e5e5;
  }
  .content {
    width: 100%;
    padding: 0 26px;
    .sitelist-wrap {
      width: 100%;
      height: 75px;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      display: flex;
      justify-content: space-between;
      .sitelist {
        width: calc(100% - 100px);
        margin-top: 31px;
        display: inline-block;
        .sitelist-item:first-child {
          border-left: 1px solid rgba(229, 229, 229, 1);
        }
        .sitelist-item {
          display: inline-block;
          height: 45px;
          width: 19%;
          padding: 0 16px;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          color: #262626;
          line-height: 45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          box-sizing: border-box;
          border-top: 1px solid rgba(229, 229, 229, 1);
          border-bottom: 1px solid rgba(229, 229, 229, 1);
          border-right: 1px solid rgba(229, 229, 229, 1);
          background: #fff;
          z-index: 1;
          cursor: pointer;
          &:hover {
            color: #0595e6;
          }
        }
        .sitelist-curitem {
          border-top: 2px solid #0595e6;
          border-bottom: 1px solid transparent;
          color: #0595e6;
        }
      }
      .sitelist-add {
        display: inline-block;
        height: 75px;
        .site-num-wrap {
          display: inline-block;
          vertical-align: top;
          .site-num {
            display: inline-block;
            font-size: 24px;
            font-weight: 500;
            color: rgba(38, 38, 38, 1);
            line-height: 33px;
            margin-top: 27px;
            margin-right: 4px;
          }
          .site-total {
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: rgba(185, 203, 207, 1);
            line-height: 20px;
            margin-top: 36px;
          }
        }
        .sitelist-addSite {
          display: inline-block;
          width: 26px;
          height: 26px;
          background: url("~img/dashboard/board-add.png") no-repeat center;
          background-size: contain;
          vertical-align: top;
          margin-top: 30px;
          margin-left: 28px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    .site-operating {
      width: 100%;
      height: 75px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .site-edit {
        min-width: 350px;
        height: 75px;
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
          font-size: 14px;
          font-weight: 400;
          color: rgba(161, 168, 177, 1);
        }
        .editIcon {
          margin-left: 15px;
          cursor: pointer;
          color: rgba(9, 204, 235, 1);
          padding: 8px;
          background: transparent;
          &:hover {
            background-color: rgba(9, 204, 235, 0.09);
            border-radius: 2px;
          }
        }
      }
      .site-btn {
        .template-btn {
          display: inline-block;
          width: 92px;
          height: 32px;
          background: rgba(9, 204, 235, 1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 32px;
          text-align: center;
          vertical-align: middle;
          &:hover {
            opacity: 0.8;
          }
        }
        .preview-btn {
          display: inline-block;
          width: 92px;
          height: 32px;
          border-radius: 2px;
          border: 1px solid rgba(9, 204, 235, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(9, 204, 235, 1);
          line-height: 32px;
          text-align: center;
          vertical-align: middle;
          margin-right: 16px;
          &:hover {
            opacity: 0.8;
          }
        }
        .design-btn {
          display: inline-block;
          width: 92px;
          height: 32px;
          background: rgba(9, 204, 235, 1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 32px;
          text-align: center;
          vertical-align: middle;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    .site-wrap {
      border-top: 1px solid #e5e5e5;
      height: 200px;
      .site-item:last-of-type {
        border-right: 1px solid transparent;
      }
      .site-item:first-of-type {
        background: rgba(248, 250, 252, 1);
        background-image: url("~img/dashboard/board-siteBackground1.png");
        background-repeat: no-repeat;
        background-position: 80% top;
        background-size: 38%;
        .siteInfo-wrap .siteInfo-item {
          &:hover {
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
          }
        }
      }
      .site-item {
        height: 100%;
        border-right: 1px solid #e5e5e5;
        background-image: url("~img/dashboard/board-siteBackground2.png");
        background-repeat: no-repeat;
        background-position: 80% top;
        background-size: 38%;
        // padding: 0 28px 0 42px;
        .site-title {
          display: inline-block;
          margin-top: 24px;
          margin-left: 42px;
          font-size: 18px;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 25px;
        }
        .siteInfo-wrap {
          margin-top: 24px;
          .siteInfo-item {
            height: 36px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 16px;
            margin-right: 16px;
            padding-left: 26px;
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
                font-size: 14px;
                font-weight: 400;
                color: rgba(161, 168, 177, 1);
                line-height: 20px;
              }
              .siteInfo-domain {
                margin-left: 16px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(5, 149, 230, 1);
                line-height: 20px;
              }
            }
            .siteInfo-right {
              .siteInfo-btn {
                font-size: 14px;
                font-weight: 400;
                color: rgba(5, 149, 230, 1);
                line-height: 20px;
              }
            }
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
    padding: 30px 24px 40px;
    .pannel-head {
      display: flex;
      justify-content: space-between;
      .headTitle {
        font-size: 16px;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 22px;
      }
      .close-pannel {
        line-height: 22px;
        cursor: pointer;
        .iconguanbi {
          padding: 8px;
          background: transparent;
          &:hover {
            background: rgba(240, 243, 247, 1);
            border-radius: 4px;
          }
        }
      }
    }
    .createSiteName {
      margin-top: 20px;
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
      .cancelBtn {
        width: 76px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(9, 204, 235, 1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(9, 204, 235, 1);
        line-height: 40px;
        margin-right: 16px;
        &:hover {
          opacity: 0.8;
        }
      }
      .createBtn {
        width: 76px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
