<template>
  <div>
    <div class="auth-tip" v-if="authtipShow" style="text-align:center">{{authtipText}}</div>
    <el-upload
      class="avatar-uploader"
      :action="uploadPicAction"
      :show-file-list="false"
      :headers="headers"
      :on-success="handleAvatarSuccess"
      :on-error="iconAvatarError"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="picUrl" :src="picUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <button class="upload-btn" size="small" plain type="primary">{{ !defaultHeadUrl ?'重新上传':'上传头像'}}</button>
    </el-upload>
    <div class="picture-format">
      <span class="gray8c">支持格式</span>
      <div class="black tip">支持jpg、png、jpeg、bmp格式</div>
      <div class="black tip">小于10M</div>
    </div>
    <div class="footer pannel-footer">
      <button
        class="confirm footer-btn"
        :disabled="disabled"
        :class="{'disabled-btn':disabled}"
        @click="comfirm"
      >确定</button>
      <button class="cancel footer-btn" @click="close">取消</button>
    </div>
  </div>
</template>
<script>
import environment from "@/environment/index.js";
import { updateUserPicture } from "@/api/index.js";
import securityService from "@/services/authentication/securityService";
export default {
  props: ["imageUrl","defaultAvatarHeadUrl"],
  data() {
    return {
      defaultHeadUrl: false,
      uploadPicAction: `${environment.uploadPicUrl}/-1`,
      headers: {
        appId: "",
        Authorization: ""
      },
      picUrl: "",
      textName: "上传头像",
      disabled: false,
      authtipShow: false,
      authtipText: ""
    };
  },
  created() {
    this.picUrl = this.imageUrl;
    this.defaultHeadUrl = this.defaultAvatarHeadUrl
    if (!this.imageUrl) {
      this.disabled = true;
    }
  },
  mounted() {},
  methods: {
    handleAvatarSuccess(res, file) {
      this.picUrl = file.response;
      this.disabled = false;
    },
    async beforeAvatarUpload(file) {
      let data = await securityService.getUser();
      this.headers.Authorization = "Bearer " + data.access_token;
      this.headers.appId = this.$store.state.dashboard.appId;
      const isPic =
        ["image/png", "image/jpeg", "image/gif", "image/bmp"].indexOf(
          file.type
        ) !== -1;
      const maxMb = 10;
      const isSizeOk = file.size / 1024 / 1024 < maxMb;
      if (!isPic) {
        this.authtipShow = true;
        this.authtipText = "格式错误";
        return false;
      }
      if (!isSizeOk) {
        this.authtipShow = true;
        this.authtipText = `请上传小于${maxMb}M的图片!`;
        return false;
      }
      this.authtipShow = false;
      return isPic && isSizeOk;
    },
    //上传图片失败回调
    iconAvatarError() {
      this.$notify({
        customClass: "notify-error",
        message: `上传失败`,
        duration: 1500,
        showClose: false
      });
    },
    async comfirm() {
      let { status } = await updateUserPicture(this.picUrl);
      if (status === 200) {
        this.$emit("getUserProfileAsync");
        this.$store.commit("CLOSERIGHTPANNEL", false);
        this.$store.dispatch("_getAppHeadInfo"); // 更新顶部导航头像
      }
    },
    close() {
      this.$store.commit("CLOSERIGHTPANNEL", false);
    }
  },
  computed: {
    pannelShow() {
      return this.$store.state.isRightPanelShow;
    }
  },
  watch: {
    pannelShow() {
      this.picUrl = this.imageUrl;
      this.defaultHeadUrl = this.defaultAvatarHeadUrl;
      this.authtipShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style/personal";
.avatar-uploader {
  text-align: center;
  margin-top: 40px;
  position: relative;
  .upload-btn {
    width: 90px;
    height: 32px;
    color: #fff;
    background: rgba(1, 192, 222, 1);
    position: absolute;
    bottom: -64px;
    left: 50%;
    margin-left: -40px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.picture-format {
  text-align: center;
  margin-top: 100px;
  .tip {
    line-height: 17px;
    padding-top: 8px;
    font-weight: 500;
  }
}
.disabled-btn {
  background: rgba(1, 192, 222, 1);
}
</style>

