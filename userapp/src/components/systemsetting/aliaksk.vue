<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <div class="user-list">
        <span class="member-list-title">阿里云AK/Sk</span>
        <div class="editBtn">
          <button class="cl-button cl-button--primary">保存</button>
        </div>
      </div>
      <div class="configuration-wrap">
        <div class="configuration-title">配置AK/SK</div>
        <div class="configuration-content">
          <div>
            <div class="akId">
              <div class="ak-title">Access Key ID</div>
              <el-input
                size="medium"
                style="width:250px"
                v-model="akId"
                placeholder="请输入Access Key ID"
              ></el-input>
            </div>
            <div class="akSecret">
              <div class="ak-title">Access Key Secret</div>
              <el-input
                size="medium"
                style="width:250px"
                v-model="akSecret"
                placeholder="请输入Access Key Secret"
              ></el-input>
            </div>
            <div class="akLink">
              <div class="ak-title"></div>
              <a class="link" href>如何获取AccessKey ID和AccessKey Secret？</a>
            </div>
          </div>
        </div>
      </div>
      <div class="features-wrap">
        <div class="features-title">
          功能与权限
          <el-tooltip class="item" effect="dark" placement="top" content="如何配置AK/SK功能与权限">
            <i
              class="iconfont iconicon-exclamationmark"
              style="color:#e5e5e5;margin-left:12px;line-height:1"
            ></i>
          </el-tooltip>
        </div>
        <div class="table-list" id="table-list">
          <el-table
            ref="multipleTable"
            :data="listData"
            tooltip-effect="dark"
            class="content-table"
            :highlight-current-row="true"
          >
            <el-table-column prop="features" label="功能" min-width="200"></el-table-column>
            <el-table-column prop="authority" label="权限" min-width="200"></el-table-column>
            <el-table-column prop="status" label="权限状态" min-width="300">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 0" class="waitAuthor">待授权</div>
                <div v-if="scope.row.status == 1">
                  <div class="notAuthor" style="display:inline-block">未授权</div>
                  <div
                    class="waitAuthor"
                    style="display:inline-block"
                  >（AK/SK账号下无“SMS”权限，请开通并授权后重新配置）</div>
                </div>
                <div v-if="scope.row.status == 2" class="successAuthor">授权成功</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="true" min-width="200">
              <template slot-scope="scope">
                <button class="operatingBtn" v-if="scope.row.status == 1">去查看</button>
                <button class="operatingBtn" v-if="scope.row.status == 2">去管理</button>
                <button
                  class="operatingBtn"
                  style="margin-left:24px"
                  v-if="scope.row.status == 2&&scope.row.features == '短信服务'"
                >设置签名/模板</button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
export default {
  components: {
    PageSubmenu
  },
  data() {
    return {
      akId: "",
      akSecret: "",
      listData: [
        {
          features: "短信服务",
          authority: "管理短信服务（SMS）的权限",
          status: 0
        },
        {
          features: "视频点播",
          authority: "管理视频点播服务（VOD）的权限",
          status: 1
        },
        {
          features: "视频点播",
          authority: "管理视频点播服务（VOD）的权限",
          status: 2
        },
        {
          features: "短信服务",
          authority: "管理短信服务（SMS）的权限",
          status: 2
        }
      ]
    };
  },
  created() {},
  methods: {
      hasClass(ele, cls) {
          console.log(ele)
        return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
      },
      removeClass(ele, cls) {
          console
  if (this.hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
},
      click(row, col, e){
          console.log(arguments)
          let tr = e.path && e.path[2];

          let trList = document.getElementsByClassName("customClass")[0];

          if(this.hasClass(tr,"customClass")){
             this.removeClass(tr,'customClass')
          }else{

               trList && this.removeClass(trList,'customClass')
               tr.className = tr.className + " customClass"
          } 
          
      }
  }
};
</script>
<style>
.customClass{
    background: red !important;
}
.current-row {
    border: 1px solid red;
    border-collapse: collapse;
}
.current-row td {
    border-bottom:none;    
    }
</style>
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
.editBtn {
  position: absolute;
  right: 16px;
  top: 16px;
}
.configuration-wrap {
  width: 100%;
  background: $--color-white;
  border: $--border-base;
  .configuration-title {
    height: 45px;
    font-size: $--font-size-base;
    color: $--color-text-primary;
    font-weight: $--font-weight-primary;
    line-height: 44px;
    border-bottom: $--border-base;
    padding-left: 16px;
    box-sizing: border-box;
  }
  .configuration-content {
    height: 192px;
    display: flex;
    justify-content: center;
    .ak-title {
      width: 150px;
      font-size: $--font-size-base;
      color: $--color-text-primary;
      display: inline-block;
      text-align: right;
      padding-right: 12px;
      box-sizing: border-box;
    }
    .akId {
      margin-top: 32px;
      height: 56px;
    }
    .akSecret {
      height: 48px;
    }
    .akLink {
      .link {
        font-size: $--font-size-small;
        color: $--color-primary;
      }
    }
  }
}
.features-wrap {
  margin-top: 16px;
  width: 100%;
  background: $--color-white;
  border: $--border-base;
  .features-title {
    height: 45px;
    font-size: $--font-size-base;
    color: $--color-text-primary;
    font-weight: $--font-weight-primary;
    line-height: 44px;
    border-bottom: $--border-base;
    padding-left: 16px;
    box-sizing: border-box;
  }
  .table-list {
    /deep/ .el-table {
      border: none;
    }
  }
}
.waitAuthor {
  color: $--color-text-regular;
  font-size: $--font-size-small;
  font-weight: $--font-weight-base;
}
.notAuthor {
  color: $--color-danger;
  font-size: $--font-size-small;
  font-weight: $--font-weight-base;
}
.successAuthor {
  color: $--color-success;
  font-size: $--font-size-small;
  font-weight: $--font-weight-base;
}
.operatingBtn {
  color: $--color-primary;
}

</style>
