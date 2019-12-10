<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">控件模板</span>
      <button class="cl-button cl-button--primary" @click="createTemplatedialogShow">开通模板应用</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="contentHeader">
        <el-select v-model="searchValue" placeholder="请选择" class="selectSearchValue">
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="search" placeholder="请输入搜索内容" class="searchInput inputHeight"></el-input>
        <el-select v-model="sortValue" placeholder="请选择" class="selectSortValue">
          <el-option
            v-for="item in sortOptions"
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
        <List
          :listData="templateData"
          @orderList="orderList"
          @changePage="changePage"
          @changeSize="changeSize"
          ref="list"
        ></List>
      </div>
      <el-dialog
        width="0"
        :visible.sync="createTemplateShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'400px'}">
          <div class="pannel-head">
            <span>
              <span>开通控件模板</span>
            </span>
            <span class="close-pannel" @click="cancelCreateTemplate">
              <i class="iconfont iconguanbi cl-iconfont is-circle" style="font-size:16px"></i>
            </span>
          </div>
          <div class="dialogContent">
            <div class="tips">开通【控件模板应用】服务，填写的手机号将是模板的管理员</div>
            <div class="inputWrap">
              <div class="inputTitle">管理员</div>
              <el-input
                v-model="createPhone"
                placeholder="请输入管理员手机号"
                style="width:275px"
                @blur="blurPhone"
                :maxlength="11"
              ></el-input>
              <div class="ym-form-item__error" v-show="errorTip">{{errorPhone}}</div>
            </div>
            <div class="inputWrap">
              <div class="inputTitle">模板名称</div>
              <el-input
                v-model="createTemplateName"
                placeholder="请输入模板名称"
                style="width:275px"
                @blur="blurName"
                maxlength="20"
              ></el-input>
              <div class="ym-form-item__error" v-show="errorNameTip">请输入模板名称</div>
            </div>
            <div class="inputWrap">
              <span class="inputTitle">备注</span>
              <el-input
                v-model="createRemark"
                placeholder="请输入备注信息"
                style="width:275px"
                maxlength="40"
              ></el-input>
            </div>
          </div>

          <div class="confirm">
            <button
              class="confirmBtn cl-button cl-button--primary cl-button--small"
              @click="createTemplate"
            >开通</button>
            <button
              class="cl-button cl-button--primary_notbg cl-button--small"
              @click="cancelCreateTemplate"
            >取消</button>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/controlTemplateApi";
import List from "./controlTemplateList";
export default {
  data() {
    return {
      prop: "createTime",
      order: "descending",
      search: "",
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
          value: "phone",
          label: "管理员"
        }
      ],
      sortValue: -1,
      sortOptions: [
        {
          value: -1,
          label: "模版状态"
        },
        {
          value: 0,
          label: "开通中"
        },
        {
          value: 3,
          label: "开通成功"
        },
        {
          value: 2,
          label: "开通失败"
        }
      ],
      createTemplateShow: false,
      createPhone: "",
      errorTip: false,
      errorPhone: "",
      createTemplateName: "",
      errorNameTip: false,
      createRemark: "",
      templateInfo: [],
      templateData: {},
      pageIndex: 1,
      pageSize: 10
    };
  },
  components: {
    List
  },
  methods: {
    async getList() {
      this.$Loading.show();
      let templateNameText = "";
      let domainText = "";
      let phoneText = "";
      if (this.searchValue == "templateName") {
        templateNameText = this.search;
      } else if (this.searchValue == "secondDomaon") {
        domainText = this.search;
      } else if (this.searchValue == "phone") {
        phoneText = this.search;
      }
      let orderByUpdateTime = false;
      let orderByCreateTime = false;
      if (this.prop == "updateTime") {
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
        templateName: templateNameText,
        secondDomain: domainText,
        phone: phoneText,
        templateState: this.sortValue,
        OrderByCreateTime: orderByCreateTime,
        OrderByUpdateTime: orderByUpdateTime,
        IsOrderByDesc: isOrderByDesc
      };
      let { data } = await templateApi.getComposeTemplates(para);
      this.$Loading.hide();
      this.templateInfo = data;
      this.templateData = this.pagination(data, this.pageIndex, this.pageSize);
    },
    pagination(data, pageIndex, pageSize) {
      let templateData = {};
      templateData.pageIndex = pageIndex;
      templateData.totalCount = data.length;
      templateData.totalPages = 10;
      templateData.pageSize = pageSize;
      let newData = this.slicePageData(data, pageSize);
      templateData.curData = newData[pageIndex - 1];
      return templateData;
    },
    changePage(page) {
      this.pageIndex = page;
      this.templateData = this.pagination(
        this.templateInfo,
        this.pageIndex,
        this.pageSize
      );
    },
    changeSize(size) {
      this.pageSize = size;
      this.templateData = this.pagination(
        this.templateInfo,
        this.pageIndex,
        this.pageSize
      );
    },
    slicePageData(array, size) {
      let length = array.length;
      let index = 0;
      let resIndex = 0;
      let result = new Array(Math.ceil(length / size));
      while (index < length) {
        result[resIndex++] = array.slice(index, (index += size));
      }
      return result;
    },
    searchList() {
      this.getList();
    },
    searchReset() {
      this.search = "";
      this.sortValue = -1;
      this.searchValue = "templateName";
      this.getList();
    },
    blurPhone() {
      if (this.createPhone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入手机号";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.createPhone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
      } else {
        this.errorTip = false;
        this.errorPhone = "";
      }
    },
    blurName() {
      if (this.createTemplateName == "") {
        this.errorNameTip = true;
      } else {
        this.errorNameTip = false;
      }
    },
    clearInfo() {
      this.createPhone = "";
      this.errorTip = false;
      this.errorPhone = "";
      this.createTemplateName = "";
      this.createRemark = "";
    },
    createTemplatedialogShow() {
      this.createTemplateShow = true;
    },
    cancelCreateTemplate() {
      this.createTemplateShow = false;
      this.clearInfo();
    },
    async createTemplate() {
      if (this.createPhone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入手机号";
        return;
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.createPhone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
        return;
      }
      if (this.createTemplateName == "") {
        this.errorNameTip = true;
        return;
      }
      this.createTemplateShow = false;
      let para = {
        designerPhone: this.createPhone,
        remark: this.createRemark,
        templateName: this.createTemplateName
      };
      let { data } = await templateApi.createComposeTemplate(para);
      this.$notify({
        customClass: "notify-success",
        message: `模版开通成功`,
        duration: 2000,
        showClose: false
      });
      this.getList();
      this.clearInfo();
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
  }
  .selectSearchValue {
    width: 95px;
  }
  .searchInput {
    margin-left: -2px;
    width: 200px;
  }
  .selectSortValue {
    margin-left: 45px;
    width: 100px;
  }
}
// 右侧弹框
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
    .tips {
      width: 100%;
      height: 32px;
      background: rgba(243, 255, 247, 1);
      border: 1px solid rgba(35, 205, 93, 0.3);
      font-size: $--font-size-small;
      font-weight: $--font-weight-primary;
      color: #23cd5d;
      line-height: 32px;
      text-align: center;
      margin: 24px 0;
    }
    .inputWrap {
      margin-top: 16px;
      width: 100%;
      .inputTitle {
        display: inline-block;
        width: 75px;
        text-align: right;
        padding-right: 16px;
        box-sizing: border-box;
        font-size: $--font-size-small;
        font-weight: $--font-weight-base;
        color: $--color-text-primary;
      }
      .ym-form-item__error {
        margin-left: 75px;
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


