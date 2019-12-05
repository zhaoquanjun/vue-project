<template>
  <div class="image-select--upload__area">
    <div class="mask"></div>
    <div id="content" class="contentDialog">
      <el-header class="modal-header">
        <span style="font-size: 16px;">我的图片</span>
        <span class="close-icon" @click="cancelgetImg"></span>
      </el-header>
      <modal-content ref="imgList" :isGrid="true" @getImgInfo="getImgInfo" :multiple="false" :isPopup="true">
        <div slot="modal-footer" class="modal-footer">
          <button type="button" @click="getImg" class="cl-button cl-button--small cl-button--primary">确定</button>
          <button type="button" @click="cancelgetImg" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
        </div>
      </modal-content>
    </div>
  </div>
</template>

<script>
import ModalContent from "_c/wechat-account/uploadChooseImage/index";
export default {
  props: {
    model: {
      type: Object
    }
  },
  data() {
    return {};
  },
  components: {
    ModalContent
  },
  methods: {
    getImgInfo(info) {
      this.imgData = info;
    },
    getImg() {
      // 获取选中的图片信息 有两种方式    哪种都ok
      console.log(this.imgData, "hadhgfdhfhgfdg"); //
      console.log(this.$refs.imgList.selectedImg, "11111"); //
      this.$emit('getImage', this.imgData[0].fullOssUrl);
    },
    // 关闭图片选择弹窗
    cancelgetImg() {
      this.$emit('handleCloseModal');
    }
  },
  watch: {
    isFirst(newVal, oldVal) {
      if (newVal) {
        this.$emit("uploadImg");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.image-select--upload__area {
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
    width: 1200px;
    height: 710px;
    margin: auto;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border-radius: $--border-radius-base;
    background: #fff;
  }
  #content-manage .tree-aside {
    height: auto;
  }
  #content .el-dialog {
    margin-top: 5vh !important;
    width: 80%;
    overflow: hidden;
  }
  #content .el-dialog__body {
    padding-top: 0;
  }
  #content .modal-header {
    background: rgb(255, 255, 255);
    height: 60px !important;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: $--border-base;
    .close-icon {
      display: block;
      width: 16px;
      height: 16px;
      background: url("~img/account/close.png") no-repeat center center;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
  .modal-footer {
    height: 32px;
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 100%;
    z-index: 100;
    text-align: right;
  }
}
</style>
