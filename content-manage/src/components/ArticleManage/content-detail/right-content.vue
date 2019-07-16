<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>文章封面</span>
            </div>
            <div>
                <!-- <el-upload
                    class="upload-pic"
                    :action="uploadPicAction"
                    :headers="headers"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSucess"
                    :on-change="handleChange"
                    list-type="picture-card"
                    :auto-upload="true"
                    :limit="60"
                    ref="upload"
                    :before-upload="beforeUpload"
                >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>-->
            </div>
            <div>
                <el-upload
                    class="avatar-uploader"
                    :action="uploadPicAction"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                >
                    <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                    <template  v-else >
                         <i class="el-icon-plus avatar-uploader-icon">
                         
                         </i>
                    </template>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog>
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
    </div>
</template>
<script>
import environment from "@/environment/index.js";

export default {
    props: ["imageUrl"],
    data() {
        return {
             dialogImageUrl: '',
        dialogVisible: false,
            activeName: "",
            uploadDisabled: true,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${environment.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
            uploadSucess: false,
            imageUrl1: ""
        };
    },
    watch: {
        imageUrl() {
            this.imageUrl1 = this.imageUrl;
        }
    },
    methods: {
        handleSucess(response, file, fileList) {
            this.imageUrl1 = file.response;
            if (!this.uploadSucess) {
                this.$message({
                    type: "success",
                    message: "上传成功!"
                });
                setTimeout(() => {
                    this.$emit("switchUploadBoxShowStatus", "uploadImg");
                }, 500);
                this.uploadSucess = true;
            }
        },
        handleRemove(file, fileList) {
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
        beforeAvatarUpload(file) {
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            const isPic =
                ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
                -1;
            const maxMb = 10;
            const isSizeOk = file.size / 1024 / 1024 < maxMb;

            if (!isPic) {
                this.$message.error("上传头像图片只能是 图片 格式!");
            }
            if (!isSizeOk) {
                this.$message.error(`上传图片大小不能超过 ${maxMb}MB!`);
            }
            return isPic && isSizeOk;
        }
    }
};
</script>
<style scoped>
.el-card /deep/ .el-card__body {
    text-align: center;
}
.el-collapse /deep/ .el-collapse-item__header {
    padding: 0 10px;
}
.el-collapse /deep/ .el-collapse-item__content {
    padding: 0 10px;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style lang="scss" scoped>
</style>
