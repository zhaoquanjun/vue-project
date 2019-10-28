<template>
  <div class="link-popup__container" id="popup" @click="_handleClosePopup($event)">
    <div class="link-popup__section">
      <div class="popup-header__area">
        <span>设置链接</span>
        <span @click.stop="_handleCancle"></span>
      </div>
      <div class="popup-content__box">
        <ul class="popup-content__slider">
          <li v-for="(it ,i) in sliderList" :key="i">
            <el-radio v-model="slider" :label="it.label" @change="_handleSliderChange">{{it.name}}</el-radio>
          </li>
        </ul>
        <none-area 
          @handleChangeUrl="handleChangeUrl"
          v-show="slider == 'url'" 
          :noneUrl="noneUrl">
        </none-area>
        <page-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'page'"
        />
        <news-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'news'"
        />
        <product-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'product'"
        />
        <mask-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'popup'"
        />
      </div>
      <div class="popup-footer__area">
        <el-button type="primary" size="small" @click.stop="_handleConfirm">确定</el-button>
        <el-button size="small" @click.stop="_handleCancle">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import NoneArea from "./self";
import PageArea from "./page";
import NewsArea from "./news";
import ProductArea from "./product";
import UrlArea from "./url";
import EmailArea from "./email";
import TelArea from "./tel";
import FileArea from "./file";
import MaskArea from "./mask";
import { notify } from "@/utlis/index.js";
export default {
  props: {
    model: {
      type: Object
    },
    AddType: {
      type: String,
      default:''
    },
  },
  data() {
    return {
      sliderList: [
        { name: "网址", label: "url" },
        { name: "页面", label: "page" },
        { name: "文章", label: "news" },
        { name: "产品", label: "product" },
        // { name: "链接", label: "link" },
        // { name: "邮件", label: "email" },
        // { name: "文件", label: "file" },
        // { name: "电话", label: "tel" },
        // { name: "弹窗", label: "popup" }
      ],
      noneUrl: '',
      pageIndex: this.model['PageIndex'],
      slider: "url",
      curType: this.model["Type"],
      selectedUrl: this.model["Href"],
      picUrl: '',
      id: this.model["Href"],
      way: this.model["Target"],
      title: ""
    };
  },
  created(){
    if(this.AddType) {
      this.slider = this.AddType
      this.sliderList= [
          { name: "页面", label: "page" },
          { name: "文章", label: "news" },
          { name: "产品", label: "product" },
        ]
    }
  },
  watch: {
    AddType() {
      if(this.AddType) {
        this.slider = this.AddType
        this.sliderList= [
          { name: "页面", label: "page" },
          { name: "文章", label: "news" },
          { name: "产品", label: "product" },
        ]
      }
    },
  },
        
  components: {
    NoneArea,
    PageArea,
    NewsArea,
    ProductArea,
    UrlArea,
    EmailArea,
    TelArea,
    FileArea,
    MaskArea
  },
  computed: {
    type: {
      get: function() {
        return this.model["Type"];
      },
      set: function() {}
    },
    linkTitle: {
      get: function() {
        return this.model["Title"];
      },
      set: function() {}
    }
  },
  methods: {
    _handleSliderChange(val) {
      this.slider = val;
      this.title = null;
      this.selectedUrl = null;
      this.id = null;
      return false;
    },
    _handleConfirm() {
      if(this.slider == 'url' && !this.title){
        notify(this, '请输入网址', "error");
        return
      }
      if (!this.selectedUrl || !this.title){
        notify(this, '请选择所需链接', "error");
        return
      } else if ((this.slider == 'news' || this.slider == 'product') && !this.id ){
        notify(this, '请选择所需的页面', "error");
        return
      }
      let oldData = {},
          data = {};
      let oldUrl = this.model["Href"];
      let oldTarget = this.model["Target"];
      let oldTitle = this.model["Title"];
      let oldType = this.model["Type"];
      let oldId = this.model["id"];
      let oldPageIndex = this.pageIndex;

      data["Href"] = this.selectedUrl;
      data["Target"] = this.way;
      data["Title"] = this.title;
      data["Type"] = this.curType;
      data['Id'] = this.id;
      data['PicUrl'] = this.picUrl
      console.log('popup',data,this.picUrl)
      data['PageIndex'] = this.model['PageIndex'];
      if (oldUrl !== this.selectedUrl || oldTarget !== this.way) {
        this.model["Href"] = this.selectedUrl;
        this.model["Target"] = this.way;
        this.model["Type"] = this.curType;
        this.model["Title"] = this.title;
        this.pageIndex = this.model['PageIndex'];
        oldData["Type"] = oldType;
        oldData["Href"] = oldUrl;
        oldData["Target"] = oldTarget;
        oldData["Title"] = oldTitle;
        oldData['PageIndex'] = oldPageIndex;
        oldData['Id'] = oldId;
        this.$emit("handleClosePopup", false, data, oldData);
        this.slider = "url";
        this.title = null;
        this.selectedUrl = null;
        this.id = null;
      } else {
        this.$emit("handleClosePopup", false, data);
        this.slider = "url";
        this.title = null
        this.selectedUrl = null;
        this.id = null;
      }
    },
    _handleCancle() {
      this.selectedUrl = this.model["Href"];
      this.curType = this.model["Type"];
      this.way = this.model["Target"];
      this.slider = this.model["Type"];
      this.model['PageIndex'] = this.pageIndex;
      this.$emit("handleClosePopup", false);
    },
    _handleClosePopup(e) {
      if (e.target.id == "popup") {
        this._handleCancle();
      }
    },
    handleChangeUrl(val) {
      this.selectedUrl = val.url;
      this.curType = val.cType;
      this.title = val.title;
      this.id = val.id;
      if (val.picUrl) {
        this.picUrl = val.picUrl
      } else {
        this.picUrl = ''
      }
      return false;
    },
    handleChangeTarget(val) {
      console.log(val);
      this.way = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.link-popup__container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 100;
  .link-popup__section {
    position: absolute;
    top: 0;
    right: 0;
    width: 680px;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 0px 8px 2px rgba(228, 234, 239, 1);
    border-radius: 2px;
    .popup-header__area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      height: 39px;
      border-bottom: 1px solid #eee;
      cursor: auto;
      span:first-of-type {
        font-size: 14px;
      }
      span:last-of-type {
        width: 12px;
        height: 12px;
        background: url("~img/link/close.png") no-repeat center
          center;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
    .popup-content__box {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      height:calc(100% - 100px);
      overflow: hidden;
      border-bottom: 1px solid #eee;
      .popup-content__slider {
        width: 90px;
        height: 100%;
        padding: 21px 12px;
        border-right: 1px solid #eee;
        cursor: auto;
        li {
          font-size: 14px;
          padding-bottom: 16px;
        }
      }
    }
    .popup-footer__area {
      padding: 15px 20px 20px;
      display: flex;
    }
  }
}
</style>
<style>
.popup-content__area .content-main__slider .el-tree__empty-text {
  min-width: 60px;
}
</style>
<style lang="css" scoped>
.popup-footer__area .el-button--small {
      width: 58px;
      height: 32px;
      border-radius: 0;
      border-color: #00c1de;
      background: #fff;
      
    }
    .popup-footer__area .el-button--small span {
        color: #00c1de;
      }
    .popup-footer__area .el-button--primary {
      background: #00c1de;
      
    }
    .popup-footer__area .el-button--primary span {
        color: #fff;
      }
</style>


