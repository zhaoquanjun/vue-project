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
          <div v-show="isFirst">
            <button class="cl-button cl-button--primary cl-button--small" @click="saveAksk">保存</button>
          </div>
          <div v-show="!isFirst">
            <div v-show="!canEdit">
              <button
                class="cl-button cl-button--primary_notbg cl-button--small"
                @click="deleteAksk"
              >删除</button>
              <button class="cl-button cl-button--primary cl-button--small" @click="resetAksk">刷新</button>
            </div>
            <!-- <div v-show="canEdit">
              <button
                class="cl-button cl-button--primary_notbg cl-button--small"
                @click="cancelAksk"
              >取消</button>
              <button class="cl-button cl-button--primary cl-button--small" @click="saveAksk">保存</button>
            </div> -->
          </div>
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
                @blur="blurAkId"
                :disabled="!canEdit"
                placeholder="请输入Access Key ID"
              ></el-input>
              <div class="ym-form-item__error" v-show="errorAkIdShow">{{errorAkIdText}}</div>
            </div>
            <div class="akSecret">
              <div class="ak-title">Access Key Secret</div>
              <el-input
                size="medium"
                style="width:250px"
                type="password"
                v-model="akSecret"
                @blur="blurAkSecret"
                :disabled="!canEdit"
                placeholder="请输入Access Key Secret"
              ></el-input>
              <div class="ym-form-item__error" v-show="errorAkSecretShow">{{errorAkSecretText}}</div>
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
          >
            <el-table-column prop="features" label="功能" min-width="200"></el-table-column>
            <el-table-column prop="authority" label="权限" min-width="200"></el-table-column>
            <el-table-column prop="status" label="权限状态" :min-width="isFirst?50:300">
              <template slot-scope="scope">
                <div v-if="isFirst" class="waitAuthor">待授权</div>
                <div v-if="!isFirst">
                  <div v-if="!scope.row.status">
                    <div class="notAuthor" style="display:inline-block">未授权</div>
                    <div
                      class="waitAuthor"
                      style="display:inline-block"
                    >（AK/SK账号下无“SMS”权限，请开通并授权后重新配置）</div>
                  </div>
                  <div v-if="scope.row.status" class="successAuthor">授权成功</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="!isFirst" min-width="200">
              <template slot-scope="scope">
                <button
                  class="operatingBtn"
                  @click="manage"
                  v-if="scope.row.features == '短信服务'"
                >{{scope.row.status?"去管理":"去查看"}}</button>
                <a
                  :href="`${videoUrl}`"
                  class="operatingBtn"
                  v-if="scope.row.features == '视频点播'"
                >{{scope.row.status?"去管理":"去查看"}}</a>
                <button
                  class="operatingBtn"
                  style="margin-left:24px"
                  v-if="scope.row.status&&scope.row.features == '短信服务'"
                  @click="setTemplate"
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
import * as akskApi from "@/api/request/akskApi";
import { videoManageUrl } from "@/environment/index.js";
export default {
  components: {
    PageSubmenu
  },
  data() {
    return {
      canEdit: true,
      isFirst: true,
      akId: "",
      errorAkIdShow: false,
      errorAkIdText: "",
      akSecret: "",
      errorAkSecretShow: false,
      errorAkSecretText: "",
      oldAkId: "",
      oldAkSecret: "",
      listData: [
        {
          features: "短信服务",
          authority: "管理短信服务（SMS）的权限",
          status: false
        },
        {
          features: "视频点播",
          authority: "管理视频点播服务（VOD）的权限",
          status: false
        }
      ],
      videoUrl: videoManageUrl
    };
  },
  mounted() {
    this.getAksk();
  },
  methods: {
    async getAksk() {
      this.$Loading.show();
      let { data, status } = await akskApi.get();
      this.akId = data.ak;
      this.akSecret = data.sk;
      this.oldAkId = data.ak;
      this.oldAkSecret = data.sk;
      this.listData[0].status = data.smsAuthorization;
      this.listData[1].status = data.vodAuthorization;
      if (data.ak) {
        this.isFirst = false;
        this.canEdit = false;
      } else {
        this.isFirst = true;
        this.canEdit = true;
      }
      this.$Loading.hide();
    },
    async saveAksk() {
      if (this.akId == "") {
        this.errorAkIdShow = true;
        this.errorAkIdText = "请输入Access Key ID";
        return;
      } else if (this.akId.length > 50) {
        this.errorAkIdShow = true;
        this.errorAkIdText = "Access Key ID 长度不可超过50个字符";
        return;
      }
      if (this.akSecret == "") {
        this.errorAkSecretShow = true;
        this.errorAkSecretText = "请输入Access Key Secret";
        return;
      } else if (this.akSecret.length > 50) {
        this.errorAkSecretShow = true;
        this.errorAkSecretText = "Access Key Secret 长度不可超过50个字符";
        return;
      }
      let para = {
        ak: this.akId,
        sk: this.akSecret
      };
      let { data, status } = await akskApi.set(para);
      this.isFirst = false;
      this.canEdit = false;
      if (status === 200) {
        this.$notify({
          customClass: "notify-success",
          message: `配置成功`,
          duration: 2000,
          showClose: false
        });
      } else {
        this.$notify({
          customClass: "notify-error",
          message: `系统正忙，请稍后再试！`,
          duration: 2000,
          showClose: false
        });
      }
      this.getAksk();
    },
    async resetAksk() {
      // this.canEdit = true;
      let para = {
        ak: this.akId,
        sk: this.akSecret
      };
      let { data, status } = await akskApi.set(para);
      this.getAksk();
    },
    // cancelAksk() {
    //   this.akId = this.oldAkId;
    //   this.akSecret = this.oldAkSecret;
    //   this.canEdit = false;
    //   this.errorAkIdShow = false;
    //   this.errorAkSecretShow = false;
    // },
    deleteAksk() {
      this.$confirm(
        `删除AK/Sk后，阿里云短信与视频功能将不可使用，确认要删除吗？`,
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              let { status } = await akskApi.remove();
              if (status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功`,
                  duration: 2000,
                  showClose: false
                });
                this.getAksk();
                this.deleteTemplate();
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
    async deleteTemplate() {
      await akskApi.removeTemplate();
    },
    blurAkId() {
      if (this.akId == "") {
        this.errorAkIdShow = true;
        this.errorAkIdText = "请输入Access Key ID";
      } else if (this.akId.length > 50) {
        this.errorAkIdShow = true;
        this.errorAkIdText = "Access Key ID 长度不可超过50个字符";
      } else {
        this.errorAkIdShow = false;
        this.errorAkIdText = "";
      }
    },
    blurAkSecret() {
      if (this.akSecret == "") {
        this.errorAkSecretShow = true;
        this.errorAkSecretText = "请输入Access Key Secret";
      } else if (this.akSecret.length > 50) {
        this.errorAkSecretShow = true;
        this.errorAkSecretText = "Access Key Secret 长度不可超过50个字符";
      } else {
        this.errorAkSecretShow = false;
        this.errorAkSecretText = "";
      }
    },
    setTemplate() {
      this.$router.push({
        path: "/systemsetting/setcode"
      });
    },
    manage() {
      this.$router.push({
        path: "/website/sitemanage/messagesetting"
      });
    }
  }
};
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
      height: 56px;
    }
    .ym-form-item__error {
      margin-left: 150px;
      padding-top: 6px;
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
