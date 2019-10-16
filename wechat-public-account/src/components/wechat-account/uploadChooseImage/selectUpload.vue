<template>
  <div class="image-select--upload__area" v-show="imageChooseAreaShowFlag">
    <div class="mask"></div>
    <div id="content">
      <el-header class="modal-header">
        <span style="font-size: 16px;">我的图片</span>
        <span class="close-icon" @click="cancelgetImg"></span>
      </el-header>
      <image-choose ref="imgList" :multiple="false" @getImgInfo="getImgInfo">
        <div slot="modal-footer" class="modal-footer">
          <button @click="getImg" class="sure">确定</button>
          <button @click="cancelgetImg" class="cancel">取消</button>
        </div>
      </image-choose>
    </div>
  </div>
</template>

<script>
import ImageChoose from "_c/wechat-account/uploadChooseImage/index";
export default {
  props: {
    model: {
      type: Object
    },
    imageChooseAreaShowFlag: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  components: {
    ImageChoose
  },
  methods: {
    getImgInfo(info) {
      this.imgData = info;
    },
    getImg() {
      this.$emit("handleCloseModal");
      this.$emit('getImage', this.imgData[0].fullOssUrl);
    },
    // 关闭图片选择弹窗
    cancelgetImg() {
      this.$emit("handleCloseModal");
    },
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
    width: 80%;
    min-width: 800px;
    max-width: 1200px;
    height: 800px;
    margin: auto;
    z-index: 112;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
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
    /* border-top: 1px solid #e8eaf3; */
  }
  #content .modal-header {
    background: rgb(255, 255, 255);
    height: 60px !important;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaf3;
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
    float: right;
    button {
      width: 66px;
      height: 40px;
      line-height: 40px;
      background: rgba(0, 193, 222, 1);
      margin-right: 8px;
      color: #fff;
    }
    .cancel {
      color: #262626;
      background: rgba(238, 238, 238, 1);
    }
  }
}
</style>
