<template>
    <div class="article-content">
        <quill-editor
            ref="quillDetailEditor"
            themes="bubble"
            :id="quillId"
            :options="editorOption"
            @change="onEditorChange($event)"
        ></quill-editor>    
        <div class="mask" v-show="isModalShow"></div>
            <div id="content" class="contentDialog" v-show="isModalShow">
                <el-header class="modal-header">
                    <span style="font-size: 16px;">我的图片</span>
                    <button @click="cancelEditorImg">X</button>
                </el-header>
                <modal-content ref="imgList" :isGrid="true" :multiple="true" @getImgInfo="getImgInfo" :isPopup="true">
                    <div slot="modal-footer" class="modal-footer" style=" ">
                        <button type="button" @click="cancelEditorImg" class="cl-button cl-button--primary_notbg">取消</button>
                        <button type="button" @click="getEditorImg" class="cl-button cl-button--primary">确定</button>
                    </div>
                </modal-content>
            </div>
            <div class="image-select--upload__area" v-show="videoShow">
                <div class="mask"></div>
                <div id="videoContent" class="contentDialog">
                    <el-header class="modal-header" style="height:65px">
                        <span class="title" style="font-size: 16px;">我的视频</span>
                        <i class="iconfont iconguanbi cl-iconfont is-circle" @click="cancelgetVideo"></i>
                    </el-header>
                    <videoManage  :multiple="false" @getCheckedList="getCheckedList" :isPopup="true" :isSecond="true">
                        <div slot="modal-footer" class="modal-footer">
                            <button @click="cancelgetVideo" class="cl-button cl-button--primary_notbg">取消</button>
                            <button @click="getVideoOssUrl" class="cl-button cl-button--primary">确定</button>
                        </div>
                    </videoManage>
                </div>
            </div>
    </div>
</template>

<script>
// 引入编辑器
import Quill from "quill";
import { addQuillTitle } from "@/assets/quill-title.js";
import LineHeight from "@/assets/lineheight.js";
import LetterSpacing from "@/assets/letterspacing.js";
// require styles这里是富文本编辑器的样式引用
import "quill/dist/quill.snow.css";
// 自定义quill编辑器的字体
var fonts = [
    false,
    "SimSun",
    "SimHei",
    "Microsoft-YaHei",
    "KaiTi",
    "FangSong",
    "Arial",
    "Times-New-Roman"
];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);

// 自定义quill编辑器的字体大小
let Size = Quill.import("attributors/style/size");
let sizes = [false, "10px", "12px", "14px", "16px", "18px", "20px"];
Size.whitelist = sizes;
Quill.register(Size, true);

//自定义quill编辑器行间距
let lineheights = [false, "10px", "18px", "20px", "32px"];
Quill.register("formats/lineheight", LineHeight);

//自定义quill编辑器字间距
let letterspacings = [false, "5px", "8px", "10px", "15px"];
Quill.register("formats/letterspacing", LetterSpacing);

// 调整大小组件。
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
import { ImageDrop } from "quill-image-drop-module";
Quill.register("modules/imageDrop", ImageDrop);
import ModalContent from "@/components/ImgManage/index.vue";

//全屏
import Fullscreen from "@/assets/Fullscreen"
Quill.register("modules/fullscreen", Fullscreen)

import Video from "@/assets/quill-video"
Quill.register(Video, true)

import environment from "@/environment/index";
import videoManage from "@/components/VideoManage/popupIndex.vue";
export default {
    props: {
        detailContent: {
            type: String,
            default: ""
        },
        quillId: {
            type: String,
            default: ""
        },
     },
    components: {
        ModalContent,
        videoManage
    },
    provide: {
        popper: true
    },
    data(){
        return{
            isModalShow: false,
            videoShow: false,
            editorOption: {},
            checkedList: [],
            ratio:[],
            origin: [],
        }
    },
    created() {
        this.editorOption = {
            placeholder: "请输入文本",
            modules: {
                fullscreen: {},
                toolbar: {
                    container: [
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote", "code-block"],
                        // [{ header: 1 }, { header: 2 }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        //[{ direction: "rtl" }],
                        [{ size: sizes }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ color: [] }],
                        [{ background: [] }],
                        [{ font: fonts }],
                        [{ align: [] }],
                        ["clean"],
                        ["image"], //["image", "video"],
                        ["video"],
                        [{ lineheight: lineheights }],
                        [{ letterspacing: letterspacings }],
                        ['fullscreen']
                    ],
                    handlers: {
                        fullscreen() {
                            this.quill.getModule('fullscreen').handle()
                        }
                    }
                },
                imageDrop: true,
                imageResize: {
                    displayStyles: {
                        backgroundColor: "black",
                        border: "none",
                        color: "white"
                    },
                    modules: ["Resize", "DisplaySize", "Toolbar"]
                }
            }
        };
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.$emit('detailContentChange',html);
        },
        getCheckedList(info) {
            this.checkedList = info;
        },
        getImgInfo(info) {
            this.imgData = info;
        },
        imageHandler() {
            this.isModalShow = !this.isModalShow;
            this.imgRange = this.$refs.quillDetailEditor.quill.getSelection();
            this.selectRangeIndex = this.imgRange !== null ? this.imgRange.index : 0;
        },
        quillDetailEditor(info) {
            this.imgData = info;
        },
        getEditorImg() {
            this.isModalShow = false;
             this.$refs.imgList.clearSelectedList()
            this.insertEditorImg(this.imgData);
        },
        insertEditorImg(imgFiles) {
            if (imgFiles && imgFiles.length > 0) {
                for (var i = 0; i < imgFiles.length; i++) {
                    this.addRange = this.$refs.quillDetailEditor.quill.getSelection();
                    var value = imgFiles[i].fullOssUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.quillDetailEditor.quill.insertEmbed(
                        this.addRange !== null ? this.addRange.index :this.selectRangeIndex,
                        "image",
                        value,
                        Quill.sources.USER
                    );
                }
            }
        },
        // 关闭图片选择弹窗
        cancelEditorImg() {
            this.isModalShow = false;
        },
        videoHandler(){
            this.videoShow = true;
            this.videoRange = this.$refs.quillDetailEditor.quill.getSelection();
            this.selectVideoRangeIndex = this.videoRange !== null ? this.videoRange.index : 0;
        },
        getVideoOssUrl() {
            if (this.checkedList.length > 0) {
                this.videoShow = false;
                this.insertQuillVideo(this.checkedList);
            } else {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `请选择视频`,
                    showClose: false,
                    duration: 1000
                });
            }
        },
        cancelgetVideo() {
            this.videoShow = false;
        },
        //视频增加拖动事件
        videoAddDragEvent(){
            let dragEles = document.getElementById(this.quillId).querySelectorAll(".ql-dragHandler");
            let videoEles = document.getElementById(this.quillId).querySelectorAll(".ql-video-content");
            let container = document.getElementById(this.quillId).querySelector(".ql-editor");
            if(videoEles){
                for(var i=0; i<videoEles.length; i++){
                    this._bindDragEvents(dragEles[i], container, videoEles[i], i);
                } 
            }
        },
         // 注册 鼠标拖动 事件 
        _bindDragEvents(dragEle, container, ele, i) {
            var dragging = false;
            var start = 0;
            var moveDis = 0;
            let thisDom= this;
            dragEle.addEventListener('mousedown', (e)=> {
                e.stopPropagation();
                dragging = true;
                this.origin[i] = {
                width: ele.offsetWidth,
                height: ele.offsetHeight
                };
                this._setHandlerPos(dragEle, ele);
                start = e.pageX;
                this.ratio[i] = ele.offsetHeight / ele.offsetWidth;
            })
            container.addEventListener('mousemove', (e)=> {
                e.stopPropagation();
                if (dragging) {
                moveDis = e.pageX - start;
                thisDom._setElementSize(ele, moveDis, i);
                thisDom._setHandlerPos(dragEle, ele);
                }
            })
            container.addEventListener('mouseup', (e)=> {
                e.stopPropagation();
                if (dragging) {
                moveDis = e.pageX - start;
                thisDom._setElementSize(ele, moveDis, i)
                thisDom._setHandlerPos(dragEle, ele);
                dragging = false;
                }
            })
            container.addEventListener('mouseleave', (e)=> {
                e.stopPropagation();
                if (dragging) {
                moveDis = e.pageX - start;
                thisDom._setElementSize(ele, moveDis, i)
                thisDom._setHandlerPos(dragEle, ele);
                dragging = false;
                }
            })
            dragEle.addEventListener('mouseup', (e)=> {
                e.stopPropagation();
                moveDis = e.pageX - start;
                thisDom._setElementSize(ele, moveDis, i);
                thisDom._setHandlerPos(dragEle, ele);
                dragging = false;
            })
            ele.addEventListener('mouseup', (e)=> {
                e.stopPropagation();
                thisDom._setElementSize(ele, moveDis, i);
                thisDom._setHandlerPos(dragEle, ele);
                dragging = false;
            })
        },
        // resize 元素大小
        _setElementSize(ele, dis, i) {
            if (this.origin[i]) {
                var newWidth = this.origin[i].width + dis
                ele.style.width = newWidth + 'px';
                ele.style.height = newWidth * this.ratio[i] + 'px';
            }
        },
        // repos 拖动  位置
        _setHandlerPos(handlerEle, clickEle) {
            handlerEle.style.display = 'block';
            handlerEle.style.left = clickEle.offsetLeft + clickEle.offsetWidth - 4 + 'px';
            handlerEle.style.top = clickEle.offsetTop + clickEle.offsetHeight - 4 + 'px';
        },
        insertQuillVideo(videoList) {
            if (videoList && videoList.length > 0) {
                for (var i = 0; i < videoList.length; i++) {
                    this.addRange = this.$refs.quillDetailEditor.quill.getSelection();
                    var videoUrl = videoList[i].contentQueryDownloadApiUrl;
                    var poster = videoList[i].coverUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.quillDetailEditor.quill.insertEmbed(
                        this.addRange !== null ? this.addRange.index :this.selectVideoRangeIndex,
                        "video",
                        {
                            url: `${environment.contentQueryApi}/`+videoUrl,
                            width: '100%',
                            height: '100%',
                            poster: poster
                        }
                    );
                    this.videoAddDragEvent();
                }
                
            }
        },
        _setQuillContent(content){
            console.log(content);
            document.getElementById(this.quillId).querySelector(".ql-editor").innerHTML=content;
            this.videoAddDragEvent();
        }
    },
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.quillDetailEditor.quill
            .getModule("toolbar")
            .addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        this.$refs.quillDetailEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        //this.$refs.quillDetailEditor.quill.root.addEventListener("dblclick",this.imgChangeSizeHandler,!1);
        addQuillTitle();
        this._setQuillContent(this.detailContent);
    },
}
</script>


<style scoped lang="scss">
@import "@/components/style/contentDetail.scss";

</style>
<style scoped lang="scss">
.quill-editor /deep/ .ql-container {
    height: 420px;
    overflow: hidden;
    font-family:   Helvetica, Arial, sans-serif;
    font-size: 13px;
}
.el-textarea /deep/ .el-input__count {
    background: #fff;
    bottom: 1px;
    right: 22px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
    padding-bottom: 50px;
}
.quill-editor /deep/ .ql-container .ql-dragHandler {
    position:absolute;
    top:0; 
    left:0; 
    display:none; 
    border:2px solid rgb(170, 24, 121); 
    border-radius:50%; 
    width:12px; 
    height:12px; 
    cursor:nw-resize;
}
</style>

<style lang="scss">
/* 字体大小 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "字体大小";
}
/* 标题 */
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "标题";
}
/* 字体 */
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "字体";
}

.editor-fullscreen{
    background: white;
    margin: 0 !important;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    .ql-editor{
        position: relative;
        height: 100%;
    }
    .fullscreen-editor {
        border-radius: 0;
        border: none;
    }
    .ql-container {
        height: calc(100vh - 3rem - 24px) !important; 
        margin: 0 auto;
        overflow-y: auto;
    }
}
</style>
<style lang="scss" scoped>
#content{
    overflow: hidden;
}
#videoContent {
    position: fixed;
    width: 1170px;
    // height: 840px;
    margin: auto;
    z-index: 1020;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    box-shadow: 0px 2px 32px 4px rgba(0,0,0,0.13);
    border: $--border-base;
    border-radius: $--border-radius-base;
}
#videoContent .modal-header {
    background: rgb(255, 255, 255);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: $--border-base;
    .title{
        font-size: 16px;
        font-weight: 500;
        color: rgba(38,38,38,1);
    }

}
#videoContent .el-container {
    background: #fff;
    height: 773px;
}
#videoContent .el-dialog {
    margin-top: 5vh !important;
    width: 80%;
    overflow: hidden;
}
#videoContent .el-dialog__body {
    padding-top: 0;
}

.modal-footer {
    float: right;
    height: 88px;
   
    position: absolute;
    bottom: -11px;
    right: 16px;
    width: 100%;
    z-index: 100;
    text-align: right;
    padding-top: 0;
    button {
        margin-top: 24px;
    }
}
</style>