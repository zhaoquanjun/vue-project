<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span class="article-cover">文章封面</span>
            </div>
            <div>
              
                <div class="avatar-uploader" :class="{'border-line':!imageUrl1}">
                    <div v-if="imageUrl1" class="imgWrap">
                        <img :src="imageUrl1" class="avatar" />
                         <span class="el-upload-list__item-actions">
                            <i @click="handlerAddPicture" class="icon-change"></i>
                            <i @click.stop="handleRemove" class="el-icon-delete"></i>
                        </span>
                    </div>
                    <template v-else>
                        <button @click="handlerAddPicture">
                            <div class="el-upload">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <i class="avatar-text" style=" display: block;">添加图片</i>
                            </div>
                        </button>
                    </template>
                </div>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
            </div>
        </el-card>
        <el-col style="margin-top:20px" v-if="false">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="模版样式" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <div class="mask" v-show="isModalShow"></div>
        <div id="content" class="contentDialog" v-show="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <button @click="cancelEditorImg">X</button>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo" :multiple="false" :isPopup="true" :isThird="true">
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" @click="getEditorImg" class="cl-button cl-button--primary">确定</button>
                    <button type="button" @click="cancelEditorImg" class="cl-button cl-button--primary_notbg">取消</button>
                </div>
            </modal-content>
        </div>
    </div>
</template>
<script>
import environment from "@/environment/index.js";
import ModalContent from "@/components/ImgManage/index.vue";
import securityService from "@/services/authentication/securityService";
export default {
    props: ["imageUrl"],
    components: {
        ModalContent
    },
    provide: {
      popper:true
    },
    data() {
        return {
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
            dialogVisible: false,
            dialogImageUrl: "",
            isModalShow: false
        };
    },
    watch: {
        imageUrl() {
            this.imageUrl1 = this.imageUrl;
        }
    },
    mounted() {
        this.headers.appId = this.$store.state.dashboard.appId;
    },
    methods: {
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
            if (!this.uploadSucess) {
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `上传成功!`,
                    showClose: false,
                    duration: 1000
                });
                setTimeout(() => {
                    this.$emit("switchUploadBoxShowStatus", "uploadImg");
                }, 500);
                this.uploadSucess = true;
            }
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
                    duration: 1000
                });
            }
            if (!isSizeOk) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片大小不能超过 ${maxMb}MB!`,
                    showClose: false,
                    duration: 1000
                });
            }
            return isPic && isSizeOk;
        },
        handlerAddPicture() {
            this.isModalShow = true;
            this.$refs.imgList.clearSelectedList()
        }
    }
};
</script>
<style lang='scss' scoped>
.el-card /deep/ .el-card__body {
    text-align: center;
}
.el-collapse /deep/ .el-collapse-item__header {
    padding: 0 10px;
}
.el-collapse /deep/ .el-collapse-item__content {
    padding: 0 10px;
}
.border-line {
    border: 1px dashed $--color-primary;
    background: rgba(242, 250, 251, 0.501);
}
.avatar-uploader {
    margin: 0 auto;
    /* display: table; */
}
.avatar-uploader /deep/ .el-upload {
    border-radius: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* height: 200px; */
    width: 200px;

    vertical-align: middle;
    /* display: table-cell; */
}
.avatar-uploader /deep/ .el-upload i {
    color: $--color-primary;
    cursor: pointer;
}
.avatar-uploader .el-upload:hover {
    border-color: $--color-primary;
}
.avatar-uploader-icon {
    font-size: 28px;
    width: 178px;
    text-align: center;
    margin-bottom: 10px;
    padding-top: 19px;
    padding-bottom: 0;
}
.avatar-text {
    padding-bottom: 19px;
}
.avatar {
    width: 200px;
    height: 200px;
    display: block;
    object-fit: scale-down;
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
    font-size: $--font-size-extra-large;
;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
}
.avatar-uploader .el-upload-list__item-actions i {
    color: #fff;
    font-size: 21px;
    margin-bottom: 15px;
    cursor: pointer;
}
.imgWrap:hover .el-upload-list__item-actions {
    opacity: 1;
}
.imgWrap img:hover{
     opacity: 1;
}
.el-collapse /deep/ .el-collapse-item__header {
    font-weight: 600;
}

.avatar-uploader /deep/ .el-upload-list__item-actions .el-icon-delete:before {
    content: "";
}
</style>
<style lang="scss" scoped>
.article-cover {
    color: #262626;
    font-weight: 600;
    font-size: $--font-size-small;
}
.icon-change {
    display: inline-block;
    width: 27px;
    height: 27px;
    border: 1px solid #fff;
    border-radius: $--border-radius-circle;
    background: url("~img/pic-icon/switch.png") no-repeat center;
    background-size: 50%;
}
.el-icon-delete {
    right: 17px;
    bottom: 20px;
    display: inline-block;
    width: 27px;
    height: 27px;
    border: 1px solid #fff;
    border-radius: $--border-radius-circle;
    background: url("~img/pic-icon/delete-1.png") no-repeat center;
    background-size: 50%;
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
.imgWrap {
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin: 0 auto;
    position: relative
}
</style>
