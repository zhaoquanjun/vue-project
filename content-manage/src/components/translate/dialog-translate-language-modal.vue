<template>
  <div class="dialog-mask--area" v-if="dialogShow">
    <div class="dialog-translate--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis">自动翻译</div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <p
          class="translate-list--desc"
          v-if="
            (modalData && modalData.total) || (modalData && modalData.enable)
          "
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
          class="translate-list el-scrollbar"
          v-if="modalData && modalData.list && modalData.list.length > 0"
        >
          <li v-for="(item, index) in modalData.list" :key="index">
            <span
              class="check-box"
              :class="{
                'is-checked': item.isChecked,
                'is-disabled': !item.isChecked
              }"
            >
              <i class="iconfont iconduihao"></i>
            </span>
            <span class="item-title ellipsis">{{ item.title }}</span>
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
            popper-class="translate-id--area"
            placeholder="请选择节点"
          >
            <el-option :value="value.label">
              <el-tree
                :data="modalData.tree"
                :expand-on-click-node="false"
                :default-expand-all="true"
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
                  'is-checked': item.isChecked,
                  'is-disabled': !item.isChecked
                }"
                @click="_handleChooseLanguagesItem(item)"
              >
                <i class="iconfont iconduihao"></i>
              </span>
              <p class="language-name">{{ item.name }}</p>
              <!-- <span class="site-name" v-for="(it, ind) in item.site" :key="ind"
                >【{{ it }}】</span
              > -->
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
          翻译
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
        value: "",
        label: ""
      }
    };
  },
  computed: {
    languagesSelectedArr: {
      get: function() {
        let arr = [];
        if (this.modalData.languages.length > 0) {
          for (var i = 0; i < this.modalData.languages.length; i++) {
            const item = this.modalData.languages[i];
            if (item.isChecked) {
              arr.push(item);
            }
          }
        }
        return arr;
      },
      set: function() {}
    }
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
      this.$nextTick(() => {
        this.initModalData();
        this._initSelectboxValue();
      });
    },
    hideSelf() {
      this.dialogShow = false;
    },
    _handleConfirm() {
      let obj = {};
      obj.languagesList =
        this.modalData.languages.length > 1
          ? this.languagesSelectedArr
          : this.modalData.languages[0].languages;
      obj.id = this.value.value;
      this.$emit("languageConfirm", obj);
      this.hideSelf();
    },
    _handleCancle() {
      this.$emit("cancle");
      this.hideSelf();
    },
    _handleChooseNewsItem(o) {
      if (o.contentLength <= 4000) {
        o.isChecked = !o.isChecked;
      }
    },
    _handleChooseLanguagesItem(o) {
      o.isChecked = !o.isChecked;
    },
    _handleTreeNodeClick(v) {
      this.value.label = v.label;
      this.value.value = v.id;
      this.$refs.selectTree.blur();
      document.getElementsByClassName("translate-id--area")[0].remove();
    },
    _initSelectboxValue() {
      if (this.modalData && this.modalData.languages.length === 1) {
        this.value.label = this.modalData.tree[0].label;
        this.value.value = this.modalData.tree[0].id;
      }
    },
    initModalData() {
      let data = JSON.parse(JSON.stringify(this.languageModal));
      if (data && data.list && data.list.length) {
        data.list.map(item => {
          return this.$set(
            item,
            "isChecked",
            item.contentLength <= 4000 ? true : false
          );
        });
      }

      if (data && data.languages && data.languages.length) {
        data.languages.map(item => {
          return this.$set(item, "isChecked", true);
        });
      }
      this.modalData = data;
      console.log(data);
    }
  }
};
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
    top: 55%;
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
            max-width: 100px;
            user-select: none;
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
  .el-select-dropdown__item {
    max-width: 600px;
    background: #fff;
    height: auto;
    line-height: auto;
    cursor: default;
  }

  .el-select-dropdown__item /deep/ .el-tree {
    .el-tree-node {
      .el-tree-node__content {
        .el-tree-node__label {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
