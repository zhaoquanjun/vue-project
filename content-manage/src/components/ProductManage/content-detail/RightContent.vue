<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span class="article-cover">产品封面</span>
            </div>
            <div>
                <el-upload
                    class="avatar-uploader"
                    :action="uploadPicAction"
                    :headers="headers"
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :multiple="true"
                    :limit="9"
                    :onExceed="onExceed"
                    accept=".jpg, .jpeg, .png, .gif, .svg, .JPG, .JPEG, .GIF"
                >
                    <!-- <div v-for="(item,index) in fileList1" :key="index"><img :src="item.response" alt=""></div> -->
                    <template>
                        <i style class="el-icon-plus avatar-uploader-icon"></i>
                        <i style=" display: block;font-size:12px">添加图片</i>
                    </template>

                    <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
                </el-upload>
            </div>
        </el-card>
        <el-col style="margin-top:20px">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="模版样式" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <!-- 图片预览 begin -->
        <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!-- 图片预览 end -->
    </div>
</template>
<script>
import environment from "@/environment/index.js";

export default {
    props: ["fileList"],
    data() {
        return {
            activeName: "",
            uploadDisabled: true,
            fileList1: [],
            fileList2: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${environment.uploadPicUrl}/0`,
            headers: {
                appId: "",
                Authorization: ""
            },
            uploadSucess: false,
            imageUrl1: "",
            newFileList: [],
            dialogVisible: false,
            dialogImageUrl: ""
        };
    },

    mounted() {
        this.headers.appId = this.$store.state.dashboard.appId;
    },
    methods: {
        handleRemove(file, fileList) {
            this.newFileList = fileList;
            if (this.newFileList.length >= 9) {
                document.querySelector(".el-upload").style.display = "none";
            } else {
                document.querySelector(".el-upload").style.display =
                    "inline-block";
            }
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 上传图片超出数量限制时触发
        onExceed(fileList) {
            this.$notify({
                customClass: "notify-warning", //  notify-success ||  notify-error
                message: `上传图片文件超过数量限制!`,
                showClose: false,
                duration: 1500
            });
        },
        ///////
        handleAvatarSuccess(res, file, argfileList) {
            this.newFileList = argfileList;
            if (this.newFileList.length >= 9) {
                document.querySelector(".el-upload").style.display = "none";
            }
            let fileList = {
                name: file.name,
                response: file.response,
                url: file.response
            };
            this.fileList2.push(fileList);
        },
        beforeAvatarUpload(file, fileList) {
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            const isPic =
                ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
                -1;
            const maxMb = 10;
            const isSizeOk = file.size / 1024 / 1024 < maxMb;

            if (!isPic) {
                this.$message.error("上传图片只能是 图片 格式!");
            }
            if (!isSizeOk) {
                this.$message.error(`上传图片大小不能超过 ${maxMb}MB!`);
            }
            return isPic && isSizeOk;
        }
    },
    watch: {}
};
</script>
<style scoped>
.el-card /deep/ .el-card__body {
    text-align: center;
    padding: 15px;
}
.el-collapse /deep/ .el-collapse-item__header {
    padding: 0 10px;
}
.el-collapse /deep/ .el-collapse-item__content {
    padding: 0 10px;
}
/* 产品封面 */
.avatar-uploader /deep/ .el-upload-list--picture-card {
    display: inline-block;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed rgba(144, 220, 232, 1);
    border-radius: 0;

    vertical-align: middle;
}
.avatar-uploader .el-upload > .avatar-uploader-icon {
    font-size: 22px;
}
.avatar-uploader .el-upload i {
    color: #00c1de;
    cursor: pointer;
    padding-bottom: 5px;
}
.avatar-uploader /deep/ .el-upload--picture-card {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    line-height: 0;
    vertical-align: top;
    display: flex;
    align-items: center;
    /* text-align: center; */
    flex-direction: column;
    justify-content: center;
    padding: 20px 0;
}
.avatar-uploader /deep/ .el-upload-list > li {
    float: left;
    border-radius: 0;
}
.avatar-uploader /deep/ .el-upload-list > li:first-child {
    width: 200px;
    height: 200px;
}
.avatar-uploader /deep/ .el-upload-list > li:not(:first-child) {
    width: 96px;
    height: 96px;
}
.avatar-uploader /deep/ .el-upload-list > li:not(:first-child) img {
    object-fit: contain;
}

.avatar-uploader /deep/ .el-upload-list__item-actions > span {
    position: absolute;
    right: 17px;
    bottom: 19px;
    top: auto;
    width: 27px;
    border: 1px solid #fff;
    height: 27px;
    border-radius: 50%;
}

.avatar-uploader
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-preview {
    left: 17px;
    bottom: 20px;
    border: none;
    width: 27px;
    height: 27px;
    background: url("~img/pic-icon/look.png") no-repeat center;
    background-size: contain;
}

.avatar-uploader
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-delete {
    right: 17px;
    bottom: 20px;
    border: none;
    width: 27px;
    height: 27px;
    background: url("~img/pic-icon/delete-icon.png") no-repeat center;
    background-size: contain;
}

.avatar-uploader /deep/ .el-upload-list__item-actions .el-icon-zoom-in,
.avatar-uploader /deep/ .el-upload-list__item-actions .el-icon-delete {
    display: none;
}
</style>
<style lang="scss" scoped>
.article-cover {
    color: #262626;
    font-weight: 500;
    font-size: 14px;
}
</style>
