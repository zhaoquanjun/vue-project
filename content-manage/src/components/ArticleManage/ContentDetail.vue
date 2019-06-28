<template>
    <div class="article-box">
        <header class="article-bg">
           <div class="article-crumbs" style="width:80%;margin:0 auto;padding-top:15px">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>内容管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/content/news' }">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{operateName}}文章</el-breadcrumb-item>
            </el-breadcrumb>
           </div>
        </header>
        <el-container class="article-container" style>
            <el-header>
                <el-row class="article-head">
                    <el-col :span="13" :offset="3" style=" font-size: 22px;">{{operateName}}文章</el-col>
                    <el-col :span="6">
                        <div class="article-btn">
                            <button @click="()=>$router.go(-1)">返回</button>
                            <button @click="submitForm">保存</button>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <div>
                    <el-row>
                        <el-col :span="13" :offset="3">
                            <ArticleContent
                                @changeOperateName="changeOperateName"
                                ref="articleContent" />
                        </el-col>
                        <el-col :span="6" style="margin-left: 16px;">
                            <RightContent :imageUrl="imageUrl" ref="articleRight" />
                        </el-col>
                    </el-row>
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
    data(){
        return {
            imageUrl:"",
            detailData:{},
            operateName:"新增"
        }
    },
    components: {
        RightContent,
        ArticleContent
    },
    methods:{
      changeOperateName(operate){
          this.operateName = operate;
      },
      submitForm(){

        let imageUrl = this.$refs.articleRight.imageUrl1;
      
        if(this.$route.query.id){
            this.$refs.articleContent.editArticle('articleDetail',imageUrl)
        }else{
            this.$refs.articleContent.submitForm('articleDetail',imageUrl)
        }
        
      },
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            this.imageUrl =  data.pictureUrl;
           
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


<style lang="scss" scoped>
.article-box {
    background: #f9fafc;
}
.article-bg {
    height: 170px;
    background: #e5f8fa;
    .article-crumbs{
        width:80%;margin:0 auto;padding-top:15px
    }
}
.article-container {
    width: 80%;
    margin-top: -100px;
}
.article-head {
    .article-btn {
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


