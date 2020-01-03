<template>
    <div>
        <div class="picture-content-mask"  v-if="picUrl">
            <div class="picture-wrap">
                <img :src="picUrl" @error="test()" onload="test()" alt />
                <span class="mask">
                    <button>
                        <i class="iconfont iconqiehuanxingshiyi" @click="handlerUpload"></i>
                    </button>
                    <!-- <button @click="handlerDelete">
                        <i class="iconfont iconshanchu"></i>
                    </button> -->
                </span>
            </div>
        </div>
        <div class="upload-wrap" v-else>
            <div>
                <div class="upload-icon"></div>
                <p>请点击此处上传您要上传的图片</p>
                <button class="cl-button cl-button--primary" @click="handlerUpload">点击上传</button>
            </div>
        </div>
         <image-manage
            v-if="imageChooseAreaShowFlag"
            @getImage="getImage"
            @handleCloseModal="handleCloseModal"
        ></image-manage>
    </div>
</template>
<script>
import ImageManage from "_c/wechat-account/uploadChooseImage/selectUpload";
import { uploadImg } from "@/api/request/account.js";
export default {
    props:["imageMsg"],
    data() {
        return {
            isUploaded: true,
            picUrl: "",
            imageChooseAreaShowFlag: false,
        };
    },
     components: {
        ImageManage
    },
    created(){
        this.picUrl = this.imageMsg
        console.log('this.picUrl',this.picUrl)
    },
    methods: {
        handlerDelete() {
            this.isUploaded = false;
            this.picUrl = "";
            this.$emit("handlerPic",this.picUrl)
        },
        test(){
            this.picUrl = "";
        },
        handlerUpload(){
            this.imageChooseAreaShowFlag=true
        },
           // 获取图片
        async getImage(src) {
            // let {data} = await uploadImg(src);
            //this.picUrl = data;
            this.picUrl = src;
            this.$emit("handlerPic",this.picUrl)
            this.imageChooseAreaShowFlag = false;
        },
        // 关闭弹层
        handleCloseModal() {
            this.imageChooseAreaShowFlag = false;
        },
    },
    watch:{
        imageMsg(){
            this.picUrl = this.imageMsg
        }
    }
};
</script>
<style lang="scss" scoped>
.picture-content-mask {
    text-align: center;
}
.picture-wrap {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: 30px auto;
    img {
        display: inline-block;
        border-radius: $--border-radius-base;
        min-height: 180px;
        max-width: 700px;
        max-height: 240px;
    }
    &:hover .mask {
        opacity: 1;
    }
    .mask {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(38, 38, 38, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        button {
            padding: 10px;
            .iconfont {
                color: #fff;
            }
        }
    }
}
.upload-wrap {
    display: flex;
    width: 100%;
    margin: 0;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    .upload-icon {
        display: inline-block;
        margin-top: 86px;
        width: 60px;
        height: 60px;
        background: url("~img/upload-icon.png") no-repeat center;
        background-size: contain;
    }
    p {
        font-size:$--font-size-small;
        font-weight:400;
        margin: 12px 0;
        color:rgba(161,168,177,1);
        line-height:20px;
    }
}
</style>