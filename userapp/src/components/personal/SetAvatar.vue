<template>
    <div>
        <el-upload
            class="avatar-uploader"
            :action="uploadPicAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button class="upload-btn" size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div class="footer">
            <button class="confirm footer-btn">确定</button>
            <button class="cancel footer-btn">取消</button>
        </div>
    </div>
</template>
<script>
import environment from "@/environment/index.js";
export default {
    data() {
        return {
            imageUrl: "//newwezhanoss.oss-cn-hangzhou.aliyuncs.com/DetailImages/news/thumbnail/meeting-1.png",
            uploadPicAction:`${environment.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
             this.headers.Authorization =
                "Bearer " + this.$store.state.user.accessToken.Authorization;
              this.headers.appId =this.$store.state.dashboard.appid;
              
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
<style lang="scss" scoped>
@import "./style/personal";
.avatar-uploader {
    text-align: center;
    margin-top: 40px;
    position: relative;
    .upload-btn {
        position: absolute;
        bottom: -70px;
        left: 50%;
        margin-left: -40px;
    }
}
.avatar-uploader .el-upload {
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
    border: 1px dashed #ccc;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

