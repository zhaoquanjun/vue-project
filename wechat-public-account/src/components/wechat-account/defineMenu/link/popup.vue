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
        <none-area :tips="tips" v-show="slider == 'none'" :noneWords="noneWords" />
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
        <url-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'link'"
        />
        <email-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'email'"
        />
        <tel-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'tel'"
        />
        <file-area
          :model="model"
          :selectedUrl="selectedUrl"
          :way="way"
          :type="type"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'file'"
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
import NoneArea from "./none";
import PageArea from "./page";
import NewsArea from "./news";
import ProductArea from "./product";
import UrlArea from "./url";
import EmailArea from "./email";
import TelArea from "./tel";
import FileArea from "./file";
import MaskArea from "./mask";
export default {
  props: {
    model: {
      type: Object
    }
  },
  data() {
    return {
      sliderList: [
        { name: "无链接", label: "none" },
        { name: "页面", label: "page" },
        { name: "文章", label: "news" },
        { name: "产品", label: "product" },
        { name: "链接", label: "link" },
        { name: "邮件", label: "email" },
        { name: "文件", label: "file" },
        { name: "电话", label: "tel" },
        { name: "弹窗", label: "popup" }
      ],
      noneWords: {
        words: '暂无链接',
        target: []
      },
      pageIndex: this.model['PageIndex'],
      slider: this.model["Type"],
      curType: this.model["Type"],
      selectedUrl: this.model["Href"],
      way: this.model["Target"],
      tips: "无链接",
      title: ""
    };
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
      if (val == 'none') {
        this.selectedUrl = 'javascript:;'
        this.title = '请设置链接';
        this.target = '_self';
      }
      return false;
    },
    _handleConfirm() {
      var flag = this._handleNext(this.slider);
      if (!flag) return;
      let oldUrl = this.model["Href"];
      let oldTarget = this.model["Target"];
      let oldTitle = this.model["Title"];
      let oldType = this.model["Type"];
      let oldPageIndex = this.pageIndex;
      if (oldUrl !== this.selectedUrl || oldTarget !== this.way) {
        this.model["Href"] = this.selectedUrl;
        this.model["Target"] = this.way;
        this.model["Type"] = this.slider;
        this.model["Title"] = this.title;
        this.pageIndex = this.model['PageIndex'];
        let oldData = {},
          data = {};
        oldData["Type"] = oldType;
        oldData["Href"] = oldUrl;
        oldData["Target"] = oldTarget;
        oldData["Title"] = oldTitle;
        oldData['PageIndex'] = oldPageIndex;
        data["Type"] = this.slider;
        data["Href"] = this.selectedUrl;
        data["Target"] = this.way;
        data["Title"] = this.title;
        data['PageIndex'] = this.model['PageIndex'];
        this.onDataChange(null, oldData, data);
      }
      this.$emit("handleClosePopup", false);
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
    _handleNext(type) {
      var flag = null;
      switch(type) {
        case 'email': 
          var reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
          let email = this.selectedUrl ? this.selectedUrl.slice(7) : this.selectedUrl;
          flag = reg.test(email) ? true : false;
          break;
        case 'link': 
          var reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
          flag = reg.test(this.selectedUrl) ? true : false;
          break;
        case 'tel': 
          var reg = /^1[3456789]\d{9}$/;
          var tel = this.selectedUrl ? this.selectedUrl.slice(4) : this.selectedUrl;
          flag = reg.test(tel) ? true : false;
          break;
        default:
          flag = true;
          break;
      }
      return flag;
    },
    handleChangeUrl(val) {
      this.selectedUrl = val.url;
      this.curType = val.cType;
      this.title = val.title;
      return false;
    },
    handleChangeTarget(val) {
      console.log(val);
      this.way = val;
    },
    onDataChange(action, oldData, data) {
      if (window.smSite) {
        window.smSite.onDataChange(action, oldData, data);
      }
    }
  }
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
  z-index: 19;
  .link-popup__section {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 680px;
    height: 560px;
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
        background: url("~@static/images/link/close.png") no-repeat center
          center;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
    .popup-content__box {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      height: 454px;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      .popup-content__slider {
        width: 90px;
        height: 454px;
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
      justify-content: flex-end;
    }
    .popup-footer__area /deep/ .el-button--small {
      width: 58px;
      height: 32px;
      border-radius: 0;
      border-color: #00c1de;
      background: #fff;
      span {
        color: #00c1de;
      }
    }
    .popup-footer__area /deep/ .el-button--primary {
      background: #00c1de;
      span {
        color: #fff;
      }
    }
  }
}
</style>
<style>
.popup-content__area .content-main__slider .el-tree__empty-text {
  min-width: 60px;
}
</style>


