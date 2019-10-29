<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <el-row class="siteContent" style="padding-bottom:0;padding-top:32px">
        <el-row class="user-list">
          <span class="member-list-title fs14">我的网站</span>
        </el-row>
        <ChangeSite
          @chooseWebsite="chooseWebsite"
          @getSiteId="getSiteId"
          :changeSiteName="siteName"
          :changeSiteLanguage="language"
        />
        <div class="siteWrap">
          <div class="siteImg">
            <img src="~img/siteManage/siteHeader.png" class="itemSiteImageHeader" />
            <div
              class="siteImgBackground"
              :style="{background: 'url(' + ( siteImage ) + ') no-repeat center/cover'}"
            >
              <div class="modal">
                <button class="choseSite" @click="changeTemplate()">更换模版</button>
              </div>
            </div>
          </div>
          <div class="siteinfoWrap">
            <div class="siteinfoItem siteName">
              <span>网站名称：</span>
              <span
                class="siteinfoName"
              >{{siteName && siteName.trim().length > 20 ? siteName.slice(0, 20) + '...' : siteName}}</span>
              <el-popover
                ref="popover"
                placement="bottom"
                width="317"
                trigger="manual"
                v-model="editPopover"
                style="padding:0"
                class="popover"
              >
                <span
                  slot="reference"
                  style="margin-left:0px;vertical-align: middle;"
                  class="hoverBtn"
                  @click="showChangeSitename"
                >
                  <i class="iconfont iconbianji edit"></i>
                </span>
                <div class="textareaWrap">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    placeholder="请输入站点名称"
                    v-model="siteNameValue"
                    maxlength="20"
                    show-word-limit
                    resize="none"
                    @blur="textBulr"
                  ></el-input>
                  <div class="ym-form-item__error" v-show="isNullInput">请输入站点名称</div>
                  <div class="btn-wrap">
                    <button class="cancel" slot="refenrence" @click="cancelInput">取消</button>
                    <button class="save" @click="saveInputValue">保存</button>
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="siteinfoItem">
              <span>网站语言：</span>
              <span class="siteinfoName">{{_getLanguage()}}</span>
              <span @click="showChangeLanguage" class="hoverBtn" style="vertical-align: middle;">
                <i class="iconfont iconbianji edit"></i>
              </span>
            </div>
            <div class="siteinfoItem">
              <span>网站地址：</span>
              <a class="siteinfoDomain" :href="`//${secondDomain}`" target="_blank">{{secondDomain}}</a>
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
          <button class="siteinfoBtn design" @click="toDesign">设计</button>
          <a class="siteinfoBtn prev" :href="`//${secondDomain}`" target="_blank">预览</a>
        </div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">流量统计</div>
        <div style="height:401px"></div>
      </el-row>
      <el-row class="siteContent">
        <div class="mySiteTitle">
          网站信息
          <!-- <div class="edit" style="margin-left:16px" @click="showSiteInfo"></div> -->
        </div>
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
        <div class="mySiteTitle">网站设置</div>
        <div class="siteSettingWrap" style="margin-top:32px">
          <span class="siteSetting">网站icon</span>
          <el-tooltip class="item" effect="dark" content="上传网站icon后，浏览器标签左侧会显示您上传的图片，为保证浏览效果，推荐图片尺寸为256x256像素，大小不超过500KB" placement="top-start">
            <i class="icon iconfont iconicon-exclamationmark"></i>
          </el-tooltip>
          <el-upload
            class="avatar-uploader"
            :action="uploadPicUrl"
            :headers= "headers"
            :show-file-list="false"
            :auto-upload="true"
            ref="uploadIcon"
            :on-success="iconAvatarSuccess"
            :on-error="iconAvatarError"
            :before-upload="iconAvatarUpload">
            <div v-if="!iconUrl" class="iconNo"></div>
            <img v-if="iconUrl" :src="iconUrl" class="iconImg">
            <i v-if="iconUrl" class="icon iconfont mask iconqiehuanxingshiyi"></i>
          </el-upload>
          <i v-if="iconUrl" class="icon iconfont iconshanchu" @click="removeIcon">
          </i>
          <span class="siteSetting showAliService">显示阿里云服务信息</span>
          <el-tooltip class="item" effect="dark" content="关闭显示阿里云服务信息后，网页底部将不再显示“本网站由阿里云提供云计算及安全服务”文字" placement="top-start">
            <i class="icon iconfont iconicon-exclamationmark"></i>
          </el-tooltip>
          <el-switch
            v-model="isShowAliServiceValue"
            active-color="#01C0DE"
            style="margin: -2px 0 0 16px"
          ></el-switch>
        </div>
        <div class="siteSettingWrap">
          <span class="siteSetting">启用Powered by</span>
          <el-tooltip class="item" effect="dark" content="关闭Powered by后，网页底部将不再显示“Powered by CloudDream”文字" placement="top-start">
            <i class="icon iconfont iconicon-exclamationmark"></i>
          </el-tooltip>
          <el-switch @change="isOpenPowered" v-model="isOpenPoweredValue" active-color="#01C0DE" style="margin: -2px 0 0 16px"></el-switch>
          <span class="siteSetting rightClickSave">禁止右键保存图片</span>
          <el-switch
            v-model="isRightClickSaveValue"
            active-color="#01C0DE"
            style="margin: -2px 0 0 16px"
          ></el-switch>
        </div>
      </el-row>
      <el-dialog
        width="0"
        :visible.sync="changeSiteLanguageShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="siteLanguage-right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span class="headTitle">网站语言</span>
            <span class="close-pannel" @click="closeSiteLanguageDialog">
              <i class="iconfont iconguanbi" style="font-size:16px;color:#262626"></i>
            </span>
          </div>
          <div class="tips">为避免网站内容与网站语言不匹配，更换网站语言后，请及时更新控件内容</div>
          <div class="remark">
            <span class="remarkTitle">请选择您的网站语言：</span>
            <el-radio-group v-model="radio" class="radio">
              <el-radio label="zh-CN">中文</el-radio>
              <el-radio label="en-US">英文</el-radio>
              <el-radio label="ja-JP">日语</el-radio>
              <el-radio label="es-ES">西班牙语</el-radio>
              <el-radio label="ko-KR">韩语</el-radio>
            </el-radio-group>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="changeLanguage">确定</button>
            <button class="cancelBtn" @click="closeSiteLanguageDialog">取消</button>
          </div>
        </div>
      </el-dialog>
      <!-- <el-dialog
        width="0"
        :visible.sync="changeSiteInfoShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="siteInfo-right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span class="headTitle">网站信息</span>
            <span class="close-pannel" @click="closeSiteInfoDialog">
              <i class="iconfont iconX" style="font-size:12px;color:#ccc"></i>
            </span>
          </div>
          <div class="siteTypeSelect">
            <span>网站类型：</span>
            <el-select v-model="chosedSiteType" placeholder="请选择站点类型" @change="choseType">
              <el-option
                v-for="item in siteType"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </div>
          <div class="siteFirstIndustrySelect">
            <span>所属行业：</span>
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
          <div class="confirm">
            <button class="confirmBtn" @click="changeInfo">确定</button>
            <button class="cancelBtn" @click="closeSiteInfoDialog">取消</button>
          </div>
        </div>
      </el-dialog>-->
      <SelectTemplateDialog
        ref="selectTemplateDialog"
        :siteId="siteId"
        :isChangeTemplate="isChangeTemplate"
        :siteName="siteName"
        :templateId="templateId"
        @getSiteInfo="getSiteInfo"
      ></SelectTemplateDialog>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import securityService from "@/services/authentication/securityService";
import ChangeSite from "@/components/websiteManage/changeSite";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import * as siteBackupApi from "@/api/request/siteBackupApi";
import * as dashboardApi from "@/api/request/dashboardApi";
import { getLanguage } from "@/configure/appCommon";
import { formatDateTime } from "@/api/index";
import environment from "@/environment/index.js";
import { designerUrl} from "@/environment/index";
export default {
  components: {
    PageSubmenu,
    ChangeSite,
    SelectTemplateDialog
  },
  data() {
    return {
      isChangeTemplate: true,
      siteName: "",
      siteImage: "",
      siteId: 0,
      templateId: 0,
      domain: "",
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
      radio: "zh-CN",
      changeSiteInfoShow: false,
      editPopover: false,
      isNullInput: false,
      iconUrl: '',
      isUpload: true,
      headers: {
          appId: this.$store.state.dashboard.appId,
          Authorization:
            "Bearer " + this.$store.state.user.accessToken.Authorization
        },
      uploadPicUrl: environment.uploadPicUrl + "/0"
    };
  },
  methods: {
    //启用Powered by
    async isOpenPowered(){
      await siteBackupApi.updateSitePoweredBy({siteId: this.siteId,PoweredBy: this.isOpenPoweredValue});
    },
    //删除icon
    async removeIcon(){
      let data = await siteBackupApi.updateSiteIcon({siteId: this.siteId,Icon: ''});
      if(data && data.status == 200) {
          this.iconUrl = '';
            this.$notify({
            customClass: "notify-success",
            message: `删除成功`,
            duration: 1500,
            showClose: false
          });
        } else {
          this.$notify({
            customClass: "notify-error",
            message: `删除失败`,
            duration: 1500,
            showClose: false
          });
        }
    },
    //上传图片成功回调
    async iconAvatarSuccess(res, file){
      if (this.isUpload) {
        let data = await siteBackupApi.updateSiteIcon({siteId: this.siteId,Icon: res});
        if(data && data.status == 200) {
          this.iconUrl = res;
            this.$notify({
            customClass: "notify-success",
            message: `上传成功`,
            duration: 2000,
            showClose: false
          });
        } else {
          this.$notify({
            customClass: "notify-error",
            message: `上传失败`,
            duration: 1500,
            showClose: false
          });
        }
      }
    },
    //上传图片成功回调
    iconAvatarError(){
      this.$notify({
        customClass: "notify-error",
        message: `上传失败`,
        duration: 1500,
        showClose: false
      });
    },
    //上传之前判断
    async iconAvatarUpload(file){
      this.isUpload = true
      let data = await securityService.getUser();
      let token ="";
      if (data && data.access_token){  
        this.headers.Authorization = "Bearer " + data.access_token
      }
      const isJPG = file.type === 'image/png';
      const isLt2M = file.size < 500 * 1024;
      console.log(isJPG)
        if (!isJPG) {
          this.isUpload = false;
          this.$notify({
            customClass: "notify-error",
            message: `上传头像图片只能是 PNG 格式!`,
            duration: 1500,
            showClose: false
          });
        } else if (!isLt2M) {
          this.isUpload = false;
          this.$notify({
            customClass: "notify-error",
            message: `上传头像图片大小不能超过 500KB!`,
            duration: 1500,
            showClose: false
          });
        }
        return false
    },
    // 跳转至设计器
    toDesign() {
      window.location.href = `${designerUrl}?siteId=${this.siteId}`;
    },
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
      this.getSiteInfo(siteId);
    },
    _getLanguage() {
      return getLanguage(this.language);
    },
    // 更换模板
    changeTemplate() {
      this.$refs.selectTemplateDialog.showTemplate();
    },
    // 获取站点信息
    async getSiteInfo(siteId) {
      this.$Loading.show();
      let { data, status } = await siteBackupApi.getSiteInfo(siteId);
      this.$Loading.hide();
      if (status === 200) {
        this.siteName = data.siteName;
        this.siteImage = data.siteImage;
        this.domain = data.domain;
        this.secondDomain = data.secondDomain;
        this.templateId = data.templateId;
        this.iconUrl = data.icon;
        this.isOpenPoweredValue =data.poweredBy
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
          this.chosedSiteType = "";
        }
        await this.choseFirstIndustrySelect();
        if (data.firstIndustryId) {
          await this.choseSecondIndustrySelect(data.firstIndustryId);
        }
      }
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this.getSiteInfo(siteId);
    },
    // 修改网站名称
    showChangeSitename() {
      this.siteNameValue = this.siteName ? this.siteName : "";
      this.editPopover = true;
    },
    // 取消修改
    cancelInput() {
      this.$refs[`popover`].doClose();
      this.siteNameValue = "";
      this.editPopover = false;
      this.isNullInput = false;
    },
    // input失去焦点
    textBulr() {
      if (!this.siteNameValue) {
        this.isNullInput = true;
      } else {
        this.isNullInput = false;
      }
    },
    // 保存siteName
    async saveInputValue() {
      if (!this.siteNameValue) {
        this.isNullInput = true;
        return;
      }
      this.$refs[`popover`].doClose();
      let para = {
        siteId: this.siteId,
        siteName: this.siteNameValue
      };
      await dashboardApi.updateSiteInfo(para);
      this.siteName = this.siteNameValue;
      this.editPopover = false;
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
      let para = {
        siteId: this.siteId,
        language: this.radio
      };
      let { data, status } = await dashboardApi.updateSiteInfo(para);
      if (status == 200) {
        this.language = this.radio;
        this.closeSiteLanguageDialog();
      }
    },
    // 关闭修改网站信息
    closeSiteInfoDialog() {
      this.changeSiteInfoShow = false;
    },
    showSiteInfo() {
      this.changeSiteInfoShow = true;
    },
    async changeInfo() {
      if (!this.chosedSiteType) {
        this.$notify({
          customClass: "notify-error",
          message: `请选择网站类型`,
          duration: 2000,
          showClose: false
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
        this.siteSecondIndustryValue =
          this.secondIndustryId == 0 ? "" : this.secondIndustryId;
      }
    },
    choseSecondIndustry(id) {
      this.secondIndustryId = id;
    },
    // 保存网站信息
    async saveSiteInfo() {
      if (!this.chosedSiteType) {
        this.$notify({
          customClass: "notify-error",
          message: `请选择网站类型`,
          duration: 2000,
          showClose: false
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
      this.$router.push("/website/mysite/sitedomain");
    }
  }
};
</script>
<style scoped>
.popover /deep/ .el-popover__reference {
  outline: none;
}
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
  line-height: 32px;
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
  line-height: 32px;
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
  line-height: 32px;
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
.textareaWrap /deep/ .el-input__count {
  right: 25px;
}
.hoverBtn {
  padding: 8px;
  background: transparent;
  cursor: pointer;
}
.hoverBtn:hover {
  background: rgba(248, 250, 252, 1);
}
</style>
<style lang="scss" scoped>
.member-container {
  background: #fff;
  position: relative;
  .user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 24px;
    .member-list-title {
      border-left: 4px solid #01c0de;
      padding-left: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.avatar-uploader {
  float: left;
  position: relative;
  width: 20px;
  height: 20px;
  margin-left: 16px;
  &:hover .mask {
    display: block;
  }
  cursor: pointer;
  .iconImg {
    display: inline-block;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
  }
  .iconNo {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("~img/icon.png") no-repeat center;
    background-size: contain;
  }
  .iconNo:hover {
    background: url("~img/iconActive.png") no-repeat center;
    background-size: contain;
  }
  .mask {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
    background: rgba(26,26,26,0.4);
    color: #ffffff;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    margin: 0 !important;
  }
}

.mySiteTitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  margin-bottom: 15px;
}
.edit {
  font-size: 16px;
  color: #262626;
}
.siteContent {
  padding: 24px 32px;
  border-bottom: 10px solid #f6f8fa;
}
.siteWrap {
  width: 100%;
  height: 201px;
  position: relative;
  padding-top: 17px;
  background: url("~img/siteManage/mysiteBackground.png");
  background-repeat: no-repeat;
  background-position: 80% center;
  background-size: contain;
  .siteImg {
    position: relative;
    display: inline-block;
    width: 260px;
    margin-left: 32px;
    vertical-align: top;
    .itemSiteImageHeader {
      width: 100%;
    }
    .siteImgBackground {
      margin-top: -2px;
      width: 100%;
      padding-bottom: 62%;
      position: relative;
    }
    .modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    &:hover {
      .modal {
        opacity: 1;
      }
    }
    .choseSite {
      width: 90px;
      height: 40px;
      background: rgba(9, 204, 235, 1);
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      &:hover {
        opacity: 0.8;
      }
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
      font-weight: 400;
      line-height: 20px;
      color: rgba(0, 194, 222, 1);
      &:hover {
        opacity: 0.8;
      }
    }
    .bindDomain {
      width: 90px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(1, 192, 222, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(1, 192, 222, 1);
      line-height: 32px;
      margin-left: 32px;
      &:hover {
        opacity: 0.8;
      }
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
  .siteinfoBtn {
    position: absolute;
    right: 50px;
    width: 110px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(1, 192, 222, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 32px;
    text-align: center;
    color: rgba(1, 192, 222, 1);
  }
  .prev {
    top: 113px;
    &:hover {
      opacity: 0.8;
    }
  }
  .design {
    background: rgba(1, 192, 222, 1);
    color: rgba(255, 255, 255, 1);
    top: 57px;
    &:hover {
      opacity: 0.8;
    }
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
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .siteIndustry {
    display: inline-block;
    margin-top: 37px;
    margin-left: 97px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .saveBtn {
    margin: 0;
    border: none;
    position: absolute;
    bottom: 32px;
    right: 50px;
    width: 110px;
    height: 32px;
    padding: 0;
    background: rgba(1, 192, 222, 1);
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
    &:hover {
      opacity: 0.8;
    }
  }
  .disabled {
    opacity: 0.4;
  }
}

.siteSettingWrap {
  margin-top: 17px;
  height: 20px;
  margin-left: 31px;
  .siteSetting {
    float: left;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  i {
    float: left;
    color: #D8D8D8; 
    font-size: 16px;
    line-height: 20px;
    margin-left: 8px;
  }
  .iconshanchu {
    float: left;
    font-size: 16px;
    line-height: 20px;
    color: #8c8c8c;
    font-weight: 600;
    padding-left: 10px;
    cursor: pointer;
  }
  .el-switch {
    float: left;
  }
  .showAliService {
    margin-left: 310px;
  }
  .rightClickSave {
    margin-left: 184px;
  }
}
//右侧弹框
.siteLanguage-right-pannel {
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
    font-weight: 400;
    color: rgba(255, 69, 29, 1);
    line-height: 36px;
    text-align: center;
    margin: 32px;
    padding: 0 5px;
  }
  .remarkTitle {
    font-size: 14px;
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
.siteInfo-right-pannel {
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
</style>

