<template>
  <el-dialog
    width="0"
    :visible.sync="settingTemplateShow"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="right-pannel" :style="{width:'400px'}">
      <div class="pannel-head">
        <span class="headText">控件设置</span>
        <i class="iconfont iconguanbi cl-iconfont is-circle" @click="cancelSettingTemplate"></i>
      </div>
      <!-- :style="{height:dialogHeight+'px'}" -->
      <div class="dialogContent">
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
              v-for="item in settingFirstTypeOptions"
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
          <div class="contentItem-title">排列</div>
          <el-input-number
            v-model="settingArrangement"
            class="typeSelect"
            controls-position="right"
            :min="1"
          ></el-input-number>
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
      </div>
      <div class="confirm">
        <button
          class="confirmBtn cl-button cl-button--primary cl-button--small"
          @click="saveSettingTemplate"
        >保存</button>
        <button
          class="cl-button cl-button--primary_notbg cl-button--small"
          @click="cancelSettingTemplate"
        >取消</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as templateApi from "@/api/request/controlTemplateApi";
import * as categoryApi from "@/api/request/controlCategoryApi";
import securityService from "@/services/authentication/securityService";
import environment from "@/environment/index.js";
export default {
  data() {
    return {
      row: {},
      settingTemplateShow: false,
      settingTemplateName: "",
      errorTemplateNameTips: false,
      settingFirstTypeSelect: "",
      settingFirstTypeOptions: [],
      settingSecondTypeSelect: "",
      settingSecondTypeOptions: [],
      errorFirstTypeTips: false,
      settingTemplateStatus: 0,
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
      picUrl: "",
      errorPicTips: false,
      uploadPicAction: `${environment.uploadComposeUrl}`,
      headers: {
        appId: "",
        Authorization: ""
      }
    };
  },
  components: {},
  mounted() {},
  methods: {
    async showSettingTemplate(row) {
      let { data } = await categoryApi.getDropDownList();
      this.settingFirstTypeOptions = data;
      this.row = row;
      this.settingTemplateName = this.row.controlName;
      if (row.firstTypeId) {
        this.settingFirstTypeSelect = row.firstTypeId;
        let { data } = await categoryApi.getDropDownList(row.firstTypeId);
        this.settingSecondTypeOptions = data;
        this.settingSecondTypeSelect = row.secondTypeId ? row.secondTypeId : "";
      }
      this.settingTemplateStatus = this.row.controlState;
      this.settingArrangement = this.row.displayOrder;
      this.picUrl = this.row.controlImg;
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
      this.settingTemplateShow = false;
      let para = {
        pageId: this.row.pageId,
        siteId: this.$route.query.siteId,
        controlName: this.settingTemplateName,
        firstType: this.settingFirstTypeSelect,
        secondType: Number(this.settingSecondTypeSelect),
        controlState: this.settingTemplateStatus,
        displayOrder: this.settingArrangement,
        controlImg: this.picUrl
      };
      let { data } = await templateApi.saveCombinedControl(para);
      this.$notify({
        customClass: "notify-success",
        message: `设置成功`,
        duration: 2000,
        showClose: false
      });
      this.clearInfo();
      this.$emit("getList");
    },
    clearInfo() {
      this.settingTemplateName = "";
      this.errorTemplateNameTips = false;
      this.settingFirstTypeSelect = "";
      this.settingSecondTypeSelect = "";
      this.errorFirstTypeTips = false;
      this.settingTemplateStatus = 2;
      this.settingArrangement = 1;
      this.picUrl = "";
      this.errorPicTips = false;
    },
    blurTemplateName() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
      } else {
        this.errorTemplateNameTips = false;
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
.right-pannel {
  background: $--color-white;
  position: fixed;
  z-index: 2200;
  right: 0;
  top: 0;
  bottom: 0;
  transition: width 0.2s linear;
  overflow: hidden;
  padding: 16px 24px 0;
  box-sizing: border-box;
  .ym-form-item__error {
    margin-left: 75px;
  }
  .pannel-head {
    border-bottom: $--border-base;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    .headText {
      font-size: $--font-size-base;
      font-weight: $--font-weight-base;
      color: $--color-text-primary;
    }
  }
  .dialogContent {
    height: calc(100% - 119px);
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
          height: 142px;
          &:hover {
            .upload-btn {
              display: inline-block;
            }
          }
          .avatar {
            width: 250px;
            height: 142px;
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
  }
  .confirm {
    position: absolute;
    width: calc(100% - 48px);
    height: 80px;
    bottom: 0px;
    border-top: $--border-base;
    padding: 16px 0 32px;
    box-sizing: border-box;
  }
}
</style>


