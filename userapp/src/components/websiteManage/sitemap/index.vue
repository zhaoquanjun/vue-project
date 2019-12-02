<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="user-list">
        <span class="member-list-title fs14">网站地图</span>
      </el-row>
      <el-row class="content">
        <div class="domain-menu">
          <el-tabs v-model="uploadType" :before-leave="beforeClick">
            <el-tab-pane label="系统自动生成" name="auto"></el-tab-pane>
            <el-tab-pane label="手动上传" name="manual"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="autoCreate" v-show="uploadType == 'auto'">
          <div class="autoType">
            <span>类型</span>
            <ul class="typeWrap">
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
          </div>

          <div class="addWrap">
            <div class="infoText">
              <span>自动生成网站地图</span>
              <i class="iconfont iconicon-exclamationmark" style="color:#e5e5e5;margin-left:8px"></i>
            </div>
            <div class="operateBtn">
              <button class="cl-button cl-button--primary" @click="showAddDialog">{{addType}}</button>
              <a
                class="previewBtn cl-button cl-button--primary_notbg"
                :href="`${previewSitemapUrl}${curSiteId}`"
                target="_blank"
              >预览</a>
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
                  class="textBtn_primary"
                  :class="{disabled:listData.list.length == 0}"
                  @click="choseBatchSetting('priority')"
                >权重</button>
                <span style="margin:0px 8px">|</span>
                <button
                  class="textBtn_primary"
                  :class="{disabled:listData.list.length == 0}"
                  @click="choseBatchSetting('frequency')"
                >更新频率</button>
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
                  <button
                    class="textBtn_info"
                    style="margin-right:8px"
                    @click="determine('priority')"
                  >确定</button>
                  <button class="textBtn_delete" @click="cancelSetting">取消</button>
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
                  <button
                    class="textBtn_info"
                    style="margin-right:8px"
                    @click="determine('frequency')"
                  >确定</button>
                  <button class="textBtn_delete" @click="cancelSetting">取消</button>
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
          <div style="position:relative">
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
            <i class="iconfont iconguanbi cl-iconfont is-circle close-pannel" @click="closeAddDialog"></i>
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
                    <p>无数据</p>
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
                <div 
                  class="cl-pagination pageing" 
                  id="pageing" 
                  :class="{'noJumper':addListData.totalPage <= 10}"
                >
                  <slot name="paging"></slot>
                  <el-pagination
                    v-if="addListData.totalRecord > 0"
                    background
                    :layout="addListData.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                    :total="addListData.totalRecord"
                    :page-size="addListData.pageSize"
                    :page-sizes="[10,20,50]"
                    @current-change="changeAddPage"
                    @size-change="changeAddSize"
                  >
                    <div class="sizes-title">，每页显示</div>
                    <button v-if="addListData.totalPage > 10" class="paging-confirm">跳转</button>
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <div class="confirm">
            <button
              class="confirmBtn cl-button cl-button--primary"
              :class="{'is-disabled':addSelectedList.length == 0}"
              @click="add"
            >确定</button>
            <button class="cancelBtn cl-button cl-button--primary_notbg" @click="closeAddDialog">取消</button>
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
      this.$refs.multipleTable.clearSelection();
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
      this.$refs.multipleTable.clearSelection();
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
<style lang="scss" scoped>
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin-bottom: 12px;
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.domain-menu /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
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
</style>
<style lang="scss" scoped>
.tip {
  display: inline-block;
  position: absolute;
  margin-top: 32px;
  font-size: $--font-size-base;
  color: $--color-primary;
  cursor: pointer;
}
.disabled {
  &:hover {
    cursor: not-allowed;
  }
}
.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      margin: 24px 0;
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
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
  .autoCreate {
    background: $--color-white;
    .autoType {
      border: $--border-base;
      border-bottom: none;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      .typeWrap {
        margin-left: 16px;
        display: flex;
        justify-content: center;
        .typeItem {
          width: 72px;
          height: 32px;
          line-height: 32px;
          border: $--border-base;
          text-align: center;
          cursor: pointer;
          &:nth-child(1) {
            border-radius: 2px 0px 0px 2px;
          }
          &:nth-child(2) {
            margin-left: -1px;
          }
          &:nth-child(3) {
            margin-left: -1px;
            border-radius: 0px 2px 2px 0px;
          }
        }
        .typeItemActive {
          z-index: 2;
          border: 1px solid $--color-primary;
          color: $--color-primary;
        }
      }
    }
    .addWrap {
      padding: 0 16px 12px 24px;
      border: $--border-base;
      border-top: none;
      display: flex;
      justify-content: space-between;
      .infoText {
        padding-top: 8px;
        span {
          font-size: $--font-size-small;
        }
      }
      .operateBtn {
        .previewBtn {
          display: inline-block;
          box-sizing: border-box;
        }
      }
    }
    .searchWrap {
      border-left: $--border-base;
      border-right: $--border-base;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      .input-with-select {
        width: 192px;
      }
      .right {
        float: right;
        .rightText {
          display: inline-block;
          font-size: $--font-size-small;
          margin-right: 32px;
        }
        .changeBtn {
          display: inline-block;
          .textBtn_primary {
            font-size: $--font-size-small;
            color: $--color-primary;
            line-height: 32px;
          }
          .textBtn_info {
            font-size: $--font-size-small;
            color: $--color-info;
            line-height: 32px;
          }
          .textBtn_delete {
            font-size: $--font-size-small;
            color: $--color-danger;
            line-height: 32px;
          }
        }
      }
      .batchDelete {
        .batchDeleteText {
          color: rgba(38, 38, 38, 1);
          line-height: 32px;
          span {
            color: $--color-primary;
          }
        }
        .delete {
          margin-left: 24px;
          color: $--color-danger;
        }
        .cancel {
          margin-left: 16px;
          color: $--color-info;
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
      margin-top: 20px;
      margin-right: 24px;
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
      margin-top: 24px;
      margin-left: 24px;
    }
    .cancelBtn {
      margin-top: 24px;
    }
  }
}
</style>

