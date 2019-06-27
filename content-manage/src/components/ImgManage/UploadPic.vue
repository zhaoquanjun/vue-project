<template>
    <div id="upload-img">
        <!-- 一次可上传60张图片，单张图片大小不超过10MB -->
        <el-row class="upload-head" type="flex" justify="space-between">
            <!-- [{{upload2Category.label}}] -->
            <el-col :span="12" >
                <span style="padding-right:8px">上传至:</span>
                <!-- <span style="vertical-align: -5px;padding:0 10px">{{upload2Category.label}}</span>
                <el-tree
                    class="upload-tree"
                    ref="treeX"
                    :data="treeResult"
                    node-key="id"
                    accordion
                    :expand-on-click-node="true"
                    @node-click="chooseNode"
                ></el-tree> -->
                 <SelectTree
                    style="width:140px"
                    ref="treeX"
                    :tree-result="treeResult"
                    node-key="id"
                    accordion
                    :expand-on-click-node="true"
                    @chooseNode="chooseNode"
                     />
            </el-col>
            <!-- <div>
                <el-button class="choose-img upload-btn" size="small" type="default">选择图片</el-button>
                <el-button class="upload-btn" size="small" type="default">选择文件夹</el-button>
            </div> -->
        </el-row>

        <el-upload
            class="upload-pic"
            :action="uploadPicAction"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSucess"
            :on-change="handleChange"
            :file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :limit="60"
            :multiple="true"
            ref="upload"
            :before-upload="beforeUpload"
        >
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-row class="footer-upload-btn">
            <el-button
                :disabled="uoloadDisabled"
                class="handle-upload"
                :class="[{'handle-upload-disabled':uoloadDisabled}]"
                style="float:right"
                size="small"
                @click="submitUpload"
            >开始上传</el-button>
        </el-row>
    </div>
</template>

<script>
import SelectTree from "@/components/common/SelectTree"
export default {
    props: ["treeResult", "uploadPicUrl"],
    components:{
        SelectTree
    },
    data() {
        return {
            uoloadDisabled: true,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${this.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
            uploadSucess:false,
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
        handleSucess(response, file, fileList) {
           
           if(!this.uploadSucess){
                this.$message({
                type: "success",
                message: "上传成功!"
            });
            setTimeout(() => {
                this.$emit("switchUploadBoxShowStatus", "uploadImg");
            }, 500);
             this.uploadSucess=true;
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
        },
        submitUpload() {
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            this.$refs.upload.submit();
        },
        beforeUpload(file) {
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
    },
    watch: {}
};
</script>

<style scoped lang="scss">
#upload-img .upload-head {
    padding-top: 12px;
    border-top: 1px solid #eee;
}
#upload-img {
    .upload-tree {
        width: 240px;
        display: inline-block;
        vertical-align: top;
        position: absolute;
        z-index: 10;
        box-shadow: 0 0 3px #ccc;
    }
    .upload-btn {
        width: 98px;
        height: 32px;
        font-weight: 400;
        border: none;
        border-radius: 0;
        border: 1px solid #00c1de;
        color: #00c1de;
    }
    .choose-img {
        margin-right: 13px;
        color: #fff;
        background: #00c1de;
    }
    .upload-pic {
        min-height: 320px;
        border: 1px solid #eee;
        margin: 13px 0 16px 0;
        padding: 18px 20px;
    }
    .footer-upload-btn {
        .handle-upload {
            width: 76px;
            height: 32px;
            background: #00c1de;
            border: none;
            color: #fff;
        }
        .handle-upload-disabled {
            background: rgba(245, 245, 245, 1);
            font-weight: 400;
            color: #8c8c8c;
        }
    }
}
</style>

