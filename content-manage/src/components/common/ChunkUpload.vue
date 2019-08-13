<template>
    <div>
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
            <uploader-drop>
                <!-- <p>将{{displayName}}拖到此处，或 </p><br /> -->
                <uploader-btn :attrs="attrs">选择{{displayName}}</uploader-btn>
                <!-- <uploader-btn :directory="true">选择文件夹</uploader-btn> -->
            </uploader-drop>
            <uploader-list></uploader-list>
        </uploader>
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
            }
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
            this.panelShow = true;
            //  file.resume();
            this.computeMD5(file);
        },
        uploadStart() {},
        computeMD5(file) {
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
                file.resume();
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
        }
    }
};
</script>


<style scoped lang="scss">
.uploader-example {
    padding: 15px;
    min-height: 320px;
    border: 1px solid #eee;
        margin: 13px 0 16px 0;
    padding: 18px 20px;
    .uploader-drop {
        border: none;
        background: transparent;
        position: absolute;
        right: 0;
        top: -40px;
        padding: 0;
        .uploader-btn{
            border: 1px solid #09CCEB;
            color: #09CCEB;
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
