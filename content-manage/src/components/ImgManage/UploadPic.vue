<template>
    <div id="upload-img">
        <!-- 一次可上传60张图片，单张图片大小不超过10MB -->
        <el-row class="upload-head" type="flex" justify="space-between">
            <!-- [{{upload2Category.label}}] -->
            <el-col :span="12">
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
                ></el-tree>-->
                <SelectTree
                    style="width:140px"
                    ref="treeX"
                    :tree-result="treeResult"
                    node-key="id"
                    accordion
                    :expand-on-click-node="true"
                    @chooseNode="chooseNode"
                    :categoryName="nodeData.label"
                />
            </el-col>
            <div></div>
        </el-row>

        <el-upload
            class="upload-pic"
            :action="uploadPicAction"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSucess"
            :on-change="handleChange"
            :file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="true"
            ref="upload"
            :limit="60"
            drag
            :isFolder="isFolder"
            :onExceed="onExceed"
            :before-upload="beforeUpload"
        >
          
            <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
            <div @click="setFolder(false)" class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <el-button
                class="upload-btn"
                @click="setFolder(false)"
                size="small"
                type="default"
                style=" position: absolute;top: 57px; right: 136px;"
            >选择图片</el-button>
            <el-button
                class="choose-img upload-btn"
                size="small"
                @click="setFolder(true)"
                type="default"
                style="position: absolute;top: 57px; right: 6px;"
            >选择文件夹</el-button>
        </el-upload>
        <el-row class="footer-upload-btn">
            <el-button
                :disabled="uploadDisabled"
                class="handle-upload"
                :class="[{'handle-upload-disabled':uploadDisabled}]"
                style="float:right"
                size="small"
                @click="submitUpload"
            >开始上传</el-button>
        </el-row>
    </div>
</template>

<script>
import SelectTree from "@/components/common/SelectTree";
import { setTimeout } from "timers";
export default {
    props: ["treeResult", "uploadPicUrl", "nodeData"],
    components: {
        SelectTree
    },
    data() {
        return {
            isFolder: false,
            uploadDisabled: true,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${this.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
            uploadSucess: false,
            count: 0
        };
    },
    mounted() {
        if (this.nodeData) {
            this.uploadPicAction = `${this.uploadPicUrl}/${this.nodeData.id}`;
        }
    },
    methods: {
        handleChange(file, fileList) {
            this.uploadDisabled = false;
            fileList.forEach((item, index) => {
               const maxMb = 10;
                const isSizeOk = file.size / 1024 / 1024 < maxMb;
                if (
                    ["image/png", "image/jpeg", "image/gif"].indexOf(
                        item.raw.type
                    ) == -1
                ) {
                    fileList.splice(index, 1);
                }else if(!isSizeOk){
                    fileList.splice(index, 1);
                }
            });

            //  const isPic =
            //     ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
            //     -1;
            //  if (!isPic) {
            //     alert("上传头像图片只能是 图片 格式!");
            //     return
            // }
        },
        onExceed(fileList) {
            this.$message({
                type: "warning",
                message: `上传图片文件超过数量限制`
            });
        },
        handleSucess(response, file, fileList) {
            if (++this.count == fileList.length) {
                this.$message({
                    type: "success",
                    message: `成功上传${fileList.length}图片`
                });
                setTimeout(() => {
                   this.$emit("switchUploadBoxShowStatus", "uploadImg");
                    // this.$emit("getTree");
                   this.$refs.upload.clearFiles();
                }, 500);
            }
        },

        handleRemove(file, fileList) {
            if (fileList < 1) this.uploadDisabled = true;
        },
        setFolder(isFolder) {
            this.isFolder = isFolder;
        },
        handlePreview(file) {
            console.log(file);
        },
        chooseNode(data) {
            this.upload2Category = data;
            this.uploadPicAction = `${this.uploadPicUrl}/${this.upload2Category.id}`;
        },
        submitUpload() {
            this.uploadDisabled = true
            this.count = 0;
            if (this.nodeData) {
                this.uploadPicAction = `${this.uploadPicUrl}/${this.nodeData.id}`;
            }
            console.log(this.nodeData, "----");

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
                this.$message({
                    type: "warning",
                    message: "上传图片只能是 图片 格式!"
                });
                return false;
            }
            if (!isSizeOk) {
                this.$message({
                    type: "warning",
                    message: `上传图片大小不能超过 ${maxMb}MB!`
                });
                return false;
            }
            return isPic && isSizeOk;
        }
    },
    watch: {}
};
</script>
<style scoped>
#upload-img .upload-pic /deep/ .el-upload-dragger {
    position: static;
    height: auto;
}
.upload-pic /deep/ .el-upload--picture-card {
    display: block;
    border: none;
}
#upload-img .upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item{
       /* overflow: visible; */
       height: auto;
       border: none;
       border-radius: 0;
}
#upload-img .upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item .el-upload-list__item-actions{
    height: 148px;;
}
#upload-img .upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item .el-upload-list__item-thumbnail{
    height: 148px;
    object-fit: cover;
}
#upload-img .upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item-status-label{
    display: none;
}
#upload-img .upload-pic  /deep/ .el-upload-list--picture-card .el-upload-list__item-name{
    display: block;
    text-align: center;
    margin-right: 0;
}
#upload-img .upload-pic  /deep/ .el-upload-list--picture-card .el-upload-list__item-name .el-icon-document{
    display: none;
}

</style>
<style scoped lang="scss">
#upload-img .upload-head {
    padding-top: 12px;
    border-top: 1px solid #eee;
}

#upload-img {
    .el-upload-dragger {
        position: none;
    }
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
        max-height: 320px;
        min-height: 320px;
        border: 1px solid #eee;
        margin: 13px 0 16px 0;
        padding: 18px 20px;
        overflow-y: auto;
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

