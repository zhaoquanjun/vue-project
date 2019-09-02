<template>
  <el-container class="templateManage page-scroll">
    <el-header class="templateTitle" style="height:86px">
      <span class="titleText">整站模版</span>
      <button class="createBtn" @click="createTemplatedialogShow">开通整站模版</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="contentHeader">
        <div>
          <el-select
            v-model="searchValue"
            placeholder="请选择"
            class="selectSearchValue borderColor"
            @change="changeSearchType"
          >
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="search" placeholder="请输入搜索内容" class="searchInput borderColor"></el-input>
          <el-select
            v-model="firstIndustrySelect"
            placeholder="一级行业"
            class="firstIndustrySelect borderColor"
            @change="choseFirstIndustry"
          >
            <el-option
              v-for="item in firstIndustryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="line"></span>
          <el-select
            v-model="secondIndustrySelect"
            placeholder="二级行业"
            class="secondIndustrySelect borderColor"
          >
            <el-option
              v-for="item in secondIndustryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="languageSelect" placeholder="语言" class="languageSelect borderColor">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="themeSelect" placeholder="主题" class="themeSelect borderColor">
            <el-option
              v-for="item in themeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="templateStatus" placeholder="模版状态" class="templateStatus borderColor">
            <el-option
              v-for="item in templateStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-checkbox v-model="isRecommend" class="isRecommend">仅推荐</el-checkbox>
          <button class="inquire" @click="searchTemplate">查询</button>
        </div>
        <div style="margin-top:24px;margin-bottom:24px;">
          <span>排序</span>
          <el-select v-model="sort" placeholder="请选择" class="sort borderColor">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>
            <i
              class="iconfont iconshang"
              style="margin-left:32px;cursor: pointer;"
              :class="{blue:!isDescSort,black:isDescSort}"
              @click="asc"
            ></i>
          </span>
          <span>
            <i
              class="iconfont iconxia"
              style="margin-left:8px;cursor: pointer;"
              :class="{blue:isDescSort,black:!isDescSort}"
              @click="desc"
            ></i>
          </span>
        </div>
      </div>
      <el-main>
        <div class="table-list" id="table-list">
          <el-table
            ref="multipleTable"
            :data="templateInfo"
            tooltip-effect="dark"
            :row-style="{height:'200px'}"
          >
            <el-table-column prop="siteName" label="缩略图" width="250">
              <template slot-scope="scope">
                <div class="siteImg">
                  <img
                    :src="scope.row.imageUrl"
                    alt
                    style="width:100%;height:100%;object-fit: cover;"
                    :href="`//${scope.row.domain}`"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模板名称|语言">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.templateName}}</p>
                  <p
                    class="templateName"
                    style="margin-top:8px;"
                  >{{_getLanguage(scope.row.language)}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模版行业">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.firstIndustry}}</p>
                  <p class="templateName" style="margin:8px 0;">{{scope.row.secondIndustry}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="开通时间|更新时间">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{(scope.row.myCreateTime)}}</p>
                  <p
                    class="templateName"
                    style="margin-top:5px;"
                  >{{scope.row.myUpdateTime ? scope.row.myUpdateTime : ""}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="useCount" label="使用量" width="100"></el-table-column>
            <el-table-column label="设计师">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.designerPhone}}</p>
                  <p class="templateName" style="margin-top:5px;">{{scope.row.remark}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模板状态">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{getTemplateStatus(scope.row.status)}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <div class="handle-btn-wrap">
                  <el-button
                    class="handle-btn"
                    @click="settingTemplate( scope )"
                    :disabled="scope.row.status == 3 || scope.row.status == 1 ? false : true"
                    :class="{disable : scope.row.status == 3 || scope.row.status == 1 ? false : true}"
                  >设置</el-button>
                  <el-button
                    class="handle-btn"
                    style="margin-left:32px"
                    @click="updateTemplate( scope )"
                    :disabled="scope.row.status == 3 || scope.row.status == 1 ? false : true"
                    :class="{disable : scope.row.status == 3 || scope.row.status == 1 ? false : true}"
                  >更新</el-button>
                  <a
                    class="handle-btn"
                    style="margin-left:32px"
                    :href="`//${scope.row.domain}`"
                    target="_blank"
                    :class="{disable : scope.row.status == 3 || scope.row.status == 1 ? false : true}"
                  >预览</a>
                  <el-button
                    class="handle-btn"
                    style="margin-left:32px"
                    @click="deleteTemplate( scope )"
                    :disabled="scope.row.status == 3 || scope.row.status == 1 ? false : true"
                    :class="{disable : scope.row.status == 3 || scope.row.status == 1 ? false : true}"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageing" id="pageing" style="margin-bottom:20px">
          <el-pagination
            v-show="templatePage.totalCount > 10"
            background
            layout="total, slot, sizes, prev, pager, next"
            :current-page="templatePage.pageIndex"
            :total="templatePage.totalCount"
            :page-count="templatePage.totalPages"
            :page-size="templatePage.pageSize"
            :page-sizes="[10,20,50]"
            @current-change="changePage"
            @size-change="changeSize"
          ></el-pagination>
        </div>
      </el-main>
      <el-dialog
        width="0"
        :visible.sync="createTemplateShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span>
              <span>开通整站模版</span>
            </span>
            <span class="close-pannel" @click="cancelCreateTemplate">
              <i class="iconfont iconX" style="font-size:14px;color:#ccc"></i>
            </span>
          </div>
          <div class="tips">为保证设计师可正常登录系统，请填写真实的手机号</div>
          <div class="phoneWrap">
            <div class="phoneTitle">设计师手机号</div>
            <el-input v-model="phone" placeholder="请输入手机号" class="phoneInput" @blur="blurPhone" :maxlength="11"></el-input>
            <div class="ym-form-item__error" v-show="errorTip">{{errorPhone}}</div>
          </div>
          <div class="remarkWrap">
            <span class="remarkTitle">备注</span>
            <el-input v-model="remark" placeholder="请输入备注信息" class="remarkInput" maxlength="20"></el-input>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="createTemplate">开通</button>
            <button class="cancelBtn" @click="cancelCreateTemplate">取消</button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        width="0"
        :visible.sync="settingTemplateShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span>
              <span>整站模版设置</span>
            </span>
            <span class="close-pannel" @click="cancelSettingTemplate">
              <i class="iconfont iconX" style="font-size:14px;color:#ccc"></i>
            </span>
          </div>
          <div class="settingTemplateWrap">
            <div class="templateName">模版名称</div>
            <el-input
              v-model="settingTemplateName"
              placeholder="请输入模版名称"
              class="templateNameInput"
              @blur="blurTemplateName"
            ></el-input>
            <div class="ym-form-item__error" v-show="errorTemplateNameTips">{{errorTemplateName}}</div>
          </div>
          <div class="settingStatusWrap">
            <div class="settingStatus">模版状态</div>
            <div>
              <el-select
                v-model="settingTemplateStatus"
                placeholder="模版状态"
                class="settingStatusSelect"
              >
                <el-option
                  v-for="item in settingTemplateStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span>
                <span style="margin-left:24px;color:rgba(140,140,140,1);">设为推荐</span>
                <el-checkbox v-model="settingChecked" style="margin-left:16px"></el-checkbox>
              </span>
            </div>
          </div>
          <div class="imgWrap">
            <div class="imgTitle">缩略图</div>
            <el-upload
              class="avatar-uploader"
              :action="uploadPicAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
            >
              <img v-if="picUrl" :src="picUrl" class="avatar" />
              <img v-else src="~img/siteTemplate/defaultImg.png" class="avatar" />
              <button class="upload-btn">{{ !!picUrl ?'重新上传':'上传图片'}}</button>
            </el-upload>
            <el-upload
              class="avatar-mobile-uploader"
              :action="uploadPicActionMobile"
              :show-file-list="false"
              :on-success="handleAvatarSuccessMobile"
              :before-upload="beforeAvatarUploadMobile"
              :headers="headersMobile"
            >
              <img v-if="picUrlMobile" :src="picUrlMobile" class="avatar-mobile" />
              <img v-else src="~img/siteTemplate/defaultMobileImg.png" class="avatar-mobile" />
              <button class="upload-mobile-btn">{{ !!picUrlMobile ?'重新上传':'上传图片'}}</button>
            </el-upload>
          </div>
          <div style="margin-top:212px">
            <span class="tipTypeText" style="margin-left:149px">PC端</span>
            <span class="tipTypeText" style="margin-left:164px">Mobile端</span>
          </div>
          <div style="margin-top:8px">
            <span class="tipInfoText" style="margin-left:102px">推荐尺寸655×380px</span>
            <span class="tipInfoText" style="margin-left:79px">推荐尺寸148×236px</span>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="saveSettingTemplate">确定</button>
            <button class="cancelBtn" @click="cancelSettingTemplate">取消</button>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/templateApi";
import { getLanguage, formatDateTime } from "@/utlis/index";
import environment from "@/environment/index.js";

export default {
  data() {
    return {
      picUrl: "",
      uploadPicAction: `${environment.uploadPicUrl}/-1`,
      headers: {
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        Authorization: ""
      },
      picUrlMobile: "",
      uploadPicActionMobile: `${environment.uploadPicUrl}/-1`,
      headersMobile: {
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        Authorization: ""
      },
      createTemplateShow: false,
      phone: "",
      remark: "",
      errorTip: false,
      errorPhone: "",
      searchValue: "templateName",
      searchOptions: [
        {
          value: "templateName",
          label: "模版名称"
        },
        {
          value: "secondDomaon",
          label: "二级域名"
        },
        {
          value: "designer",
          label: "设计师"
        }
      ],
      search: "",
      firstIndustryOptions: [],
      firstIndustrySelect: "",
      secondIndustryOptions: [],
      secondIndustrySelect: "",
      languageOptions: [
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en-US",
          label: "英文"
        },
        {
          value: "ja-JP",
          label: "日语"
        },
        {
          value: "es-ES",
          label: "西班牙语"
        },
        {
          value: "ko-KR",
          label: "韩语"
        }
      ],
      languageSelect: "zh-CN",
      themeOptions: [],
      themeSelect: "",
      templateStatusOptions: [
        {
          value: 0,
          label: "开通中"
        },
        {
          value: 2,
          label: "开通失败"
        },
        {
          value: 1,
          label: "上架"
        },
        {
          value: 3,
          label: "下架"
        }
      ],
      templateStatus: "",
      isRecommend: false,
      sortOptions: [
        {
          value: "createTime",
          label: "按开通时间"
        },
        {
          value: "updateTime",
          label: "按更新时间"
        },
        {
          value: "useCount",
          label: "使用量"
        }
      ],
      sort: "createTime",
      isDescSort: true,
      templatePage: {},
      templateInfo: [],
      settingTemplateShow: false,
      settingChecked: false,
      settingTemplateName: "",
      errorTemplateNameTips: "",
      errorTemplateName: "",
      settingTemplateStatusOptions: [
        {
          value: 1,
          label: "上架"
        },
        {
          value: 3,
          label: "下架"
        }
      ],
      settingTemplateStatus: "",
      curTemplateId: 0,
      curSiteId: 0,
      pageIndex: 1,
      pageSize: 10
    };
  },
  components: {},
  mounted() {
    this.getTemplateList();
    this.getFirstIndustry();
  },
  methods: {
    getTemplateStatus(status) {
      switch (status) {
        case 0:
          return "开通中";
        case 2:
          return "开通失败";
        case 1:
          return "上架";
        case 3:
          return "下架";
      }
    },
    handleAvatarSuccess(res, file) {
      this.picUrl = file.response;
    },
    beforeAvatarUpload(file) {
      this.headers.Authorization =
        "Bearer " + this.$store.state.user.accessToken.Authorization;
      console.log(this.$store.state.dashboard);
      this.headers.appId = this.$store.state.dashboard.appId;

      const isPic =
        ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !== -1;
      const maxMb = 10;
      const isSizeOk = file.size / 1024 / 1024 < maxMb;

      if (!isPic) {
        this.$notify({
          customClass: "notify-error",
          message: `格式错误`,
          duration: 2000,
          showClose: false
        });
        return false;
      }
      if (!isSizeOk) {
        this.$notify({
          customClass: "notify-error",
          message: `请上传小于${maxMb}M的图片!`,
          duration: 2000,
          showClose: false
        });
        return false;
      }
      return isPic && isSizeOk;
    },
    handleAvatarSuccessMobile(res, file) {
      this.picUrlMobile = file.response;
    },
    beforeAvatarUploadMobile(file) {
      this.headersMobile.Authorization =
        "Bearer " + this.$store.state.user.accessToken.Authorization;
      console.log(this.$store.state.dashboard);
      this.headersMobile.appId = this.$store.state.dashboard.appId;

      const isPic =
        ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !== -1;
      const maxMb = 10;
      const isSizeOk = file.size / 1024 / 1024 < maxMb;

      if (!isPic) {
        this.$notify({
          customClass: "notify-error",
          message: `格式错误`,
          duration: 2000,
          showClose: false
        });
        return false;
      }
      if (!isSizeOk) {
        this.$notify({
          customClass: "notify-error",
          message: `请上传小于${maxMb}M的图片!`,
          duration: 2000,
          showClose: false
        });
        return false;
      }
      return isPic && isSizeOk;
    },
    //清除开通窗口输入框的值
    clearOpenDialog() {
      this.phone = "";
      this.remark = "";
      this.errorTip = false;
      this.errorPhone = "";
    },
    //   获取模版列表
    async getTemplateList() {
      const loading = this.$loading({
        lock: true,
        spinner: "loading-icon",
        background: "rgba(255, 255, 255, 0.75)"
      });
      let para = {
        TemplateName: "",
        Domain: "",
        DesignerPhone: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        Language: "",
        SiteTheme: "",
        IsOnlyRecommend: false,
        Status: "All",
        TemplateType: "SiteTemplate",
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByOpenTime: true,
        IsOrderByUseCount: false,
        IsOrderByUpdateTime: false,
        IsOrderByDesc: true
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      if (status == 200) {
        console.log(data);
        this.templatePage = data;
        this.templateInfo = data.items;
        this.formatTime();
        loading.close();
      }
    },
    // 获取一级行业
    async getFirstIndustry() {
      let { data, status } = await templateApi.getFirstIndustries();
      this.firstIndustryOptions = data;
    },

    async choseFirstIndustry(id) {
      console.log(id);
      console.log(this.firstIndustrySelect);
      let { data, status } = await templateApi.getSecondIndustries(id);
      this.secondIndustryOptions = data;
    },
    // 升序
    asc() {
      this.isDescSort = false;
      this.searchTemplate();
    },
    // 降序
    desc() {
      this.isDescSort = true;
      this.searchTemplate();
    },
    // 开通模版
    createTemplatedialogShow() {
      this.clearOpenDialog();
      this.createTemplateShow = true;
    },
    cancelCreateTemplate() {
      this.createTemplateShow = false;
    },
    async createTemplate() {
      if (this.phone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入设计师手机号";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
      } else {
        let { status } = await templateApi.createTemplate(
          this.phone,
          this.remark
        );
        this.createTemplateShow = false;
        const loading = this.$loading({
          lock: true,
          text: "正在开通模版",
          spinner: "copy-icon",
          customClass: "createTemplateLoading",
          background: "rgba(38,38,38,0.7)"
        });
        if (status == 200) {
          loading.close();
          this.$notify({
            customClass: "notify-success",
            message: `开通成功`,
            duration: 2000,
            showClose: false
          });
          this.searchTemplate();
        } else {
          this.$notify({
            customClass: "notify-error",
            message: `开通失败`,
            duration: 2000,
            showClose: false
          });
        }
      }
    },
    blurPhone() {
      if (this.phone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入设计师手机号";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
      } else {
        this.errorTip = false;
        this.errorPhone = "";
      }
    },
    blurTemplateName() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
        this.errorTemplateName = "请输入模版名称";
      } else if (!/^.{1,100}$/.test(this.settingTemplateName)) {
        this.errorTemplateNameTips = true;
        this.errorTemplateName = "模版名称最大长度为100个字符";
      } else {
        this.errorTemplateNameTips = false;
        this.errorTemplateName = "";
      }
    },
    // 切换搜索类型 模版/二级域名/设计师
    changeSearchType() {
      this.search = "";
    },
    // 查询
    async searchTemplate() {
      let templateNameText = "";
      let domainText = "";
      let designerPhoneText = "";
      if (this.searchValue == "templateName") {
        templateNameText = this.search;
      } else if (this.searchValue == "secondDomaon") {
        domainText = this.search;
      } else if (this.searchValue == "designer") {
        designerPhoneText = this.search;
      }
      let orderByOpenTime = false;
      let orderByUseCount = false;
      let orderByUpdateTime = false;
      if (this.sort == "createTime") {
        orderByOpenTime = true;
      } else if (this.sort == "updateTime") {
        orderByUpdateTime = true;
      } else if (this.sort == "useCount") {
        orderByUseCount = true;
      }
      let para = {
        TemplateName: templateNameText,
        Domain: domainText,
        DesignerPhone: designerPhoneText,
        FirstIndustry: this.firstIndustrySelect ? this.firstIndustrySelect : 0,
        SecondIndustry: this.secondIndustrySelect
          ? this.secondIndustrySelect
          : 0,
        Language: this.languageSelect,
        SiteTheme: "",
        IsOnlyRecommend: this.isRecommend,
        Status: this.templateStatus === "" ? "All" : this.templateStatus,
        TemplateType: "SiteTemplate",
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByOpenTime: orderByOpenTime,
        IsOrderByUseCount: orderByUseCount,
        IsOrderByUpdateTime: orderByUpdateTime,
        IsOrderByDesc: this.isDescSort
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
      this.formatTime();
    },
    changePage(page) {
      this.pageIndex = page;
      this.searchTemplate();
    },
    changeSize(page) {
      this.pageSize = page;
      this.searchTemplate();
    },
    // 设置模版弹窗
    async settingTemplate(scope) {
      this.curTemplateId = scope.row.id;
      this.curSiteId = scope.row.siteId;
      this.settingTemplateShow = true;
      let { data } = await templateApi.getSiteTemplate(scope.row.id);
      this.settingTemplateName = data.templateName;
      this.settingTemplateStatus = data.status;
      this.settingChecked = data.isRecommend;
      this.picUrl = data.imageUrl;
      this.picUrlMobile = data.mobileImageUrl;
    },
    // 保存设置模版
    async saveSettingTemplate() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
        this.errorTemplateName = "请输入模版名称";
      } else if (!/^.{1,100}$/.test(this.settingTemplateName)) {
        this.errorTemplateNameTips = true;
        this.errorTemplateName = "模版名称最大长度为100个字符";
      } else {
        this.errorTemplateNameTips = false;
        this.errorTemplateName = "";
        let para = {
          siteId: this.curSiteId,
          tempalteId: this.curTemplateId,
          templateName: this.settingTemplateName,
          imageUrl: this.picUrl,
          mobileImageUrl: this.picUrlMobile,
          templateType: "SiteTemplate",
          isRecommend: this.settingChecked,
          status:
            this.settingTemplateStatus === "" ? "" : this.settingTemplateStatus
        };
        let { data, status } = await templateApi.saveSiteTemplate(para);
        this.settingTemplateShow = false;
        if (status == 200) {
          this.$notify({
            customClass: "notify-success",
            message: `保存成功`,
            duration: 2000,
            showClose: false
          });
          this.searchTemplate();
        }
      }
    },
    cancelSettingTemplate() {
      this.settingTemplateName = "";
      this.errorTemplateNameTips = false;
      this.errorTemplateName = "";
      this.picUrl = "";
      this.picUrlMobile = "";
      this.settingChecked = false;
      this.settingTemplateStatus = "";
      this.settingTemplateShow = false;
    },
    // 更新模版
    updateTemplate(scope) {
      this.$confirm(`确定要更新模版吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { status } = await templateApi.uploadSiteTemplate(scope.row.id);
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `模版更新成功`,
                duration: 2000,
                showClose: false
              });
              this.searchTemplate();
            } else {
              this.$notify({
                customClass: "notify-error",
                message: "系统正忙，请稍后再试！",
                duration: 2000,
                showClose: false
              });
            }
          }
        }
      });
    },
    // 删除模版
    deleteTemplate(scope) {
      this.$confirm(`确定删除该模版吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { status } = await templateApi.deleteTemplate(scope.row.id);
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `模版删除成功`,
                duration: 2000,
                showClose: false
              });
              this.searchTemplate();
            } else {
              this.$notify({
                customClass: "notify-error",
                message: "系统正忙，请稍后再试！",
                duration: 2000,
                showClose: false
              });
            }
          }
        }
      });
    },
    // 格式化时间
    formatTime() {
      for (let i = 0; i < this.templateInfo.length; i++) {
        this.templateInfo[i].myCreateTime = formatDateTime(
          this.templateInfo[i].createTime,
          "yyyy/MM/dd hh:mm"
        );
        if (this.templateInfo[i].updateTime) {
          this.templateInfo[i].myUpdateTime = formatDateTime(
            this.templateInfo[i].updateTime,
            "yyyy/MM/dd hh:mm"
          );
        }
      }
    },
    // 语言转换
    _getLanguage(language) {
      return getLanguage(language);
    }
  }
};
</script>
<style>
.createTemplateLoading .el-loading-spinner {
  margin-top: 0 !important;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: #fff;
  border-radius: 4px;
}
.createTemplateLoading .el-loading-spinner .el-loading-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
</style>
<style scoped>
.phoneInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.remarkInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.templateNameInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.borderColor /deep/ input {
  border: 1px solid rgba(185, 203, 207, 1);
}
/* .searchInput /deep/ input {
  border-left-color: transparent;
} */
.isRecommend /deep/ .el-checkbox__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
#table-list /deep/ .el-table thead th:nth-child(1) .cell {
  padding-left: 24px;
}
.avatar-uploader /deep/ .el-upload {
  cursor: pointer;
  position: absolute;
  left: 0;
  overflow: hidden;
}
.avatar-mobile-uploader /deep/ .el-upload {
  cursor: pointer;
  position: absolute;
  left: 304px;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
  margin-top: 16px;
  position: relative;
  &:hover {
    .upload-btn {
      display: inline-block;
    }
  }
  .upload-btn {
    display: none;
    width: 90px;
    height: 32px;
    color: #fff;
    background: rgba(1, 192, 222, 1);
    position: absolute;
    bottom: 24px;
    left: 50%;
    margin-left: -40px;
  }
}
.avatar {
  width: 284px;
  height: 176px;
  display: block;
}
.avatar-mobile-uploader {
  text-align: center;
  margin-top: 16px;
  position: relative;
  &:hover {
    .upload-mobile-btn {
      display: inline-block;
    }
  }
  .upload-mobile-btn {
    display: none;
    width: 90px;
    height: 32px;
    color: #fff;
    background: rgba(1, 192, 222, 1);
    position: absolute;
    bottom: 24px;
    left: 50%;
    margin-left: -45px;
  }
}
.avatar-mobile-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 105px;
  height: 176px;
  line-height: 176px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar-mobile {
  width: 105px;
  height: 176px;
  display: block;
}
.templateTitle {
  height: 86px;
  width: 100%;
  .titleText {
    font-size: 14px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    line-height: 86px;
    margin-left: 32px;
  }
  .createBtn {
    width: 120px;
    height: 40px;
    background: rgba(9, 204, 235, 1);
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    float: right;
    margin-top: 24px;
    margin-right: 32px;
  }
}
.contentWrap {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin: 0 32px;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  .contentHeader {
    padding: 0 22px;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectSearchValue {
    margin-top: 24px;
    width: 130px;
    height: 40px;
  }
  .searchInput {
    margin-left: -2px;
    margin-top: 24px;
    width: 180px;
    height: 40px;
  }
  .firstIndustrySelect {
    margin-top: 24px;
    width: 180px;
    height: 40px;
    margin-left: 110px;
  }
  .line {
    margin: 0 9px;
    vertical-align: middle;
    display: inline-block;
    width: 14px;
    height: 2px;
    background: rgba(140, 140, 140, 1);
  }
  .secondIndustrySelect {
    margin-right: 81px;
  }
  .languageSelect {
    margin-top: 24px;
    width: 130px;
    height: 40px;
    margin-right: 24px;
  }
  .themeSelect {
    margin-top: 24px;
    width: 130px;
    height: 40px;
    margin-right: 24px;
  }
  .templateStatus {
    width: 130px;
    height: 40px;
    margin-top: 24px;
    margin-right: 32px;
  }
  .isRecommend {
    margin-top: 24px;
    margin-right: 32px;
  }
  .inquire {
    margin-top: 24px;
    width: 90px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid rgba(9, 204, 235, 1);
    font-size: 14px;
    font-weight: 400;
    color: rgba(9, 204, 235, 1);
    line-height: 40px;
  }
  .sort {
    width: 130px;
    height: 40px;
    margin-left: 12px;
  }
  .siteImg {
    width: 200px;
    height: 133px;
  }
  .templateName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
  }
  // .templateDomain {
  //   font-size: 14px;
  //   font-weight: 400;
  //   color: rgba(9, 204, 235, 1);
  //   line-height: 20px;
  //   cursor: pointer;
  // }
  .handle-btn {
    padding: 0;
    border: none;
    font-size: 14px;
    font-weight: 400;
    color: rgba(9, 204, 235, 1);
    line-height: 20px;
  }
  .disable {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
// 右侧弹框
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
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      font-size: 16px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      padding: 0 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
  .tips {
    width: 422px;
    height: 32px;
    background: rgba(242, 255, 234, 1);
    border: 1px solid rgba(199, 221, 185, 1);
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 182, 57, 1);
    line-height: 32px;
    text-align: center;
    margin: 24px;
  }
  .phoneWrap {
    margin: 24px;
    margin-bottom: 0;
    height: 107px;
    .phoneTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .phoneInput {
      margin-top: 15px;
    }
  }
  .remarkWrap {
    margin: 0 24px;
    .remarkTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .remarkInput {
      margin-top: 15px;
    }
  }
  .settingTemplateWrap {
    margin: 32px 24px 10px;
    height: 97px;
    .templateName {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .templateNameInput {
      //   width: 200px;
      //   height: 45px;
      margin-top: 15px;
    }
  }
  .settingStatusWrap {
    margin-left: 24px;
    .settingStatus {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .settingStatusSelect {
      margin-top: 16px;
    }
  }
  .imgWrap {
    margin-top: 24px;
    margin-left: 24px;
    .imgTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
  }

  .tipTypeText {
    font-size: 14px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
  }
  .tipInfoText {
    font-size: 14px;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
    line-height: 20px;
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
      background: rgba(9, 204, 235, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
    .cancelBtn {
      width: 90px;
      height: 32px;
      border: 1px solid rgba(9, 204, 235, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 32px;
    }
  }
}
.blue {
  color: #09cceb;
}
.black {
  color: #262626;
}
</style>


