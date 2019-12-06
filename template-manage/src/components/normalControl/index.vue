<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">普通控件</span>
      <button class="cl-button cl-button--primary" @click="createTemplatedialogShow">新增控件</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="contentHeader">
        <el-input v-model="searchValue" placeholder="请输入搜索内容" class="searchInput">
          <i
            class="el-icon-search el-input__icon"
            style="cursor: pointer;color:#D7D8D9"
            slot="suffix"
            @click="searchList"
          ></i>
        </el-input>
        <el-select
          v-model="firstTypeValue"
          placeholder="请选择"
          class="selectValue"
          @change="changeSearchType"
        >
          <el-option
            v-for="item in firstTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="secondTypeValue"
          placeholder="请选择"
          class="selectValue"
          @change="changeSearchType"
        >
          <el-option
            v-for="item in secondTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusValue"
          placeholder="请选择"
          class="selectValue"
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
          style="margin-left:16px"
          class="cl-button cl-button--primary cl-button--small"
          @click="searchList"
        >查询</button>
        <button class="cl-button cl-button--primary_notbg cl-button--small" @click="searchReset">重置</button>
      </div>
      <div>
        <List :listData="templateInfo" @orderList="orderList" ref="list"></List>
      </div>
      <createControlDialog ref="createControlDialog"></createControlDialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/normalControlApi";
import List from "./normalControlList";
import CreateControlDialog from "./createControlDialog";
export default {
  data() {
    return {
      prop: "createTime",
      order: "descending",
      searchValue: "",
      firstTypeValue: 0,
      firstTypeOptions: [
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
      secondTypeValue: 0,
      secondTypeOptions: [
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
    CreateControlDialog
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.$Loading.show();
      let para = {
        controlName: this.searchValue,
        firstType: this.firstTypeValue,
        secondType: this.secondTypeValue,
        ControlState: this.statusValue
      };
      let { data } = await templateApi.getNormalControls(para);
      this.$Loading.hide();
      this.templateInfo = data;
      console.log(data);
    },
    searchList() {
      this.getList();
    },
    searchReset() {
      this.search = "";
      this.sortValue = -1;
      this.searchValue = "templateName";
    },
    createTemplatedialogShow() {
      this.$refs.createControlDialog.showSettingTemplate();
    },
    changeSearchType() {},
    cancelCreateTemplate() {
      this.createTemplateShow = false;
    },
    async orderList(prop, order) {
      this.prop = prop;
      this.order = order;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
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
  .contentHeader {
    background: $--color-white;
    border: $--border-base;
    height: 60px;
    margin-bottom: 12px;
    padding-left: 24px;
    display: flex;
    align-items: center;
    .searchInput {
      width: 200px;
    }
    .selectValue {
      margin-left: 16px;
      width: 100px;
    }
  }
}
</style>


