<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
        :changeSiteName="siteName"
        :changeSiteLanguage="language"
      />
      <el-row class="siteContent">
        <div class="mySiteTitle" style="margin-top: 9px">我的网站</div>
        <div class="siteWrap">
          <div class="siteImg">
            <img :src="siteImage" alt class="siteImgBackground" />
          </div>
          <div class="siteinfoWrap">
            <div class="siteinfoItem siteName">
              <span>网站名称：</span>
              <span class="siteinfoName">{{siteName}}</span>
              <el-popover
                ref="popover"
                placement="bottom"
                width="317"
                trigger="click"
                style="padding:0"
                @show="showChangeSitename"
              >
                <span slot="reference" style="margin-left:0px">
                  <div class="edit" style="margin-left:0px"></div>
                </span>
                <div class="textareaWrap">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    placeholder="请输入内容"
                    v-model="siteNameValue"
                    maxlength="100"
                    show-word-limit
                    resize="none"
                  ></el-input>
                  <div class="btn-wrap">
                    <button class="cancel" slot="refenrence" @click="cancelInput">取消</button>
                    <button class="save" @click="saveInputValue">保存</button>
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="siteinfoItem">
              <span>网站语言：</span>
              <span>{{_getLanguage()}}</span>
              <div class="edit" @click="showChangeLanguage"></div>
            </div>
            <div class="siteinfoItem">
              <span>网站地址：</span>
              <a class="siteinfoDomain" :href="secondDomain" target="_blank">{{secondDomain}}</a>
            </div>
            <div class="siteinfoItem">
              <span>绑定域名：</span>
              <span :class="{isBind:domain}">{{domain ? domain : "未绑定"}}</span>
              <button class="bindDomain" @click="bindDomain">绑定域名</button>
            </div>
            <div class="siteinfoItem">
              <span>发布时间：</span>
              <span>{{lastPublishedTime ? lastPublishedTime : "未发布"}}</span>
            </div>
          </div>
          <div class="siteinfoBackImg"></div>
          <button class="siteinfoBtn release">发布</button>
          <button class="siteinfoBtn prev">预览</button>
          <button class="siteinfoBtn design" @click="toDesign">设计</button>
        </div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">网站信息</div>
        <div class="siteTypeWrap">
          <div class="siteType">网站类型</div>
          <div class="siteTypeSelect">
            <el-select v-model="chosedSiteType" placeholder="请选择站点类型" @change="choseType">
              <el-option
                v-for="item in siteType"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </div>
          <div class="siteIndustry">所属行业</div>
          <div class="siteFirstIndustrySelect">
            <el-select
              v-model="siteFirstIndustryValue"
              placeholder="一级行业"
              @change="choseFirstIndustry"
            >
              <el-option
                v-for="item in siteFirstIndustry"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="siteSecondIndustrySelect">
            <el-select
              v-model="siteSecondIndustryValue"
              placeholder="二级行业"
              @change="choseSecondIndustry"
            >
              <el-option
                v-for="item in siteSecondIndustry"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <el-button
            class="saveBtn"
            @click="saveSiteInfo"
            :disabled="chosedSiteType == '' || siteFirstIndustryValue == '' || siteSecondIndustryValue == ''"
            :class="{disabled:chosedSiteType == '' || siteFirstIndustryValue == '' || siteSecondIndustryValue == ''}"
          >保存</el-button>
        </div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">流量统计</div>
        <div style="height:401px"></div>
      </el-row>
      <el-row style="padding:23px">
        <div class="mySiteTitle">网站设置</div>
        <div class="siteSettingWrap" style="margin-top:32px">
          <span class="siteSetting">网站icon</span>
          <span class="siteSetting showAliService">显示阿里云服务信息</span>
          <el-switch
            v-model="isShowAliServiceValue"
            active-color="#01C0DE"
            style="margin-left:16px"
          ></el-switch>
        </div>
        <div class="siteSettingWrap">
          <span class="siteSetting">启用Powered by</span>
          <el-switch v-model="isOpenPoweredValue" active-color="#01C0DE" style="margin-left:38px"></el-switch>
          <span class="siteSetting rightClickSave">禁止右键保存图片</span>
          <el-switch
            v-model="isRightClickSaveValue"
            active-color="#01C0DE"
            style="margin-left:16px"
          ></el-switch>
        </div>
      </el-row>
      <el-dialog
        width="0"
        :visible.sync="changeSiteLanguageShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span class="headTitle">网站语言</span>
            <span class="close-pannel" @click="closeSiteLanguageDialog">X</span>
          </div>
          <div class="tips">为避免网站内容与网站语言不匹配，更换网站语言后，请及时更新控件内容</div>
          <div class="remark">
            <span class="remarkTitle">请选择您的网站语言：</span>
            <el-radio-group v-model="radio" class="radio">
              <el-radio label="zh-CN">简体中文</el-radio>
              <el-radio label="en-US">English</el-radio>
              <el-radio label="ja-JP">日本语</el-radio>
              <el-radio label="es-ES">Español</el-radio>
              <el-radio label="ko-KR">한국어</el-radio>
            </el-radio-group>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="changeLanguage">确定</button>
            <button class="cancelBtn" @click="closeSiteLanguageDialog">取消</button>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import * as siteBackupApi from "@/api/request/siteBackupApi";
import * as dashboardApi from "@/api/request/dashboardApi";
import { getLanguage } from "@/configure/appCommon";
import { formatDateTime } from "@/api/index";
import { designerUrl } from "@/environment/index";
// import SiteDomain from "@/components/websiteManage/siteDomain.vue";
export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      siteName: "",
      siteImage: "",
      siteId: 0,
      domain: "",
      themeColor: "",
      themeFont: "",
      secondDomain: "",
      lastPublishedTime: "",
      language: "",
      siteType: [
        {
          value: "1",
          label: "个人"
        },
        {
          value: "2",
          label: "网站"
        }
      ],
      chosedSiteType: "",
      siteFirstIndustryValue: "",
      siteFirstIndustry: [],
      firstIndustryId: 0,
      siteSecondIndustryValue: "",
      siteSecondIndustry: [],
      secondIndustryId: 0,
      isShowAliServiceValue: false,
      isOpenPoweredValue: false,
      isRightClickSaveValue: false,
      siteNameValue: "",
      changeSiteLanguageShow: false,
      remarkInfo: "",
      radio: "简体中文"
    };
  },
  methods: {
    // 跳转至设计器
    toDesign() {
      window.location.href = `${designerUrl}?siteId=${this.siteId}&themeColor=${this.themeColor}&themeFont=${this.themeFont}`;
    },
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
      this.getSiteInfo(siteId);
    },
    _getLanguage() {
      return getLanguage(this.language);
    },
    // 获取站点信息
    async getSiteInfo(siteId) {
      let { data, status } = await siteBackupApi.getSiteInfo(siteId);
      if (status === 200) {
        this.siteName = data.siteName;
        this.siteImage = data.siteImage;
        this.themeColor = data.theme;
        this.themeFont = data.font;
        this.domain = data.domain;
        this.secondDomain = data.secondDomain;
        this.lastPublishedTime = formatDateTime(
          data.lastPublishedTime,
          "yyyy-MM-dd hh:mm"
        );
        this.siteId = data.siteId;
        this.language = data.language;
        this.firstIndustryId = data.firstIndustryId;
        this.secondIndustryId = data.secondIndustryId;
        if (data.siteType) {
          this.chosedSiteType = data.siteType;
        } else {
          this.chosedSiteType = null;
        }
        await this.choseFirstIndustrySelect();
        if (data.firstIndustryId) {
          await this.choseSecondIndustrySelect(data.firstIndustryId);
        }
      }
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      console.log(siteId);
      this.getSiteInfo(siteId);
    },
    // 切换网站名称
    showChangeSitename() {
      this.siteNameValue = this.siteName ? this.siteName : "";
    },
    cancelInput() {
      this.$refs[`popover`].doClose();
      this.siteNameValue = "";
    },
    async saveInputValue() {
      if (!this.siteNameValue) {
        this.$notify({
          customClass: "notify-error",
          message: `请输入站点名称`,
          duration: 2000,
          showClose: false
        });
        return;
      }
      this.$refs[`popover`].doClose();
      console.log("siteid:", this.siteId);
      await dashboardApi.updateSiteName(this.siteId, this.siteNameValue);
      this.siteName = this.siteNameValue;
    },
    // 关闭选择网站语言弹窗
    closeSiteLanguageDialog() {
      // this.radio = this.language;
      this.changeSiteLanguageShow = false;
    },
    //  切换网站语言
    showChangeLanguage() {
      this.changeSiteLanguageShow = true;
      this.radio = this.language;
    },
    async changeLanguage() {
      let { data, status } = await dashboardApi.updateSiteLanguage(
        this.siteId,
        this.radio
      );
      if (status == 200) {
        this.language = this.radio;
        this.closeSiteLanguageDialog();
      }
    },
    // 选择网站类型
    choseType(value) {
      this.chosedSiteType = value;
    },
    // 选择一级行业菜单
    async choseFirstIndustrySelect() {
      let { data } = await dashboardApi.GetFirstIndustries();
      this.siteFirstIndustry = data;
      this.siteFirstIndustryValue =
        this.firstIndustryId == 0 ? "" : this.firstIndustryId;
      this.siteSecondIndustryValue =
        this.secondIndustryId == 0 ? "" : this.secondIndustryId;
    },
    choseFirstIndustry(id) {
      this.firstIndustryId = id;
      this.secondIndustryId = "";
      this.choseSecondIndustrySelect(this.firstIndustryId);
    },
    // 选择二级行业菜单
    async choseSecondIndustrySelect(firstIndustryId) {
      if (firstIndustryId != 0) {
        let { data } = await dashboardApi.GetSecondIndustries(firstIndustryId);
        this.siteSecondIndustry = data;
        this.siteSecondIndustryValue = this.secondIndustryId;
      }
    },
    choseSecondIndustry(id) {
      this.secondIndustryId = id;
    },
    // 保存网站信息
    async saveSiteInfo() {
      if (!this.chosedSiteType) {
        this.$message({
          type: "failed",
          message: "请选择网站类型"
        });
        return;
      }
      if (this.secondIndustryId == "" || this.secondIndustryId == 0) {
        this.$notify({
          customClass: "notify-error",
          message: `请选择所属行业`,
          duration: 2000,
          showClose: false
        });
        return;
      }
      let { data, status } = await dashboardApi.updateSiteTypeAndIndustry(
        this.siteId,
        this.chosedSiteType,
        this.firstIndustryId,
        this.secondIndustryId
      );
      if (status === 200) {
        this.$notify({
          customClass: "notify-success",
          message: `保存成功`,
          duration: 2000,
          showClose: false
        });
      }
    },
    bindDomain() {
      this.$router.push("/website/sitedomain");
    }
  }
};
</script>
<style scoped>
.siteTypeSelect {
  display: inline-block;
  margin-left: 24px;
}
.siteTypeSelect /deep/ .el-input__inner {
  width: 225px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(229, 229, 229, 1);
}
.siteTypeSelect /deep/ .el-input__icon {
  line-height: 32px;
}
.siteFirstIndustrySelect {
  display: inline-block;
  margin-left: 24px;
}
.siteFirstIndustrySelect /deep/ .el-input__inner {
  width: 225px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(229, 229, 229, 1);
}
.siteFirstIndustrySelect /deep/ .el-input__icon {
  line-height: 32px;
}
.siteSecondIndustrySelect {
  display: inline-block;
  margin-left: 24px;
}
.siteSecondIndustrySelect /deep/ .el-input__inner {
  width: 225px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(229, 229, 229, 1);
}
.siteSecondIndustrySelect /deep/ .el-input__icon {
  line-height: 32px;
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
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 20px;
}
.radio /deep/ .is-checked .el-radio__label {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
</style>
<style lang="scss" scoped>
.member-content {
  background: #fff;
}
.mySiteTitle {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  margin-bottom: 15px;
}
.edit {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("~img/siteManage/mysite-edit.png") no-repeat center;
  background-size: contain;
  vertical-align: middle;
  margin-left: 20px;
}
.siteContent {
  padding: 23px;
  border-bottom: 10px solid #f6f8fa;
}
.siteWrap {
  width: 100%;
  height: 201px;
  position: relative;
  padding-top: 32px;
  .siteImg {
    display: inline-block;
    width: 260px;
    height: 170px;
    margin-left: 32px;
    vertical-align: top;
    .siteImgBackground {
      width: 100%;
      height: 100%;
    }
  }
  .siteinfoWrap {
    display: inline-block;
    margin-left: 24px;
    // height: 233px;
  }
  .siteinfoItem {
    // margin-left: 339px;
    // position: absolute;
    margin-top: 16px;
    span {
      margin-left: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 20px;
      color: rgba(140, 140, 140, 1);
    }
    .siteinfoName {
      color: rgba(38, 38, 38, 1);
    }
    .siteinfoDomain {
      margin-left: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 20px;
      color: rgba(0, 194, 222, 1);
    }
    .bindDomain {
      width: 90px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      line-height: 32px;
      margin-left: 32px;
    }
    .isBind {
      color: #00c2de;
    }
  }
  .siteinfoItem:nth-child(4) {
    margin-top: 10px;
  }
  .siteinfoItem:last-child {
    margin-top: 10px;
  }
  .siteinfoBackImg {
    // display: inline-block;
    // width: 956px;
    // background: url("~img/siteManage/mysiteBackground.png") no-repeat center;
    // background-size: 100%;
  }
  .siteinfoBtn {
    position: absolute;
    right: 50px;
    width: 110px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(1, 192, 222, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(1, 192, 222, 1);
  }
  .release {
    top: 48px;
  }
  .prev {
    top: 100px;
  }
  .design {
    background: rgba(1, 192, 222, 1);
    color: rgba(255, 255, 255, 1);
    top: 153px;
  }
}
.siteTypeWrap {
  position: relative;
  .siteType {
    display: inline-block;
    margin-top: 37px;
    margin-left: 29px;
    margin-bottom: 37px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .siteIndustry {
    display: inline-block;
    margin-top: 37px;
    margin-left: 97px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .saveBtn {
    position: absolute;
    bottom: 32px;
    right: 50px;
    width: 110px;
    height: 32px;
    padding: 0;
    background: rgba(1, 192, 222, 1);
    border-radius: 2px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
  }
  .disabled {
    opacity: 0.4;
  }
}

.siteSettingWrap {
  margin-top: 17px;
  margin-left: 31px;
  .siteSetting {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .showAliService {
    margin-left: 310px;
  }
  .rightClickSave {
    margin-left: 184px;
  }
}
//右侧弹框
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .pannel-head {
    height: 55px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    .headTitle {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 55px;
    }
    span {
      padding: 0 16px;
    }
    .close-pannel {
      line-height: 55px;
      float: right;
      cursor: pointer;
    }
  }
  .tips {
    width: 406px;
    height: 36px;
    background: rgba(253, 240, 237, 1);
    border: 1px solid rgba(253, 171, 153, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 69, 29, 1);
    line-height: 36px;
    text-align: center;
    margin: 32px;
    padding: 0 5px;
  }
  .remarkTitle {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 22px;
    margin-left: 32px;
  }
  .radio {
    margin-top: 30px;
    margin-left: 32px;
    margin-right: 32px;
  }
  .confirm {
    position: absolute;
    width: 470px;
    height: 80px;
    bottom: 0px;
    border-top: 1px solid #efefef;
    .confirmBtn {
      margin: 24px;
      width: 90px;
      height: 32px;
      background: rgba(1, 192, 222, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
    .cancelBtn {
      margin-top: 24px;
      width: 90px;
      height: 32px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      line-height: 32px;
    }
  }
}
// 修改siteName
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
</style>

