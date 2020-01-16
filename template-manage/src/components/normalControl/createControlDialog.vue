<template>
  <popUp
    :popupShow="settingTemplateShow"
    @closePopup="cancelSettingTemplate"
    @confirm="saveSettingTemplate"
  >
    <template v-slot:titleName>{{isEdit?"编辑控件":"新增控件"}}</template>
    <template v-slot:content>
      <div class="contentItem">
        <div class="contentItem-title">控件名称</div>
        <el-input
          v-model="settingTemplateName"
          placeholder="请输入控件名称"
          class="contentItem-input"
          @blur="blurTemplateName"
        ></el-input>
        <div class="ym-form-item__error" v-show="errorTemplateNameTips">请输入控件名称</div>
      </div>
      <div class="contentItem">
        <div class="contentItem-title">控件分类</div>
        <el-select
          v-model="settingFirstTypeSelect"
          placeholder="一级分类"
          @change="choseSettingFirstType"
          class="typeSelect"
        >
          <el-option
            v-for="item in firstTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="settingLine"></span>
        <el-select
          v-model="settingSecondTypeSelect"
          placeholder="二级分类"
          @change="choseSettingSecondType"
          class="typeSelect"
        >
          <el-option
            v-for="item in settingSecondTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="ym-form-item__error" v-show="errorFirstTypeTips">请选择控件分类</div>
      </div>
      <div class="contentItem">
        <div class="contentItem-title">控件状态</div>
        <el-select v-model="settingTemplateStatus" placeholder="控件状态" class="contentItem-input">
          <el-option
            v-for="item in settingTemplateStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="contentItem">
        <div class="contentItem-title">排序</div>
        <el-input-number
          v-model="settingArrangement"
          class="arrangement"
          controls-position="right"
          :min="1"
        ></el-input-number>
        <div class="rowNum-wrap">
          <span class="rowNum-text">排列</span>
          <el-radio-group v-model="rowNum">
            <el-radio :label="1">1列</el-radio>
            <el-radio :label="2">2列</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="contentItem">
        <div class="contentItem-title">缩略图</div>
        <div class="upload-wrap">
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
            <button class="upload-btn cl-button cl-button--primary">上传图片</button>
          </el-upload>
          <div class="tipInfoText">推荐尺寸250×140px</div>
        </div>
        <div class="ym-form-item__error" v-show="errorPicTips">请上传缩略图</div>
      </div>
      <div>
        <div>控件参数</div>
        <div class="contentItem">
          <div class="contentItem-title">类型</div>
          <el-input
            v-model="settingType"
            @blur="blurSettingType"
            placeholder="请输入控件类型"
            class="contentItem-input"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSettingTypeTips">请输入控件类型</div>
        </div>
        <div class="contentItem">
          <div class="contentItem-title">样式</div>
          <el-input
            v-model="settingStyle"
            @blur="blurSettingStyle"
            placeholder="请输入控件样式"
            class="contentItem-input"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSettingStyleTips">请输入控件样式</div>
        </div>
        <div class="contentItem">
          <div class="contentItem-title">别名</div>
          <el-input
            v-model="settingRemark"
            @blur="blurSettingRemark"
            placeholder="请输入控件别名"
            class="contentItem-input"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorSettingRemarkTips">请输入控件别名</div>
        </div>
        <div class="contentItem">
          <div class="contentItem-title">Html</div>
          <el-input
            v-model="settingHtml"
            type="textarea"
            :rows="3"
            placeholder="请输入html（选填）"
            style="vertical-align: text-top;"
            class="contentItem-input"
          ></el-input>
        </div>
      </div>
    </template>
    <template v-slot:confirmName>保存</template>
  </popUp>
</template>
<script>
import * as templateApi from "@/api/request/normalControlApi";
import * as categoryApi from "@/api/request/controlCategoryApi";
import securityService from "@/services/authentication/securityService";
import environment from "@/environment/index.js";
import PopUp from "@/components/common/rightPopup";
export default {
  props: {
    firstTypeOptions: {
      type: Array
    }
  },
  data() {
    return {
      isEdit: false,
      row: {},
      settingTemplateShow: false,
      settingTemplateName: "",
      errorTemplateNameTips: false,
      settingFirstTypeSelect: "",
      settingSecondTypeSelect: "",
      errorFirstTypeTips: false,
      settingSecondTypeOptions: [],
      settingTemplateStatus: 1,
      settingTemplateStatusOptions: [
        {
          value: 1,
          label: "上架"
        },
        {
          value: 2,
          label: "下架"
        }
      ],
      settingArrangement: 1,
      rowNum: 1,
      picUrl: "",
      errorPicTips: false,
      uploadPicAction: `${environment.uploadNormalUrl}`,
      headers: {
        appId: "",
        Authorization: ""
      },
      settingType: "",
      errorSettingTypeTips: false,
      settingStyle: "style1",
      errorSettingStyleTips: false,
      settingRemark:"",
      errorSettingRemarkTips:false,
      settingHtml: ""
    };
  },
  components: {
    PopUp
  },
  mounted() {},
  methods: {
    async showSettingTemplate() {
      this.isEdit = false;
      this.settingTemplateShow = true;
    },
    async showEditTemplate(row) {
      this.isEdit = true;
      this.row = row;
      this.settingTemplateName = row.controlName;
      if (row.firstTypeId) {
        this.settingFirstTypeSelect = row.firstTypeId;
        let { data } = await categoryApi.getDropDownList(row.firstTypeId);
        this.settingSecondTypeOptions = data;
        this.settingSecondTypeSelect = row.secondTypeId ? row.secondTypeId : "";
      }
      this.settingTemplateStatus = row.controlState;
      this.settingArrangement = row.displayOrder;
      this.rowNum = row.rowShowNumber;
      this.picUrl = row.controlImg;
      this.settingType = row.controlType;
      this.settingStyle = row.controlStyle;
      this.settingRemark=row.remark;
      this.settingHtml = row.controlHtml;
      this.settingTemplateShow = true;
    },
    cancelSettingTemplate() {
      this.settingTemplateShow = false;
      this.clearInfo();
    },
    async saveSettingTemplate() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
        return;
      }
      if (!this.settingFirstTypeSelect) {
        this.errorFirstTypeTips = true;
        return;
      }
      if (!this.picUrl) {
        this.errorPicTips = true;
        return;
      }
      if (this.settingType == "") {
        this.errorSettingTypeTips = true;
        return;
      }
      if (this.settingStyle == "") {
        this.errorSettingStyleTips = true;
        return;
      }
      if (this.settingRemark == "") {
        this.errorSettingRemarkTips = true;
        return;
      }
      let para = {
        controlName: this.settingTemplateName,
        firstType: this.settingFirstTypeSelect,
        secondType: Number(this.settingSecondTypeSelect),
        controlState: this.settingTemplateStatus,
        displayOrder: this.settingArrangement,
        rowShowNumber: this.rowNum,
        controlImg: this.picUrl,
        controlType: this.settingType,
        controlStyle: this.settingStyle,
        remark:this.settingRemark,
        controlHtml: this.settingHtml
      };
      this.settingTemplateShow = false;
      if (this.isEdit) {
        para.id = this.row.id;
        let { data } = await templateApi.saveNormalControl(para);
      } else {
        let { data } = await templateApi.createNormalControl(para);
      }
      this.$emit("getList");
      this.clearInfo();
    },
    clearInfo() {
      this.settingTemplateName = "";
      this.errorTemplateNameTips = false;
      this.settingFirstTypeSelect = "";
      this.settingSecondTypeSelect = "";
      this.errorFirstTypeTips = false;
      this.settingTemplateStatus = 1;
      this.settingArrangement = 1;
      this.rowNum = 1;
      this.picUrl = "";
      this.errorPicTips = false;
      this.settingType = "";
      this.errorSettingTypeTips = false;
      this.settingStyle = "style1";
      this.errorSettingStyleTips = false;
      this.settingRemark="";
      this.errorSettingRemarkTips=false;
      this.settingHtml = "";
    },
    blurTemplateName() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
      } else {
        this.errorTemplateNameTips = false;
      }
    },
    blurSettingType() {
      if (this.settingType == "") {
        this.errorSettingTypeTips = true;
      } else {
        this.errorSettingTypeTips = false;
      }
    },
    blurSettingStyle() {
      if (this.settingStyle == "") {
        this.errorSettingStyleTips = true;
      } else {
        this.errorSettingStyleTips = false;
      }
    },
    blurSettingRemark() {
      if (this.settingRemark == "") {
        this.errorSettingRemarkTips = true;
      } else {
        this.errorSettingRemarkTips = false;
      }
    },
    async choseSettingFirstType() {
      this.errorFirstTypeTips = false;
      let { data } = await categoryApi.getDropDownList(
        this.settingFirstTypeSelect
      );
      this.settingSecondTypeSelect = "";
      this.settingSecondTypeOptions = data;
    },
    choseSettingSecondType() {},
    async beforeAvatarUpload(file) {
      let data = await securityService.getUser();
      this.headers.Authorization = "Bearer " + data.access_token;
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
    handleAvatarSuccess(res, file) {
      this.errorPicTips = false;
      this.picUrl = file.response;
    }
  }
};
</script>
<style lang="scss" scoped>
.contentItem {
  margin-top: 16px;
  width: 100%;
  .contentItem-title {
    display: inline-block;
    width: 75px;
    text-align: right;
    padding-right: 16px;
    box-sizing: border-box;
    font-size: $--font-size-small;
    font-weight: $--font-weight-base;
    color: $--color-text-primary;
  }
  .contentItem-input {
    width: 275px;
  }
  .typeSelect {
    width: 125px;
  }
  .settingLine {
    display: inline-block;
    width: 8px;
    height: 1px;
    background: $--border-color-base;
    margin: auto 8px;
  }
  .arrangement {
    width: 90px;
  }
  .rowNum-wrap {
    margin-left: 20px;
    display: inline-block;
    .rowNum-text {
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
      color: $--color-text-primary;
      margin-right: 16px;
    }
  }
  /deep/ .el-input-number {
    line-height: 31px;
    .el-input-number__decrease {
      line-height: 14px;
      &:hover {
        color: $--color-primary;
      }
    }
    .el-input-number__increase {
      line-height: 14px;
      top: 2px;
      &:hover {
        color: $--color-primary;
      }
    }
    .el-input-number__decrease:hover:not(.is-disabled)
      ~ .el-input
      .el-input__inner:not(.is-disabled),
    .el-input-number__increase:hover:not(.is-disabled)
      ~ .el-input
      .el-input__inner:not(.is-disabled) {
      border-color: $--color-primary;
    }
  }
  .upload-wrap {
    display: inline-block;
    vertical-align: text-top;
    .avatar-uploader {
      text-align: center;
      position: relative;
      width: 250px;
      height: 140px;
      &:hover {
        .upload-btn {
          display: inline-block;
        }
      }
      .avatar {
        width: 250px;
        height: 140px;
        display: block;
        object-fit: contain;
      }
      .upload-btn {
        display: none;
        position: absolute;
        bottom: 24px;
        left: 50%;
        margin-left: -40px;
      }
    }
    .tipInfoText {
      margin-top: 16px;
      text-align: center;
      color: $--color-text-secondary;
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
    }
  }
}
</style>


