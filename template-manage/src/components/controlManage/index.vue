<template>
  <el-container>
    <div class="breadcrumbWrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/template/composetemplate' }">控件模板</el-breadcrumb-item>
        <el-breadcrumb-item>控件管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">控件模板</span>
      <button class="cl-button cl-button--primary" @click="createTemplatedialogShow">返回</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="templateName">模板名称：{{templateName}}</div>
      <div class="contentHeader">
        <el-input v-model="searchValue" placeholder="请输入搜索内容" class="searchInput inputHeight">
          <i
            class="el-icon-search el-input__icon"
            style="cursor: pointer;color:#D7D8D9"
            slot="suffix"
            @click="searchList"
          ></i>
        </el-input>
        <el-select
          v-model="typeValue"
          placeholder="请选择"
          class="selectTypeValue"
          @change="changeSearchType"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusValue"
          placeholder="请选择"
          class="selectStatusValue"
          @change="changeSearchType"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <button
          style="margin-left:32px"
          class="cl-button cl-button--primary cl-button--small"
          @click="searchList"
        >查询</button>
        <button class="cl-button cl-button--primary_notbg cl-button--small" @click="searchReset">重置</button>
      </div>
      <div>
        <List :listData="templateInfo" ref="list" @setting="setting" @update="update"></List>
      </div>
      <settingDialog ref="settingDialog"></settingDialog>
    </el-main>
  </el-container>
</template>
<script>
import List from "./controlManageList";
import SettingDialog from "./settingDialog";
import * as templateApi from "@/api/request/controlTemplateApi";
export default {
  data() {
    return {
      templateName: this.$route.query.templateName,
      searchValue: "",
      typeValue: 0,
      typeOptions: [
        {
          value: 0,
          label: "控件类型"
        },
        {
          value: 1,
          label: "按钮"
        },
        {
          value: 2,
          label: "图片"
        }
      ],
      statusValue: 0,
      statusOptions: [
        {
          value: 0,
          label: "控件状态"
        },
        {
          value: 1,
          label: "上架"
        },
        {
          value: 2,
          label: "下架"
        }
      ],
      templateInfo: []
    };
  },
  components: {
    List,
    SettingDialog
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.$Loading.show();
      let para = {
        siteId: this.$route.query.siteId,
        controlName: this.searchValue,
        firstType: this.typeValue,
        secondType: this.typeValue,
        controlState: this.statusValue
      };
      let { data } = await templateApi.getCombinedControls(para);
      this.$Loading.hide();
      this.templateInfo = data;
    },
    searchList() {
      this.getList();
    },
    searchReset() {
      this.searchValue = "";
      this.typeValue = 0;
      this.statusValue = 0;
    },
    blurPhone() {},
    createTemplatedialogShow() {
      this.$router.push({
        path: "/template/composetemplate"
      });
    },
    setting(row){
        this.$refs.settingDialog.showSettingTemplate(row);
    },
    async update(row) {
      this.$confirm(`确定要更新该模版吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let para = {
              siteId: this.$route.query.siteId,
              pageIds: [row.pageId]
            };
            let { data, status } = await templateApi.updateCombinedControl(
              para
            );
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `模版更新成功`,
                duration: 2000,
                showClose: false
              });
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
    changeSearchType() {},
    cancelCreateTemplate() {},
    async createTemplate() {}
  }
};
</script>
<style lang="scss" scoped>
.breadcrumbWrap {
  padding-top: 12px;
  padding-left: 16px;
  width: 100%;
  box-sizing: border-box;
  /deep/ .el-breadcrumb__inner {
    color: $--color-text-regular;
    font-size: $--font-size-small;
    &:hover {
      color: $--color-text-regular;
    }
  }
  /deep/ .is-link {
    color: $--color-text-primary;
    &:hover {
      color: $--color-text-primary;
    }
  }
}
.templateTitle {
  height: 50px;
  padding: 0 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleText {
    font-size: $--font-size-base;
    font-weight: 600;
    color: $--color-text-primary;
    border-left: 2px solid $--color-primary;
    padding-left: 10px;
  }
}
.contentWrap {
  margin: 0 16px;
  .templateName {
    background: $--color-white;
    border: $--border-base;
    padding: 16px 24px;
    font-size: $--font-size-small;
    font-weight: $--font-weight-base;
    color: $--color-text-primary;
  }
  .contentHeader {
    margin-top: 16px;
    margin-bottom: 12px;
    background: $--color-white;
    border: $--border-base;
    height: 60px;
    padding-left: 24px;
    display: flex;
    align-items: center;
    .searchInput {
      width: 200px;
    }
    .selectTypeValue {
      margin-left: 16px;
      width: 100px;
    }
    .selectStatusValue {
      margin-left: 16px;
      width: 100px;
    }
  }
}
.right-pannel {
  background: $--color-white;
  position: fixed;
  z-index: 2200;
  right: 0;
  top: 0;
  bottom: 0;
  transition: width 0.2s linear;
  overflow: hidden;
  padding: 0 24px;
  box-sizing: border-box;
  .ym-form-item__error {
    margin-left: 56px;
  }
  .pannel-head {
    height: 50px;
    border-bottom: $--border-base;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .headText {
      font-size: $--font-size-base;
      font-weight: $--font-weight-base;
      color: $--color-text-primary;
    }
  }

  .confirm {
    position: absolute;
    width: 470px;
    height: 80px;
    bottom: 0px;
    border-top: $--border-base;
    display: flex;
    align-items: center;
    .confirmBtn {
      margin-left: 16px;
    }
  }
}
</style>


