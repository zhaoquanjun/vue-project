<template>
    <div class="article-box">
        <header class="article-bg">
           <div class="article-crumbs" style="width:80%;margin:0 auto;padding-top:15px">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>内容管理</el-breadcrumb-item>
                <el-breadcrumb-item >产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增产品</el-breadcrumb-item>
            </el-breadcrumb>
           </div>
        </header>
        <el-container class="article-container" style>
            <el-header>
                <el-row class="article-head">
                    <el-col :span="13" :offset="3" style=" font-size: 22px;">新增产品</el-col>
                    <el-col :span="6">
                        <div class="article-btn">
                            <button  @click="()=>$router.go(-1)">返回</button>
                            <button>预览</button>
                            <button @click="submitForm">保存</button>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <div>
                    <el-row>
                        <el-col :span="13" :offset="3">
                            <leftContent ref="articleContent" />
                        </el-col>
                        <el-col :span="6" style="margin-left: 16px;">
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
    data(){
        return {
            fileList:[],
            detailData:{},
        }
    },
    components: {
        RightContent,
        leftContent
    },
    methods:{
      submitForm(){
          console.log(this.$refs.articleRight.fileList1)
        
        let fileList = this.$refs.articleRight.fileList1.map(item=>{
            return item.response
        });
        this.$refs.articleContent.submitForm('articleDetail',fileList)
      },
        async getArticleDetail(id) {
            let { data } = await productManageApi.getProductDetail(id);
            let thumbnailPicUrlList = data.thumbnailPicUrlList;
            
            thumbnailPicUrlList.forEach(item => {
                this.fileList.push({
                    name:"123",
                    response:item,
                    url:item
                })
            })
            console.log(this.fileList)


           
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
    width: 100%;
    height: 170px;
    background: url("~img/content-icon/content-detaiBg.png") no-repeat center;
    overflow: hidden;
    background-size: cover;
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


