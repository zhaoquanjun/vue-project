<template>
  <div class="dialog-mask--area" v-if="dialogShow">
    <div class="dialog-translate--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis" v-if="modalData && modalData.title">
          {{ modalData.title }}
        </div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <p
          class="translate-list--desc"
          v-if="modalData && modalData.type && modalData.type === 'more'"
        >
          已选
          <span class="is-active">{{
            modalData.total && modalData.total
          }}</span>
          篇文章，其中
          <span class="is-active">{{
            modalData.enable && modalData.enable
          }}</span>
          篇符合批量翻译条件
        </p>
        <!--  v-scrollBar -->
        <ul
          class="translate-list"
          v-if="modalData && modalData.list && modalData.list.length > 1"
        >
          <li v-for="(item, index) in modalData.list" :key="index">
            <span
              class="check-box"
              :class="{
                'is-checked': item.isChecked,
                'is-disabled': item.contentLength > 4000
              }"
              @click="_handleChooseNewsItem(item)"
            >
              <i class="iconfont iconduihao"></i>
            </span>
            <span
              class="item-title ellipsis"
              :class="{ 'max-width': item.contentLength > 4000 }"
              >{{ modalData.isNews ? item.title : item.name }}</span
            >
            <span class="item-warning" v-show="item.contentLength > 4000"
              ><i class="iconfont iconicon-exclamationmark"></i>
              字数超过4000，请后续手工分段翻译【百度翻译】</span
            >
          </li>
        </ul>
        <div
          class="translate-language--signal"
          v-if="
            modalData && modalData.languages && modalData.languages.length === 1
          "
        >
          <p class="signal-title">翻译至分类：</p>
          <el-select
            class="select-tree"
            ref="selectTree"
            v-model="value.label"
            popper-class="aside-tree translate-id--area"
            placeholder="请选择节点"
          >
            <el-option :value="value.label">
              <el-tree
                ref="tree"
                node-key="id"
                :data="modalData.tree"
                :expand-on-click-node="false"
                :default-expand-all="true"
                :highlight-current="true"
                accordion
                @node-click="_handleTreeNodeClick"
              ></el-tree>
            </el-option>
          </el-select>
        </div>
        <div class="translate-language--more" v-else>
          <p class="more-title">翻译至语言</p>
          <ul class="language-list" v-if="modalData && modalData.languages">
            <li v-for="(item, index) in modalData.languages" :key="index">
              <span
                class="check-box"
                :class="{
                  'is-checked': item.isChecked
                }"
                @click="_handleChooseLanguagesItem(item)"
              >
                <i class="iconfont iconduihao"></i>
              </span>
              <p class="language-name">{{ item.label }}</p>
            </li>
          </ul>
          <p
            class="error-tips"
            v-show="
              modalData &&
                modalData.languages.length > 1 &&
                languagesSelectedArr.length === 0
            "
          >
            请至少选择一种要翻译的语言
          </p>
        </div>
      </div>
      <div class="modal-btn--area">
        <div
          class="cl-button cl-button--primary_notbg confirm"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleCancle"
        >
          取消
        </div>
        <div
          class="cl-button cl-button--primary cancle"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleConfirm"
        >
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    languageModal: {
      type: Object
    }
  },
  data() {
    return {
      dialogShow: false,
      errorTipsShow: false,
      modalData: null,
      value: {
        value: '',
        label: ''
      }
    }
  },
  computed: {
    languagesSelectedArr: {
      get: function() {
        let arr = []
        if (this.modalData.languages.length > 0) {
          for (var i = 0; i < this.modalData.languages.length; i++) {
            const item = this.modalData.languages[i]
            if (item.isChecked) {
              arr.push(item)
            }
          }
        }
        return arr
      },
      set: function() {}
    }
  },
  created() {
    console.log(this.languageModal)
  },
  methods: {
    showSelf() {
      this.dialogShow = true
      this.$nextTick(() => {
        this._initModalData()
        this._initSelectboxValue()
      })
    },
    hideSelf() {
      this.dialogShow = false
    },
    _handleConfirm() {
      let obj = {}
      obj.languagesList = this._getLastTranslateLanguages()
      obj.id = this.value.value
      obj.list = this._getLastTranslateList()
      if (obj.list.length > 0) {
        this.$emit('languageConfirm', obj)
        this.hideSelf()
      }
    },
    _handleCancle() {
      this.$emit('cancle')
      this.hideSelf()
    },
    _handleChooseNewsItem(o) {
      if (o.contentLength <= 4000) {
        o.isChecked = !o.isChecked
      }
    },
    _handleChooseLanguagesItem(o) {
      o.isChecked = !o.isChecked
    },
    _handleTreeNodeClick(v) {
      if (v.id >= 0) {
        this.value.label = v.label
        this.value.value = v.id
        this.$refs.selectTree.blur()
        document.getElementsByClassName('translate-id--area')[0].remove()
      }
    },
    _setCurrentNode(nodeId) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(nodeId)
      })
    },
    _initSelectboxValue() {
      if (
        this.modalData &&
        this.modalData.languages.length === 1 &&
        this.modalData.tree.length > 0
      ) {
        if (
          this.modalData.tree[0].children &&
          this.modalData.tree[0].children.length
        ) {
          this.value.label = this.modalData.tree[0].children[0].label
          this.value.value = this.modalData.tree[0].children[0].id
          this._setCurrentNode(this.value.value)
        } else {
          this.value.label = '全部分类'
          this.value.value = 0
          this._setCurrentNode(this.value.value)
        }
      }
    },
    _initModalData() {
      let data = JSON.parse(JSON.stringify(this.languageModal))
      if (data && data.list && data.list.length) {
        data.list.map((item) => {
          return this.$set(
            item,
            'isChecked',
            item.contentLength <= 4000 ? true : false
          )
        })
      }

      if (data && data.languages && data.languages.length) {
        data.languages.map((item) => {
          return this.$set(item, 'isChecked', true)
        })
      }

      if (data && data.tree && data.tree.length) {
        this._setTreeNodeDisabled(data.tree)
      }
      this.modalData = data
    },
    _setTreeNodeDisabled(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].id < 0) {
          data[i].disabled = true
        }
        if (data[i].children && data[i].children.length > 0) {
          this._setTreeNodeDisabled(data[i].children)
        }
      }
    },
    _getLastTranslateList() {
      let arr = []
      for (var i = 0; i < this.modalData.list.length; i++) {
        const item = this.modalData.list[i]
        if (item.isChecked) {
          arr.push(item.id)
        }
      }
      return arr
    },
    _getLastTranslateLanguages() {
      let arr = []
      for (var i = 0; i < this.modalData.languages.length; i++) {
        const item = this.modalData.languages[i]
        if (item.isChecked) {
          arr.push(item.languages)
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-mask--area {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.75);
  .dialog-translate--modal {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 25px 32px;
    width: 450px;
    max-height: 600px;
    background-color: $--color-white;
    box-shadow: $--box-shadow-dark-small;
    border-radius: $--border-radius-base;
    transition: transform 0.3s linear;

    .modal-header--area {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .model-title {
        max-width: 380px;
        font-size: $--font-size-medium;
        color: $--color-text-primary;
        line-height: 22px;
      }
    }

    .modal-content--area {
      margin-top: 24px;

      .translate-list--desc {
        font-size: $--font-size-base;
        color: $--color-text-primary;

        .is-active {
          color: $--color-primary;
        }
      }

      .translate-list {
        position: relative;
        padding: 16px 16px 23px;
        margin-top: 16px;
        max-height: 154px;
        min-height: 60px;
        border-radius: $--border-radius-base;
        border: 1px solid $--border-color-base;
        overflow: auto;

        li {
          margin-bottom: 16px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .check-box {
            display: block;
            margin-right: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 14px;
            height: 14px;
            border-radius: $--border-radius-base;
            border: 1px solid $--border-color-base;
            box-sizing: border-box;
            cursor: pointer;

            i {
              margin-left: 2px;
              display: none;
              font-size: 12px;
              transform: scale(0.8);
              color: #fff;
            }
          }

          .is-checked {
            border-color: $--color-primary;
            background-color: $--color-primary;

            i {
              display: block;
            }
          }

          .is-disabled {
            background-color: #f2f6fc;
            border-color: #dcdfe6;
            cursor: not-allowed;
          }

          .item-title {
            margin-right: 12px;
            max-width: 100%;
            user-select: none;
          }

          .max-width {
            max-width: 100px;
          }

          .item-warning {
            font-size: $--font-size-small;
            color: $--color-primary;

            i {
              color: $--color-primary;
            }
          }
        }

        li:last-of-type {
          margin-bottom: 0;
        }
      }

      .translate-language--more {
        margin-top: 16px;
        font-size: $--font-size-base;

        .language-list {
          margin-top: 16px;

          li {
            margin-bottom: 16px;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .check-box {
              display: block;
              margin-right: 6px;
              margin-left: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 14px;
              height: 14px;
              border-radius: $--border-radius-base;
              border: 1px solid $--border-color-base;
              box-sizing: border-box;
              cursor: pointer;

              i {
                margin-left: 2px;
                display: none;
                font-size: 12px;
                transform: scale(0.8);
                color: #fff;
              }
            }

            .is-checked {
              border-color: $--color-primary;
              background-color: $--color-primary;

              i {
                display: block;
              }
            }

            .is-disabled {
              cursor: not-allowed;
            }

            .language-name {
              min-width: 60px;
              font-size: $--font-size-small;
              user-select: none;
            }

            .site-name {
              margin-right: 4px;
              user-select: none;
            }

            .site-name:last-of-type {
              margin-right: 0;
            }
          }

          li:last-of-type {
            margin-bottom: 0;
          }
        }

        .error-tips {
          margin: 16px;
          margin-left: 16px;
          font-size: $--font-size-small;
          color: $--color-warning;
        }
      }

      .translate-language--signal {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 16px;
        font-size: $--font-size-base;

        .select-tree {
          margin-left: 3px;
        }
      }
    }

    .modal-btn--area {
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      p {
        margin-right: 16px;
        font-size: $--font-size-small;
        color: $--color-warning;
      }
    }
  }
  .transform-move--top {
    transform: translateY(-5%);
  }
}

.translate-id--area {
  padding-top: 0;
  .el-select-dropdown__item {
    max-width: 600px;
    background: #fff;
    height: auto;
    line-height: auto;
    cursor: default;
  }

  .selected {
    font-weight: 500;
  }

  .el-select-dropdown__item /deep/ .el-tree {
    .el-tree-node {
      .el-tree-node__content {
        .el-tree-node__label {
          width: 100%;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
