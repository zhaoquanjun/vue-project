<template>
  <div class="table-content" id="table-list">
    <el-table
      ref="multipleTable"
      :data="articlePageResult.list"
      :row-class-name="tableRowClassName"
      tooltip-effect="dark"
      class="content-table"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <template slot="empty">
        <div class="empty-table" @click="addArticle">
          <img src="~img/table-empty.png" />
          <p>添加数据</p>
        </div>
      </template>
      <el-table-column type="selection"></el-table-column>

      <el-table-column min-width="200" prop="name" label="产品标题">
        <template slot-scope="scope">
          <span class="isTop" v-show="scope.row.isTop">置顶</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.name"
            placement="top"
          >
            <span
              style="width:200px"
              class="ellipsis cursor-p"
              @click="preview(scope.row.id, scope.row.defaultSiteId)"
              >{{ scope.row.name }}</span
            >
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        prop="productCategoryList"
        min-width="100"
        label="分类"
        show-overflow-tooltip
      >
        <template slot="header">
          <span style="margin-right: 5px;">分类</span>
          <el-tooltip
            content="一个产品最多可属于5个分类"
            effect="dark"
            placement="right"
          >
            <i class="iconfont iconyiwen"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>
            <i
              v-for="(item, index) in scope.row.productCategoryList"
              :key="item.id"
            >
              {{ item.displayName }}
              <i
                v-if="
                  scope.row.productCategoryList.length > 1 &&
                    scope.row.productCategoryList.length - 1 != index
                "
                >,</i
              >
            </i>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="150"
        prop="updateTimeStr"
        sortable="custom"
        label="最后编辑时间"
      ></el-table-column>

      <el-table-column min-width="100" prop="isOnSell" label="状态">
        <template slot-scope="scope">
          <span style="padding-right: 8px;">{{
            scope.row.isOnSell ? '上架' : '下架'
          }}</span>
          <div
            class="el-switch"
            :class="{ 'is-checked': scope.row.isOnSell }"
            @click="batchSwitchStatus(scope.row, 3, scope.row.isOnSell)"
          ></div>
        </template>
      </el-table-column>

      <el-table-column
        prop="isPublishPrt"
        label="多语言"
        min-width="80"
        align="center"
        v-if="siteCountInfo.siteCount > 1"
      >
        <template slot-scope="scope">
          <div
            style="width: 100%; display: flex; justify-content: center; align-items: center;"
          >
            <span
              class="ellipsis"
              style="min-width: 50px; max-width: 100px; text-align: right;"
              >{{ scope.row.languageStr ? scope.row.languageStr : '' }}</span
            >
            <span
              class="translate-icon"
              :class="{
                disabled:
                  languagesList.length < 1 || scope.row.language != 'zh-CN'
              }"
              :data-language="scope.row.language"
              @mouseenter.stop="
                _handleMouseenterTranslate(
                  $event,
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
              @mouseleave.stop="
                _handleMouseleaveTranslte(
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
              @click.stop="
                _handleTranslateItem(
                  $event,
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
            >
              <ul
                v-show="scope.row.translateToolTip === ''"
                class="more-operate"
                :ref="'translateModal' + scope.row.index"
              >
                <li class="view-title">查看已翻译的文章</li>
                <li
                  class="view-item"
                  v-for="(item, index) in hasTranslateList"
                  :key="index"
                  @click="_handleViewTranslatedProduct(item)"
                >
                  {{ item.languageStr }}
                </li>
                <li
                  class="translate-tomore"
                  @click="_handleTranslateToMore(scope.row)"
                  v-show="hasTranslateList.length < languagesList.length"
                >
                  翻译为更多语言
                </li>
              </ul>
              <div
                class="ym-tooltips"
                :ref="'tooltip' + scope.row.index"
                v-show="scope.row.translateToolTip"
              >
                {{ scope.row.translateToolTip }}
                <div class="tooltips__arrow"></div>
              </div>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="置顶" min-width="50">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.isTop ? '置顶' : '未置顶'"
            placement="top"
          >
            <i
              class="iconfont iconzd1 cl-iconfont is-square"
              :class="{ 'is-active': scope.row.isTop }"
              @click="batchSwitchStatus(scope.row, 2, scope.row.isTop)"
            ></i>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="编辑" min-width="50">
        <template slot-scope="scope">
          <i
            class="iconfont iconbianji cl-iconfont is-square"
            @click="handleEdit(scope.row)"
          ></i>
        </template>
      </el-table-column>

      <el-table-column
        min-width="50"
        label="操作"
        v-if="$store.state.dashboard.isContentwrite"
      >
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
            <button
              class="more-operate"
              @click.stop="_handleShowMoreOperate($event, scope.row)"
            >
              <i class="iconfont iconsangedian cl-iconfont is-square"></i>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="cl-paganation pageing"
      :class="{ noJumper: articlePageResult.totalPage <= 10 }"
    >
      <el-pagination
        v-if="articlePageResult.totalRecord > 0"
        background
        :layout="
          articlePageResult.totalPage > 10
            ? 'total, slot, sizes, prev, pager, next,jumper'
            : 'total, slot, sizes, prev, pager, next'
        "
        :total="articlePageResult.totalRecord"
        :page-size="articlePageResult.pageSize"
        :page-sizes="[10, 20, 50]"
        @current-change="changePageNum"
        @size-change="changePageSize"
      >
        <div class="sizes-title">，每页显示</div>
        <button v-if="articlePageResult.totalPage > 10" class="paging-confirm">
          跳转
        </button>
      </el-pagination>
    </div>
    <ul
      v-show="isOperateSectionShow"
      class="operate-section"
      ref="operateSection"
    >
      <li
        class="operate-item"
        v-for="(it, index) in operateList"
        :key="index"
        @click="handleMoreOperate(it.flag)"
      >
        {{ it.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import * as productManageApi from '@/api/request/productManageApi'
export default {
  props: [
    'articlePageResult',
    'articleSearchOptions',
    'languagesList',
    'siteCountInfo'
  ],

  data() {
    return {
      defaultImg: require('img/content-default-pic.png'),
      multipleSelection: [],
      operateList: [
        { name: '移动', flag: 'move' },
        { name: '复制', flag: 'copy' },
        { name: '下线', flag: 'isOnSell' },
        { name: '置顶', flag: 'stick' },
        { name: '翻译', flag: 'translate' },
        { name: '删除', flag: 'delete' }
      ],
      row: '',
      tableHeight: 500,
      loadingShow: true,
      tableData: '',
      isOperateSectionShow: false,
      hasTranslateList: [],
      timer: null
    }
  },
  mounted() {
    this.tableData = this.articlePageResult
    document.addEventListener('click', () => {
      this.$nextTick(() => {
        this.isOperateSectionShow = false
      })
    })
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.tableHeight = window.innerHeight - 260
      })
      this.tableHeight = window.innerHeight - 260
    })
    window.onImgError = (ele) => {
      ele.src = ele.attributes['src'] = this.defaultImg
    }
  },
  methods: {
    // 给行添加索引
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    _handleViewTranslatedProduct(o, row) {
      this.preview(o.id, row.defaultSiteId)
    },
    _handleTranslateToMore(row) {
      this.$emit('handleGetSignalTranslateSource', row, this.hasTranslateList)
    },
    _handleTranslateItem(e, row, type) {
      if (type) return
      if (this.languagesList.length < 1) return false
      if (this.hasTranslateList.length > 0) {
        if (
          this.hasTranslateList.length === 1 &&
          this.languagesList.length === 1
        )
          this._handleViewTranslatedProduct(
            this.hasTranslateList[0],
            row.defaultSiteId
          )
      } else {
        this.$emit('handleGetSignalTranslateSource', row)
      }
    },
    // 鼠标进入翻译icon
    _handleMouseenterTranslate(e, row, type) {
      this.timer && clearTimeout(this.timer)
      if (type) return false
      if (this.languagesList.length > 0) {
        this.timer = setTimeout(async () => {
          let { data } = await productManageApi.productTranslateStatus(row.id)
          this.hasTranslateList = data
          if (data.length === 0) {
            this.articlePageResult.list[row.index].translateToolTip =
              '点击翻译产品'
            setTimeout(() => {
              if (this.$refs['tooltip' + row.index]) {
                this.$refs['tooltip' + row.index].style.left =
                  e.target.getBoundingClientRect().left -
                  this.$refs['tooltip' + row.index].clientWidth / 2 +
                  10 +
                  'px'
                this.$refs['tooltip' + row.index].style.top =
                  e.target.getBoundingClientRect().top +
                  e.target.getBoundingClientRect().height -
                  70 +
                  'px'
              }
            })
          }
          if (data.length === 1) {
            if (this.languagesList.length === 1) {
              this.articlePageResult.list[row.index].translateToolTip =
                '查看已翻译的产品'
              setTimeout(() => {
                if (this.$refs['tooltip' + row.index]) {
                  this.$refs['tooltip' + row.index].style.left =
                    e.target.getBoundingClientRect().left -
                    this.$refs['tooltip' + row.index].clientWidth / 2 +
                    10 +
                    'px'
                  this.$refs['tooltip' + row.index].style.top =
                    e.target.getBoundingClientRect().top +
                    e.target.getBoundingClientRect().height -
                    70 +
                    'px'
                }
              })
            }
            if (this.languagesList.length > 1) {
              this.articlePageResult.list[row.index].translateToolTip = ''
              this.hasTranslateList = data
              if (this.$refs['translateModal' + row.index]) {
                this.$refs['translateModal' + row.index].style.left =
                  e.target.getBoundingClientRect().left +
                  e.target.getBoundingClientRect().width / 2 +
                  'px'
                this.$refs['translateModal' + row.index].style.top =
                  e.target.getBoundingClientRect().top +
                  e.target.getBoundingClientRect().height +
                  6 +
                  'px'
              }
            }
          }
          if (data.length > 1) {
            this.articlePageResult.list[row.index].translateToolTip = ''
            this.hasTranslateList = data
            if (this.$refs['translateModal' + row.index]) {
              this.$refs['translateModal' + row.index].style.left =
                e.target.getBoundingClientRect().left +
                e.target.getBoundingClientRect().width / 2 +
                'px'
              this.$refs['translateModal' + row.index].style.top =
                e.target.getBoundingClientRect().top +
                e.target.getBoundingClientRect().height +
                6 +
                'px'
            }
          }
        }, 200)
      }
    },
    _handleMouseleaveTranslte(row, type) {
      if (type) return false
      if (this.languagesList.length < 1) return false
      this.hasTranslateList = []
      this.$refs['translateModal' + row.index].translateToolTip = ''
      if (this.$refs['translateModal' + row.index]) {
        this.$refs['translateModal' + row.index].style.left = '-300%'
        this.$refs['translateModal' + row.index].style.top = '-300%'
      }
      if (this.$refs['tooltip' + row.index]) {
        this.$refs['tooltip' + row.index].style.left = '-300%'
        this.$refs['tooltip' + row.index].style.top = '-300%'
      }
    },
    _handleGetMoreTranslateSource() {
      this.$emit('handleGetMoreTranslateSource')
    },
    changePageNum(page) {
      this.articleSearchOptions.pageIndex = page
      this.$emit('contentTableList')
    },
    changePageSize(size) {
      this.articleSearchOptions.pageSize = size
      this.$emit('contentTableList')
    },
    sortByTopStatus: function(column) {
      // descending ascending
      this.articleSearchOptions.OrderByTopOrder =
        column.order == 'ascending'
          ? true
          : column.order == 'descending'
          ? false
          : null
      this.$emit('contentTableList')
    },
    /**
     * 单选或全选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    getCheckArr() {
      let checkArr = this.multipleSelection // multipleSelection存储了勾选到的数据
      let params = []
      checkArr.forEach(function(item) {
        params.push(item.id) // 添加所有需要删除数据的id到一个数组，post提交过去
      })
      return params
    },
    // 新增产品
    addArticle() {
      this.$emit('addArticle')
    },
    /**
     * 编辑文章
     */
    handleEdit(row) {
      console.log(row)
      this.$emit('handleEditArticle', row)
    },
    _handleShowMoreOperate(ev, row) {
      this.row = row
      this.operateList = [
        { name: '移动', flag: 'move' },
        { name: '复制', flag: 'copy' },
        { name: '删除', flag: 'delete' }
      ]
      this.$refs.operateSection.style.right =
        document.documentElement.clientWidth - ev.pageX + ev.offsetX + 'px'
      this.$refs.operateSection.style.top = ev.pageY - ev.offsetY - 160 + 'px'

      // if (this.$refs.operateSection.style.display == "block") {
      //     this.$refs.operateSection.style.display = "none";
      // } else {
      //     this.$refs.operateSection.style.display = "block";
      // }
      this.isOperateSectionShow = !this.isOperateSectionShow
    },

    /**
     * 删除操作 | 上线架
     */
    batchSwitchStatus(row, type, flag) {
      let options = {
        switchType: type,
        flag: flag,
        idList: []
      }

      if (row == null || row == undefined) {
        options.idList = this.getCheckArr()
        this.$emit('batchSwitchStatus', options)
      } else {
        options.idList.push(row.id)
        this.$emit('batchSwitchStatus', options)
      }
    },

    /**
     * 复制 操作
     */
    batchCopy(row, type) {
      this.$emit('batchMove', type)
    },
    handleMoreOperate(flag) {
      this.clearSelection()
      let row = this.row
      switch (flag) {
        case 'move':
          this.$emit('moveClassify', row, flag)
          break
        case 'copy':
          this.$emit('moveClassify', row, flag)
          break
        case 'isOnSell':
          this.batchSwitchStatus(row, 3, row.isOnSell)
          break
        case 'stick':
          this.batchSwitchStatus(row, 2, row.isTop)
          break
        case 'translate':
          this._handleGetMoreTranslateSource()
          break
        case 'delete':
          this.batchSwitchStatus(row, 1, !row.isDelete)
          break
      }
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    //创建时间排序
    sortChange(row) {
      if (row.order == 'ascending') {
        this.articleSearchOptions.isDescending = false
      } else {
        this.articleSearchOptions.isDescending = true
      }
      this.$emit('contentTableList')
    },
    /**
     * 预览
     */
    async preview(previewId, siteId) {
      let { data } = await productManageApi.GetContentPrevAddress(
        'ProductDetail',
        siteId
      )
      var prevAddress = data
      if (prevAddress) {
        //var a = document.createElement('a');
        //a.setAttribute('href', prevAddress + previewId + '.html');
        //a.setAttribute('target', '_blank');
        //a.click();
        let newWindow = window.open()
        newWindow.location.href = prevAddress + previewId + '.html'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/content-manage/manege-table.scss';
.operate-section {
  display: block;
}
.title-color {
  color: #262626;
}

.translate-icon {
  margin-top: -2px;
  margin-left: 8px;
  display: inline-block;
  width: 25px;
  min-width: 25px;
  height: 20px;
  cursor: pointer;
  background: url('~img/content-icon/translate_icon.png') no-repeat center
    center;
  background-size: 100% 100%;

  .more-operate {
    position: fixed;
    left: -300%;
    top: -300%;
    transform: translateX(-50%);
    visibility: hidden;
    width: 140px;
    background: $--color-white;
    color: $--color-text-primary;
    box-shadow: $--box-shadow-base;
    z-index: -1;

    li {
      text-align: center;
      cursor: pointer;

      &:hover {
        color: $--color-primary;
        background-color: $--background-color-hover;
      }
    }

    li:first-of-type {
      cursor: default;
      font-size: $--font-size-small;

      &:hover {
        color: $--color-text-primary;
        background-color: $--color-white;
      }
    }

    .view-title,
    .translate-tomore {
      font-size: $--font-size-small;
      padding: 8px 16px;
    }

    .view-item {
      font-size: $--font-size-small;
      padding: 6px 16px;
    }

    &::after {
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-bottom: 5px solid $--color-white;
    }
  }

  .ym-tooltips {
    position: fixed;
    left: -100%;
    top: -100%;
    margin-bottom: 12px;
    padding: 10px;
    font-size: 12px;
    line-height: 1.2;
    min-width: 10px;
    word-wrap: break-word;
    background: #303133;
    color: #fff;
    transform-origin: center bottom;
    z-index: 2060;
    border-radius: 4px;

    &::after {
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      content: ' ';
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-top: 5px solid #303133;
    }
  }
}

.translate-icon[data-language='zh-CN']:hover {
  .more-operate {
    visibility: visible;
    z-index: 1999;
  }
}

.is-active {
  color: $--color-primary;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.7;
  filter: Alpha(opacity=70);
}

.el-switch {
  position: relative;
  width: 27px;
  height: 16px;
  border-radius: 10px;
  background-color: #dcdfe6;
  cursor: pointer;

  &::after {
    position: absolute;
    left: 60%;
    display: block;
    content: '';
    margin-left: -15px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
  }
}

.el-switch.is-checked {
  background-color: $--color-primary;

  &::after {
    left: 100%;
  }
}

.el-table /deep/ .ascending .sort-caret.ascending {
  border-bottom-color: $--color-primary;
}
.el-table /deep/ .descending .sort-caret.descending {
  border-top-color: $--color-primary;
}
.table-content /deep/ .el-table__empty-text {
  width: 100%;
}
</style>
