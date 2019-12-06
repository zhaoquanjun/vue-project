<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span class="article-cover">产品封面</span>
            </div>
            <div>

                <div class="avatar-uploader avatar-uploader">
                    <div class="imgWrap">
                        <draggable
                         tag="ul"
                          :options="{ animation: 150, ghostClass:'', dragClass: '111', scroll:true,scrollSensitivity: 200, handle: '.handler-move' }" 
                           v-model="newFileList"
                           @end="_handleSortEnd"  
                         class="el-upload-list el-upload-list--picture-card">
                            <li
                                class="el-upload-list__item is-success handler-move"
                                v-for="(item,index) in newFileList"
                                :key="index"
                            >
                                <img-size-auto :item="item" :newFileList="newFileList"></img-size-auto>
                                <span class="el-upload-list__item-actions">
                                    <!--  @click="handlePreview(item)" -->
                                    <span
                                        class="el-upload-list__item-preview"
                                       @click="handlerAddPicture('singular',index)"
                                    >
                                        <i class="iconfont iconqiehuanxingshier icon-hover"></i>
                                    </span>
                                    <span
                                        class="el-upload-list__item-delete"
                                        @click="handleRemove(index)"
                                    >
                                        <i class="iconfont iconshanchu icon-hover"></i>
                                    </span>
                                </span>
                            </li>
                        </draggable>
                    </div>
                    <template>
                        <div
                            class="el-upload el-upload el-upload--picture-card"
                            v-if="newFileList.length<9"
                        >
                            <button @click="handlerAddPicture">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <i
                                    class="avatar-text"
                                    style=" display: block; font-size: 12px;"
                                >添加图片</i>
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </el-card>
        <el-col style="margin-top:20px" v-if="false">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="模版样式" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <!-- 图片预览 begin -->
        <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!-- 图片预览 end -->
        <div class="mask" v-show="isModalShow"></div>
        <div id="content" class="contentDialog" v-show="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <button @click="cancelEditorImg">X</button>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo" :multiple="true" :isPopup="true" :isSecond="true">
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" @click="getEditorImg" class="cl-button cl-button--small cl-button--primary">确定</button>
                    <button type="button" @click="cancelEditorImg" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
                </div>
            </modal-content>
        </div>
    </div>
</template>
<script>
import environment from "@/environment/index.js";
import ModalContent from "@/components/ImgManage/index.vue";
import draggable from "vuedraggable";
import securityService from "@/services/authentication/securityService";
import ImgSizeAuto from "@/base/ImgSizeAuto"
export default {
    props: ["fileList"],
    components: {
        ModalContent,
        draggable,
        ImgSizeAuto
    },
    provide: {
      popper:true
    },
    data() {
        return {
            activeName: "",
            uploadDisabled: true,
            fileList1: [],
            fileList2: [],
            upload2Category: { label: "全部分类", id: 0 },
            uploadPicAction: `${environment.uploadPicUrl}/0`,
            headers: {
                appId: "",
                Authorization: ""
            },
            uploadSucess: false,
            imageUrl1: "",
            newFileList: [],
            dialogVisible: false,
            dialogImageUrl: "",
            limit: 9,
            isModalShow: false,
            imgsViewWay:[]
        };
    },

    mounted() {
        this.headers.appId = this.$store.state.dashboard.appId;
    },
    methods: {
        // 关闭图片选择弹窗
        cancelEditorImg() {
            this.isModalShow = false;
        },
        getImgInfo(info) {
            console.log(info, "0000000");
             let result = [];
                let obj = {};
                for (let i = 0; i < info.length; i++) {
                    if (!obj[info[i].id]) {
                        result.push(info[i]);
                        obj[info[i].id] = true;
                    }
                }
            this.imgData = result;
        },
        getEditorImg() {
            // 获取选中的图片信息 有两种方式
            //console.log(this.imgData, "imgData");
            //console.log(this.$refs.imgList.selectedImg, "selectedImg");
            // this.imageUrl1 = this.imgData[0].fullOssUrl;
            // this.isModalShow = false;
            if(this.isReplace=="singular"){
                this.$set(this.newFileList,this.curRepalceIndex,this.imgData[0].fullOssUrl)
                
            }else{
                this.imgData.forEach((item, index) => {
                    if(this.newFileList.length<9) this.newFileList.push(item.fullOssUrl);
                 });
                this.newFileList =  Array.from(new Set(this.newFileList))
            }
            this.isModalShow = false;
        },
        handlerAddPicture(flag,index) {
            this.isModalShow = true;
            this.$refs.imgList.clearSelectedList()
            this.isReplace = flag;
            this.curRepalceIndex = index
        },
        handleRemove(index) {
            this.newFileList.splice(index, 1);
            // this.newFileList = fileList;
            // if (this.newFileList.length >= 9) {
            //     document.querySelector(".el-upload").style.display = "none";
            // } else {
            //     document.querySelector(".el-upload").style.display =
            //         "inline-block";
            // }
        },
        handlePreview(url) {
            console.log(url);
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        // 上传图片超出数量限制时触发
        onExceed(fileList) {
            this.newFileList = fileList.splice(this.limit);
            this.$notify({
                customClass: "notify-error", //  notify-success ||  notify-error
                message: `上传图片文件超过数量限制!`,
                showClose: false,
                duration: 1500
            });
        },
        ///////
        handleAvatarSuccess(res, file, argfileList) {
            if (argfileList.length >= 9) {
                document.querySelector(".el-upload").style.display = "none";
            }
            // let fileList = {
            //     name: file.name,
            //     response: file.response,
            //     url: file.response
            // };
            if (argfileList.length > this.limit) {
                this.onExceed(argfileList);
            } else {
                this.newFileList = argfileList;
            }
        },
        async beforeAvatarUpload(file, fileList) {
            let data = await securityService.getUser();
            this.headers.Authorization = "Bearer " + data.access_token;
            const isPic =
                ["image/png", "image/jpeg", "image/gif"].indexOf(file.type) !==
                -1;
            const maxMb = 10;
            const isSizeOk = file.size / 1024 / 1024 < maxMb;

            if (!isPic) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片只能是 图片 格式!`,
                    showClose: false,
                    duration: 1500
                });
            }
            if (!isSizeOk) {
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `上传图片大小不能超过 ${maxMb}MB!`,
                    showClose: false,
                    duration: 1500
                });
            }
            return isPic && isSizeOk;
        },
         // 排序
        _handleSortEnd() {
        },
    },
    watch: {
        fileList() {
            this.newFileList = this.fileList;
            // if (this.fileList.length >= 9) {
            //     document.querySelector(".el-upload").style.display = "none";
            // } else {
            //     document.querySelector(".el-upload").style.display =
            //         "inline-block";
            // }
        },
        newFileList() {
            // if (this.fileList.length >= 9) {
            //     document.querySelector(".el-upload").style.display = "none";
            // } else {
            //     document.querySelector(".el-upload").style.display =
            //         "inline-block";
            // }
        }
    }
};
</script>
<style lang='scss' scoped>
.el-card /deep/ .el-card__body {
    text-align: center;
    padding: 15px;
}
.el-collapse /deep/ .el-collapse-item__header {
    padding: 0 10px;
}
.el-collapse /deep/ .el-collapse-item__content {
    padding: 0 10px;
}
/* 产品封面 */
.avatar-uploader /deep/ .el-upload-list--picture-card {
    display: inline-block;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed $--color-primary;
    border-radius: 0;

    vertical-align: middle;
}
.avatar-uploader .el-upload > .avatar-uploader-icon {
    font-size: 22px;
}
.avatar-uploader .el-upload i {
    color: $--color-primary;
    cursor: pointer;
    padding-bottom: 5px;
}
.avatar-uploader /deep/ .el-upload--picture-card {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    line-height: 0;
    vertical-align: top;
    display: flex;
    align-items: center;
    /* text-align: center; */
    flex-direction: column;
    justify-content: center;
    padding: 20px 0;
}
.avatar-uploader /deep/ .el-upload-list > li {
    float: left;
    border-radius: 0;
    cursor: move
}
.avatar-uploader /deep/ .el-upload-list > li:first-child {
    width: 200px;
    height: 200px;
}
.avatar-uploader /deep/ .el-upload-list > li:not(:first-child) {
    width: 96px;
    height: 97px;
}
.avatar-uploader /deep/ .el-upload-list > li:not(:first-child) img {
    object-fit: contain;
}

.avatar-uploader /deep/ .el-upload-list__item-actions > span {
    position: absolute;
    right: 17px;
    bottom: 19px;
    top: auto;
    width: 27px;
    border: $--border-base;
    height: 27px;
    border-radius: 50%;
}

.avatar-uploader
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-preview {
    left: 17px;
    bottom: 20px;
    border: none;
    width: 27px;
    height: 27px;
    /* background: url("~img/pic-icon/look.png") no-repeat center; */
    background-size: contain;
}
.el-upload-list--picture-card .el-upload-list__item-actions:hover{
    cursor: move
}
.avatar-uploader
    /deep/
    .el-upload-list__item-actions
    .el-upload-list__item-delete {
    right: 17px;
    bottom: 20px;
    border: none;
    width: 27px;
    height: 27px;
    /* background: url("~img/pic-icon/delete-icon.png") no-repeat center; */
    background-size: contain;
}

.avatar-uploader /deep/ .el-upload-list__item-actions .el-icon-zoom-in,
.avatar-uploader /deep/ .el-upload-list__item-actions .el-icon-delete {
    display: none;
}
</style>
<style lang="scss" scoped>
.article-cover {
    color: #262626;
    font-weight: 500;
    font-size: $--font-size-small;
}
.modal-footer {
    height: 60px;
    position: absolute;
    bottom: -11px;
    right: 16px;
    width: 100%;
    z-index: 100;
    text-align: right;
    padding-top: 0;
}
.icon-hover:hover{
    color: $--color-primary !important;
}
</style>
