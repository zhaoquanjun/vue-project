<template>
  <div class="dialog-mask--area" v-show="dialogShow">
    <div class="dialog-translate--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis">自动翻译</div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <p class="translate-list--desc">
          已选
          <span class="is-active">{{ dialogInfo.total }}</span> 篇文章，其中
          <span class="is-active">{{ dialogInfo.enable }}</span>
          篇符合批量翻译条件
        </p>
        <!--  v-scrollBar -->
        <ul class="translate-list el-scrollbar">
          <li v-for="(item, index) in dialogInfo.list" :key="index">
            <span
              class="check-box"
              :class="{
                'is-checked': item.isChecked,
                'is-disabled': item.wordsNum > 4000
              }"
              @click="_handleChooseNewsItem(item)"
            >
              <i class="iconfont iconduihao"></i>
            </span>
            <span class="item-title ellipsis">{{ item.title }}</span>
            <span class="item-warning" v-show="item.wordsNum > 4000"
              ><i class="iconfont iconicon-exclamationmark"></i>
              字数超过4000，请后续手工分段翻译【百度翻译】</span
            >
          </li>
        </ul>
        <div
          class="translate-language--signal"
          v-if="dialogInfo.languages.length === 1"
        >
          <p class="signal-title">翻译至分类</p>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="translate-language--more" v-else>
          <p class="more-title">翻译至语言</p>
          <ul class="language-list">
            <li v-for="(item, index) in dialogInfo.languages" :key="index">
              <span
                class="check-box"
                :class="{ 'is-checked': item.isChecked }"
                @click="_handleChooseLanguagesItem(item)"
              >
                <i class="iconfont iconduihao"></i>
              </span>
              <p class="language-name">{{ item.name }}</p>
              <span class="site-name" v-for="(it, ind) in item.site" :key="ind"
                >【{{ it }}】</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-btn--area">
        <div
          class="cl-button cl-button--primary_notbg confirm"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleConfirm"
        >
          取消
        </div>
        <div
          class="cl-button cl-button--primary cancle"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleCancle"
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
    dialogInfo: {
      type: Object
    }
  },
  data() {
    return {
      dialogShow: true
    };
  },
  created() {
    if (this.dialogInfo.list.length) {
      this.dialogInfo.list.map(item => {
        return this.$set(
          item,
          "isChecked",
          item.wordsNum <= 4000 ? true : false
        );
      });
    }

    if (this.dialogInfo.languages.length) {
      this.dialogInfo.languages.map(item => {
        return this.$set(item, "isChecked", true);
      });
    }
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
    },
    hideSelf() {
      this.dialogShow = false;
    },
    _handleConfirm() {
      if (this.confirm) {
        this.$emit(this.confirm);
      } else {
        this.hideSelf();
      }
    },
    _handleCancle() {
      if (this.cancle) {
        this.$emit(this.cancle);
      } else {
        this.hideSelf();
      }
    },
    _handleChooseNewsItem(o) {
      if (o.wordsNum <= 4000) {
        o.isChecked = !o.isChecked;
      }
    },
    _handleChooseLanguagesItem(o) {
      o.isChecked = !o.isChecked;
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
        height: 154px;
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
</style>
