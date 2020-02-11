<template>
    <div class="article-content">
        <quill-editor
            ref="quillDetailEditor"
            themes="bubble"
            :id="quillId"
            :options="editorOption"
            @change="onEditorChange($event)"
        ></quill-editor>    
        <div class="mask" v-if="isModalShow"></div>
        <div id="content" class="contentDialog" v-if="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <button @click="cancelEditorImg"><i class="el-icon el-icon-close cl-iconfont is-circle"></i></button>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" :multiple="true" @getImgInfo="getImgInfo" :isPopup="true">
                <div slot="modal-footer" class="modal-footer" style=" ">
                    <button type="button" @click="cancelEditorImg" class="cl-button cl-button--primary_notbg">取消</button>
                    <button type="button" @click="getEditorImg" class="cl-button cl-button--primary">确定</button>
                </div>
            </modal-content>
        </div>
        <div class="image-select--upload__area" v-if="videoShow">
            <div class="mask"></div>
            <div id="videoContent" class="contentDialog">
                <videoManage  :multiple="false" @cancelgetVideo="cancelgetVideo" @getCheckedList="getCheckedList" :isPopup="true">
                    <div slot="modal-footer" class="modal-footer">
                        <button @click="cancelgetVideo" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
                        <button @click="getVideoOssUrl" class="cl-button cl-button--small cl-button--primary">确定</button>
                    </div>
                </videoManage>
            </div>
        </div>
        <popup v-if="popupShow" :siteId="siteId" @handleClosePopup="handleClosePopup" @insertLink="insertLink">
        </Popup>
    </div>
</template>

<script>
import Popup from '@/components/link/popup.vue'
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

//import Link from "@/assets/quill-link"
//Quill.register(Link, true)
var LinkBlot= Quill.import("formats/link");

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
        siteId: {
            type: Number
        }
     },
    components: {
        ModalContent,
        videoManage,
        Popup
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
            maxHeight:0,
            maxWidth:0,
            dragVideoNode:null,
            popupShow:false,
            linkSelection:null
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
                        ['link'], 
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
            this.$refs.imgList &&  this.$refs.imgList.clearSelectedList()
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
           // let dragEles = document.getElementById(this.quillId).querySelectorAll(".ql-dragHandler");
            let videoEles = document.getElementById(this.quillId).querySelectorAll(".ql-video-content");
            let container = document.getElementById(this.quillId).querySelector(".ql-container");
            if(videoEles){
                for(var i=0; i<videoEles.length; i++){
                    this._bindDragEvents(container,videoEles[i],i);
                } 
            }
        },
         // 注册 鼠标拖动 事件 
        _bindDragEvents(containerNode, videoNode, i) {
            var thisDom = this;
            videoNode.addEventListener('click',(e)=>{
                var dragNode;
                if(containerNode.querySelector('.ql-dragHandler'))
                {
                    dragNode= containerNode.querySelector('.ql-dragHandler');
                }else{
                    dragNode = document.createElement("div");
                    dragNode.setAttribute('class', 'ql-dragHandler');
                    dragNode.setAttribute('style', " ");
                    containerNode.append(dragNode);
                }
                thisDom.maxHeight = containerNode.offsetHeight - 30;
                thisDom.maxWidth = containerNode.offsetWidth - 30;
                if(thisDom.maxHeight > 700) thisDom.maxHeight = 700;
                thisDom._setDragOffset(dragNode,videoNode);
                thisDom._setDragHandler(dragNode,videoNode);
            })
        },        
        //设置拖拽的事件
        _setDragHandler(dragNode,videoNode){
            this.dragVideoNode = videoNode;
            dragNode.addEventListener('mousedown',this._handleMousedown,false);
        },
        // 设置拖拽按钮的位置(根据视频的位置)
        _setDragOffset(handlerEle, videoNode) {            
            handlerEle.style.display = 'block';
            handlerEle.style.left = videoNode.offsetLeft + videoNode.offsetWidth - 6 + 'px';
            handlerEle.style.top = videoNode.offsetTop + videoNode.offsetHeight - 6 + 'px';
        },
        _handleMousedown(evt){
            var target = evt.target;
            var ev = ev || window.event;
            var disX = ev.clientX; // 获取鼠标按下时光标x的值
            var disY = ev.clientY; // 获取鼠标按下时光标Y的值
            var disW = this.dragVideoNode.offsetWidth; // 获取拖拽前的宽
            var disH = this.dragVideoNode.offsetHeight; // 获取拖拽前的高
            // listen for movement and mouseup
            var thisDom = this;
            document.onmousemove = function (ev) {
                var ev = ev || window.event;
                //拖拽时为了对宽和高 限制一下范围，定义两个变量
                var W = ev.clientX - disX + disW;
                var H = ev.clientY - disY + disH;
                //if(W < 100)  W = 100;
                if(W > thisDom.maxWidth) W = thisDom.maxWidth;
                //if(H < 100) H = 100;
                if(H > thisDom.maxHeight) H = thisDom.maxHeight;
                thisDom.dragVideoNode.style.width = W +'px';// 拖拽后物体的宽
                thisDom.dragVideoNode.style.height = H +'px';// 拖拽后物体的高
                thisDom.dragVideoNode.parentNode.style.width = W + 4 +'px';// 拖拽后物体的宽
                thisDom.dragVideoNode.parentNode.style.height = H + 4 +'px';// 拖拽后物体的高
                thisDom._setDragOffset(target,thisDom.dragVideoNode)
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                let container = document.getElementById(thisDom.quillId).querySelector(".ql-container");
                var dragNode=container.querySelector('.ql-dragHandler');
                if(dragNode){
                    container.removeChild(dragNode);
                }
            }
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
                }
                this.videoAddDragEvent();
            }
        },
        _setQuillContent(content){
            document.getElementById(this.quillId).querySelector(".ql-editor").innerHTML=content;
            this.videoAddDragEvent();
        },
        linkHandler(){
            var range = this.$refs.quillDetailEditor.quill.getSelection();
            if(range && range.length>0){
                this.linkSelection = range;
                this.popupShow = true;
            }else{
                this.linkSelection = null;
            }
        },
        handleClosePopup(val) {
            this.popupShow = val;
            return false;
        },
        insertLink(linkData){
            //插入a link
            if(linkData.Ctype=="none"){
                //无链接 不处理                
            }
            else{       
                this.$refs.quillDetailEditor.quill.format('link',linkData.Href, Quill.sources.USER);
                if(this.linkSelection!=null && (linkData.Target!="_blank" || linkData.Ctype=="file")){
                    let lines = this.$refs.quillDetailEditor.quill.getLines(this.linkSelection.index, this.linkSelection.length);
                    if(lines!=null&&lines.length>0){
                        if(lines[0].children&&lines[0].children.length>0){
                            lines[0].children.forEach(element => {
                                var linkText = this.$refs.quillDetailEditor.quill.getContents(this.linkSelection.index,this.linkSelection.length).ops[0].insert;
                                var elementText = element.text==undefined?element.domNode.text:element.text;
                                if(element.domNode.nodeName=="A" && linkText== elementText){                                    
                                    if(linkData.Ctype=="file"){
                                        element.domNode.setAttribute("data-type","file");
                                        element.domNode.target = linkData.Target;
                                    }else{
                                        element.domNode.target = "_self";
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    },
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.quillDetailEditor.quill.getModule("toolbar").addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        this.$refs.quillDetailEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        //this.$refs.quillDetailEditor.quill.root.addEventListener("dblclick",this.imgChangeSizeHandler,!1);
        // 为link绑定事件  getModule 为编辑器的内部属性
        this.$refs.quillDetailEditor.quill.getModule("toolbar").addHandler("link", this.linkHandler);
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
.ql-snow .ql-tooltip {
  text-align: center;
}
.ql-snow .ql-tooltip::before {
  content: "链接地址:";
  text-align: center;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip a.ql-action {
    display: none;
}
.ql-snow .ql-tooltip a.ql-action::after {
    border-right: 0px;
    content: '编辑';
    padding-right: 0px;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}
.ql-snow .ql-tooltip a.ql-remove::before {
    border-right: 0px;
    content: '移除';
    padding-right: 0px;
}
.ql-snow .ql-tooltip a.ql-preview{
    line-height: 26px;
    margin: 0px;
    padding: 6px 5px;
}
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
    // width: 1000px;
    // height: 840px;
    margin: auto;
    z-index: 1020;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    box-shadow: 0px 2px 32px 4px rgba(0,0,0,0.13);
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
    z-index: 99;
    text-align: right;
    padding-top: 0;
    button {
        margin-top: 24px;
    }
}
</style>