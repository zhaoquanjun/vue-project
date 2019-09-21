<template>
    <div>
        <div class="picture-wrap" v-if="picUrl">
            <img :src="picUrl" alt />
            <span class="mask">
                <button>
                    <i class="iconfont iconqiehuanxingshiyi"></i>
                </button>
                <button @click="handlerDelete">
                    <i class="iconfont iconshanchu"></i>
                </button>
            </span>
        </div>
        <div @click="handlerUpload"  class="upload-wrap" v-else>
            <div class="upload-icon"></div>
            <button class="handler-upload">点击上传</button>
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
    methods: {
        handlerDelete() {
            this.isUploaded = false;
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
            this.$emit("handlerPic",src)
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
    height: 180px;
    position: relative;
    overflow: hidden;
    flex: none;
    img {
        border-radius: 2px;
        width: 100%;
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
    cursor: pointer;
    .upload-icon {
        width: 60px;
        height: 60px;
        background: url("~img/upload-icon.png") no-repeat center;
        background-size: contain;
    }
    .handler-upload {
        width: 60px;
        padding-top: 16px;
        color: #09cceb;
    }
}
</style>