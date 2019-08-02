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
                <el-form-item label prop="summary">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入文章简介"
                        maxlength="500"
                        v-model="articleDetail.summary"
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
                        v-model="articleDetail.contentDetail"
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
                    <el-collapse-item title="文章设置" name="1">
                        <el-form-item label="时间">
                            <el-col :span="11">
                                <el-form-item prop="createTime">
                                    <el-date-picker
                                        type="datetime"
                                        v-model="articleDetail.createTime"
                                        placeholder="选择日期时间"
                                        style="width: 100%;"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item style="position:relative" label="搜索关键词" prop="searchKeywords">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">
                                    网站使用了搜索控件时，将使该网站的搜索
                                    <br />结果更加准确，一篇文章最多可以设置5个关键词
                                </div>
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <ul class="keyword-list" ref="keywordList">
                                <li
                                    v-for="(item,index) in articleDetail.searchKeywords"
                                    :key="index"
                                >
                                    {{item}}
                                    <i
                                        class="el-icon-close"
                                        @click.stop="removeCurKeyWord(index)"
                                    ></i>
                                </li>
                                <el-input
                                    ref="keywordInput"
                                    placeholder="每个关键词之间用回车键分离"
                                    v-model="keywordValue"
                                    @keyup.enter.native="keywords(keywordValue)"
                                    @blur="keywords(keywordValue)"
                                ></el-input>
                            </ul>
                            <div class="el-form-item__error" v-if="isOutSearch">每篇文章最多填写5个关键词！</div>
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
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <el-input placeholder="SEO标题" v-model="articleDetail.metaTitle"></el-input>
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
                                    ref="metaKeywordsInput"
                                    placeholder="每个关键词之间用回车键分离"
                                    v-model="metaKeyword"
                                    @keyup.enter.native="keywords(metaKeyword,'metaKeywords')"
                                    @blur="keywords(metaKeyword,'metaKeywords')"
                                ></el-input>
                            </ul>
                             <div class="el-form-item__error" v-if="isOutSeo">每篇文章最多填写5个关键词！</div>
                            <!-- <el-input placeholder="SEO关键词" v-model="articleDetail.metaKeywords"></el-input> -->
                        </el-form-item>

                        <!-- <el-form-item label="文章描述" prop="metaDescription">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder
                                v-model="articleDetail.metaDescription"
                            ></el-input>
                        </el-form-item>-->
                        <!-- <el-form-item label="自定义地址" prop="metaDescription">
                        <el-input placeholder="请输入自定义地址" v-model="articleDetail.metaDescription"></el-input>
                        </el-form-item>-->
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>

        <!-- 

                 <el-form-item>
        <el-button type="primary" @click="submitForm('articleDetail')">立即创建</el-button>
        <el-button @click="resetForm('articleDetail')">重置</el-button>
        <el-button type="primary" @click="editArticle('articleDetail')">编辑保存</el-button>
      </el-form-item>
        -->
    </div>
</template>
<script>
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

export default {
    components: {
        SelectTree,
        ModalContent
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
            isOutSeo:false,
            isOutSearch:false,
            treeResult: null,
            categoryName: "全部分类",
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
            value: 1,
            activeName: "",
            activeName1: "",
            articleDetail: {
                NewId: "",
                title: "",
                categoryId: 0,
                summary: "",
                contentDetail: "",
                searchKeywords: [],
                isPublish: false,
                createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
                isTop: false,
                metaTitle: "",
                metaKeywords: [],
                metaDescription: "",
                pictureUrl: ""
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入文章标题",
                        trigger: "blur"
                    }
                ],

                // searchKeywords: [{ validator: checkWord }]
            },
            isModalShow: false,
            editorOption: {},
            keywordValue: "",
            metaKeyword: "",
            isNewAdd:false,
        };
    },
    created() {
        let start = new Date();
        // console.log(this.$route.query)
        var id = this.$route.query.id;
        this.articleDetail.categoryId = this.$route.query.categoryId;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
            this.$emit("changeOperateName", "编辑");
        }
        this.getTreeAsync();
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
    methods: {
      
        textIndent(ele, width) {
            this.$nextTick(() => {
                ele.style.textIndent = width + "px";
            });
        },
        keywords(value, name) {
            if (name === "metaKeywords") {
                if (this.articleDetail.metaKeywords.length >= 5 || !value) {
                    return;
                }
                this.metaKeyword = "";
                this.articleDetail.metaKeywords.push(value);
                // let ele = this.$refs.metaKeywordsInput.$el.children[0];
                // let width = this.$refs.metaKeywordList.clientWidth;
                // this.textIndent(ele, width);
            } else {
                if (this.articleDetail.searchKeywords.length >= 5 || !value) {
                    return;
                }
                this.keywordValue = "";
                this.articleDetail.searchKeywords.push(value);
                // let ele = this.$refs.keywordInput.$el.children[0];
                // let width = this.$refs.keywordList.clientWidth;
                // this.textIndent(ele, width);
            }
        },
        removeCurKeyWord(index) {
            this.articleDetail.searchKeywords.splice(index, 1);
            // this.$nextTick(() => {
            //     this.$refs.keywordInput.$el.children[0].style.textIndent =
            //         this.$refs.keywordList.clientWidth + "px";
            // });
        },
        removeCurmetaKeyWord(index) {
            this.articleDetail.metaKeywords.splice(index, 1);
            // this.$nextTick(() => {
            //     metaKeywordsInput.$el.children[0].style.textIndent =
            //         this.$refs.metaKeywordList.clientWidth + "px";
            // });
        },
        async getTreeAsync() {
            let { data } = await articleManageApi.getArticleCategory();
            this.treeResult = data;

            var categoryName = this.$route.query.categoryName;
            if (categoryName != null || categoryName != undefined) {
                this.categoryName = categoryName;
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
            this.articleDetail.NewId = data.id;
        },
        //选择移动分类时的节点
        chooseNode(node) {
            this.articleDetail.categoryId = node.id;
            this.categoryName = node.label;
        },
        // 新建保存
        submitForm(formName, imageUrl) {
            this.articleDetail.pictureUrl = imageUrl;

            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.insertArticle();
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
        async insertArticle() {
            let { status, data } = await articleManageApi.createArticle(
                this.articleDetail
            );
            if (status === 200) {
                console.log(data,'00000------')
               
                this.$confirm("保存成功!", "提示", {
                    confirmButtonText: "新增下一篇",
                    type: "success",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resetForm("articleDetail");
                             this.$emit("changeSaveWay",false);
                        }else{
                            this.articleDetail.NewId = data;
                            this.$emit("changeSaveWay",true);
                        }
                    }
                });

                // this.$router.push(`/news/create?id=${data}&categoryName=${this.categoryName}`);
                //this.$router.push("/content/news");
            }
        },
        // 编辑提交
        editArticle(formName, imageUrl) {
            this.articleDetail.pictureUrl = imageUrl;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveArticle();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑保存文章
        async saveArticle() {
            let { status, data } = await articleManageApi.editArticle(
                this.articleDetail
            );
            // if (status === 200) {
            //     this.$message({
            //         type: "success",
            //         message: "保存成功!"
            //     });
                // this.$router.push("/content/news");
               this.$confirm("保存成功!", "提示", {
                    confirmButtonText: "新增下一篇",
                    type: "success",
                    callback: async action => {
                        if (action === "confirm") {
                            this.resetForm("articleDetail");
                             this.resetDetail()
                              this.$emit("changeSaveWay",false);
                              this.$route.query.id=false;
                        }else{
                            this.articleDetail.NewId = data;
                            this.$emit("changeSaveWay",true)
                        }
                    }
                });    
           
        },

        imgChangeSizeHandler(img) {
            console.log("imgChangeSizeHandler");
            img.width = "100";
            img.height = "100";
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        onEditorChange({ editor, html, text }) {
            this.articleDetail.contentDetail = html;
            var imgNodes = document.querySelectorAll(".ql-editor img");
            imgNodes.forEach(img => {
                //if(img.isBind==undefined || img.isBind==null||!img.isBind){
                //   img.isBind = true;
                //   img.addEventListener("dblclick",this.imgChangeSizeHandler,img);
                //}
            });
        },
        imageHandler() {
            this.isModalShow = !this.isModalShow;
        },
        getImgInfo(info) {
            //console.log(info, "0000000");
            this.imgData = info;
        },
        getEditorImg() {
            // 获取选中的图片信息 有两种方式
            //console.log(this.imgData, "imgData");
            //console.log(this.$refs.imgList.selectedImg, "selectedImg");
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
        resetDetail(){
                this.articleDetail= {
                NewId: "",
                title: "",
                categoryId: 0,
                summary: "",
                contentDetail: "",
                searchKeywords: [],
                isPublish: false,
                createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
                isTop: false,
                metaTitle: "",
                metaKeywords: [],
                metaDescription: "",
                pictureUrl: ""
            }
       
        }
    },
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.myQuillEditor.quill
            .getModule("toolbar")
            .addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        //this.$refs.myQuillEditor.quill.root.addEventListener("dblclick",this.imgChangeSizeHandler,!1);
        addQuillTitle();
    },
    computed: {},
    watch: {
        "articleDetail.searchKeywords"() {
            if(this.articleDetail.searchKeywords.length>=5){
                this.isOutSearch =true
            }else{
                this.isOutSearch =false
            }
            // this.$nextTick(() => {
            //     let width = this.$refs.keywordList.clientWidth;
            //     let ele = this.$refs.keywordInput.$el.children[0];
            //     this.textIndent(ele, width);
            // });
        },
        "articleDetail.metaKeywords"() {
              if(this.articleDetail.metaKeywords.length>=5){
                this.isOutSeo =true
            }else{
                this.isOutSeo =false
            }
            // this.$nextTick(() => {
            //     let width = this.$refs.metaKeywordList.clientWidth;
            //     console.log(this.$refs.metaKeywordList.clientWidth);
            //     let ele = this.$refs.metaKeywordsInput.$el.children[0];
            //     this.textIndent(ele, width);
            // });
        },
        deep: true,
        immediate: true
    }
};
</script>


<style scoped lang="scss">
@import "../../style/contentDetail";
</style>
<style scoped>
@import "../../style/contentDetailCommon.css";
.quill-editor /deep/ .ql-container {
    height: 420px;
}
</style>

