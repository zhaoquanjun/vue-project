<template>
    <div>
        一次可上传60张图片，单张图片大小不超过10MB
        <el-button style="float:right" size="small" type="default">选择文件夹</el-button>
        <el-button style="float:right" size="small" type="default">选择图片</el-button>
        <br>上传至[{{upload2Category.label}}] <br><br>
        <el-tree :data="treeResult"
                 node-key="id"
                 accordion
                 :expand-on-click-node="false"
                 @node-click="chooseNode">
        </el-tree>
        <el-upload class="upload-demo"
                   :action="uploadPicAction"
                   :headers="headers"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :file-list="fileList"
                   list-type="picture-card"
                   :auto-upload="false"
                   :limit="60"
                   :multiple="true"
                   ref="upload"
                   :before-upload="beforeUpload">
        </el-upload>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">开始上传</el-button>
        <br />

        <br /><br />
    </div>
</template>

<script>
    export default {
        props: ["treeResult", "uploadPicUrl"],
       
        data() {
            return {

                fileList: [],
                upload2Category: { label: "全部分类", id: 0 },
                uploadPicAction: `${this.uploadPicUrl}/0`,
                headers: {
                    appId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
                    Authorization: ""
                }
            };
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            chooseNode(data) {
                this.upload2Category = data;
                console.log(this.upload2Category);
                this.uploadPicAction = `${this.uploadPicUrl}/${this.upload2Category.id}`;
            },
            submitUpload() {
                
                this.headers.Authorization ='Bearer ' + this.$store.state.accessToken.Authorization;
                this.$refs.upload.submit();
            },
            beforeUpload(file) {
                const isPic = ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !== -1;
                const maxMb = 10;
                const isSizeOk = file.size / 1024 / 1024 < maxMb;

                if (!isPic) {
                    alert('上传头像图片只能是 图片 格式!');
                }
                if (!isSizeOk) {
                    alert(`上传图片大小不能超过 ${maxMb}MB!`);
                }
                return isPic && isSizeOk;
            }
        }
    }
</script>