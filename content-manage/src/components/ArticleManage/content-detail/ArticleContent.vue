<template>
    <div class="article-content" id="article-content">
        <el-form class="base-ariticle" :model="articleDetail" :rules="rules" ref="articleDetail">
            <div class="content-item">
                <el-row>
                    <el-col :span="24">
                        <div class="content-title">基本信息</div>
                    </el-col>
                </el-row>
                <el-form-item label prop="title">
                    <el-input
                        placeholder="请输入文章标题（必填）"
                        v-model="articleDetail.title"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label prop="summary">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入文章简介"
                        v-model="articleDetail.summary"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <div>
                        <div style="float:left">
                            <span style="font-size:12px">分类:</span>
                            <span class="select-sort">
                                <el-select size="small" v-model="value2" placeholder="请选择">
                                    <el-option
                                        v-for="item in options1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </span>
                        </div>
                        <div style="float:right">
                            <span style="font-size:12px">排序</span>
                            <span class="select-sort">
                                <el-select size="small" v-model="value" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </span>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <div class="content-item">
                <el-row>
                    <el-col :span="24">
                        <div class="content-title">文章详情</div>
                    </el-col>
                </el-row>
                <el-form-item label prop="contentDetail">
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="请输入文章详情"
                        v-model="articleDetail.contentDetail"
                    ></el-input>
                </el-form-item>
            </div>
            <div class="content-item set-article">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="文章设置" name="1">
                        <el-form-item label="时间">
                            <el-col :span="11">
                                <el-form-item prop="createTime">
                                    <el-date-picker
                                        type="datetime"
                                        v-model="articleDetail.createTime"
                                        placeholder="选择日期时间"
                                        style="width: 100%;"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="搜索关键词" prop="searchKeywords">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">
                                    网站使用了搜索控件时，将使该网站的搜索
                                    <br>结果更加准确，一篇文章最多可以设置5个关键词
                                </div>
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>

                            <el-input
                                placeholder="每个关键词之间用会车键分离"
                                v-model="articleDetail.searchKeywords"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="置頂" prop="delivery">
                            <el-switch v-model="articleDetail.isTop"></el-switch>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
                <el-collapse v-model="activeName1" accordion>
                    <el-collapse-item title="搜索引擎优化" name="1">
                        <el-form-item label="seo标题" prop="metaTitle">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">不填写则默认使用文章标题</div>
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <el-input placeholder="seo标题" v-model="articleDetail.metaTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="seo关键词" prop="metaKeywords">
                            <el-input placeholder="seo关键词" v-model="articleDetail.metaKeywords"></el-input>
                        </el-form-item>

                        <el-form-item label="文章描述" prop="metaDescription">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder
                                v-model="articleDetail.metaDescription"
                            ></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="自定义地址" prop="metaDescription">
                        <el-input placeholder="请输入自定义地址" v-model="articleDetail.metaDescription"></el-input>
                        </el-form-item>-->
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>

        <!-- 

                 <el-form-item>
        <el-button type="primary" @click="submitForm('articleDetail')">立即创建</el-button>
        <el-button @click="resetForm('articleDetail')">重置</el-button>
        <el-button type="primary" @click="editArticle('articleDetail')">编辑保存</el-button>
      </el-form-item>
        -->
    </div>
</template>
<script>
import * as articleManageApi from "@/api/request/articleManageApi";
export default {
    data() {
        return {
            options: [
                {
                    value: "选项1",
                    label: "上线"
                },
                {
                    value: "选项2",
                    label: "下线"
                }
            ],
            value: "上线",
            options1: [
                {
                    value: "选项1",
                    label: "全部分类1"
                },
                {
                    value: "选项2",
                    label: "全部分类2"
                }
            ],
            value2: "全部分类",

            activeName: "",
            activeName1:"",
            articleDetail: {
                NewId: "",
                title: "",
                summary: "",
                contentDetail: "",
                searchKeywords: "",
                createTime: new Date(),
                isTop: false,
                metaTitle: "",
                metaKeywords: "",
                metaDescription: "",
                pictureUrl:"",
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入文章标题",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 100,
                        message: "长度在 1 到 100 个字符",
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    created() {
        // console.log(this.$route.query)
        var id = this.$route.query.id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
        }
    },
    methods: {
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            this.articleDetail = data;
            this.articleDetail.NewId = data.id;
        },
        // 新建保存
        submitForm(formName,imageUrl) {
            alert(imageUrl)
            this.articleDetail.pictureUrl = imageUrl;
            console.log(this.title);
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.insertArticle();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //插入文章
        async insertArticle() {
            let { status, data } = await articleManageApi.createArticle(
                this.articleDetail
            );
            if (status === 200) {
                this.$message({
                    type: "success",
                    message: "添加成功!"
                });
                this.$router.push(`/create?id=${data}`);
            }
        },
        // 编辑提交
        editArticle(formName,imageUrl) {
            this.articleDetail.pictureUrl = imageUrl;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveArticle();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑保存文章
        async saveArticle() {
            let { status, data } = await articleManageApi.editArticle(
                this.articleDetail
            );
            if (status === 200) {
                this.$message({
                    type: "success",
                    message: "保存成功!"
                });
            }
        }
    }
};
</script>
<style>
#article-content .el-collapse,
#article-content .el-collapse-item__header {
    border: none;
    font-size: 14px;
}
</style>

<style scoped lang="scss">
.article-content {
    .content-item {
        padding: 21px 16px 0;
        background: #fff;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.03);
        margin-bottom: 16px;
        overflow: hidden;
    }
    .content-title {
        padding-bottom: 20px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 20px;
    }
    .set-article,
    .seo-key {
        padding: 0 16px;
    }
}
.select-sort {
    display: inline-block;
    width: 117px;
    box-sizing: border-box;
    height: 32px;
    margin: 0 16px 0 7px;
}
</style>

