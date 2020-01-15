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
        <div id="content" class="contentDialog" v-show="isModalShow">
            <el-header class="modal-header">
                <span style="font-size: 16px;">我的图片</span>
                <i @click="cancelgetImg" class="el-icon el-icon-close cl-iconfont is-circle"></i>
            </el-header>
            <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo" :isPopup="true">
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

</style>


