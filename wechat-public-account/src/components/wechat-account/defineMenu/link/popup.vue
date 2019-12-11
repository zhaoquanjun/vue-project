<template>
  <div class="link-popup__container" id="popup" @click="_handleClosePopup($event)">
    <div class="link-popup__section">
      <div class="popup-header__area">
        <span>{{linkTitle}}</span>
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
          ref="text"
          :noneUrl="noneUrl">
        </none-area>
        <page-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          ref="pageArea"
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
        <button class="cl-button cl-button--small cl-button--primary" @click.stop="_handleConfirm">确定</button>
        <button class="cl-button cl-button--small cl-button--primary_notbg" @click.stop="_handleCancle">取消</button>
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
      linkTitle: '设置链接',
      sliderList: [
        { name: "网址", label: "url" },
        { name: "页面", label: "page" },
        { name: "文章", label: "news" },
        { name: "产品", label: "product" }
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
      this.linkTitle = '选择推广内容'
      this.slider = this.AddType
      this.sliderList= [
          { name: "页面", label: "page" },
          { name: "文章", label: "news" },
          { name: "产品", label: "product" },
        ]
    } else {
      this.linkTitle = '设置链接'
      this.slider = this.sliderList[0].label;
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
      } else {
        this.slider = this.sliderList[0].label;
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
        this.$refs.text.isUrl = true
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
        if (this.slider == 'page') {
          this.$refs.pageArea.pageId = null
        }
        this.slider = this.sliderList[0].label;
        this.title = null;
        this.selectedUrl = null;
        this.$refs.text.url = '';
        this.id = null;
      } else {
        this.$emit("handleClosePopup", false, data);
        if (this.slider == 'page') {
          this.$refs.pageArea.pageId = null
        }
        this.slider = this.sliderList[0].label;
        this.title = null
        this.selectedUrl = null;
        this.$refs.text.url = '';
        this.id = null;
      }
    },
    _handleCancle() {
      this.slider = this.sliderList[0].label;
      this.title = null
      this.selectedUrl = null;
      this.id = null;
      this.$refs.text.isUrl = false;
      this.$refs.text.url = '';
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
    border-radius: $--border-radius-base;
    .popup-header__area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      height: 39px;
      border-bottom: 1px solid #eee;
      cursor: auto;
      span:first-of-type {
        font-size: $--font-size-small;
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
      border-bottom: $--border-base;
      .popup-content__slider {
        width: 90px;
        height: 100%;
        padding: 21px 12px;
        border-right: $--border-base;
        cursor: auto;
        li {
          font-size: $--font-size-small;
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


