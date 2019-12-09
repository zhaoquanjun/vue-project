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
            placeholder="请输入模版名称"
            class="contentItem-input"
            @blur="blurTemplateName"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorTemplateNameTips">请输入分类名称</div>
        </div>
        <div class="contentItem" v-show="rowNum == 'second'">
          <div class="contentItem-title">上级分类</div>
          <el-select v-model="settingParent" placeholder="模版状态" class="contentItem-input">
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
          <el-input
            v-model="settingNormalIcon"
            placeholder="请输入模版名称"
            class="contentItem-input"
            @blur="blurNormalIcon"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorNormalIconTips">请输入常态图标SVG</div>
        </div>
        <div class="contentItem" v-show="rowNum == 'first'">
          <div class="contentItem-title">悬停图标</div>
          <el-input
            v-model="settingHoverIcon"
            placeholder="请输入模版名称"
            class="contentItem-input"
            @blur="blurHoverIcon"
          ></el-input>
          <div class="ym-form-item__error" v-show="errorHoverIconTips">请输入悬停图标SVG</div>
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
      settingNormalIcon: "",
      errorNormalIconTips: false,
      settingHoverIcon: "",
      errorHoverIconTips: false
    };
  },
  methods: {
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
        this.settingNormalIcon = row.normalIcon;
        this.settingHoverIcon = row.hoverIcon;
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
        if (this.settingNormalIcon == "") {
          this.errorNormalIconTips = true;
          return;
        }
        if (this.settingHoverIcon == "") {
          this.errorHoverIconTips = true;
          return;
        }
        para = {
          parentId: "",
          name: this.settingTemplateName,
          displayOrder: this.settingArrangement,
          normalIcon: this.settingNormalIcon,
          hoverIcon: this.settingHoverIcon
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
      this.settingNormalIcon = "";
      this.errorNormalIconTips = false;
      this.settingHoverIcon = "";
      this.errorHoverIconTips = false;
      this.settingParent = "";
    },
    blurTemplateName() {
      if (this.settingTemplateName == "") {
        this.errorTemplateNameTips = true;
      } else {
        this.errorTemplateNameTips = false;
      }
    },
    blurNormalIcon() {
      if (this.settingNormalIcon == "") {
        this.errorNormalIconTips = true;
      } else {
        this.errorNormalIconTips = false;
      }
    },
    blurHoverIcon() {
      if (this.settingHoverIcon == "") {
        this.errorHoverIconTips = true;
      } else {
        this.errorHoverIconTips = false;
      }
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
    margin-left: 56px;
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
        width: 65px;
        text-align: right;
        padding-right: 16px;
        box-sizing: border-box;
        font-size: $--font-size-small;
        font-weight: $--font-weight-base;
        color: $--color-text-primary;
      }
      .contentItem-input {
        width: 287px;
      }
      .typeSelect {
        width: 130px;
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
            object-fit: cover;
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