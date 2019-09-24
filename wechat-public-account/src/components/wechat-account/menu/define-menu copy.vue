<template>
  <div class="define-menu__area clearfix">
    <div class="phone-box__area">
      <div class="phone-menu__area">
        <div class="phone-menu__keyboard"></div>
        <div class="phone-menu__divider"></div>
        <div class="no-menu__area" v-if="menuTree.length == 0" @click="_handleAddMainMenu('主菜单',0,0,0)">+ 添加菜单</div>
        <ul class="phone-menu__list" v-show="menuTree.length > 0">
          <li
            v-for="(item, index) in menuTree"
            :key="index"
            :class="{selected: index == curIndex}"
            @click="_handleSelectMenu(index)"
          >
            {{item.name || '主菜单'}}
            <ul class="menu-child__area">
              <li 
                v-show="item.subMenuList.length > 0" 
                v-for="(child, idx) in item.subMenuList" 
                :key="idx">
                <i class="iconfont icontuodongdian menu-move__icon" v-show="isOrder"></i>
                {{child.name || '子菜单'}}
              </li>
              <li @click="_handleAddMainMenu('子菜单',0,item.id,1)">+</li>
            </ul>
          </li>
          <li v-if="menuTree.length > 0 &&  menuTree.length < 3" @click="_handleAddMainMenu('主菜单',menuTree.length,0,0)">+</li>
        </ul>
      </div>
      <div class="primary-button__nomal order-menu__btn" @click="_handleMenuOrder">菜单排序</div>
    </div>
    <div class="menu-operate__arae">
      <order-menu v-show="isOrder"></order-menu>
      <div v-show="!isOrder" class="menu-operate__none">
        <div class="empty" v-if="menuTree.length <= 0">
          <div class="empty-icon"></div>
          <p>您还没有添加菜单</p>
        </div>
        <div class="menu-operate__box" v-else>
          <div class="menu-operate__header">
            <p>编辑菜单</p>
            <div class="menu-operate__delete" @click="_handleDeleteMenu">删除菜单</div>
          </div>
          <div class="menu-operate__content">
            <el-form label-width="80px">
              <el-form-item label="菜单名称">
                <el-input v-model="menuDetail.name" placeholder="仅支持中英文和数字，字数不超过4个汉字或8个字母"></el-input>
              </el-form-item>
              <el-form-item label="菜单内容">
                <el-radio
                  label="Reply"
                  v-model="menuDetail.clickBehavior"
                  @change="_handleBehaviorType('Reply')"
                >发送消息</el-radio>
                <el-radio
                  label="RedirectUrl"
                  v-model="menuDetail.clickBehavior"
                  @change="_handleBehaviorType('RedirectUrl')"
                >跳转网页</el-radio>
                <!-- <el-radio label="miniprogram" disabled>跳转小程序</el-radio> -->
              </el-form-item>
            </el-form>
            <message-area
              :menuTree="menuTree[curIndex]"
              v-show="menuDetail.clickBehavior == 'Reply'"
            >
              <div class="picture-menu" v-show="menuDetail.behaviorType == 'picture'">
                <div class="choose-picture__area" v-show="chooseImg.length == 0">
                  <div class="choose-icon" @click="_handleUploadPicture"></div>
                  <p @click="_handleUploadPicture">点击上传</p>
                </div>
                <div class="picture-show" v-show="chooseImg.length > 0">
                  <img :src="chooseImg" alt />
                  <div class="show-mask__area">
                    <div class="icon-box">
                      <i class="iconfont iconqiehuan" @click="_handleUploadPicture"></i>
                      <i class="iconfont iconhuishouzhan" @click="_handleDeleteImg"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="words-menu" v-show="menuDetail.behaviorType == 'words'">
                <el-input
                  type="textarea"
                  maxlength="600"
                  show-word-limit
                  placeholder="请输入菜单回复内容"
                  v-model="menuWords"
                ></el-input>
              </div>
              <div
                class="picture-words__menu"
                v-show="menuDetail.behaviorType == 'picture_words'"
              ></div>
            </message-area>
            <!-- 跳转链接 -->
            <div v-show="menuDetail.clickBehavior == 'RedirectUrl'" class="website-area">
              <div @click="selectUrl">选择链接</div>
              <p></p>
            </div>
            
            <PopUp
              :model="model"
              @handleClosePopup="handleClosePopup"
              v-show="isShowPopup"
            />
          </div>
        </div>
      </div>
    </div>
    <image-manage
      :imageChooseAreaShowFlag="imageChooseAreaShowFlag"
      @getImage="getImage"
      @handleCloseModal="handleCloseModal"
    ></image-manage>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import PopUp from "@/components/wechat-account/defineMenu/link/popup.vue"
import OrderMenu from "_c/wechat-account/defineMenu/order-menu";
import MessageArea from "_c/wechat-account/defineMenu/message-content";
import WebsiteLink from "_c/wechat-account/defineMenu/link/link";
import ImageManage from "_c/wechat-account/uploadChooseImage/selectUpload";
import { getMenuTree, getMenuDetail,addMenu } from "@/api/request/account.js";
export default {
  data() {
    return {
      model: {
          PageIndex: null,
          Type: null,
          Id: null,
          Href: null
      },
      isShowPopup: false,
      curIndex: 0,
      isOrder: false,
      imageChooseAreaShowFlag: false,
      replyContentType: "picture",
      menuWords: "",
      chooseImg: "",
      menuTree: [],
      menuDetail: {
        id: 0,
        siteId: 0,
        name: "",
        clickBehavior: "None", // None 无, Reply消息, RedirectUrl 链接, RedirectSmallProgram 小程序
        behaviorType: "None",//None无,Image图片,Text文字,News图文,； Url纯链接,WZPage页面, WZNews文章,WZProduct产品
        behaviorBody: {
          imageMsg: {
            picUrl: "string",
            weChatMediaId: "string"
          },
          textMsg: {
            text: "string"
          },
          newsMsg: [
            {
              title: "string",
              description: "string",
              picUrl: "string",
              urlType: "string",
              urlData: "string",
              contentPageId: "string"
            }
          ],
          customMenuRedirectMsg: {
            urlType: "string",
            title: "string",
            urlData: "string",
            contentPageId: "string"
          }
        }
      },
      siteId: '30001'
    };
  },
  components: {
    OrderMenu,
    MessageArea,
    WebsiteLink,
    PopUp,
    ImageManage
  },
  mounted() {
    this._getMenuTree();
  },
  methods: {
    getCurSiteId(siteId) {
      this.siteId = siteId;
      this._getMenuTree();
    },
    async _getMenuTree() {
      let { data } = await getMenuTree(this.siteId);
      this.menuTree = data;
      console.log('菜单树',this.menuTree)
    },
    handleClosePopup (val,data){
      this.isShowPopup = val
      if (data) {
            this.menuDetail.behaviorBody.customMenuRedirectMsg.title= data.Title;
            this.menuDetail.behaviorBody.customMenuRedirectMsg.urlType= data.Type;
            this.menuDetail.behaviorBody.customMenuRedirectMsg.urlData= data.Href;
            this.menuDetail.behaviorBody.customMenuRedirectMsg.contentPageId= data.Id;
          // this.curEditorItem.UrlType = data.Type;
          // this.curEditorItem.UrlData = data.Href;
          // this.curEditorItem.ContentPageId = data.Id;
          // this.curEditorTitle = data.Title;
      }
    },
    //弹出选择链接弹窗
    selectUrl(){
      this.isShowPopup = true
    },
    //获取单个菜单详情
    async _getMenuDetail(id) {
      let { data } = await getMenuDetail(this.siteId, id);
      this.menuDetail.name = data.name;
      this.menuDetail.id = data.id;
    },
    // 菜单排序
    _handleMenuOrder() {
      this.isOrder = !this.isOrder;
    },
    _handleBehaviorType(val) {
      this.menuDetail.clickBehavior =val 
    },
    // 切换menu
    _handleSelectMenu(i) {
      this.curIndex = i;
      this._getMenuDetail(this.menuTree[i].id)
    },
    // 添加主菜单
    _handleAddMainMenu(name,order,id,level) {
      let newMenuItem = {
        name: name,  //菜单名称
        displayOrder: order, //菜单排序
        parentId: id, //父菜单id，当为父菜单时为0
        siteId: this.siteId, //站点id
        menuLevel: level //父菜单为0，子菜单为1
      };
      let data = addMenu(newMenuItem);
      console.log('222',data)
    },
    // 添加子菜单
    _handleAddChildMenu() {},
    // 删除菜单
    _handleDeleteMenu() {},
    // 打开选择图片弹层
    _handleUploadPicture() {
      this.imageChooseAreaShowFlag = true;
    },
    // 保存并发布
    _handleSaveAndPublish() {
      console.log(this.form);
    },
    // 替换菜单编辑图片部分
    _handleSwitchImg() {},
    // 删除菜单编辑图片部分
    _handleDeleteImg() {
      this.chooseImg = "";
    },
    // 获取图片
    getImage(src) {
      console.log(src);
      this.chooseImg = src;
    },
    // 关闭弹层
    handleCloseModal() {
      this.imageChooseAreaShowFlag = false;
    }
    // 重置当前菜单右侧数据类型
    // _handle
  }
};
</script>

<style lang="scss" scoped>
.define-menu__area {
  margin: 0 auto;
  max-width: 1200px;
  min-width: 990px;
  height: 753px;
  border-radius: 20px;
  .phone-box__area {
    position: relative;
    float: left;
    margin: 0 auto 2px;
    width: 355px;
    height: 711px;
    border: 1px dashed #c9d9dc;
    background: url("~img/account/account_menu_phone.png") no-repeat center
      center;
    background-size: 100% 100%;
    .phone-menu__area {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 32px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 294px;
      height: 48px;
      background: rgba(248, 250, 252, 1);
      .phone-menu__keyboard {
        margin: 8px 24px;
        width: 26px;
        height: 17px;
        background: url("~img/account/define_menu_keyboard.png") no-repeat
          center center;
        background-size: 100% 100%;
      }
      .phone-menu__divider {
        width: 1px;
        height: 32px;
        background: #c9d9dc;
      }
      .no-menu__area {
        width: calc(100% - 74px);
        height: 52px;
        text-align: center;
        line-height: 52px;
        color: #09cceb;
        font-size: 14px;
        font-family: "PingFangSC";
        font-weight: 400;
        cursor: pointer;
      }
      .phone-menu__list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(100% - 42px);
        li {
          position: relative;
          margin: 8px 0;
          width: 106px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #262626;
          border-right: 1px solid #c9d9dc;
          cursor: pointer;
          .menu-child__area {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 54px;
            display: none;
            width: 146x;
            border: 1px solid #c9d9dc; // 需换底图
            border-radius: 2px;
            li {
              margin: 0 auto;
              padding: 8px 0;
              height: auto;
              line-height: 34px;
              text-align: center;
              width: 144px;
              font-size: 14px;
              color: #262626;
              border-right: none;
              border-top: 1px solid #c9d9dc;
              cursor: auto;
              .menu-move__icon {
                margin-right: 4px;
                font-size: 16px;
                color: #a1a8b1;
                cursor: pointer;
              }
            }
            li:first-of-type {
              border-top: none;
            }
          }
        }
        li.selected {
          .menu-child__area {
            display: block;
          }
        }
        li:last-of-type {
          color: #262626;
          border-right: none;
        }
        .selected {
          color: #09cceb !important;
        }
      }
    }
    .order-menu__btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -42px;
    }
  }
  .menu-operate__arae {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    margin-top: 20px;
    width: calc(100% - 355px);
    height: 671px;
    background: #f8fafc;
    border-radius: 2px;
    .menu-operate__none {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .empty {
        width: 160px;
        height: 130px;
        .empty-icon {
          width: 160px;
          height: 106px;
          background: url("~img/account/accout_no_menu.png") no-repeat center
            center;
          background: cover;
        }
        p {
          margin-top: 3px;
          font-size: 14px;
          font-family: "PingFangSC";
          font-weight: 400;
          color: rgba(164, 178, 191, 1);
          line-height: 20px;
          text-align: center;
        }
      }
    }
    .menu-operate__box {
      margin: 24px auto;
      padding: 24px;
      width: 90%;
      height: 618px;
      border-radius: 2px;
      background: #fff;
      border: 1px solid rgba(229, 229, 229, 1);
      .menu-operate__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        p {
          font-size: 16px;
        }
        .menu-operate__delete {
          font-size: 14px;
          font-family: "PingFangSC";
          font-weight: 400;
          color: rgba(251, 77, 104, 1);
          line-height: 20px;
        }
      }
      .picture-menu {
        width: 100%;
        min-height: 364px;
        display: flex;
        justify-content: center;
        align-items: center;
        .choose-picture__area {
          .choose-icon {
            margin: 0 auto;
            width: 60px;
            height: 60px;
            background: url("~img/account/define_menu_add.png") no-repeat center
              center;
            background-size: 100% 100%;
            cursor: pointer;
          }
          p {
            padding-top: 24px;
            font-size: 14px;
            font-family: "PingFangSC";
            font-weight: 400;
            color: rgba(9, 204, 235, 1);
            line-height: 20px;
            text-align: center;
            cursor: pointer;
          }
        }
        .picture-show {
          position: relative;
          display: inline-block;
          height: 306px;
          width: 504px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          overflow: hidden;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
          }
          .show-mask__area {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            opacity: 0;
            width: 100%;
            height: 100%;
            background: rgba(38, 38, 38, 0.7);
            transition: all 0.3s ease-in;
            .icon-box {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                font-size: 16px;
                color: #fff;
                cursor: pointer;
              }
              i:hover {
                color: #09cceb;
              }
              i:last-of-type {
                margin-left: 32px;
              }
            }
          }
          &:hover .show-mask__area {
            display: block;
            opacity: 1;
          }
        }
      }
      .words-menu {
        width: 100%;
        height: 364px;
      }
      .picture-words__menu {
        width: 100%;
        height: 364px;
        overflow-y: auto;
      }
    }
    .define-menu__confirm--button {
      text-align: center;
    }
  }
  .image-choose__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .image-choose__section {
    position: fixed;
    width: 80%;
    min-width: 800px;
    max-width: 1200px;
    height: 800px;
    margin: auto;
    z-index: 112;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
}
</style>
<style scoped>
.el-radio-group /deep/ .el-radio .el-radio__label {
  color: #262626;
}
.el-textarea /deep/ .el-textarea__inner {
  padding: 24px 32px;
  border: none;
  width: 100%;
  height: 364px;
}
.el-form-item /deep/ .el-form-item__label {
  color: #a1a8b1;
}
</style>