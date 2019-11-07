<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll" style="padding: 32px">
      <el-row class="user-list">
        <span class="member-list-title fs14">网站地图</span>
      </el-row>
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="content">
        <el-tabs
          class="tab"
          v-model="uploadType"
          type="card"
          @tab-click="handleClick"
          :before-leave="beforeClick"
        >
          <el-tab-pane label="系统自动生成" name="auto"></el-tab-pane>
          <el-tab-pane label="手动上传" name="manual"></el-tab-pane>
        </el-tabs>
        <div v-show="uploadType == 'auto'" style="padding:16px 0px">
          <ul class="autoType">
            <li
              class="typeItem"
              :class="{typeItemActive:listType == 'page'}"
              @click="choseListType('page')"
            >页面</li>
            <li
              class="typeItem"
              :class="{typeItemActive:listType == 'news'}"
              @click="choseListType('news')"
            >文章</li>
            <li
              class="typeItem"
              :class="{typeItemActive:listType == 'product'}"
              @click="choseListType('product')"
            >产品</li>
          </ul>
          <div class="addWrap">
            <div class="infoText">
              <span>自动生成网站地图</span>
              <i class="iconfont iconicon-exclamationmark" style="color:#e5e5e5;margin-left:8px"></i>
            </div>
            <div class="operateBtn">
              <button class="addBtn" @click="showAddDialog">{{addType}}</button>
              <a class="previewBtn" :href="`${previewSitemapUrl}${curSiteId}`" target="_blank">预览</a>
            </div>
          </div>
          <div class="searchWrap">
            <el-input
              size="medium"
              v-model="keyword"
              :placeholder="`搜索${this.type}标题`"
              @keyup.enter.native="search"
              class="input-with-select"
              v-show="!batchDeleteShow"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer;"
                slot="suffix"
                @click="search"
              ></i>
            </el-input>
            <div class="right" v-show="!batchDeleteShow">
              <div class="rightText">批量设置</div>
              <div class="changeBtn" v-show="batchSetting == 'all'">
                <button
                  :class="{disabled:listData.list.length == 0}"
                  @click="choseBatchSetting('priority')"
                >
                  <span>权重</span>
                </button>
                <span style="margin:0px 16px">|</span>
                <button
                  :class="{disabled:listData.list.length == 0}"
                  @click="choseBatchSetting('frequency')"
                >
                  <span>更新频率</span>
                </button>
              </div>
              <div style="display:inline-block" v-show="batchSetting == 'priority'">
                <el-select v-model="priority" placeholder="权重">
                  <el-option
                    v-for="item in priorityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div class="changeBtn" style="margin-left:24px">
                  <button style="margin-right:8px" @click="determine('priority')">
                    <span>确定</span>
                  </button>
                  <button @click="cancelSetting">
                    <span>取消</span>
                  </button>
                </div>
              </div>
              <div style="display:inline-block" v-show="batchSetting == 'frequency'">
                <el-select v-model="frequency" placeholder="更新频率">
                  <el-option
                    v-for="item in frequencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div class="changeBtn" style="margin-left:24px">
                  <button style="margin-right:8px" @click="determine('frequency')">
                    <span>确定</span>
                  </button>
                  <button @click="cancelSetting">
                    <span>取消</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-show="batchDeleteShow" class="batchDelete">
              <span class="batchDeleteText">
                已选择
                <span>{{selectedList.length}}</span>
                个{{type}}
              </span>
              <button class="delete" @click="batchDelete">删除</button>
              <button class="cancel" @click="batchCancel">取消</button>
            </div>
          </div>
          <div>
            <List
              :listData="listData"
              :listType="listType"
              ref="list"
              @remove="remove"
              @handleSelectionChange="handleSelectionChange"
              @update="update"
              @chagePage="chagePage"
              @changeSize="changeSize"
            ></List>
            <div class="tip">如何在百度站长工具内提交sitemap？</div>
          </div>
        </div>
        <div v-show="uploadType == 'manual'">
          <manualUpload ref="manualUpload" :siteId="curSiteId"></manualUpload>
        </div>
      </el-row>
      <el-dialog
        width="0"
        :visible.sync="addShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span class="title">{{addType}}</span>
            <span class="tips" v-show="type == '文章'">仅显示已上线文章</span>
            <span class="tips" v-show="type == '产品'">仅显示已上架产品</span>
            <i class="iconfont iconguanbi close-pannel" @click="closeAddDialog"></i>
          </div>
          <div style="padding:24px">
            <el-input
              size="medium"
              v-model="addKeyword"
              :placeholder="`搜索${this.type}标题`"
              @keyup.enter.native="addSearch"
              class="input-with-select"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer;"
                slot="suffix"
                @click="addSearch"
              ></i>
            </el-input>
            <div class="table-list smallTable" id="table-list" style="margin-top:24px">
              <el-table
                ref="multipleTable"
                :data="addListData.list"
                tooltip-effect="dark"
                :height="300"
                class="content-table"
                @selection-change="handleAddSelectionChange"
              >
                <template slot="empty">
                  <div class="empty-table">
                    <img src="~img/memberManage/table-empty.png" />
                    <span>无数据</span>
                  </div>
                </template>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="title" label="页面标题" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="overflow">{{scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" show-overflow-tooltip v-if="listType != 'page'">
                  <template slot-scope="scope">
                    <div>{{ scope.row.createTime.substr(0,10) }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="list-footer" v-show="addListData.totalRecord > 0">
                <div class="pageing" id="pageing" style="margin-right:0">
                  <slot name="paging"></slot>
                  <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="addListData.totalRecord"
                    :page-count="addListData.totalPage"
                    :page-size="addListData.pageSize"
                    :page-sizes="[10,20,50]"
                    @current-change="changeAddPage"
                    @size-change="changeAddSize"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </div>
          <div class="confirm">
            <button
              class="confirmBtn"
              :class="{addDisabled:addSelectedList.length == 0}"
              @click="add"
            >确定</button>
            <button class="cancelBtn" @click="closeAddDialog">取消</button>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import ManualUpload from "./manualUpload";
import List from "./list";
import { previewSitemapUrl } from "@/environment/index.js";
import * as sitemapApi from "@/api/request/sitemapApi";
import { formatDateTime } from "@/api/index";

export default {
  components: {
    PageSubmenu,
    ChangeSite,
    ManualUpload,
    List
  },
  data() {
    return {
      curSiteId: "",
      uploadType: "auto",
      listType: "page",
      type: "页面",
      previewSitemapUrl: previewSitemapUrl,
      addType: "添加页面",
      addShow: false,
      addKeyword: "",
      addListData: {},
      addPageSize: 10,
      addPageIndex: 1,
      addSelectedList: [],
      batchSetting: "all",
      priority: "",
      priorityList: [
        {
          value: 1.0,
          label: 1.0
        },
        {
          value: 0.9,
          label: 0.9
        },
        {
          value: 0.8,
          label: 0.8
        },
        {
          value: 0.7,
          label: 0.7
        },
        {
          value: 0.6,
          label: 0.6
        },
        {
          value: 0.5,
          label: 0.5
        },
        {
          value: 0.4,
          label: 0.4
        },
        {
          value: 0.3,
          label: 0.3
        },
        {
          value: 0.2,
          label: 0.2
        },
        {
          value: 0.1,
          label: 0.1
        }
      ],
      frequency: "",
      frequencyList: [
        {
          value: "always",
          label: "经常"
        },
        {
          value: "hourly",
          label: "每小时"
        },
        {
          value: "daily",
          label: "每天"
        },
        {
          value: "weekly",
          label: "每周"
        },
        {
          value: "monthly",
          label: "每月"
        },
        {
          value: "yearly",
          label: "每年"
        },
        {
          value: "never",
          label: "从不"
        }
      ],
      batchDeleteShow: false,
      selectedList: [],
      keyword: "",
      pageSize: 10,
      pageIndex: 1,
      listData: {
        list: []
      }
    };
  },
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.curSiteId = siteId;
      this.getList();
    },
    // 选择切换网站
    chooseWebsite(siteId) {
      this.curSiteId = siteId;
      this.getList();
      this.$refs.manualUpload.init(siteId);
    },
    async getList() {
      this.$Loading.show();
      let para = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        EntityType: this.listType,
        siteId: this.curSiteId
      };
      let { data, status } = await sitemapApi.getList(this.curSiteId, para);
      this.$Loading.hide();
      this.listData = data;
    },
    chagePage(page) {
      this.pageIndex = page;
      this.getList();
    },
    changeSize(size) {
      this.pageSize = size;
      this.getList();
    },
    // 切换手动上传和自动上传
    beforeClick(item) {
      if (item == "auto") {
        this.getList();
      } else if (item == "manual") {
        this.$refs.manualUpload.init(this.curSiteId);
      }
    },
    handleClick(item) {
      // console.log(this.uploadType);
      // console.log(item.name);
      // if (item.name == this.uploadType) {
      //   return;
      // }
      // console.log(this.uploadType == "auto");
      // if (this.uploadType == "auto") {
      //   this.getList();
      // } else if (this.uploadType == "manual") {
      //   this.$refs.manualUpload.init(this.curSiteId);
      // }
    },
    search() {
      this.getList();
    },
    choseListType(type) {
      if (type == this.listType) {
        return;
      }
      this.keyword = "";
      this.listType = type;
      this.getList();
      if (type == "page") {
        this.addType = "添加页面";
      } else if (type == "news") {
        this.addType = "添加文章";
      } else if (type == "product") {
        this.addType = "添加产品";
      }
    },
    async add() {
      if (this.addSelectedList.length == 0) {
        return;
      }
      let entityIdList = [];
      this.addSelectedList.forEach(item => {
        entityIdList.push(item.entityId);
      });
      let para = {
        siteId: this.curSiteId,
        entityIdList: entityIdList,
        entityType: this.listType,
        priority: 0.8,
        frequency: "Monthly"
      };
      let { data, status } = await sitemapApi.add(para);
      if (status == 200) {
        this.$notify({
          customClass: "notify-success",
          message: `添加成功`,
          duration: 2000,
          showClose: false
        });
        this.addShow = false;
        this.getList();
      }
    },
    // 删除
    async remove(idList) {
      this.$confirm(
        `您确定要删除当前${this.type}吗？删除后，${this.type}无法再次同步列表，若要添加需要您手动添加该${this.type}`,
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              let { status } = await sitemapApi.batchRemove(
                this.curSiteId,
                idList
              );
              if (status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功`,
                  duration: 2000,
                  showClose: false
                });
                this.getList();
              } else {
                this.$notify({
                  customClass: "notify-error",
                  message: `系统正忙，请稍后再试！`,
                  duration: 2000,
                  showClose: false
                });
              }
            }
          }
        }
      );
    },
    // 修改
    async update(para) {
      let { status } = await sitemapApi.update(this.curSiteId, para);
      this.getList();
      this.$notify({
        customClass: "notify-success",
        message: `设置成功`,
        duration: 2000,
        showClose: false
      });
    },
    // // 预览
    // async preview() {
    //   let { data, status } = await sitemapApi.previewFile(this.curSiteId);
    //   console.log(data);
    // },
    // 添加弹框内的列表选中
    handleAddSelectionChange(list) {
      this.addSelectedList = list;
    },
    // 列表选中
    handleSelectionChange(list) {
      this.selectedList = list;
      if (list.length > 0) {
        this.batchDeleteShow = true;
      } else {
        this.batchDeleteShow = false;
      }
    },
    batchCancel() {
      this.$refs.list.cancelSelect();
    },
    // 批量删除
    batchDelete() {
      let idList = [];
      this.selectedList.forEach(item => {
        idList.push(item.id);
      });
      this.remove(idList);
    },
    // 批量修改
    choseBatchSetting(type) {
      if (this.listData.list.length > 0) {
        this.frequency = "";
        this.priority = "";
        this.batchSetting = type;
      }
    },
    determine(type) {
      let idList = [];
      this.listData.list.forEach(item => {
        idList.push(item.id);
      });

      let para = {};
      if (type == "frequency") {
        if (this.frequency == "") {
          this.$notify({
            customClass: "notify-error",
            message: `请选择更新频率`,
            duration: 2000,
            showClose: false
          });
          return;
        }
        para = {
          idList: idList,
          frequency: this.frequency
        };
      } else if (type == "priority") {
        if (this.priority == "") {
          this.$notify({
            customClass: "notify-error",
            message: `请选择权重`,
            duration: 2000,
            showClose: false
          });
          return;
        }
        para = {
          idList: idList,
          priority: this.priority
        };
      }
      this.update(para);
      this.batchSetting = "all";
    },
    cancelSetting() {
      this.batchSetting = "all";
    },
    showAddDialog() {
      this.addShow = true;
      this.addKeyword = "";
      this.getAddList();
    },
    async getAddList() {
      let para = {
        pageSize: this.addPageSize,
        pageIndex: this.addPageIndex,
        keyword: this.addKeyword,
        EntityType: this.listType,
        siteId: this.curSiteId
      };
      let { data, status } = await sitemapApi.getRefEntityList(
        this.curSiteId,
        para
      );
      this.addListData = data;
    },
    closeAddDialog() {
      this.addShow = false;
    },
    addSearch() {
      this.getAddList();
    },
    changeAddPage(page) {
      this.addPageIndex = page;
      this.getAddList();
    },
    changeAddSize(size) {
      this.addPageSize = size;
      this.getAddList();
    }
  },
  watch: {
    listType() {
      if (this.listType == "page") {
        this.type = "页面";
      } else if (this.listType == "news") {
        this.type = "文章";
      } else if (this.listType == "product") {
        this.type = "产品";
      }
    }
  }
};
</script>
<style scoped>
.tab /deep/ .el-tabs__item {
  height: 38px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  border-bottom: 1px solid #e4e7ed;
  background: rgba(245, 245, 245, 1);
  vertical-align: top;
  border-top: 2px solid transparent;
  width: 120px;
  box-sizing: border-box;
  padding: 0;
  vertical-align: top;
  text-align: center;
}
.tab /deep/ .el-tabs__item:nth-child(1) {
  border-radius: 4px 0 0 0;
}
.tab /deep/ .el-tabs__item:nth-child(2) {
  border-radius: 0 4px 0 0;
}
.tab /deep/ .el-tabs__nav {
  border-top: none;
}
.tab /deep/ .is-active {
  color: rgba(1, 192, 222, 1);
  border-top: 2px solid rgb(72, 201, 226);
  border-bottom: 1px solid transparent;
  background: rgb(255, 255, 255);
}
.smallTable /deep/ .el-table thead th {
  height: 45px !important;
}
.smallTable /deep/ .el-table td {
  padding: 10px 0 !important;
}
.smallTable /deep/ .el-table-column--selection .el-checkbox__inner {
  width: 15px !important;
  height: 15px !important;
}
.right /deep/ .el-select .el-input__inner {
  height: 36px;
}
</style>
<style lang="scss" scoped>
.tip {
  display: inline-block;
  margin-top: 32px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(9, 204, 235, 1);
  line-height: 22px;
  cursor: pointer;
}
.disabled {
  &:hover {
    cursor: not-allowed;
  }
}
.member-container {
  position: relative;
  .user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 24px;
    .member-list-title {
      border-left: 4px solid #01c0de;
      padding-left: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.overflow {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.content {
  margin-top: 24px;
  .autoType {
    width: 100%;
    display: flex;
    justify-content: center;
    .typeItem {
      width: 90px;
      height: 32px;
      border: 1px solid rgba(9, 204, 235, 1);
      color: rgba(9, 204, 235, 1);
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      &:nth-child(1) {
        border-radius: 2px 0px 0px 2px;
        border-right: none;
      }
      &:nth-child(3) {
        border-radius: 0px 2px 2px 0px;
        border-left: none;
      }
    }
    .typeItemActive {
      background: rgba(9, 204, 235, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  .addWrap {
    padding: 16px 0;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    .infoText {
      padding-top: 6px;
      span {
        font-size: 16px;
        color: rgba(161, 168, 177, 1);
        line-height: 22px;
      }
    }
    .operateBtn {
      .addBtn {
        width: 90px;
        height: 32px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px;
        color: rgba(255, 255, 255, 1);
        line-height: 32px;
        text-align: center;
        vertical-align: middle;
      }
      .previewBtn {
        display: inline-block;
        width: 90px;
        height: 32px;
        border-radius: 2px;
        border: 1px solid rgba(9, 204, 235, 1);
        color: rgba(9, 204, 235, 1);
        line-height: 32px;
        text-align: center;
        vertical-align: middle;
        margin-left: 24px;
      }
    }
  }
  .searchWrap {
    padding: 16px 0;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    .input-with-select {
      width: 400px;
    }
    .right {
      float: right;
      .rightText {
        display: inline-block;
        font-size: 14px;
        color: rgba(38, 38, 38, 1);
        line-height: 36px;
        margin-right: 32px;
      }
      .changeBtn {
        display: inline-block;
        button {
          padding: 8px;
          background: transparent;
          &:hover {
            background: rgba(9, 204, 235, 0.09);
          }
        }
        span {
          font-size: 14px;
          color: rgba(9, 204, 235, 1);
          line-height: 20px;
        }
      }
    }
    .batchDelete {
      .batchDeleteText {
        color: rgba(38, 38, 38, 1);
        line-height: 36px;
        span {
          color: #09cceb;
        }
      }
      .delete {
        margin-left: 24px;
        color: rgba(251, 77, 104, 1);
        padding: 8px;
        background: transparent;
        &:hover {
          background: rgba(251, 77, 104, 0.09);
        }
      }
      .cancel {
        margin-left: 16px;
        color: rgba(9, 204, 235, 1);
        padding: 8px;
        background: transparent;
        &:hover {
          background: rgba(9, 204, 235, 0.09);
        }
      }
    }
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
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    .title {
      margin-left: 24px;
      line-height: 70px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
    }
    .close-pannel {
      float: right;
      cursor: pointer;
      line-height: 70px;
      margin-right: 24px;
      font-size: 14px;
      color: #262626;
    }
    .tips {
      margin-left: 16px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(161, 168, 177, 1);
      line-height: 70px;
    }
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
      border-radius: 2px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
    .addDisabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .cancelBtn {
      margin-top: 24px;
      width: 90px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(9, 204, 235, 1);
      font-size: 12px;
      color: rgba(9, 204, 235, 1);
      line-height: 32px;
    }
  }
}
</style>

