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
            @click="_handleSelectMenu(1,index,item.id)"
          >
            {{item.name || '主菜单'}}
            <ul 
              class="menu-child__area"
              v-show="item.subMenuList.length > 0 && index == curIndex"
            >
              <li 
                v-for="(child, idx) in item.subMenuList"
                :class="{selected: idx == curSubIndex}"
                @click="_handleSelectMenu(2,idx,child.id)"
                :key="idx">
                <i class="iconfont icontuodongdian1 menu-move__icon" v-show="isOrder"></i>
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
                <el-input 
                  v-model="menuDetail.name" 
                  @blur="testMenu(16,menuDetail.name)"
                  placeholder="仅支持中英文和数字，字数不超过4个汉字或8个字母">
                </el-input>
              </el-form-item>
              <div v-if='!hasTrueName' class="tipsName">
                <span class="ym-form-item__error">名称仅包含中英文、数字、特殊符号。</span>
                <a href="https://kf.qq.com/faq/181228f2iMV7181228RbMfAr.html" target="_blank">查看详情</a>
              </div>
              <el-form-item label="菜单内容">
                <el-radio
                  label='0'
                  v-model="menuDetail.clickBehavior"
                  @change="_handleBehaviorType('0')"
                >发送消息</el-radio>
                <el-radio
                  label='1'
                  v-model="menuDetail.clickBehavior"
                  @change="_handleBehaviorType('1')"
                >跳转网页</el-radio>
                <!-- <el-radio label="miniprogram" disabled>跳转小程序</el-radio> -->
              </el-form-item>
            </el-form>
            <div v-show="menuDetail.clickBehavior == '0'" class="message-content__section">
              <section class="menu-content__area">
                <div class="radio-tabs">
                  <el-radio label="1" v-model="menuDetail.behaviorType" @click="_handleChangeBehaviorType('1')">图片</el-radio>
                  <el-radio label="2" v-model="menuDetail.behaviorType" @click="_handleChangeBehaviorType('2')">文字</el-radio>
                  <el-radio label="3" v-model="menuDetail.behaviorType" @click="_handleChangeBehaviorType('3')">图文</el-radio>
                </div>
                <div class="slot-content">
                  <!-- 图片 -->
                  <Picture
                      ref="pictureComponent"
                      v-if="menuDetail.behaviorType === '1'"
                      :image-msg="menuDetail.behaviorBody.ImageMsg.PicUrl"
                      @handlerPic="handlerPic"
                  ></Picture>
                  <!-- 文字 -->
                  <anser-text
                      :serve-text="menuDetail.behaviorBody.TextMsg.Text"
                      v-if="menuDetail.behaviorType === '2'"
                      @handlerText="handlerText"
                  ></anser-text>
                  <!-- 图文 -->
                  <image-text
                      ref="newMsg"
                      v-if="menuDetail.behaviorType === '3'"
                      :news-msg="menuDetail.behaviorBody.NewsMsg"
                      :replyType= 'replyType'
                      @handlerSaveImgText="handlerSaveImgText"
                  ></image-text>
                </div>
              </section>
            </div>
            <!-- 跳转链接 -->
            <div v-show="menuDetail.clickBehavior == '1'" class="website-area">
              <div class="selectUrl">
                <span>设置跳转链接</span>
                <div>
                  <p>{{menuDetail.behaviorBody.CustomMenuRedirectMsg.UrlData}}<p/>
                  <i class="iconfont iconicon-des-lj" @click="selectUrl"></i>
                </div>
              </div>
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
    <div class="btn">
      <span @click="_handleSaveAndPublish">保存并发布</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Picture from "@/components/wechat-account/auto-answer/picture.vue";
import PopUp from "@/components/wechat-account/defineMenu/link/popup.vue"
import OrderMenu from "_c/wechat-account/defineMenu/order-menu";
import AnserText from "@/components/wechat-account/auto-answer/anser-text.vue";
import WebsiteLink from "_c/wechat-account/defineMenu/link/link";
import { notify } from "@/utlis/index.js";
import ImageText from "@/components/wechat-account/auto-answer/image-text.vue";
import { getMenuTree, getMenuDetail,addMenu,publishMenu,removeMenu,updateMenu } from "@/api/request/account.js";
export default {
  data() {
    return {
      model: {
          PageIndex: null,
          Type: null,
          Id: null,
          Href: null
      },
      hasTrueName: false,
      replyType: "1", //replyType 回复类型
      isShowPopup: false,
      curIndex: -1,
      curSubIndex: -1,
      isOrder: false,
      replyContentType: "picture",
      menuWords: "",
      chooseImg: "",
      menuTree: [],
      text: '2',
      menuDetail: {
        id: null,
        siteId: '30001',
        name: "",
        clickBehavior: '1', // None 0无, Reply1消息, RedirectUrl2 链接, RedirectSmallProgram3 小程序
        behaviorType: '1',//None0无,Image图片,Text文字,News图文,； Url纯链接,WZPage页面, WZNews文章,WZProduct产品
        behaviorBody: {
          ImageMsg: {
            PicUrl: "string",
            WeChatMediaId: "string"
          },
          TextMsg: {
            Text: "string"
          },
          NewsMsg: [
            {
              Title: "string",
              Description: "string",
              PicUrl: "string",
              UrlType: "string",
              UrlData: "string",
              ContentPageId: "string"
            }
          ],
          CustomMenuRedirectMsg: {
            UrlType: "string",
            Title: "string",
            UrlData: "请选择跳转链接",
            ContentPageId: "string"
          }
        }
      },
      siteId: '30001'
    };
  },
  components: {
    OrderMenu,
    WebsiteLink,
    Picture,
    AnserText,
    ImageText,
    PopUp
  },
  mounted() {
    this._getMenuTree();
  },
  methods: {
    async _getMenuTree() {
      let { data } = await getMenuTree(this.siteId);
      this.menuTree = data;
      if(this.menuTree.length >0 && !this.menuDetail.id) {
        if (this.menuTree[0].subMenuList.length > 0) {
          this._getMenuDetail(this.menuTree[0].subMenuList[0].id)
        } else {
          this._getMenuDetail(this.menuTree[0].id)
        }
      }
    },
    handleClosePopup (val,data){
      this.isShowPopup = val
      if (data) {
        this.menuDetail.behaviorBody.CustomMenuRedirectMsg.Title= data.Title;
        this.menuDetail.behaviorBody.CustomMenuRedirectMsg.UrlType= data.Type;
        this.menuDetail.behaviorBody.CustomMenuRedirectMsg.UrlData= data.Href;
        this.menuDetail.behaviorBody.CustomMenuRedirectMsg.ContentPageId= data.Id;
        if (data.Type === 'Page') {
          this.menuDetail.behaviorType = '5'
        } else if (data.Type === 'Url') {
          this.menuDetail.behaviorType = '4'
        } else if (data.Type === 'News') {
          this.menuDetail.behaviorType = '7'
        } else if (data.Type === 'Product') {
          this.menuDetail.behaviorType = '6'
        } 
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
      this.menuDetail.clickBehavior = JSON.stringify(data.clickBehavior);
      this.menuDetail.behaviorType = JSON.stringify(data.behaviorType);
      let behaviorBody = JSON.parse(data.behaviorBody);
      console.log('8888',behaviorBody)
      this.menuDetail.behaviorBody.ImageMsg = behaviorBody.ImageMsg || '';
      this.menuDetail.behaviorBody.TextMsg = behaviorBody.TextMsg || '';
      this.menuDetail.behaviorBody.NewsMsg = behaviorBody.NewsMsg || [];
      this.menuDetail.behaviorBody.CustomMenuRedirectMsg = behaviorBody.CustomMenuRedirectMsg || {};
      console.log('0000',this.menuDetail)
    },
    _handleChangeBehaviorType(val) {
      this.menuDetail.behaviorType = val
    },
    // 菜单排序
    _handleMenuOrder() {
      this.isOrder = !this.isOrder;
    },
    _handleBehaviorType(val) {
      this.menuDetail.clickBehavior =val 
    },
    // 切换menu
    async _handleSelectMenu(type,i,id) {
      this.menuDetail.behaviorType = JSON.parse(this.menuDetail.behaviorType)
      this.menuDetail.clickBehavior = JSON.parse(this.menuDetail.clickBehavior)
      if (!hasTrueName) {
        notify(this, '请完善子菜单信息', "error");
        return
      }
      //if (this.menuDetail.clickBehavior == )
      updateMenu(this.menuDetail)
      if (type == 1) {
        // type 1 点击父菜单 2 点击子菜单
        this.curIndex = i;
        this.curSubIndex = -1;
      } else if(type == 2) {
        this.curIndex = -1;
        this.curSubIndex = i;
      }
      this._getMenuDetail(id)
    },
    // 添加菜单
    _handleAddMainMenu(name,order,id,level) {
      let newMenuItem = {
        name: name,  //菜单名称
        displayOrder: order, //菜单排序
        parentId: id, //父菜单id，当为父菜单时为0
        siteId: this.siteId, //站点id
        menuLevel: level //父菜单为0，子菜单为1
      };
      let data = addMenu(newMenuItem);
      if(data.status && data.status ==200 ) {
        this._getMenuTree()
      }
    },
    // 删除菜单
    _handleDeleteMenu() {
      let data = removeMenu(this.siteId, this.menuDetail.id);
      if(data.status && data.status == 200 ) {
        this._getMenuTree()
      }
    },
    // 保存并发布
    _handleSaveAndPublish() {
      this.menuDetail.behaviorType = JSON.parse(this.menuDetail.behaviorType)
      this.menuDetail.clickBehavior = JSON.parse(this.menuDetail.clickBehavior)
      let data = publishMenu(this.menuDetail);
    },
    // 获取图片
    handlerPic(picUrl) {
      this.menuDetail.behaviorBody.ImageMsg.PicUrl = picUrl;
    },
    // 文字回复输入
    handlerText(text) {
      this.menuDetail.behaviorBody.text = text;
    },
    //获取图文详情
    handlerSaveImgText(list) {
      this.replycontentData.NewsMsg = list;
    },
    //校验菜单名称
    testMenu(typeNum,str){
      //汉字19968至40869
      //数字 48-57
      //A-Z:65-90,a-z:97-122
      //-+&. :45 43 38 46 32
      let isRule = true;
      let BlankNum = 1;
      let strLength = 0
      let firstBlankIndex = false;
      for (var i=0; i<str.length; i++) {  
        var c = str.charCodeAt(i);
        if (c == 45 || c == 43 || c == 38 || c == 46 || c == 32){
          strLength = strLength + 1;
          if (c==32 && !firstBlankIndex) {
            firstBlankIndex = i
          } else if (c==32) {
            BlankNum = BlankNum + 1;
            if (BlankNum == 2 && isRule) {
               isRule = i-firstBlankIndex==1?false:true
            } else {
              isRule = false
            }
          }
        } else if ((c >=65 && c <=90) || (c >=97 && c <=122)) {
          strLength = strLength + 1
        } else if (c >=48 && c <=57) {
          strLength = strLength + 1
        }else if (c >=19968 && c <=40869) {
          strLength = strLength + 2
        } else {
          isRule= false
        }
      }
      if (strLength == 0 || strLength >typeNum) {
        isRule = false
      }
      console.log('444',isRule)
      this.hasTrueName = isRule
    }
  }
};
</script>

<style lang="scss" scoped>
.define-menu__area {
  margin: 0 auto;
  max-width: 1200px;
  min-width: 990px;
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
.selectUrl span{
    float: left;
    font-size: 14px;
    line-height: 40px;
    margin-right: 16px;
    font-family:"PingFangSC-Regular,PingFangSC";
    font-weight:400;
    color:rgba(38,38,38,1);
}
.selectUrl div {
  display: flex;
  justify-content: space-between;
  width:400px;
  height:40px;
  float: left;
  background:rgba(255,255,255,1);
  border-radius:2px;
  border:1px solid rgba(229,229,229,1);
  font-size:14px;
  font-family:'PingFangSC-Regular,PingFangSC';
  font-weight:400;
  color:rgba(211,211,211,1);
  line-height:36px;
  padding: 0 10px;
}
.selectUrl div i {
  color: #0595E6;
}
.btn {
  display: inline-block;
  width: 100%;
  height: 32px;
  margin-top:56px;
  text-align: right;
  padding: 6px 0;
  border-top: 1px solid #E5E5E5;
}
.btn span {
  display: inline-block;
  width:110px;
  height:40px;
  background:rgba(99,220,140,1);
  border-radius:2px;
  opacity:0.5;
  font-size:14px;
  font-family:'PingFangSC-Regular,PingFangSC';
  font-weight:400;
  text-align: center;
  color:rgba(255,255,255,1);
  line-height:40px;
}
.tipsName {
  padding-left: 80px;
  margin-top: -20px;
  height: 40px;
	color: rgba(56, 56, 56, 1);
	font-size: 14px;
	line-height: 40px;
	text-align: left;
}
.tipsName span{
  padding: 0;
  position: relative;
  float: left;
}
.tipsName a {
  float: left;
  color: rgba(0, 193, 222, 1);
}
</style>