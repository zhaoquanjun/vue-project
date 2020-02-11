<template>
    <div class="article-box" style="overflow: auto;
    height: calc(100vh - 60px);">
        <header class="article-bg">
            <div class="article-crumbs">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">系统设置</el-breadcrumb-item>
                    <el-breadcrumb-item class="text-regular" :to="{ path:'/content/news' }">内容管理</el-breadcrumb-item>
                    <!-- :to="{ path: '/content/createarticle' }" -->
                    <el-breadcrumb-item class="text-regular" :to="{ path:'/content/news' }">文章管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="text-regular">{{operateName}}文章</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <el-container class="article-container" style>
            <el-header style="height:32px;margin-bottom:16px">
                <div class="article-head">
                    <div class="article-headTitle">{{operateName}}文章</div>
                    <div class="article-btn">
                        <button class="cl-button cl-button--small cl-button--primary_notbg" @click="()=>$router.go(-1)">返回</button>
                        <button class="cl-button cl-button--small cl-button--primary_notbg" v-if="isEdit" @click="preview">预览</button>
                        <Debounce :time="1000" !isDebounce>
                            <button class="cl-button cl-button--small cl-button--primary" @click="submitForm">保存</button>
                        </Debounce>
                    </div>
                </div>
            </el-header>
            <el-main>
                <div style="overflow:hidden">
                    <div class="articleContent">
                        <div class="articleContentLeft">
                            <ArticleContent
                                @changeOperateName="changeOperateName"
                                @changeSaveWay="changeSaveWay"
                                @changePreviewId="changePreviewId"
                                ref="articleContent"
                            />
                        </div>
                        <div class="articleContentRight">
                            <RightContent :imageUrl="imageUrl" ref="articleRight" />
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import * as articleManageApi from "@/api/request/articleManageApi";
import environment from "@/environment/index.js";
import RightContent from "./content-detail/right-content";
import ArticleContent from "./content-detail/ArticleContent";
export default {
    props: {
        uploadPicUrl: {
            type: String,
            default: environment.uploadPicUrl
        }
    },
    data() {
        return {
            imageUrl: "",
            detailData: {},
            operateName: "新增",
            isEdit:false,
            previewId: "",
            siteId : 0
        };
    },
    components: {
        RightContent,
        ArticleContent
    },
    methods: {
        changeOperateName(operate) {
            this.operateName = operate;
        },
        submitForm() {
            let imageUrl = this.$refs.articleRight.imageUrl1;
            if(this.isEdit){
                 this.$refs.articleContent.editArticle("articleDetail", imageUrl);
                return
            }
            if (this.$route.query.id) {
                this.$refs.articleContent.editArticle("articleDetail", imageUrl);
            } else {
                this.$refs.articleContent.submitForm("articleDetail", imageUrl);
            }
        },
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            this.imageUrl = data.pictureUrl;
        },
        changeSaveWay(isEdit){
            this.isEdit = isEdit;
            if(!isEdit) this.$refs.articleRight.imageUrl1=""
            
        },
        changePreviewId(id, siteId){
            this.previewId = id;
            this.siteId = siteId;
        },
        /**
         * 预览
         */
        async preview() {
            if (this.previewId) {
                let { data } = await articleManageApi.GetContentPrevAddress('NewsDetail', this.siteId == null ? 0 : this.siteId);
                var prevAddress = data;
                if (prevAddress) {
                    let newWindow = window.open();
                    newWindow.location.href = prevAddress + this.previewId + '.html';
                }
            }
        },
    },
    mounted() {
        var id = this.$route.query.id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
        }
    }
};
</script>

<style lang='scss' scoped>
.article-crumbs /deep/ .el-breadcrumb__item{
    .el-breadcrumb__inner {
        font-weight: 400;
        color: #262626;
        font-size: $--font-size-small;
    }
    .el-breadcrumb__separator{
        color: $--color-text-regular;
    }
}
.article-crumbs /deep/ .text-regular{
    .el-breadcrumb__inner {
        color: $--color-text-regular;
    }
}
</style>

<style lang="scss" scoped>
.article-box {
    background: #f9fafc;
}
.article-bg {
    width: 100%;
    height: 170px;
    background: url("~img/content-icon/content-detaiBg.png") no-repeat center;
    overflow: hidden;
    background-size: cover;
    .article-crumbs {
        width: 80%;
        margin: 0 32px;
        padding-top: 15px;
    }
}
.article-container {
    width: 100%;
    margin-top: -115px;
    // margin-left: -40px;
}
.article-head {
    margin: 0 10%;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .article-headTitle{
        font-size: 16px;
        font-weight: 500;
        color: $--color-text-primary
    }
}
.articleContent{
    margin: 0 10%;
    width: 80%;
    display: flex;
    .articleContentLeft{
        width: calc(100% - 361px);
        display: inline-block;
    }
    .articleContentRight{
        width: 345px;
        display: inline-block;
        padding-left: 16px;
    }
}
</style>


