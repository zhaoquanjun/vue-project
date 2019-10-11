<template>
    <div class="image-text">
         <PopUp
            :model="model"
            @handleClosePopup="handleClosePopup"
           v-show="isShowPopup"
        />
        <ul class="list" ref="list">
            <li
                ref="listItem"
                v-show="!isEditorShow"
                :class="index===0?'fist-item':'list-item'"
                v-for="(item,index) in list"
                :key="index"
            >
                <div class="headline">{{item.title}}</div>
                <div class="imgwrap">
                    <img :src="item.picUrl"
                    />
                </div>
                <div class="mask">
                    <button @click="upward(item,index)" v-if="index!==0">
                        <i class="iconfont iconjiantoushang"></i>
                    </button>
                    <button @click="downward(item,index)" v-if="index!==list.length-1">
                        <i class="iconfont iconjiantouxia"></i>
                    </button>
                    <button @click="editor(item,index)">
                        <i class="iconfont iconbianji"></i>
                    </button>
                    <button @click="remove(item,index)">
                        <i class="iconfont iconshanchu"></i>
                    </button>
                </div>
            </li>
            <li class="fist-item editor" ref="editor" v-show="isEditorShow">
                <div class="example">
                    <div
                        class="headline ellipsis"
                    >{{curEditorItem.title?curEditorItem.title:defualtTitle}}</div>
                    <div class="imgwrap">
                        <img :src="curEditorItem.picUrl"/>
                    </div>
                </div>
                <div class="seting-info">
                    <div class="seting-item"
                        style="cursor: pointer;"
                        @click="showPopup"
                    >
                        <div class="seting-title">设置链接</div>
                        <el-input
                            size="small"
                            placeholder="请选择链接"
                            v-model="curEditorTitle"
                            class="input-with-select"
                            readonly
                        >
                            <i
                                class="el-icon-link el-input__icon"
                                slot="suffix"
                            ></i>
                        </el-input>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">设置封面</div>
                        <div class="cover">
                            <div class="upload-icon" @click="setCover" v-if="!curEditorItem.picUrl">
                                <span class="el-icon-plus"></span>
                            </div>
                            <div  v-else>
                                <img :src="curEditorItem.picUrl" />
                                <div class="mask1">
                                    <button @click="setCover">
                                        <i class="iconfont iconqiehuanxingshiyi"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">图文标题</div>
                        <el-input
                            v-model="curEditorItem.title"
                            size="small"
                            placeholder="不超过64个字符"
                            maxlength="64"
                            show-word-limit
                        ></el-input>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">简介</div>
                        <el-input
                            class="textarea"
                            type="textarea"
                            v-model="curEditorItem.description"
                            rows="5"
                            placeholder="非必填，不超过120个字符，该摘要只在发送图文消息为单条时显示"
                            maxlength="120"
                            show-word-limit
                            resize="none"
                        ></el-input>
                    </div>
                    <div class="seting-item seting-btn">
                        <button class="editor-comfirm" @click="handlerConfirm">确定</button>
                        <button class="editor-cancel" @click="handlerCancel">取消</button>
                    </div>
                </div>
            </li>
        </ul>
        <div class="footer-add" @click="handlerAddNewsImg" v-if="!isEditorShow&&list.length<8 && replyTypes == 1">
            <span class="el-icon-plus avatar-uploader-icon"></span>
            <span>最多添加8个图文消息</span>
        </div>
        <image-manage
            :imageChooseAreaShowFlag="imageChooseAreaShowFlag"
            @getImage="getImage"
            @handleCloseModal="handleCloseModal"
        ></image-manage>
    </div>
</template>
<script>
import { trim, notify, transformationUrl } from "@/utlis/index.js";
import PopUp from "@/components/wechat-account/defineMenu/link/popup.vue";
import ImageManage from "_c/wechat-account/uploadChooseImage/selectUpload";
import { uploadImg } from "@/api/request/account.js";
export default {
    props: ["newsMsg","replyType"],
    components: {
        PopUp,
        ImageManage
    },
    data() {
        return {
            list: [],
            model: {
                PageIndex: null,
                Type: null,
                Id: null,
                Href: null
            },
            defualtTitle: "这里是标题",
            curEditorItem: {
                title: "",
                description: "",
                picUrl: require('img/picCover.png'),
                urlType: "",
                urlData: "",
                contentPageId: ''
            },
            promotionUrl: this.$store.state.wxaccount.account_info.promotionUrl,
            curEditorTitle: '',
            isUploaded: false,
            isEditorShow: false,
            isEditor: true,
            index: 0,
            replyTypes: 0,
            imageChooseAreaShowFlag: false,
            isShowPopup: false,
            picUrl: ""
        };
    },
    mounted() {
        this.list = this.newsMsg;
        this.replyTypes = this.replyType;
        this.isEditorShow = this.list.length > 0 ? false : true;
    },
    methods: {
        showPopup(){
            this.isShowPopup = true
        },
        handleClosePopup (val,data){
            this.isShowPopup = val
            //Type: Url; Page; Product; News
            //Href: 输入的url; page.id; product.id; news.id
            //Id: null; page.id; productPage.id; productNews.id
            //Title: 输入的url; page.title; product.title; news.title
            //PicUrl: ''; ''; product.picUrl; news.picUrl
            if (data) {
                this.curEditorItem.urlType = data.Type;
                this.curEditorItem.urlData = data.Href;
                this.curEditorItem.contentPageId = data.Id;
                this.curEditorTitle = transformationUrl(data.Type,this.promotionUrl,data.Href,data.Id)
                if (data.PicUrl) {
                    this.curEditorItem.picUrl = data.PicUrl
                }
            }
        },
        downward(item, index) {
            var tempOption = this.list[index + 1];
            this.$set(this.list, index + 1, this.list[index]);
            this.$set(this.list, index, tempOption);
        },
        upward(item, index) {
            var tempOption = this.list[index - 1];
            this.$set(this.list, index - 1, this.list[index]);
            this.$set(this.list, index, tempOption);
        },
        editor(item, index) {
            this.curEditorItem = item;
            let list = this.$refs.list;
            let editor = this.$refs.editor;
            let listItems = this.$refs.listItem;
            this.listItems = listItems;
            this.index = index;
            this.isEditor = true;
            this.curEditorTitle = transformationUrl(item.urlType,this.promotionUrl,item.urlData,item.contentPageId)
            this.isEditorShow = true;
            list.insertBefore(editor, listItems[index]);
        },
        remove(item, index) {
            this.list = this.list.splice(index, 1);
        },
        //确定
        handlerConfirm() {
            for (let key in this.curEditorItem) {
                if (
                    typeof this.curEditorItem[key] == "string" &&
                    !trim(this.curEditorItem[key])
                ) {
                    notify(this, "请完善图文信息!", "error");
                    return false;
                }
            }

            if (!this.isEditor) {
                this.list.push(this.curEditorItem);
                this.isEditorShow = false;
            } else {
                // 编辑
                this.$set(this.list, this.index, this.curEditorItem);
            }
            this.$emit("handlerSaveImgText", this.list);
            this.isEditorShow = this.isEditor = false;
            // 添加完成后重置一下
            this.curEditorItem = {
                title: "",
                description: "",
                picUrl: require('img/picCover.png'),
                urlType: "",
                urlData: "",
                contentPageId: ''
            };
            this.picUrl = ''
            this.curEditorTitle = ''
        },
        //取消
        handlerCancel(){
            this.isEditorShow = false
        },
        handlerAddNewsImg() {
            this.index = this.list.length + 1;
            this.isEditorShow = true;
            this.isEditor = false;
        },
        // 获取图片
        async getImage(src) {
            // let {data} = await uploadImg(src);
            // this.picUrl = data;
             this.picUrl = src;
             this.curEditorItem.picUrl = src;
          
        },
        // 关闭弹层
        handleCloseModal() {
            this.imageChooseAreaShowFlag = false;
        },
        removePic() {
            this.picUrl = "";
        },
        setCover() {
            this.imageChooseAreaShowFlag = true;
        }
    },
    watch: {
        newsMsg() {
            this.list = this.newsMsg;
            this.replyTypes = this.replyType;
            this.isEditorShow = this.newsMsg.length > 0 ? false : true;
         
        },
       
    }
};
</script>
<style lang="scss" scoped>
.image-text {
    padding-top: 24px;
}
.list {
    width: 279px;
    margin: 0 auto;
    > li {
        position: relative;
        margin-bottom: 8px;
    }
    li.fist-item {
        height: 140px;
        overflow: hidden;
        border-radius: 4px;
        .imgwrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .headline {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px 16px;
            background: rgba(38, 38, 38, 0.5);
            color: #fff;
        }
    }
    li.list-item {
        height: 60px;
        padding: 0 10px 0 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .imgwrap {
            width: 50px;
            height: 50px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .mask {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(38, 38, 38, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        button {
            padding: 10px;
            .iconfont {
                color: #fff;
                &:hover {
                    color: #09cceb;
                }
            }
        }
    }
    li:hover .mask {
        opacity: 1;
    }
    // 编辑图文
    li.editor {
        height: auto;

        .example {
            height: 140px;
            position: relative;
            box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
        }
        .seting-info {
            padding-top: 8px;
            box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
            .seting-item {
                padding-bottom: 16px;
                
            }
            .seting-title {
                padding-bottom: 8px;
            }
            .seting-btn {
                display: flex;
                justify-content: space-around;
            }
            .editor-comfirm {
                display: inline-block;
                width: 70px;
                height: 32px;
                background: rgba(9, 204, 235, 1);
                border-radius: 2px;
                color: #fff;
            }
            .editor-cancel {
                display: inline-block;
                width: 70px;
                height: 32px;
                background: #fff;
                border-radius: 2px;
                color: rgba(9, 204, 235, 1);
                border: 1px solid rgba(9, 204, 235, 1);
            }
            .cover {
                width: 140px;
                height: 70px;
                border-radius: 2px;
                overflow: hidden;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                }
                &:hover .mask1 {
                    opacity: 1;
                }
                .upload-icon {
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #09cceb;
                    background: rgba(9, 204, 235, 0.1);
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    .el-icon-plus {
                        font-size: 24px;
                        color: #09cceb;
                    }
                }
            }
        }
    }
}
.footer-add {
    cursor: pointer;
    margin: 0 auto;
    width: 279px;
    height: 60px;
    line-height: 60px;
    padding: 0 10px 0 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
    border-radius: 4px;
    margin-bottom: 16px;
    .el-icon-plus {
        margin-right: 16px;
    }
}
.mask1 {
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
</style>