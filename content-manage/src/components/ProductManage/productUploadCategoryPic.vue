<template>
    <div class="uploadCategoryPic">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="76px"
            class="demo-ruleForm"
            @submit.native.prevent
        >
            <el-form-item label="分类名称" prop="name" class="category-name">
                <el-input
                    size="small"
                    v-model="ruleForm.name"
                    autocomplete="off"
                    placeholder="请输入分类名称"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item class="upload-item" v-if="isUpload" label="分类图片">
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        分类图片用于分类控件带图片样式的展示，
                        <br />建议上传尺寸为400✕400像素的图片
                    </div>
                    <span style="position: absolute;left: -24px;">
                        <i class="iconfont iconyiwen"></i>
                    </span>
                </el-tooltip>
                <!-- <el-upload
                    class="avatar-uploader"
                    :action="uploadPicAction"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                > -->
                    <div v-if="imageUrl1" class="imgWrap">
                        <img :src="imageUrl1" class="avatar" />
                        <span class="el-upload-list__item-actions">
                            <i class="icon-change" @click.stop="showImg"></i>
                            <i @click.stop="handleRemove" class="el-icon-delete"></i>
                        </span>
                    </div>
                    <template v-else>
                        <div class="avatar-uploader" @click="showImg">
                            <div class="el-upload">
                                <i style class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                        </div>
                    </template>
                <!-- </el-upload> -->
            </el-form-item>
        </el-form>
        <div class="pannel-footer">
            <button class="cl-button cl-button--small cl-button--primary_notbg" @click="cancel">取消</button>
            <button class="cl-button cl-button--small cl-button--primary" @click="submitForm('ruleForm')">确定</button>
        </div>
        <div class="mask" v-show="isModalShow"></div>
        <div id="content" class="contentDialog" v-show="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <button @click="cancelEditorImg">X</button>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo" :multiple="false" :isPopup="true">
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" @click="getEditorImg" class="cl-button cl-button--small cl-button--primary">确定</button>
                    <button type="button" @click="cancelEditorImg" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
                </div>
            </modal-content>
        </div>
    </div>
</template>
<script>
import environment from "@/environment/index.js";
import { trim } from "@/utlis/index.js";
import securityService from "@/services/authentication/securityService";
import ModalContent from "@/components/ImgManage/index.vue";
export default {
    props: {
        isUpload: {
            type: Boolean,
            default: true
        },
        modifyCategoryData: {
            type: Object,
            default : ()=> ({})
        }
    },
    components: {
        ModalContent
    },
    data() {
        var checkInput = (rule, value, callback) => {
            console.log(this.activeName);
            if (!trim(value)) {
                return callback(new Error("请输入分类名称"));
            } else {
                callback();
            }
        };
        return {
            dialogImageUrl: "",
            dialogVisible: false,
            activeName: "",
            uploadDisabled: true,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${environment.uploadPicUrl}/0`,
            headers: {
                appId: "",
                Authorization: ""
            },
            uploadSucess: false,
            imageUrl1: "",
            ruleForm: {
                name: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 100,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    },
                    { validator: checkInput, trigger: "blur" }
                ]
            },
            isModalShow: false,
            imgData:[]
        };
    },
    watch: {
        modifyCategoryData: {
            handler(newName, oldName) {
                this.ruleForm.name = newName.label;
                this.imageUrl1 = newName.thumbnailPicUrl;
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        this.headers.appId = this.$store.state.dashboard.appId;
    },
    methods: {
        showImg(){
            this.isModalShow = true;
        },
        // 关闭图片选择弹窗
        cancelEditorImg() {
            this.isModalShow = false;
        },
        getImgInfo(info) {
            //console.log(info, "0000000");
            this.imgData = info;
        },
        getEditorImg() {
            // 获取选中的图片信息 有两种方式
            //console.log(this.imgData, "imgData");
            //console.log(this.$refs.imgList.selectedImg, "selectedImg");
            this.imageUrl1 = this.imgData[0].fullOssUrl;
            this.isModalShow = false;
        },
        handleSucess(response, file, fileList) {
            this.imageUrl1 = file.response;
        },
        handleRemove(file, fileList) {
            this.imageUrl1 = "";
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        ///////
        handleAvatarSuccess(res, file) {
            console.log(file);
            // this.imageUrl = URL.createObjectURL(file.raw);
            this.imageUrl1 = file.response;
        },
        async beforeAvatarUpload(file) {
            let data = await securityService.getUser();
            this.headers.Authorization = "Bearer " + data.access_token;
            const isPic =
                ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
                -1;
            const maxMb = 10;
            const isSizeOk = file.size / 1024 / 1024 < maxMb;

            if (!isPic) {
                 this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传头像图片只能是 图片 格式!`,
                    showClose: false,
                    duration: 1500
                });
            }
            if (!isSizeOk) {
                   this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片大小不能超过 ${maxMb}MB!`,
                    showClose: false,
                    duration: 1500
                });
               
            }
            return isPic && isSizeOk;
        },
        // 新建保存
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.confrim();
                } else {
                    return false;
                }
            });
        },
        // 确定按钮
        confrim() {
            let displayName = this.ruleForm.name;
            this.$emit("createCategory", displayName, this.imageUrl1);
            this.ruleForm.name = "";
            this.imageUrl1 = "";
        },
        //取消按钮
        cancel() {
            this.$refs.ruleForm.resetFields();
            this.$emit("closeUploadCategoryPic");
        }
    }
};
</script>
<style lang='scss' scoped>
.el-input /deep/ .el-input__inner {
    padding-right: 50px;
}
.uploadCategoryPic /deep/ .el-form {
    padding: 10px;
}
.uploadCategoryPic /deep/ .el-form .el-form-item__label {
    font-size: $--font-size-small;
    text-align: left;
}
.uploadCategoryPic /deep/ .el-form .el-form-item__error{
    padding-top: 0;
}
.uploadCategoryPic .category-name /deep/ .el-form-item__content {
    margin-left: 76px !important;
}
.uploadCategoryPic /deep/ .el-form .el-form-item {
    margin-bottom: 15px;
}

.uploadCategoryPic /deep/ .el-form .el-form-item__error {
    background: #fff;
    z-index: 1;
}
.pannel-footer {
    top: 154px;
    box-sizing: border-box;
    text-align: right;
}
.avatar-uploader {
    width: 70px;
    height: 70px;
}
.avatar-uploader .el-upload {
    border: 1px dashed $--color-primary;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 70px;
    width: 70px;
    line-height: 70px;
    vertical-align: middle;
    box-sizing: border-box;
    border-radius: 0;
}
.modal-footer {
    height: 60px;
    position: absolute;
    bottom: -11px;
    right: 16px;
    width: 100%;
    z-index: 100;
    text-align: right;
    padding-top: 0;
}
.avatar-uploader .el-upload i {
    color: $--color-primary;
    cursor: pointer;
}
.avatar-uploader .el-upload:hover {
    border-color: $--color-primary;
}
.avatar-uploader-icon {
    font-size: 22px;
    color: #8c939d;
    /* width: 178px; */
    text-align: center;
    /* margin-bottom: 10px; */
}
.avatar {
    width: 70px;
    height: 70px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
.el-upload-list__item-actions {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
}
.el-upload-list__item-actions i {
    cursor: pointer;
}
.avatar-uploader .el-upload-list__item-actions i {
    color: #fff;
    font-size: 21px;
    margin-bottom: 15px;
    cursor: pointer;
}
.imgWrap{
    position: relative;
    width: 70px;
    height: 70px;
    margin-left: 16px;
}
.imgWrap:hover .el-upload-list__item-actions {
    opacity: 1;
}
.icon-change {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("~img/content-icon/change.png") no-repeat center;
    background-size: contain;
}
</style>
<style lang="scss" scoped>
.article-cover {
    color: #262626;
    font-weight: 500;
    font-size: $--font-size-small;
}
</style>

