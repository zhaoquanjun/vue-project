<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>SEO</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll" style="padding: 0 16px">
      <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
      <el-row class="user-list">
        <span class="member-list-title fs14">站点验证</span>
      </el-row>
      <div class="contentWrap">
        <div class="site-title">
          <div>
            <span class="fs14">html标签验证</span>
            <el-tooltip
              class="item"
              effect="dark"
              placement="right"
              content="为保持验证通过的状态,成功验证后请不要删除该标签"
            >
              <i class="iconfont iconyiwen"></i>
            </el-tooltip>
          </div>
          <button
            :disabled="disable"
            :class="{'is-disabled':disable}"
            class="cl-button cl-button--primary cl-button--small"
            @click="submitForm('verifyDetail')"
          >保存</button>
        </div>

        <div class="tip-wrap-primary" style="text-align: center">
          <span class="tip-title">提示:</span>
          <span class="tip-text">请将您从站长工具中获取的标签验证代码添加到此处(格式为 {{meta}})</span>
        </div>
        <el-row>
          <el-col>
            <el-form
              :model="verifyDetail"
              :rules="rules"
              ref="verifyDetail"
              label-width="100px"
              class="ruleForm"
            >
              <el-form-item></el-form-item>
              <el-form-item label="百度验证" prop="baiduTag">
                <el-input
                  v-model="verifyDetail.baiduTag"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="3000"
                  show-word-limit
                  resize="none"
                  @blur="blur()"
                ></el-input>
              </el-form-item>
              <el-form-item label="360验证" prop="qihuTag">
                <el-input
                  v-model="verifyDetail.qihuTag"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="3000"
                  show-word-limit
                  resize="none"
                  @blur="blur()"
                ></el-input>
              </el-form-item>
              <el-form-item label="搜狗验证" prop="sougouTag">
                <el-input
                  v-model="verifyDetail.sougouTag"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="3000"
                  show-word-limit
                  resize="none"
                  @blur="blur()"
                ></el-input>
              </el-form-item>
              <el-form-item label="谷歌验证" prop="googleTag">
                <el-input
                  v-model="verifyDetail.googleTag"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="3000"
                  show-word-limit
                  resize="none"
                  @blur="blur()"
                ></el-input>
              </el-form-item>
              <el-form-item label="必应验证" prop="bingTag">
                <el-input
                  v-model="verifyDetail.bingTag"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  maxlength="3000"
                  show-word-limit
                  resize="none"
                  @blur="blur()"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="link-wrap">
              <a href>如何进行站点验证</a>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "_c/websiteManage/changeSite.vue";
import { getExternalUserInfo, removeExternalUser } from "@/api/index.js";
import * as siteVerifyApi from "@/api/request/siteVerifyApi";
export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      verifyDetail: {
        id: 0,
        siteId: 0,
        baiduTag: null,
        sougouTag: null,
        qihuTag: null,
        bingTag: null,
        googleTag: null
      },
      disable: true,
      curSiteId: "",
      meta: "<meta name='站点名-site-verification' content='验证码'/>",
      rules: {
        baiduTag: [
          {
            pattern: /^<(S*?)[^>]*>.*?|<.*?\/>$/,
            message: "请输入正确的html标签验证代码",
            trigger: "blur"
          }
        ],
        qihuTag: [
          {
            pattern: /^<(S*?)[^>]*>.*?|<.*?\/>$/,
            message: "请输入正确的html标签验证代码",
            trigger: "blur"
          }
        ],
        sougouTag: [
          {
            pattern: /^<(S*?)[^>]*>.*?|<.*?\/>$/,
            message: "请输入正确的html标签验证代码",
            trigger: "blur"
          }
        ],
        googleTag: [
          {
            pattern: /^<(S*?)[^>]*>.*?|<.*?\/>$/,
            message: "请输入正确的html标签验证代码",
            trigger: "blur"
          }
        ],
        frombingTagAlias: [
          {
            pattern: /^<(S*?)[^>]*>.*?|<.*?\/>$/,
            message: "请输入正确的html标签验证代码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.curSiteId = siteId;
      this.verifyDetail.siteId = siteId;
      this.getSiteValidationTags(siteId);
    },
    // 选择切换网站
    chooseWebsite(siteId) {
      this.curSiteId = siteId;
      this.verifyDetail.siteId = siteId;
      this.getSiteValidationTags(siteId);
    },
    async getSiteValidationTags(siteId) {
      let { data } = await siteVerifyApi.getSiteValidationTags(siteId);
      this.verifyDetail = data;
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      if (this.verifyDetail.id > 0) {
        this.editSiteValidationTags("verifyDetail");
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.insertSiteValidationTags();
          } else {
            return false;
          }
        });
      }
    },
    //插入验证标签
    async insertSiteValidationTags() {
      let { status, data } = await siteVerifyApi.createSiteValidationTags(
        this.verifyDetail
      );
      if (status === 200) {
        this.verifyDetail.siteId = data;
        this.$notify({
          customClass: "notify-success",
          message: `添加成功`,
          duration: 2000,
          showClose: false
        });
      }
    },
    // 编辑提交
    editSiteValidationTags(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveSiteValidationTags();
        } else {
          return false;
        }
      });
    },
    //编辑保存邮件配置
    async saveSiteValidationTags() {
      let { status, data } = await siteVerifyApi.editSiteValidationTags(
        this.verifyDetail
      );
      if (status === 200) {
        this.$notify({
          customClass: "notify-success",
          message: `保存成功`,
          duration: 2000,
          showClose: false
        });
      }
    },
    /**
     * 重置表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    blur() {
      this.$refs["verifyDetail"].validate(valid => {
        if (valid) {
          this.disable = false;
        } else {
          this.disable = true;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form /deep/ .el-form-item {
  margin-bottom: 32px;
  .el-form-item__content .el-input__count {
    background: transparent;
    bottom: 0;
    right: 15px;
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
.site-title {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.contentWrap {
  margin-top: 24px;
  background: $--color-white;
  border: $--border-base;
  border-radius: $--border-radius-base;
  padding: 0 24px;
}
.ruleForm {
  /deep/ .el-form-item__label {
    font-size: $--font-size-small;
    color: $--color-text-primary;
    line-height: 20px;
    text-align: left;
    width: 80px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 80px !important;
  }
}

.link-wrap {
  position: absolute;
  margin-top: 16px;
  margin-bottom: 16px;
  a {
    font-size: $--font-size-base;
    color: $--color-primary;
  }
}

.iconyiwen {
  color: #ccc;
  margin-left: 16px;
}
</style>
