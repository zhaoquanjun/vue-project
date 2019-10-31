<template>
    <div>
        <div class="picture-wrap" v-if="picUrl">
            <img :src="picUrl" alt />
            <span class="mask">
                <button>
                    <i class="iconfont iconqiehuanxingshiyi" @click="handlerUpload"></i>
                </button>
                <!-- <button @click="handlerDelete">
                    <i class="iconfont iconshanchu"></i>
                </button> -->
            </span>
        </div>
        <div class="upload-wrap" v-else>
            <div>
                <div class="upload-icon"></div>
                <p>请点击此处上传您要上传的图片</p>
                <button class="handler-upload" @click="handlerUpload">点击上传</button>
            </div>
        </div>
         <image-manage
            :imageChooseAreaShowFlag="imageChooseAreaShowFlag"
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
    },
    methods: {
        handlerDelete() {
            this.isUploaded = false;
            this.picUrl = "";
            this.$emit("handlerPic",this.picUrl)
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
.picture-wrap {
    width: 180px;
    position: relative;
    overflow: hidden;
    text-align: center;
    margin: 30px auto;
    flex: none;
    img {
        border-radius: 2px;
        width: 180px;
    }
    &:hover .mask {
        opacity: 1;
    }
    .mask {
        opacity: 0;
        position: absolute;
        width: 180px;
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
        margin-top: 50px;
        width: 60px;
        height: 60px;
        background: url("~img/upload-icon.png") no-repeat center;
        background-size: contain;
    }
    p {
        font-size:14px;
        font-family:'PingFangSC-Regular,PingFang SC';
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:20px;
    }
    .handler-upload {
        display: block;
        width: 90px;
        height: 32px;
        line-height: 32px; 
        margin: 0 auto;
        color: #ffffff;
        margin-top: 16px;
        background: #09cceb;
    }
}
</style>