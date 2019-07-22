<template>
    <div class="article-content" id="article-content">
        <el-form
            class="base-ariticle"
            @submit.native.prevent
            :model="detailData"
            :rules="rules"
            ref="articleDetail"
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
                <el-form-item label prop="summary">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入产品简介"
                        v-model="detailData.description"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <div>
                        <div style="float:left">
                            <span style="font-size:12px">分类:</span>
                            <span class="select-sort">
                                <el-select size="small" v-model="value2" placeholder="请选择">
                                    <el-option
                                        v-for="item in options1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
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
                        <el-form-item label="搜索关键词" prop="searchKeywords">
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
                                <li
                                    v-for="(item,index) in detailData.searchKeywords"
                                    :key="index"
                                >
                                    {{item}}
                                    <i
                                        class="el-icon-close"
                                        @click.stop="removeCurKeyWord(index)"
                                    ></i>
                                </li>
                            </ul>
                            <el-input
                                ref="keywordInput"
                                placeholder="每个关键词之间用回车键分离"
                                v-model="keywordValue"
                                @keyup.enter.native="keywords(keywordValue)"
                                @blur="keywords(keywordValue)"
                            ></el-input>
                            <!-- <el-input
                                placeholder="每个关键词之间用会车键分离"
                                v-model="detailData.searchKeywords"
                            ></el-input>-->
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox-group
                                v-model="checkedviewAuth"
                                @change="handleCheckedCitiesChange"
                            >
                                <el-checkbox
                                    v-for="item in viewAuth"
                                    :label="item"
                                    :key="item.id"
                                >{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="置頂" prop="delivery">
                            <el-switch v-model="detailData.isTop"></el-switch>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="content-item seo-key">
                <el-collapse v-model="activeName1" accordion>
                    <el-collapse-item title="搜索引擎优化" name="1">
                        <el-form-item label="seo标题" prop="searchKeyword">
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content">不填写则默认使用产品标题</div>
                                <span>
                                    <svg-icon icon-class="tip-icon"></svg-icon>
                                </span>
                            </el-tooltip>
                            <el-input placeholder="seo标题" v-model="detailData.searchKeyword"></el-input>
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
                            </ul>
                            <el-input
                                ref="metaKeywordsInput"
                                placeholder="每个关键词之间用回车键分离"
                                v-model="metaKeyword"
                                @keyup.enter.native="keywords(metaKeyword,'seoKeyword')"
                                @blur="keywords(metaKeyword,'seoKeyword')"
                            ></el-input>
                            <!-- <el-input placeholder="seo关键词" v-model="detailData.seoKeyword"></el-input> -->
                        </el-form-item>

                        <el-form-item label="产品描述" prop="seoDescription">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder
                                v-model="detailData.seoDescription"
                            ></el-input>
                        </el-form-item>
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

        <!-- 

                 <el-form-item>
        <el-button type="primary" @click="submitForm('detailData')">立即创建</el-button>
        <el-button @click="resetForm('detailData')">重置</el-button>
        <el-button type="primary" @click="editArticle('detailData')">编辑保存</el-button>
      </el-form-item>
        -->
    </div>
</template>
<script>
import * as productManageApi from "@/api/request/productManageApi";
const viewAuth = [
    { name: "全选", id: 0 },
    { name: "登录用户", id: 1 },
    { name: "未登录用户", id: 2 }
];
// 引入编辑器
import * as Quill from "quill";
import { addQuillTitle } from "@/assets/quill-title.js";
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

// 调整大小组件。
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
import { ImageDrop } from "quill-image-drop-module";
Quill.register("modules/imageDrop", ImageDrop);
import ModalContent from "@/components/ImgManage/index.vue";

export default {
    components: {
        ModalContent
    },
    data() {
        return {
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
            value2: "全部分类",

            activeName: "",
            activeName1: "",
            detailData: {
                name: "",
                description: "",
                detailContent: "",
                price: 1, //
                costPrice: 1, //
                originalPrice: 1, //
                seoKeyword: [],
                searchKeywords: [],
                seoDescription: "",
                searchKeyword: "",
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
                        displayName: "1", //
                        thumbnailPicUrl: "2" //
                    }
                ],
                params: { name: 1 }, //
                isTop: true,
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
        console.log(this.$route.query);
        var id = this.$route.query.id;
        if (id != null || id != undefined) {
            this.getArticleDetail(id);
        }
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
                    ["image", "video"]
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
            if (name === "seoKeyword") {
                if (this.detailData.seoKeyword.length >= 5 || !value) {
                    return;
                }
                this.metaKeyword = "";
                this.detailData.seoKeyword.push(value);
                // let ele = this.$refs.metaKeywordsInput.$el.children[0];
                // let width = this.$refs.metaKeywordList.clientWidth;
                //this.textIndent(ele, width);
            } else {
                if (this.detailData.searchKeywords.length >= 5 || !value) {
                    return;
                }
                this.keywordValue = "";
                this.detailData.searchKeywords.push(value);
                // let ele = this.$refs.keywordInput.$el.children[0];
                // let width = this.$refs.keywordList.clientWidth;
               // this.textIndent(ele, width);
            }
        },
        removeCurKeyWord(index) {
            this.detailData.searchKeywords.splice(index, 1);
            // this.$nextTick(() => {
            //     this.$refs.keywordInput.$el.children[0].style.textIndent =
            //         this.$refs.keywordList.clientWidth + "px";
            // });
        },
        removeCurmetaKeyWord(index) {
            this.detailData.seoKeyword.splice(index, 1);
            // this.$nextTick(() => {
            //     metaKeywordsInput.$el.children[0].style.textIndent =
            //         this.$refs.metaKeywordList.clientWidth + "px";
            // });
        },
        async getArticleDetail(id) {
            let { data } = await productManageApi.getProductDetail(id);
            if(data.seoKeyword && Object.keys(data.seoKeyword).length<1){
                 data.seoKeyword =[];
            }else{
                  data.seoKeyword = data.metaKeywords.split(",");
            }
             if(data.searchKeywords && Object.keys(data.searchKeywords).length<1){
                 data.searchKeywords =[];
            }else{
                data.searchKeywords = data.searchKeywords.split(",");
            }
            
            this.detailData = data;
            //this.detailData.NewId = data.id;
        },
        // 新建保存
        submitForm(formName, fileList) {
            console.log(formName)
            //   this.detailData.pictureUrl = imageUrl;
            console.log(fileList);
            this.detailData.thumbnailPicUrlList = fileList;
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
        //新建产品
        async insertArticle() {
            let { status, data } = await productManageApi.createProduct(
                this.detailData
            );
            if (status === 200) {
                this.$message({
                    type: "success",
                    message: "添加成功!"
                });
                // this.$router.push(`/product/create?id=${data}`);
                this.$router.push(`/content/product`);
            }
        },
        // 编辑提交
        editArticle(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveArticle();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑保存产品
        async saveArticle() {
            let { status, data } = await articleManageApi.editArticle(
                this.detailData
            );
            if (status === 200) {
                this.$message({
                    type: "success",
                    message: "保存成功!"
                });
            }
        },
        handleCheckAllChange(val) {
            // this.checkedCities = val ? cityOptions : [];
            // this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            console.log(value);
            // let checkedCount = value.length;
            // this.checkAll = checkedCount === this.cities.length;
            // this.isIndeterminate =
            //     checkedCount > 0 && checkedCount < this.cities.length;
        },
        onEditorChange({ editor, html, text }) {
            this.detailData.detailContent = html;
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
        }
    },
    mounted() {
        // 为图片ICON绑定事件  getModule 为编辑器的内部属性
        this.$refs.myQuillEditor.quill
            .getModule("toolbar")
            .addHandler("image", this.imageHandler);
        // 为视频ICON绑定事件
        // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        addQuillTitle();
    },
    watch: {
        "detailData.searchKeywords"() {
            let width = this.detailData.searchKeywords.length * 52 ;
            let ele = this.$refs.keywordInput.$el.children[0];
            this.textIndent(ele, width);
        },
        "detailData.seoKeyword"() {
            let width = this.detailData.seoKeyword.length * 52;
            let ele = this.$refs.metaKeywordsInput.$el.children[0];
            this.textIndent(ele, width);
        },
        deep: true
    }
};
</script>
<style scoped>
#article-content .el-collapse,
#article-content .el-collapse-item__header {
    border: none;
    font-size: 14px;
}
/* 修改element input设置字数显示 最后遮挡问题 */
.contentDetail-title.el-input /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
    padding-right: 60px;
}
</style>

<style scoped lang="scss">
@import "../../style/contentDetail";
.article-content {
    .content-item {
        padding: 21px 16px 0;
        background: #fff;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.03);
        margin-bottom: 16px;
        overflow: hidden;
    }
    .content-title {
        padding-bottom: 20px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 20px;
    }
    .set-article,
    .seo-key {
        padding: 0 16px;
    }
}
.select-sort {
    display: inline-block;
    width: 117px;
    box-sizing: border-box;
    height: 32px;
    margin: 0 16px 0 7px;
}
.quill-editor {
    height: 500px;
}
.ql-editor {
    height: 500px;
}
.ql-container {
    height: 430px;
}
</style>
<style scoped>
.quill-editor /deep/ .ql-container {
    height: 400px;
}
</style>


