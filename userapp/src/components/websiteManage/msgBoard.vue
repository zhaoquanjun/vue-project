<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu      
        :unReadCount="unReadCount"
      >
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="user-list">
        <span class="member-list-title fs14">留言管理</span>
      </el-row>
      <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
          <div class="searchInput head-item">
            <el-input
              size="medium"
              v-model="search"
              maxlength="50"
              placeholder="输入留言标题或内容搜索"
              @keyup.enter.native="searchEnterFun"
              :clearable="true"
            >
              <i class="el-icon-search el-input__icon searchIcon" slot="suffix" @click="searchEnterFun"></i>
            </el-input>
          </div>
          <div class="head-item">
            <div class="head-item">
              <span>状态</span>
              <span class="select-item">
                <el-select
                  size="small"
                  v-model="statusValue"
                  placeholder="请选择"
                  @change="changeStatus"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.statusValue"
                    :label="item.statusLabel"
                    :value="item.statusValue"
                  ></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="batch-header">
            <span>
              已选择
              <i>{{selectedCount}}</i>
              条留言
            </span>
            <div class="batch-header">
              <button  class="cl-button cl-button--text_primary" @click="_batchRemove">删除</button>
            </div>
          </div>
        </template>
      </el-header>
      <el-table
        ref="multipleTable"
        :data="msgBoardData.list"
        tooltip-effect="dark"
        class="content-table"
        :height="tableHeight - 41"
        @selection-change="handleSelectionChange"
        @sort-change='sortChange'
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <template slot="empty">
          <div class="empty-table" style="cursor: default">
            <img src="~img/memberManage/table-empty-default.png"/>
            <p>暂无留言</p>
          </div>
        </template>
        <el-table-column min-width="20"></el-table-column>
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          prop="title"
          label="留言标题"
          min-width="100"
          height="50"
        >
          <template slot-scope="scope">
            <div :class="{GreyFont:scope.row.status!==0}">
              <span class="isReply" v-show="scope.row.status === 2">已回复</span>
              <el-tooltip
                class="item" 
                effect="dark" 
                :content="scope.row.leavewordTitle" 
                placement="top"
              >
                <span class="ellipsis">{{scope.row.leavewordTitle}}</span>
              </el-tooltip>
            </div>
           
          </template>
        </el-table-column>
        <el-table-column
          prop="sourceSite"
          label="联系电话"
          min-width="100"
          height="50"
        >
          <template slot-scope="scope">
            <div :class="{GreyFont:scope.row.status!==0}">
               <el-tooltip
                class="item" 
                effect="dark" 
                :content="scope.row.contactNumber" 
                placement="top"
              >
                <span class="ellipsis">{{scope.row.contactNumber}}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="联系邮箱"
          min-width="100"
          height="50"
        >
          <template slot-scope="scope">
            <div :class="{GreyFont:scope.row.status!==0}">
              <el-tooltip
                class="item" 
                effect="dark" 
                :content="scope.row.contactEmail" 
                placement="top"
              >
                <span class="ellipsis">{{scope.row.contactEmail}}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="page"
          label="来源页面"
          min-width="80"
          height="50"
        >
          <template slot-scope="scope">
            <div :class="{GreyFont:scope.row.status!==0}">
              <el-tooltip
                class="item" 
                effect="dark" 
                :content="scope.row.pageTitle" 
                placement="top"
              >
                <span class="ellipsis">{{scope.row.pageTitle}}</span>
              </el-tooltip>  
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="msgStatus"
          min-width="80"
          height="50"
        >
          <template slot="header">
            <div>
              <span>状态</span>
            </div>
          </template>
          <template slot-scope="scope">
            <span class="circleIcon" v-if="scope.row.status===0"></span>
            <el-tooltip
              class="item" 
              effect="dark" 
              :content="scope.row.status===0 ?'未读':'已读'"
              placement="top"
            >
              <span class="ellipsis" :class="{redFont:scope.row.status===0, textIndent:scope.row.status!==0, GreyFont:scope.row.status!==0}">{{scope.row.status===0 ?'未读':'已读'}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          sortable="custom"
          label="留言时间"
          min-width="120"
          height="50"
        >
          <template slot-scope="scope">
            <div :class="{GreyFont:scope.row.status!==0}">
              <el-tooltip
                class="item" 
                effect="dark" 
                :content="scope.row.createTime.slice(0,10)+' '+scope.row.createTime.slice(11,16)" 
                placement="top" 
              >
                <span class="ellipsis">{{scope.row.createTime.slice(0,10)}} {{scope.row.createTime.slice(11,16)}}</span>
              </el-tooltip>  
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          min-width="80"
          height="50"
        >
        <template slot-scope="scope">
          <el-dialog
           title="留言详情"
           :visible.sync="dialogVisibleId === scope.row.id"
            width="30%"
            class="viewDetail"
            :show-close="false"
          >
            <i 
              class="el-icon el-icon-close cl-iconfont is-circle" 
              style="position: absolute;right:0px;top:20px;font-size: 14px;color: #9f9f9f;" @click="closeViewDetail"
            ></i>
            <p class="view-item">
              留言标题：{{scope.row.leavewordTitle}}
            </p>
            <template v-if="scope.row.contactEmail && scope.row.contactEmail !==''">
              <p class="view-item">
              联系邮箱：{{scope.row.contactEmail}}
              </p>
              <p class="view-item">
                <i style="vertical-align: top;">留言内容：</i>
                <i style="display: inline-block;width:336px;">
                  {{scope.row.leavewordContent}}
                </i>
              </p>
              <p 
                v-if="scope.row.status === 2" 
                class="view-item getReplyContent"
              >
                <i class="reply-content"> 回复：{{getReply.replyContent}}</i>
                <i class="reply-time">{{getReply.replyTime && getReply.replyTime.slice(0,10)}} {{getReply.replyTime && getReply.replyTime.slice(11,16)}}</i>
              </p>
              <textarea 
                v-if="scope.row.status!==2"
                name="reply" 
                :id="scope.row.id" 
                placeholder="回复意见"
                v-model="setReplyContent"
                maxlength="200"
                class="view-item setReplyContent"
              ></textarea>
              <p v-if="scope.row.status!==2" class="view-item replyRemark">
                * 回复意见将以邮件形式发送给用户
              </p>
            </template>
            <template v-else>
              <p class="view-item">
              联系电话： {{scope.row.contactNumber}}
              </p>
              <p class="view-item">
                <i style="vertical-align: top;">留言内容：</i>
                <i style="display: inline-block;width:336px;">
                  {{scope.row.leavewordContent}}
                </i>
              </p>
            </template>
            <span slot="footer" class="dialog-footer">
              <button
                class="cl-button cl-button--primary_notbg cl-button--small"
                slot="refenrence"
                @click="closeViewDetail"
              >取消</button>
              <Debounce :time="1000" !isDebounce v-if="scope.row.contactEmail && scope.row.contactEmail !==''">
                <button
                  class="cl-button cl-button--primary cl-button--small"
                  :class="{'is-disabled':scope.row.status===2}"
                  @click="_reply(scope.row)"
                >回复</button>
              </Debounce>
            </span>
          </el-dialog>
            <el-tooltip
              class="item" 
              effect="dark" 
              content="查看" 
              placement="top"
            >
              <i class="cl-icon iconfont iconchakan cl-iconfont is-square" @click="_viewDetail(scope.row)"></i>
            </el-tooltip>
             <el-tooltip
              class="item" 
              effect="dark" 
              content="删除" 
              placement="top"
            >
              <i class="cl-icon iconfont iconicon-huishou cl-iconfont is-square" @click="_remove(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-footer">
          <div class="cl-paganation pageing" :class="{'noJumper':msgBoardData.totalPage <= 10}"
            v-if="msgBoardData.totalRecord > 0"
          >
            <el-pagination
              background
              :layout="msgBoardData.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
              :total="msgBoardData.totalRecord"
              :page-size="msgBoardData.pageSize"
              :page-sizes="[10,20,50]"
              :current-page="1" 
              @size-change="handleSizeChange" @current-change="handleCurrentChange"
            >
              <div class="sizes-title">，每页显示</div>
              <button v-if="msgBoardData.totalPage > 10" class="paging-confirm">跳转</button>
            </el-pagination>
        </div>
      </div>
      
    </el-main>
  </el-container>
</template>
<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "_c/websiteManage/changeSite.vue";
import * as msgBoardApi from "@/api/request/msgBoardApi";
export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      dialogVisibleId: "",
      isBatchHeaderShow: false,
      curSiteId: this.$store.state.dashboard.siteId,
      multipleSelection: [],
      unReadCount: 0,
      search: "",
      selectedCount: "",
      tableHeight: 500,
      msgBoardData: [],
      setReplyContent: "",
      getReply: "",
      statusValue: -1,
      statusOptions: [
        {
          statusValue: -1,
          statusLabel: "全部"
        },
        
        {
          statusValue: 0,
          statusLabel: "未读"
        },
        {
          statusValue: 1,
          statusLabel: "已读"
        }
      ],
      getMsgboardListParas: {
        siteId: this.curSiteId,
        pageIndex: 1,
        pageSize: 10,
        queryKeywords: "",
        Status: -1,
        DescSort: true
      }
    }
  },
  mounted(){
    this.search = "";
    this.statusValue = -1;
    this.getMsgboardListParas.Status = -1;
    this.getMsgboardListParas.DescSort = true;this._getMsgboardList();
    this._getUnReadCount();
  },
  watch: {
    search() {
      if(this.search === "") {
        this.searchEnterFun()
      }
    },
    multipleSelection(){
      if(this.multipleSelection !== []){
        this.isBatchHeaderShow = true;
        this.selectedCount = this.multipleSelection.length;
        if(this.selectedCount == 0) {
          this.isBatchHeaderShow = false;
        }
      }else{
        this.isBatchHeaderShow = false;
      }
    }
  },
  methods: {
    /**
     * 获取siteId
     */
    getSiteId(siteId) {
      this._getMsgboardList(siteId);
      this.curSiteId = siteId;
    },
    /**
     * 选择切换网站
     */
    chooseWebsite(siteId) {
      this._getMsgboardList(siteId);
      this.curSiteId = siteId;
    },
    /**
     * 获取留言列表
     */
    async _getMsgboardList({siteId = this.curSiteId, pageIndex = 1, pageSize = 10, queryKeywords = "", Status = -1, DescSort = true} = {}) {
      this.$Loading.show();
      let { data, status } = await msgBoardApi.getMsgboardList(siteId, pageIndex, pageSize, queryKeywords, Status, DescSort);
      this.$Loading.hide();
      this.msgBoardData = data; 
    },
    /**
     * 获取未读信息数量
     */
    async _getUnReadCount() {
      let { data } = await msgBoardApi.getUnReadCount(this.curSiteId);
      this.unReadCount = data;
    },
    /**
     * 筛选留言状态
     */
    changeStatus(val) {
      this.getMsgboardListParas.Status = val;
      this.getMsgboardListParas.pageIndex = 1;
      this.getMsgboardListParas.pageSize = 10;
      this._getMsgboardList(this.getMsgboardListParas)
    },
    /**
     * 搜索留言标题
     */
    searchEnterFun() {
      this.getMsgboardListParas.queryKeywords = this.search;
      this.getMsgboardListParas.Status = -1;
      this.statusValue = -1;
      this._getMsgboardList(this.getMsgboardListParas)
    },
    /**
     * 单选或全选操作
     */
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    /**
     * 创建时间排序
     */
    sortChange(val){
      if (val.order == 'ascending') {
        this.getMsgboardListParas.DescSort = false;
      } else {
        this.getMsgboardListParas.DescSort = true;
      }
      this._getMsgboardList(this.getMsgboardListParas);
    },
    
    /**
     * 分页 跳转页面
     */
    handleCurrentChange(page) {
      this.getMsgboardListParas.pageIndex = page;
      this._getMsgboardList(this.getMsgboardListParas)
    },
    /**
     * 分页 改变每页数量
     */
    handleSizeChange(size) {
      this.getMsgboardListParas.pageSize = size;
      this._getMsgboardList(this.getMsgboardListParas)
    },
    /**
     * 回复留言
     */
    async _reply(row) {
      if(this.setReplyContent !== ""){
        let { data, status } = await msgBoardApi.setReplyContent(row.id, this.setReplyContent)
        if(status === 200) {
          this.$notify({
            customClass: "notify-success",
            message: `回复成功`,
            showClose: false,
            duration: 1000
          });
          this._upadateStatus(row.id,2);
          this.closeViewDetail();
        }
        
      }
      
    },
    /**
     * 更改状态
     */
    async _upadateStatus(id,code) {
      let { status } = await msgBoardApi.updateStatus(id, true, code)
    },
    /**
     * 查看留言详情
     */
    async _viewDetail(row) {
      this.dialogVisibleId = row.id;
      if(row.status === 0) {
        this.unReadCount -= 1;
        this._upadateStatus(row.id,1);
      }
      if(row.status === 2) {
        let { data, status } = await msgBoardApi.getReplyContent(row.id);
        if(status === 200) {
          this.getReply = data;
        }
      }
    },
    /**
     * 关闭 留言详情弹窗
     */
    closeViewDetail() {
      this.dialogVisibleId = "";
      this.setReplyContent = "";
      this._getMsgboardList(this.getMsgboardListParas)
    },
    /**
     * 批量删除
     */
    _batchRemove() {
      if(this.selectedCount !== 0){
        let leavewordIds=[];
        this.multipleSelection.forEach(item => {
          leavewordIds.push(item.id)
        })
        this.$confirm(
          "留言删除后将不可恢复，确认要删除吗？",
          "提示",
          {
            iconClass: "icon-warning",
            callback: async action => {
              if(action === "confirm") {
                let { status } = await msgBoardApi.removeMsg(leavewordIds);
                if(status === 200) {
                  this.$notify({
                    customClass: "notify-success",
                    message: `删除成功!`,
                    showClose: false,
                    duration: 1000
                  });
                  this._getMsgboardList(this.getMsgboardListParas);
                }
              }
            }
          }
        )
      }
    },
    /**
     * 删除留言
     */
    _remove(row) {
      this.$confirm(
        "留言删除后将不可恢复，确认要删除吗？",
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if(action === "confirm") {
              let { status } = await msgBoardApi.removeMsg(row.id);
              if(status === 200) {
                if(row.status==0){
                  this.unReadCount -= 1;
                }
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1000
                });
                this._getMsgboardList(this.getMsgboardListParas);
              }
            }
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
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
.redFont {
  color: $--color-danger;
}
.GreyFont {
  color: #A09FA2;
}
.content-header {
  display: flex;
  align-items: center;
  background: $--color-white;
  height: 60px !important;
  border: $--border-base;
  border-radius: $--border-radius-base;
  margin-bottom: 16px;

  .searchInput {
    display: inline-block;
    width: 200px;
    box-sizing: border-box;
    overflow: hidden;

    .searchIcon {
      cursor: pointer;
      color:$--color-text-secondary;
    }
  }
}

.head-item {
  display: inline-block;
  flex: none;
  margin-left: 16px;
}
// 批量操作
.batch-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 16px; 
  span {
    width: 120px;
    i {
      color: $--color-primary;
    }
  }
  .batch-hanlder {
      padding-left: 24px;
  }
}

.select-item {
  display: inline-block;
  width: 85px;
  box-sizing: border-box;
  height: $--height-base;
  margin: 0 16px 0 7px;
}
.list-footer {
  padding: 24px 0 10px 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  color:#A1A8B1;

  .pageing {
    display: inline-block;
    position: relative;
    margin-top: 0;
    padding-bottom: 0;
    margin-left: auto;
  }
  .sizes-title {
    display: inline-block;
    margin-right: 8px;
  }
}

.circleIcon {
  display:inline-block;
  width:6px;
  height:6px;
  border-radius:50%;
  background: $--color-danger;
  margin-right:6px;
}
.textIndent {
  text-indent: 12px;
}
.viewDetail {
  .view-item {
    font-size: $--font-size-small;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: $--font-weight-base;
    color: $--color-text-primary;
    line-height:17px;
    margin-bottom: 16px;
  }
  .setReplyContent {
    box-sizing: border-box;
    width: 400px;
    height: 110px;
    padding: 10px;
    margin-top: 8px;
    margin-bottom: 0px;
    border-radius: $--border-radius-base;
    border: $--border-base;
  }
  .getReplyContent {
    background-color: $--background-color-hover;
    box-sizing: border-box;
    width: 400px;
    padding: 10px;
    color: #4E4E4E;
    border-radius: $--border-radius-base;
    .reply-content {
      display: block;
      margin-bottom: 32px;
    }
    .reply-time {
      display: block;
      text-align: right;
    }
  }
  .replyRemark {
    color: $--color-danger;
  }
}

.isReply {
  width: 36px;
  height: 14px;
  background: rgba(254, 152, 55, 0.2);
  border-radius: 1px;
  font-size: 10px;
  color: rgba(254, 152, 55, 1);
  line-height: 14px;
  text-align: center;
  position: absolute;
  top: 0px;
  left: -85px;
  transform: scale(0.8);
  -webkit-transform:scale(0.8);  /*兼容-webkit-引擎浏览器*/
  -moz-transform:scale(0.8);     /*兼容-moz-引擎浏览器*/
}
[class*="iconfont"] {
  font-size: 12px;
  margin-right: 24px;
}

.viewDetail /deep/ .el-table thead th:nth-child(7)>.cell {
  margin-left: 12px !important;
}
.viewDetail /deep/ .el-dialog {
  width: 448px !important;
  box-shadow: $--box-shadow-light;
  border-radius: 4px;
}
.viewDetail /deep/ .el-dialog__title {
  font-size: $--font-size-medium;
  font-family: PingFangSC-Medium,PingFang SC;
  font-weight: $--font-weight-primary;
  color: $--color-text-primary;
  line-height: 22px;
}
.viewDetail /deep/ .el-dialog__header {
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 32px;
}
.viewDetail /deep/ .el-dialog__body {
  padding-left: 24px;
  padding-right: 24px;
}
.viewDetail /deep/ .el-dialog__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.list-footer /deep/ .el-pagination {
  display: flex;
  align-items: center;
  color:#A1A8B1;
  font-weight: 400;
  line-height: 32px;
}
.list-footer /deep/ .el-pagination__total {
  color:#A1A8B1;
  font-weight: 400;
  line-height: 32px;
  height: 32px;
}
.list-footer /deep/ .el-pager li {
  padding: 0;
  margin: 0;
  background-color: $--color-white;
  border: 1px solid $--color-text-secondary;
}
.list-footer /deep/ .el-pager li+li {
  border-left: none;
}
.list-footer /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: $--color-primary;
}
.list-footer /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $--color-primary;
  color: $--color-white;
}
.list-footer /deep/ .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: $--color-primary;
}
.list-footer /deep/ .btn-prev {
  margin:0;
  background-color: $--color-white;
  border: 1px solid $--color-text-secondary;
  border-right: none;
}
.list-footer /deep/ .btn-next {
  margin:0;
  background-color: $--color-white;
  border: 1px solid $--color-text-secondary;
  border-left: none;
}
.list-footer /deep/ .el-pager {
  border-left: none;
  border-right: none;
}
.content-table /deep/ .el-table__empty-text{
    width: auto;
}
</style>