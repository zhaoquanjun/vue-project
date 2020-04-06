<template>
  <el-container class="email-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="email-content--area page-scroll">
      <div class="page-title">邮件配置</div>
      <div class="page-tips">
        提示：配置邮件服务器后，您在对网站用户的留言进行回复时，网站会通过您配置的邮箱将回复内容发送给用户
      </div>
      <div class="email-content" :flag="emailForm.account">
        <div v-show="!hasSettingConfig">
          <div class="content-empty">
            <div class="icon-desc">
              <img src="~img/siteManage/email_empty_icon.png" alt="" />
              <p>暂无数据</p>
            </div>
            <button
              class="start-setting cl-button cl-button--small cl-button--primary"
              @click="_handleSettingEmailConfig"
            >
              立即配置
            </button>
          </div>
          <div class="friendly-tips">
            <h3>成功配置邮件服务器后：</h3>
            <ul>
              <li>
                1、您可使用该邮箱回复网站留言（未配置时，系统将通过notice@clouddream.net作为回复邮箱）
              </li>
              <li>
                2、收到用户留言时，可通过该邮箱接收通知（未配置时，系统将通过notice@clouddream.net作为回复邮箱）
              </li>
              <li>
                3、注册以及登录您网站的会员，通过邮箱进行相关验证时，将通过该邮箱发送验证消息
              </li>
            </ul>
          </div>
        </div>
        <div v-show="hasSettingConfig">
          <div class="email-setting--show">
            <span class="email">{{ emailForm.accountName }}</span>
            <span class="edge">已配置</span>
            <button
              @click="_handleSettingEmailConfig"
              class="cl-button cl-button--small cl-button--primary"
            >
              修改配置
            </button>
            <button
              @click="_handleDeleteEmailConfig"
              class="cl-button cl-button--small cl-button--primary_notbg"
            >
              删除配置
            </button>
          </div>
          <div class="email-setting-list">
            <div class="list-header">
              <span>发信日志</span>
              <div v-show="emailData.length">
                <label>发送状态：</label>
                <el-select
                  style="width: 100px;"
                  v-model="defaultSelect"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in selecteData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="list-table" v-show="emailData.length">
              <el-table :data="emailData">
                <el-table-column label="邮件标题" min-width="400">
                  <template slot-scope="scope">
                    <span class="ellipsis">{{ scope.row.emailTitle }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="收件人邮箱">
                  <template slot-scope="scope">
                    <span class="ellipsis">{{ scope.row.emailAddress }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sendDateTime" label="发送时间">
                </el-table-column>
                <el-table-column label="发送状态">
                  <template slot-scope="scope">
                    <span class="success" v-show="scope.row.sendStatus"
                      >发送成功</span
                    ><span class="fail" v-show="!scope.row.sendStatus"
                      >发送失败</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="list-empty" v-show="!emailData.length">
              <img src="~img/siteManage/email_empty_icon.png" alt="" />
              <p>暂无数据</p>
            </div>
          </div>
        </div>
        <el-drawer
          :show-close="false"
          :wrapperClosable="false"
          size="400px"
          :visible.sync="drawerConfig.drawerShow"
          class="drawer-area"
        >
          <div class="drawer-title" slot="title">
            <span class="drawer-title--text">
              <slot name="titleName">{{ drawerConfig.title }}</slot>
            </span>
            <i
              class="iconfont iconguanbi cl-iconfont is-circle"
              @click="_handleBeforecloseDrawer()"
            ></i>
          </div>
          <div class="drawer-content" v-scrollBar>
            <slot name="content">
              <div class="content-tips">
                提示：您需要开启邮箱的SMTP协议才能使用该功能，通常在您
                邮箱的设置菜单可以进行开启SMTP协议的设置。
              </div>
              <div class="form-area">
                <el-form
                  ref="emailForm"
                  :model="emailForm"
                  :rules="rules"
                  @submit.native.prevent
                  label-width="90px"
                >
                  <el-form-item label="邮箱账号" prop="accountName">
                    <el-input
                      @blur="_handleBlurAccount"
                      v-model="emailForm.accountName"
                      maxLength="50"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱密码" prop="password">
                    <el-input
                      type="password"
                      v-model="emailForm.password"
                      maxLength="30"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱服务器" prop="host">
                    <el-input
                      v-model="emailForm.host"
                      maxLength="50"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="端口" prop="port">
                    <el-input
                      v-model="emailForm.port"
                      maxLength="10"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="发件人姓名">
                    <el-input v-model="emailForm.fromAlias"></el-input>
                  </el-form-item>
                  <el-form-item label="SSL">
                    <el-switch v-model="emailForm.enableSsl"></el-switch>
                  </el-form-item>
                </el-form>
              </div>
            </slot>
          </div>
          <div class="drawer-footer">
            <Debounce :time="1000" !isDebounce>
              <button
                class="confirmBtn cl-button cl-button--primary cl-button--small"
                @click="_handleConfirmSetting('emailForm')"
              >
                <slot name="confirmName">确定</slot>
              </button>
            </Debounce>
            <button
              class="cl-button cl-button--primary_notbg cl-button--small"
              @click="_handleBeforecloseDrawer()"
            >
              取消
            </button>
          </div>
        </el-drawer>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import * as emailApi from "@/api/request/siteEmailApi";
export default {
  components: {
    PageSubmenu
  },
  data() {
    var alidateAccountName = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!value) {
        return callback(new Error("邮箱账号不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("邮箱账号格式错误"));
      } else {
        callback();
      }
    };
    var alidatePort = (rule, value, callback) => {
      let numReg = /^\d+$/;
      if (!value) {
        return callback(new Error("端口不能为空"));
      } else if (!numReg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      emailData: [],
      selecteData: [
        { label: "全部状态", value: 0 },
        { label: "发送成功", value: 1 },
        { label: "发送失败", value: 2 }
      ],
      emailForm: {
        accountName: "",
        password: "",
        host: "",
        port: 80,
        fromAlias: "",
        enableSsl: false,
        id: this.$store.state.dashboard.siteId
      },
      rules: {
        accountName: [
          { required: true, validator: alidateAccountName, trigger: "submit" }
        ],
        password: [
          { required: true, message: "邮箱密码不能为空", trigger: "submit" }
        ],
        host: [
          {
            required: true,
            message: "邮箱服务器地址不能为空",
            trigger: "blur"
          }
        ],
        port: [{ required: true, validator: alidatePort, trigger: "submit" }],
        fromAlias: [
          { required: false, message: "请填写发件人姓名", trigger: "submit" }
        ]
      },
      emailSource: [
        { email: "qq.com", port: 25, ssl: false },
        { email: "exmail.qq.com", port: 25, ssl: false },
        { email: "163.com", port: 25, ssl: false },
        { email: "vip.163.com", port: 25, ssl: false },
        { email: "126.com", port: 25, ssl: false },
        { email: "yeah.com", port: 25, ssl: false },
        { email: "netease.com", port: 25, ssl: false },
        { email: "139.com", port: 25, ssl: false },
        { email: "gmail.com", port: 25, ssl: false },
        { email: "outlook.com", port: 25, ssl: false },
        { email: "sina.com", port: 25, ssl: false },
        { email: "vip.sina.com", port: 25, ssl: false },
        { email: "alibaba.com.cn", port: 25, ssl: false },
        { email: "aliyun.com", port: 25, ssl: false },
        { email: "sohu.com", port: 25, ssl: false },
        { email: "vip.sohu.com", port: 25, ssl: false },
        { email: "yahoo.com", port: 25, ssl: false },
        { email: "live.com", port: 25, ssl: false }
      ],
      hasSettingConfig: true,
      defaultSelect: "全部状态",
      drawerConfig: {
        drawerShow: false,
        title: "配置邮件服务器"
      }
    };
  },
  created() {
    this._getEmailConfig();
    this._getEmailSendInfo();
  },
  methods: {
    async _getEmailSendInfo() {
      let { data } = await emailApi.getEmailSendInfo();
      this.emailData = data;
    },
    /**
     * 获取邮箱配置api
     */
    async _getEmailConfig() {
      let { status, data } = await emailApi.getEmailConfig();
      if (status === 200) {
        this.hasSettingConfig = true;
        this.emailForm.accountName = data.accountName;
        this.emailForm.password = data.password;
        this.emailForm.host = data.host;
        this.emailForm.port = data.port;
        this.emailForm.fromAlias = data.fromAlias;
        this.emailForm.enableSsl = data.enableSsl;
        this.emailForm.id = data.id;
        this._getEmailSendInfo();
      } else if (status === 204) {
        this.hasSettingConfig = false;
      } else {
        console.log("get data failed by error");
      }
    },
    /**
     * 创建邮箱配置api
     */
    async _createEmailConfig() {
      let { status, data } = await emailApi.createEmailConfig(this.emailForm);
      console.log(status, data);
      if (status === 200) {
        this.$notify({
          customClass: "notify-success", //  notify-success ||  notify-error
          message: `配置成功!`,
          showClose: false,
          duration: 1000
        });
        this._getEmailConfig();
      } else {
        this.$notify({
          customClass: "notify-error", //  notify-success ||  notify-error
          message: `参数配置错误!`,
          showClose: false,
          duration: 1000
        });
      }
    },
    /**
     * 编辑邮箱配置api
     */
    async _editEmailConfig() {
      let { status, data } = await emailApi.editEmailConfig(this.emailForm);
      console.log(status, data);
      if (status === 200) {
        this.$notify({
          customClass: "notify-success", //  notify-success ||  notify-error
          message: `配置成功!`,
          showClose: false,
          duration: 1000
        });
        this._getEmailConfig();
      } else {
        this.$notify({
          customClass: "notify-error", //  notify-success ||  notify-error
          message: `参数配置错误!`,
          showClose: false,
          duration: 1000
        });
      }
    },
    /**
     * 删除邮箱配置api
     */
    async _deleteEmailConfig() {
      let { status, data } = await emailApi.deleteEmailConfig(this.emailForm);
      console.log(status, data);
    },
    /**
     * 唤起配置邮箱抽屉
     */
    _handleSettingEmailConfig() {
      this.drawerConfig.drawerShow = true;
    },
    /**
     * 关闭抽屉前/关闭抽屉操作
     */
    _handleBeforecloseDrawer() {
      this.drawerConfig.drawerShow = false;
      this.$refs["emailForm"].resetFields();
    },
    /**
     * 确认邮箱设置操作
     */
    _handleConfirmSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._createEmailConfig();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 删除邮箱配置操作
     */
    _handleDeleteEmailConfig() {
      this.$confirm(
        "删除配置后您将不能通过该邮箱发送消息，确定删除吗",
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              this._deleteEmailConfig();
            }
          }
        }
      );
    },
    /**
     * 修改邮箱账号 blur 事件
     */
    _handleBlurAccount() {
      let result = this._checkEamilIsInSource(this.emailForm.accountName);
      if (result.port) {
        this.emailForm.port = result.port;
        this.emailForm.enableSsl = result.ssl;
      }
    },
    _checkEamilIsInSource(value) {
      const o = {
        port: "",
        ssl: false
      };
      for (var i = 0; i < this.emailSource.length; i++) {
        if (value.indexOf(this.emailSource[i].email) > -1) {
          o.port = this.emailSource[i].port;
          o.ssl = this.emailSource[i].ssl;
        }
      }
      return o;
    }
  }
};
</script>

<style lang="scss" scoped>
.email-container {
  .email-content--area {
    padding: 24px 16px;

    .page-title {
      margin: 16px 0;
      padding-left: 8px;
      font-size: $--font-size-base;
      border-left: 2px solid $--color-primary;
    }

    .page-tips {
      padding: 9px 12px 6px;
      font-size: 12px;
      line-height: 17px;
      color: $--color-success;
      background: #f3fff7;
      border: 1px solid $--color-success;
    }

    .email-setting--show {
      margin-top: 16px;
      padding: 16px;
      border: $--border-base;
      border-radius: $--border-radius-base;
      background-color: $--color-white;

      .email {
        font-size: $--font-size-base;
        font-weight: 400;
        color: $--color-text-primary;
        line-height: 20px;
      }

      .edge {
        margin-left: 8px;
        padding: 2px 4px;
        font-size: $--font-size-small;
        color: $--color-white;
        line-height: 17px;
        background-color: $--color-primary;
      }

      button {
        margin-top: -5px;
        float: right;

        &:first-of-type {
          margin-left: 16px;
        }
      }
    }

    .email-setting-list {
      margin-top: 16px;
      border-top-left-radius: $--border-radius-base;
      border-top-right-radius: $--border-radius-base;
      background-color: $--color-white;

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 16px;
        border-top: $--border-base;
        border-left: $--border-base;
        border-right: $--border-base;
        border-top-left-radius: $--border-radius-base;
        border-top-right-radius: $--border-radius-base;

        span {
          line-height: 32px;
        }
      }

      .list-table {
        .success {
          color: $--color-success;
        }

        .fail {
          color: $--color-danger;
        }
      }

      .list-empty {
        padding: 80px 0;
        text-align: center;
        border: $--border-base;
        border-radius: $--border-radius-base;

        img {
          width: 50px;
          height: 35px;
        }

        p {
          margin-top: 8px;
          font-size: $--font-size-small;
          line-height: 17px;
          color: $--color-text-primary;
          text-align: center;
        }
      }
    }

    .content-empty {
      margin-top: 16px;
      padding-bottom: 80px;
      text-align: center;
      border: $--border-base;
      border-radius: $--border-radius-base;
      background-color: $--color-white;

      .icon-desc {
        padding-top: 80px;
        text-align: center;

        img {
          width: 50px;
          height: 35px;
        }

        p {
          margin-top: 8px;
          font-size: $--font-size-small;
          line-height: 17px;
          color: $--color-text-primary;
          text-align: center;
        }
      }

      .start-setting {
        margin-top: 24px;
      }
    }

    .friendly-tips {
      margin-top: 16px;
      padding: 24px 24px 40px;
      border: $--border-base;
      border-radius: $--border-radius-base;
      background-color: $--color-white;

      h3 {
        padding-bottom: 16px;
        font-size: $--font-size-base;
        font-weight: 500;
        color: $--color-text-primary;
        line-height: 20px;
      }

      ul {
        li {
          font-weight: 400;
          font-size: $--font-size-small;
          color: $--color-text-primary;
          line-height: 22px;
        }
      }
    }

    .drawer-area /deep/ .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px 0;
    }

    .drawer-area {
      .drawer-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 4px;
        border-bottom: $--border-base;

        .drawer-title--text {
          font-size: $--font-size-base;
          line-height: 20px;
        }

        i {
          color: #a1a8b1;
        }
      }

      .drawer-content {
        position: relative;
        padding: 24px 24px;
        height: calc(100% - 80px);

        .content-tips {
          padding: 10px;
          font-size: $--font-size-small;
          font-weight: 300;
          line-height: 17px;
          color: $--color-primary;
          border-radius: 2px;
          border: 1px solid rgba(255, 202, 163, 1);
          background: rgba(255, 251, 248, 1);
        }

        .form-area {
          margin-top: 24px;
        }

        .form-area /deep/ .el-form-item__label {
          font-size: $--font-size-small;
        }

        .form-area /deep/ .el-form-item__error {
          padding-top: 4px;
        }
      }

      .drawer-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 16px 24px 30px;
        border-top: $--border-base;
        background-color: $--color-white;
      }
    }
  }
}
</style>
