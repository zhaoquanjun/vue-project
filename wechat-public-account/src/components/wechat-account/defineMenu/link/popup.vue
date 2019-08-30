<template>
  <el-drawer :visible.sync="popupShow" :before-close="_handleClose">
    <div class="popup-header__area">
      <span>设置链接</span>
      <span @click.stop="_handleCancle"></span>
    </div>
    <ul class="popup-content__slider">
      <li v-for="(it ,i) in sliderList" :key="i">
        <el-radio v-model="slider" :label="it.label" @change="_handleSliderChange">{{it.name}}</el-radio>
      </li>
    </ul>
    <div class="popup-content__box">
      <none-area :tips="tips" v-show="slider == 'none'" :noneWords="noneWords" />
      <url-area
        :model="model"
        :selectedUrl="selectedUrl"
        :way="way"
        :type="type"
        :curType="curType"
        @handleChangeUrl="handleChangeUrl"
        v-if="slider == 'link'"
      />
      <page-area
        :model="model"
        :selectedUrl="selectedUrl"
        :way="way"
        :type="type"
        :curType="curType"
        @handleChangeUrl="handleChangeUrl"
        v-if="slider == 'page'"
      />
      <news-area
        :model="model"
        :selectedUrl="selectedUrl"
        :way="way"
        :type="type"
        :curType="curType"
        @handleChangeUrl="handleChangeUrl"
        v-if="slider == 'news'"
      />
      <product-area
        :model="model"
        :selectedUrl="selectedUrl"
        :way="way"
        :type="type"
        :curType="curType"
        @handleChangeUrl="handleChangeUrl"
        v-if="slider == 'product'"
      />
    </div>
    <div class="popup-footer__area">
      <el-button type="primary" size="small" @click.stop="_handleConfirm">确定</el-button>
      <el-button size="small" @click.stop="_handleCancle">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import NoneArea from "./none";
import PageArea from "./page";
import NewsArea from "./news";
import ProductArea from "./product";
import UrlArea from "./url";
export default {
  props: {
    model: {
      type: Object
    },
    popupShow: {
      type: Boolean
    }
  },
  data() {
    return {
      sliderList: [
        { name: "无链接", label: "none" },
        { name: "网址", label: "link" },
        { name: "页面", label: "page" },
        { name: "文章", label: "news" },
        { name: "产品", label: "product" }
      ],
      noneWords: {
        words: "暂无链接",
        target: []
      },
      // pageIndex: this.model["PageIndex"],
      slider: this.model["Type"],
      curType: this.model["Type"],
      selectedUrl: this.model["Href"],
      tips: "无链接",
      title: ""
    };
  },
  created() {
    console.log(this.model, this.slider);
  },
  components: {
    NoneArea,
    PageArea,
    NewsArea,
    ProductArea,
    UrlArea
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
    _handleClose() {},
    _handleSliderChange(val) {
      this.slider = val;
      if (val == "none") {
        this.selectedUrl = "javascript:;";
        this.title = "请设置链接";
        this.target = "_self";
      }
      return false;
    },
    _handleConfirm() {
      var flag = this._handleNext(this.slider);
      if (!flag) return;
      let oldUrl = this.model["Href"];
      if (oldUrl !== this.selectedUrl) {
        this.model["Href"] = this.selectedUrl;
        this.model["Target"] = this.way;
        this.model["Type"] = this.slider;
        this.model["Title"] = this.title;
        let data = {};
        data["Type"] = this.slider;
        data["Href"] = this.selectedUrl;
        data["Target"] = this.way;
        data["Title"] = this.title;
        data["PageIndex"] = this.model["PageIndex"];
        this.handleChangeMenuContent(null, oldData, data);
      }
      this.$emit("handleClosePopup", false);
    },
    _handleCancle() {
      this.selectedUrl = this.model["Href"];
      this.curType = this.model["Type"];
      this.way = this.model["Target"];
      this.slider = this.model["Type"];
      this.model["PageIndex"] = this.pageIndex;
      this.$emit("handleClosePopup", false);
    },
    _handleClosePopup(e) {
      if (e.target.id == "popup") {
        this._handleCancle();
      }
    },
    _handleNext(type) {
      var flag = null;
      switch (type) {
        case "email":
          var reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
          let email = this.selectedUrl
            ? this.selectedUrl.slice(7)
            : this.selectedUrl;
          flag = reg.test(email) ? true : false;
          break;
        case "link":
          var reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
          flag = reg.test(this.selectedUrl) ? true : false;
          break;
        case "tel":
          var reg = /^1[3456789]\d{9}$/;
          var tel = this.selectedUrl
            ? this.selectedUrl.slice(4)
            : this.selectedUrl;
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
    handleChangeMenuContent(action, oldData, data) {}
  }
};
</script>

<style lang="scss" scoped>
.popup-header__area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 70px;
  border-bottom: 1px solid #c9d9dc;
  cursor: auto;
  span:first-of-type {
    font-size: 16px;
    font-family: "PingFangSC";
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 24px;
  }
  span:last-of-type {
    width: 14px;
    height: 14px;
    background: url("~img/account/close.png") no-repeat center center;
    background-size: 100% 100%;
    cursor: pointer;
  }
}
.popup-content__slider {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 66px;
  padding: 24px;
  border-bottom: 1px solid #c9d9dc;
  cursor: auto;
  li {
    margin-right: 32px;
    font-size: 14px;
    padding-bottom: 16px;
  }
}
.popup-content__box {
  overflow: hidden;
  height: 420px;
}
.popup-footer__area {
  position: absolute;
  left: 24px;
  bottom: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style scoped>
.popup-content__area .content-main__slider .el-tree__empty-text {
  min-width: 60px;
}
.popup-footer__area /deep/ .el-button--small {
  width: 58px;
  height: 32px;
  border-radius: 0;
  border-color: #00c1de;
  background: #fff;
}
.popup-footer__area /deep/ .el-button--small span {
  color: #00c1de;
}
.popup-footer__area /deep/ .el-button--primary {
  background: #00c1de;
}
.popup-footer__area /deep/ .el-button--primary span {
  color: #fff;
}
.el-dialog__wrapper /deep/ .el-drawer__header {
  display: none;
}
</style>


