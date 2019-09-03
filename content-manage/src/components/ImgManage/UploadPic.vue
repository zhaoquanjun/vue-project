<template>
    <div id="upload-img" class="upload-img">
        <!-- 一次可上传60张图片，单张图片大小不超过10MB -->
        <!-- 图片上传弹窗 header -->
        <el-row class="upload-head" type="flex" justify="space-between">
            <el-col :span="12">
                <span style="padding-right:8px">上传至:</span>
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
        <!-- 图片上传组件 begin-->
        <el-upload
            class="upload-pic"
            :action="uploadPicAction"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSucess"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="true"
            ref="upload"
            drag
            :isFolder="isFolder"
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
            <button
                :disabled="uploadDisabled"
                class="handle-upload"
                :class="[{'handle-upload-disabled':uploadDisabled}]"
                style="float:right"
                size="small"
                @click="submitUpload"
            >{{isUploading?"上传中…":"开始上传"}}</button>
        </el-row>
        <!-- 图片上传组件 end-->
        <!-- 图片预览 begin -->
        <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!-- 图片预览 end -->
    </div>
</template>

<script>
import SelectTree from "@/components/common/SelectTree";
import { isImgFile, imgSize } from "@/utlis/index";

export default {
    props: ["treeResult", "uploadPicUrl", "nodeData"],
    components: {
        SelectTree
    },
    data() {
        return {
            targetNodeId:this.nodeData.id,
            dialogImageUrl: "",
            dialogVisible: false,
            isFolder: false,
            uploadDisabled: true,
            isUploading: false,
            fileList: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${this.uploadPicUrl}/0`,
            headers: {
                appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                Authorization: ""
            },
            uploadSucess: false,
            count: 0,
            limit: 60 // 自定义允许上传的个数
        };
    },
    mounted() {
        this.headers.appId = this.$store.state.dashboard.appId;
        if (this.nodeData) {
            this.targetNodeId=this.nodeData.id;
            this.uploadPicAction = `${this.uploadPicUrl}/${this.nodeData.id}`;
        }
    },
    methods: {
        // 预览大图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 选择图片时触发
        handleChange(file, fileList) {
            fileList.filter((item, index) => {
                if (!imgSize(item.size, 10)) {
                    fileList.splice(index, 1);
                }
                if (!isImgFile(item.raw.type)) {
                    fileList.splice(index, 1);
                }
                if (imgSize(item.size, 10) && isImgFile(item.raw.type)) {
                    this.uploadDisabled = false;
                }
            });
            //
            if (fileList && fileList.length > this.limit) {
                this.onExceed(fileList);
            }
        },
        // 上传图片超出数量限制时触发
        onExceed(fileList) {
            if (fileList.length > this.limit) {
                fileList = fileList.splice(this.limit);
            }
            this.$notify({
                customClass: "notify-error", //  notify-success ||  notify-error
                message: `上传图片文件超过数量限制`,
                showClose: false,
                duration: 1500
            });
        },
    getNodeByParentId(tree,parentId)
    {
    if(parentId===null)
    {
          return null;
    }
     if(tree.id===parentId)
        {
            return tree;
        }
    for(var i=0;i<tree.children.length;i++)
    {
        var result=this.getNodeByParentId(tree.children[i],parentId)
        if(result!==null)
        {
            return result;
        }
    }
    return null;
    },
     updateNodeSum(tree,nodeId,count)
    {
     var targetNode=this.getNodeByParentId(tree,nodeId);
    do
    {
    targetNode.inUseSum+=count;
    targetNode=this.getNodeByParentId(tree,targetNode.parentId);
    }
    while (targetNode!==null);
    },
        // 图片上传成功时触发
        handleSucess(response, file, fileList) {
            if (++this.count == fileList.length) {
                setTimeout(() => {
                    this.$emit("switchUploadBoxShowStatus", "uploadImg");
                    this.uploadDisabled = true;
                    this.isUploading = false;
                    this.updateNodeSum(this.treeResult[0],this.targetNodeId,fileList.length);
                    this.$refs.upload.clearFiles();
                    this.$notify({
                        customClass: "notify-success", //  notify-success ||  notify-error
                        message: `成功上传${fileList.length}张图片`,
                        showClose: false,
                        duration: 1500
                    });
                }, 500);
            }
        },
        // 移除图片时触发
        handleRemove(file, fileList) {
            if (fileList < 1) this.uploadDisabled = true;
        },
        setFolder(isFolder) {
            this.isFolder = isFolder;
        },
        // 选择分类节点
        chooseNode(data) {
            this.targetNodeId=data.id;
            this.upload2Category = data;
            this.uploadPicAction = `${this.uploadPicUrl}/${this.upload2Category.id}`;
        },
        // 点击上传按钮
        submitUpload() {
            this.hideImgName();
            this.isUploading = true;
            this.uploadDisabled = true;
            this.count = 0;
            if (this.nodeData) {
                this.uploadPicAction = `${this.uploadPicUrl}/${this.nodeData.id}`;
            }
            this.headers.Authorization =
                "Bearer " + this.$store.state.accessToken.Authorization;
            this.$refs.upload.submit();
        },
        // 上传图片时
        beforeUpload(file) {
            const isPic = isImgFile(file.type);
            const isSizeOk = imgSize(file.size);
            let maxMb = 10;
            if (!isPic) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片只能是 图片 格式!`,
                    showClose: false,
                    duration: 2000
                });
                return false;
            }
            if (!isSizeOk) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片大小不能超过 ${maxMb}MB!`,
                    showClose: false,
                    duration: 2000
                });
                return false;
            }
            return isPic && isSizeOk;
        },
        hideImgName() {
            // 点击上传时隐藏图片名称避免样式错乱
            let imgName = document.querySelectorAll(
                ".el-upload-list__item-name"
            );
            for (let i = 0; i < imgName.length; i++) {
                imgName[i].style.display = "none";
            }
        }
    }
};
</script>
<style scoped>
.upload-pic /deep/ .el-upload-dragger {
    position: static;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.upload-pic /deep/ .el-upload-dragger .el-upload__text em {
    display: block;
    padding-top: 10px;
}
.upload-pic /deep/ .el-upload--picture-card {
    display: block;
    border: none;
    line-height: 1;
}

.upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item {
    /* overflow: visible; */
    height: 181px;
    border: none;
    border-radius: 0;
}

.upload-pic /deep/ .el-upload-list__item .el-upload-list__item-actions {
    height: 148px;
}

.upload-pic /deep/ .el-upload-list__item-actions > span {
    position: absolute;
    right: 17px;
    bottom: 19px;
    top: auto;
    width: 27px;
    border: 1px solid #fff;
    height: 27px;
    border-radius: 50%;
}

.upload-pic /deep/ .el-upload-list__item-actions .el-upload-list__item-preview {
    left: 17px;
    bottom: 20px;
    border: none;
}

.upload-pic /deep/ .el-upload-list__item-actions .el-icon-delete {
    font-size: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: auto;
    transform: translate(-50%, -50%);
}

.upload-pic /deep/ .el-upload-list__item-actions .el-icon-zoom-in:before {
    content: "";
}

.upload-pic /deep/ .el-upload-list__item-actions .el-upload-list__item-preview {
    left: 17px;
    bottom: 20px;
    border: none;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    border: 1px solid #fff;
    background: url("~img/pic-icon/eye.png") no-repeat center;
    background-size: 60%;
    box-sizing: border-box;
}
.upload-pic
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-delete:hover {
    background: #00c1de;
    border: 1px solid #00c1de;
}

.upload-pic
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-preview:hover {
    color: #00c1de;
}

.upload-pic
    /deep/
    .el-upload-list--picture-card
    .el-upload-list__item
    .el-upload-list__item-thumbnail {
    height: 148px;
    object-fit: cover;
}

.upload-pic
    /deep/
    .el-upload-list--picture-card
    .el-upload-list__item-status-label {
    display: none;
}

.upload-pic /deep/ .el-upload-list--picture-card .el-upload-list__item-name {
    display: block;
    text-align: center;
    margin-right: 0;
}

.upload-pic
    /deep/
    .el-upload-list--picture-card
    .el-upload-list__item-name
    .el-icon-document {
    display: none;
}
</style>
<style scoped lang="scss">
.upload-img {
    .upload-head {
        padding-top: 12px;
        border-top: 1px solid #eee;
    }

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

