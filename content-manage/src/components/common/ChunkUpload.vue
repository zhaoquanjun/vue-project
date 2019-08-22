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
            :options="options"
            :autoStart="false"
            class="uploader-example"
            @file-added="onFileAdded"
            @file-removed="fileRemove"
            @file-success="onFileSuccess"
            @upload-start="uploadStart"
            @file-error="onFileError"
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
                <li>共上传{{fileList.length}}个文件，</li>
                <li v-if="successCount>0">
                    <i class="success-color">{{successCount}}</i> 个上传成功，
                </li>
                <li v-if="errorCount>0">
                    <i class="error-color">{{errorCount}}</i> 个上传失败
                </li>
            </ul>
            <button
                class="btn-small"
                :class="[disable?'disable-btn':'btn-bglightblue']"
                :disable="disable"
                @click="upload"
            >开始上传</button>
        </div>
    </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import * as chunkUploadManageApi from "@/api/request/chunkUploadManageApi";
import SelectTree from "@/components/common/SelectTree";
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
                                //todo 更换alert
                                // this.$confirm(
                                //     `${this.displayName}[${chunk.file.name}]已存在于[${data.existInCurrentAppInfo.categoryName}]分类下`,
                                //     "提示",
                                //     {
                                //         customClass: "medium",
                                //         iconClass: "icon-warning"
                                //     }
                                // );
                                this.$notify({
                                    customClass: "notify-error", //  notify-success ||  notify-error
                                    message: `${this.displayName}[${chunk.file.name}]已存在于[${data.existInCurrentAppInfo.categoryName}]分类下`,
                                    duration: 1500,
                                    showClose: false
                                });
                            }
                            return true;
                        }
                        case 2: {
                            if (chunk.offset === 0) {
                                chunkUploadManageApi.createFileWithoutUpload({
                                    UploadFileType: this.uploadType,
                                    Size: chunk.file.size,
                                    Md5Hash: data.existInAnotherAppInfo.md5Hash,
                                    FromAppId:
                                        data.existInAnotherAppInfo.fromAppId,
                                    FromId: data.existInAnotherAppInfo.fromId,
                                    Title: chunk.file.name,
                                    ContentType: chunk.file.fileType,
                                    CategoryId: this.nodeData.id || 0
                                });
                                //todo 更换alert

                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `文件秒传成功`,
                                    duration: 1500,
                                    showClose: false
                                });
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
            disable: true
        };
    },
    created() {
        this.options.target = `${this.apiHost}/api/chunkupload/${this.uploadType}/${this.nodeData.id}`;
    },
    methods: {
        onFileError(rootFile, file, response, chunk) {
            //todo 更换alert
            alert(JSON.parse(response).message);
            this.errorCount += 1;
        },
        onFileSuccess() {
            this.successCount += 1;
            if (this.successCount > 0 && this.errorCount < 1) {
                this.$emit("getList");
                this.$emit("closeDialog");

                this.fileList.forEach(file => {
                    file.cancel(file);
                });
                this.successCount = 0;
                this.errorCount = 0;
            }
        },
        onFileAdded(file) {
            if (file.fileType == "") {
                file.cancel(file);
                return;
            }
            let [, suffix] = file.fileType.split("/");
            let ary = [
                "exe",
                "php",
                "lnk",
                "cmd",
                "bat",
                "reg",
                "vb",
                "vbs",
                "js",
                "css",
                "aspx",
                "sql",
                "asp",
                "jsp",
                "htm",
                "html",
                "java",
                "json"
            ];
            if (ary.indexOf(suffix) > -1) {
                file.cancel(file);
                return;
            }
            this.panelShow = true;
            //   file.resume();
            this.computeMD5(file);
        },
        uploadStart(file) {},
        computeMD5(file) {
            let url = URL.createObjectURL(file.file);
            var audioElement = new Audio(url);
            var duration;
            audioElement.addEventListener("loadedmetadata", function(_event) {
                duration = audioElement.duration;
                console.log(duration + "s");
            });

            let fileReader = new FileReader();
            let time = new Date().getTime();
            let md5 = "";
            // console.log(`开始计算md5`);

            fileReader.readAsArrayBuffer(file.file);
            fileReader.onload = e => {
                md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
                //todo md5监听事件在此触发
                // console.log(
                //     `MD5计算完毕：${file.id} ${
                //         file.name
                //     } MD5：${md5} 用时：${new Date().getTime() -
                //         time} ms,自动开始上传,\n 香槟boy 监听事件在此触发`
                // );
                file.uniqueIdentifier = md5;
                this.fileList.push(file);
                // this.limitCount(file)
                //file.resume();
            };

            fileReader.onerror = function() {
                this.error(
                    "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
                );
            };
        },
        limitCount(file) {
            if (this.uploadType === "Audio") {
                if (this.fileList.length < 10) {
                    this.fileList.push(file);
                } else {
                    alert("一次最多可上传10个音频");
                }
            } else if (this.uploadType === "Video") {
                if (this.fileList.length < 10) {
                    this.fileList.push(file);
                } else {
                    alert("一次最多可上传10个音频");
                }
            }
        },
        // 选择分类节点
        chooseNode(data) {
            this.upload2Category = data;
            this.uploadPicAction = `${this.apiHost}/api/chunkupload/${this.uploadType}/${this.upload2Category.id}`;
        },
        upload() {
            this.fileList.forEach(item => {
                item.resume();
            });
        },
        fileRemove(file) {
            this.fileList = this.fileList.filter(item => {
                return item != file;
            });
        }
    },
    watch: {
        fileList() {
            if (this.fileList.length > 0) {
                this.disable = false;
            } else {
                this.disable = true;
            }
            // this.$nextTick(() => {
            //     let eles = document.getElementsByClassName(
            //         "uploader-file-icon"
            //     );
            //     for (let i = 0; i < eles.length; i++) {
            //         let ele = eles[i];
            //         ele.style.backgroundImage =
            //             "url('http://img5.imgtn.bdimg.com/it/u=150565144,593293567&fm=26&gp=0.jpg')";
            //     }
            // });
        }
    }
};
</script>

<style  scoped>
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
.uploader-list /deep/ ul li {
    margin-bottom: 14px;
    border: 1px solid #e5e5e5;
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
.chunkUpload-select-tree {
    padding-top: 20px;
    width: 214px;
}
.uploader-example {
    padding: 15px;
    min-height: 320px;
    border: 1px solid #eee;
    margin: 13px 0 16px 0;
    padding: 18px 20px;
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
