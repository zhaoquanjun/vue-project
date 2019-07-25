<template>
    <div class="content-num-section">
        <p class="section-title">内容管理</p>
        <el-row class="content" :gutter="16">
            <el-col class="item" :span="6" v-for="(it, idx) in content" :key="idx">
                <div class="item-box">
                    <div class="item-l">
                        <span :class="contentIcon(it)"></span>
                        <span>{{ it.name }}</span>
                    
                    </div>
                    <div>
                        <span class="item-r">{{ it.num }}</span>
                        <span class="item-type">{{ it.type }}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ["contentNumber"],
    data() {
        return {
            content: []
        };
    },
    created() {
        this.content = [
            { name: "文章", num: this.contentNumber.newsCount, type: "/篇" },
            { name: "产品", num: this.contentNumber.productsCount, type: "/个" },
            { name: "图片", num: this.contentNumber.picturesCount, type: "/个" },
            { name: "文件", num: this.contentNumber.filesCount, type: "/件" }
        ];
    },
    methods:{
      contentIcon(item){
        switch (item.name){
          case "文章":
           return "article"
          case "产品":
           return "product"
          case "图片":
           return "pictrue"
          case "文件":
           return "file"     
             
        }
      }
    }
};
</script>

<style lang="scss" scoped>
.content-num-section {
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
    .section-title {
        padding-left: 25px;
        padding-bottom: 16px;
        padding-top: 20px;
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(38,38,38,1);
        line-height:25px;
    }
    .content {
        padding: 0 24px 16px;
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            margin-bottom: 16px;
            .item-box {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                background:rgba(251,251,251,1);
                span {
                    display: block;
                }
                .article{
                    background: url("~img/dashboard/board-article.png") no-repeat
                    center;
                   background-size: contain;
                }
                .product{
                    background: url("~img/dashboard/board-product.png") no-repeat
                    center;
                   background-size: contain;
                }
                .pictrue{
                    background: url("~img/dashboard/board-pic.png") no-repeat
                    center;
                   background-size: contain;
                }
                .file{
                    background: url("~img/dashboard/board-file.png") no-repeat
                    center;
                   background-size: contain;
                }
                
                .item-l {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span:first-of-type {
                        width: 40px;
                        height: 40px;
                        margin-right: 24px;
                    }
                    span:last-of-type {
                        font-size:20px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(38,38,38,1);
                        line-height:28px;
                    }
                }
                .item-r {
                    display: inline;
                    margin-right: 5px;
                    font-size:32px;
                    font-family:PingFangSC-Medium;
                    font-weight:500;
                    color:rgba(38,38,38,1);
                }
                .item-type{
                    display: inline;
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(181,181,181,1);
                    line-height:20px;
                }
            }
        }
    }
}
</style>
