<template>
  <el-container class="member-container">
    <el-aside class="submenu-aside">
      <page-submenu>
        <template v-slot:title>网站管理</template>
      </page-submenu>
    </el-aside>
    <el-main class="member-content page-scroll">
      <el-row>
        <ChangeSite
          @chooseWebsite="chooseWebsite"
          @getSiteId="getSiteId"
          @getSiteName="getSiteName"
        />
        <el-row class="user-list">
          <span class="member-list-title fs14">短信配置</span>
          <a class="backupBtn">如何配置网站短信？</a>
        </el-row>
        <div v-if="isShowTips == '1'" class="tips" :class="tipSuccess ? 'tip-success':'tip-danger'">
          <i class="icon iconfont iconguanbi" @click="noShowTips"></i>
          <p v-if="tipSuccess">提示：网站用户使用手机号注册您的网站会员或找回会员账号密码时，网站会向用户发送验证码短信</p>
          <p v-else>提示：免费短信剩余条数为0，为不影响您的网站功能，请及时开通并配置阿里云短信服务
            <a>去配置</a>
          </p>
        </div>
        <el-main>
          <div class="domain-menu">
            <el-tabs v-model="backupType" @tab-click="handleClick">
              <el-tab-pane label="免费短信" name="free"></el-tab-pane>
              <el-tab-pane label="阿里云短信" name="aLiCloud"></el-tab-pane>
            </el-tabs>
            <router-link :to="{name:'aliaksk'}"> 
              <button v-if="backupType === 'aLiCloud' &&  smsStatus" class="cl-button btn-code cl-button--primary">修改AK/SK</button>
            </router-link> 
          </div>

          <!-- <div v-if="backupType === 'free' &&  !smsStatus" class="tips tip-danger ">
            <p>为不影响您的网站功能，请在免费短信使用完之前，及时开通并配置阿里云短信服务
              <a>立即配置</a>
            </p>
          </div> -->

          <!-- 免费短信 -->
          <div v-if="backupType === 'free'" class="table-list" id="table-list">
            <el-table
              :data="messagelist"
              tooltip-effect="dark"
              class="content-table"
            >
              <template slot="empty">
                <div class="empty-table">
                  <img src="~img/memberManage/table-empty.png" />
                  <p>暂无数据</p>
                </div>
              </template>
              <el-table-column label="短信用途" show-overflow-tooltip min-width="160">
                <template slot-scope="scope">
                  <div class="overflow">{{scope.row.smsPurposePrt}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="signName" label="签名" min-width="160"></el-table-column>
              <el-table-column prop="tempContent" label="模版内容" min-width="400">
                <!-- <template  slot-scope="scope">
                  <div>
                    <span >{{scope.row.tempName}}</span>
                    <span class="noSignName">{{ scope.row.tempContent == null ? '未设置' : ` (${scope.row.tempContent})`}}</span>
                  </div>
                </template> -->
              </el-table-column>
              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                  <div class="handle-btn-wrap">
                    <!-- <el-tooltip content="删除备份包" placement="top"> -->
                      <button @click="chakan(scope.row)">
                        <i class="iconfont iconchakan cl-iconfont is-square"></i>
                      </button>
                    <!-- </el-tooltip> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="all-total">免费短信条数剩余<span>{{freeSMSCount}}</span>条</div>
          </div>
          <!-- 阿里云短信 -->
          <div v-else>
            <div 
              v-show="!smsStatus"
              class="empty-message">
              <div class="no-message">
                <img src="~img/empty.png" alt="">
                <h5>阿里云短信</h5>
                <p>自定义各场景下发送的短信内容</p>
              </div>
              <!-- <router-link :to="{name:'aliaksk'}"> 
                <button class="cl-button cl-button--primary">立即配置</button>
              </router-link>  -->
            </div>
            <el-table
              v-show="smsStatus"
              :data="messagelist2"
              tooltip-effect="dark"
              class="content-table"
            >
              
              <el-table-column prop="smsPurposePrt" label="短信用途" min-width="160">
                <template slot-scope="scope">
                    <div>{{scope.row.smsPurposePrt}}</div>
                </template>
              </el-table-column>
              <el-table-column label="签名" valign="top" min-width="200">
                <template  slot-scope="scope">
                  <div v-if="!scope.row.isEdit" :class="{'noSignName': scope.row.signName == null}">{{scope.row.signName || '未设置'}}</div>
                  <div v-else>
                    <el-select
                      v-model="scope.row.signName"
                      placeholder="请选择短信签名"
                      @change="onblur(scope.row, scope.$index,1)"
                    >
                      <el-option
                        v-for="item in signList"
                        :key="item.id"
                        :label="item.signName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <p v-show="scope.row.nameTip" class="tips-select"><img src="~img/jian-icon.png"/>请选择短信签名</p>
                    <a class="add-code" @click="isAddAutograph = true">添加签名</a>
                  </div>
                </template>   
              </el-table-column>
              <el-table-column prop="tempContent" label="模版" valign="top" min-width="360">
                 <template  slot-scope="scope">
                  <div v-if="!scope.row.isEdit">
                    <span >{{scope.row.tempName}}</span>
                    <span class="noSignName">{{ scope.row.tempContent == null ? '未设置' : ` (${scope.row.tempContent})`}}</span>
                  </div>
                  <div v-else>
                    <el-select
                      v-model="scope.row.tempName"
                      placeholder="请选择短信模版"
                      @change="onblur(scope.row, scope.$index,2)"
                    >
                      <el-option
                        v-for="item in templateList"
                        :key="item.id"
                        :label="item.tempName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <p v-show="scope.row.templateTip" class="tips-select"><img src="~img/jian-icon.png"/>请选择短信模版</p>
                    <a class="add-code" @click="isAddTemplate =true">添加模版</a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isEdit" class="handle-btn-wrap">
                    <el-tooltip content="编辑" placement="top">
                      <button  @click="hasEdit( scope.$index )">
                        <i class="iconfont iconbianji cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                    <el-tooltip content="预览" placement="top">
                      <button v-if="scope.row.tempContent != null" @click="chakan( scope.row )">
                        <i class="iconfont iconchakan cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                  </div>
                  <div v-else class="handle-btn-wrap text-btn">
                      <button @click="getSmsList( scope.$index )">
                        取消
                      </button>
                      <button @click="save( scope.row, scope.$index )">
                        保存
                      </button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="backupType === 'free'" class="backupTip">
            <p class="title">免费短信说明</p>
            <p>1.默认使用【云企业官网】作为短信签名，不支持自定义短信签名与模板内容；</p>
            <p>2.超出免费条数或需自定义短信签名和模板，请使用阿里云短信。</p>
          </div>
          <div 
            v-show="backupType === 'aLiCloud' && smsStatus "
            class="message-switch"
          >
            <span>优先使用免费短信 </span>
            <el-tooltip content="开启后，网站短信将优先使用免费短信发送" placement="top">
              <i class="iconfont iconicon-exclamationmark" style="color:#e5e5e5;margin: 0 16px 0 6px;"></i>
            </el-tooltip>
            <el-switch
              class="switch"
              @change="changeMessageSwitch"
              v-model="messageSwitch">
            </el-switch>
          </div>
          <div v-show="backupType === 'aLiCloud' && smsStatus" class="backupTip">
            <p class="title">阿里云短信说明</p>
            <p>1.请先在阿里云控制台申请短信签名与模板，<a>如何申请？</a></p>
            <p>2.将审核通过的短信签名与模板添加至系统后台；<a>去添加</a></p>
          </div>
        </el-main>
      </el-row>
    </el-main>
    <div class="message-view" v-if="messageView">
      <div class="phone">
        <span class="line"></span>
        <div>
          <p>{{messageText}}
            <span class="arrow"></span>
          </p>
        </div>
        <i class="icon iconfont iconguanbi" @click="messageView=false"></i>
      </div>
    </div>
    <add-template
      v-if="isAddTemplate"
      @closeAddTemplate="closeAddTemplate"
      @saveAddTemplate="saveAddTemplate"
    ></add-template>
    <add-autograph
      v-if="isAddAutograph"
      @closeAddAutograph="closeAddAutograph"
      @saveAddAutograph="saveAddAutograph"
    ></add-autograph>
  </el-container>
</template>

<script>
import RightPannel from "_c/RightPannel";
import PageSubmenu from "@/components/common/PageSubmenu";
import ChangeSite from "@/components/websiteManage/changeSite";
import AddTemplate from "@/components/websiteManage/addCode/add-template";
import AddAutograph from "@/components/websiteManage/addCode/add-autograph";
import * as dashboardApi from "@/api/request/dashboardApi";
import { setLocal,getLocal } from "@/libs/local"
export default {
  components: {
    RightPannel,
    PageSubmenu,
    AddTemplate,
    AddAutograph,
    ChangeSite
  },
  data() {
    return {
      siteName: "",
      siteId: this.$store.state.dashboard.siteId,
      isShowTips: '1',
      messageView: false,
      messageText: '',
      isEdit: false,
      editSMS: false,
      editCode: false,
      smsPurpose1: 0,
      smsPurpose2: 0,
      isAddTemplate: false,
      isAddAutograph: false,
      messageSwitch: true,
      freeSMSCount:0,
      messagelist: [],
      messagelist2: [],
      templateList: [],
      signList: [],
      backupType: "free",
      smsStatus: false,
      tipSuccess: false
    };
  },
  created(){
    this.isShowTips = getLocal('isShowTips') || '1'
    this.getIsPreUseFreeSMS()
    this.getSurplusFreeSMSCount()
    this.getSmsList()
    this.getAkSk()
  },
  methods: {
    // 获取siteId
    getSiteId(siteId) {
      this.siteId = siteId;
      //this.getBackupSite(siteId);
    },
    // 获取siteName
    getSiteName(siteName) {
      this.siteName = siteName;
    },
    // 选择切换网站
    chooseWebsite(siteId) {
      this.siteId = siteId;
      this.getSmsList()
      this.getIsPreUseFreeSMS()
    },
    /**
     * 切换免费和阿里云短信
     */
    handleClick() {
      this.getSmsList()
    },
    //获取ak和Sk情况
    async getAkSk() {
      let { data,status } = await dashboardApi.getAkSk();
      if(!data.ak || !data.sk || !data.smsAuthorization) {
        this.smsStatus = false
      } else {
        this.smsStatus = true
      }
      console.log(data,this.smsStatus)
    },
    //获取短信列表
    async getSmsList() {
      let isSystem = this.backupType === 'free' ? true: false
      let { data,status } = await dashboardApi.getSmsList(this.siteId,isSystem);
      if(isSystem) {
        this.messagelist = data
      }else {
        this.messagelist2 = data
        for (var i = 0; i < this.messagelist2.length; i++) {
          this.messagelist2[i].isEdit = this.messagelist2[i].nameTip = this.messagelist2[i].templateTip = false
        }
      }
    },
    //获取免费短信条数
    async getSurplusFreeSMSCount(){
      let { data,status } = await dashboardApi.getSurplusFreeSMSCount();
      if(status == 200){
        this.freeSMSCount = data
        this.tipSuccess = data > 0 ? true:false;
      }
    },
    async getIsPreUseFreeSMS(){
      let { data,status } = await dashboardApi.getIsPreUseFreeSMS(this.siteId);
      if(status == 200){
        this.messageSwitch = data
      }
    },

    //编辑签名和模版
    async hasEdit(ind){
      let tampList = this.messagelist2
      this.messagelist2 = []
      for (var i = 0; i < tampList.length; i++) {
          if(ind == i) {
            tampList[i].isEdit = !tampList[i].isEdit
          }
          this.messagelist2.push(tampList[i])
        }
      this.saveAddAutograph()
      this.saveAddTemplate()
    },
    /**
     * 查看短信信息
     */
    async chakan(val) {
      this.messageView = true,
      this.messageText = `【${val.signName}】${val.tempContent}`
    },
    //保存
    async save(val,ind) {
      console.log(val,'888')
      this.onblur(val,ind,0)
      if(!val.signName || !val.tempName ) {
          return
      }
      // let tempId = ''
      // let signId = ''
      // for (var i = 0; i < this.templateList.length; i++) {
      //   if(this.templateList[i].tempName == val.tempName) {
      //     tempId = this.templateList[i].id
      //   }
      // }
      // for (var i = 0; i < this.signList.length; i++) {
      //   if(this.signList[i].signName == val.signName) {
      //     signId = this.signList[i].id
      //   }
      // }
      let  params= {
        id: val.id, 
        siteId: this.siteId,
        signId: val.signId || val.signName,
        tempId: val.tempId || val.tempName,
        sMSPurpose: val.smsPurpose,
      }
      let data 
      if(params.id) {
        data = await dashboardApi.updateCustomSms(params)
      } else {
        data = await dashboardApi.addCustomSms(params)
      }
      if(data.status == 200) {
        this.getSmsList()
        this.$notify({
          customClass: "notify-success", // error success
          message: `保存成功`,
          duration: 1500,
          showClose: false
        });
      }
    },
    
    //  修改签名或者模版
    onblur(val,ind,type){
        let tampList = this.messagelist2
        this.messagelist2 = []
        for (var i = 0; i < tampList.length; i++) {
            if(ind == i) {
              if(val.signName == null && (type == 1 || type == 0)) {
                tampList[i].nameTip = true
              } else if(val.signName != null && (type == 1 || type == 0)) {
                tampList[i].nameTip = false
              }
              if(val.tempName == null && (type == 2 || type == 0)) {
                tampList[i].templateTip = true
              } else if(val.tempName!= null && (type == 2 || type == 0)){
                tampList[i].templateTip = false
              }
            }
            this.messagelist2.push(tampList[i])
          }
    },
    // 是否开启免费短信
    async changeMessageSwitch(val){
      let { data } = await dashboardApi.setIsPreUseFreeSMS(this.siteId,this.messageSwitch);
    },
    //关闭添加模版
    closeAddTemplate(){
      this.isAddTemplate = false
    },
    //保存添加模版
    async saveAddTemplate(val){
      this.isAddTemplate = false
      //获取当前模版列表
      let data1 = await dashboardApi.getCustomTemplateList();
      this.templateList = data1.data
    },
    //关闭添加签名
    closeAddAutograph(){
      this.isAddAutograph = false
    },
    //保存添加签名
    async saveAddAutograph(val){
      this.isAddAutograph = false
      //获取当前签名列表
      let  data2  = await dashboardApi.getSiteSMSSignList();
      this.signList = data2.data
    },
    //关闭提示语 
    noShowTips(){
      setLocal('isShowTips','2')
      this.isShowTips = '2'
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  right: 0;
}
.noSignName {
  color: $--color-text-regular;
}
.empty-table {
    padding: 20px;
    text-align: center;
    height: 200px;
}
.content-table /deep/ .el-tooltip .el-popover__reference {
  width: 100%;
}
.el-table /deep/ td {
  vertical-align: top;
}
.el-table /deep/ .el-table__body-wrapper .el-table__row .cell span {
  display: inline-block;
}
.backupBtn {
  position: absolute;
  right: 0;
  top: 0;
  font-size: $--font-size-small;
  line-height: 14px;
  color: $--color-primary;
}
.content-table {
  width: 100%;
  box-sizing: border-box;
}
.overflow {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.all-total {
  padding-left: 10px;
  height: 55px;
  font-size:$--font-size-small;
  font-weight:400;
  color:$--color-text-regular;
  line-height:55px;
  border: $--border-base;
  border-top: none;
  background: $--color-white;
  span {
    padding: 0 8px;
    color: $--color-danger;
  }
}

.member-container {
  position: relative;
  .member-content {
    padding: 0 16px;
    .user-list {
      margin: 16px 0;
      position: relative;
      .member-list-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
      }
      a {
        cursor: pointer;
      }
    }
    .tips {
      width: 100%;
      height: 32px;
      border-radius: $--border-radius-base;
      font-size:12px;
      font-weight:400;
      padding: 0 12px;
      box-sizing: border-box;
      margin-bottom: 16px;
      p {
        line-height: 30px;
      }
      i {
        float: right;
        line-height: 30px;
      }
    }
    .tip-success {
      background:rgba(243,255,247,1);
      border:1px solid $--color-success;
      color:$--color-success;
      i {
        color:$--color-success;
      }
    }
    .tip-danger {
      background:rgba(252,242,244,1);
      border:1px solid $--color-danger;
      color:$--color-danger;
      a {
        color: $--color-info;
        cursor: pointer;
        margin-left: 4px;
      }
      i {
        color:$--color-danger;
      }
    }
  }
}
.message-switch {
  height: 40px;
  padding: 0 16px;
  margin-top: 16px;
  background: $--color-white;
  border: $--border-base;
  display: flex;
  align-items: center;
}
.backupTip {
  height: 128px;
  padding: 0 16px;
  margin-top: 16px;
  background: $--color-white;
  border: $--border-base;
  .title {
    font-size: 14px;
    font-weight:500;
    margin-top: 10px;
  }
  p {
    font-size:12px;
    font-weight:400;
    color:$--color-text-primary;
    line-height:32px;
    a {
      color: $--color-primary;
      cursor: pointer;
    }
  }
}
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin-bottom: 12px;
  .btn-code {
    position: absolute;
    top: 9px;
    right: 12px;
  }
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

.handle-btn-wrap {
  button:nth-child(1) {
    margin-right: 32px;
  }
}
.text-btn button:hover{
  color: $--color-primary;
}

//手机预览样式
.message-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:rgba(38,38,38,0.6);
  z-index: 2000;
  .phone {
    position: relative;
    width: 300px;
    height: 450px;
    margin: 60px auto 0;
    padding: 45px 0;
    background: $--background-color-base;
    border-radius: 45px;
    .line {
      position: absolute;
      top: 22px;
      left: 134px;
      width:32px;
      height:2px;
      border-radius: 1px;
      background:rgba(229,229,229,1);
      border-radius:6px;
    }
    .iconguanbi {
      position: absolute;
      top: 0;
      right: -70px;
      padding: 8px;
      font-size: 18px;
      font-weight: 600;
      color: $--color-text-secondary;
      border-radius: $--border-radius-circle;
      &:hover {
        color: $--color-primary;
      }
    }
    div {
      width: 100%;
      height: 100%;
      border-top: $--border-base;
      border-bottom: $--border-base;
      p {
        position: relative;
        width:240px;
        min-height:70px;
        margin: 40px 0 0 20px;
        padding: 10px 6px;
        background: rgba(38, 38, 38, 0.1);
        border-radius:2px 2px 2px 0px;
        border-radius: $--border-radius-base;
        font-size: $--font-size-small;
        font-weight:400;
        color:$--color-text-primary;
        line-height:20px;
        .arrow {
          position: absolute;
          left: -12px;
          bottom: 0;
          width: 0;
          height: 0;
          border-bottom: 10px solid rgba(38, 38, 38, 0.1);
          border-left: 12px solid transparent;
        }
      }
    }
  }
}
//阿里云无短信
.empty-message {
  width:100%;
  height:267px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  border-radius:2px;
  text-align: center;
  border:1px solid rgba(215,216,217,1);
  .no-message {
    width:300px;
    height:147px;
    margin: 24px auto;
    background:rgba(249,249,249,1);
    border-radius:3px;
    text-align: center;
    img {
      margin-top: 36px;
      width: 32px;
      height: 24px;
    }
    h5 {
      margin-top: 16px;
      font-size:$--font-size-small;
      color: $--color-text-primary;
      line-height:18px;
    }
    p {
      margin-top: 8px;
      font-size:$--font-size-small;
      font-weight:400;
      line-height:18px;
    }
  }
}
.tips-select {
  display: inline-block;
  width: 100%;
  margin-top: 8px;
  font-size:$--font-size-small;
  color: $--color-text-primary;
  line-height: 16px;
  img  {
    float: left;
    margin: 2px;
    width: 14px;
    height: 14px;
  }
}
.add-code {
  display: inline-block;
  margin-top: 8px;
  width: 100%;
  font-size:$--font-size-small;
  color:$--color-primary;
  line-height:16px;
  cursor: pointer;
}

</style>
