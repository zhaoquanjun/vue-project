<template>
    <div>
        <!-- <div id="content">
            <el-dialog
                :close-on-click-modal="false"
                title="我的图片"
                :visible.sync="isModalShow"
                width="90%"
                :append-to-body="true"
                :lock-scroll="true"
            >
                <modal-content
                ref="imgList"
                :isGrid="true"
                @getImgInfo="getImgInfo"
            ></modal-content>
                <div slot="footer" class="dialog-footer">
                    <el-button>取 消</el-button>
                    <el-button @click="getImg" type="primary">确 定</el-button>
                </div>
            </el-dialog>
        </div>-->
        <div class="mask" v-show="isModalShow"></div>
        <div id="content" v-show="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <span @click="cancelgetImg">X</span>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo">
                <div slot="modal-footer" class="modal-footer">
                    <button @click="getImg" class="sure">确定</button>
                    <button @click="cancelgetImg" class="cancel">取消</button>
                </div>
            </modal-content>
        </div>
    </div>
</template>
<script>
import ModalContent from "@/components/ImgManage/index.vue";
export default {
    components: {
        ModalContent
    },
    data() {
        return {
            isModalShow: true //  弹窗 : true 打开 | false 关闭
        };
    },
    methods: {
        getImgInfo(info) {
            console.log(info, "0000000");
            this.imgData = info;
        },
        getImg() {
            // 获取选中的图片信息 有两种方式    哪种都ok
            console.log(this.imgData, "hadhgfdhfhgfdg"); //
            console.log(this.$refs.imgList.selectedImg, "11111"); //
            this.isModalShow = false;
        },
        // 关闭图片选择弹窗
        cancelgetImg() {
            this.isModalShow = false;
        }
    }
};
</script>
<style lang="scss">
.mask {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 100;
    background: #000;
    width: 100%;
    height: 100%;
    opacity: 0.5;
}
#content {
    position: fixed;
    width: 80%;
    margin: auto;
    z-index: 112;
    bottom: 45px;
    top: 45px;
}
#content .el-container {
    padding-bottom: 25px;
    background: #fff;
    // border-radius: 5px;
    height: 90%;
}
#content-manage .tree-aside {
    height: auto;
}
.el-dialog {
    margin-top: 5vh !important;
    width: 90%;
    height: 80%;
    overflow: auto;
}
#content .el-dialog__body {
    padding-top: 0;
    /* border-top: 1px solid #e8eaf3; */
}
#content .modal-header {
    height: 30px;
    background: rgb(255, 255, 255);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaf3;
}
.modal-footer {
    padding-top: 20px;
    float: right;
    button {
        width: 66px;
        height: 32px;
        background: rgba(0, 193, 222, 1);
        margin-right: 8px;
        color: #fff;
    }
    .cancel {
        color: #262626;
        background: rgba(238, 238, 238, 1);
    }
}
</style>


