<template>
  <div class="define-menu__area clearfix">
    <div class="btn">
      <h4>自定义菜单</h4>
      <button class="cl-button cl-button--primary" @click="_handleSaveAndPublish" :class="{opacityhalf: menuTree.length == 0}">保存并发布</button>
    </div>
    <div class="phone-bg ">
      <div class="phone-box__area">
        <div class="phone-menu__area">
          <div class="phone-menu__divider"></div>
          <div class="no-menu__area" v-if="menuTree.length == 0" @click="_handleAddMainMenu('主菜单',0,0,0)">+ 添加菜单</div>
            <draggable 
              class="phone-menu__list"
              draggable = ".singlePerson"
              v-model="menuTree"
              @end="end(menuTree)"
              v-show="menuTree.length > 0">
              <li
                v-for="(item, index) in menuTree"
                :key="index"
                :class="{selected: (curSubIndex == -1 && index == curIndex && !isOrder) || (index == orderIndex && isOrder),singlePerson:isOrder}"
                @click="_handleSelectMenu(1,index,item.id)"
              >
                {{item.name || '主菜单'}}
                <draggable
                  v-model="item.subMenuList" 
                  @end="end(item.subMenuList)"
                  draggable = ".singleSub"
                  class="menu-child__area"
                  v-show="(index == curIndex && !isOrder) || (index == orderIndex && isOrder)">
                    <li 
                      v-for="(child, idx) in item.subMenuList"
                      :class="{selected: idx == curSubIndex,singleSub:isOrder}"
                      class="ellipsis pointer"
                      @click.stop="_handleSelectMenu(2,idx,child.id)"
                      :key="idx">
                      <i class="iconfont icontuodongdian1 menu-move__icon" v-show="isOrder"></i>
                      {{child.name || '子菜单'}}
                    </li>
                    <li class="add-menu" v-if="item.subMenuList.length<5 && !isOrder" @click.stop="_handleAddMainMenu('子菜单',item.subMenuList.length+1,item.id,1)">+</li>
                </draggable>
              </li>
              <li class="add-menu" v-if="menuTree.length > 0 &&  menuTree.length < 3  && !isOrder" @click.stop="_handleAddMainMenu('主菜单',menuTree.length,0,0)">+</li>
            </draggable>
        </div>
        <button class="cl-button cl-button--text_primary order-menu__btn" :class="{opacityhalf: !canOrder}" @click="_handleMenuOrder">{{isOrder?'完成排序':'菜单排序'}}</button>
      </div>
      <div class="menu-operate__arae">
        <order-menu v-show="isOrder"></order-menu>
        <div v-show="!isOrder" class="menu-operate__none">
          <div class="empty" v-if="menuTree.length <= 0">
            <div class="empty-icon"></div>
            <p>请先在左侧添加菜单</p>
          </div>
          <div class="menu-operate__box" v-else>
            <div class="menu-operate__header">
              <p>编辑菜单</p>
              <div class="menu-operate__delete" @click="_handleDeleteMenu">删除菜单</div>
            </div>
            <div class="menu-operate__content">
              <el-form @submit.native.prevent label-width="88px">
                <el-form-item label="菜单名称">
                  <el-input
                    v-model="menuDetail.name" 
                    @blur="testMenu()"
                    placeholder="仅支持中英文和数字，字数不超过4个汉字或8个字母">
                  </el-input>
                </el-form-item>
                <div v-if='!hasTrueName' class="tipsName">
                  <span class="ym-form-item__error">{{textTips}}</span>
                  <!-- <a href="https://kf.qq.com/faq/181228f2iMV7181228RbMfAr.html" target="_blank">查看详情</a> -->
                </div>
                <el-form-item v-if="hasSubList" label="菜单内容">
                  <el-radio
                    label='1'
                    v-model="menuDetail.clickBehavior"
                    @change="_handleBehaviorType('1')"
                  >发送消息</el-radio>
                  <el-radio
                    label='2'
                    v-model="menuDetail.clickBehavior"
                    @change="_handleBehaviorType('2')"
                  >跳转网页</el-radio>
                  <!-- <el-radio label="miniprogram" disabled>跳转小程序</el-radio> -->
                </el-form-item>
              </el-form>
              <div v-show="menuDetail.clickBehavior == '1' && hasSubList" class="message-content__section">
                <section class="menu-content__area">
                  <ul class="radio-tabs">
                    <li @click="_handleChangeBehaviorType('1')" :class="{active: menuDetail.behaviorType == '1'}">
                      <i class="icon iconfont iconicon-tupian"></i>
                      <span>图片</span>
                    </li>
                    <li @click="_handleChangeBehaviorType('2')" :class="{active: menuDetail.behaviorType == '2'}">
                      <i class="icon iconfont iconicon-wenzi"></i>
                      <span>文字</span>
                    </li>
                    <li @click="_handleChangeBehaviorType('3')" :class="{active: menuDetail.behaviorType == '3'}">
                      <i class="icon iconfont iconicon-tuwen"></i>
                      <span>图文</span>
                    </li>
                  </ul>
                  <div class="slot-content">
                    <!-- 图片 -->
                    <Picture
                        ref="pictureComponent"
                        v-if="menuDetail.behaviorType === '1'"
                        :image-msg="menuDetail.behaviorBody.imageMsg.picUrl"
                        @handlerPic="handlerPic"
                    ></Picture>
                    <!-- 文字 -->
                    <anser-text
                        :serve-text="menuDetail.behaviorBody.textMsg.text"
                        v-if="menuDetail.behaviorType === '2'"
                        @handlerText="handlerText"
                    ></anser-text>
                    <!-- 图文 -->
                    <image-text
                        ref="newMsg"
                        v-if="menuDetail.behaviorType === '3'"
                        :news-msg="menuDetail.behaviorBody.newsMsg"
                        :replyType= 'replyType'
                        @handlerSaveImgText="handlerSaveImgText"
                    ></image-text>
                  </div>
                </section>
              </div>
              <!-- 跳转链接 -->
              <div v-show="menuDetail.clickBehavior == '2' && hasSubList" class="website-area">
                <div class="selectUrl">
                  <span>设置跳转链接</span>
                  <div>
                    <p>{{menuDetail.behaviorBody.customMenuRedirectMsg.title}}</p>
                    <!-- <i class="iconfont iconicon-des-lj" @click="selectUrl"></i> -->
                  </div>
                  <button class="cl-button cl-button--primary_notbg" @click="selectUrl">{{menuDetail.behaviorBody.customMenuRedirectMsg.title ? '修改链接':'选择链接'}}</button>
                </div>
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
import draggable from 'vuedraggable';
import { getLocal } from '@/libs/local';
import ImageText from "@/components/wechat-account/auto-answer/image-text.vue";
import { getMenuTree, getMenuDetail,addMenu,publishMenu,removeMenu,updateMenu,modifyMenuOrder } from "@/api/request/account.js";
export default {
  data() {
    return {
      model: {
          PageIndex: null,
          Type: null,
          Id: null,
          Href: null
      },
      hasTrueName: true,
      replyType: "1", //replyType 回复类型
      isShowPopup: false,
      curIndex: 0,
      hasSubList: false,
      curSubIndex: -1,
      orderIndex: false,
      isOrder: false,
      replyContentType: "picture",
      menuWords: "",
      chooseImg: "",
      menuTree: [],
      canOrder: false,
      isCanAdd: true,
      textTips: '名称仅包含中英文、数字、特殊符号。',
      text: '2',
      menuDetail: {
        id: false,
        siteId: this.$store.state.dashboard.siteId || getLocal("ymSd"),
        name: "",
        clickBehavior: '1', // None 0无, Reply1消息, RedirectUrl2 链接, RedirectSmallProgram3 小程序
        behaviorType: '1',//None0无,Image1图片,Text2文字,News3图文,； Url网址,WZPage页面, WZNews文章,WZProduct产品
        behaviorBody: {
          imageMsg: {
            picUrl: '',
            weChatMediaId: ''
          },
          textMsg: {
            text: ''
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
            urlType: "",
            title: "",
            urlData: "请选择跳转链接",
            contentPageId: ""
          }
        }
      },
      siteId: this.$store.state.dashboard.siteId || getLocal("ymSd")
    };
  },
  components: {
    OrderMenu,
    WebsiteLink,
    Picture,
    AnserText,
    ImageText,
    draggable,
    PopUp
  },
  created() {
    let wx_status = this.$store.state.wxaccount.wx_status || getLocal("wx_status")
      if (!wx_status.isCertification) {
        this._getWxIsAuth()
      }
  },
  mounted() {
    this._getMenuTree();
  },
  methods: {
    //拖拽排序
    async end (list) {
      let newlist = []
      list.map(item=> {
        newlist.push(item.id)
      })
      let {status} = await modifyMenuOrder(this.siteId,newlist);
      if (status == 200) {
        this._getMenuTree()
      }
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      this.siteId = this.$store.state.dashboard.siteId
    },
    async _getMenuTree(val) {
      let { data } = await getMenuTree(this.siteId);
      this.menuTree = data;
      if(val != 'add' && this.menuTree.length >0) {
        //页面初始化数据回填
        if (this.menuTree[0].subMenuList.length > 0) {
          this._getMenuDetail(this.menuTree[0].subMenuList[0].id)
          this.curSubIndex = 0
          this.curIndex = 0
        } else {
          this.curSubIndex = -1
          this.curIndex = 0
          this._getMenuDetail(this.menuTree[0].id)
        }
      } else if (val == 'add') {
        //点击添加按钮时选择刚添加的按钮并且回填按钮详情
        let id = this.curSubIndex == -1 ? this.menuTree[this.curIndex].id : this.menuTree[this.curIndex].subMenuList[this.curSubIndex].id
        this._getMenuDetail(id)
      }
      if(this.menuTree.length >=2 || (this.menuTree.length > 0 && this.menuTree[0].subMenuList && this.menuTree[0].subMenuList.length >=2)) {
        this.canOrder = true
      } else {
        this.canOrder = false
      }
    },
    handleClosePopup (val,data){
      this.isShowPopup = val
      if (data) {
        this.menuDetail.behaviorBody.customMenuRedirectMsg.title= data.Title;
        this.menuDetail.behaviorBody.customMenuRedirectMsg.urlType= data.Type;
        this.menuDetail.behaviorBody.customMenuRedirectMsg.urlData= data.Href;
        this.menuDetail.behaviorBody.customMenuRedirectMsg.contentPageId= data.Id;
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
      if (data.hasChildren) {
        this.menuDetail.clickBehavior = 0;
        this.menuDetail.behaviorType = 0;
      } else {
        this.menuDetail.clickBehavior = data.clickBehavior == 0? '1' : JSON.stringify(data.clickBehavior);
        this.menuDetail.behaviorType = data.behaviorType == 0 ?  '1' : JSON.stringify(data.behaviorType);
      }
      let behaviorBody = data.behaviorBody;
      if (data.hasChildren) {
        this.hasSubList = false
      } else {
        this.hasSubList = true
      }
      if (behaviorBody) {
        if(behaviorBody.imageMsg && behaviorBody.imageMsg.picUrl) {
          this.menuDetail.behaviorBody.imageMsg.picUrl = behaviorBody.imageMsg.picUrl
        } else {
          this.menuDetail.behaviorBody.imageMsg.picUrl = '';
        }
        if(behaviorBody.textMsg && behaviorBody.textMsg.text) {
          this.menuDetail.behaviorBody.textMsg = behaviorBody.textMsg
        } else {
          this.menuDetail.behaviorBody.textMsg.text = '';
        }
        if(behaviorBody.newsMsg) {
          this.menuDetail.behaviorBody.newsMsg = behaviorBody.newsMsg
        }
        if(behaviorBody.customMenuRedirectMsg) {
          this.menuDetail.behaviorBody.customMenuRedirectMsg = behaviorBody.customMenuRedirectMsg
        }
      } else {
        this.menuDetail.behaviorBody.imageMsg.picUrl = '';
        this.menuDetail.behaviorBody.textMsg.text = '';
        this.menuDetail.behaviorBody.newsMsg = [];
        this.menuDetail.behaviorBody.customMenuRedirectMsg = {};
      }
      this.isCanAdd = true
    },
    _handleChangeBehaviorType(val) {
      this.menuDetail.behaviorType = val
    },
    // 菜单排序
    _handleMenuOrder() {
      if(!this.canOrder) {
        return
      }
      let flag = this.testParameters();
      if (!flag && !this.isOrder) {
        notify(this, '请完善菜单信息', "error");
        return
      }
      this.isOrder = !this.isOrder;
      if (!this.isOrder) {
        this.orderIndex = false
      }
    },
    _handleBehaviorType(val) {
      this.menuDetail.clickBehavior =val 
    },
    // 切换menu
    async _handleSelectMenu(type,i,id) {
      //点击自身
      if (!this.isOrder &&  id == this.menuDetail.id  ) {
        console.log(id,this.menuDetail.id,'333')
        return
      }
      //在排序时
      if (this.isOrder) {
        this.orderIndex = i
        return
      } 

      if (!this.hasTrueName) {
        return
      }
      let flag = this.testParameters();
      if (!flag) {
        notify(this, '请完善菜单信息', "error");
        return
      }
      let dataDetail = this.menuDetail
      dataDetail.behaviorType = JSON.parse(this.menuDetail.behaviorType)
      dataDetail.clickBehavior = JSON.parse(this.menuDetail.clickBehavior)
      let  data = await updateMenu(dataDetail)
      
      if (data.status == 200) {
        //同步菜单name
        this.hasChangeMeunName()
        if (type == 1) {
        // type 1 点击父菜单 2 点击子菜单
          this.curIndex = i;
          this.curSubIndex = -1;
          if(this.menuTree[i].subMenuList.length <= 0) {
            this.hasSubList = true
          } else {
            this.hasSubList = false
          }
        } else if(type == 2) {
          this.curSubIndex = i;
          this.hasSubList = true
        }
        this._getMenuDetail(id)
      } else {
        notify(this, '请完善菜单信息', "error");
      }
    },
    //校验参数 
    testParameters(){
      if(!this.menuDetail.id) {
        this.isCanAdd = true
        return
      }
      let flag = true;
      this.testMenu()
      if (!this.hasTrueName || !this.menuDetail.name) {
        flag = false
        console.log('flag',1)
      } else if(this.hasSubList) {
        if(this.menuDetail.behaviorType == '0' || this.menuDetail.clickBehavior == '0') {
          flag = false
          console.log('flag',2)
        }
        // 发送消息
        if (this.menuDetail.clickBehavior == 1) {
          // 1 图片 2 文字 3 图文
          if(this.menuDetail.behaviorType == 1 && !this.menuDetail.behaviorBody.imageMsg.picUrl) {
            flag = false
            console.log('flag',3)
          } else if (this.menuDetail.behaviorType == 2 ) {
            if (!this.menuDetail.behaviorBody.textMsg.text) {
              flag = false
            } else {
              let str = this.menuDetail.behaviorBody.textMsg.text
              let strFlag = false
              for (let i=0; i<str.length; i++) { 
                let c = str.charCodeAt(i);
                if (c != 32 && c!= 10) {
                  strFlag = true
                }
              }
              if (!strFlag) {
                flag = false
              }
            }
            console.log('flag',4)
          } else if (this.menuDetail.behaviorType == 3 && this.menuDetail.behaviorBody.newsMsg.length == 0) {
            flag = false
            console.log('flag',5)
          }
        } else if(this.menuDetail.clickBehavior == 2) {
          // 4 纯URL 5 页面 6 文章 7 产品
          if (!this.menuDetail.behaviorBody.customMenuRedirectMsg.urlData) {
            flag = false
            console.log('flag',6)
          } else if ((this.menuDetail.behaviorType == 6 || this.menuDetail.behaviorType == 7) &&!this.menuDetail.behaviorBody.customMenuRedirectMsg.contentPageId){
            flag = false
            console.log('flag',7)
          }
        }
      }
      return flag
    },
    // 添加菜单
    async _handleAddMainMenu(name,order,id,level) {
      if(!this.isCanAdd) {
        return
      }
      this.isCanAdd = false
      if (level == 1 && order == 1) {
        if(!this.menuDetail.name) {
          this.isCanAdd = true
          return
        }
        this.$confirm("提示", {
          title: "提示",
          iconClass: "icon-warning",
            message:  `添加子菜单后，主菜单的内容将被清除。确定添加子菜单？`,
            callback: async action => {
                if (action === "confirm") {
                  this.addMenu(name,order,id,level)
                } else {
                  this.isCanAdd = true
                }
            }
        });
      } else {
        this.addMenu(name,order,id,level)
      }
    },
    //添加
    async addMenu (name,order,id,level) {
      let flag = this.testParameters();
      let  dataObj = {};

      //校验菜单名
      if (!this.hasTrueName) {
        this.isCanAdd = true
        return
      }
      //确认是否添加第一个子菜单
      
      //前端校验
      if (order > 0 && flag ) {
        console.log('00002')
        let dataDetail = this.menuDetail
        dataDetail.behaviorType = JSON.parse(this.menuDetail.behaviorType)
        dataDetail.clickBehavior = JSON.parse(this.menuDetail.clickBehavior)
        dataObj = await updateMenu(dataDetail)
      }else if (order > 0 && !flag && !(order== 1 && level == 1)) {
        notify(this, '请完善菜单信息', "error");
        this.isCanAdd = true
        return
      }
      //接口校验
      if (order == 0 || dataObj.status == 200 || (order== 1 && level == 1)) {
        let nameOrder = 1
        if(this.menuTree.length > 0) {
          if(level == 1) {
            this.menuTree.map((item,index)=> {
              nameOrder = item.subMenuList.length + nameOrder
            }) 
          } else {
            nameOrder = this.menuTree.length + nameOrder
          }
        }
        let newMenuItem = {
          name: name + nameOrder,  //菜单名称
          displayOrder: order, //菜单排序
          parentId: id, //父菜单id，当为父菜单时为0
          siteId: this.siteId, //站点id
          menuLevel: level //父菜单为0，子菜单为1
        };
        let data =  await addMenu(newMenuItem);
        if(data.status && data.status == 200 ) {
          notify(this, '添加菜单成功', "success");
          this._getMenuTree('add')
          //添加成功，改变按钮状态
          //校验信息
          if (level == 0) {
          // level 0 点击添加父菜单 1 点击添加子菜单 
            this.curIndex = order;
            this.curSubIndex = -1;
          } else if(level == 1) {
            this.curSubIndex = order-1;
            this.hasSubList = true
          }
        } else {
          notify(this, '添加菜单失败', "error");
          this.isCanAdd = true
        }
      }
    },
    // 删除菜单
    async _handleDeleteMenu() {
      this.$confirm("提示", {
        title: "提示",
        iconClass: "icon-warning",
          message:  `删除后，"${this.menuDetail.name}"菜单下设置的内容将被删除，是否确定删除？`,
          callback: async action => {
              if (action === "confirm") {
                  let data = await removeMenu(this.siteId, this.menuDetail.id);
                  if(data && data.status == 200 ) {
                    notify(this, '菜单删除成功', "success");
                    this._getMenuTree()
                  } else {
                    notify(this, '菜单删除失败', "error");
                  }
              }
          }
      });
    },
    // 保存并发布
     async _handleSaveAndPublish() {
       if (this.menuTree.length == 0 || !this.hasTrueName) {
        return
      }
      let flag = this.testParameters();
      if (!flag) {
        notify(this, '请完善菜单信息', "error");
        return
      }
      this.$confirm("提示", {
        title: "提示",
        iconClass: "icon-warning",
          message:  `发布成功后会覆盖原版本，且将在24小时内对所有用户生效，是否确认发布？`,
          callback: async action => {
            if (action === "confirm") {
              let dataDetail = this.menuDetail;
                  dataDetail.behaviorType = JSON.parse(this.menuDetail.behaviorType);
                  dataDetail.clickBehavior = JSON.parse(this.menuDetail.clickBehavior);
              let data = await publishMenu(dataDetail);
              if (data && data.status == 200) {
                this.menuDetail.behaviorType = JSON.stringify(this.menuDetail.behaviorType);
                this.menuDetail.clickBehavior = JSON.stringify(this.menuDetail.clickBehavior);
                //同步菜单name
                notify(this, '保存并发布成功', "success");
                //this.hasChangeMeunName()
              } else {
                // notify(this, '保存并发布失败', "error");
                this.menuDetail.behaviorType = JSON.stringify(this.menuDetail.behaviorType);
                this.menuDetail.clickBehavior = JSON.stringify(this.menuDetail.clickBehavior);
              }
            }
          }
      });
    },
    //同步本地菜单列表name
    hasChangeMeunName () {
      for(let i =0; i<this.menuTree.length; i++) {
        if(this.menuTree[i].id == this.menuDetail.id) {
          this.menuTree[i].name = this.menuDetail.name
          return
        }
        if(this.menuTree[i].subMenuList.length > 0) {
           for(let j =0; j<this.menuTree[i].subMenuList.length; j++) {
            if(this.menuTree[i].subMenuList[j].id == this.menuDetail.id) {
              this.menuTree[i].subMenuList[j].name = this.menuDetail.name
              return
            }
           }
        }
      }
    },
    // 获取图片
    handlerPic(picUrl) {
      this.menuDetail.behaviorBody.imageMsg.picUrl = picUrl;
    },
    // 文字回复输入
    handlerText(text) {
      this.menuDetail.behaviorBody.textMsg.text = text;
    },
    //获取图文详情
    handlerSaveImgText(list) {
      this.menuDetail.behaviorBody.newsMsg = list;
    },
    //校验菜单名称
    testMenu(){
      //汉字19968至40869
      //数字 48-57
      //A-Z:65-90,a-z:97-122
      //-+&. :45 43 38 46 32
      // 校验菜单名
      this.hasTrueName = true
      let typeNum = this.curSubIndex == -1? 8:16;
      let str = this.menuDetail.name;
      let BlankNum = 1;
      let strLength = 0;
      for(let i = 0; i<this.menuTree.length;i++) {
        if(str == this.menuTree[i].name && this.menuDetail.id != this.menuTree[i].id) {
          this.hasTrueName = false
          this.textTips = '菜单名已存在,请重新输入'
          return
        } else if (this.menuTree[i].subMenuList.length>0) {
          for(let j = 0; j<this.menuTree[i].subMenuList.length;j++) {
            if(str == this.menuTree[i].subMenuList[j].name && this.menuDetail.id != this.menuTree[i].subMenuList[j].id) {
              this.hasTrueName = false
              this.textTips = '菜单名已存在,请重新输入'
              return
            }
          }
        }
      }
      let firstBlankIndex = false;
      for (let i=0; i<str.length; i++) { 
        let c = str.charCodeAt(i);
        if (c == 45 || c == 43 || c == 38 || c == 46 || c == 32){
          strLength = strLength + 1;
          if (c==32 && !firstBlankIndex) {
            firstBlankIndex = i
          } else if (c==32) {
            BlankNum = BlankNum + 1;
            if (BlankNum == 2 && isRule) {
              this.hasTrueName = i-firstBlankIndex==1?false:true
              this.textTips = '菜单名不能包含3个以上空格'
              return
            } else {
              this.hasTrueName = false
              this.textTips = '菜单名不能包含3个以上空格'
              return
            }
          }
        } else if ((c >=65 && c <=90) || (c >=97 && c <=122)) {
          strLength = strLength + 1
        } else if (c >=48 && c <=57) {
          strLength = strLength + 1
        }else if (c >=19968 && c <=40869) {
          strLength = strLength + 2
        } else {
          this.hasTrueName = false
          this.textTips = '仅支持包含中英文,数字,特殊字符("-" "+" "." 空格)'
          return
        }
      }
      if (strLength == 0 || strLength >typeNum) {
        this.hasTrueName = false
        this.textTips = `菜单名称字数不可超过${typeNum/2}个汉字或者${typeNum}个字母`
        return
      }
      if(this.hasTrueName){
        this.hasChangeMeunName()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-menu {
  font-size: 24px !important;
  font-weight: 300;
}
.el-input /deep/ .el-input__inner {
  width: 240px;
}
.el-form /deep/ .el-form-item__label {
  font-size: $--font-size-small;
  color: $--color-text-primary !important;
  padding-right: 16px;
}
.holder h3 {
  text-align: center
}
.message-content__section {
  background-color: #fff;
  border-radius:$--border-radius-base;
  height: 348px;

  .radio-tabs {
    height: 40px;
    background:rgba(240,243,247,1);
    border-radius:1px 1px 0px 0px;
    li {
      float: left;
      font-size:12px;
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:40px;
      padding: 0 15px 0 30px;
      cursor: pointer;
      i {
        font-size: 12px;
        margin-right: 8px;
      }
      &.active {
        color: $--color-primary;
        i {
          color: $--color-primary;
        }
      }
    }
  }
  .slot-content {
    width: 100%;
    height: 308px;
    overflow: auto;
  }
}
.define-menu__area {
  margin: 0 auto;
  min-width: 990px;
  border-radius: 20px;
  .phone-bg {
    height: 528px;
    border: $--border-base;
  }
  .phone-box__area {
    position: relative;
    float: left;
    margin: 0;
    width: 295px;
    height: 526px;
    background: url("~img/account/account_menu_phone.png") no-repeat center
      center;
    background-size: 100% 100%;
    .phone-menu__area {
      position: absolute;
      left: 56px;
      bottom: 1px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 238px;
      height: 48px;
      background: rgba(248, 250, 252, 1);
      .phone-menu__divider {
        width: 1px;
        height: 32px;
        background: $--background-color-selected;
      }
      .no-menu__area {
        width: 100%;
        height: 52px;
        text-align: center;
        line-height: 52px;
        color: $--color-primary;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
      }
      .phone-menu__list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        background: #fff;
        li:nth-child(3) {
          .menu-child__area {
            left: 5px;
          }
        }
        li {
          position: relative;
          padding: 8px 0;
          width: 106px;
          height: 32px;
          list-style: none;
          line-height: 32px;
          text-align: center;
          color: $--color-text-primary;
          border-right: $--border-base;
          cursor: pointer;
          .menu-child__area {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 54px;
            width: 146x;
            border: $--border-base; // 需换底图
            border-radius: $--border-radius-base;
            li {
              margin: 0 auto;
              padding: 8px 6px;
              height: 34px;
              line-height: 34px;
              display: list-item;
              text-align: center;
              width: 140px;
              font-size: 12px;
              color: #262626;
              border-right: none;
              border-top: $--border-base;
              cursor: pointer;
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
          color: $--color-primary !important;
          background: $--background-color-selected;
        }
      }
    }
    .order-menu__btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -42px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      padding: 0 16px;
    }
  }
  .menu-operate__arae {
    display: flex;
    justify-content: center;
    float: left;
    width: calc(100% - 295px);
    height: 526px;
    border-radius: $--border-radius-base;
    .menu-operate__none {
      width: 100%;
      background: #fff;
      display: flex;
      justify-content: center;
      .empty {
        margin-top: 240px;
        width: 160px;
        height: 130px;
        text-align: center;
        .empty-icon {
          display: inline-block;
          width: 77px;
          height: 48px;
          background: url("~img/account/accout_no_menu.png") no-repeat center
            center;
          background-size: contain;
        }
        p {
          margin-top: 3px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(164, 178, 191, 1);
          line-height: 20px;
          text-align: center;
        }
      }
    }
    .menu-operate__box {
      margin-left: 24px;
      width: 100%;
      border-radius: $--border-radius-base;
      border-left: $--border-base;
      background: #ffffff;
      .menu-operate__header {
        display: flex;
        padding: 0 24px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        border-bottom: $--border-base;
        height: 50px;
        p {
          font-size:12px;
          font-weight:500;
          color:rgba(38,38,38,1);
          line-height:50px;
        }
        .menu-operate__delete {
          font-size: 12px;
          font-weight: 400;
          color: $--color-primary;
          line-height: 50px;
          cursor: pointer;
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
            font-size: 12px;
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
.selectUrl {
  padding-left: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}
.selectUrl span{
    float: left;
    font-size: 12px;
    line-height: 32px;
    margin-right: 16px;
    font-weight:400;
    color:rgba(38,38,38,1);
}
.selectUrl div {
  display: flex;
  justify-content: space-between;
  width:400px;
  height:32px;
  float: left;
  background:rgba(255,255,255,1);
  border-radius:2px;
  border:$--border-base;
  font-size:12px;
  font-weight:400;
  color: #606266;
  line-height:32px;
  padding: 0 10px;
  overflow: hidden;
  margin-right: 16px;
}
.selectUrl .select-btn {
  box-sizing: border-box;
  height: 32px;
  border: 1px solid $--color-primary;
  text-align: center;
  width: 90px;
  margin: 0 0 0 12px;
  color: $--color-primary !important;
  cursor: pointer;
}
.selectUrl div i {
  color: $--color-primary;
}
.selectUrl div p {
  line-height: 32px;
}
.btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  margin: 24px 0 16px;
  .cl-button--primary {
    height: 32px;
  }
}
.btn h4 {
  height: 16px;
  margin: 10px 0;
  font-size:12px;
  font-weight:500;
  color:rgba(38,38,38,1);
  line-height:16px;
  padding-left: 16px;
  border-left: 4px solid $--color-primary;
}
.tipsName {
  padding-left: 100px;
  height: 20px;
	color: rgba(56, 56, 56, 1);
	font-size: 12px;
	line-height: 20px;
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
.el-form /deep/ .el-form-item {
  margin-bottom: 6px;
  padding: 0 24px;
}
.el-form-item /deep/ .el-form-item__label {
  color: #a1a8b1;
}
</style>