<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>文章封面</span>
            </div>
            <div>
                <el-upload
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
                </el-upload>
            </div>
        </el-card>
        <el-col>
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
export default {
    data() {
        return {
             activeName:"",
            imageUrl: "",
            uoloadDisabled: true,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${this.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
            uploadSucess: false
        };
    },
    methods: {
        handleChange(file) {
            this.uoloadDisabled = false;
            //  const isPic =
            //     ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
            //     -1;
            //  if (!isPic) {
            //     alert("上传头像图片只能是 图片 格式!");
            //     return
            // }
        },
        handleAvatarSuccess(res, file) {
            console.log(res, file);
            this.imageUrl = URL.createObjectURL(file.raw);
        },

        handleSucess(response, file, fileList) {
            this.imageUrl = file.response;
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
            if (fileList < 1) this.uoloadDisabled = true;
        },
        handlePreview(file) {
            console.log(file);
        },
        chooseNode(data) {
            this.upload2Category = data;
            console.log(this.upload2Category);
            this.uploadPicAction = `${this.uploadPicUrl}/${
                this.upload2Category.id
            }`;

            for (
                var i = 0;
                i < this.$refs.treeX.store._getAllNodes().length;
                i++
            ) {
                this.$refs.treeX.store._getAllNodes()[
                    i
                ].expanded = this.isexpand;
            }
        },
        submitUpload() {
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            this.$refs.upload.submit();
        },
        beforeUpload(file) {
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            const isPic =
                ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
                -1;
            const maxMb = 10;
            const isSizeOk = file.size / 1024 / 1024 < maxMb;

            if (!isPic) {
                alert("上传头像图片只能是 图片 格式!");
            }
            if (!isSizeOk) {
                alert(`上传图片大小不能超过 ${maxMb}MB!`);
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
.el-collapse /deep/ .el-collapse-item__header{
  padding: 0 10px;
}
.el-collapse /deep/ .el-collapse-item__content{
  padding: 0 10px;
}
</style>