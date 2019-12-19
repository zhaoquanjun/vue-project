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
          <a class="backupBtn">返回</a>
        </el-row>
       
        <el-main>
          <div class="domain-menu">
            <el-tabs v-model="backupType" @tab-click="handleClick">
              <el-tab-pane label="签名管理" name="autograph"></el-tab-pane>
              <el-tab-pane label="模版管理" name="template"></el-tab-pane>
            </el-tabs>
          </div>

          <!-- 免费短信 -->
          <div >
            <el-table
              :data="messagelist"
              tooltip-effect="dark"
              class="content-table"
            >
              <el-table-column prop="messageinfo2" label="签名名称"></el-table-column>
              <el-table-column prop="messageinfo2" label="创建时间"></el-table-column>
              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                    <el-tooltip content="删除备份包" placement="top">
                      <button @click="chakan( scope )">
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
</el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import * as siteBackupApi from "@/api/request/siteBackupApi";
export default {
  components: {
    PageSubmenu
  },
  data() {
    return {
        backupType:'autograph',
      messagelist: [
        {
          messageinfo1: '注册网站验证码',
          messageinfo2: '云梦网络',
          messageinfo3: '(您的验证码为${code}，该验证码5分钟内有效，请勿泄露于他人！)'
        },
        {
          messageinfo1: '找回密码验证码',
          messageinfo2: '为设置',
          messageinfo3: '未设置'
        }
      ]
    };
  },
  created(){
   
  },
  methods: {
    
    /**
     * 查看短信信息
     */
    async chakan(siteId) {
      
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
  right: 0;
  top: 0;
  font-size: $--font-size-small;
  line-height: 14px;
  color: $--color-primary;
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
      margin: 16px 0;
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
