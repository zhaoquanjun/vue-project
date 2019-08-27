<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu >
                <template v-slot:title>SEO</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <ChangeSite @chooseWebsite="chooseWebsite" @getSiteId="getSiteId" />
            <el-row class="user-list site-title">
                <span class="member-list-title fs14">站点验证</span>
                <button
                    class="btn-small btn-lightblue handler-btn"
                    type="primary"
                    @click="submitForm('verifyDetail')"
                >保存</button>
            </el-row>
             <el-row class="site-title">
                <span class="member-list-title fs14">html标签验证</span>
                  <el-tooltip class="item" effect="dark" placement="right" content="为保持验证通过的状态,成功验证后请不要删除该标签">
                         <i class="iconfont iconyiwen"></i>
                    </el-tooltip>
            </el-row>
            <el-row>
                <el-col >
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
                                placeholder="请将您从站长工具中获取的标签验证代码添加到此处(格式为 <meta name='站点名-site-verification' content='验证码'/>)。保存代码成功后，您才可以到站长工具里进行后续操作步骤。"
                                maxlength="3000"
                                show-word-limit
                                resize="none"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="360验证" prop="qihuTag">
                            <el-input
                                v-model="verifyDetail.qihuTag"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 10}"
                                placeholder="请将您从站长工具中获取的标签验证代码添加到此处(格式为 <meta name='站点名-site-verification' content='验证码'/>)。保存代码成功后，您才可以到站长工具里进行后续操作步骤。"
                                maxlength="3000"
                                show-word-limit
                                resize="none"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="搜狗验证" prop="sougouTag">
                            <el-input
                                v-model="verifyDetail.sougouTag"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 10}"
                                placeholder="请将您从站长工具中获取的标签验证代码添加到此处(格式为 <meta name='站点名-site-verification' content='验证码'/>)。保存代码成功后，您才可以到站长工具里进行后续操作步骤。"
                                maxlength="3000"
                                show-word-limit
                                resize="none"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="谷歌验证" prop="googleTag">
                            <el-input
                                v-model="verifyDetail.googleTag"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 10}"
                                placeholder="请将您从站长工具中获取的标签验证代码添加到此处(格式为 <meta name='站点名-site-verification' content='验证码'/>)。保存代码成功后，您才可以到站长工具里进行后续操作步骤。"
                                maxlength="3000"
                                show-word-limit
                                resize="none"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="必应验证" prop="bingTag">
                            <el-input
                                v-model="verifyDetail.bingTag"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 10}"
                                placeholder="请将您从站长工具中获取的标签验证代码添加到此处(格式为 <meta name='站点名-site-verification' content='验证码'/>)。保存代码成功后，您才可以到站长工具里进行后续操作步骤。"
                                maxlength="3000"
                                show-word-limit
                                resize="none"
                            ></el-input>
                        </el-form-item>
                       
                    </el-form>
                    <div class="link-wrap">
                        <a href="">如何进行站点验证</a>
                    </div>
                </el-col>
            </el-row>
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
            curSiteId: "",
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
            this.getSiteValidationTags(siteId);
        },
        // 选择切换网站
        chooseWebsite(siteId) {
            this._getCdnDomainList(siteId);
        },
        async getSiteValidationTags(siteId) {
            let { data } = await siteVerifyApi.getSiteValidationTags(siteId);
            this.verifyDetail = data;
            console.log(data, "000-----");
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
                        console.log("error submit!!");
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
                this.$message({
                    type: "success",
                    message: "添加成功!"
                });
            }
        },
        // 编辑提交
        editSiteValidationTags(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveSiteValidationTags();
                } else {
                    console.log("error submit!!");
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
                this.$message({
                    type: "success",
                    message: "保存成功!"
                });
            }
        },
        /**
         * 重置表单
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped>
.el-form /deep/ .el-form-item__content .el-textarea textarea{
   
}
.el-form /deep/ .el-form-item__content .el-input__count{
    background: transparent;
        bottom: 0;
    right: 15px;
}
</style>

<style lang="scss" scoped>
.site-title {
    padding: 15px 32px !important;
    .member-list-title{
        line-height: 40px;
    }
      .handler-btn {
        float: right;
        width: 90px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px;
        color: #fff;
    }
}
.member-container {
    position: relative;
    .member-content {
        padding: 21px 14px;
    }
    .user-list {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        .member-list-title {
            border-left: 2px solid #01c0de;
            padding-left: 10px;
        }
    }
  
}
.ruleForm{
   padding: 26px 32px 56px 0;
    background:rgba(248,250,252,1);
}
.link-wrap{
    padding: 32px;
    a{
        color: #09CCEB
    }
}

.iconyiwen{
    color: #ccc;
    padding-left: 16px;
    vertical-align: middle;
}
</style>
