<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
        :changeSiteName="siteName"
        :changeSiteLanguage="language"
      />
      <div class="siteInfo-wrap">
        <div class="siteInfo-title">网站管理</div>
        <div class="siteInfo">
          <div>
            <div class="siteImg">
              <img src="~img/siteManage/siteHeader.png" class="itemSiteImageHeader" />
              <div
                class="siteImgBackground"
                :style="{background: 'url(' + ( siteImage ) + ') no-repeat center/cover'}"
              >
                <div class="modal" @click="changeTemplate()">
                  <button class="choseSite">更换模版</button>
                </div>
                <dir class="changeTemplate">更换模板</dir>
              </div>
            </div>
            <div class="siteinfoWrap">
              <div class="siteinfoItem siteName">
                <span>网站名称：</span>
                <span>{{siteName && siteName.trim().length > 20 ? siteName.slice(0, 20) + '...' : siteName}}</span>
                <span class="language">{{_getLanguage()}}</span>
                <i
                  class="iconfont iconicon-dash-edit"
                  style="font-size:12px;margin-left:8px"
                  @click="changeSiteInfoShow"
                ></i>
              </div>
              <div class="siteinfoItem">
                <span>网站地址：</span>
                <a
                  class="siteinfoDomain"
                  :href="`http://${secondDomain}`"
                  target="_blank"
                >{{secondDomain}}</a>
              </div>
              <div class="siteinfoItem">
                <span>绑定域名：</span>
                <span>{{domain ? domain : "未绑定"}}</span>
                <button class="bindDomain" @click="bindDomain">绑定域名</button>
              </div>
              <div class="siteinfoItem">
                <span>发布时间：</span>
                <span>{{lastPublishedTime ? lastPublishedTime : "未发布"}}</span>
              </div>
            </div>
          </div>
          <div class="rightWrap">
            <button
              class="cl-button cl-button--primary cl-button--small"
              style="margin-top:8px"
              @click="toDesign"
            >设计</button>
            <a :href="`http://${secondDomain}`" target="_blank" style="margin-top:16px">
              <button class="cl-button cl-button--primary_notbg cl-button--small">预览</button>
            </a>
          </div>
        </div>
      </div>
      <div class="domain-menu">
        <el-tabs v-model="siteInfoType" @tab-click="handleClick">
          <el-tab-pane label="流量统计" name="flow"></el-tab-pane>
          <el-tab-pane label="网站设置" name="setting"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="siteDetailinfo-wrap">
        <div v-show="siteInfoType === 'flow'" class="flowDetai">
          <div class="flowHeader">
            <el-select
              v-model="flowDay"
              @change="choseFlowDay"
            >
              <el-option
                v-for="item in flowDayList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
            <p>
              <span>
                <i></i>
                PV
              </span>
              <span>
                <i></i>
                UV
              </span>
              数据来源友盟+
              <a href="">查看更多</a>
            </p>
          </div>
          <div id="myChart" class="myChat"></div>
        </div>
        <div class="siteDetailinfo" v-show="siteInfoType === 'setting'">
          
          <div class="siteType-wrap">
            <div class="siteType">
              <span>网站类型：</span>
              <span class="siteType-info">
                <el-radio-group v-model="chosedSiteType" @change="changeSitetype">
                  <el-radio label="个人">个人</el-radio>
                  <el-radio label="企业">企业</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="siteType">
              <span>所属行业：</span>
              <span class="siteType-info">
                <el-select
                  v-model="siteFirstIndustryValue"
                  placeholder="请选择行业"
                  @change="choseIndustry"
                >
                  <el-option
                    v-for="item in siteFirstIndustry"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </span>
            </div>
          </div>
          <div class="siteSetting-wrap">
            <div class="siteSetting">
              <div class="siteSetting-item">
                <div class="siteSetting-left">
                  <span class="siteSettingText">网站图标：</span>
                  <el-tooltip
                    effect="dark"
                    content="上传网站icon后，浏览器标签左侧会显示您上传的图片，为保证浏览效果，推荐图片尺寸为256x256像素，大小不超过500KB，仅支持.png格式"
                    placement="top-start"
                  >
                    <i class="iconfont iconicon-exclamationmark"></i>
                  </el-tooltip>
                </div>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadPicUrl"
                  :headers="headers"
                  :show-file-list="false"
                  ref="upload"
                  :on-success="iconAvatarSuccess"
                  :on-error="iconAvatarError"
                  :before-upload="iconAvatarUpload"
                >
                  <div v-if="!iconUrl" class="iconNull">
                    <i class="iconfont iconicon-dash-cloudx"></i>
                  </div>
                  <img v-if="iconUrl" :src="iconUrl" class="iconImg" />
                  <div class="iconHover">
                    <i class="iconfont iconicon-dash-cloudx"></i>
                  </div>
                </el-upload>
                <!-- <i v-if="iconUrl" class="iconfont iconshanchu" @click="removeIcon"></i> -->
              </div>
              <div class="siteSetting-item">
                <div class="siteSetting-left">
                  <span class="siteSettingText">显示阿里云服务信息：</span>
                  <el-tooltip
                    effect="dark"
                    content="关闭显示阿里云服务信息后，网页底部将不再显示“本网站由阿里云提供云计算及安全服务”文字"
                    placement="top-start"
                  >
                    <i class="iconfont iconicon-exclamationmark"></i>
                  </el-tooltip>
                </div>
                <el-switch
                  @change="updateSiteServiceInfo"
                  v-model="siteServiceInfoValue"
                  style="margin: -2px 0 0 16px"
                ></el-switch>
              </div>
            </div>
            <div class="siteSetting">
              <div class="siteSetting-item">
                <div class="siteSetting-left">
                  <span class="siteSettingText">禁止右键保存图片：</span>
                  <el-tooltip
                    effect="dark"
                    content="开启右键保存图片后，将无法在网站内使用右键保存图片"
                    placement="top-start"
                  >
                    <i class="iconfont iconicon-exclamationmark"></i>
                  </el-tooltip>
                </div>
                <el-switch
                  @change="updateSiteRightCopy"
                  v-model="siteRightCopyValue"
                  style="margin: -2px 0 0 16px"
                ></el-switch>
              </div>
              <div class="siteSetting-item">
                <div class="siteSetting-left">
                  <span class="siteSettingText">启用Powered by：</span>
                  <el-tooltip
                    effect="dark"
                    content="关闭Powered by后，网页底部将不再显示“Powered by CloudDream”文字"
                    placement="top-start"
                  >
                    <i class="iconfont iconicon-exclamationmark"></i>
                  </el-tooltip>
                </div>
                <el-switch
                  @change="isOpenPowered"
                  v-model="isOpenPoweredValue"
                  style="margin-left:16px"
                ></el-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        width="0"
        :visible.sync="changeSiteShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'520px'}">
          <div class="pannel-head">
            <span class="headTitle">设置站点</span>
            <span class="close-pannel" @click="closeChangeDialog">
              <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
            </span>
          </div>
          <div class="createSiteName">
            <span class="createSiteTitle">站点名称</span>
            <el-input
              v-model="changeSiteName"
              @blur="blurSiteName(changeSiteName)"
              placeholder="请输入内容"
              class="createSiteNameInput"
            ></el-input>
            <div class="ym-form-item__error" v-show="errorSiteName">{{errorSiteNameText}}</div>
          </div>
          <div style="margin-top:16px">
            <div class="createSiteTitle">站点语言</div>
            <el-radio-group v-model="changeRadio">
              <el-radio label="zh-CN">中文</el-radio>
              <el-radio label="en-US">英文</el-radio>
              <el-radio label="ja-JP">日文</el-radio>
              <el-radio label="es-ES">西班牙语</el-radio>
              <el-radio label="ko-KR">韩语</el-radio>
            </el-radio-group>
          </div>
          <div class="create">
            <button
              @click="closeChangeDialog"
              class="cl-button cl-button--primary_notbg cl-button--small"
            >取消</button>
            <button @click="changeSiteInfo" class="cl-button cl-button--primary cl-button--small">确定</button>
          </div>
        </div>
      </el-dialog>
      <SelectTemplateDialog
        ref="selectTemplateDialog"
        :siteId="siteId"
        :isChangeTemplate="isChangeTemplate"
        :siteName="siteName"
        :templateId="templateId"
        @getSiteInfo="getSiteInfo"
      ></SelectTemplateDialog>
    </el-main>
  </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import securityService from "@/services/authentication/securityService";
import ChangeSite from "@/components/websiteManage/changeSite";
import SelectTemplateDialog from "@/components/websiteManage/selectTemplateDialog.vue";
import * as siteBackupApi from "@/api/request/siteBackupApi";
import * as dashboardApi from "@/api/request/dashboardApi";
import { getLanguage } from "@/configure/appCommon";
import { formatDateTime } from "@/api/index";
import environment from "@/environment/index.js";
import { designerUrl } from "@/environment/index";
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
//require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
export default {
  components: {
    PageSubmenu,
    ChangeSite,
    SelectTemplateDialog
  },
  data() {
    return {
      isChangeTemplate: true,
      siteName: "",
      siteImage: "",
      siteId: 0,
      templateId: 0,
      domain: "",
      secondDomain: "",
      lastPublishedTime: "",
      language: "",
      chosedSiteType: "",
      siteFirstIndustryValue: "",
      siteFirstIndustry: [],
      flowDay: '近7天',
      flowDayList: [{id:0,label: '近7天'},{id:1,label: '近30天'}],
      interval: 0,
      pvList: [],
      uvList: [],
      yList: [],
      yLast: [],
      pvLast: [],
      uvLast: [],
      firstIndustryId: 0,
      siteSecondIndustryValue: "",
      siteSecondIndustry: [],
      secondIndustryId: 0,
      siteServiceInfoValue: false,
      isOpenPoweredValue: false,
      siteRightCopyValue: false,
      changeRadio: "",
      changeSiteName: "",
      changeSiteShow: false,
      errorSiteName: false,
      errorSiteNameText: "",
      iconUrl: "",
      headers: {
        Authorization: ""
      },
      uploadPicUrl: environment.uploadPicUrl + "/0",
      siteInfoType: "flow",
      screenWidth: document.body.clientWidth, // 屏幕宽度
      timer: true,
      myChart:null
    };
  },
  mounted () {
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    },
    this.getPvUvIp()
  },
  methods: {
    handleClick() {},
    // 展示修改site信息弹框
    changeSiteInfoShow() {
      this.changeSiteName = this.siteName;
      this.changeRadio = this.language;
      this.changeSiteShow = true;
    },
    async getPvUvIp() {
      let data = await dashboardApi.getPvUvIp(this.siteId)
      if (data && data.status == 200) {
        this.pvList = [];
        this.uvList = [];
        this.yList=[];
        this.yLast= [];
        this.pvLast=[];
        this.uvLast=[];
        if(data.data.length > 0) {
          data.data.map((item, index)=>{
            this.pvList.push(item.pv);
            this.yList.push(item.dateTime.slice(5,10))
            if(index > 23) {
              this.pvLast.push(item.pv);
              this.yLast.push(item.dateTime.slice(5,10))
            }
          })
          data.data.map((item, index)=>{
            this.uvList.push(item.uv)
            if(index > 23) {
              this.uvLast.push(item.uv);
            }
          })
        }
        this.initCode()
      }
    },
    // 关闭修改site弹窗
    closeChangeDialog() {
      this.changeSiteShow = false;
    },
    // 创建站点Inputblur
    blurSiteName(name) {
      if (name == "") {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能为空";
        return;
      } else {
        this.errorSiteName = false;
        this.errorSiteNameText = "";
      }
      if (name.length > 20) {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能超过20个字符，请重新输入";
        return;
      } else {
        this.errorSiteName = false;
        this.errorSiteNameText = "";
      }
    },
    // 确定修改site信息
    async changeSiteInfo() {
      if (this.changeSiteName == "") {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能为空";
        return;
      }
      if (this.changeSiteName.length > 20) {
        this.errorSiteName = true;
        this.errorSiteNameText = "站点名称不能超过20个字符，请重新输入";
        return;
      }
      let para = {
        siteId: this.siteId,
        siteName: this.changeSiteName,
        language: this.changeRadio
      };
      let { data, status } = await dashboardApi.updateSiteInfo(para);
      if (status == 200) {
        this.siteName = this.changeSiteName;
        this.language = this.changeRadio;
        this.changeSiteShow = false;
        this.$notify({
          customClass: "notify-success",
          message: `修改成功`,
          duration: 2000,
          showClose: false
        });
      }
    },
    // 切换网站类型
    async changeSitetype() {
      await dashboardApi.updateSiteType({
        siteId: this.siteId,
        siteType: this.chosedSiteType
      });
    },
    // 切换网站行业
    async choseIndustry() {
      await dashboardApi.updateSiteIndustry({
        siteId: this.siteId,
        firstIndustryId: this.siteFirstIndustryValue
      });
    },
    //启用Powered by
    async isOpenPowered() {
      await siteBackupApi.updateSitePoweredBy({
        siteId: this.siteId,
        PoweredBy: this.isOpenPoweredValue
      });
    },
    //禁止右键保存图片
    async updateSiteRightCopy() {
      await siteBackupApi.updateSiteRightCopy({
        siteId: this.siteId,
        AllowedRightCopy: this.siteRightCopyValue
      });
    },
    //显示阿里云服务信息
    async updateSiteServiceInfo() {
      await siteBackupApi.updateSiteServiceInfo({
        siteId: this.siteId,
        AliServiceInfo: this.siteServiceInfoValue
      });
    },
    //删除icon
    async removeIcon() {
      let data = await siteBackupApi.updateSiteIcon({
        siteId: this.siteId,
        Icon: ""
      });
      if (data && data.status == 200) {
        this.iconUrl = "";
        this.$notify({
          customClass: "notify-success",
          message: `删除成功`,
          duration: 1500,
          showClose: false
        });
      } else {
        this.$notify({
          customClass: "notify-error",
          message: `删除失败`,
          duration: 1500,
          showClose: false
        });
      }
    },
    //上传图片成功回调
    async iconAvatarSuccess(res, file) {
      let data = await siteBackupApi.updateSiteIcon({
        siteId: this.siteId,
        Icon: res
      });
      if (data && data.status == 200) {
        this.iconUrl = res;
        this.$notify({
          customClass: "notify-success",
          message: `上传成功`,
          duration: 2000,
          showClose: false
        });
      } else {
        this.$notify({
          customClass: "notify-error",
          message: `上传失败`,
          duration: 1500,
          showClose: false
        });
      }
    },
    //上传图片失败回调
    iconAvatarError() {
      this.$notify({
        customClass: "notify-error",
        message: `上传失败`,
        duration: 1500,
        showClose: false
      });
    },
    //上传之前判断
    iconAvatarUpload(file) {
      const isJPG = file.type === "image/png";
      const isLt2M = file.size < 500 * 1024;
      if (!isJPG) {
        this.$notify({
          customClass: "notify-error",
          message: `请上传png格式图片，大小不超过500k`,
          duration: 1500,
          showClose: false
        });
        return false;
      }
      if (!isLt2M) {
        this.$notify({
          customClass: "notify-error",
          message: `请上传png格式图片，大小不超过500k`,
          duration: 1500,
          showClose: false
        });
        return false;
      }
      return isJPG && isLt2M;
    },
    // 跳转至设计器
    toDesign() {
      window.location.href = `${designerUrl}?siteId=${this.siteId}`;
    },
    // 获取siteId
    async getSiteId(siteId) {
      this.siteId = siteId;
      this.getSiteInfo(siteId);
      if (this.$store.state.dashboard.appId) {
        this.headers.appId = this.$store.state.dashboard.appId;
      }
      let data = await securityService.getUser();
      if (data && data.access_token) {
        this.headers.Authorization = "Bearer " + data.access_token;
      }
    },
    _getLanguage() {
      return getLanguage(this.language);
    },
    // 更换模板
    changeTemplate() {
      this.$refs.selectTemplateDialog.showTemplate();
    },
    // 获取站点信息
    async getSiteInfo(siteId) {
      this.$Loading.show();
      let { data, status } = await siteBackupApi.getSiteInfo(siteId);
      this.$Loading.hide();
      if (status === 200) {
        this.siteName = data.siteName;
        this.siteImage = data.siteImage;
        this.domain = data.domain;
        this.secondDomain = data.secondDomain;
        this.templateId = data.templateId;
        this.iconUrl = data.icon;
        this.isOpenPoweredValue = data.poweredBy;
        this.siteServiceInfoValue = data.aliServiceInfo;
        this.siteRightCopyValue = data.allowedRightCopy;
        this.lastPublishedTime = formatDateTime(
          data.lastPublishedTime,
          "yyyy-MM-dd hh:mm"
        );
        this.siteId = data.siteId;
        this.language = data.language;
        this.firstIndustryId = data.firstIndustryId;
        this.secondIndustryId = data.secondIndustryId;
        if (data.siteType) {
          this.chosedSiteType = data.siteType;
        } else {
          this.chosedSiteType = "";
        }
        await this.choseFirstIndustrySelect();
        if (data.firstIndustryId) {
          await this.choseSecondIndustrySelect(data.firstIndustryId);
        }
      }
    },
    // 切换站点刷新信息
    async chooseWebsite(siteId) {
      this.siteId = siteId;
      this.getSiteInfo(siteId);
      if (this.$store.state.dashboard.appId) {
        this.headers.appId = this.$store.state.dashboard.appId;
      }
      let data = await securityService.getUser();
      if (data && data.access_token) {
        this.headers.Authorization = "Bearer " + data.access_token;
      }
    },
    // 选择一级行业菜单
    async choseFirstIndustrySelect() {
      let { data } = await dashboardApi.GetFirstIndustries();
      this.siteFirstIndustry = data;
      this.siteFirstIndustryValue =
        this.firstIndustryId == 0 ? "" : this.firstIndustryId;
    },
    choseFirstIndustry(id) {
      this.firstIndustryId = id;
      this.secondIndustryId = "";
      this.choseSecondIndustrySelect(this.firstIndustryId);
    },
    // 选择二级行业菜单
    async choseSecondIndustrySelect(firstIndustryId) {
      if (firstIndustryId != 0) {
        let { data } = await dashboardApi.GetSecondIndustries(firstIndustryId);
        this.siteSecondIndustry = data;
        this.siteSecondIndustryValue =
          this.secondIndustryId == 0 ? "" : this.secondIndustryId;
      }
    },
    choseSecondIndustry(id) {
      this.secondIndustryId = id;
    },
    bindDomain() {
      this.$router.push("/website/mysite/sitedomain");
    },
    choseFlowDay(val){
      this.interval = val
      this.initCode();
    },
    //生成图表
    initCode(){
      // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        this.myChart.setOption({
          backgroundColor: '#fff',
          // legend: {
          //   // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          //   x: 'right',
          //   // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          //   y: '36px',
          //   color: 'red',
          //   data:['uv','pv']
          // },
          grid: {
              left: '0%',
              right: '32px',
              bottom: '0%',
              top: '80px',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.interval == 1 ? this.yList:this.yLast,
              axisLabel: {
                interval: this.interval  //设置X轴数据间隔几个显示一个，为0表示都显示
              },
              axisLine: {
                lineStyle: {
                  color: '#A1A8B1'
                }
              }
          },
          yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#A1A8B1'
                }
              }
            },
          series: [
              {
                  name:'pv',
                  type:'line',
                  stack: 'pv',
                  symbolSize:5,
                  symbol:'circle', 
                  smooth: true, 
                  data: this.interval == 1 ? this.pvList:this.pvLast
              },
              {
                  name:'uv',
                  type:'line',
                  stack: 'uv',
                  symbolSize:5,
                  symbol:'circle',
                  smooth: true, 
                  data: this.interval == 1 ? this.uvList:this.uvLast
              }
          ],
          color: ['#23CD5D', '#FF6A00']
        });
    }
  },
  watch: {
        screenWidth(val) {
          if (this.timer) {
            this.timer = false
            setTimeout(()=> {
              this.myChart.resize();
              this.timer = true
            },500)
          }
        }
    }
};
</script>
<style lang="scss" scoped>
.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
    }
  }
}
.siteInfo-wrap {
  margin-top: 24px;
  width: 100%;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  .siteInfo-title {
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: $--font-size-base;
    font-weight: $--font-weight-primary;
    border-bottom: $--border-base;
    padding-left: 16px;
  }
  .siteInfo {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    padding-right: 32px;
    .siteImg {
      position: relative;
      display: inline-block;
      width: 200px;
      vertical-align: top;
      .itemSiteImageHeader {
        width: 100%;
      }
      .siteImgBackground {
        margin-top: -2px;
        width: 100%;
        padding-bottom: 62%;
        position: relative;
        .changeTemplate {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 24px;
          position: absolute;
          bottom: 0;
          left: 0;
          background: rgba(255, 107, 0, 0.9);
          font-size: $--font-size-small;
          line-height: 24px;
          color: $--color-white;
          font-weight: $--font-weight-base;
          text-align: center;
          transition: all 0.2s linear;
        }
      }
      .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: rgba(255, 107, 0, 0.9);
        transition: all 0.2s linear;
        cursor: pointer;
      }
      &:hover {
        .modal {
          opacity: 1;
        }
        .changeTemplate {
          opacity: 0;
        }
      }
      .choseSite {
        width: 90px;
        height: 32px;
        border-radius: 2px;
        border: 1px solid $--color-white;
        font-size: $--font-size-small;
        font-weight: $--font-weight-base;
        color: $--color-white;
        line-height: 32px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.2s linear;
      }
    }
    .siteinfoWrap {
      display: inline-block;
      margin-left: 24px;
      .siteinfoItem {
        margin-top: 12px;
        span {
          margin-left: 8px;
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          line-height: 17px;
        }
        .iconicon-dash-edit {
          &:hover {
            color: $--color-primary;
          }
        }
        .language {
          margin-left: 12px;
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-text-regular;
        }
        .siteinfoDomain {
          margin-left: 8px;
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-primary;
        }
        .bindDomain {
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
          color: $--color-primary;
          margin-left: 30px;
        }
      }
    }
    .rightWrap {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
.siteDetailinfo-wrap {
  width: 100%;
  height: calc(100% - 389px);
  
  .flowDetai {
    position: relative;
    width: 100%;
    height: 460px;
    padding: 16px 0px 16px 32px;
    box-sizing: border-box;
    background: $--color-white;
    border-radius: $--border-radius-base;
    border: $--border-base;
    .flowHeader {
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 16px;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 32px;
      padding: 0 32px;
      box-sizing: border-box;
      p {
        width:340px;
        font-size:12px;
        font-weight:400;
        color:rgba(159,159,159,1);
        line-height:32px;
        text-align: right;
        a {
          color: $--color-primary;
        }
        span {
          i {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: $--color-primary;
            border-radius: 50%;
            margin: -4px 6px 0;
          }
        }
        span:nth-child(2){
          margin: 0 40px 0 10px; 
          i{
            background: #23CD5D;
          }
           
        }
      }
    }
    .myChat {
      width: 100%;
      height: 428px;
    }
  }
  .siteDetailinfo {
    width: calc(100% - 48px);
    height: 100%;
    padding: 0 24px;
    background: $--color-white;
    border-radius: $--border-radius-base;
    border: $--border-base;
    .siteType-wrap {
      width: 100%;
      border-bottom: $--border-base;
      padding-bottom: 24px;
      .siteType {
        margin-top: 16px;
        .siteType-info {
          margin-left: 16px;
        }
      }
      .siteType:nth-child(1) {
        margin-top: 24px;
      }
    }
    .siteSetting-wrap {
      margin-top: 30px;
      display: flex;
      width: 100%;
      .siteSetting {
        width: 49%;
        .siteSettingText {
          font-size: $--font-size-small;
          font-weight: $--font-weight-base;
        }
        .iconicon-exclamationmark {
          color: #e5e5e5;
        }
        .siteSetting-item {
          display: flex;
          align-items: center;
          .siteSetting-left {
            display: inline-block;
            width: 140px;
          }
        }
        .siteSetting-item:nth-child(2) {
          margin-top: 24px;
        }
      }
    }
  }
}
.avatar-uploader {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: 16px;
  &:hover {
    .iconHover {
      display: inline-block;
    }
  }
  cursor: pointer;
  .iconImg {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: $--border-base;
    border-radius: $--border-radius-base;
  }
  .iconNull {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: $--border-base;
    border-radius: $--border-radius-base;
  }
  .iconHover {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
    background: rgba(38, 38, 38, 0.89);
    border: $--border-base;
    border-radius: $--border-radius-base;
  }
  .iconicon-dash-cloudx {
    color: $--color-primary;
    line-height: 20px;
  }
}

.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin: 16px 0;
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.domain-menu /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
}
.right-pannel {
  width: 520px;
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  padding: 30px 24px 40px;
  .pannel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .headTitle {
      font-size: 16px;
      font-weight: 600;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .close-pannel {
      line-height: 22px;
      cursor: pointer;
    }
  }
  .createSiteName {
    margin-top: 16px;
    .createSiteNameInput {
      margin-top: 16px;
    }
  }
  .createSiteTitle {
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    margin-bottom: 16px;
  }
  .create {
    margin-top: 30px;
    width: 100%;
    text-align: right;
  }
}
</style>

