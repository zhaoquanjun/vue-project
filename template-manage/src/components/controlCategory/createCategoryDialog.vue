<template>
  <el-dialog
    width="0"
    :visible.sync="settingTemplateShow"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="right-pannel" :style="{width:'400px'}">
      <div class="pannel-head">
        <span class="headText">{{isEdit?"编辑分类":"新增分类"}}</span>
        <i class="iconfont iconguanbi cl-iconfont is-circle" @click="cancelSettingTemplate"></i>
      </div>
      <!-- :style="{height:dialogHeight+'px'}" -->
      <div class="dialogContent">
        <div class="contentItem" v-show="!isEdit">
          <div class="contentItem-title">分类级别</div>
          <el-radio-group v-model="rowNum">
            <el-radio label="first">一级分类</el-radio>
            <el-radio label="second">二级分类</el-radio>
          </el-radio-group>
        </div>
        <div class="contentItem">
          <div class="contentItem-title">分类名称</div>
          <el-input
            v-model="settingTemplateName"
            placeholder="请输入分类名称"
            class="contentItem-input"
            @blur="blurTemplateName"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorTemplateNameTips">请输入分类名称</div>
        </div>
        <div class="contentItem" v-show="rowNum == 'second'">
          <div class="contentItem-title">上级分类</div>
          <el-select v-model="settingParent" placeholder="上级分类" class="contentItem-input">
            <el-option
              v-for="item in settingParentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
        </div>
        <div class="contentItem" v-show="rowNum == 'first'">
          <div class="contentItem-title">常态图标</div>
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
            <!-- <div class="tipInfoText">推荐尺寸250×140px</div> -->
          </div>
          <div class="ym-form-item__error" v-show="errorPicTips">请上传常态图标</div>
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
import * as templateApi from "@/api/request/controlCategoryApi";
import securityService from "@/services/authentication/securityService";
import environment from "@/environment/index.js";
export default {
  data() {
    return {
      isEdit: false,
      row: {},
      settingTemplateShow: false,
      rowNum: "first",
      settingTemplateName: "",
      errorTemplateNameTips: false,
      settingParent: 1,
      settingParentOptions: [],
      settingArrangement: 1,
      picUrl: "",
      errorPicTips: false,
      uploadPicAction: `${environment.uploadCategoryUrl}`,
      headers: {
        appId: "",
        Authorization: ""
      }
    };
  },
  created(){
    this.keyupEnter();
  },
  methods: {
    keyupEnter(){
      document.onkeydown = e =>{
        if (e.keyCode === 13) {
          this.settingTemplateShow && this.saveSettingTemplate()
        }
      }
    },
    async showSettingTemplate() {
      this.isEdit = false;
      this.settingTemplateShow = true;
      let { data } = await templateApi.getDropDownList();
      this.settingParentOptions = data;
    },
    async showEditTemplate(row) {
      this.isEdit = true;
      this.row = row;
      let { data } = await templateApi.getDropDownList();
      this.settingParentOptions = data;
      if (row.parentId) {
        this.rowNum = "second";
        this.settingParent = row.parentId;
      } else {
        this.rowNum = "first";
        this.picUrl = row.normalIcon;
      }
      this.settingTemplateName = row.name;
      this.settingArrangement = row.displayOrder;
      this.settingTemplateShow = true;
    },
    cancelSettingTemplate() {
      this.settingTemplateShow = false;
      this.clearInfo();
    },
    async saveSettingTemplate() {
      let para = {};
      if (this.rowNum == "first") {
        if (this.settingTemplateName == "") {
          this.errorTemplateNameTips = true;
          return;
        }
        if (this.picUrl == "") {
          this.errorPicTips = true;
          return;
        }
        para = {
          parentId: "",
          name: this.settingTemplateName,
          displayOrder: this.settingArrangement,
          normalIcon: this.picUrl
        };
      } else {
        if (this.settingTemplateName == "") {
          this.errorTemplateNameTips = true;
          return;
        }
        para = {
          parentId: this.settingParent,
          name: this.settingTemplateName,
          displayOrder: this.settingArrangement
        };
      }
      this.settingTemplateShow = false;
      if (this.isEdit) {
        para.id = this.row.id;
        let { data } = await templateApi.update(para);
      } else {
        let { data } = await templateApi.add(para);
      }
      this.$emit("getList");
      this.clearInfo();
    },
    clearInfo() {
      this.settingTemplateName = "";
      this.errorTemplateNameTips = false;
      this.settingArrangement = 1;
      this.picUrl = "";
      this.errorPicTips = false;
      this.settingParent = "";
    },
    blurTemplateName() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
      } else {
        this.errorTemplateNameTips = false;
      }
    },
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
    .iconfont{
      color: $--color-text-regular;
      &:hover{
        color:$--color-text-regular;
      }
    }
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
      .arrangement {
        width: 90px;
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