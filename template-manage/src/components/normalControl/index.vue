<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">普通控件</span>
      <div>
        <button class="cl-button cl-button--primary" @click="refresh">菜单更新</button>
        <button class="cl-button cl-button--primary_notbg" @click="createTemplatedialogShow">新增控件</button>
      </div>
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
          @change="changeFirstType"
        >
          <el-option
            v-for="item in firstTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
        <List
          :listData="templateInfo"
          @editItem="editItem"
          @deleteItem="deleteItem"
          @orderList="orderList"
          ref="list"
        ></List>
      </div>
      <createControlDialog
        :firstTypeOptions="firstTypeOptions"
        @getList="getList"
        ref="createControlDialog"
      ></createControlDialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/normalControlApi";
import * as categoryApi from "@/api/request/controlCategoryApi";
import List from "./normalControlList";
import CreateControlDialog from "./createControlDialog";
export default {
  data() {
    return {
      prop: "createTime",
      order: "descending",
      searchValue: "",
      firstTypeValue: "",
      firstTypeOptions: [],
      secondTypeValue: "",
      secondTypeOptions: [],
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
    this.getFirstType();
  },
  methods: {
    async getList() {
      let orderByDisplayOrder = false;
      let orderByCreateTime = false;
      if (this.prop == "displayOrder") {
        orderByUpdateTime = true;
      } else if (this.prop == "createTime") {
        orderByCreateTime = true;
      }
      let isOrderByDesc = true;
      if (this.order == "descending") {
        isOrderByDesc = true;
      } else if (this.order == "ascending") {
        isOrderByDesc = false;
      }
      let para = {
        controlName: this.searchValue,
        firstType: this.firstTypeValue,
        secondType: this.secondTypeValue,
        ControlState: this.statusValue,
        OrderByCreateTime: orderByCreateTime,
        OrderByDisplayOrder: orderByDisplayOrder,
        IsOrderByDesc: isOrderByDesc
      };
      this.$Loading.show();
      let { data } = await templateApi.getNormalControls(para);
      this.$Loading.hide();
      this.templateInfo = data;
    },
    async getFirstType() {
      let { data } = await categoryApi.getDropDownList();
      this.firstTypeOptions = data;
    },
    async changeFirstType() {
      let { data } = await categoryApi.getDropDownList(this.firstTypeValue);
      this.secondTypeValue = "";
      this.secondTypeOptions = data;
    },
    editItem(row) {
      this.$refs.createControlDialog.showEditTemplate(row);
    },
    deleteItem(id) {
      this.$confirm(`确定要删该控件吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { data, status } = await templateApi.deleteNormalControl(id);
            if (status === 200) {
              this.getList();
              this.$notify({
                customClass: "notify-success",
                message: `删除成功`,
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
    async refresh() {
      this.$confirm(`确定要更新菜单吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { data, status } = await categoryApi.refresh();
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `更新成功`,
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
    searchList() {
      this.getList();
    },
    searchReset() {
      this.searchValue = "";
      this.firstTypeValue = "";
      this.secondTypeValue = "";
      this.statusValue = 0;
      this.getList();
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


