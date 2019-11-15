<template>
    <div class="article-content" id="article-content">
        <el-form
            class="base-ariticle"
            @submit.native.prevent
            :model="detailData"
            :rules="rules"
            ref="contentForm"
        >
            <div class="content-item">
                <el-row>
                    <el-col :span="24">
                        <div class="content-title">基本信息</div>
                    </el-col>
                </el-row>
                <el-form-item label prop="name">
                    <el-input
                        class="contentDetail-title"
                        placeholder="请输入产品标题（必填）"
                        v-model="detailData.name"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label prop="summary" class="desc-textarea">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows:3, maxRows: 3}"
                        placeholder="请输入产品简介"
                        v-model="detailData.description"
                        maxlength="500"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="flexSpace">
                        <div >
                            <span style="font-size:12px">分类:</span>
                            <span class="select-sort category">
                                <div class="product-category" @click.stop="multipleCatagory">
                                    <ul class="category-list">
                                        <li
                                            style="display:inline-block"
                                            v-for="(item) in detailData.productCategoryList"
                                            :key="item.id"
                                            @click.stop
                                        >
                                       
                                            <div class="category-item">
                                                <span>{{item.displayName}}</span>
                                                <i
                                                    v-if="item.id!=0"
                                                    class="el-icon-close"
                                                    @click="removeCategory(item.id)"
                                                ></i>
                                            </div>
                                        </li>
                                    </ul>
                                    <span
                                        @click.stop="multipleCatagory"
                                        class="el-select__caret"
                                        :class="[isCheckTreeShow===true?'el-icon-arrow-up':'el-icon-arrow-down']"
                                    ></span>
                                </div>
                                <div
                                    class="multipleCatagory"
                                    :style="{'height':(isCheckTreeShow?'auto':0)}"
                                >
                                    <DetailCheckTree
                                        ref="detailCheckTree"
                                        :tree-result="treeResult"
                                        :categoryName="categoryName"
                                        :categoryId="categoryId"
                                        @chooseNode="chooseNode"
                                    />
                                </div>
                               
                            </span>
                        </div>
                        <div>
                            <span style="font-size:12px">状态</span>
                            <span class="select-sort">
                                <el-select size="small" v-model="detailData.isOnSell" placeholder="请选择">
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
                        <div class="content-title">产品详情</div>
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
                        <modal-content ref="imgList" :isGrid="true" :multiple="true"  @getImgInfo="getImgInfo" :isPopup="true">
                            <div slot="modal-footer" class="modal-footer" style="">
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
                    <el-collapse-item title="产品设置" name="1">
                        <el-form-item label="时间">
                            <div>
                                <div style="float:left">
                                    <el-col>
                                        <el-form-item prop="createTime">
                                            <el-date-picker type="datetime"
                                                            v-model="detailData.publishTime"
                                                            placeholder="选择日期时间"
                                                            style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </div>
                                <div style="float:left;margin-left: 35px;">
                                    <span style="padding: 0 12px 0 0;color: #606266;">
                                        预览网站
                                    </span>
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content">
                                            将在所选网站的二级域名下打开预览页面
                                        </div>
                                        <i class="iconfont iconyiwen"></i>
                                    </el-tooltip>
                                    <span class="select-sort">
                                        <el-select size="small"
                                                   :value="detailData.defaultSiteId == 0 ? null : detailData.defaultSiteId"
                                                   placeholder="请选择"
                                                   @change="changeSiteId">
                                            <el-option v-for="item in siteOptions"
                                                       :key="item.siteId"
                                                       :label="item.siteName"
                                                       :value="item.siteId"></el-option>
                                        </el-select>
                                    </span>
                                </div>
                            </div>
                        </el-form-item>

                        <!-- <el-form-item label="搜索关键词" prop="searchKeyword">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">
                                    网站使用了搜索控件时，将使该网站的搜索
                                    <br />结果更加准确，一篇产品最多可以设置5个关键词
                                </div>
                                <i class="iconfont iconyiwen"></i>
                            </el-tooltip>
                            <ul class="keyword-list" ref="keywordList">
                                <li v-for="(item,index) in detailData.searchKeyword" :key="index">
                                    {{item}}
                                    <i class="el-icon-close"
                                       @click.stop="removeCurKeyWord(index)"></i>
                                </li>
                                <el-input maxlength="10"
                                          ref="keywordInput"
                                          placeholder="每个关键词之间用回车键分离"
                                          v-model="keywordValue"
                                          @keyup.enter.native="keywords(keywordValue)"
                                          @blur="keywords(keywordValue)"></el-input>
                            </ul>
                            <div class="el-form-item__error" v-if="isOutSearch">每篇文章最多填写5个关键词！</div>
                        </el-form-item> -->
                        <el-form-item>
                        </el-form-item>
                        <el-form-item label="置頂" prop="delivery">
                            <el-switch v-model="detailData.isTop"></el-switch>
                            <!-- <span style=" font-size: 14px; color: #606266;
    vertical-align: middle;
    padding:0  16px 0 32px ;">仅登录用户可访问</span>
                            <el-switch v-model="detailData.isLoggedInCanView"></el-switch> -->
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
                <el-collapse v-model="activeName1" accordion>
                    <el-collapse-item title="搜索引擎优化" name="1">
                        <el-form-item label="seo标题" prop="seoTitle">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">不填写则默认使用产品标题</div>
                                <i class="iconfont iconyiwen"></i>
                            </el-tooltip>
                            <el-input  class="contentDetail-title" maxlength="100" show-word-limit placeholder="seo标题" v-model="detailData.seoTitle"></el-input>
                        </el-form-item>
                        <el-form-item style="position:relative" label="seo关键词" prop="seoKeyword">
                            <ul class="keyword-list" ref="metaKeywordList">
                                <li v-for="(item,index) in detailData.seoKeyword" :key="index">
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
                                    @keyup.enter.native="keywords(metaKeyword,'seoKeyword')"
                                    @blur="keywords(metaKeyword,'seoKeyword')"
                                ></el-input>
                            </ul>
                            <div class="el-form-item__error" v-if="isOutSeo">每篇文章最多填写5个关键词！</div>
                            <!-- <el-input placeholder="seo关键词" v-model="detailData.seoKeyword"></el-input> -->
                        </el-form-item>

                        <el-form-item label="自定义地址" prop="customUrl">
                            <el-input placeholder="请输入自定义地址" class="address" v-model="detailData.customUrl"></el-input>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
            </div>
        </el-form>
    </div>
</template>
<script>
import * as productManageApi from "@/api/request/productManageApi";
import * as productCategoryManageApi from "@/api/request/productCategoryManageApi";
import DetailCheckTree from "./DetailCheckTree";
const viewAuth = [
    { name: "全选", id: 0 },
    { name: "登录用户", id: 1 },
    { name: "未登录用户", id: 2 }
];
// 引入编辑器
import * as Quill from "quill";
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
import Fullscreen from "@/assets/Fullscreen";
Quill.register("modules/fullscreen", Fullscreen);

import Video from "@/assets/quill-video"
Quill.register(Video, true)

import videoManage from "@/components/VideoManage/popupIndex.vue";

export default {
    components: {
        ModalContent,
        DetailCheckTree,
        videoManage,
    },
    provide: {
      popper:true
    },
    data() {
        return {
            isCheckTreeShow: false,
            isOutSeo: false,
            isOutSearch: false,
            checkAll: false,
            checkedviewAuth: [{ name: "登录用户", id: 1 }],
            viewAuth: viewAuth,
            isIndeterminate: true,
            options: [
                {
                    value: true,
                    label: "上架"
                },
                {
                    value: false,
                    label: "下架"
                }
            ],
            value: "上架",
            options1: [
                {
                    value: "选项1",
                    label: "全部分类1"
                },
                {
                    value: "选项2",
                    label: "全部分类2"
                }
            ],
            value2: ["全部分类1", "全部分类2"],

            siteOptions: null,
            activeName: "",
            activeName1: "",
            categoryName: [],
            categoryId: [],
            treeResult: null,
            detailData: {
                name: "",
                description: "",
                detailContent: "",
                price: 1, //
                costPrice: 1, //
                originalPrice: 1, //
                seoKeyword: [],
                searchKeyword: [],
                seoDescription: "",
                skuId: "", //
                publishTime: new Date(),
                customUrl: "",
                accessRoleList: [1],
                thumbnailPicUrlList: [],
                relatedProductList: [
                    {
                        id: "string",
                        name: "string"
                    }
                ],
                productCategoryList: [
                    // {
                    //     id: 1,
                    //     displayName: "", //
                    //     thumbnailPicUrl: "2" //
                    // }
                ],
                params: { name: 1 }, //
                isTop: true,
                isLoggedInCanView: false,
                isOnSell: true,
                isTemplate: false, //
                isSkuSwitchOn: false, //
                isNeedShipping: false, //
                isAllowComment: true,
                defaultSiteId: 0
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入产品标题",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 100,
                        message: "长度在 1 到 100 个字符",
                        trigger: "blur"
                    }
                ]
            },
            isModalShow: false,
            editorOption: {},
            keywordValue: "",
            metaKeyword: "",
            selectRangeIndex: 0,
            selectVideoRangeIndex: 0,
            videoShow: false,
            checkedList: [],
            ratio:[],
            origin: [],
        };
    },
    created() {
        this.getTree();
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
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.myQuillEditor.quill
            .getModule("toolbar")
            .addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        addQuillTitle();
        document.addEventListener("click", e => {
            e.stopPropagation();
            if (this.isCheckTreeShow) {
                this.multipleCatagory();
            }
            return false;
        });
        let categoryId = this.$route.query.categoryId;
        let categoryName = this.$route.query.categoryName;
        if (!!categoryId) {
           
            this.detailData.productCategoryList = [
                { id: categoryId, displayName: categoryName }
            ];
            this.categoryId = [categoryId];
        } else {
           
            this.detailData.productCategoryList = [
                { id: 0, displayName: "全部分类" }
            ];
        }
        var id = this.$route.query.id;
        this.curProduct = id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
            this.$emit("changeSaveWay", true);
        }
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
            if (name === "seoKeyword") {
                if (this.detailData.seoKeyword.length >= 5 || !value) {
                    return;
                }
                this.metaKeyword = "";
                this.detailData.seoKeyword.push(value);
            } else {
                if (this.detailData.searchKeyword.length >= 5 || !value) {
                    return;
                }
                this.keywordValue = "";
                this.detailData.searchKeyword.push(value);
            }
        },
        removeCurKeyWord(index) {
            this.detailData.searchKeyword.splice(index, 1);
        },
        removeCurmetaKeyWord(index) {
            this.detailData.seoKeyword.splice(index, 1);
        },
        async getArticleDetail(id) {
            let { data } = await productManageApi.getProductDetail(id);

            this.categoryId = [];

            if (Object.keys(data.seoKeyword).length < 1) {
                data.seoKeyword = [];
            } else {
                data.seoKeyword = data.seoKeyword.split(",");
            }
            if (Object.keys(data.searchKeyword).length < 1) {
                data.searchKeyword = [];
            } else {
                data.searchKeyword = data.searchKeyword.split(",");
            }
            this.detailData = data;
            this.detailData.NewId = data.id;
           
            //  let categoryList22 = JSON.stringify(this.detailData.productCategoryList);
            //  JSON.parse(categoryList22).forEach(item=>{
            //       this.categoryId.push(item.id);
            //  })
            document.getElementsByClassName("ql-editor")[0].innerHTML = this.detailData.detailContent;
            this.categoryIdList(this.detailData.productCategoryList);
            this.$emit("changePreviewId", id, this.detailData.defaultSiteId);
            this.videoAddDragEvent();
        },
        categoryIdList(list) {
            this.categoryId = [];
            list.forEach(item => {
                this.categoryId.push(item.id);
            });
        },
        // 新建保存
        submitForm(formName, fileList, disableRefObj) {
            this.detailData.thumbnailPicUrlList = fileList;
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
        //新建产品
        async insertArticle(disableRefObj) {
            disableRefObj.inSaveProcess = true;
            var html=document.getElementsByClassName("ql-editor")[0].innerHTML;
            this.detailData.detailContent = html;
            let { status, data } = await productManageApi.createProduct(
                this.detailData
            );
            disableRefObj.inSaveProcess = false;
            if (status === 200) {
                this.$confirm("保存成功!", "提示", {
                    confirmButtonText: "新增下一篇",
                    cancelButtonText: "关闭",
                    customClass: "medium",
                    iconClass: "icon-success",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resetForm("contentForm");
                            this.resetDetail();
                            this.$emit("changeSaveWay", false);
                            this.$emit("changePreviewId", "", 0);
                            this.$emit("handlerClickNewAdd");
                            // this.$refs.detailCheckTree.resetChecked();
                           
                        } else {
                            this.curProduct = data;
                            this.detailData.id = data;
                            this.$emit("changeSaveWay", true);
                            this.$emit("changePreviewId", data, this.detailData.defaultSiteId);
                        }
                    }
                });
            }
        },
        // 编辑提交
        editArticle(formName, fileList, disableRefObj) {
            if (fileList && fileList.length > 0) {
                this.detailData.thumbnailPicUrlList = fileList;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveArticle(disableRefObj);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑保存产品
        async saveArticle(disableRefObj) {
            disableRefObj.inSaveProcess = true;
            var html=document.getElementsByClassName("ql-editor")[0].innerHTML;
            this.detailData.detailContent = html;
            let { status, data } = await productManageApi.update(
                this.curProduct,
                this.detailData
            );
            disableRefObj.inSaveProcess = false;
            if (status === 200) {
                this.$confirm("保存成功!", "提示", {
                    confirmButtonText: "新增下一篇",
                    cancelButtonText: "关闭",
                    customClass: "medium",
                    iconClass: "icon-success",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resetForm("contentForm");
                            this.resetDetail();
                            this.$emit("changeSaveWay", false);
                            this.$emit("changePreviewId", "", 0);
                            this.$emit("handlerClickNewAdd");
                            this.$route.query.isEditor = 0;
                        } else {
                            this.curProduct = data;
                            this.detailData.id = data;
                            this.$emit("changeSaveWay", true);
                            this.$emit("changePreviewId", data, this.detailData.defaultSiteId);
                        }
                    }
                });
            }
        },
        /**
         * 获取 tree 结构
         */
        async getTree() {
            let { data } = await productCategoryManageApi.get();
            this.treeResult = data.treeArray;
        },
        chooseNode(data, boolean) {
          
            if (!!boolean) {
                
                if (!this.categoryId.includes(data.id)) {
                    if (this.detailData.productCategoryList.length >= 5) {
                        this.$notify({
                            customClass: "notify-error",
                            message: `一个产品最多设置五个分类!`,
                            showClose: false,
                            duration: 1500
                        });
                        return;
                    }
                    if(this.detailData.productCategoryList[0].id==0){
                        this.$refs.detailCheckTree.setChecked(0);
                     }
                    this.detailData.productCategoryList.push({
                        displayName: data.label,
                        id: data.id,
                        thumbnailPicUrl: data.thumbnailPicUrl
                    });
                }
                 if(this.detailData.productCategoryList[0].id==0){
                     if( this.$route.query.isEditor !=1) this.detailData.productCategoryList.splice(0,1)
                }
            } else {
                this.categoryId = [];
                this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
                    item => {
                        if (item.id != data.id) {
                            this.categoryId.push(item.id);
                            return true;
                        }
                    }
                );
             
                if (this.detailData.productCategoryList.length == 0) {
                    this.detailData.productCategoryList = [
                        { id: 0, displayName: "全部分类" }
                    ];
                }
            }
        },
        //  移除已选择的分类
        removeSeletedCategory(cur) {
            let productCategoryList = this.detailData.productCategoryList;
            this.detailData.productCategoryList = productCategoryList.filter(
                item => {
                    return item.displayName != cur;
                }
            );
        },
        onEditorChange({ editor, html, text }) {          
            this.detailData.detailContent = html;
        },
        imageHandler() {
            this.isModalShow = !this.isModalShow;
            this.imgRange = this.$refs.myQuillEditor.quill.getSelection();
            this.selectRangeIndex = this.imgRange !== null ? this.imgRange.index : 0;
        },
        fullScreenHandler(){
            //console.log('fullScreenHandler');
        },
        getImgInfo(info) {
            this.imgData = info;
        },
        getEditorImg() {
            // 获取选中的图片信息 有两种方式
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
                        this.addRange !== null ? this.addRange.index : this.selectRangeIndex,
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
        resetDetail() {
            let detailData = {
                name: "",
                description: "",
                detailContent: "",
                price: 1, //
                costPrice: 1, //
                originalPrice: 1, //
                seoKeyword: [],
                searchKeyword: [],
                seoDescription: "",

                skuId: "", //
                publishTime: new Date(),
                customUrl: "",
                accessRoleList: [1],
                thumbnailPicUrlList: [],
                relatedProductList: [
                    {
                        id: "string",
                        name: "string"
                    }
                ],
              
                params: { name: 1 }, //
                isTop: true,
                isOnSell: true,
                isTemplate: false, //
                isSkuSwitchOn: false, //
                isNeedShipping: false, //
                isAllowComment: true,
                defaultSiteId: 0
            };
            this.detailData = {...this.detailData,...detailData};
            document.getElementsByClassName("ql-editor")[0].innerHTML = "";
        },
        multipleCatagory() {
            this.isCheckTreeShow = !this.isCheckTreeShow;
        },
      
        removeCategory(id) {
            this.$refs.detailCheckTree.setChecked(id);
            this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
                item => {
                    return item.id != id;
                }
            );
        },
        //获取app下所有站点
        async getSiteList() {
            let { data } = await productManageApi.getSiteList();
            this.siteOptions = data;
        },
        changeSiteId(siteId) {
            this.detailData.defaultSiteId = siteId;
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
                    var videoUrl = videoList[i].videoPlayUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.myQuillEditor.quill.insertEmbed(
                        this.addRange !== null ? this.addRange.index :this.selectVideoRangeIndex,
                        "video",
                        {
                            url: videoUrl,
                            width: 'auto',
                            height: 'auto'
                        }
                    );
                    this.videoAddDragEvent();
                }
                
            }
        },
        // 关闭视频选择弹窗
        cancelgetVideo() {
            this.videoShow = false;
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

    watch: {
        "detailData.searchKeyword"() {
            if (this.detailData.searchKeyword.length >= 5) {
                this.isOutSearch = true;
            } else {
                this.isOutSearch = false;
            }
            // let width = this.detailData.searchKeyword.length * 52 ;
            // let ele = this.$refs.keywordInput.$el.children[0];
            // this.textIndent(ele, width);
        },
        "detailData.seoKeyword"() {
            if (this.detailData.seoKeyword.length >= 5) {
                this.isOutSeo = true;
            } else {
                this.isOutSeo = false;
            }
            // let width = this.detailData.seoKeyword.length * 52;
            // let ele = this.$refs.metaKeywordsInput.$el.children[0];
            // this.textIndent(ele, width);
        },
        deep: true
    }
};
</script>
<style scoped>
    .address /deep/ .el-input__inner{
        height: 35px;
        line-height: 35px;
    }
</style>
<style scoped lang="scss">
@import "../../style/contentDetail";
.category {
    position: relative;
    vertical-align: middle;
}
.product-category {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    min-height: 20px;
     width: 250px;
    border: 1px solid #dcdfe6;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    .category-list {
        .category-item {
            display: inline-block;
            border: 1px solid #eee;
            color: #fff;
            border-radius: 30px;
            padding: 5px 10px;
            margin-bottom: 5px;
            font-size: 12px;
            margin-right: 5px;
            background: #609ee9;
            .el-icon-close {
                cursor: pointer;
            }
        }
    }
    .el-select__caret {
        color: #c0c4cc;
        font-size: 14px;
        cursor: pointer;
    }
}

.multipleCatagory {
    height: 0;
    margin-top: 12px;
    width: 238px;
    position: absolute;
    background: #fff;
    z-index: 10;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
}
.modal-footer{
     height: 60px;
    position: absolute;
    bottom: -11px;
    right: 16px;
    width: 100%;
    z-index: 100;
    text-align: right;
    padding-top: 0;
}
.el-form-item__error {
    color: #262626;
    &::before {
        display: inline-block;
        content: "";
        width: 13px;
        height: 13px;
        vertical-align: -2px;
        padding-right: 8px;
        background: url("~img/jian-icon.png") no-repeat center;
        background-size: contain;
    }
}
</style>
<style scoped>
@import "../../style/contentDetailCommon.css";
.quill-editor /deep/ .ql-container {
    height: 400px;
    overflow: hidden;
}
.el-textarea /deep/ .el-input__count {
    background: #fff;
    bottom: 1px;
    right: 16px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
    padding-bottom: 50px;
}
</style>
<style>
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
    border: 1px solid rgba(229,229,229,1);
    border-radius: 3px;
}
#videoContent .modal-header {
    background: rgb(255, 255, 255);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
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
// #videoContent /deep/ .el-footer {
//     border-top: 1px solid #EEEEEE;
// }
.modal-footer {
    float: right;
    height: 88px;
    button {
        margin-top: 24px;
        width: 76px;
        height: 40px;
        background: rgba(0,193,222,1);
        border-radius: 2px;
        // line-height: 40px;
        background: rgba(0, 193, 222, 1);
        margin-right: 16px;
        color: #fff;
    }
    .cancel {
        color: rgba(9,204,235,1);
        background: rgba(255,255,255,1);
        border: 1px solid rgba(9,204,235,1);
    }
}
</style>