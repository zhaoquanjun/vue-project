<template>
  <el-header class="content-header">
    <template v-if="!isBatchHeaderShow">
      <div class="seachInput head-item">
        <el-input
          size="medium"
          v-model="articleSearchOptions.title"
          placeholder="请输入内容"
          @keyup.enter.native="searchEnterFun"
          class="input-with-select"
          style="width:200px;"
        >
          <i
            class="el-icon-search el-input__icon"
            style="cursor: pointer;color:#D7D8D9"
            slot="suffix"
            @click="getArticleList"
          ></i>
        </el-input>
      </div>

      <div class="head-item head-right">
        <div class="head-item head-handle-right">
          <span>状态</span>
          <span class="select-item">
            <el-select
              size="small"
              v-model="statusValue"
              placeholder="请选择"
              @change="changeStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.statusValue"
                :label="item.statusLabel"
                :value="item.statusValue"
              ></el-option>
            </el-select>
          </span>
          <span>置顶</span>
          <span class="select-item">
            <el-select
              size="small"
              v-model="topValue"
              placeholder="请选择"
              @change="changeStickStatus"
            >
              <el-option
                v-for="item in topOptions"
                :key="item.topValue"
                :label="item.topLabel"
                :value="item.topValue"
              ></el-option>
            </el-select>
          </span>
          <!-- <span>排序</span>
                    <span class="select-sort select-item">
                        <el-select
                            size="small"
                            v-model="orderValue"
                            placeholder="请选择"
                            @change="changeOrderCondition"
                        >
                            <el-option
                                v-for="item in orderOptions"
                                :key="item.orderValue"
                                :label="item.orderLabel"
                                :value="item.orderValue"
                            ></el-option>
                        </el-select>
                    </span> 
                    <button @click="switchIsDesc('dec')" class="desBtn">
                        <i class="iconfont iconxiayi" :class=" descSort ? 'desc-active-color': 'desc-regular-color' " ></i>
                    </button>
                    <button @click="switchIsDesc('asc')" class="desBtn" style="margin-left:8px">
                        <i class="iconfont iconshangyi" :class=" ascSort ? 'desc-active-color': 'desc-regular-color' " ></i>
                    </button> -->
        </div>
        <div class="head-item head-handle-btn">
          <button class="cl-button cl-button--primary" @click="addArticle">
            新增文章
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bach-header">
        <span>
          已选
          <i style="color:#fe9837;">{{ count }}</i> 个文章
        </span>
        <div class="bach-hanlder">
          <button
            class="cl-button cl-button--text_primary"
            @click="batchPublish(false)"
          >
            上线
          </button>
          <button
            class="cl-button cl-button--text_primary"
            @click="batchPublish(true)"
          >
            下线
          </button>
          <button class="cl-button cl-button--text_primary" @click="batchCopy">
            复制
          </button>
          <button
            v-show="selectedListLanguageLen === 0"
            class="cl-button cl-button--text_primary"
            @click="handleCommand('move')"
          >
            移动
          </button>
          <button
            class="cl-button cl-button--text_primary"
            @click="handleCommand('top')"
          >
            置顶
          </button>
          <button
            class="cl-button cl-button--text_primary"
            @click="handleCommand('cancelTop')"
          >
            取消置顶
          </button>
          <button
            v-show="
              siteCountInfo.siteCount > 1 && siteCountInfo.initTypeCount > 1
            "
            :class="{ disabled: languageCount > 1 }"
            class="cl-button cl-button--text_primary"
            @click="batchTranslate"
          >
            翻译
          </button>
          <button class="cl-button cl-button--text_danger" @click="batchRemove">
            删除
          </button>

          <!-- <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <button class="btn-small btn-notboard btn-black-notboard">
                                <i class="iconfont iconsangedian"></i>
                            </button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="move">移动</el-dropdown-item>
                            <el-dropdown-item command="top">置顶</el-dropdown-item>
                            <el-dropdown-item command="cancelTop">取消置顶</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
        </div>
      </div>
    </template>
  </el-header>
</template>
<script>
export default {
  props: [
    'articleSearchOptions',
    'isBatchHeaderShow',
    'count',
    'languageCount',
    'siteCountInfo',
    'selectedListLanguageLen'
  ],
  data() {
    return {
      ascSort: false,
      descSort: true,
      isShowTranslate: true,
      statusOptions: [
        {
          statusValue: '',
          statusLabel: '全部'
        },
        {
          statusValue: 'true',
          statusLabel: '上线'
        },
        {
          statusValue: 'false',
          statusLabel: '下线'
        }
      ],
      statusValue: '',
      topOptions: [
        {
          topValue: '',
          topLabel: '全部'
        },
        {
          topValue: 'true',
          topLabel: '是'
        },
        {
          topValue: 'false',
          topLabel: '否'
        }
      ],
      topValue: '',
      orderOptions: [
        {
          orderValue: 'createtime',
          orderLabel: '创建时间'
        }
      ],
      orderValue: 'createtime'
    }
  },
  methods: {
    getArticleList() {
      this.$emit('getArticleList')
    },
    searchEnterFun() {
      this.getArticleList()
    },
    changeStatus(value) {
      this.articleSearchOptions.publishStatus = value
      this.getArticleList()
    },
    changeOrderCondition(value) {
      this.articleSearchOptions.newsOrderColumns = value
      this.getArticleList()
    },
    changeStickStatus(value) {
      this.articleSearchOptions.topStatus = value
      this.getArticleList()
    },

    switchIsDesc(flag) {
      if (flag === 'asc') {
        this.ascSort = true
        this.descSort = !this.ascSort
        this.articleSearchOptions.isDescending = false
      } else {
        this.descSort = true
        this.ascSort = !this.descSort
        this.articleSearchOptions.isDescending = true
      }

      this.getArticleList()
    },
    importArticle() {
      // this.push({
      //     path:''
      // })
    },
    addArticle() {
      this.$emit('addArticle')
    },

    //////批量操作
    // 批量 上下架
    batchPublish(flag) {
      this.$emit('batchPublish', null, flag)
    },
    // 批量翻译
    batchTranslate() {
      this.$emit('handleGetMoreTranslateSource')
    },
    //批量删除
    batchRemove() {
      this.$emit('batchRemove')
    },

    // 批量置顶 or 取消置顶
    batchTop(flag) {
      this.$emit('batchTop', null, flag)
    },

    // 批量分类设置 移动  ok
    batchclassifySet() {
      this.$emit('changeOperateName', '移动')
      this.$emit('batchMove', null, true)
    },
    // 批量设置访问权限
    batchViewAuth() {
      this.$emit('batchMove', 'permission')
    },
    // 批量复制
    batchCopy() {
      this.$emit('changeOperateName', '复制')
      this.$emit('batchCopy', null, true)
    },
    handleCommand(command) {
      switch (command) {
        case 'move':
          this.batchclassifySet()
          break
        case 'top':
          this.batchTop(false)
          break
        case 'cancelTop':
          this.batchTop(true)
          break
        case 'permission':
          this.batchViewAuth()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/content-manage/manage-head.scss';

.btn-black-notboard {
  padding: 6px;
  &:hover {
    background: rgba(240, 243, 247, 1);
    border-radius: $--border-radius-base;
  }
}
.select-item {
  display: inline-block;
  width: 80px;
  box-sizing: border-box;
  height: 32px;
  margin: 0 16px 0 7px;
}
.select-sort {
  width: 117px;
}
.head-item {
  display: inline-block;
  flex: none;
}
.head-handle-btn {
  padding-left: 30px;
}

.head-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 200px);
  .head-handle-right {
    margin-left: 24px;
  }
  .add-article {
    background: rgba(1, 192, 222, 1);
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
}
.bach-hanlder {
  button {
    padding: 9px 16px;
    margin: 0;
    min-width: 60px;
  }
  .disabled {
    color: $--color-text-regular;
    cursor: not-allowed;
  }
}
</style>
