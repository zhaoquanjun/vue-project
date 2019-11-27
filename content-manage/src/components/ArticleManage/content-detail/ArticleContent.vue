<template>
    <div class="article-content" id="article-content">
        <el-form
            class="base-ariticle"
            @submit.native.prevent
            :model="articleDetail"
            :rules="rules"
            ref="articleDetail"
        >
            <div class="content-item">
                <el-row>
                    <el-col :span="24">
                        <div class="content-title">基本信息</div>
                    </el-col>
                </el-row>
                <el-form-item label prop="title">
                    <el-input
                        class="contentDetail-title"
                        placeholder="请输入文章标题（必填）"
                        v-model="articleDetail.title"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label prop="summary" class="desc-textarea">
                    <el-input
                        type="textarea"
                        placeholder="请输入文章简介"
                        :autosize="{ minRows:3, maxRows: 3}"
                        v-model="articleDetail.summary"
                        maxlength="500"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <div>
                        <div style="float:left">
                            <span style="font-size:12px">分类</span>
                            <span class="select-sort" style="width:200px;">
                                <SelectTree
                                    size="small"
                                    placeholder="请选择"
                                    :categoryName="categoryName"
                                    :categoryId="categoryId"
                                    :tree-result="treeResult"
                                    @chooseNode="chooseNode"
                                />
                            </span>
                        </div>
                        <div style="float:right">
                            <span style="font-size:12px">状态</span>
                            <span class="select-sort">
                                <el-select
                                    size="small"
                                    v-model="articleDetail.isPublish"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </span>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <div class="content-item">
                <el-row>
                    <el-col :span="24">
                        <div class="content-title">文章详情</div>
                    </el-col>
                </el-row>
                <el-form-item label prop="contentDetail">
                    <!-- quill-editor 编辑一-->
                    <quill-editor
                        ref="myQuillEditor"
                        themes="bubble"
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
                                <button type="button" @click="getEditorImg" class="sure">确定</button>
                                <button type="button" @click="cancelEditorImg" class="cancel">取消</button>
                            </div>
                        </modal-content>
                    </div>
                    <div class="image-select--upload__area" v-show="videoShow">
                        <div class="mask"></div>
                        <div id="videoContent" class="contentDialog">
                            <el-header class="modal-header" style="height:65px">
                                <span class="title" style="font-size: 16px;">我的视频</span>
                                <span class="close-icon" @click="cancelgetVideo">
                                    <i class="iconfont iconguanbi"></i>
                                </span>
                            </el-header>
                            <videoManage  :multiple="false" @getCheckedList="getCheckedList" :isPopup="true" :isSecond="true">
                                <div slot="modal-footer" class="modal-footer">
                                    <button @click="cancelgetVideo" class="cancel">取消</button>
                                    <button @click="getVideoOssUrl" class="sure">确定</button>
                                </div>
                            </videoManage>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <div class="content-item set-article">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="文章设置" name="1">
                        <el-form-item label="时间">
                            <div>
                                <div style="float:left">
                                    <el-col>
                                        <el-form-item prop="createTime">
                                            <el-date-picker
                                                type="datetime"
                                                v-model="articleDetail.createTime"
                                                placeholder="选择日期时间"
                                                style="width: 100%;"
                                            ></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </div>
                                <div style="float:left;margin-left: 35px;">
                                    <span style="padding: 0 12px 0 0;color: #606266;">预览网站</span>
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content">将在所选网站的二级域名下打开预览页面</div>
                                        <i class="iconfont iconyiwen"></i>
                                    </el-tooltip>
                                    <span class="select-sort">
                                        <el-select
                                            size="small"
                                            :value="articleDetail.defaultSiteId == 0 ? null : articleDetail.defaultSiteId"
                                            placeholder="请选择"
                                            @change="changeSiteId"
                                        >
                                            <el-option
                                                v-for="item in siteOptions"
                                                :key="item.siteId"
                                                :label="item.siteName"
                                                :value="item.siteId"
                                            ></el-option>
                                        </el-select>
                                    </span>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="置顶" prop="delivery">
                            <el-switch v-model="articleDetail.isTop"></el-switch>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
                <el-collapse v-model="activeName1" accordion>
                    <el-collapse-item title="搜索引擎优化" name="1">
                        <el-form-item label="SEO标题" prop="metaTitle">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">不填写则默认使用文章标题</div>
                                <i class="iconfont iconyiwen"></i>
                            </el-tooltip>
                            <el-input
                                class="contentDetail-title"
                                maxlength="100"
                                show-word-limit
                                placeholder="SEO标题"
                                v-model="articleDetail.metaTitle"
                            ></el-input>
                        </el-form-item>
                        <el-form-item style="position:relative" label="SEO关键词" prop="metaKeywords">
                            <ul class="keyword-list" ref="metaKeywordList">
                                <li v-for="(item,index) in articleDetail.metaKeywords" :key="index">
                                    {{item}}
                                    <i
                                        class="el-icon-close"
                                        @click.stop="removeCurmetaKeyWord(index)"
                                    ></i>
                                </li>
                                <el-input
                                    maxlength="10"
                                    ref="metaKeywordsInput"
                                    placeholder="每个关键词之间用回车键分离"
                                    v-model="metaKeyword"
                                    @keyup.enter.native="keywords(metaKeyword,'metaKeywords')"
                                    @blur="keywordsBlur(metaKeyword,'metaKeywords')"
                                ></el-input>
                            </ul>
                            <div class="el-form-item__error" v-if="isOutSeo">每篇文章最多填写5个关键词！</div>
                            <!-- <el-input placeholder="SEO关键词" v-model="articleDetail.metaKeywords"></el-input> -->
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>
    </div>
</template>
<script>
import environment from "@/environment/index";
import * as articleManageApi from "@/api/request/articleManageApi";
import SelectTree from "@/components/common/SelectTree";
import { formatDate } from "@/utlis/date.js";
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

import videoManage from "@/components/VideoManage/popupIndex.vue";
export default {
    components: {
        SelectTree,
        ModalContent,
        videoManage
    },
    provide: {
        popper: true
    },
    data() {
        var checkWord = (rule, value, callback) => {
            if (value.length > 4) {
                callback("每篇文章最多填写5个关键词！");
            } else {
                callback();
            }
        };
        return {
            isOutSeo: false,
            isOutSearch: false,
            treeResult: null,
            categoryName: "全部分类",
            categoryId: -1,
            options: [
                {
                    value: true,
                    label: "上线"
                },
                {
                    value: false,
                    label: "下线"
                }
            ],
            siteOptions: null,
            value: true,
            activeName: "",
            activeName1: "",
            NewId: "",
            articleDetail: {
                NewId: "",
                title: "",
                categoryId: 0,
                summary: "",
                contentDetail: "",
                searchKeywords: [],
                isPublish: false,
                isLoggedInCanView: false,
                createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
                isTop: false,
                metaTitle: "",
                metaKeywords: [],
                metaDescription: "",
                pictureUrl: "",
                defaultSiteId: 0
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入文章标题",
                        trigger: "blur"
                    }
                ]

                // searchKeywords: [{ validator: checkWord }]
            },
            isModalShow: false,
            editorOption: {},
            keywordValue: "",
            metaKeyword: "",
            isNewAdd: false,
            selectRangeIndex: 0,
            selectVideoRangeIndex: 0,
            videoShow: false,
            checkedList: [],
            ratio:[],
            origin: [],
        };
    },
    created() {
        let start = new Date();
        var id = this.$route.query.id;
        this.articleDetail.categoryId = this.$route.query.categoryId;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
            this.$emit("changeOperateName", "编辑");
            this.$emit("changeSaveWay", true);
        }
        this.getTreeAsync();
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
        this.getSiteList();
    },
    methods: {
        textIndent(ele, width) {
            this.$nextTick(() => {
                ele.style.textIndent = width + "px";
            });
        },
        keywords(value, name) {
            this.metaKeyword = this.keywordValue = "";
            if (name === "metaKeywords") {
                if (this.articleDetail.metaKeywords.length >= 5 || !value) {
                    this.isOutSeo = true;
                    return;
                }
                this.isOutSeo = false;
                this.articleDetail.metaKeywords.push(value);
            } else {
                if (this.articleDetail.searchKeywords.length >= 5 || !value) {
                    this.isOutSearch = true;
                    return;
                }
                this.isOutSearch = false;
                this.articleDetail.searchKeywords.push(value);
            }
        },
        keywordsBlur(value, name) {
            this.metaKeyword = this.keywordValue = "";
            if (name === "metaKeywords") {
                this.isOutSeo = false;
            } else {
                this.isOutSearch = false;
            }
        },
        removeCurKeyWord(index) {
            this.articleDetail.searchKeywords.splice(index, 1);
        },
        removeCurmetaKeyWord(index) {
            this.articleDetail.metaKeywords.splice(index, 1);
        },
        async getTreeAsync() {
            let { data } = await articleManageApi.getArticleCategory();
            this.treeResult = data;

            var categoryName = this.$route.query.categoryName;
            if (categoryName != null || categoryName != undefined) {
                this.categoryName = categoryName;

                this.categoryId = parseFloat(this.$route.query.categoryId);
            } else {
                this.categoryId = 0;
            }
        },
        async getArticleDetail(id) {
            let { data } = await articleManageApi.getArticleDetail(id);
            if (Object.keys(data.metaKeywords).length < 1) {
                data.metaKeywords = [];
            } else {
                data.metaKeywords = data.metaKeywords.split(",");
            }
            if (Object.keys(data.searchKeywords).length < 1) {
                data.searchKeywords = [];
            } else {
                data.searchKeywords = data.searchKeywords.split(",");
            }
            this.articleDetail = data;
            document.getElementsByClassName("ql-editor")[0].innerHTML = this.articleDetail.contentDetail;
            this.articleDetail.NewId = data.id;
            this.$emit("changePreviewId", id, this.articleDetail.defaultSiteId);
            this.videoAddDragEvent();
        },
        //选择移动分类时的节点
        chooseNode(node) {
            this.articleDetail.categoryId = node.id;
            this.categoryName = node.label;
        },
        // 新建保存
        submitForm(formName, imageUrl, disableRefObj) {
            this.articleDetail.pictureUrl = imageUrl;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.insertArticle(disableRefObj);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //插入文章
        async insertArticle(disableRefObj) {
            disableRefObj.inSaveProcess = true;
            var html=document.getElementsByClassName("ql-editor")[0].innerHTML;
            this.articleDetail.contentDetail = html;
            let { status, data } = await articleManageApi.createArticle(
                this.articleDetail
            );
            disableRefObj.inSaveProcess = false;
            if (status === 200) {
                this.$confirm("保存成功!", "提示", {
                    confirmButtonText: "新增下一篇",
                    iconClass: "icon-success",
                    cancelButtonText: "关闭",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resetForm("articleDetail");
                            this.resetDetail();
                            this.$emit("changeSaveWay", false);
                            this.$emit("changePreviewId", "", 0);
                        } else {
                            this.NewId = data;
                            this.articleDetail.NewId = data;
                            this.$emit("changeSaveWay", true);
                            this.$emit(
                                "changePreviewId",
                                data,
                                this.articleDetail.defaultSiteId
                            );
                        }
                    }
                });
            }
        },
        // 编辑提交
        editArticle(formName, imageUrl, disableRefObj) {
            this.articleDetail.pictureUrl = imageUrl;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveArticle(disableRefObj);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑保存文章
        async saveArticle(disableRefObj) {
            disableRefObj.inSaveProcess = true;
            var html=document.getElementsByClassName("ql-editor")[0].innerHTML;
            this.articleDetail.contentDetail = html;
            let { status, data } = await articleManageApi.editArticle(
                this.articleDetail
            );
            disableRefObj.inSaveProcess = false;
            this.$confirm("保存成功!", "提示", {
                confirmButtonText: "新增下一篇",
                customClass: "medium",
                iconClass: "icon-success",
                cancelButtonText: "关闭",
                callback: async action => {
                    if (action === "confirm") {
                        this.resetForm("articleDetail");
                        this.resetDetail();
                        this.$emit("changeSaveWay", false);
                        this.$emit("changePreviewId", "", 0);
                        this.$route.query.id = false;
                    } else {
                        this.articleDetail.NewId =
                            this.$route.query.id || this.NewId;
                        this.$emit("changeSaveWay", true);
                        this.$emit(
                            "changePreviewId",
                            this.articleDetail.NewId,
                            this.articleDetail.defaultSiteId
                        );
                    }
                }
            });
        },

        imgChangeSizeHandler(img) {
            img.width = "100";
            img.height = "100";
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        onEditorChange({ editor, html, text }) {
            this.articleDetail.contentDetail = html;
        },
        imageHandler() {
            this.isModalShow = !this.isModalShow;
            this.imgRange = this.$refs.myQuillEditor.quill.getSelection();
            this.selectRangeIndex = this.imgRange !== null ? this.imgRange.index : 0;
        },
        getImgInfo(info) {
            //console.log(info, "0000000");
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
                    this.addRange = this.$refs.myQuillEditor.quill.getSelection();
                    var value = imgFiles[i].fullOssUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.myQuillEditor.quill.insertEmbed(
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
            this.videoRange = this.$refs.myQuillEditor.quill.getSelection();
            this.selectVideoRangeIndex = this.videoRange !== null ? this.videoRange.index : 0;
        },
        getCheckedList(info) {
            this.checkedList = info;
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
                    this.addRange = this.$refs.myQuillEditor.quill.getSelection();
                    var videoUrl = videoList[i].contentQueryDownloadApiUrl;
                    var poster = videoList[i].coverUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.myQuillEditor.quill.insertEmbed(
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
        // 关闭图片选择弹窗
        cancelgetVideo() {
            this.videoShow = false;
        },
        resetDetail() {       
            this.articleDetail = {
                NewId: "",
                title: "",
                categoryId: this.articleDetail.categoryId,
                summary: "",
                contentDetail: "",
                searchKeywords: [],
                isPublish: false,
                createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
                isTop: false,
                metaTitle: "",
                metaKeywords: [],
                metaDescription: "",
                pictureUrl: "",
                defaultSiteId: 0
            };
            document.getElementsByClassName("ql-editor")[0].innerHTML = "";
        },
        //获取app下所有站点
        async getSiteList() {
            let { data } = await articleManageApi.getSiteList();
            this.siteOptions = data;
        },
        changeSiteId(siteId) {
            this.articleDetail.defaultSiteId = siteId;
        },
        //视频增加拖动事件
        videoAddDragEvent(){
            let dragEles = document.getElementsByClassName("ql-dragHandler");
            let videoEles = document.getElementsByClassName("ql-video-content");
            let container = document.getElementsByClassName("ql-editor")[0];
            if(videoEles){
                for(var i=0; i<videoEles.length; i++){
                    this._bindDragEvents(dragEles[i], container, videoEles[i], i);
                } 
            }
        }
    },
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.myQuillEditor.quill
            .getModule("toolbar")
            .addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        //this.$refs.myQuillEditor.quill.root.addEventListener("dblclick",this.imgChangeSizeHandler,!1);
        addQuillTitle();
    },
    computed: {},
    watch: {
        "articleDetail.searchKeywords"() {
            if (this.articleDetail.searchKeywords.length < 5) {
                this.isOutSearch = false;
            }
        },
        "articleDetail.metaKeywords"() {
            if (this.articleDetail.metaKeywords.length < 5) {
                this.isOutSeo = false;
            }
        },
        deep: true,
        immediate: true
    }
};
</script>


<style scoped lang="scss">
@import "@/components/style/contentDetail.scss";

</style>
<style scoped lang="scss">
.quill-editor /deep/ .ql-container {
    height: 420px;
    overflow: hidden;
}
.el-textarea /deep/ .el-input__count {
    background: #fff;
    bottom: 1px;
    right: 22px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
    padding-bottom: 50px;
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
    .close-icon {
        display: block;
        width: 16px;
        height: 16px;
        cursor: pointer;
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
        width: 76px;
        height: 40px;
        background: rgba(0,193,222,1);
        border-radius: $--border-radius-base;
        // line-height: 40px;
        background: rgba(0, 193, 222, 1);
        margin-right: 16px;
        color: #fff;
    }
    .cancel {
        color: rgba(9,204,235,1);
        background: rgba(255,255,255,1);
        border: 1px solid $--color-success;
    }
}
</style>