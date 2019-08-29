<template>
    <div>
        <div class="picture" v-if="isUploaded">
            <img :src="picUrl" alt />
            <span class="mask">
                <button>
                    <i class="iconfont iconqiehuan"></i>
                </button>
                <button @click="handlerDelete">
                    <i class="iconfont iconhuishouzhan"></i>
                </button>
            </span>
        </div>
        <div v-else>
            <div class="upload-icon"></div>
            <button class="handler-upload">点击上传</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isUploaded: true,
            picUrl:
                "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/09bbb65d854f4821acd1b27f2ffc89b8"
        };
    },
    methods:{
        handlerDelete(){
            this.isUploaded = false;
            this.picUrl=""
        }
    }
};
</script>
<style lang="scss" scoped>
.picture {
    width: 180px;
    height: 180px;
    position: relative;
    overflow: hidden;
    img {
        border-radius: 2px;
        width: 100%;
    }
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(38, 38, 38, 0.8);
        display: flex;
         align-items: center;
        justify-content: center;
        button {
             padding: 10px;
            .iconfont {
                color: #fff;
            }
        }
    }
}
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
</style>