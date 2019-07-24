<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span class="article-cover">文章封面</span>
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
                    <div v-if="imageUrl1"  class="imgWrap">
                         <img :src="imageUrl1" class="avatar" />
                         <span class="el-upload-list__item-actions">
                              <i class="icon-change"></i>
                            <i @click.stop="handleRemove" class="el-icon-delete"></i>
                        </span>
                    </div>
                   
                    <template v-else>
                        <i style class="el-icon-plus avatar-uploader-icon"></i>
                        <i style=" display: block;">添加图片</i>
                    </template>
                   
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
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
            imageUrl1: ""
        };
    },
    watch: {
        imageUrl() {
            this.imageUrl1 = this.imageUrl;
        }
    },
    mounted(){
         this.headers.appId = this.$store.state.dashboard.appid;
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
            this.imageUrl1= ""
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

.avatar-uploader {
    margin: 0 auto;
    display: table;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed rgba(144,220,232,1);
    border-radius: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
       height: 200px;
    width: 200px;
    vertical-align: middle;
    display: table-cell;
}
.avatar-uploader /deep/ .el-upload i {
    color: #00c1de;
    cursor: pointer;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    text-align: center;
    margin-bottom: 10px;
}
.avatar {
    width: 200px;
    height: 200px;
    display: block;
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
.avatar-uploader .el-upload-list__item-actions  i{
    color: #fff;
    font-size: 21px;
    margin-bottom: 15px;
}
.imgWrap:hover .el-upload-list__item-actions {
   opacity: 1;
}

.el-collapse /deep/ .el-collapse-item__header{
    font-weight: 600;
}
</style>
<style lang="scss" scoped>
.article-cover{
     color: #262626;
    font-weight: 600;
    font-size: 14px;
}
.icon-change{
    display: inline-block;
    width: 20px;height: 20px;;
    background: url("~img/content-icon/change.png") no-repeat center;
    background-size: contain;
}
</style>
