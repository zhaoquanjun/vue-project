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
                        :span="7"
                        :offset="3"
                        style=" font-size: 22px;"
                    >{{isEditor==1?'编辑产品':'新增产品'}}</el-col>
                    <el-col :span="9" :offset="3">
                        <div class="article-btn">
                            <button @click="()=>$router.go(-1)">返回</button>
                            <button>预览</button>
                            <button :disabled="disableRefObj.inSaveProcess" @click="submitForm">保存</button>
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
            isEdit: false
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
            let fileList = flieUrls.map(item => {
                return item.response;
            });
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
                this.fileList.push({
                    name: "123",
                    response: item,
                    url: item
                });
            });
          
        },
        changeSaveWay(isEdit) {
            this.isEdit = isEdit;
        },
        handlerClickNewAdd() {
            this.fileList = [];
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

<style scoped>
.article-crumbs /deep/ .el-breadcrumb__item .el-breadcrumb__inner {
    font-weight: 400;
    color: #262626;
    font-size: 14px;
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
    width: 80%;
    margin-top: -100px;
}
.article-head {
    .article-btn {
        text-align: right;
        button {
            width: 70px;
            height: 32px;
            border: 1px solid rgba(0, 193, 222, 1);
            margin-left: 16px;
            color: #00c1de;
        }
        > :last-child {
            background: #00c1de;
            color: #fff;
        }
    }
}
</style>


