<template>
    <div class="article-box" style="overflow: auto;
    height: calc(100vh - 60px);">
        <header class="article-bg">
            <div class="article-crumbs" style="width:80%;margin:0 auto;padding-top:15px">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">系统设置</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/content/product' }">内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/content/product' }">产品管理</el-breadcrumb-item>
                    <el-breadcrumb-item>{{isEditor==1?'编辑产品':'新增产品'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <el-container class="article-container" style>
            <el-header>
                <el-row class="article-head">
                    <el-col
                        :span="13"
                        :offset="3"
                        style=" font-size: 22px;"
                    >{{isEditor==1?'编辑产品':'新增产品'}}</el-col>
                    <el-col :span="6" >
                        <div class="article-btn">
                            <button class="cl-button cl-button--primary_notbg" @click="()=>$router.go(-1)">返回</button>
                            <button class="cl-button cl-button--primary_notbg" v-if="isEdit" @click="preview">预览</button>
                            <button class="cl-button cl-button--primary" :disabled="disableRefObj.inSaveProcess" @click="submitForm">保存</button>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main style="overflow:hidden">
                <div>
                    <el-row>
                        <el-col :span="13" :offset="3">
                            <leftContent
                                ref="articleContent"
                                @changeSaveWay="changeSaveWay"
                                @handlerClickNewAdd="handlerClickNewAdd"
                                @changePreviewId="changePreviewId"
                            />
                        </el-col>
                        <el-col :span="6" style="margin-left: 16px;max-width:345px;min-width:345px">
                            <RightContent :fileList="fileList" ref="articleRight" />
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import * as productManageApi from "@/api/request/productManageApi";
import environment from "@/environment/index.js";
import RightContent from "./content-detail/RightContent";
import leftContent from "./content-detail/LeftContent";
export default {
    props: {
        uploadPicUrl: {
            type: String,
            default: environment.uploadPicUrl
        }
    },
    data() {
        return {
            disableRefObj: { inSaveProcess: false},
            fileList: [],
            detailData: {},
            isEdit: false,
            previewId: "",
            siteId: 0
        };
    },

    components: {
        RightContent,
        leftContent
    },
    created() {},
    methods: {
        submitForm() {
            // let flieUrls = [
            //     ...this.$refs.articleRight.fileList1,
            //     ...this.$refs.articleRight.fileList2
            // ];
            let flieUrls = this.$refs.articleRight.newFileList;
            console.log(this.$refs.articleRight);
            // let fileList = flieUrls.map(item => {
            //     return item.response;
            // });
            let fileList = this.$refs.articleRight.newFileList;
            if (this.isEdit) {
                this.$refs.articleContent.editArticle("contentForm", fileList, this.disableRefObj);
                return;
            }
            // editArticle
            let isEditor = this.$route.query.isEditor;
            if (!!isEditor) {
                this.$refs.articleContent.editArticle("contentForm", fileList, this. disableRefObj);
            } else {
                this.$refs.articleContent.submitForm("contentForm", fileList, this. disableRefObj);
            }
        },
        async getArticleDetail(id) {
            let { data } = await productManageApi.getProductDetail(id);
            let thumbnailPicUrlList = data.thumbnailPicUrlList;
            thumbnailPicUrlList.forEach(item => {
                this.fileList.push(item);
            });
            console.log(this.fileList,'==]]]]')
          
        },
        changeSaveWay(isEdit) {
            this.isEdit = isEdit;
        },
        handlerClickNewAdd() {
            this.fileList = [];
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
                let { data } = await productManageApi.GetContentPrevAddress('ProductDetail', this.siteId == null ? 0 : this.siteId);
                var prevAddress = data;
                //var a = document.createElement('a');
                //a.setAttribute('href', prevAddress + this.previewId + '.html');
                //a.setAttribute('target', '_blank');
                //a.click();
                if (prevAddress) {
                    let newWindow = window.open();
                    newWindow.location.href = prevAddress + this.previewId + '.html';
                }
            }
        }
    },
    mounted() {
        var id = this.$route.query.id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
        }
    },
    computed: {
        isEditor() {
            return this.$route.query.isEditor;
        }
    }
};
</script>

<style lang='scss' scoped>
.article-crumbs /deep/ .el-breadcrumb__item .el-breadcrumb__inner {
    font-weight: 400;
    color: #262626;
    font-size: $--font-size-small;
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
        margin: 0 auto;
        padding-top: 15px;
    }
}
.article-container {
    width: 100%;
    margin-top: -100px;
    margin-left: -40px;
}
.article-head {
    .article-btn {
       padding-left: 16px
    }
}
</style>


