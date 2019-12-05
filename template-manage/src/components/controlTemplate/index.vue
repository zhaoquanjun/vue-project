<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">控件模板</span>
      <button class="cl-button cl-button--primary" @click="createTemplatedialogShow">开通模板应用</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="contentHeader">
        <el-select
          v-model="searchValue"
          placeholder="请选择"
          class="selectSearchValue"
          @change="changeSearchType"
        >
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="search" placeholder="请输入搜索内容" class="searchInput inputHeight"></el-input>
        <el-select
          v-model="sortValue"
          placeholder="请选择"
          class="selectSortValue"
          @change="changeSearchType"
        >
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
        <List :listData="templateInfo" @orderList="orderList" ref="list"></List>
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
          <div class="tips">开通【控件模板应用】服务，填写的手机号将是模板的管理员</div>
          <div class="inputWrap">
            <div class="inputTitle">管理员</div>
            <el-input
              v-model="createPhone"
              placeholder="请输入手机号"
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
              maxlength="20"
            ></el-input>
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
          <div class="confirm">
            <button class="confirmBtn cl-button cl-button--primary" @click="createTemplate">开通</button>
            <button class="cl-button cl-button--primary_notbg" @click="cancelCreateTemplate">取消</button>
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
      createRemark: "",
      templateInfo: []
    };
  },
  components: {
    List
  },
  mounted() {
    this.getList();
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
      let para = {
        templateName: templateNameText,
        secondDomain: domainText,
        phone: phoneText,
        templateState: this.sortValue
      };
      let { data } = await templateApi.getComposeTemplates(para);
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
    blurPhone() {},
    createTemplatedialogShow() {
      this.createTemplateShow = true;
    },
    changeSearchType() {},
    cancelCreateTemplate() {
      this.createTemplateShow = false;
    },
    async createTemplate() {
      this.createTemplateShow = false;
      let para = {
        designerPhone: this.createPhone,
        remark: this.createRemark,
        templateName: this.createTemplateName
      };
      let { data } = await templateApi.createComposeTemplate(para);
    },
    async orderList(prop, order) {
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
      if (prop == "updateTime") {
        orderByUpdateTime = true;
      } else if (prop == "createTime") {
        orderByCreateTime = true;
      }
      let isOrderByDesc = true;
      if (order == "descending") {
        isOrderByDesc = true;
      } else if (order == "ascending") {
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
      console.log(data);
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
  .pannel-head {
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    border-bottom: $--border-base;
    span {
      font-size: $--font-size-medium;
      font-weight: $--font-weight-primary;
      padding: 0 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
  .tips {
    width: calc(100% - 48px);
    height: 32px;
    background: rgba(242, 255, 234, 1);
    border: 1px solid rgba(199, 221, 185, 1);
    font-size: $--font-size-small;
    font-weight: $--font-weight-primary;
    color: rgba(0, 182, 57, 1);
    line-height: 32px;
    text-align: center;
    margin: 24px;
  }
  .inputWrap {
    margin-top: 16px;
    width: 100%;
    .inputTitle {
      width: 100px;
      display: inline-block;
      font-size: $--font-size-small;
      font-weight: $--font-weight-base;
      line-height: 32px;
      text-align: right;
      padding-right: 16px;
      box-sizing: border-box;
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


