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
          </div>

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
                  <div class="overflow">{{scope.row.messageinfo1}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="messageinfo2" label="签名" min-width="160"></el-table-column>
              <el-table-column prop="messageinfo3" label="模版" min-width="400"></el-table-column>
              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                  <div class="handle-btn-wrap">
                    <el-tooltip content="删除备份包" placement="top">
                      <button @click="chakan( scope )">
                        <i class="iconfont iconchakan cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="all-total">免费短信条数剩余<span>2000</span>条</div>
          </div>
          <!-- 阿里云短信 -->
          <div v-else>
            <div 
              v-show="messagelist2.length <=0"
              class="empty-message">
              <div class="no-message">
                <img src="~img/empty.png" alt="">
                <h5>阿里云短信</h5>
                <p>自定义各场景下发送的短信内容</p>
              </div>
              <button class="cl-button cl-button--primary">立即配置</button>
            </div>
            <el-table
              v-show="messagelist2.length >0 "
              :data="messagelist2"
              tooltip-effect="dark"
              class="content-table"
            >
              
              <el-table-column prop="messageinfo1" label="短信用途" min-width="160">
                <template slot-scope="scope">
                    <div>{{scope.row.messageinfo1}}</div>
                </template>
              </el-table-column>
              <el-table-column label="签名" min-width="160">
                <template  slot-scope="scope">
                  <div v-show="!isEdit">{{scope.row.messageinfo2}}</div>
                  <div v-show="isEdit">
                    <el-select
                      v-model="scope.row.messageinfo2"
                      @change="choseCode(row)"
                    >
                      <el-option
                        v-for="item in codeList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <p class="tips-select"><img src="~img/jian-icon.png"/>请选择短信签名</p>
                    <a class="add-code" @click="isAddAutograph = true">添加签名</a>
                  </div>
                </template>   
              </el-table-column>
              <el-table-column prop="messageinfo3" label="模版" min-width="400">
                 <template  slot-scope="scope">
                  <div v-show="!isEdit">{{scope.row.messageinfo3}}</div>
                  <div v-show="isEdit">
                    <el-select
                      v-model="scope.row.messageinfo2"
                      @change="choseCode(row)"
                    >
                      <el-option
                        v-for="item in codeList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <p class="tips-select"><img src="~img/jian-icon.png"/>请选择短信模版</p>
                    <a class="add-code" @click="isAddTemplate =true">添加模版</a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="170">
                <template slot-scope="scope">
                  <div v-show="!isEdit" class="handle-btn-wrap">
                    <el-tooltip content="编辑" placement="top">
                      <button @click="hasEdit( scope )">
                        <i class="iconfont iconicon-des-Import cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                    <el-tooltip content="预览" placement="top">
                      <button @click="chakan( scope )">
                        <i class="iconfont iconchakan cl-iconfont is-square"></i>
                      </button>
                    </el-tooltip>
                  </div>
                  <div v-show="isEdit" class="handle-btn-wrap text-btn">
                      <button @click="hasEdit( scope )">
                        取消
                      </button>
                      <button @click="chakan( scope )">
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
            v-show="backupType === 'aLiCloud'" 
            class="message-switch"
          >
            <span>优先使用免费短信 </span>
            <i>!</i>
            <el-switch
              class="switch"
              @change="changeMessageSwitch"
              v-model="messageSwitch">
            </el-switch>
          </div>
          <div v-show="backupType === 'aLiCloud' && messagelist2.length >0 " class="backupTip">
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
          <p>【云企业官网】您的验证码为${code}
 该验证码5分钟内有效，请勿泄露于他人！
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
import { formatDateTime } from "@/api/index";
import * as siteBackupApi from "@/api/request/siteBackupApi";
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
      siteId: 0,
      isShowTips: '1',
      messageView: false,
      isEdit: false,
      isAddTemplate: false,
      isAddAutograph: false,
      messageSwitch: true,
      messagelist: [
        {
          messageinfo1: '注册网站验证码',
          messageinfo2: '云梦网络',
          messageinfo3: '(您的验证码为${code}，该验证码5分钟内有效，请勿泄露于他人！)'
        },
        {
          messageinfo1: '找回密码验证码',
          messageinfo2: '为设置',
          messageinfo3: '未设置'
        }
      ],
      messagelist2: [
        {
          messageinfo1: '注册网站验证码',
          messageinfo2: '云梦网络222',
          messageinfo3: '(您的验证码为${code}，该验证码5分钟内有效，请勿泄露于他人！)'
        },
        {
          messageinfo1: '找回密码验证码',
          messageinfo2: '为设置',
          messageinfo3: '未设置'
        }
      ],
      codeList: [
        {label: '签名01',id: 1},
        {label: '签名02',id: 2},
        {label: '签名03',id: 3}
      ],
      backupType: "free",
      tipSuccess: false
    };
  },
  created(){
    this.isShowTips = getLocal('isShowTips') || '1'
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
      //this.getBackupSite(siteId);
    },
    /**
     * 切换手动备份和自动备份
     */
    handleClick() {
      console.log('this.backupType',this.backupType)
      
    },
    //编辑签名和模版
    hasEdit(){
      this.isEdit = !this.isEdit
    },
    /**
     * 查看短信信息
     */
    async chakan(siteId) {
      this.messageView = true
    },
    //  修改签名或者模版
    choseCode(row){
      console.log('row',row)
    },
    // 是否开启免费短信
    changeMessageSwitch(val){
      console.log('Switchval',val)
    },
    //关闭添加模版
    closeAddTemplate(){
      this.isAddTemplate = false
    },
    //保存添加模版
    saveAddTemplate(val){
      this.isAddTemplate = false
      console.log(val)
    },
    //关闭添加签名
    closeAddAutograph(){
      this.isAddAutograph = false
    },
    //保存添加签名
    saveAddAutograph(val){
      this.isAddAutograph = false
      console.log(val)
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
.content-table /deep/ .el-tooltip .el-popover__reference {
  width: 100%;
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
  span {
    line-height: 40px;
  }
  i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 16px 0 6px;
    font-size: 12px;
    text-align: center;
    line-height: 16px;
    font-weight: 900;
    border-radius: 50%;
    background: #e5e5e5;
    color: #8C8C8C;
  }
  .switch {
    margin-top: -2px;
  }
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
    height: 620px;
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
        background: $--color-primary;
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
  font-size:$--font-size-small;
  color:$--color-primary;
  line-height:16px;
  cursor: pointer;
}

</style>
