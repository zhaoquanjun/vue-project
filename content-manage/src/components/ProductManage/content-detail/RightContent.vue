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
                    :file-list="fileList1"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :multiple="true"
                >
                    <!-- <img v-if="imageUrl1" :src="imageUrl1" class="avatar"> -->
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
            fileList2:[],
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
        fileList() {
            this.fileList1 = this.fileList;
              this.$nextTick(()=>{
                if(this.fileList1.length>=9){
                   document.querySelector(".el-upload").style.display="none";
                }
            })
        },
        fileList2(){
            this.$nextTick(()=>{
                if(this.fileList2.length>=9){
                   document.querySelector(".el-upload").style.display="none";
                }
            })
        }
    },
     mounted(){
         this.headers.appId = this.$store.state.dashboard.appid;
    },
    methods: {
        handleSucess(response, file, fileList) {

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },

        ///////
        handleAvatarSuccess(res, file) {
             let fileList ={
                    name:file.name,
                    response:file.response,
                    url:file.response
                }
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
/* 产品封面 */
.avatar-uploader {
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed rgba(144, 220, 232, 1);
    border-radius: 0;

    vertical-align: middle;
}
.avatar-uploader .el-upload i {
    color: #00c1de;
    cursor: pointer;
}
</style>
<style lang="scss" scoped>
.article-cover {
    color: #262626;
    font-weight: 500;
    font-size: 14px;
}
</style>
