<template>
    <div class="content-num-section">
        <p class="section-title">内容管理</p>
        <el-row class="content" :gutter="16">
            <el-col class="item" :span="12" v-for="(it, idx) in content" :key="idx">
                <div class="item-box">
                    <div class="item-l">
                        <span :class="contentIcon(it)"></span>
                        <span>{{it.name}}</span>
                    </div>
                    <div class="item-r">{{it.num}}</div>
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
        console.log(this.contentNum);
        this.content = [
            { name: "文章", num: this.contentNumber.newsCount },
            { name: "产品", num: this.contentNumber.productsCount },
            { name: "图片", num: this.contentNumber.picturesCount },
            { name: "文件", num: this.contentNumber.filesCount }
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
    background: #fff;
    .section-title {
        padding-left: 16px;
        padding-bottom: 16px;
        padding-top: 14px;
        font-size: 14px;
        line-height: 18px;
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
                height: 56px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                background: #f5f5f5;
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
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }
                    span:last-of-type {
                        line-height: 17px;
                        color: #8c8c8c;
                    }
                }
                .item-r {
                    color: #00c1de;
                }
            }
        }
    }
}
</style>
