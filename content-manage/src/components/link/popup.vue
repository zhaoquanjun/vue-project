<template>
  <div id="popup" class="link-popup__container" @click="_handleClosePopup($event)">
    <div class="link-popup__section">
      <div class="popup-header__area">
        <span>设置链接</span>
        <span @click.stop="_handleCancle">
          <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
        </span>
      </div>
      <div class="popup-content__box">
        <ul class="popup-content__slider">
          <li v-for="(it, i) in sliderList" :key="i" @click.stop="_handleChangeSlider(it.label)">
            <el-radio v-model="slider" :label="it.label">
              {{
              it.name
              }}
            </el-radio>
          </li>
        </ul>
        <div v-show="slider == 'none'" class="none-data__divider"></div>
        <none-area v-show="slider == 'none'" :tips="tips" :none-words="noneWords" />
        <page-area
          v-if="slider == 'page'"
          :siteId="siteId"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <news-area
          v-if="slider == 'news'"
          ref="news"
          :siteId="siteId"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @changeDetailPaeg="changeDetailPaeg"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <product-area
          v-if="slider == 'product'"
          ref="product"
          :siteId="siteId"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @changeDetailPaeg="changeDetailPaeg"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <url-area
          v-if="slider == 'link'"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <email-area
          v-if="slider == 'email'"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <tel-area
          v-if="slider == 'tel'"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <file-area
          v-if="slider == 'file'"
          ref="file"
          :model="model"
          :way="way"
          :slider="slider"
          :cur-type="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
        />
        <!-- <mask-area
          :model="model"
          :way="way"
          :slider="slider"
          :curType="curType"
          @handleChangeUrl="handleChangeUrl"
          @handleChangeTarget="handleChangeTarget"
          v-if="slider == 'popup'"
        />-->
      </div>
      <div class="popup-footer__area">
        <button class="cl-button cl-button--primary_notbg" @click.stop="_handleCancle">取消</button>
        <button class="cl-button cl-button--primary" @click.stop="_handleConfirm">确定</button>
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
// import MaskArea from "./mask";
export default {
  components: {
    NoneArea,
    PageArea,
    NewsArea,
    ProductArea,
    UrlArea,
    EmailArea,
    TelArea,
    FileArea
    // MaskArea
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {
          Ctype: "none",
          Target: "_self"
        };
      }
    },
    actionKey: {
      type: String,
      default: () => {
        return "";
      }
    },
    siteId: {
        type: Number
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
        { name: "电话", label: "tel" }
      ],
      noneWords: {
        words: "暂无链接",
        target: []
      },
      slider: this.model["Ctype"],
      curType: this.model["Ctype"],
      selectedUrl: this.model["Href"],
      categroyId: this.model["CategroyId"],
      way: this.model["Target"],
      tips: "无链接",
      title: this.model["Title"],
      id: this.model["Id"]
    };
  },
  computed: {
    type: {
      get: function() {
        return this.model["Ctype"];
      },
      set: function() {}
    },
    linkTitle: {
      get: function() {
        return this.model["Title"];
      },
      set: function() {}
    },
    detailPageId: {
      get: function() {
        return this.model["DetailPageId"];
      },
      set: function() {}
    }
  },
  watch: {
    model() {
      this.id = this.model["Id"];
    }
  },
  mounted() {
    this.id = this.model["Id"];
  },
  methods: {
    changeDetailPaeg(val) {
      this.model["DetailPageId"] = val;
    },
    _handleChangeSlider(val) {
      this.slider = val;
      if (val === "none") {
        this.title = "请设置链接";
        this.selectedUrl = "javascript:;";
        this.way = "_self";
        this.id = "";
        this.categoryId = null;
      }
      return false;
    },
    _handleConfirm() {
      var flag = this._handleNext(this.slider);
      if (!flag) return;
      //   const oldUrl = this.model['Href']
      //   const oldTarget = this.model['Target']
      //   const oldTitle = this.model['Title']
      //   const oldType = this.model['Ctype']
      //   const oldCategoryId = this.model['CategoryId']
      //   if (oldUrl !== this.selectedUrl || oldTarget !== this.way) {
      //     this.model['Href'] = this.selectedUrl
      //     this.model['Target'] = this.way
      //     this.model['Ctype'] = this.slider
      //     this.model['Title'] = this.title
      //     this.model['Id'] = this.id
      //     this.model['CategoryId'] = this.categoryId
      //     const oldData = {}
      const data = {};
      //     oldData['Ctype'] = oldType
      //     oldData['Href'] = oldUrl
      //     oldData['Target'] = oldTarget
      //     oldData['Title'] = oldTitle
      //     oldData['Id'] = this.id
      //     oldData['CategoryId'] = oldCategoryId  美美美美美美美密码
      data["Ctype"] = this.slider;
      if (this.slider === "news") {
        data["Href"] = "/news/" + this.detailPageId + "/" + this.id + ".html";
      } else if (this.slider === "product") {
        data["Href"] =
          "/product/" + this.detailPageId + "/" + this.id + ".html";
      } else {
        data["Href"] = this.selectedUrl;
      }
      data["Target"] = this.way;
      data["Title"] = this.title;
      data["Id"] = this.id;
      data["CategoryId"] = this.categoryId;
      if (this.actionKey) {
        this.onDataChange(this.actionKey, oldData, data);
      } else {
        this.$emit("onDataChange", data);
        this.$emit("insertLink", data);
      }
      //   }
      this.$emit("handleClosePopup", false);
      return false;
    },
    _handleCancle() {
      this.selectedUrl = this.model["Href"];
      this.curType = this.model["Ctype"];
      this.way = this.model["Target"];
      this.slider = this.model["Ctype"];
      this.categoryId = this.model["CategoryId"];
      if (this.$refs[this.type]) this.$refs[this.type].handleCancle();
      this.$emit("handleClosePopup", false);
    },
    _handleClosePopup(e) {
      if (e.target.id === "popup") {
        this._handleCancle();
      }
    },
    _handleNext(type) {
      let flag = null;
      let emailValue = null;
      let telValue = null;
      const phoneReg = /^1[3456789]\d{9}$/;
      const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
      const linkReg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      const linkHomeReg = /\//;
      switch (type) {
        case "email":
          emailValue = this.selectedUrl
            ? this.selectedUrl.slice(7)
            : this.selectedUrl;
          flag = !!emailReg.test(emailValue);
          break;
        case "link":
          flag = !!(
            linkReg.test(this.selectedUrl) || linkHomeReg.test(this.selectedUrl)
          );
          break;
        case "tel":
          telValue = this.selectedUrl
            ? this.selectedUrl.slice(4)
            : this.selectedUrl;
          flag = !!phoneReg.test(telValue);
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
      this.id = val.id;
      this.categoryId = val.categoryId;
      return false;
    },
    handleChangeTarget(val) {
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
  z-index: 1019;
  .link-popup__section {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    background: $--color-white;
    border-radius: 2px;
    .popup-header__area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 16px 0 24px;
      height: 62px;
      border-bottom: $--border-base;
      cursor: auto;
      span:first-of-type {
        font-size: 16px;
      }
      span:last-of-type {
        cursor: pointer;
      }
    }
    .popup-content__box {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      overflow: hidden;
      .popup-content__slider {
        width: 116px;
        height: 320px;
        padding: 20px 16px 20px 36px;
        cursor: auto;
        li {
          font-size: 14px;
          padding-bottom: 16px;
        }
      }
      .none-data__divider {
        width: 1px;
        height: 100%;
        background: $--background-color-base;
      }
    }
    .popup-footer__area {
      margin: 0 16px 0 24px;
      padding: 20px 0 32px;
      display: flex;
      justify-content: flex-end;
      border-top: $--border-base;
    }
  }
}
</style>
<style>
.popup-content__area .content-main__slider .el-tree__empty-text {
  min-width: 60px;
}
</style>
