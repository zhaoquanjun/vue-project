<template>
    <uploader :options="options"
              :autoStart="false"
              class="uploader-example"
              @file-added="onFileAdded"
              @upload-start="uploadStart"
              @file-error="onFileError"
              >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
            <p>将文件拖到此处，或 </p>
            <uploader-btn :attrs="attrs">选择视频文件</uploader-btn>
            <uploader-btn :directory="true">选择文件夹</uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
    </uploader>
</template>

<script>
    import SparkMD5 from 'spark-md5'
    import * as chunkUploadManageApi from "@/api/request/chunkUploadManageApi";
    export default {
        components: {

        },
        data() {
            return {
                categoryId: 0,
                uploadType: "Video",
                options: {
                    target: null,
                    testChunks: true,
                    chunkSize: 2048000,   //分块大小,
                    simultaneousUploads: 1,
                    headers: {
                        //todo 在header中添加的验证，请根据实际业务来
                        //    Authorization: "Bearer " + "xxxxxxxxxxxxxxx"
                    },
                    checkChunkUploadedByResponse: (chunk, message) => {
                        let data = JSON.parse(message);
                        switch (data.fileStatus) {
                            case 0: {
                                return (data.uploadedChunkList || []).indexOf(chunk.offset + 1) >= 0
                            }
                            case 1: {
                                if (chunk.offset === 0) {
                                    alert(`文件已存在于[${data.existInCurrentAppInfo.categoryName}]分类下`);
                                }
                                return true;
                            }
                            case 2: {
                                if (chunk.offset === 0) {
                                    //todo  调用 秒传接口
                                    //UploadFileType
                                    chunkUploadManageApi.createFileWithoutUpload({
                                        UploadFileType: this.uploadType,
                                        Size: chunk.file.size,
                                        Md5Hash: data.existInAnotherAppInfo.md5Hash,
                                        FromAppId: data.existInAnotherAppInfo.fromAppId,
                                        FromId: data.existInAnotherAppInfo.fromId,
                                        Title: chunk.file.name,
                                        ContentType: chunk.file.fileType,
                                        CategoryId: this.categoryId
                                    });
                                    alert(`文件秒传成功`);
                                }

                                return true;
                            }
                        }
                    },
                },
                attrs: {
                    //     accept: 'video/*'
                },
            }
        },
        created() {
            this.options.target = `//localhost:8200/API/chunkupload/upload/${this.uploadType}/${this.categoryId}`;
        },
        methods: {
            onFileError(rootFile, file, response, chunk) {
                alert(JSON.parse(response).message)
            },
            onFileAdded(file) {
                this.panelShow = true;
                console.log(file, "onFileAdded")
                //  file.resume();
                this.computeMD5(file);
            },
            uploadStart() {
                //  file.pause();
                //console.log(file,33333333333)
            },
            computeMD5(file) {
                let fileReader = new FileReader();
                let time = new Date().getTime();
                let md5 = '';
                console.log(`开始计算md5`);

                fileReader.readAsArrayBuffer(file.file);
                fileReader.onload = (e => {

                    md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
                    console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms,自动开始上传,\n 香槟boy 监听事件在此触发`);
                    file.uniqueIdentifier = md5;
                    file.resume();
                });

                fileReader.onerror = function () {
                    this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.');
                };
            },
        }
    }
</script>


<style>
    .uploader-example {
        width: 880px;
        padding: 15px;
        margin: 40px auto 0;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .4);
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
