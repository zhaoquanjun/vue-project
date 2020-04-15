<template>
  <el-container id="content-manage">
    <el-aside class="tree-aside">
      <h4 class="pic-type-title">
        <span>产品分类</span>
      </h4>
      <m-tree
        ref="myTree"
        :is-product="true"
        :tree-result="treeResult"
        :list-options="productSearchOptions"
        :siteCountInfo="siteCountInfo"
        @create="newCategory"
        @batchRemove="batchRemoveCategory"
        @rename="updateCategory"
        @getList="contentTableList"
        @modifyNode="modifyNodeCategory"
        @chooseCategoryNode="chooseCategoryNode"
      ></m-tree>
    </el-aside>
    <el-main>
      <content-header
        v-if="$store.state.dashboard.isContentwrite"
        :count="count"
        :article-search-options="productSearchOptions"
        :is-batch-header-show="isBatchHeaderShow"
        :idsList="idsList"
        :siteCountInfo="siteCountInfo"
        :languageCount="languageCount"
        @contentTableList="contentTableList"
        @addArticle="addArticle"
        @batchSwitchStatus="batchSwitchStatus"
        @batchMove="batchMoveNews"
        @handleGetMoreTranslateSource="handleGetMoreTranslateSource"
        :selectedListLanguageLen="selectedListLanguageLen"
      ></content-header>
      <el-main>
        <content-table
          ref="table"
          v-if="articlePageResult !== null"
          :article-page-result="articlePageResult"
          :article-search-options="productSearchOptions"
          :tree-result="treeResult"
          :languages-list="languagesList"
          :siteCountInfo="siteCountInfo"
          @addArticle="addArticle"
          @contentTableList="contentTableList"
          @batchMove="batchMoveNews"
          @batchSwitchStatus="batchSwitchStatus"
          @handleEditArticle="handleEditArticle"
          @moveClassify="moveClassify"
          @handleSelectionChange="handleSelectionChange"
          @handleGetSignalTranslateSource="handleGetSignalTranslateSource"
          @handleGetMoreTranslateSource="handleGetMoreTranslateSource"
          @changeSelectedLanguage="changeSelectedLanguage"
        ></content-table>

        <el-dialog
          width="0"
          style="z-index:10"
          :close-on-click-modal="false"
          :show-close="false"
          :visible.sync="isInvitationPanelShow"
          :destroy-on-close="true"
        >
          <right-pannel
            :style="{ width: isInvitationlWidth + 'px' }"
            @closeRightPanel="cancelUpdateCategory"
          >
            <!-- 分类设置 -->
            <span slot="title-text">分类设置</span>

            <template v-if="clickType === 'permission'">
              <div class="category-content">
                <span name="cur-tip">{{
                  switchVal ? '仅登录用户可访问' : '全部用户可访问'
                }}</span>
              </div>

              <el-switch v-model="switchVal"></el-switch>
            </template>
            <template v-else>
              <div class="category-content">
                <span name="cur-tip">{{ tipText }}</span>
                <!-- 移动至 -->
              </div>
              <CheckTree
                v-if="isInvitationPanelShow"
                ref="checkTree"
                :isright-pannel="true"
                :language="selectedLanguage"
                :tree-result="treeResult"
                @chooseNode="chooseNode"
              ></CheckTree>
            </template>
            <div slot="footer" class="pannel-footer">
              <Debounce :time="1000" !isDebounce>
                <button
                  @click="updateCategoryArticle"
                  class="cl-button cl-button--small cl-button--primary"
                >
                  确定
                </button>
              </Debounce>
              <button
                @click="cancelUpdateCategory"
                class="cl-button cl-button--small cl-button--primary_notbg"
              >
                取消
              </button>
            </div>
          </right-pannel>
        </el-dialog>

        <!-- 翻译部分 start -->
        <dialog-info-modal
          :infoModal="infoModal"
          @goEdit="goEdit"
          @close="close"
          ref="infoModal"
        ></dialog-info-modal>
        <!-- <dialog-translate-checked-modal
      :checkModal="checkModal"
    ></dialog-translate-checked-modal> -->
        <dialog-translate-language-modal
          :languageModal="languageModal"
          ref="languageModal"
          @languageConfirm="languageConfirm"
        ></dialog-translate-language-modal>
        <dialog-translate-progress-modal
          ref="progressModal"
          :progressInfo="progressInfo"
        ></dialog-translate-progress-modal>
        <dialog-translate-language-modal
          :languageModal="languageModal"
          ref="languageModal"
          @languageConfirm="languageConfirm"
        ></dialog-translate-language-modal>
        <!-- 翻译部分 end -->
      </el-main>
    </el-main>
  </el-container>
</template>
<script>
import MTree from './CategoryTree'
import CheckTree from './CheckTree'
//import MTree from "@/components/common/MTree";
import ContentHeader from './ProductHeader'
import ContentTable from './ProductTable'
import RightPannel from '@/components/common/RightPannel'
import * as dashboardApi from '@/api/request/dashboardApi'
import * as productManageApi from '@/api/request/productManageApi'
import * as productCategoryManageApi from '@/api/request/productCategoryManageApi'
import DialogInfoModal from '@/components/translate/dialog-info-modal'
import DialogTranslateLanguageModal from '@/components/translate/dialog-translate-language-modal'
import DialogTranslateProgressModal from '@/components/translate/dialog-translate-progress-modal'

export default {
  components: {
    MTree,
    CheckTree,
    ContentHeader,
    ContentTable,
    RightPannel,
    DialogInfoModal,
    DialogTranslateLanguageModal,
    DialogTranslateProgressModal
  },
  data() {
    return {
      clickType: '', // 选择的是那种类型  移动 | 复制 ……
      panelTitle: '分类设置', // 右侧面板提示title
      tipText: '移动至',
      switchVal: true, // 是否仅登录用户可看
      articlePageResult: null,
      treeResult: null,
      curArticleInfo: '',
      moveToClassiFy: '',
      selectCategory: { id: 0, language: 'zh-CN' },
      count: 0,
      list: [],
      idsList: [],
      isInvitationPanelShow: false,
      realSearchOptions: {
        pageSize: 10, //11
        pageIndex: 1, //1
        orderByType: 'language', //1 创建时间 2:名字
        isDescending: true, // 倒叙 或 正序
        keyword: '', //1
        isDelete: false, //1
        isOnSell: null, //is 上架
        categoryIdList: [], //1,
        isTop: null
      },
      virtualSearchOptions: {
        pageSize: 10, //11
        pageIndex: 1, //1
        orderByType: 'language', //1 创建时间 2:名字
        isDescending: true, // 倒叙 或 正序
        keyword: '', //1
        isDelete: false, //1
        isOnSell: null, //is 上架
        language: 'zh-CN',
        isTop: null
      },
      curRow: null,
      infoModal: {
        title: '提示',
        type: 'fail',
        content: `<p class="lineheight26 fontsize14" style="text-indent: -7px;">【阿里云AI翻译】单次最多支持约4000字符。当前产品字符已超限，请重新选择或删减产品后重试。</p>`,
        btn: {
          btn1Text: '关闭',
          btn2Text: '去修改'
        },
        additional: { words: '', operate: '' }
      },
      progressInfo: {
        title: '自动翻译等待',
        progress: 0
      },
      languageModal: {
        title: '',
        isNews: false,
        total: 5,
        enable: 4,
        tree: [],
        languages: [],
        list: [],
        type: 'signal'
      },
      source: null,
      type: 'signal',
      foreignLanguages: [],
      siteCountInfo: {
        siteCount: 2,
        initTypeCount: 2
      },
      languageCount: 1,
      signalSelectedLanguage: ''
    }
  },
  mounted() {
    this._getSiteCount()
    this.getTree()
    this.contentTableList()
  },
  created() {
    this.keyupEnter()
  },
  computed: {
    isInvitationlWidth() {
      return this.isInvitationPanelShow === true ? 331 : 0
    },
    isBatchHeaderShow() {
      return this.idsList.length > 0 ? true : false
    },
    translateTree: {
      get: function() {
        let arr = JSON.parse(JSON.stringify(this.treeResult))
        if (arr.length > 0) {
          for (var i = 0; i < arr[0].children.length; i++) {
            const item = arr[0].children[i]
            if (item.language === 'zh-CN') {
              arr[0].children.splice(i, 1)
            }
          }
        }
        return arr[0].children
      },
      set: function() {}
    },
    languagesList: {
      get: function() {
        let arr = []
        if (
          this.treeResult &&
          this.treeResult[0] &&
          this.treeResult[0].children.length > 0
        ) {
          for (var i = 0; i < this.treeResult[0].children.length; i++) {
            const item = this.treeResult[0].children[i]
            if (item.language != 'zh-CN') {
              const obj = {}
              obj.languages = item.language
              obj.label = item.label
              arr.push(obj)
            }
          }
        }
        return arr
      },
      set: function() {}
    },
    productSearchOptions: {
      get: function() {
        let options
        if (this.selectCategory.id >= 0) {
          options = this.realSearchOptions
        } else {
          options = this.virtualSearchOptions
        }
        return options
      },
      set: function() {}
    },
    // 多选选中的语言数量
    selectedListLanguageLen: {
      get: function() {
        let arr = []
        if (this.list.length > 0) {
          for (var i = 0; i < this.list.length; i++) {
            if (
              this.list[i].language != this.selectCategory.language &&
              arr.indexOf(this.list[i].language) < 0
            ) {
              arr.push(this.list[i].language)
            }
          }
        }
        return arr.length
      },
      set: function() {}
    },
    selectedLanguage: {
      get: function() {
        let lan =
          this.selectCategory.id === 0 && this.signalSelectedLanguage
            ? this.signalSelectedLanguage
            : this.selectCategory.language
        return lan
      },
      set: function() {}
    }
  },
  methods: {
    // 翻译部分 start
    async _getSiteCount() {
      let { data, status } = await dashboardApi.getSiteCount()
      if (status === 200) {
        this.siteCountInfo.siteCount = data.siteCount
        this.siteCountInfo.initTypeCount = data.hasInitializedSiteCount
      }
    },
    /**
     * 编辑/修改
     */
    goEdit() {
      this.handleEditArticle(this.curRow)
    },
    /**
     * 获取翻译失败的列表
     */
    _getFailedList(data) {
      var str = ''
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          str += `<li><span style="display: inline-block;width: 17%;" class="lineheight26 attention ellipsis">（失败）</span><span class="lineheight26 ellipsis" style="display: inline-block;max-width: calc(35% - 16px);">${data[i].sourceEntityDesc}</span><span class="lineheight26 attention ellipsis" style="display: inline-block;margin-left: 16px; max-width: 61%;">${data[i].errorMsg}</span></li>`
        }
      }
      return str
    },
    /**
     * 获取可以翻译的产品列表
     */
    _checkEnableTranslateItem(data) {
      const o = {}
      let arr = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].contentLength < 4000) {
          arr.push(data[i])
        }
      }
      o.total = data.length
      o.enable = arr.length
      return o
    },
    /**
     * 单语言翻译
     */
    async _handleTranslateSingnalLanguages(options, obj) {
      let { data } = await productManageApi.translateSignalProduct(options)
      this._getTranslateProcess(data, 1, obj)
    },
    /**
     * 多语言翻译
     */
    async _handleTranslateMoreLanguages(options, obj) {
      let { data } = await productManageApi.translateMoreProduct(options)
      this._getTranslateProcess(data, 1, obj)
    },
    /**
     * 获取翻译进度
     */
    async _getTranslateProcess(id, count, obj) {
      const num = obj.list.length
      this.progressInfo.progress = 0
      this.$refs.progressModal.showSelf()
      let { data } = await productManageApi.getProductTranslateProcess(id)
      if (data.isExist) {
        // 弹出翻译进度弹窗
        const res = data.cacheInfo
        if (res.progressPercent < 1) {
          count++
          setTimeout(() => {
            this.progressInfo.progress = Number(res.progressPercent) * 100
            this._getTranslateProcess(id, count, obj)
          }, 2000)
        }
        if (res.progressPercent === 1 && count > 1) {
          this.progressInfo.progress = Number(res.progressPercent) * 100
          setTimeout(() => {
            // 隐藏弹窗
            if (res.failedList.length > 0) {
              if (
                parseInt(obj.languagesList.length) * parseInt(num) >
                res.failedList.length
              ) {
                this.infoModal.title = '完成'
                this.infoModal.type = 'success'
                this.infoModal.content = `<p class='lineheight26'>部分产品翻译成功！</p><p class='lessattention lineheight26'>机器翻译结果存在误差，可能需要您手动订正。</p><ul style="margin-top: 8px; margin-left: -7px; min-width: 300px;">${this._getFailedList(
                  res.failedList
                )}</ul>`
              } else {
                this.infoModal.title = '失败'
                this.infoModal.type = 'fail'
                this.infoModal.content = `<p class='lineheight26'>产品翻译失败！</p><ul style="min-width: 300px; margin-left: -7px;">${this._getFailedList(
                  res.failedList
                )}</ul>`
              }
            } else {
              this.infoModal.title = '完成'
              this.infoModal.type = 'success'
              this.infoModal.content =
                "<p class='lineheight26'>产品翻译成功！</p><p class='lessattention lineheight26'>机器翻译结果存在误差，可能需要您手动订正。</p>"
            }
            this.$refs.progressModal.hideSelf()
            this.infoModal.btn.btn2Text = '关闭'
            this.infoModal.btn.btn2Operate = 'close'
            if (
              obj.languagesList.length === 1 &&
              num === 1 &&
              res.failedList.length === 0
            ) {
              this.infoModal.btn.btn1Text = '编辑'
              this.infoModal.btn.btn1Operate = 'goEdit'
              this.infoModal.additional.words = '进入编辑'
              this.infoModal.additional.operate = 'goEdit'
              if (res.lastTranslatedEntityInfo) {
                this.curRow.id = res.lastTranslatedEntityInfo.Id
                this.curRow.categoryId = res.lastTranslatedEntityInfo.CategoryId
                this.curRow.categoryName =
                  res.lastTranslatedEntityInfo.CategoryName
              }
              this.curRow.language = obj.languagesList[0]
            } else {
              this.infoModal.btn.btn1Text = ''
              this.infoModal.btn.btn1Operate = ''
              this.infoModal.additional.words = ''
              this.infoModal.additional.operate = ''
            }
            this.getTree()
            this.getArticleListAsync()
            this.$refs.infoModal.showSelf()
          }, 1000)
        }
        if (res.progressPercent === 1 && count === 1) {
          this.progressInfo.progress = 100
          setTimeout(() => {
            // 隐藏弹窗
            this.$refs.progressModal.hideSelf()
            this.infoModal.title = '完成'
            this.infoModal.type = 'success'
            this.infoModal.content =
              "<p class='lineheight26'>产品翻译成功！</p><p class='lessattention lineheight26'>机器翻译结果存在误差，可能需要您手动订正。</p>"
            this.infoModal.btn.btn2Text = '关闭'
            this.infoModal.btn.btn2Operate = 'close'
            if (num === 1) {
              this.infoModal.btn.btn1Text = '编辑'
              this.infoModal.btn.btn1Operate = 'goEdit'
              this.infoModal.additional.words = '进入编辑'
              this.infoModal.additional.operate = 'goEdit'
              if (res.lastTranslatedEntityInfo) {
                this.curRow.id = res.lastTranslatedEntityInfo.Id
                this.curRow.categoryId = res.lastTranslatedEntityInfo.CategoryId
                this.curRow.categoryName =
                  res.lastTranslatedEntityInfo.CategoryName
              }
              this.curRow.language = obj.languagesList[0]
            }
            if (num > 1) {
              this.infoModal.btn.btn1Text = ''
              this.infoModal.btn.btn1Opetate = ''
              this.infoModal.additional.words = '关闭弹窗'
              this.infoModal.additional.operate = 'close'
            }
            this.getTree()
            this.getArticleListAsync()
            this.$refs.infoModal.showSelf()
          }, 1000)
        }
      } else {
        if (count < 8) {
          count++
          setTimeout(() => {
            this._getTranslateProcess(id, count, obj)
          }, 2000)
        } else {
          this.$refs.progressModal.hideSelf()
          this.infoModal.title = '失败'
          this.infoModal.type = 'fail'
          this.infoModal.content = '连接超时，翻译失败，请稍后再试'
          this.infoModal.btn.btn1Text = ''
          this.infoModal.btn.btn2Text = '关闭'
          this.infoModal.additional.words = '关闭弹窗'
          this.infoModal.additional.operate = 'close'
          this.$refs.infoModal.showSelf()
        }
      }
    },
    /**
     * 获取单个翻译信息
     */
    handleGetSignalTranslateSource(row, translatedIds) {
      this.curRow = row
      if (row.contentLength > 4000) {
        this.infoModal.title = '提示'
        this.infoModal.type = 'fail'
        this.infoModal.content = `<p class="lineheight26 fontsize14" style="text-indent: -7px;">【阿里云AI翻译】单次最多支持约4000字符。当前产品字符已超限，请重新选择或删减产品后重试。</p>`
        this.infoModal.btn.btn1Text = '关闭'
        this.infoModal.btn.btn1Operate = 'close'
        this.infoModal.btn.btn2Text = '去修改'
        this.infoModal.btn.btn2Operate = 'goEdit'
        this.infoModal.additional.words = '关闭弹窗'
        this.infoModal.additional.operate = 'close'
        this.$refs.infoModal.showSelf()
      } else {
        this.type = 'signal'
        this.source = [row]
        this._getForeigns(translatedIds)
      }
    },
    /**
     * 获取批量翻译信息
     */
    handleGetMoreTranslateSource() {
      if (this.languageCount === 2) return
      this._checkIsHasTranslateProcess(data => {
        if (data) {
          this.infoModal.title = '失败'
          this.infoModal.type = 'fail'
          this.infoModal.content =
            '当前存在翻译任务，请完成已经存在的任务后再进行翻译'
          this.infoModal.btn.btn1Text = ''
          this.infoModal.btn.btn2Text = '关闭'
          return false
        } else {
          this.type = 'more'
          this.source = this._getChineseList()
          let obj = this._checkEnableTranslateItem(this.source)
          this.languageModal.total = obj.total
          this.languageModal.enable = obj.enable
          this._getForeigns()
        }
      })
    },
    // 获取多选的语种类型数量
    _getSelectedListLanguageNum(list) {
      let flag = true
      for (var i = 0; i < list.length; i++) {
        if (list[i].language !== 'zh-CN') {
          flag = false
        }
      }
      this.languageCount = flag ? 1 : 2
    },
    /**
     * 获取可翻译外文（与已经翻译过的去重）
     */
    _getForeigns(ids) {
      this._getTranslateIds(this.languagesList, ids)
      if (this.foreignLanguages.length > 1) {
        this.languageModal.title = '翻译至语言'
      } else {
        this.languageModal.title = '保存至'
      }
      this.languageModal.siteCount = this.siteCountInfo.siteCount
      this.languageModal.languages = this.foreignLanguages
      this.languageModal.list = this.source
      this.languageModal.tree = this.translateTree
      this.languageModal.type = this.type
      console.log(this.languageModal)
      this.$refs.languageModal.showSelf()
    },
    /**
     * 获取所有可以翻译的中文数据
     */
    _getChineseList() {
      let arr = []
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].language === 'zh-CN') {
          arr.push(this.list[i])
        }
      }
      return arr
    },
    /**
     * 获取要翻译到的外文站点
     */
    _getTranslateIds(data, ids) {
      this.foreignLanguages = []
      let item = {}
      let flag = true
      for (var i = 0; i < data.length; i++) {
        if (ids && ids.length > 0) {
          for (var k = 0; k < ids.length; k++) {
            if (ids[k].language === data[i].languages) {
              flag = false
            }
          }
          if (flag) {
            item.languages = data[i].languages
            item.label = data[i].label
            this.foreignLanguages.push(item)
          }
        } else {
          item.languages = data[i].languages
          item.label = data[i].label
          this.foreignLanguages.push(item)
        }
        item = {}
        flag = true
      }
    },
    /**
     * 检验是否存在翻译进程
     */
    async _checkIsHasTranslateProcess(callback) {
      let { data, status } = await productManageApi.isHasTranslateProcess()
      if (status === 200) {
        typeof callback === 'function' && callback(data)
      }
    },
    /**
     * 信息弹框关闭操作
     */
    close() {
      this.$refs.infoModal.stopIntervalEvent()
      this.$refs.infoModal.hideSelf()
    },
    /**
     * 语言弹框确认操作
     */
    async languageConfirm(obj) {
      let options = {
        FromIdList: obj.list,
        SiteId: this.$store.state.dashboard.siteId,
        CategoryId: obj.id
      }
      if (obj.languagesList.length === 1) {
        options.TargetLanguage = obj.languagesList[0]
      }
      if (obj.languagesList.length > 1) {
        options.TargetLanguage = obj.languagesList
      }
      obj.languagesList.length > 1
        ? this._handleTranslateMoreLanguages(options, obj)
        : this._handleTranslateSingnalLanguages(options, obj)
    },
    // 列表增加设置项
    _setDataListAttribute(data) {
      for (var i = 0; i < data.length; i++) {
        this.$set(data[i], 'translateToolTip', '')
      }
    },
    // 翻译部分 end

    changeSelectedLanguage(language) {
      if (this.selectCategory.id === 0) {
        this.signalSelectedLanguage = language
      }
    },

    keyupEnter() {
      document.onkeydown = e => {
        if (e.keyCode === 13) {
          this.isInvitationPanelShow && this.updateCategoryArticle()
        }
      }
    },
    // zxb 获取table列表
    async contentTableList(options) {
      this.$Loading.show()
      let { data } = await productManageApi.getProductList(
        (options = this.productSearchOptions)
      )
      this.$Loading.hide()
      this.articlePageResult = data
      this.articlePageResult.list.forEach((item, index) => {
        item.createTimeStr = this.articlePageResult.list[
          index
        ].createTimeStr.split(' ')[0]
      })
      this._setDataListAttribute(this.articlePageResult.list)
    },
    // 批量删除 批量置顶 批量上下线
    async batchSwitchStatus(options) {
      let stateTip = ''
      let message = ''
      if (options.switchType === 1) {
        stateTip = `删除后，网站中引用的产品列表将不再显示该产品，是否确定删除？`
      } else if (options.switchType === 2) {
        message = options.flag ? '取消置顶' : '置顶'

        stateTip = '您确定要' + message + '产品吗？'
        options.flag = !options.flag
      } else if (options.switchType === 3) {
        message = options.flag ? '下架' : '上架'
        options.flag = !options.flag
        stateTip = '您确定要' + message + '产品吗？'
      } else if (options.switchType === 4) {
        message = !options.flag ? '全部' : '仅登录'
        options.flag = !options.flag
        stateTip = '您确定要设置' + message + '用户可访问吗？'
      }

      this.$confirm(stateTip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'medium',
        iconClass: 'icon-warning',
        callback: async action => {
          if (action === 'confirm') {
            let { status } = await productManageApi.batchSwitchStatus(options)
            if (status === 200) {
              // this.getTree();
              this.$notify({
                customClass: 'notify-success', //  notify-success ||  notify-error
                message: `成功!`,
                showClose: false,
                duration: 1000
              })
              if (options.switchType === 4) {
                this.isInvitationPanelShow = false
              }
              this.contentTableList()
            }
          }
        }
      })
    },
    // 批量移动分类
    async batchMoveNews(type) {
      this.isInvitationPanelShow = true
      this.clickType = type
      if (type === 'permission') {
        this.panelTitle = '访问权限'
      } else if (type === 'batchCopy') {
        this.tipText = '复制至'
      } else if (type === 'batchmove') {
        this.tipText = '移动至'
      }
    },
    //选择移动分类时的节点
    chooseNode(node) {
      this.moveToClassiFy = node
    },
    // 点击左侧分类树菜单时的节点
    chooseCategoryNode(data) {
      this.selectCategory = data
      if (data.id >= 0) {
        this.realSearchOptions.categoryIdList = this.getAllNodeIds(data)
      } else {
        this.virtualSearchOptions.language = data.language
      }
    },
    cancelUpdateCategory() {
      // this.$refs.checkTree.resetChecked(); // 清空选中的 树结构
      this.isInvitationPanelShow = false
    },
    // 获取所有选择节点
    getAllNodeIds(node, isChildNode) {
      var idList = isChildNode ? [] : [node.id]
      for (var i in node.children) {
        let child = node.children[i]
        idList.push(child.id)
        idList = idList.concat(this.getAllNodeIds(child, true))
      }
      return idList
    },
    moveClassify(data, flag) {
      this.clickType = ''
      if (flag === 'move') {
        this.tipText = '移动至'
      } else if (flag === 'copy') {
        this.tipText = '复制至'
      }
      this.isInvitationPanelShow = true
      this.curArticleInfo = data
      this.type = flag
      let ids = data.productCategoryList.map(item => item.id)
      this.$nextTick(() => {
        this.$refs.checkTree.setCheckedKeys(ids)
      })
    },
    // 点击确定按钮 移动 复制 更新产品分类
    async updateCategoryArticle(params) {
      //批量设置访问权限
      if (this.clickType === 'permission') {
        let options = {
          switchType: 4,
          flag: this.switchVal,
          idList: this.idsList
        }
        this.batchSwitchStatus(options)
        return
      }
      let checkNodes = this.$refs.checkTree.getCheckedNodes()
      //

      if (!checkNodes || checkNodes.length < 1) {
        let tipText =
          this.type === 'copy' || this.clickType === 'batchCopy'
            ? '复制'
            : '移动'
        this.$notify({
          customClass: 'notify-error', //  notify-success ||  notify-error
          message: `请选择${tipText}的分类!`,
          showClose: false,
          duration: 1500
        })
        return
      }
      if (checkNodes.length > 5) {
        this.$notify({
          customClass: 'notify-error', //  notify-success ||  notify-error
          message: `一个产品最多设置五个分类!`,
          showClose: false,
          duration: 1500
        })
        return
      }
      let categoryIdList = checkNodes.map(item => {
        return item.id
      })
      let cateIdsAry = []
      if (this.idsList.length >= 1) {
        cateIdsAry = this.idsList
      } else {
        let cateId = this.curArticleInfo.id
        cateIdsAry.push(cateId)
      }
      let options = {
        idList: cateIdsAry,
        categoryIdList: categoryIdList
      }
      // 复制
      if (this.type === 'copy' || this.clickType === 'batchCopy') {
        this.copy(options)
        return
      }
      // 移动
      this.move(options)
    },
    async move(options) {
      let { status } = await productManageApi.batchChangeCategory(options)
      if (status == 200) {
        this.$refs.checkTree.resetChecked() // 清空选中的 树结构

        this.$notify({
          customClass: 'notify-success', //  notify-success ||  notify-error
          message: `移动成功!`,
          showClose: false,
          duration: 1500
        })
        this.isInvitationPanelShow = false
        this.contentTableList()
      }
    },
    async copy(options) {
      let { data, status } = await productManageApi.copyBatchProduct(options)
      if (status == 200) {
        if (Array.isArray(options.idList) && options.idList.length > 1) {
          this.$notify({
            customClass: 'notify-success', //  notify-success ||  notify-error
            message: `批量复制成功!`,
            showClose: false,
            duration: 1000
          })
        } else {
          this.$confirm('复制成功是否前往编辑产品', '提示', {
            confirmButtonText: '立即前往',
            cancelButtonText: '暂不前往',
            type: 'success',
            customClass: 'medium',
            iconClass: 'icon-success',
            callback: async action => {
              if (action === 'confirm') {
                this.$router.push({
                  path: '/product/create',
                  query: {
                    id: data,
                    isEditor: 1
                  }
                })
              }
            }
          })
        }
        this.isInvitationPanelShow = false
        this.contentTableList()
        this.$refs.checkTree.resetChecked()
      }
    },

    async getArticleListAsync(options) {
      this.$Loading.show()
      let { data } = await productManageApi.getProductList(
        (options = this.productSearchOptions)
      )
      this.$Loading.hide()
      this.articlePageResult = data
      this._setDataListAttribute(this.articlePageResult.list)
    },
    /**
     * z 点击 全部分类 刷新树结构
     */
    resetCategoryId() {
      this.productSearchOptions.categoryIdList = []
      this.getArticleListAsync()
    },
    /**
     * 获取 tree 结构
     */
    async getTree() {
      let { data } = await productCategoryManageApi.get()
      this.treeResult = data.treeArray
      this.totalSum = data.totalSum
      this.$refs.myTree.selectCategoryByNodeId(this.selectCategory.id)
    },
    /**
     * z新增分类
     */
    async newCategory(entity) {
      await productCategoryManageApi.create(entity)
      this.getTree()
    },
    /**
     *z 更新 tree 分类
     */
    async updateCategory(id, newName, thumbnailPicUrl) {
      await productCategoryManageApi.update(id, newName, thumbnailPicUrl)
      this.getTree()
    },

    /**
     *z 删除分类
     */
    async batchRemoveCategory(idList) {
      this.$confirm(
        '若该分类下存在数据，删除后数据将自动移动到语言分类中，是否确认删除该分类？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'medium',
          iconClass: 'icon-warning',
          callback: async action => {
            if (action === 'confirm') {
              let { status } = await productCategoryManageApi.batchRemove(
                idList
              )
              if (status === 200) {
                this.getTree()
                this.$notify({
                  customClass: 'notify-success', //  notify-success ||  notify-error
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1500
                })
              }
            }
          }
        }
      )
    },
    /**
     * z 修改分类
     */
    async modifyNodeCategory(id, parentId, idOrderByArr) {
      await productCategoryManageApi.modifyNode(id, parentId, idOrderByArr)
      this.getTree()
    },
    /**获取编辑产品详情 */
    async getArticleDetail(id) {
      let { data } = await productManageApi.getArticleDetail(id)
      this.articleDetail = data
      this.articleDetail.NewId = data.id
      this.imageUrl = data.pictureUrl
    },
    /**
     * 获取多选的列表
     */
    handleSelectionChange(list) {
      this.idsList = []
      this.list = list
      this.count = list.length
      if (list.length < 1) return
      this._getSelectedListLanguageNum(list)
      list.forEach(item => {
        this.idsList.push(item.id)
      })
    },
    addArticle() {
      if (!this.selectCategory) {
        this.$router.push({
          path: '/product/create',
          query: {
            categoryName: this.treeResult[0].label || '全部分类',
            categoryId: this.treeResult[0].id || 0,
            language: this.treeResult[0].language || 'zn-CN'
          }
        })
      } else {
        this.$router.push({
          path: '/product/create',
          query: {
            categoryName:
              this.selectCategory.id && this.selectCategory.id > 0
                ? this.selectCategory.label || '全部分类'
                : '全部分类',
            categoryId:
              this.selectCategory.id && this.selectCategory.id > 0
                ? this.selectCategory.id
                : 0,
            language: this.selectCategory.language
          }
        })
      }
    },
    handleEditArticle(row) {
      this.$router.push({
        path: '/product/create',
        query: { id: row.id, isEditor: 1, language: row.language }
      })
    },
    /**
     * 关闭右侧面板
     */
    closeRightPanel() {
      this.isInvitationPanelShow = true
    },
    getIdsList() {
      return this.idList
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/contentDetail.scss';
</style>
