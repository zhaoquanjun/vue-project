<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content">
      <el-row>
        <ChangeSite
            @getSiteId="getSiteId"
            @getSiteName="getSiteName"
        ></ChangeSite>
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
                <span class="orderText active">最新</span>
                <span class="orderText">最热</span>
                <span class="orderText">推荐</span>
              </div>
              <div style="margin-top:26px">
                <div class="tab curTab">
                  <div class="allBackground"></div>全部
                </div>
                <div class="tab" style="margin-top:10px">
                  <div class="myBackground"></div>已有网站
                </div>
              </div>
              <el-tree :data="firstIndustry" node-key="id" ref="tree" :highlight-current="true">
                <!-- <div
                  class="custom-tree-node"
                  @mouseover="handlerOver(data)"
                  @mouseleave="handlerMouseLeave"
                  slot-scope="{ node, data }"
                >
                  <button class="drop-btn" v-if="node.data.level>0 && draggable">
                    <i class="iconfont icontuodongdian"></i>
                  </button>
                  <div class="node-label-wrap" :class="{'label-weight':node.data.level<=1}">
                    <span class="node-label">{{data.label}}</span>
                    <span v-if="!isProduct">({{data.inUseSum }})</span>
                  </div>
                  <span
                    class="set-tree-type"
                    @click.stop="handleShow($event,node,data)"
                    v-show="data.id === treeNodeId && draggable"
                  >
                    <i class="iconfont iconsangedian" style="font-size:30px"></i>
                  </span>
                </div>-->
              </el-tree>
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
                  <span class="color"></span>
                  <el-select
                    v-model="languageSelect"
                    placeholder="全部语言"
                    class="firstIndustrySelect borderColor"
                    style="width:100px;vertical-align: middle;"
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
                      <img :src="item.imageUrl" alt class="itemSiteImageBackground" />
                      <div class="siteLanguage">{{_getLanguage(item.language)}}</div>
                      <div class="modal">
                        <div>
                          <button class="choseSite" @click="choseSite(item)">选择</button>
                          <button class="previewSite" @click="previewSite(item)">预览</button>
                        </div>
                      </div>
                    </div>
                    <div style="text-align:center">
                      <div class="itemSiteName">{{item.templateName}}</div>
                    </div>
                  </el-col>
                </el-row>
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
          value: "zh",
          label: "全部"
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
      firstIndustry: []
    };
  },
  computed: {},
  mounted() {
    this.getTemplateList();
    this.getFirstIndustry();
  },
  methods: {
      // 获取siteId
      getSiteId(siteId) {
          this.siteId = siteId;
      },
      // 获取siteName
      getSiteName(siteName) {
          this.siteName = siteName;
      },
    async getFirstIndustry() {
      let { data, status } = await templateApi.getFirstIndustries();
      if (status == 200) {
        this.firstIndustry = data;
      }
    },
    // 选择模版
      async choseSite(item) {
          let para = { TemplateId: item.id, CurrentSiteId: this.siteId, TemplateSiteId: item.siteId, SiteName: this.siteName }; 
          console.log(para);
         await templateApi.updateSiteTemplate(para);
    },
    // 预览模版
    previewSite() {},
    //   获取模版列表
    async getTemplateList() {
      let para = {
        TemplateName: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        ColorType: -1,
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
    searchTemplate() {},
    // 关闭弹窗
    closeDialog() {
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
        line-height: 20px;
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
        background: rgba(9, 204, 235, 1);
        border-radius: 0px 2px 2px 0px;
        opacity: 0.1;
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
        height: 100%;
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
      }
      .previewSite {
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
        background: rgba(0, 0, 0, 0.7);
      }
      &:hover {
        transform: translateY(-10px);
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
}
.member-container {
  position: relative;
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
