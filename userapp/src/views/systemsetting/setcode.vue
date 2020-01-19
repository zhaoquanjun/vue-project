<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>设置签名/模板</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <el-row>
        <el-row class="user-list">
          <span class="member-list-title fs14">阿里云AK/SK>设置签名/模板</span>
          <button @click="$router.go(-1)" class="backupBtn cl-button cl-button--small cl-button--primary_notbg">返回</button>
        </el-row>
       
        <el-main>
          <div class="domain-menu">
            <el-tabs v-model="backupType" @tab-click="handleClick">
              <el-tab-pane label="签名管理" name="autograph"></el-tab-pane>
              <el-tab-pane label="模版管理" name="template"></el-tab-pane>
            </el-tabs>
            <button v-show="backupType == 'autograph'" class="cl-button btn-code cl-button--primary" @click="isAddAutograph = true">添加签名</button>
            <button v-show="backupType == 'template'" class="cl-button btn-code cl-button--primary" @click="isAddTemplate =true">添加模版</button>
          </div>

          <!-- 免费短信 -->
          <div >
            <el-table
              :data="messagelist"
              tooltip-effect="dark"
              class="content-table"
            >
              <template slot="empty">
                <div class="empty-table">
                  <img src="~img/memberManage/table-empty-default.png" />
                  <p>暂无数据</p>
                </div>
              </template>
              
              <el-table-column v-if="backupType == 'autograph'" prop="signName" label="签名名称"></el-table-column>
              <el-table-column v-if="backupType == 'autograph'" prop="createTime" label="创建时间"></el-table-column>

              <el-table-column v-if="backupType == 'template'" prop="tempName" label="模版名称"></el-table-column>

              <el-table-column v-if="backupType == 'template'" prop="tempCode" label="模板CODE"></el-table-column>

              <el-table-column v-if="backupType == 'template'" prop="tempContent" min-width='300'  label="模板内容"></el-table-column>

              <el-table-column v-if="backupType == 'template'" prop="templateType" label="模板类型"></el-table-column>
              
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="删除" placement="top">
                      <button @click="deleteCode(scope.row.id)">
                        <i class="iconfont iconshanchu cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-row>
    </el-main>
    <add-template
      v-if="isAddTemplate"
      @closeAddTemplate="closeAddTemplate"
      @saveAddTemplate="saveAddTemplate"
    ></add-template>
    <add-autograph
      v-if="isAddAutograph"
      @closeAddAutograph="closeAddAutograph"
      @saveAddAutograph="saveAddAutograph"
    ></add-autograph>
</el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import AddTemplate from "@/components/websiteManage/addCode/add-template";
import AddAutograph from "@/components/websiteManage/addCode/add-autograph";
import * as dashboardApi from "@/api/request/dashboardApi";
import { formatDateTime } from "@/api/index";
export default {
  components: {
    AddTemplate,
    AddAutograph,
    PageSubmenu
  },
  data() {
    return {
      backupType:'autograph',
      isAddTemplate: false,
      isAddAutograph: false,
      siteId: this.$store.state.dashboard.siteId,
      messagelist: []
    };
  },
  created(){
   this.init()
  },
  methods: {
    
    async init() {
      if(this.backupType === 'template'){
        //获取当前模版列表
        let { data } = await dashboardApi.getCustomTemplateList();
        this.messagelist = data
      } else {
        //获取当前模版列表
        let { data } = await dashboardApi.getSiteSMSSignList();
        this.messagelist = data
        console.log('getSiteSMSSignList',this.messagelist)
      }
      for (var i = 0; i < this.messagelist.length; i++) {
        this.messagelist[i].createTime = formatDateTime(
          this.messagelist[i].createTime,
          "yyyy-MM-dd hh:mm"
        );
        this.messagelist[i].tempName
      }
    },
    /**
     * 查看短信信息
     */
    async deleteCode(id) {
        let tips = this.backupType == 'autograph' ? '签名': '模版';
        this.$confirm(
                `确定要删除该${tips}吗？`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        if (action === "confirm") {
                          let data = false
                          if(this.backupType === 'template'){
                            data = await dashboardApi.removeCustomTemplate(id);
                          } else {
                            data  = await dashboardApi.deleteSiteSMSSignById(id);
                          }
                          if(data.data){
                            this.$notify({
                              customClass: "notify-success", // error success
                              message: `删除成功`,
                              duration: 1500,
                              showClose: false
                            });
                            this.init()
                          }else {
                            this.$notify({
                              customClass: "error", // error success
                              message: `删除失败`,
                              duration: 1500,
                              showClose: false
                            });
                          }
                        }
                    }
                }
            );
    },
    //table
    handleClick(){
      this.init()
    },
    //关闭添加模版
    closeAddTemplate(){
      this.isAddTemplate = false
    },
    //保存添加模版
    saveAddTemplate(val){
      this.isAddTemplate = false
      this.init()
    },
    //关闭添加签名
    closeAddAutograph(){
      this.isAddAutograph = false
    },
    //保存添加签名
    saveAddAutograph(val){
      this.isAddAutograph = false
      this.init()
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  right: 0;
}
.content-table /deep/ .el-tooltip .el-popover__reference {
  width: 100%;
}
.backupBtn {
  position: absolute;
  right: 16px;
  top: -8px;
  font-size: $--font-size-small;
}
.content-table {
  width: 100%;
  box-sizing: border-box;
}
.overflow {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.all-total {
  padding-left: 10px;
  height: 55px;
  font-size:$--font-size-small;
  font-weight:400;
  color:$--color-text-regular;
  line-height:55px;
  border: $--border-base;
  border-top: none;
  background: $--color-white;
  span {
    padding: 0 8px;
    color: $--color-danger;
  }
}

.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      margin: 24px 0;
      position: relative;
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
    }
  }
}

.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin-bottom: 12px;
  .btn-code {
    position: absolute;
    top: 8px;
    right: 16px;
  }
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

</style>
