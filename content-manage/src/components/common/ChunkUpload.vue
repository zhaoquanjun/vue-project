<template>
    <div>
        <el-row class="upload-head" type="flex" justify="space-between">
            <el-col :span="12">
                <span style="padding-right:16px">上传至</span>
                <SelectTree
                    class="chunkUpload-select-tree"
                    ref="treeX"
                    :tree-result="treeResult"
                    node-key="id"
                    accordion
                    :expand-on-click-node="true"
                    @chooseNode="chooseNode"
                    :categoryName="nodeData.label"
                    :categoryId="nodeData.id"
                />
            </el-col>
            <div></div>
        </el-row>
        <uploader
            ref="uploader"
            :options="options"
            :autoStart="false"
            class="uploader-example"
            @file-added="onFileAdded"
            @file-removed="fileRemove"
            @file-success="onFileSuccess"
            @upload-start="uploadStart"
            @file-error="onFileError"
            @reset-option="resetOption"
        >
            <uploader-unsupport></uploader-unsupport>
            <uploader-list :uploadType="uploadType"></uploader-list>
            <uploader-drop>
                <span>将{{displayName}}拖拽到此处或</span>
                <uploader-btn :attrs="attrs">点击选择{{displayName}}</uploader-btn>
                <!-- <uploader-btn :directory="true">选择文件夹</uploader-btn> -->
            </uploader-drop>
        </uploader>
        <div class="upload-footer">
            <ul>
                <li v-if="fileList.length">
                    已添加
                    <i class="defult-color">{{fileList.length}}</i> 个文件，共
                    <i class="defult-color">{{formatSize}}</i>
                </li>
                <li v-if="successCount>0">
                    <i class="success-color">，{{successCount}}</i> 个上传成功
                </li>
                <li v-if="errorCount>0">
                    &nbsp;&nbsp;
                    <i class="error-color">，{{errorCount}}</i> 个上传失败
                </li>
            </ul>
            <button
                class="btn-small"
                :class="[disable?'disable-btn':'btn-bglightblue']"
                :disabled="disable"
                @click="upload"
            >{{uploadBtnText}}</button>
        </div>
    </div>
</template>

<script>
const videoFormat = [
    ".avi",
    ".rmvb",
    ".rm",
    ".asf",
    ".divx",
    ".mpg",
    ".mpeg",
    ".mpe",
    ".wmv",
    ".mp4",
    ".mkv",
    ".vob",
    ".swf",
    ".flv"
];
const audioFormat = [
    ".mp3",
    ".cd",
    ".wav",
    ".aiff",
    ".au",
    ".wma",
    ".ogg",
    ".mp3pro",
    ".real",
    ".ape",
    ".module",
    ".midi",
    ".vqf",
    ".flac"
];
const forbidUpload = [
    ".exe",
    ".php",
    ".lnk",
    ".cmd",
    ".bat",
    ".reg",
    ".vb",
    ".vbs",
    ".js",
    ".css",
    ".aspx",
    ".sql",
    ".asp",
    ".jsp",
    ".htm",
    ".html",
    ".java",
    ".json"
];
import SparkMD5 from "spark-md5";
import * as chunkUploadManageApi from "@/api/request/chunkUploadManageApi";
import SelectTree from "@/components/common/SelectTree";
import { format } from "path";
export default {
    props: [
        "displayName",
        "uploadType",
        "accept",
        "apiHost",
        "treeResult",
        "nodeData"
    ],
    components: {
        SelectTree
    },
    data() {
        return {
            uploadBtnText: "开始上传",
            options: {
                uploadType: this.uploadType,
                target: null,
                testChunks: true,
                chunkSize: 2048000, //分块大小,
                simultaneousUploads: 1,
                headers: {
                    AppId: this.$store.state.dashboard.appId,
                    Authorization:
                        "Bearer " + this.$store.state.accessToken.Authorization
                },
                checkChunkUploadedByResponse: (chunk, message) => {
                    let data = JSON.parse(message);
                    switch (data.fileStatus) {
                        case 0: {
                            return (
                                (data.uploadedChunkList || []).indexOf(
                                    chunk.offset + 1
                                ) >= 0
                            );
                        }
                        case 1: {
                            if (chunk.offset === 0) {
                                --this.successCount;
                                this.$confirm(
                                    `<span class="ellipsis" style="float:left;max-width:296px;" class="ellipsis">${this.displayName}${
                                        chunk.file.name
                                    }</span> 已存在<br>位于<br>${
                                        data.existingFileInfo.isDelete
                                            ? "路径:回收站<br>"
                                            : ""
                                    } 分类: ${
                                        data.existingFileInfo.categoryName
                                    }<br><span class="ellipsis" style="float:left;max-width:296px;">名称: ${
                                        data.existingFileInfo.fileName
                                    }</span>`,
                                    "提示",
                                    {
                                        dangerouslyUseHTMLString: true,
                                        customClass: "medium",
                                        iconClass: "icon-warning",
                                        confirmButtonText: "一键秒传",
                                        cancelButtonText: "取消上传",
                                        callback: async action => {
                                            if (action === "confirm") {
                                                chunkUploadManageApi.createFileWithoutUpload(
                                                    {
                                                        UploadFileType: this
                                                            .uploadType,
                                                        Size: chunk.file.size,
                                                        Md5Hash:
                                                            data
                                                                .existingFileInfo
                                                                .md5Hash,
                                                        FromAppId:
                                                            data
                                                                .existingFileInfo
                                                                .appId,
                                                        FromId:
                                                            data
                                                                .existingFileInfo
                                                                .id,
                                                        Title: chunk.file.name,
                                                        ContentType:
                                                            chunk.file.fileType,
                                                        CategoryId:
                                                            this
                                                                .chooseCategoryId ||
                                                            this.nodeData.id, //todo,
                                                        durationOfSecond:
                                                            data
                                                                .existingFileInfo
                                                                .durationOfSecond
                                                    }
                                                );
                                                ++this.successCount;

                                                var duration = 1500;
                                                this.$notify({
                                                    customClass:
                                                        "notify-success", //  notify-success ||  notify-error
                                                    message: `文件秒传成功`,
                                                    duration: duration,
                                                    showClose: false
                                                });
                                                setTimeout(
                                                    this.updatePageData,
                                                    duration
                                                );
                                            } else {
                                                chunk.file.cancel(chunk.file);
                                                this.updatePageData();
                                            }
                                        }
                                    }
                                );
                            }
                            return true;
                        }
                        case 2: {
                            if (chunk.offset === 0) {                                
                                --this.successCount;
                                chunkUploadManageApi.createFileWithoutUpload({
                                    UploadFileType: this.uploadType,

                                    Size: chunk.file.size,
                                    Md5Hash: data.existingFileInfo.md5Hash,
                                    FromAppId: data.existingFileInfo.appId,
                                    FromId: data.existingFileInfo.id,
                                    Title: chunk.file.name,
                                    ContentType: chunk.file.fileType,
                                    CategoryId:
                                        this.chooseCategoryId ||
                                        this.nodeData.id //todo
                                });

                                ++this.successCount;
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `文件秒传成功`,
                                    duration: 1500,
                                    showClose: false
                                });
                                chunk.file.cancel(chunk.file);
                                this.updatePageData();
                            }
                            return true;
                        }
                    }
                }
            },
            attrs: {
                accept: this.accept //'video/*'
            },

            img: require("../../assets/avatar.jpeg"),
            fileList: [],
            successCount: 0,
            errorCount: 0,
            disable: true,
            formatSize: 0,
            allFileSize: 0
        };
    },
    created() {
        this.options.target = `${this.apiHost}/api/chunkupload/${this.uploadType}/${this.nodeData.id}`;
    },
    methods: {
        getTime(file) {
            let url = URL.createObjectURL(file.file);
            var audioElement = new Audio(url);
            var duration;
            audioElement.addEventListener("loadedmetadata", function(_event) {
                duration = audioElement.duration;
            });
            return duration;
        },
        bytesToSize(bytes, flag) {
            if (bytes === 0) return "0 B";
            let k = 1024;
            let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
            let i = Math.floor(Math.log(bytes) / Math.log(k));
            let b = bytes / Math.pow(k, i);
            if (flag === 1) {
                b = b.toFixed(2);
            }
            let storage = b + sizes[i];
            return storage;
        },
        onFileError(rootFile, file, response, chunk) {
            this.$notify({
                customClass: "notify-error",
                message: `${JSON.parse(response).message}`,
                duration: 1500,
                showClose: false
            });
            this.errorCount += 1;
        },
        updatePageData() {
            if (
                this.successCount ==
                    this.fileList.filter(i => !i.aborted && !i.error).length &&
                this.successCount >= 1
            ) {
                this.$emit("getList");
                this.$emit("getTree");
                this.$emit("closeDialog");
                this.fileList.forEach(file => {
                    file.cancel(file);
                });
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `成功上传${this.successCount}个${this.displayName}`,
                    showClose: false,
                    duration: 1500
                });
                this.successCount = 0;
                this.errorCount = 0;
            }

            this.fileList.filter(item => {
                if (item.error) {
                    this.disable = false;
                    this.uploadBtnText = "开始上传";
                }
            });
        },
        onFileSuccess() {
            console.log(this.fileList, 666666666666666);
            var errorCount = this.fileList.filter(i => i.error).length;
            var total = this.fileList.length;
            ++this.successCount;
            this.updatePageData();
        },
        onFileAdded(file) {
            this.$refs.uploader.resetOption();
            
            if (this.limitCount(file)) this.computeMD5(file);
        },
        uploadStart(file) {},
        computeMD5(file) {
            let fileReader = new FileReader();
            let time = new Date().getTime();
            let md5 = "";
            // console.log(`开始计算md5`);

            fileReader.readAsArrayBuffer(file.file);
            fileReader.onload = e => {
                md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
                file.uniqueIdentifier = md5;

                let fileSize = 0;
                this.fileList.forEach(item => {
                    fileSize += item.size;
                });
                this.formatSize = this.bytesToSize(fileSize, 1);
                this.fileList.push(file);
            };

            fileReader.onerror = function() {
                this.error(
                    "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
                );
            };
        },
        limitCount(file) {
            if (this.uploadType === "Video")
                this.checkFormat(file, videoFormat);
            if (this.uploadType === "Audio")
                this.checkFormat(file, audioFormat);
            if (this.uploadType === "File") {
                 this.checkFormat(file, forbidUpload);
                if (this.fileList.length <= 100) {
                    if (file.size / 1024 / 1024 > 50) {
                        this.$notify({
                            customClass: "notify-error",
                            message: `单个${this.displayName}不允许超过50M,一次最多上传100个文件`,
                            duration: 1500,
                            showClose: false
                        });
                        file.cancel(file);
                        this.errorCount -= 1;
                        return false;
                    } else {
                        // this.allFileSize +=file.size;

                        return true;
                    }
                } else {
                    this.$notify({
                        customClass: "notify-error",
                        message: `单个${this.displayName}不允许超过50M,一次最多上传100个文件`,
                        duration: 1500,
                        showClose: false
                    });
                    file.cancel(file);
                    this.errorCount -= 1;
                    return false;
                }
            } else {
                if (this.fileList.length <= 10) {
                    if (
                        file.size / 1024 / 1024 > 50 &&
                        this.uploadType === "Audio"
                    ) {
                        this.$notify({
                            customClass: "notify-error",
                            message: `${this.displayName}大小不可超过50M`,
                            duration: 1500,
                            showClose: false
                        });
                        file.cancel(file);
                        this.errorCount -= 1;
                        return false;
                    } else if (
                        this.uploadType === "Video" &&
                        file.size / 1024 / 1024 / 1024 > 2
                    ) {
                        this.$notify({
                            customClass: "notify-error",
                            message: `${this.displayName}大小不可超过2G`,
                            duration: 1500,
                            showClose: false
                        });
                        file.cancel(file);
                        this.errorCount -= 1;
                        return false;
                    }
                } else {
                    file.cancel(file);
                    this.errorCount -= 1;
                    this.$notify({
                        customClass: "notify-error",
                        message: `一次最多可上传10个${this.displayName}`,
                        duration: 1500,
                        showClose: false
                    });
                    return false;
                }
                return true;
            }
        },
        // 选择分类节点
        chooseNode(data) {
            //  this.nodeData =  data;
            this.$set(
                this.options,
                "target",
                `${this.apiHost}/api/chunkupload/${this.uploadType}/${data.id}`
            );
            this.chooseCategoryId = data.id;
            this.$refs.uploader.resetOption();
        },
        resetOption() {},
        upload() {
            this.disable = true;
            this.uploadBtnText = "正在上传";
            this.fileList.forEach(item => {
                item.resume();
            });
        },
        fileRemove(file) {
            if (!!file.error) this.errorCount -= 1;
            this.fileList = this.fileList.filter(item => item != file);
        },
        isMac() {
            return /macintosh|mac os x/i.test(navigator.userAgent);
        },
        checkFormat(file, format) {
            let fileName = this.isMac() ? file.file.name : file.name;
            let fileNameIndex = fileName.lastIndexOf(".");
            let fileNameSuffix = fileName.slice(fileNameIndex);
            if (this.uploadType === "File") {
                if (format.indexOf(fileNameSuffix.toLowerCase()) !== -1) {
                    file.cancel(file);
                    this.errorCount -= 1;
                    this.$notify({
                        customClass: "notify-error",
                        message: `不允许添加${fileNameSuffix}的文件`,
                        duration: 1500,
                        showClose: false
                    });
                    return false;
                }
            } else {
                if (format.indexOf(fileNameSuffix.toLowerCase()) === -1) {
                    file.cancel(file);
                    this.errorCount -= 1;
                    this.$notify({
                        customClass: "notify-error",
                        message: `请添加${this.displayName}格式文件`,
                        duration: 1500,
                        showClose: false
                    });
                    return false;
                }
            }
        }
    },
    watch: {
        fileList() {
            if (this.fileList.length > 0) {
                this.disable = false;
            } else {
                this.disable = true;
            }
        }
    }
};
</script>

<style scoped>
.uploader-list /deep/ .uploader-file {
    /* min-height: 54px; */
    line-height: 1;
}

.uploader-list /deep/ .uploader-file-icon {
    /* width: 113px;
    height: 80px; */
    line-height: 1;
    margin: 0;
}

.uploader-list /deep/ .uploader-file-icon:before {
    display: none;
}

.uploader-list /deep/ ul {
    margin-top: 20px;
}

.uploader-list /deep/ ul li {
    margin-bottom: 14px;
    border: 1px solid #e5e5e5;
}

.uploader-list /deep/ ul li:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
/* zxb begin */
.uploader-list /deep/ .uploader-file-status,
.uploader-list /deep/ .uploader-file-actions {
    float: right;
    text-align: right;
    padding-right: 16px;
    display: flex;
    align-items: center;
}
.uploader-list /deep/ .uploader-file-actions {
    padding-left: 16px;
    padding-right: 0;
}
.uploader-list /deep/ .uploader-file-actions,
.uploader-list /deep/ .uploader-file-status {
    justify-content: flex-end;
}

.uploader-list /deep/ .uploader-file {
    border: none;
}

.uploader-list /deep/ .uploader-file-progress {
    background: #fff;
}

.uploader-list /deep/ .uploader-file-name {
    display: flex;
    align-items: center;
}

.chunkUpload-select-tree /deep/ .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
    border-color: #a1a8b1;
    font-size: 14px;
}
</style>
<style scoped lang="scss">
.defult-color {
    color: #09cceb;
}

.upload-head {
    padding: 0 32px;
}

.chunkUpload-select-tree {
    padding-top: 20px;
    width: 214px;
}

.uploader-example {
    padding: 15px;
    min-height: 320px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin: 13px 0 16px 0;
    padding: 0 32px;
    .uploader-drop {
        border: none;
        background: transparent;
        // position: absolute;
        // right: 0;
        // top: -40px;
        margin-top: 16px;
        padding: 0;
        height: 68px;
        background: rgba(245, 245, 245, 1);
        border-radius: 2px;
        border: 1px dashed rgba(215, 215, 215, 1);
        text-align: center;
        line-height: 68px;
        .uploader-btn {
            // border: 1px solid #09cceb;
            border: none;
            color: #09cceb;
            padding-left: 0;
            &:hover {
                background: transparent;
            }
        }
    }
}

.uploader-example .uploader-btn {
    margin-right: 4px;
}

.uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
}

.upload-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    ul {
        display: flex;
        align-items: center;
    }
}

.success-color {
    color: #35b24b;
}

.error-color {
    color: #f15533;
}

.disable-btn {
    background: rgba(229, 229, 229, 1);
    border-radius: 2px;
    border: 1px solid rgba(229, 229, 229, 1);
    color: #fff;
}
</style>
