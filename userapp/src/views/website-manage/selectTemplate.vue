<template>
  <el-container class="member-container">
    <el-main class="member-content">
      <el-row>
        <ChangeSite @getSiteId="getSiteId" @getSiteName="getSiteName"></ChangeSite>
      </el-row>
      <el-row class="wrap">
        <el-col :span="8" style="min-width: 500px; max-width: 688px;">
          <img src="~img/siteManage/selectTemplate.png" alt class="backgroundImg" />
        </el-col>
        <el-col :span="8">
          <div class="tempalte-selected__section">
            <el-col class="textOne">选择网站模板，立即开启网站管理</el-col>
            <el-col class="textTwo">建立您的第一个专业网站。</el-col>
            <button class="select" @click="showTemplate">选择模版</button>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <div class="my-chose-template">
      <el-dialog
        width="0"
        :show-close="false"
        :close-on-click-modal="false"
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
                <div class="tab curTab">
                  <div class="allBackground"></div>全部
                </div>
                <div class="tab" style="margin-top:10px">
                  <div class="myBackground"></div>已有网站
                </div>
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
            <el-main>
              <el-header
                class="templateHeader"
                style="height:136px;padding:48px 81px;border-bottom:1px solid #E5E5E5"
              >
                <el-input
                  size="medium"
                  v-model="search"
                  placeholder="输入名称搜索"
                  class="input-with-select"
                  style="width:260px"
                >
                  <i
                    class="el-icon-search el-input__icon"
                    style="cursor: pointer;"
                    slot="suffix"
                    @click="searchTemplate"
                  ></i>
                </el-input>
                <div class="colorType">
                  <span class="colorTheme">主题</span>
                  <span class="color">
                    <div
                      v-for="(item, index) in colorArray"
                      :key="index"
                      class="colorItem"
                      :class="{curColorItem:item.isCur}"
                      :style="{background:item.color}"
                      @click="changeColor(item)"
                    ></div>
                  </span>
                  <el-select
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
                  </el-select>
                </div>
                <span class="close-pannel" @click="closeDialog">
                  <i
                    class="iconfont iconX"
                    style="line-height:40px;font-size:14px;color:rgba(140,140,140,1);"
                  ></i>
                </span>
              </el-header>
              <el-main style="padding:60px 81px;">
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
                      ></div>
                      <div class="siteLanguage">{{_getLanguage(item.language)}}</div>
                      <div class="modal">
                        <div>
                          <div class="choseSite" @click="choseSite(item)">选择</div>
                          <a :href="item.domain" class="previewSite" target="_blank">预览</a>
                        </div>
                      </div>
                    </div>
                    <div style="text-align:center">
                      <div class="itemSiteName">{{item.templateName}}</div>
                    </div>
                  </el-col>
                </el-row>
                <div>
                  <!-- <span class="dislikeTemplate">未找到想要的模版？</span> -->
                  <div class="pageing" id="pageing" style="margin-bottom:20px">
                    <el-pagination
                      background
                      layout="total, slot, sizes, prev, pager, next"
                      :current-page="templatePage.pageIndex"
                      :total="templatePage.totalCount"
                      :page-count="templatePage.totalPages"
                      :page-size="templatePage.pageSize"
                      :page-sizes="[10,20,50]"
                      @current-change="changePage"
                      @size-change="changeSize"
                    ></el-pagination>
                  </div>
                </div>
              </el-main>
            </el-main>
          </el-container>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import * as templateApi from "@/api/request/templateApi";
import { getLanguage } from "@/configure/appCommon";
import { designerUrl } from "@/environment/index";

export default {
  components: {
    PageSubmenu,
    ChangeSite
  },
  data() {
    return {
      siteId: 0,
      siteName: "",
      templateShow: false,
      templatePage: {},
      templateInfo: [],
      languageSelect: "",
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
          color: "rgba(98,54,255,1)",
          isCur: true
        },
        {
          color: "rgba(5,149,230,1)",
          isCur: false
        },
        {
          color: "rgba(99,220,140,1)",
          isCur: false
        },
        {
          color: "rgba(254,152,55,1)",
          isCur: false
        },
        {
          color: "rgba(251,77,104,1)",
          isCur: false
        },
        {
          color: "rgba(74,72,249,1)",
          isCur: false
        },
        {
          color: "rgba(185,203,207,1)",
          isCur: false
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
      secondIndustryId: 0
    };
  },
  computed: {},
  mounted() {
    this.getTemplateList();
    this.getIndustryTree();
  },
  methods: {
    async changeIndustry(item) {
      console.log(item);
      this.firstIndustryId = 0;
      this.secondIndustryId = 0;
      if (item.parentId == 0) {
        this.firstIndustryId = item.id;
      } else {
        this.firstIndustryId = item.parentId;
        this.secondIndustryId = item.id;
      }
      let para = {
        TemplateName: "",
        FirstIndustry: this.firstIndustryId,
        SecondIndustry: this.secondIndustryId,
        Theme: "",
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: 1,
        PageSize: 10,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
    },
    // 获取siteName
    getSiteName(siteName) {
      this.siteName = siteName;
    },
    // 获取行业树
    async getIndustryTree() {
      let { data, status } = await templateApi.getIndustryTree();
      if (status == 200) {
        this.firstIndustry = data;
      }
    },
    // 切换语言
    async changeLanguage() {
      let para = {
        TemplateName: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        Theme: "",
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: 1,
        PageSize: 10,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 选择主题颜色
    changeColor(item) {
      this.colorArray.forEach((item, index) => {
        item.isCur = false;
      });
      item.isCur = true;
      console.log(item);
    },
    // 选择最新/最热/推荐
    async changeOrder(item) {
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
        TemplateName: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        Theme: "",
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: 1,
        PageSize: 10,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      console.log(data);
      this.templatePage = data;
      this.templateInfo = data.items;
    },

    // 选择模版
    async choseSite(item) {
      let para = {
        TemplateId: item.id,
        CurrentSiteId: this.siteId,
        TemplateSiteId: item.siteId,
        SiteName: this.siteName
      };
      await templateApi.updateSiteTemplate(para);
      this.$confirm(`模版复制成功！是否前往设计页面？`, "提示", {
        confirmButtonText: "前往设计页面",
        cancelButtonText: "取消",
        iconClass: "icon-success",
        distinguishCancelAndClose: true
      })
        .then(() => {
          window.location.href = `${designerUrl}?siteId=${this.siteId}`;
        })
        .catch(action => {
          if (action == "cancel") {
            this.$router.push({
              path: "/website/mysite"
            });
          }
        });
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
        PageIndex: 1,
        PageSize: 10,
        IsOrderByUpdateTime: true,
        IsMostPopular: false
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      console.log(data);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    // 查询
    async searchTemplate() {
      let para = {
        TemplateName: this.search,
        FirstIndustry: 0,
        SecondIndustry: 0,
        ColorType: -1,
        Language: this.languageSelect,
        IsRecommend: this.isRecommend,
        PageIndex: 1,
        PageSize: 10,
        IsOrderByUpdateTime: this.isOrderByUpdateTime,
        IsMostPopular: this.isMostPopular
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      console.log(data);
      this.templatePage = data;
      this.templateInfo = data.items;
    },
    changePage() {},
    changeSize() {},
    // 关闭弹窗
    closeDialog() {
      this.search = "";
      this.templateShow = false;
    },
    // 显示选择模版弹框
    showTemplate() {
      this.templateShow = true;
    },
    // 转换语言
    _getLanguage(language) {
      return getLanguage(language);
    }
  }
};
</script>
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
  top: 60px;
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
    .curTab {
      background: rgba(9, 204, 235, 0.1);
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
    }
    .colorType {
      height: 40px;
      display: inline-block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
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
        vertical-align: middle;
        display: inline-block;
        width: 194px;
        height: 40px;
        background: rgba(9, 204, 235, 0.1);
        border-radius: 0px 2px 2px 0px;
        .colorItem {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 2px;
          margin-top: 12px;
          margin-left: 8px;
          vertical-align: middle;
        }
        .colorItem:first-child {
          margin-left: 16px;
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
        background: rgba(255, 255, 255, 0.95);
        border-radius: 4px 4px 0px 0px;
        border: 1px solid rgba(185, 203, 207, 1);
      }
      &:hover {
        transform: translateY(-15px);
        box-shadow: 0px 15px 15px -15px #b9cbcf;
        .modal {
          opacity: 1;
        }
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
  .dislikeTemplate {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 112, 204, 1);
    line-height: 20px;
  }
}
.member-container {
  position: relative;
  height: 100vh;
}

.wrap {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  .backgroundImg {
    width: 100%;
  }
  .tempalte-selected__section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .textOne {
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
  }
  .textTwo {
    margin-top: 16px;
    margin-left: 63px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  .select {
    margin-top: 32px;
    margin-left: 63px;
    width: 202px;
    height: 44px;
    border: 1px solid rgba(0, 193, 222, 1);
    font-size: 12px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 193, 222, 1);
    line-height: 44px;
    &:hover {
      background: rgba(1, 192, 222, 1);
      color: rgba(255, 255, 255, 1);
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
@media screen and (max-width: 1650px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 24px !important;
  }
  .wrap .select {
    width: 180px;
    height: 40px;
    line-height: 40px;
  }
}
@media screen and (max-width: 1440px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 20px !important;
  }
  .wrap .select {
    width: 140px;
    height: 30px;
    line-height: 30px;
  }
}
@media screen and (max-width: 1260px) {
  .wrap .textOne,
  .wrap .textTwo {
    font-size: 16px !important;
  }
}
</style>
