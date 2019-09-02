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
                    <div>
                        <div style="float:left">
                            <span style="font-size:12px">分类:</span>
                            <span class="select-sort category">
                                <!-- <el-select 
                                size="small" 
                                v-model="value2" 
                                multiple
                                placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in options1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>-->
                                <div class="product-category" @click.stop="multipleCatagory">
                                    <ul class="category-list">
                                        <li
                                            style="display:inline-block"     
                                            v-for="(item) in detailData.productCategoryList"
                                            :key="item.id"
                                            @click.stop
                                        >
                                        <div class="category-item" v-if="item.id!==0">   
                                              <span>{{item.displayName}}</span>
                                            <i
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
                                <!-- <SelectTree
                                    size="small"
                                    placeholder="请选择"
                                    :categoryName="categoryName"
                                    :categoryId="categoryId"
                                    :tree-result="treeResult"
                                    @chooseNode="chooseNode"
                                    @removeSeletedCategory="removeSeletedCategory"
                                    :multiple="true"
                                />-->
                            </span>
                        </div>
                        <div style="float:right">
                            <span style="font-size:12px">状态</span>
                            <span class="select-sort">
                                <el-select size="small" v-model="value" placeholder="请选择">
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
                        v-model="detailData.detailContent"
                        ref="myQuillEditor"
                        themes="bubble"
                        :options="editorOption"
                        @change="onEditorChange($event)"
                    ></quill-editor>
                    <div class="mask" v-show="isModalShow"></div>
                    <div id="content" v-show="isModalShow">
                        <el-header class="modal-header">
                            <span style="font-size: 16px;">我的图片</span>
                            <span @click="cancelEditorImg">X</span>
                        </el-header>
                        <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo">
                            <div slot="modal-footer" class="modal-footer">
                                <button type="button" @click="getEditorImg" class="sure">确定</button>
                                <button type="button" @click="cancelEditorImg" class="cancel">取消</button>
                            </div>
                        </modal-content>
                    </div>
                </el-form-item>
            </div>
            <div class="content-item set-article">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="产品设置" name="1">
                        <el-form-item label="时间">
                            <el-col :span="11">
                                <el-form-item prop="createTime">
                                    <el-date-picker
                                        type="datetime"
                                        v-model="detailData.publishTime"
                                        placeholder="选择日期时间"
                                        style="width: 100%;"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="搜索关键词" prop="searchKeyword">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">
                                    网站使用了搜索控件时，将使该网站的搜索
                                    <br />结果更加准确，一篇产品最多可以设置5个关键词
                                </div>
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <ul class="keyword-list" ref="keywordList">
                                <li v-for="(item,index) in detailData.searchKeyword" :key="index">
                                    {{item}}
                                    <i
                                        class="el-icon-close"
                                        @click.stop="removeCurKeyWord(index)"
                                    ></i>
                                </li>
                                <el-input
                                    maxlength="10"
                                    ref="keywordInput"
                                    placeholder="每个关键词之间用回车键分离"
                                    v-model="keywordValue"
                                    @keyup.enter.native="keywords(keywordValue)"
                                    @blur="keywords(keywordValue)"
                                ></el-input>
                            </ul>
                            <div class="el-form-item__error" v-if="isOutSearch">每篇文章最多填写5个关键词！</div>
                            <!-- <el-input
                                placeholder="每个关键词之间用会车键分离"
                                v-model="detailData.searchKeyword"
                            ></el-input>-->
                        </el-form-item>
                        <el-form-item>
                            <!-- <el-checkbox-group
                                v-model="checkedviewAuth"
                                @change="handleCheckedCitiesChange"
                            >
                                <el-checkbox
                                    v-for="item in viewAuth"
                                    :label="item"
                                    :key="item.id"
                                >{{item.name}}</el-checkbox>
                            </el-checkbox-group>-->
                        </el-form-item>
                        <el-form-item label="置頂" prop="delivery">
                            <el-switch v-model="detailData.isTop"></el-switch>
                            <span
                                style=" font-size: 14px; color: #606266;
    vertical-align: middle;
    padding:0  16px 0 32px ;"
                            >仅登录用户可访问</span>
                            <el-switch v-model="detailData.isLoggedInCanView"></el-switch>
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
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <el-input placeholder="seo标题" v-model="detailData.seoTitle"></el-input>
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

                        <!-- <el-form-item label="产品描述" prop="seoDescription">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder
                                v-model="detailData.seoDescription"
                            ></el-input>
                        </el-form-item>-->
                        <el-form-item label="自定义地址" prop="customUrl">
                            <el-input placeholder="请输入自定义地址" v-model="detailData.customUrl"></el-input>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
                <!-- <el-form-item label prop="contentDetail">
                <el-collapse v-model="activeName1" accordion>
                    <el-collapse-item title="相关产品" name="2">
                          <el-table >
                               <el-table-column prop="creatorName" label="作者" show-overflow-tooltip></el-table-column>
                                  <el-table-column prop="creatorName" label="作者" show-overflow-tooltip></el-table-column>
                                     <el-table-column prop="creatorName" label="作者" show-overflow-tooltip></el-table-column>
                        </el-table >
                    </el-collapse-item>
                </el-collapse>
                </el-form-item >-->
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

export default {
    components: {
        ModalContent,
        DetailCheckTree
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
                    value: "选项1",
                    label: "上架"
                },
                {
                    value: "选项2",
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
                    {
                        id: 1,
                        displayName: "", //
                        thumbnailPicUrl: "2" //
                    }
                ],
                params: { name: 1 }, //
                isTop: true,
                isLoggedInCanView: false,
                isOnSell: true,
                isTemplate: false, //
                isSkuSwitchOn: false, //
                isNeedShipping: false, //
                isAllowComment: true
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
            metaKeyword: ""
        };
    },
    created() {
        this.getTree();
        this.editorOption = {
            placeholder: "请输入文本",
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ size: sizes }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: fonts }],
                    [{ align: [] }],
                    ["clean"],
                    ["image", "video"],
                    [{ lineheight: lineheights }],
                    [{ letterspacing: letterspacings }]
                ],
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
        // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
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
            this.detailData.productCategoryList = [{ id: 0, displayName: "" }];
        }
        var id = this.$route.query.id;
        this.curProduct = id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
        }
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
            this.categoryIdList(this.detailData.productCategoryList);
        },
        categoryIdList(list) {
            this.categoryId=[]
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
                            this.$emit("changeSaveWay", false);
                            this.$emit("handlerClickNewAdd");
                            this.$refs.detailCheckTree.resetChecked();
                        } else {
                            this.curProduct = data;
                            this.detailData.id = data;
                            this.$emit("changeSaveWay", true);
                        }
                    }
                });
            }
        },
        // 编辑提交
        editArticle(formName, fileList,disableRefObj) {
            this.detailData.thumbnailPicUrlList = fileList;
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
                            this.$emit("handlerClickNewAdd");
                            this.$route.query.isEditor = 0;
                            //this.$refs.detailCheckTree.resetChecked();
                        } else {
                            this.curProduct = data;
                            this.detailData.id = data;
                            this.$emit("changeSaveWay", true);
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
            // var categoryName = this.$route.query.categoryName;
            // if (categoryName != null || categoryName != undefined) {
            //     this.categoryName.push(categoryName);
            // }
        },
        chooseNode(data, boolean) {
            if (this.detailData.productCategoryList.length >= 5) {
                return;
            }
            if (!!boolean) {
                // console.log(this.detailData.productCategoryList);
                // this.detailData.productCategoryList &&
                //     this.detailData.productCategoryList.forEach(item => {
                //         if (item.id != data.id) {
                //             if( !this.categoryId.includes(data.id)){
                //                  this.detailData.productCategoryList.push({
                //                 displayName: data.label,
                //                 id: data.id,
                //                 thumbnailPicUrl: data.thumbnailPicUrl
                //             });
                //             }

                //         }
                //     });

                if (!this.categoryId.includes(data.id)) {
                    this.detailData.productCategoryList.push({
                        displayName: data.label,
                        id: data.id,
                        thumbnailPicUrl: data.thumbnailPicUrl
                    });
                }
            } else {
                this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
                    item => {
                        return item.id != data.id;
                    }
                );
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
        },
        getImgInfo(info) {
            this.imgData = info;
        },
        getEditorImg() {
            // 获取选中的图片信息 有两种方式

            this.isModalShow = false;
            this.insertEditorImg(this.imgData);
        },
        insertEditorImg(imgFiles) {
            if (imgFiles && imgFiles.length > 0) {
                for (var i = 0; i < imgFiles.length; i++) {
                    this.addRange = this.$refs.myQuillEditor.quill.getSelection();
                    var value = imgFiles[i].fullOssUrl;
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.myQuillEditor.quill.insertEmbed(
                        this.addRange !== null ? this.addRange.index : 0,
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
        handleCheckAllChange(val) {
            // this.checkedCities = val ? cityOptions : [];
            // this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            // let checkedCount = value.length;
            // this.checkAll = checkedCount === this.cities.length;
            // this.isIndeterminate =
            //     checkedCount > 0 && checkedCount < this.cities.length;
        },
        resetDetail() {
            this.detailData = {
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
                    {
                        id: 0,
                        displayName: "全部分类", //
                        thumbnailPicUrl: "" //
                    }
                ],
                params: { name: 1 }, //
                isTop: true,
                isOnSell: true,
                isTemplate: false, //
                isSkuSwitchOn: false, //
                isNeedShipping: false, //
                isAllowComment: true
            };
            console.log(this.detailData.detailContent)
        },
        multipleCatagory() {
            this.isCheckTreeShow = !this.isCheckTreeShow;
        },
        getCheckedNodes(nodes) {},
        removeCategory(id) {
            this.$refs.detailCheckTree.setChecked(id);
            this.detailData.productCategoryList = this.detailData.productCategoryList.filter(
                item => {
                    return item.id != id;
                }
            );
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
<style scoped lang="scss">
@import "../../style/contentDetail";
.category {
    position: relative;
    vertical-align: middle;
}
.product-category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    min-height: 20px;
    width: 317px;
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
</style>
<style scoped>
@import "../../style/contentDetailCommon.css";
.quill-editor /deep/ .ql-container {
    height: 400px;
}
.desc-textarea /deep/ .el-form-item__content .el-textarea .el-textarea__inner {
    padding-bottom: 50px;
}
</style>


