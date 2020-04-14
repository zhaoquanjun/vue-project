<template>
  <div class="uploadCategoryPic">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="76px"
      class="demo-ruleForm"
      @submit.native.prevent
    >
      <el-form-item label="分类名称" prop="name" class="category-name">
        <el-input
          size="small"
          v-model="ruleForm.name"
          autocomplete="off"
          placeholder="请输入分类名称"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item class="upload-item" v-if="isUpload" label="分类图片">
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">
            分类图片用于分类控件带图片样式的展示，
            <br />建议上传尺寸为400✕400像素的图片
          </div>
          <span style="position: absolute;left: -13px;">
            <i class="iconfont iconyiwen"></i>
          </span>
        </el-tooltip>
        <el-upload
          class="avatar-uploader"
          :action="uploadPicAction"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <div v-if="imageUrl1" class="imgWrap">
            <img :src="imageUrl1" class="avatar" />
            <span class="el-upload-list__item-actions">
              <i class="icon-change"></i>
              <i @click.stop="handleRemove" class="el-icon-delete"></i>
            </span>
          </div>
          <template v-else>
            <i style class="el-icon-plus avatar-uploader-icon"></i>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="pannel-footer">
      <button
        class="cl-button cl-button--small cl-button--primary_notbg"
        @click="cancel"
      >
        取消
      </button>
      <button
        class="cl-button cl-button--small cl-button--primary"
        @click="submitForm('ruleForm')"
      >
        确定
      </button>
    </div>
  </div>
</template>
<script>
import environment from '@/environment/index.js'
import { trim } from '@/utlis/index.js'
import securityService from '@/services/authentication/securityService'
export default {
  props: {
    isUpload: {
      type: Boolean,
      default: true
    },
    modifyCategoryData: {
      type: Object,
      default: () => ({})
    },
    clickNode: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    var checkInput = (rule, value, callback) => {
      if (!trim(value)) {
        return callback(new Error('请输入分类名称'))
      } else {
        callback()
      }
    }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      activeName: '',
      uploadDisabled: true,
      fileList: [],
      upload2Category: { label: '全部分类', id: 0 },
      uploadPicAction: `${environment.uploadPicUrl}/0`,
      headers: {
        appId: '',
        Authorization: ''
      },
      uploadSucess: false,
      imageUrl1: '',
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: checkInput, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    modifyCategoryData: {
      handler(newName, oldName) {
        this.ruleForm.name = newName.label
        this.imageUrl1 = newName.thumbnailPicUrl
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.headers.appId = this.$store.state.dashboard.appId
  },
  methods: {
    handleSucess(response, file, fileList) {
      this.imageUrl1 = file.response
    },
    handleRemove(file, fileList) {
      this.imageUrl1 = ''
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl1 = file.response
    },
    async beforeAvatarUpload(file) {
      let data = await securityService.getUser()
      this.headers.Authorization = 'Bearer ' + data.access_token
      const isPic =
        ['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) !== -1
      const maxMb = 10
      const isSizeOk = file.size / 1024 / 1024 < maxMb

      if (!isPic) {
        this.$notify({
          customClass: 'notify-error', //  notify-success ||  notify-error
          message: `上传头像图片只能是 图片 格式!`,
          showClose: false,
          duration: 1500
        })
      }
      if (!isSizeOk) {
        this.$notify({
          customClass: 'notify-error', //  notify-success ||  notify-error
          message: `上传图片大小不能超过 ${maxMb}MB!`,
          showClose: false,
          duration: 1500
        })
      }
      return isPic && isSizeOk
    },
    // 新建保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confrim()
        } else {
          return false
        }
      })
    },
    // 确定按钮
    confrim() {
      let displayName = this.ruleForm.name
      this.$emit(
        'createCategory',
        displayName,
        this.imageUrl1,
        this.clickNode.data.language
      )
      this.ruleForm.name = ''
      this.imageUrl1 = ''
    },
    //取消按钮
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('closeUploadCategoryPic')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input /deep/ .el-input__inner {
  padding-right: 50px;
}
.uploadCategoryPic /deep/ .el-form {
  padding: 10px;
}
.uploadCategoryPic /deep/ .el-form .el-form-item__label {
  font-size: $--font-size-small;
  text-align: left;
}
.uploadCategoryPic /deep/ .el-form .el-form-item__error {
  padding-top: 0;
}
.uploadCategoryPic .category-name /deep/ .el-form-item__content {
  margin-left: 76px !important;
}
.uploadCategoryPic /deep/ .el-form .el-form-item {
  margin-bottom: 15px;
}

.uploadCategoryPic /deep/ .el-form .el-form-item__error {
  background: #fff;
  z-index: 1;
}
.avatar-uploader {
  margin: 0 auto;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed $--color-primary;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 70px;
  width: 70px;
  line-height: 70px;
  vertical-align: middle;
  box-sizing: border-box;
  border-radius: 0;
}
.avatar-uploader /deep/ .el-upload i {
  color: $--color-primary;
  cursor: pointer;
}
.avatar-uploader .el-upload:hover {
  border-color: $--color-primary;
}
.avatar-uploader-icon {
  font-size: 22px;
  color: #8c939d;
  /* width: 178px; */
  text-align: center;
  /* margin-bottom: 10px; */
}
.avatar {
  width: 70px;
  height: 70px;
  display: block;
}
.el-upload-list__item-actions {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
.avatar-uploader .el-upload-list__item-actions i {
  color: #fff;
  font-size: 21px;
  margin-bottom: 15px;
}
.imgWrap:hover .el-upload-list__item-actions {
  opacity: 1;
}
.icon-change {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url('~img/content-icon/change.png') no-repeat center;
  background-size: contain;
}
</style>
<style lang="scss" scoped>
.article-cover {
  color: #262626;
  font-weight: 500;
  font-size: $--font-size-small;
}
#content-manage .uploadCategoryPic {
  .pannel-footer {
    text-align: right;
    padding: 8;
    box-sizing: border-box;
  }
}
</style>
