<template>
  <div class="my-chose-template">
    <el-dialog
      style="margin-top:50px"
      width="0"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="false"
      :modal="false"
      :visible.sync="templateShow"
    >
      <div class="right-pannel">
        <el-container style="height:100%">
          <el-aside class="aside" style="width:250px">
            <div class="title">选择模版</div>
            <div class="order">
              <span
                v-for="(item, index) in orderType"
                :key="index"
                class="orderText"
                :class="{active:item.isOrder}"
                @click="changeOrder(item)"
              >{{item.text}}</span>
            </div>
            <div style="margin-top:26px">
              <div class="tab" :class="{allTab:isAllTab}" @click="choseAllTab">
                <div class="allBackground"></div>全部
              </div>
              <!-- <div
                class="tab"
                :class="{myTab:!isAllTab}"
                style="margin-top:10px"
                @click="choseMyTab"
              >
                <div class="myBackground"></div>已有网站
              </div>-->
            </div>
            <el-tree
              style="margin-top:20px"
              :data="firstIndustry"
              node-key="id"
              ref="tree"
              accordion
              :highlight-current="true"
              class="tree"
              @node-click="changeIndustry"
            ></el-tree>
          </el-aside>
          <el-main style="overflow:hidden">
            <el-header
              class="templateHeader"
              style="height:86px;padding:24px 40px;border-bottom:1px solid #E5E5E5;display: flex;justify-content: space-between;"
            >
              <div class="colorType" v-show="isAllTab">
                <span class="colorTheme">主题</span>
                <span class="color">
                  <div
                    v-for="(item, index) in colorArray"
                    :key="index"
                    class="colorItem"
                    :class="{curColorItem:item.isCur}"
                    :style="{background:item.color?item.color:''}"
                    @click="changeColor(item)"
                  ></div>
                </span>
                <!-- <el-select
                  v-model="languageSelect"
                  placeholder="全部语言"
                  class="languageSelect"
                  style="width:100px;vertical-align: middle;margin-left:32px"
                  @change="changeLanguage"
                >
                  <el-option
                    v-for="item in languageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>-->
              </div>
              <el-input
                size="medium"
                v-model="search"
                placeholder="输入关键词搜索"
                class="input-with-select"
                style="width:260px;position:absolute;left:40%"
              >
                <i
                  class="el-icon-search el-input__icon"
                  style="cursor: pointer;"
                  slot="suffix"
                  @click="searchTemplate"
                ></i>
              </el-input>
              <span class="close-pannel" @click="closeDialog">
                <i class="iconfont iconguanbi"></i>
              </span>
            </el-header>
            <el-main class="templateContent" style="padding:0 80px;position:relative" v-scrollBar>
              <el-row :gutter="80">
                <el-col
                  class="templateItem"
                  :span="8"
                  v-for="(item, index) in templateInfo"
                  :key="index"
                >
                  <div class="itemSiteImage">
                    <img src="~img/siteManage/siteHeader.png" class="itemSiteImageHeader" />
                    <div
                      class="itemSiteImageBackground"
                      :style="{background: 'url(' + (item.imageUrl ) + ') no-repeat center/cover'}"
                      v-if="isAllTab"
                    >
                      <div class="modal" v-if="item.id != templateId">
                        <div>
                          <div class="choseSite" @click="choseSite(item)">选择</div>
                          <a :href="`http://${item.domain}`" class="previewSite" target="_blank">预览</a>
                        </div>
                      </div>
                      <div class="curModal" v-show="item.id == templateId">当前选择</div>
                    </div>
                    <div
                      class="itemSiteImageBackground"
                      :style="{background: 'url(' + (item.image ) + ') no-repeat center/cover'}"
                      v-else
                    >
                      <div class="modal" v-if="item.id != siteId">
                        <div>
                          <div class="choseSite" @click="choseSite(item)">选择</div>
                          <a
                            :href="`http://${item.secondDomain}`"
                            class="previewSite"
                            target="_blank"
                          >预览</a>
                        </div>
                      </div>
                      <div class="curModal" v-show="item.id == siteId">当前选择</div>
                    </div>
                    <div class="siteLanguage">{{_getLanguage(item.language)}}</div>
                  </div>
                  <div style="text-align:center">
                    <div
                      class="itemSiteName"
                      v-if="isAllTab"
                    >{{item.templateName && item.templateName.trim().length > 10 ? item.templateName.slice(0, 10) + '...' : item.templateName}}</div>
                    <div
                      class="itemSiteName"
                      v-else
                    >{{item.siteName && item.siteName.trim().length > 10 ? item.siteName.slice(0, 10) + '...' : item.siteName}}</div>
                  </div>
                </el-col>
              </el-row>
            </el-main>
            <div>
              <span class="notFindTemplate" @click="notFindTemplate">未找到想要的模版？</span>
              <div class="cl-pagination pageing" id="pageing" style="margin-bottom:20px">
                <el-pagination
                  v-show="templatePage.totalCount > 9"
                  background
                  layout="total, slot, sizes, prev, pager, next"
                  :current-page="templatePage.pageIndex"
                  :total="templatePage.totalCount"
                  :page-count="templatePage.totalPages"
                  :page-size="templatePage.pageSize"
                  :page-sizes="[9,18,45]"
                  @current-change="changePage"
                  @size-change="changeSize"
                ></el-pagination>
              </div>
            </div>
            <el-dialog
              width="0"
              :visible.sync="notFindTemplateShow"
              :show-close="false"
              :close-on-click-modal="false"
              :modal-append-to-body="false"
            >
              <div class="notFindTemplate-pannel" :style="{width:'600px'}">
                <div class="pannel-head">
                  <span class="headTitle">未找到想要的模版</span>
                  <span class="close-pannel" @click="closeNotFindTemplateDialog">
                    <i
                      class="iconfont iconguanbi"
                      style="line-height:70px;font-size:16px;color:#262626;"
                    ></i>
                  </span>
                </div>
                <div class="tips">请填写您的网站需求，帮助我们改进模版库</div>
                <div class="industry">
                  网站行业：
                  <el-input
                    v-model="notFindName"
                    placeholder="请输入您想要的行业名称"
                    @blur="blurIndustryName"
                    style="width:470px"
                    maxlength="20"
                  ></el-input>
                  <div
                    class="ym-form-item__error"
                    style="margin-left:68px"
                    v-show="errorIndustry"
                  >{{errorIndustryName}}</div>
                </div>
                <div class="reference">
                  参考网站：
                  <el-input
                    v-model="notFindSite"
                    placeholder="请输入您想参考的网站链接"
                    style="width:470px"
                    @blur="blurReferenceSite"
                    maxlength="200"
                  ></el-input>
                  <div
                    class="ym-form-item__error"
                    style="margin-left:68px"
                    v-show="errorReference"
                  >{{errorSite}}</div>
                </div>
                <div class="description">
                  网站描述：
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请描述您想要的网站效果"
                    style="width:470px;vertical-align: text-top;"
                    v-model="notFindRemark"
                    maxlength="200"
                  ></el-input>
                </div>

                <div class="confirm">
                  <button class="confirmBtn" @click="submit">提交</button>
                </div>
              </div>
            </el-dialog>
          </el-main>
        </el-container>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as templateApi from "@/api/request/templateApi";
import { getLanguage } from "@/configure/appCommon";
import { designerUrl } from "@/environment/index";
import { getMemberList } from "@/api/request/siteMemberApi";

export default {
  props: ["siteId", "siteName", "templateId", "isChangeTemplate"],
  data() {
    return {
      templateShow: false,
      templatePage: {},
      isAllTab: true,
      templateInfo: [],
      languageSelect: "",
      themeSelect: "",
      languageOptions: [
        {
          value: "",
          label: "全部语言"
        },
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en-US",
          label: "英文"
        },
        {
          value: "ja-JP",
          label: "日语"
        },
        {
          value: "es-ES",
          label: "西班牙语"
        },
        {
          value: "ko-KR",
          label: "韩语"
        }
      ],
      search: "",
      colorArray: [
        {
          isCur: true,
          code: ""
        },
        {
          color: "rgba(7,102,227,1)",
          isCur: false,
          code: "blue_color1"
        },
        {
          color: "rgba(251,77,104,1)",
          isCur: false,
          code: "pink_color1"
        }
      ],
      orderType: [
        {
          text: "最新",
          isOrder: true,
          type: "updataTime"
        },
        {
          text: "最热",
          isOrder: false,
          type: "mostPopular"
        },
        {
          text: "推荐",
          isOrder: false,
          type: "IsRecommend"
        }
      ],
      firstIndustry: [],
      isOrderByUpdateTime: true,
      isMostPopular: false,
      isRecommend: false,
      firstIndustryId: 0,
      secondIndustryId: 0,
      pageIndex: 1,
      pageSize: 9,
      notFindTemplateShow: false,
      notFindName: "",
      notFindSite: "",
      notFindRemark: "",
      errorIndustry: false,
      errorIndustryName: "",
      errorReference: false,
      errorSite: ""
    };
  },
  computed: {},
  mounted() {},
  methods: {
    async changeIndustry(item) {
      this.firstIndustryId = 0;
      this.secondIndustryId = 0;
      if (item.parentId == 0) {
        this.firstIndustryId = item.id;
      } else {
        this.firstIndustryId = item.parentId;
        this.secondIndustryId = item.id;
      }
      let para = {
        TemplateName: this.search,
        FirstIndustry: this.firstIndustryId,
        SecondIndustry: this.secondIndustryId,
        Theme: this.themeSelect,
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 获取行业树
    async getIndustryTree() {
      let { data, status } = await templateApi.getIndustryTree();
      if (status == 200) {
        data.splice(0, 1);
        this.firstIndustry = data;
      }
    },
    // 切换语言
    async changeLanguage() {
      let para = {
        TemplateName: this.search,
        FirstIndustry: this.firstIndustryId,
        SecondIndustry: this.secondIndustryId,
        Theme: this.themeSelect,
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 选择主题颜色
    async changeColor(item) {
      if (item.isCur) {
        return;
      }
      this.colorArray.forEach((_item, index) => {
        if (item.code == _item.code) {
          item.isCur = true;
          this.themeSelect = item.code;
        } else {
          _item.isCur = false;
        }
      });
      let para = {
        TemplateName: this.search,
        FirstIndustry: this.firstIndustryId,
        SecondIndustry: this.secondIndustryId,
        Theme: this.themeSelect,
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 选择最新/最热/推荐
    async changeOrder(item) {
      if (this.isAllTab == true) {
        this.orderType.forEach((item, index) => {
          item.isOrder = false;
        });
        item.isOrder = true;
        this.isOrderByUpdateTime = false;
        this.isMostPopular = false;
        this.isRecommend = false;
        if (item.type == "updataTime") {
          this.isOrderByUpdateTime = true;
        } else if (item.type == "mostPopular") {
          this.isMostPopular = true;
        } else if (item.type == "IsRecommend") {
          this.isRecommend = true;
        }
        let para = {
          TemplateName: this.search,
          FirstIndustry: this.firstIndustryId,
          SecondIndustry: this.secondIndustryId,
          Theme: this.themeSelect,
          Language: this.languageSelect,
          IsRecommend: this.isRecommend,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          IsOrderByUpdateTime: this.isOrderByUpdateTime,
          IsMostPopular: this.isMostPopular
        };
        let { data, status } = await templateApi.getSiteTemplates(para);
        this.templatePage = data;
        this.templateInfo = data.items;
      }
    },

    // 选择模版
    async choseSite(item) {
      if (this.isChangeTemplate) {
        this.$confirm(
          `更换模版会替换现有的设计界面，您确认要切换吗？`,
          "提示",
          {
            iconClass: "icon-warning",
            callback: async action => {
              if (action === "confirm") {
                this.choseTemplate(item);
              } else {
                return;
              }
            }
          }
        );
      } else {
        this.choseTemplate(item);
      }
    },
    async choseTemplate(item) {
      const loading = this.$loading({
        lock: true,
        text: "正在复制模版",
        spinner: "copy-icon",
        customClass: "copyTemplateLoading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      try {
        if (this.isAllTab == false) {
          let para = {
            currentSiteId: this.siteId,
            templateSiteId: item.id,
            siteName: item.siteName,
            imageUrl: item.image,
            templateId: item.templateId
          };
          var { status } = await templateApi.updateSiteWithTemplate(para);
        } else {
          let para = {
            TemplateId: item.id,
            CurrentSiteId: this.siteId,
            TemplateSiteId: item.siteId,
            SiteName: this.siteName
          };
          var { status } = await templateApi.updateSiteTemplate(para);
        }
        if (status == 200) {
          loading.close();
          this.$confirm(`模版复制成功！是否前往设计页面？`, "提示", {
            confirmButtonText: "前往设计页面",
            cancelButtonText: "取消",
            iconClass: "icon-success"
          })
            .then(() => {
              window.location.href = `${designerUrl}?siteId=${this.siteId}`;
            })
            .catch(action => {
              if (action == "cancel") {
                this.templateShow = false;
                this.$router.push({
                  path: "/website/mysite/siteinfo"
                });
                this.$emit("getSiteInfo", this.siteId);
              }
            });
        }
      } catch {
        loading.close();
        this.$notify({
          customClass: "notify-error",
          message: `模版复制失败，请稍后重试`,
          duration: 1500,
          showClose: false
        });
      }
    },
    //   获取模版列表
    async getTemplateList() {
      let para = {
        TemplateName: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        Theme: "",
        Language: "",
        IsRecommend: false,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsOrderByUpdateTime: true,
        IsMostPopular: false
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 查询
    async searchTemplate() {
      if (this.isAllTab == false) {
        let para = {
          siteName: this.search,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        };
        var { data, status } = await templateApi.getTemplateSites(para);
      } else {
        let para = {
          TemplateName: this.search,
          FirstIndustry: this.firstIndustryId,
          SecondIndustry: this.secondIndustryId,
          Theme: this.themeSelect,
          Language: this.languageSelect,
          IsRecommend: this.isRecommend,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          IsOrderByUpdateTime: this.isOrderByUpdateTime,
          IsMostPopular: this.isMostPopular
        };
        var { data, status } = await templateApi.getSiteTemplates(para);
      }
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    async changePage(page) {
      this.pageIndex = page;
      this.searchTemplate();
    },
    changeSize(page) {
      this.pageSize = page;
      this.searchTemplate();
    },
    // 关闭弹窗
    closeDialog() {
      this.pageIndex = 1;
      this.pageSize = 9;
      this.templateShow = false;
      this.languageSelect = "";
      this.search = "";
      this.orderType.forEach((item, index) => {
        item.isOrder = false;
      });
      this.orderType[0].isOrder = true;
    },
    // 选择全部模版
    async choseAllTab() {
      this.isAllTab = true;
      this.orderType.forEach((item, index) => {
        item.isOrder = false;
        if (item.type == "updataTime") {
          item.isOrder = true;
        }
      });
      this.search = "";
      this.colorArray.forEach((item, index) => {
        if (item.code == "") {
          item.isCur = true;
          this.themeSelect = "";
        } else {
          item.isCur = false;
        }
      });
      this.firstIndustryId = 0;
      this.secondIndustryId = 0;
      this.getTemplateList();
    },
    // 选择已有网站
    async choseMyTab() {
      this.isAllTab = false;
      let para = {
        siteName: this.search,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      };
      let { data, status } = await templateApi.getTemplateSites(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    notFindTemplate() {
      this.notFindTemplateShow = true;
    },
    closeNotFindTemplateDialog() {
      this.notFindName = "";
      this.notFindSite = "";
      this.notFindRemark = "";
      this.errorIndustry = false;
      this.errorIndustryName = "";
      this.errorReference = false;
      this.errorSite = "";
      this.notFindTemplateShow = false;
    },
    blurIndustryName() {
      if (this.notFindName == "") {
        this.errorIndustry = true;
        this.errorIndustryName = "请输入想要的行业名称";
      } else {
        this.errorIndustry = false;
        this.errorIndustryName = "";
      }
    },
    blurReferenceSite() {
      if (this.notFindSite == "") {
        this.errorReference = true;
        this.errorSite = "请输入想参考的网站链接";
      } else if (
        !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
          this.notFindSite
        )
      ) {
        this.errorReference = true;
        this.errorSite = "输入正确的网站链接";
      } else {
        this.errorReference = false;
        this.errorSite = "";
      }
    },
    async submit() {
      if (this.notFindName == "") {
        this.errorIndustry = true;
        this.errorIndustryName = "请输入想要的行业名称";
      } else if (this.notFindSite == "") {
        this.errorReference = true;
        this.errorSite = "请输入想参考的网站链接";
      } else if (
        !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
          this.notFindSite
        )
      ) {
        this.errorReference = true;
        this.errorSite = "输入正确的网站链接";
      } else {
        this.errorIndustry = false;
        this.errorIndustryName = "";
        this.errorReference = false;
        this.errorSite = "";
        let para = {
          name: this.notFindName,
          firstIndustryId: 1,
          secondIndustryId: 0,
          webDescription: this.notFindRemark,
          referenceWebSite: this.notFindSite
        };
        let { status } = await templateApi.createReferenceIndustry(para);
        if (status == 200) {
          this.closeNotFindTemplateDialog();
          this.$notify({
            customClass: "notify-success",
            message: `感谢您的反馈`,
            duration: 1500,
            showClose: false
          });
        }
      }
    },
    // 显示选择模版弹框
    showTemplate() {
      this.templateShow = true;
      this.getIndustryTree();
      this.getTemplateList();
      this.$nextTick(() => {
        window.addEventListener("resize", () => {
          document.getElementsByClassName("templateContent")[0].style.height =
            window.innerHeight - 280 + "px";
        });
        document.getElementsByClassName("templateContent")[0].style.height =
          window.innerHeight - 280 + "px";
      });
    },
    // 转换语言
    _getLanguage(language) {
      return getLanguage(language);
    }
  }
};
</script>
<style>
.copy-icon {
  margin-top: 17px;
  display: inline-block;
  width: 142px;
  height: 89px;
  background: url("~img/copy.gif") no-repeat center;
  background-size: contain;
}
.copyTemplateLoading .el-loading-spinner {
  margin-top: 0 !important;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: #fff;
  border-radius: 4px;
}
.copyTemplateLoading .el-loading-spinner .el-loading-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
</style>
<style scoped>
.el-tabs {
  margin-top: 24px;
}
.el-tabs /deep/ .el-tabs__item {
  height: 38px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  border-bottom: 1px solid #e4e7ed;
  background: rgba(245, 245, 245, 1);
  vertical-align: top;
  border-top: 2px solid transparent;
}
.el-tabs /deep/ .is-active {
  color: rgba(1, 192, 222, 1);
  border-top: 2px solid rgb(72, 201, 226);
  border-bottom: 1px solid transparent;
  background: rgb(255, 255, 255);
}
.input-with-select /deep/ .el-input__inner {
  height: 40px;
}
.el-select-dropdown {
  margin-top: 0;
}
.languageSelect /deep/ .el-input__inner {
  border: none;
}
.tree /deep/ .is-leaf {
  display: none;
}
.tree /deep/ .el-tree-node__content {
  height: 46px;
}
.tree /deep/ .el-tree-node__expand-icon {
  position: absolute;
  right: 30px;
  transform: rotate(180deg);
  color: rgba(38, 38, 38, 1);
}
.tree /deep/ .expanded {
  transform: rotate(135deg);
}
.tree /deep/ .el-tree-node__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  display: inline-block;
  margin-left: 30px;
}
</style>

<style lang="scss" scoped>
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  // overflow: hidden;
  .aside {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 14px 0px rgba(201, 201, 201, 0.5);
    text-align: center;
    .title {
      height: 92px;
      font-size: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 92px;
      border-bottom: 1px solid #eee;
      margin: 0 32px;
    }
    .order {
      height: 84px;
      border-bottom: 1px solid #eee;
      margin: 0 32px;
      display: flex;
      justify-content: space-between;
      .orderText {
        width: 44px;
        height: 26px;
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 26px;
        margin-top: 29px;
        cursor: pointer;
      }
      .active {
        background: rgba(9, 204, 235, 0.1);
        border-radius: 2px;
        color: rgba(9, 204, 235, 1);
      }
    }
    .tab {
      text-align: left;
      height: 36px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 36px;
      cursor: pointer;
      border-left: 3px solid transparent;
      .allBackground {
        margin-left: 34px;
        margin-right: 15px;
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url("~img/siteManage/allTemplate.png") no-repeat center;
        background-size: contain;
      }
      .myBackground {
        margin-left: 34px;
        margin-right: 15px;
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url("~img/siteManage/myTemplate.png") no-repeat center;
        background-size: contain;
      }
    }
    .allTab {
      background: rgba(9, 204, 235, 0.1);
      border-left: 3px solid #09cceb;
    }
    .myTab {
      background: rgba(216, 216, 216, 0.2);
      border-left: 3px solid #09cceb;
    }
  }
  .templateHeader {
    // display: flex;
    // justify-content: space-between;
    position: relative;
    .close-pannel {
      float: right;
      cursor: pointer;
      .iconguanbi {
        line-height: 40px;
        font-size: 16px;
        color: #262626;
        padding: 8px;
        &:hover {
          background: rgba(240, 243, 247, 1);
          border-radius: 4px;
        }
      }
    }
    .colorType {
      height: 40px;
      display: flex;
      align-items: center;
      .colorTheme {
        vertical-align: middle;
        text-align: center;
        display: inline-block;
        width: 90px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px 0px 0px 2px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
      }
      .color {
        width: 120px;
        height: 40px;
        background: rgba(9, 204, 235, 0.1);
        border-radius: 0px 2px 2px 0px;
        display: flex;
        align-items: center;
        .colorItem {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 2px;
          margin-left: 8px;
          cursor: pointer;
        }
        .colorItem:first-child {
          margin-left: 16px;
          background: url("~img/allTheme.png") no-repeat center;
          background-size: contain;
        }
        .curColorItem {
          border: 2px solid rgba(9, 204, 235, 1);
        }
      }
    }
  }

  .templateItem {
    // padding: 5px;
    padding-top: 32px;
    .itemSiteImage {
      position: relative;
      width: 100%;
      transition: all 0.3s ease-in;
      .itemSiteImageHeader {
        width: 100%;
      }
      .siteLanguage {
        position: absolute;
        top: 40px;
        right: 12px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 22px;
      }
      .itemSiteImageBackground {
        margin-top: -2px;
        width: 100%;
        padding-bottom: 62%;
        position: relative;
      }
      .choseSite {
        width: 90px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
      .previewSite {
        display: inline-block;
        margin-top: 24px;
        width: 88px;
        height: 38px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(9, 204, 235, 1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(9, 204, 235, 1);
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
      .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: rgba(38, 38, 38, 0.5);
        border-radius: 0px 0px 2px 2px;
        // border: 1px solid rgba(185, 203, 207, 1);
      }
      &:hover {
        transform: translateY(-15px);
        box-shadow: 0px 15px 15px -15px #b9cbcf;
        .modal {
          opacity: 1;
        }
      }
      .curModal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        background: rgba(0, 0, 0, 0.5);
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
    }
    .itemSiteName {
      font-size: 16px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 24px;
      margin-bottom: 14px;
      margin-top: 14px;

      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .notFindTemplate {
    cursor: pointer;
    display: inline-block;
    margin-top: 24px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 112, 204, 1);
    line-height: 20px;
    margin-left: 80px;
  }
  //右侧弹框
  .notFindTemplate-pannel {
    background: #ffffff;
    position: fixed;
    z-index: 2200;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 3px #ccc;
    transition: width 0.2s linear;
    background-color: "#fff";
    color: #262626;
    overflow: hidden;
    .pannel-head {
      padding: 0 32px;
      height: 70px;
      overflow: hidden;
      border-bottom: 2px solid #eee;
      .headTitle {
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(38, 38, 38, 1);
        line-height: 70px;
      }
      .close-pannel {
        float: right;
        cursor: pointer;
      }
    }
    .tips {
      width: 537px;
      height: 32px;
      background: rgba(242, 255, 234, 1);
      border: 1px solid rgba(199, 221, 185, 1);
      font-size: 12px;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(0, 182, 57, 1);
      line-height: 32px;
      text-align: center;
      margin: 16px 32px 24px;
    }
    .industry {
      height: 72px;
      padding-left: 32px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .reference {
      height: 72px;
      padding-left: 32px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .description {
      padding-left: 32px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .confirm {
      width: 100%;
      height: 64px;
      text-align: center;
      margin-top: 24px;
      .confirmBtn {
        width: 116px;
        height: 32px;
        background: rgba(1, 192, 222, 1);
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 32px;
      }
    }
  }
}

.my-chose-template .dialog-fade-enter-active {
  animation: my-dialog-fade-in 0.3s;
}
.my-chose-template .dialog-fade-leave-active {
  animation: my-dialog-fade-out 0.3s;
}
@keyframes my-dialog-fade-in {
  0% {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes my-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
</style>
