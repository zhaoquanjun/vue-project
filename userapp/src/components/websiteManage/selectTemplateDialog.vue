<template>
  <div class="my-chose-template">
    <el-dialog
      width="0"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal="false"
      ref="templateDialog"
      :visible.sync="templateShow"
    >
      <div class="right-pannel">
        <el-container style="height:100%">
          <div class="foldAside isShow" @click="isShowAsideList">
            <div class="foldTrangle"></div>
          </div>
          <el-aside class="aside" v-show="isShowAside">
            <div class="title">筛选</div>
            <el-input
              size="medium"
              v-model="search"
              placeholder="输入模版名称"
              @keyup.enter.native="searchTemplateAll"
              clearable
              style="width:190px" 
              class="searchTemplate"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer;color:#D7D8D9;position:absolute;right:20px;"
                slot="prefix"
                @click="searchTemplateAll"
              ></i>
            </el-input>
            <div class="order">
              <span
                v-for="(item, index) in orderType"
                :key="index"
                class="orderText"
                :class="{active:item.isOrder}"
                @click="changeOrder(item)"
              >{{item.text}}</span>
            </div>
            <div class="splitLine"></div>
            <ul class="order">
              <!-- <div
                v-for="(item, index) in firstIndustry" 
                :key="index"
              >
                <li  class="orderText"
                :class="{activeTree:isTree===item.id}"
                @click="changeIndustry(item)">
                  <el-tooltip content="Top center" placement="right-end">
                  <div class="listTitle">{{item.label}}</div>
               </el-tooltip>

                </li>
              </div> -->
              <li 
                v-for="(item, index) in firstIndustry" 
                :key="index"
                class="orderText"
                :class="{activeTree:isTree===item.id}"
                @click="changeIndustry(item)"
              >
                <el-tooltip 
                  v-if="item.children&&item.children.length>=1" class="item" effect="light" 
                  :content="(item.children&&item.children.length>=1)?item.children[0].label:''" 
                  placement="top-start"
                >
                  <div class="listTitle">{{item.label}}</div>
                </el-tooltip>
                <div v-else class="listTitle">{{item.label}}</div>
              </li>
            </ul>
            <!-- <el-tree
              :data="firstIndustry"
              node-key="id"
              ref="tree"
              accordion
              :highlight-current="true"
              class="industryTree"
              @node-click="changeIndustry"
            >
              <div slot-scope="{ node, data }">
               <template>
                    <div :class="data.id==0?'firstIndustryTitle':(data.parentId==0?'secondIndustryTitle':'thirdIndustryTitle')">{{data.label}}
                      <template v-if="data.parentId !==0">
                         <div class="thirdIndustryTitle">· {{data.label}}</div>
                     </template>
                    </div>
               </template>
            </div>
            </el-tree> -->
          </el-aside>
          <el-main>
            <!-- <div class="colorType" v-show="isAllTab">
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
            </div>-->
            <div class="templateHeader">
              <div class="templateHeaderLine"></div>
              <span class="templateHeader-text">选择您喜欢的网站模板</span>
              <i class="iconfont iconguanbi cl-iconfont is-circle" @click="closeDialog"></i>
            </div>
            <el-main 
              style="position:relative;padding:0 42px;"
              v-scrollBar
              class="templateContent"
            >
              <Waterfall v-if="showWaterFall" id="waterfall" :resizable="true" :percent="percent">
                <WaterfallItem
                  class="waterFallTemplateItem"
                  v-for="(item, index) in templateInfo"
                  :key="index"
                >
                  <div ref="imgs" style="padding-bottom:30px;margin-left:5%;">
                    <div class="itemSiteImage">
                    <div
                      class="itemSiteImageBackground"
                    >
                      <img :src="item.imageUrl" class="itemSiteImg"> 
                    </div>
                    <div class="modal" v-if="item.id != templateId">
                      <button class="cl-button cl-button--primary" @click="choseSite(item)">选择网站</button>
                      <a @click="goPrevTemplate(item)" style="margin-left:24px;">
                        <button class="cl-button cl-button--primary_notbg">预览网站</button>
                      </a>
                    </div>
                    <div class="curModal" v-show="item.id == templateId">当前选择</div>
                    <div class="itemSiteNumber">编号：{{item.id}}</div>
                  </div>
                  <div class="itemSiteInfo">
                    <div class="itemSiteInfoLeft">
                      <el-tooltip 
                        v-if="item.templateName && item.templateName.trim().length > 10" effect="light" 
                        :content="item.templateName" 
                        placement="bottom-start"
                      >
                        <div class="itemSiteName">
                          {{item.templateName.slice(0, 10) + '...'}}
                        </div>
                      </el-tooltip>
                      <div v-else class="itemSiteName">
                        {{item.templateName}}
                      </div>
                    </div>
                    <div class="itemSiteInfoRight">
                      <i class="iconfont iconicon-diannao icon-link" @click="prevPC(item.domain)"></i>
                      <i class="iconfont iconicon-des-dianhua icon-link" @click="prevMB(item.domain)"></i>
                    </div>
                  </div>
                  </div>
                </WaterfallItem>
              </Waterfall>
              <div v-else
              >
                  <el-row :gutter="80">
                  <el-col
                    :span="8"
                    class="templateItem"
                    v-for="(item, index) in templateInfo"
                    :key="index"
                  >
                    <div class="itemSiteImage">
                      <div
                        class="itemSiteImageBackground"
                      >
                        <img :src="item.imageUrl" class="itemSiteImg"> 
                      </div>
                      <div class="modal" v-if="item.id != templateId">
                        <button class="cl-button cl-button--primary" @click="choseSite(item)">选择网站</button>
                        <a @click="goPrevTemplate(item)" style="margin-left:24px;">
                          <button class="cl-button cl-button--primary_notbg">预览网站</button>
                        </a>
                      </div>
                      <div class="curModal" v-show="item.id == templateId">当前选择</div>
                    </div>
                    <div class="itemSiteInfo">
                      <div class="itemSiteInfoLeft">
                        <div class="itemSiteName">
                          {{item.templateName && item.templateName.trim().length > 10 ? item.templateName.slice(0, 10) + '...' : item.templateName}}
                        </div>
                        <div class="itemSiteName">编号：{{item.siteId}}</div>
                      </div>
                      <div class="itemSiteInfoRight">
                        <i class="iconfont iconicon-diannao icon-link" @click="prevPC(item.domain)"></i>
                        <i class="iconfont iconicon-des-dianhua icon-link" @click="prevMB(item.domain)"></i>
                      </div>
                      
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-main>
            
            <div>
              <span class="notFindTemplate" @click="notFindTemplate">未找到想要的模版？</span>
              <div style="display:none">
                <el-switch
                  v-model="showWaterFall"
                  active-color="#ff6b00"
                  inactive-color="#41494E"
                  active-text="瀑布流"
                  inactive-text="平铺"
                ></el-switch>
              </div>
              
              <!-- <div
                class="cl-pagination pageing"
                id="pageing"
                style="margin-bottom:20px"
                :class="{'noJumper':templatePage.totalPage <= 10}"
              >
                <el-pagination
                  v-if="templatePage.totalCount > 0"
                  background
                  :layout="templatePage.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                  :current-page="templatePage.pageIndex"
                  :total="templatePage.totalCount"
                  :page-size="templatePage.pageSize"
                  :page-sizes="[9,18,45]"
                  @current-change="changePage"
                  @size-change="changeSize"
                >
                  <div class="sizes-title">，每页显示</div>
                  <button v-if="templatePage.totalPages > 10" class="paging-confirm">跳转</button>
                </el-pagination>
              </div> -->
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
                  <i
                    class="iconfont iconguanbi cl-iconfont is-circle"
                    @click="closeNotFindTemplateDialog"
                  ></i>
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
                  <button class="cl-button cl-button--primary cl-button--small" @click="submit">提交</button>
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
import { designerUrl } from "@/environment/index";
import { getMemberList } from "@/api/request/siteMemberApi";
import { nextTick } from 'q';

import { Waterfall, WaterfallItem } from "vue2-waterfall"

export default {
  props: ["siteId", "siteName", "templateId", "isChangeTemplate"],
  components: {
    Waterfall,
    WaterfallItem
  },
  data() {
    return {
      percent:[1,1,1],
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
          text: "按更新时间排序",
          isOrder: true,
          type: "updataTime"
        },
        {
          text: "按热度排序",
          isOrder: false,
          type: "mostPopular"
        },
        {
          text: "按推荐排序",
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
      errorSite: "",
      showWaterFall:true,
      isShowAside:true,
      isTree:0
    };
  },
  created(){
    window.addEventListener("scroll",this.scroll,true)
    this.getWaterfallItemPercent();
  },
  computed: {},
  mounted() {
  },
  watch:{
  },
  updated(){
    
  },
  methods: {
    isShowAsideList(){
      this.$nextTick(()=>{
        let icon=document.getElementsByClassName("isShow")[0];
        if(this.isShowAside){
          icon.style.left=0;
        }else{
          icon.style.left=240+"px";
        }
        this.isShowAside=!this.isShowAside;
      })
    },
    prevPC(domain){
      window.open(`http://${domain}/prev/showtemplate/?flag=pc`,"_blank");
    },
    prevMB(domain){
      window.open(`http://${domain}/prev/showtemplate/?flag=mb`,"_blank");
    },
    getWaterfallItemPercent(){
      if(document.body.clientWidth>=1920){
        this.percent=[1,1,1,1]
      }else{
        this.percent=[1,1,1]
      }
    },
    resetScrollTop(){
      this.$nextTick(()=>{
        let scroll=document.getElementsByClassName("ps")[1];
        scroll.scrollTop=0;
        this.pageIndex=1;
        this.pageSize=9;
      })
       
    },
    async changeIndustry(item) {
      this.resetScrollTop();
      this.pageIndex=1;
      this.isTree=item.id;
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
      this.loadMore();
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
      this.resetScrollTop();
      this.pageIndex=1;
      if (this.isAllTab == true) {
        this.orderType.forEach((item, index) => {
          item.isOrder = false;
        });
        item.isOrder = true;
        this.isOrderByUpdateTime = false;
        this.isMostPopular = false;
        this.isRecommend = false;
        this.pageIndex=1;
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
        this.loadMore();
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
          this.$confirm(
            `您已选择${item.templateName}模板，是否立即开始设计？`,
            "提示",
            {
              confirmButtonText: "开始设计",
              cancelButtonText: "暂不设计",
              iconClass: "icon-success"
            }
          )
            .then(() => {
              window.location.href = `${designerUrl}?siteId=${this.siteId}`;
            })
            .catch(action => {
              if (action == "cancel") {
                this.templateShow = false;
                if (this.$route.path == "/website/selectTemplate") {
                  this.$router.push({
                    path: "/website/mysite/siteinfo"
                  });
                }
                this.$emit("getSiteInfo", this.siteId);
                this.$emit("getTodoInfo", this.siteId);
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
      this.pageIndex=1;
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
      this.loadMore();
    },
    //按搜索内容进行全部查询
    searchTemplateAll(){
      this.isAllTab = true;
      this.changeIndustry(this.firstIndustry[0].id);
      this.isTree=0;
      this.pageIndex = 1;
      this.pageSize = 9;
      
      this.orderType.forEach((item, index) => {
        item.isOrder = false;
      });
      this.orderType[0].isOrder = true;
      
      this.searchTemplate();
    },
    // 按筛选条件查询
    async searchTemplate() {
      this.pageIndex=1;
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
      this.templateInfo=data.items
      // this.templateInfo =[...this.templateInfo,...data.items];
    },
    async changePage(page) {
      this.pageIndex = page;
      this.searchTemplate();
    },
    changeSize(page) {
      this.pageSize = page;
      this.searchTemplate();
    },
    async loadMore(){
      if( this.pageIndex<=this.templateInfo.length/this.pageSize){
        this.pageIndex+=1;
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
        this.templatePage = data;
        this.templateInfo =[...this.templateInfo,...data.items];
      }
    },
     scroll(){
       this.$nextTick(()=>{
          let scrollTop=document.getElementsByClassName("ps")[1].scrollTop;
          let scrollHeight=document.getElementsByClassName("ps")[1].scrollHeight;
          let innerHeight=window.innerHeight;
          if( parseFloat(scrollTop+innerHeight)>=parseFloat(scrollHeight)*2/3 ){
            this.loadMore();
          }
       })
    },
    // 关闭弹窗
    closeDialog() {
      this.changeIndustry(this.firstIndustry[0].id);
      this.isTree=0;
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
    // // 选择全部模版
    // async choseAllTab() {
    //   this.isAllTab = true;
    //   this.orderType.forEach((item, index) => {
    //     item.isOrder = false;
    //     if (item.type == "updataTime") {
    //       item.isOrder = true;
    //     }
    //   });
    //   this.search = "";
    //   this.colorArray.forEach((item, index) => {
    //     if (item.code == "") {
    //       item.isCur = true;
    //       this.themeSelect = "";
    //     } else {
    //       item.isCur = false;
    //     }
    //   });
    //   this.firstIndustryId = 0;
    //   this.secondIndustryId = 0;
    //   this.getTemplateList();
    // },
    // // 选择已有网站
    // async choseMyTab() {
    //   this.isAllTab = false;
    //   let para = {
    //     siteName: this.search,
    //     PageIndex: this.pageIndex,
    //     PageSize: this.pageSize
    //   };
    //   let { data, status } = await templateApi.getTemplateSites(para);
    //   this.templatePage = data;
    //   this.templateInfo = data.items;
    // },
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
            window.innerHeight - 160 + "px";
            this.getWaterfallItemPercent();
        });
        document.getElementsByClassName("templateContent")[0].style.height =
          window.innerHeight - 160 + "px";
      });
    },
    goPrevTemplate(item){
      let routeData = this.$router.resolve({
        name: "prevtemplate",
        query: {
          CurrentSiteId: this.siteId,
          SiteName: this.siteName,
          Domain: item.domain,
          TemplateId: item.id,
          TemplateSiteId: item.siteId
        }
     });
      window.open(routeData.href, '_blank')
    },
   
  },
  destroyed(){
    window.removeEventListener('scroll', this.scroll,true)
    // window.removeEventListener("resize",this.windowResize,true);
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
<style lang="scss" scoped>
.waterfall /deep/ .waterfall-box{
  padding-right: 20px;
  box-sizing: border-box
}
.languageSelect /deep/ .el-input__inner {
  border: none;
  
}
.searchTemplate /deep/ .el-input__inner:focus{
  border:1px solid $--color-primary;
  background:transparent;
  border-radius: 4px;
}
.searchTemplate /deep/ .el-input__prefix{
  position: relative;
  left: 0;
}
.searchTemplate /deep/ .el-input__inner{
  border:1px solid rgba(89,99,104,1);
  background:#41494E;
  border-radius: 4px;
  color: $--color-white;
}
.right-pannel /deep/ .el-tree{
  background: $--color-black-light;
}

.industryTree /deep/ .is-leaf {
  display: none;
}
.industryTree /deep/ .el-tree-node__content {
  height: 44px;
}
.industryTree /deep/ .el-tree-node__content {
  background: $--color-black-light;
}
.industryTree /deep/.el-tree-node.is-expanded.is-current.is-focusable .secondIndustryTitle{
  font-size: $--font-size-base !important;
}
.industryTree /deep/ .el-tree-node__expand-icon {
  position: absolute;
  right: 25px;
  color: $--color-white;
}
.industryTree /deep/ .expanded {
  transform: rotate(90deg);
}

.right-pannel {
  background: $--color-black-dark;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transition: width 0.2s linear;
  color: $--color-white;
  // overflow: hidden;
  .foldAside{
    position:fixed;
    top:50%;
    left:240px;
    z-index:2000;
    width: 12px;
    height:50px;
    margin-top:-25px;
    background:$--color-black-light;
    cursor: pointer;
    &:hover{
      .foldTrangle{
        border-right-color: $--color-primary;
      }
    }
    .foldTrangle{
      width: 0;
      margin: 21px auto;
      border:4px solid #fff;
      border-top:4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: none;
    }
  }
  .aside {
    width:240px !important;
    overflow: hidden;
    height: 100%;
    background: $--color-black-light;
    text-align: center;
    color: $--color-white;
    .title {
      font-size: $--font-size-base;
      font-weight: $--font-weight-primary;
      margin: 24px auto;
    }
    .order {
      margin-top: 20px;
      .orderText {
        width: 100%;
        height: 44px;
        display: inline-block;
        font-size: $--font-size-small;
        font-weight: $--font-weight-base;
        line-height: 44px;
        cursor: pointer;
        padding-left: 24px;
        box-sizing: border-box;
        text-align: left;
        &:hover{
          background: #41494E;
        }
      }
      .active {
        background: #41494E;
        color:$--color-primary;
      }
    }
    .splitLine {
      margin: 15px auto;
      box-sizing: border-box;
      width: calc(100% - 48px);
      height: 2px;
      background-color:#41494E;
    }
    .firstIndustryTitle{
      height:44px;
      display: block;
      width: 240px;
      background: #41494E;
      font-size: $--font-size-small;
      font-weight: 400;
      color: $--color-white;
      line-height: 44px;
      padding-left: 30px;
      text-align: left;
    }
    .secondIndustryTitle{
      display: block;
      width: 240px;
      font-size: $--font-size-small;
      background: $--color-black-light;
      font-weight: 400;
      color: $--color-white;
      line-height: 44px;
      padding-left: 30px;
      text-align: left;
      position: relative;
      &:hover{
        .thirdIndustryTitle{
          display: block;
        }
      }
    }
    .thirdIndustryTitle{
      display: block;
      width: 240px;
      font-size: $--font-size-small;
       background: $--color-black-light;
      font-weight: 400;
      color: $--color-white;
      line-height: 44px;
      padding-left: 15px;
      text-align: left;
      &:hover{
        color:$--color-primary;
      }
    }
  }
  .templateHeader {
    // display: flex;
    // justify-content: space-between;
    padding-top: 40px;
    margin-bottom: 30px;
    text-align: center;
    position: relative;
    .templateHeaderLine{
      width: 348px;
      height:11px;
      position: absolute;
      top:0;
      right:0;
      left:-64px;
      bottom: 0;
      margin: 54px auto 0;
      background: $--color-primary;
      opacity: .4;
    }
    .templateHeader-text {
      position: relative;
      z-index: 100;
      font-size: 30px;
      font-weight: 100;
      color: $--color-white;
    }
    .iconguanbi {
      float: right;
      font-size: $--font-size-large;
      margin-right: 30px;
      color: $--color-white;
      &:hover{
        color:$--color-primary;
        background:#40474C;
      }
    }
    ·
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
  .activeTree {
    background: #41494E;
    color: $--color-primary;
  }
  .listTitle{
      position: relative;
       .listDescribe{
          display: none;
          position: absolute;
          top:-15px;
          left: 70px;
          width: 140px;
          box-sizing: border-box;
          line-height: 20px;
          height: 20px;
        } 
    }
    

  .templateItem {
    padding: 0 30px 30px 0;
    width:370px;
    position: relative;
    .itemSiteImage {
      position: relative;
      width: 340px;
      transition: all 0.3s ease-in;
      &:hover {
        // transform: translateY(-15px);
        // box-shadow: 0px 15px 15px -15px #b9cbcf;
        .modal {
          opacity: 1;
        }
      }
      .itemSiteImageHeader {
        width: 30px;
      }
      .itemSiteImageBackground {
        width: 100%;
        padding-bottom: 62%;
        position: relative;
        .itemSiteImg{
          width:340px;
          height: 340px;
        }
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
        background: rgba(0, 0, 0, 0.8);
        transition: all 0.2s linear;
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
  }
  .waterFallTemplateItem {
    padding: 0 30px 30px 0;
    // width:370px;
    // float: left;
    width: 100%;
    .itemSiteImage {
      position: relative;
      // width: 340px;
      width: 100%;
      transition: all 0.3s ease-in;
      &:hover {
        // transform: translateY(-15px);
        // box-shadow: 0px 15px 15px -15px #b9cbcf;
        .modal {
          opacity: 1;
        }
      }
      .itemSiteImageHeader {
        width: 30px;
      }
      .itemSiteImageBackground {
        // width:340px;
        width:100%;
        position: relative;
        .itemSiteImg{
          // width:340px;
          width:100%;
          height: auto;
          display: block;
        }
      }
      .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        // width: 340px;
        width:100%;
        height: 100%;
        opacity: 0;
        background: rgba(0, 0, 0, 0.8);
        transition: all 0.2s linear;
      }
      .curModal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        // width: 340px;
        width:100%;
        height: 100%;
        opacity: 1;
        background: rgba(0, 0, 0, 0.5);
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
      .itemSiteNumber{
        position: absolute;
        display: block;
        padding: 4px 12px;
        background: #1F2325;
        right: 0;
        bottom: 0;
        text-align: right;
      }
    }
    .itemSiteInfo{width:33.3%}
  }
  .templateContent{
    .itemSiteInfo{
      display: flex;
      justify-content: space-between;
      font-size: $--font-size-base;;
      font-weight: $--font-weight-base;
      color: $--color-white;       
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      height:40px;
      // width: 340px;
      width: 100%;
      background: $--color-black-light;
      .itemSiteInfoLeft{
        display: flex;
        flex-direction: column;
        justify-content: center;
        .itemSiteName {
          padding-left:16px; 
          line-height: 24px;
        }
      }
      .itemSiteInfoRight{
        display: flex;
        align-items: center;
        margin-right: 10px;
        .icon-link{
          display: inline-block;
          padding:5px;
          color:$--color-white;
          &:hover{
            color:$--color-primary;
            background: #40474C;
          }
        }
      }
    }
  }
  .notFindTemplate {
    cursor: pointer;
    display: inline-block;
    margin-top: 24px;
    font-size: $--font-size-base;
    font-weight: $--font-weight-base;
    color: $--color-primary;
    margin-left: 50px;
  }
  //右侧弹框
  .notFindTemplate-pannel {
    background: $--color-white;
    position: fixed;
    z-index: 2200;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: $--border-radius-base;
    overflow: hidden;
    .pannel-head {
      padding: 16px 24px 16px 32px;
      border-bottom: $--border-base;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .headTitle {
        font-size: $--font-size-medium;
        font-weight: $--font-weight-primary;
        color: $--color-text-primary;
      }
    }
    .tips {
      width: 537px;
      height: 32px;
      background: rgba(242, 255, 234, 1);
      border-radius: $--border-radius-base;
      border: 1px solid rgba(199, 221, 185, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 182, 57, 1);
      line-height: 32px;
      text-align: center;
      margin: 16px 32px 24px;
    }
    .industry {
      height: 72px;
      padding-left: 32px;
      font-size: $--font-size-small;
      font-weight: $--font-weight-primary;
      color: $--color-text-primary;
    }
    .reference {
      height: 72px;
      padding-left: 32px;
      font-size: $--font-size-small;
      font-weight: $--font-weight-primary;
      color: $--color-text-primary;
    }
    .description {
      padding-left: 32px;
      font-size: $--font-size-small;
      font-weight: $--font-weight-primary;
      color: $--color-text-primary;
    }
    .confirm {
      width: 100%;
      height: 64px;
      padding-right: 32px;
      box-sizing: border-box;
      text-align: right;
      margin-top: 24px;
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
