<template>
  <el-container id="content-manage" class="content-manage">
    <el-aside class="tree-aside">
      <h4 class="pic-type-title">
        <span>文章分类</span>
      </h4>
      <m-tree
        ref="myTree"
        :treeResult="treeResult"
        :list-options="articleSearchOptions"
        :isArticle="true"
        @chooseCategoryNode="chooseCategoryNode"
        @create="newCategory"
        @batchRemove="batchRemoveCategory"
        @rename="renameCategory"
        @getList="getArticleList"
        @modifyNode="modifyNodeCategory"
      ></m-tree>
    </el-aside>
    <el-main>
      <content-header
        v-if="$store.state.dashboard.isContentwrite"
        :count="count"
        :is-batch-header-show="isBatchHeaderShow"
        :article-search-options="articleSearchOptions"
        @handleGetMoreTranslateSource="handleGetMoreTranslateSource"
        @getArticleList="getArticleList"
        @addArticle="addArticle"
        @batchMove="batchMoveNews"
        @batchCopy="batchCopyNews"
        @batchRemove="batchRemoveNews"
        @batchTop="batchTopNews"
        @batchPublish="batchPublishNews"
        @changeOperateName="changeOperateName"
      ></content-header>
      <el-main>
        <content-table
          v-if="articlePageResult !== null"
          :article-page-result="articlePageResult"
          :article-search-options="articleSearchOptions"
          :languages-list="languagesList"
          @getArticleList="getArticleList"
          @addArticle="addArticle"
          @batchMove="batchMoveNews"
          @batchCopy="batchCopyNews"
          @batchRemove="batchRemoveNews"
          @batchTop="batchTopNews"
          @batchPublish="batchPublishNews"
          @handleEditArticle="handleEditArticle"
          @moveClassify="moveClassify"
          @handleSelectionChange="handleSelectionChange"
          @changeOperateName="changeOperateName"
          @handleGetSignalTranslateSource="handleGetSignalTranslateSource"
          @handleGetMoreTranslateSource="handleGetMoreTranslateSource"
        ></content-table>

        <el-dialog
          width="0"
          style="z-index:10"
          :close-on-click-modal="false"
          :show-close="false"
          :visible.sync="isInvitationPanelShow"
        ></el-dialog>
        <right-pannel
          :style="{ width: isInvitationlWidth + 'px' }"
          @closeRightPanel="cancelUpdateCategory"
        >
          <template v-if="operateName === '移动' || operateName === '复制'">
            <span slot="title-text">{{ operateName }}文章分类</span>
            <div class="category-content">
              <span name="cur-tip">{{ operateName }}至</span>
            </div>
            <SelectTree
              v-if="isInvitationPanelShow"
              :categoryName="curArticleInfo.categoryName"
              :categoryId="curArticleInfo.categoryId"
              :tree-result="treeResult"
              @chooseNode="chooseNode"
            />
          </template>

          <div slot="footer" class="pannel-footer">
            <button
              @click="handOperateArticle"
              class="cl-button cl-button--small cl-button--primary"
            >
              确定
            </button>
            <button
              @click="cancelUpdateCategory"
              class="cl-button cl-button--small cl-button--primary_notbg"
            >
              取消
            </button>
          </div>
        </right-pannel>

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
        <!-- 翻译部分 end -->
      </el-main>
    </el-main>
  </el-container>
</template>
<script>
import * as articleManageApi from "@/api/request/articleManageApi";
import MTree from "@/components/common/MTree";
import ContentHeader from "./ContentHeader";
import ContentTable from "./ContentTable";
import RightPannel from "@/components/common/RightPannel";
import SelectTree from "@/components/common/SelectTree";
import DialogInfoModal from "@/components/translate/dialog-info-modal";
import DialogTranslateLanguageModal from "@/components/translate/dialog-translate-language-modal";
import DialogTranslateProgressModal from "@/components/translate/dialog-translate-progress-modal";
export default {
  components: {
    MTree,
    ContentHeader,
    ContentTable,
    RightPannel,
    SelectTree,
    DialogInfoModal,
    DialogTranslateLanguageModal,
    DialogTranslateProgressModal
  },
  data() {
    return {
      articlePageResult: null,
      treeResult: null,
      curArticleInfo: {},
      moveToClassiFy: "",
      newsIdList: "",
      count: 0,
      contentLength: 0,
      list: [],
      idsList: [],
      rightPanelType: 1, // 1 移动文章 2 复制文章
      selectCategory: "",
      operateName: "移动",
      isInvitationPanelShow: false,
      articleSearchOptions: {
        title: "",
        categoryIdList: [0],
        categoryId: 0,
        newsOrderColumns: "createtime",
        topStatus: null,
        publishStatus: null,
        pageIndex: 1,
        pageSize: 10,
        isDescending: true
      },
      curRow: null,
      infoModal: {
        title: "提示",
        type: "fail",
        content: `<p class="lineheight26 fontsize14" style="text-indent: -7px;">【阿里云AI翻译】单次最多支持约4000字符。当前文章字符已超限，请重新选择或删减文章后重试。</p>`,
        btn: {
          btn1Text: "关闭",
          btn2Text: "去修改"
        },
        additional: { words: "", operate: "" }
      },
      progressInfo: {
        title: "翻译中",
        progress: 0
      },
      languageModalSource: {
        signal: {
          tree: [],
          languages: [],
          list: [],
          type: "signal"
        },
        more: {
          total: 5,
          enable: 4,
          list: [],
          languages: [],
          type: "more"
        }
      },
      languageModal: null,
      source: null,
      type: "signal",
      foreignLanguages: []
    };
  },
  mounted() {
    this.getArticleList();
    this.getTreeAsync();
  },
  created() {
    this.keyupEnter();
  },
  computed: {
    isInvitationlWidth() {
      return this.isInvitationPanelShow === true ? 331 : 0;
    },
    isBatchHeaderShow() {
      return this.idsList.length > 0 ? true : false;
    },
    translateTree: {
      get: function() {
        let arr = JSON.parse(JSON.stringify(this.treeResult));
        if (arr.length > 0) {
          for (var i = 0; i < arr[0].children.length; i++) {
            const item = arr[0].children[i];
            if (item.language === "zh-CN") {
              arr[0].children.splice(i, 1);
            }
          }
        }
        return arr[0].children;
      },
      set: function() {}
    },
    languagesList: {
      get: function() {
        let arr = [];
        if (
          this.treeResult &&
          this.treeResult[0] &&
          this.treeResult[0].children.length > 0
        ) {
          for (var i = 0; i < this.treeResult[0].children.length; i++) {
            const item = this.treeResult[0].children[i];
            if (item.language != "zh-CN") {
              const obj = {};
              obj.languages = item.language;
              arr.push(obj);
            }
          }
        }
        return arr;
      },
      set: function() {}
    }
  },
  methods: {
    // 翻译 start
    /**
     * 编辑/修改
     */
    goEdit() {
      this.handleEditArticle(this.curRow);
    },
    /**
     * 获取翻译失败的列表
     */
    _getFailedList(data) {
      var str = "";
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          str += `<li><span style="display: inline-block;width: 17%;" class="lineheight26 attention ellipsis">（失败）</span><span class="lineheight26 ellipsis" style="display: inline-block;max-width: calc(35% - 16px);">${data[i].sourceEntityDesc}</span><span class="lineheight26 attention ellipsis" style="display: inline-block;margin-left: 16px; max-width: 48%;">${data[i].errorMsg}</span></li>`;
        }
      }
      return str;
    },
    /**
     * 获取可以翻译的文章列表
     */
    _checkEnableTranslateItem(data) {
      const o = {};
      let arr = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].contentLength < 4000) {
          arr.push(data[i]);
        }
      }
      o.total = data.length;
      o.enable = arr.length;
      return o;
    },
    /**
     * 单语言翻译
     */
    async _handleTranslateSingnalLanguages(options, obj) {
      let { data } = await articleManageApi.translateSignalNews(options);
      this._getTranslateProcess(data, 1, obj);
    },
    /**
     * 多语言翻译
     */
    async _handleTranslateMoreLanguages(options, obj) {
      let { data } = await articleManageApi.translateMoreNews(options);
      this._getTranslateProcess(data, 1, obj);
    },
    /**
     * 获取翻译进度
     */
    async _getTranslateProcess(id, count, obj) {
      const num = obj.list.length;
      this.progressInfo.progress = 0;
      this.$refs.progressModal.showSelf();
      let { data } = await articleManageApi.getNewsTranslateProcess(id);
      if (data.isExist) {
        // 弹出翻译进度弹窗
        const res = data.cacheInfo;
        if (res.progressPercent < 1) {
          count++;
          setTimeout(() => {
            this.progressInfo.progress = Number(res.progressPercent) * 100;
            this._getTranslateProcess(id, count, obj);
          }, 2000);
        }
        if (res.progressPercent === 1 && count > 1) {
          this.progressInfo.progress = Number(res.progressPercent) * 100;
          setTimeout(() => {
            // 隐藏弹窗
            if (res.failedList.length > 0) {
              if (
                parseInt(obj.languagesList.length) * parseInt(num) >
                res.failedList.length
              ) {
                this.infoModal.title = "成功";
                this.infoModal.type = "success";
                this.infoModal.content = `<p class='lineheight26'>部分文章翻译成功！</p><p class='lessattention lineheight26'>机器翻译存在误差，可能需要您手动订正。</p><ul style="margin-top: 8px; margin-left: -7px; width: 300px;">${this._getFailedList(
                  res.failedList
                )}</ul>`;
              } else {
                this.infoModal.title = "失败";
                this.infoModal.type = "fail";
                this.infoModal.content = `<p class='lineheight26'>文章翻译失败！</p><ul style="width: 300px; margin-left: -7px;">${this._getFailedList(
                  res.failedList
                )}</ul>`;
              }
            } else {
              this.infoModal.title = "成功";
              this.infoModal.type = "success";
              this.infoModal.content =
                "<p class='lineheight26'>文章翻译成功！</p><p class='lessattention lineheight26'>机器翻译存在误差，可能需要您手动订正。</p>";
            }
            this.$refs.progressModal.hideSelf();
            this.infoModal.btn.btn2Text = "关闭";
            this.infoModal.btn.btn2Operate = "close";
            if (
              obj.languagesList.length === 1 &&
              num === 1 &&
              res.failedList.length === 0
            ) {
              this.infoModal.btn.btn1Text = "编辑";
              this.infoModal.btn.btn1Operate = "goEdit";
              this.infoModal.additional.words = "进入编辑";
              this.infoModal.additional.operate = "goEdit";
              if (res.lastTranslatedEntityInfo) {
                this.curRow.id = res.lastTranslatedEntityInfo.Id;
                this.curRow.categoryId =
                  res.lastTranslatedEntityInfo.CategoryId;
                this.curRow.categoryName =
                  res.lastTranslatedEntityInfo.CategoryName;
              }
              this.curRow.language = obj.languagesList[0];
            } else {
              this.infoModal.btn.btn1Text = "";
              this.infoModal.btn.btn1Operate = "";
              this.infoModal.additional.words = "";
              this.infoModal.additional.operate = "";
            }
            console.log(this.infoModal, "1++++++");
            this.$refs.infoModal.showSelf();
          }, 1000);
        }
        if (res.progressPercent === 1 && count === 1) {
          this.progressInfo.progress = 100;
          setTimeout(() => {
            // 隐藏弹窗
            this.$refs.progressModal.hideSelf();
            this.infoModal.title = "成功";
            this.infoModal.type = "success";
            this.infoModal.content =
              "<p class='lineheight26'>文章翻译成功！</p><p class='lessattention lineheight26'>机器翻译存在误差，可能需要您手动订正。</p>";
            this.infoModal.btn.btn2Text = "关闭";
            this.infoModal.btn.btn2Operate = "close";
            if (num === 1) {
              this.infoModal.btn.btn1Text = "编辑";
              this.infoModal.btn.btn1Operate = "goEdit";
              this.infoModal.additional.words = "进入编辑";
              this.infoModal.additional.operate = "goEdit";
              if (res.lastTranslatedEntityInfo) {
                this.curRow.id = res.lastTranslatedEntityInfo.Id;
                this.curRow.categoryId =
                  res.lastTranslatedEntityInfo.CategoryId;
                this.curRow.categoryName =
                  res.lastTranslatedEntityInfo.CategoryName;
              }
              this.curRow.language = obj.languagesList[0];
            }
            if (num > 1) {
              this.infoModal.btn.btn1Text = "";
              this.infoModal.btn.btn1Opetate = "";
              this.infoModal.additional.words = "关闭弹窗";
              this.infoModal.additional.operate = "close";
            }
            this.$refs.infoModal.showSelf();
          }, 1000);
        }
        this.getTreeAsync();
      } else {
        if (count < 8) {
          count++;
          setTimeout(() => {
            this._getTranslateProcess(id, count, obj);
          }, 2000);
        } else {
          this.$refs.progressModal.hideSelf();
          this.infoModal.title = "失败";
          this.infoModal.type = "fail";
          this.infoModal.content = "连接超时，翻译失败，请稍后再试";
          this.infoModal.btn.btn1Text = "";
          this.infoModal.btn.btn2Text = "关闭";
          this.infoModal.additional.words = "关闭弹窗";
          this.infoModal.additional.operate = "close";
          this.$refs.infoModal.showSelf();
        }
      }
    },
    /**
     * 获取单个翻译信息
     */
    handleGetSignalTranslateSource(row, translatedIds) {
      this.curRow = row;
      if (row.contentLength > 4000) {
        this.infoModal.title = "提示";
        this.infoModal.type = "fail";
        this.infoModal.content = `<p class="lineheight26 fontsize14" style="text-indent: -7px;">【阿里云AI翻译】单次最多支持约4000字符。当前文章字符已超限，请重新选择或删减文章后重试。</p>`;
        this.infoModal.btn.btn1Text = "关闭";
        this.infoModal.btn.btn1Operate = "close";
        this.infoModal.btn.btn2Text = "修改";
        this.infoModal.btn.btn2Operate = "goEdit";
        this.infoModal.additional.words = "关闭弹窗";
        this.infoModal.additional.operate = "close";
        this.$refs.infoModal.showSelf();
      } else {
        this.type = "signal";
        this.source = [row];
        this.languageModalSource.more.title = "单篇翻译";
        this._getForeigns(translatedIds);
      }
    },
    /**
     * 获取批量翻译信息
     */
    handleGetMoreTranslateSource() {
      this._checkIsHasTranslateProcess(data => {
        if (!data) {
          this.infoModal.title = "失败";
          this.infoModal.type = "fail";
          this.infoModal.content =
            "当前存在翻译任务，请完成已经存在的任务后再进行翻译";
          this.infoModal.btn.btn1Text = "";
          this.infoModal.btn.btn2Text = "关闭";
          return false;
        } else {
          this.type = "more";
          this.source = this._getChineseList();
          let obj = this._checkEnableTranslateItem(this.source);
          this.languageModalSource.more.title = "批量翻译";
          this.languageModalSource.more.total = obj.total;
          this.languageModalSource.more.enable = obj.enable;
          this._getForeigns();
        }
      });
    },
    /**
     * 获取可翻译外文（与已经翻译过的去重）
     */
    _getForeigns(ids) {
      this._getTranslateIds(this.languagesList, ids);
      if (this.foreignLanguages.length > 1) {
        this.languageModalSource.more.languages = this.foreignLanguages;
        this.languageModalSource.more.list = this.source;
        this.languageModalSource.more.type = this.type;
        this.languageModal = this.languageModalSource.more;
        this.$refs.languageModal.showSelf();
      } else {
        this.languageModalSource.signal.languages = this.foreignLanguages;
        this.languageModalSource.signal.list = this.source;
        this.languageModalSource.signal.type = this.type;
        this.languageModalSource.signal.tree = this.translateTree;
        this.languageModal = this.languageModalSource.signal;
        this.$refs.languageModal.showSelf();
      }
    },
    /**
     * 获取所有可以翻译的中文数据
     */
    _getChineseList() {
      let arr = [];
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].language === "zh-CN") {
          arr.push(this.list[i]);
        }
      }
      return arr;
    },
    /**
     * 获取要翻译到的外文站点
     */
    _getTranslateIds(data, ids) {
      this.foreignLanguages = [];
      let item = {};
      let flag = true;
      for (var i = 0; i < data.length; i++) {
        if (ids && ids.length > 0) {
          for (var k = 0; k < ids.length; k++) {
            if (ids[k].language === data[i].languages) {
              flag = false;
            }
          }
          if (flag) {
            item.languages = data[i].languages;
            this.foreignLanguages.push(item);
          }
        } else {
          item.languages = data[i].languages;
          this.foreignLanguages.push(item);
        }
        item = {};
        flag = true;
      }
    },
    /**
     * 检验是否存在翻译进程 -
     */
    async _checkIsHasTranslateProcess(callback) {
      let { status, data } = await articleManageApi.isHasTranslateProcess();
      if (status === 200) {
        typeof callback === "function" && callback(data);
      }
    },
    /**
     * 信息弹框关闭操作
     */
    close() {
      this.$refs.infoModal.stopIntervalEvent();
      this.$refs.infoModal.hideSelf();
    },
    /**
     * 语言弹框确认操作
     */
    async languageConfirm(obj) {
      let options = {
        FromIdList: obj.list,
        SiteId: this.$store.state.dashboard.siteId
      };
      if (obj.languagesList.length === 1) {
        if (this.foreignLanguages.length === 1) {
          options.CategoryId = obj.id;
        }
        options.TargetLanguage = obj.languagesList[0];
      }
      if (obj.languagesList.length > 1) {
        if (this.foreignLanguages.length === 1) {
          options.CategoryId = obj.id;
        }
        options.LanguageList = obj.languagesList;
      }
      obj.languagesList.length > 1
        ? this._handleTranslateMoreLanguages(options, obj)
        : this._handleTranslateSingnalLanguages(options, obj);
    },
    // 列表增加设置项
    _setDataListAttribute(data) {
      for (var i = 0; i < data.length; i++) {
        this.$set(data[i], "translateToolTip", "");
      }
    },
    // 翻译 end

    keyupEnter() {
      document.onkeydown = e => {
        if (e.keyCode === 13) {
          this.isInvitationPanelShow && this.handOperateArticle();
        }
      };
    },
    // 移动分类 或是 复制到分类
    changeOperateName(operate) {
      this.operateName = operate;
    },
    /**
     * 获取多选的列表
     */
    handleSelectionChange(list) {
      this.idsList = [];
      this.list = list;
      this.count = list.length;
      if (list.length < 1) return;
      list.forEach(item => {
        this.idsList.push(item.id);
      });
    },
    async getArticleList(options) {
      this.$Loading.show();
      let { data } = await articleManageApi.getArticleList(
        (options = this.articleSearchOptions)
      );
      this.$Loading.hide();
      this.articlePageResult = data;
      this._setDataListAttribute(this.articlePageResult.list);
    },
    // 批量删除
    async batchRemoveNews(idlist) {
      idlist = idlist == null ? this.idsList : idlist;
      this.$confirm(
        "删除后，网站中引用的文章列表将不再显示该文章，是否确定删除？",
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            console.log(action);
            if (action === "confirm") {
              let { status, data } = await articleManageApi.batchRemove(
                true,
                idlist
              );
              if (status === 200) {
                this.$notify({
                  customClass: "notify-success", //  notify-success ||  notify-error
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1000
                });
                this.getTreeAsync();
                this.getArticleList();
              }
            } else {
            }
          }
        }
      );
    },
    // 批量置顶
    async batchTopNews(idlist, isTop) {
      idlist = idlist == null ? this.idsList : idlist;
      var message = "置顶";
      if (isTop) message = "取消置顶";
      this.$confirm("您确定要" + message + "文章吗？", "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          console.log(action);
          if (action === "confirm") {
            let { status, data } = await articleManageApi.batchTop(
              !isTop,
              idlist
            );
            if (status === 200) {
              // this.getTree();
              this.$notify({
                customClass: "notify-success", //  notify-success ||  notify-error
                message: `${message}成功!`,
                showClose: false,
                duration: 1000
              });
              this.getArticleList();
            }
          } else {
          }
        }
      });
    },
    // 批量上下线
    async batchPublishNews(idlist, isPublish) {
      idlist = idlist == null ? this.idsList : idlist;
      var message = "上线";
      if (isPublish) message = "下线";
      this.$confirm("您确认要" + message + "文章吗？", "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          console.log(action);
          if (action === "confirm") {
            let { status, data } = await articleManageApi.batchPublish(
              !isPublish,
              idlist
            );
            if (status === 200) {
              this.$notify({
                customClass: "notify-success", //  notify-success ||  notify-error
                message: `${message}成功!`,
                showClose: false,
                duration: 1000
              });
              this.getArticleList();
            }
          }
        }
      });
    },
    // 批量移动分类
    async batchMoveNews(idlist, isHeader) {
      idlist = idlist == null ? this.idsList : idlist;
      this.isInvitationPanelShow = true;
      this.rightPanelType = 1;
      this.newsIdList = idlist;
      if (isHeader) {
        this.moveToClassiFy = "";
        this.curArticleInfo = {
          categoryName: "全部分类",
          categoryId: 0
        };
      }
    },
    // 批量复制分类
    async batchCopyNews(idlist, isHeader) {
      idlist = idlist == null ? this.idsList : idlist;
      this.isInvitationPanelShow = true;
      this.rightPanelType = 2;
      this.newsIdList = idlist;
      if (isHeader) {
        this.moveToClassiFy = "";
        this.curArticleInfo = {
          categoryName: "全部分类",
          categoryId: 0
        };
      }
    },
    // 拖拽移动分类
    async modifyNodeCategory(id, parentId, idOrderByArr) {
      await articleManageApi.modifyNode(id, parentId, idOrderByArr);
      this.$notify({
        customClass: "notify-success", //  notify-success ||  notify-error
        message: `移动成功!`,
        showClose: false,
        duration: 1000
      });
      this.getTreeAsync();
    },
    //选择移动分类时的节点
    chooseNode(node) {
      this.moveToClassiFy = node;
    },
    // 点击左侧分类树菜单时的节点
    chooseCategoryNode(data) {
      this.selectCategory = data;
    },
    cancelUpdateCategory() {
      this.isInvitationPanelShow = false;
    },
    moveClassify(b, data) {
      this.isInvitationPanelShow = b;
      this.curArticleInfo = data;
    },
    // 判断是 移动还是复制
    handOperateArticle() {
      switch (this.rightPanelType) {
        case 1:
          this.updateCategory();
          break;
        case 2:
          this.copyArticle();
          break;
      }
    },
    // 点击确定按钮 更新文章所属分类
    async updateCategory() {
      let cateId = this.moveToClassiFy
        ? this.moveToClassiFy.id
        : this.curArticleInfo.categoryId;

      let { data, status } = await articleManageApi.batchMove(
        cateId,
        this.newsIdList
      );
      if (status == 200) {
        this.$notify({
          customClass: "notify-success", //  notify-success ||  notify-error
          message: `移动成功!`,
          showClose: false,
          duration: 1000
        });
        this.isInvitationPanelShow = false;
        this.getTreeAsync();
        this.getArticleList();
      }
    },
    // 点击确定按钮 复制
    async copyArticle() {
      let cateId = this.moveToClassiFy
        ? this.moveToClassiFy.id
        : this.curArticleInfo.categoryId;
      let { data, status } = await articleManageApi.batchCopy(
        cateId,
        this.newsIdList
      );
      if (status == 200) {
        if (Array.isArray(this.newsIdList) && this.newsIdList.length > 1) {
          this.$notify({
            customClass: "notify-success", //  notify-success ||  notify-error
            message: `批量复制成功!`,
            showClose: false,
            duration: 1000
          });
        } else {
          this.$confirm(
            `<p style="line-height:16px;font-size: 14px;" class="ellipsis">复制成功</p> <p style="line-height:16px;color:#9F9F9F;">是否前往编辑文章</p>`,
            "提示",
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "立即前往",
              cancelButtonText: "暂不前往",
              iconClass: "icon-success",
              callback: async action => {
                if (action === "confirm") {
                  let categoryId = this.moveToClassiFy
                    ? this.moveToClassiFy.id
                    : this.curArticleInfo.categoryId;
                  let categoryName = this.moveToClassiFy
                    ? this.moveToClassiFy.label
                    : this.curArticleInfo.categoryName;
                  this.$router.push({
                    path: "/news/create",
                    query: {
                      id: data,
                      categoryName: categoryName,
                      categoryId: categoryId
                    }
                  });
                } else {
                }
              }
            }
          );
        }

        this.isInvitationPanelShow = false;
        this.getTreeAsync();
        this.getArticleList();
      }
    },
    // 关闭panel
    closeRightPanel() {
      this.isInvitationPanelShow = true;
    },

    // 获取文章分类的树菜单
    async getTreeAsync() {
      let { data } = await articleManageApi.getArticleCategory();
      this.treeResult = data;
      this.$refs.myTree.selectCategoryByNodeId(this.selectCategory.id);
    },

    // 重命名分类名称
    async renameCategory(id, newName) {
      await articleManageApi.reName(id, newName);
      this.getTreeAsync();
    },
    /** 新增分类 */
    async newCategory(entity) {
      await articleManageApi.create(entity);
      this.getTreeAsync();
    },

    /**
     * 删除分类
     */
    async batchRemoveCategory(idlist) {
      idlist = idlist == null ? this.idsList : idlist;
      this.$confirm(
        "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            console.log(action);
            if (action === "confirm") {
              let { status } = await articleManageApi.deleteNewsCategory(
                idlist
              );
              if (status === 200) {
                this.getTreeAsync();
                this.getArticleList();
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1500
                });
              }
            }
          }
        }
      );
    },

    // 点击新增跳转到详情页
    addArticle() {
      if (!this.selectCategory) {
        this.$router.push({
          path: "/news/create",
          query: {
            categoryName: this.treeResult[0].label || "全部分类",
            categoryId: this.treeResult[0].id || 0,
            language: this.treeResult[0].language || "zn-CN"
          }
        });
      } else {
        this.$router.push({
          path: "/news/create",
          query: {
            categoryName: this.selectCategory.label || "全部分类",
            categoryId: this.selectCategory.id || 0,
            language: this.selectCategory.language || "zn-CN"
          }
        });
      }
    },
    // 编辑文章跳转到详情页
    handleEditArticle(row) {
      this.$router.push({
        path: "/news/create",
        query: {
          id: row.id,
          categoryName: row.categoryName,
          categoryId: row.categoryId,
          language: row.language
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/contentDetail.scss";
.checkedNum {
  color: $--color-primary;
}
.translateDialog {
  position: relative;
}
.languageSelect {
  z-index: 3000;
}
.content-manage .translateDialog /deep/ .el-select-dropdown {
  z-index: 3000 !important;
}
</style>
