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
                />
            </el-col>
            <div></div>
        </el-row>
        <uploader
            :options="options"
            :autoStart="false"
            class="uploader-example"
            @file-added="onFileAdded"
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
        <button class="btn-small btn-bglightblue" @click="upload">开始上传</button>
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
            categoryId: 0,
            options: {
                uploadType:this.uploadType,
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
                                alert(
                                    `${this.displayName}[${chunk.file.name}]已存在于[${data.existInCurrentAppInfo.categoryName}]分类下`
                                );
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
                                    CategoryId: this.categoryId
                                });
                                //todo 更换alert
                                alert(`文件秒传成功`);
                            }

                            return true;
                        }
                    }
                }
            },
            attrs: {
                accept: this.accept //'video/*'
            },
            fileList: [],
            img: require("../../assets/avatar.jpeg"),
            successFlieList: []
        };
    },
    created() {
        this.options.target = `${this.apiHost}/api/chunkupload/${this.uploadType}/${this.categoryId}`;
    },
    methods: {
        onFileError(rootFile, file, response, chunk) {
            //todo 更换alert
            alert(JSON.parse(response).message);
        },
        onFileSuccess() {
            this.$emit("getList");
        },
        onFileAdded(file) {
            this.fileList.push(file);
            console.log(file, "file");
            this.panelShow = true;
            //  file.resume();
            this.computeMD5(file);
        },
        uploadStart(file) {},
        computeMD5(file) {
            console.log(file, "00090000");
            let url = URL.createObjectURL(file.file);
            var audioElement = new Audio(url);
            console.log(audioElement);
            var duration;
            audioElement.addEventListener("loadedmetadata", function(_event) {
                duration = audioElement.duration;
                console.log(duration + "s");
            });

            let fileReader = new FileReader();
            let time = new Date().getTime();
            let md5 = "";
            console.log(`开始计算md5`);

            fileReader.readAsArrayBuffer(file.file);
            fileReader.onload = e => {
                md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
                //todo md5监听事件在此触发
                console.log(
                    `MD5计算完毕：${file.id} ${
                        file.name
                    } MD5：${md5} 用时：${new Date().getTime() -
                        time} ms,自动开始上传,\n 香槟boy 监听事件在此触发`
                );
                file.uniqueIdentifier = md5;
                this.successFlieList.push(file);
                // file.resume();
            };

            fileReader.onerror = function() {
                this.error(
                    "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
                );
            };
        },
        // 选择分类节点
        chooseNode(data) {
            this.upload2Category = data;
            this.uploadPicAction = `${this.apiHost}/api/chunkupload/${this.uploadType}/${this.upload2Category.id}`;
        },
        upload() {
            this.successFlieList.forEach(item => {
                item.resume();
            });
        }
    },
    watch: {
        fileList() {
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
    height: 54px;
    line-height: 1;
    padding: 8px;
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
    border: 1px solid #eee;
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
.uploader-list /deep/ .uploader-file-actions,.uploader-list /deep/ .uploader-file-status{
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
.chunkUpload-select-tree /deep/ .el-input--small .el-input__inner{
    height: 40px;
    line-height: 40px;
    border-color: #A1A8B1;
    font-size: 14px;
}
</style>
<style scoped lang="scss">
.chunkUpload-select-tree{
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
            &:hover{
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
</style>
