<template>
  <div class="spread-setting__section">
    <div class="spread-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
    </div>
    <div class="answer-tabs">
      <el-tabs v-model="replyType" type="card" @tab-click="handleClick">
        <el-tab-pane label="页面推广" name="page"></el-tab-pane>
        <el-tab-pane label="文章推广" name="news"></el-tab-pane>
        <el-tab-pane label="产品推广" name="product"></el-tab-pane>
      </el-tabs>
      <div class="add" @click="addSpread">新增推广</div>
    </div>
    <div class="spread-continer">
      <template>
        <el-table
          :data="list"
          :header-cell-style="{color:'#A1A8B1',fontWeight: '400',lineHeight: '36px',paddingLeft: '40px'}"
          :cell-style="{color:'#262626',lineHeight: '36px',paddingLeft: '40px'}"
          style="width: 100%">
          <el-table-column
            prop="pageTitle"
            label="页面标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="shareTitle"
            label="分享标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="shareTitle"
            label="分享封面"
            width="180">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.coverUrl">
            </template>
          </el-table-column> 
          <el-table-column
            prop="description"
            label="分享描述">
          </el-table-column>
          <el-table-column
            prop="shareCount"
            label="阅读数">
          </el-table-column>
          <el-table-column
            prop="阅读数"
            label="地址">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <i class="icon iconfont iconqiehuanxingshier" @click="handlelook(scope.row)"></i>
              <i class="icon iconfont iconbianji"></i>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <sharePopup 
      v-if="isShow"
      :infoData='infoData'
      @closeShare='closeShare'
    >
    </sharePopup>
    <shareCode
      v-show="isShowCode"
      :shareId = "shareId"
      :type = 'type'
      @closeShareCode='closeShareCode'
    >
    </shareCode>
    <PopUp
      :model="model"
      :AddType="replyType"
      @handleClosePopup="handleClosePopup"
      v-show="isShowPopup"
    />
  </div>
</template>

<script>
import ChangeSite from "@/components/common/changeSite";
import SharePopup from "@/components/wechat-account/spread/share-popup.vue";
import ShareCode from "@/components/wechat-account/spread/share-code.vue";
import { unBind, getList } from "@/api/request/account.js";
import PopUp from "@/components/wechat-account/defineMenu/link/popup.vue";
import { notify } from "@/utlis/index.js";
export default {
  data() {
    return {
      siteId: this.$store.state.dashboard.siteId,
      replyType: 'page',
      PageSize: 10,
      PageIndex: 1,
      shareId: -1,
      isShow: false,
      type: '',
      isShowPopup: false,
      isShowCode: false,
      infoData: {},
      model: {
          PageIndex: null,
          Type: null,
          Id: null,
          Href: null
        },
      curEditorItem: {
        title: "",
        description: "",
        picUrl:"http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4",
        urlType: "",
        urlData: "",
        contentPageId: ''
      },
      list: [
        {
          shareUrl: "string",
          id: 0,
          siteId: 0,
          entityType: "Page",
          entityId: "string",
          createTime: "2019-09-29T03:20:19.583Z",
          coverUrl: "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/nELZAKssX063m0lC_qj_rw.png",
          shareTitle: "string",
          pageTitle: "string",
          description: "string",
          authorizerAppId: "string",
          shareCount: 0
        }
      ]
    };
  },
  components: {
    ChangeSite,
    PopUp,
    SharePopup,
    ShareCode
  },
  created() {
    //this._getWxIsAuth();
    this.getInfo();
  },
  methods: {
    handleClick() {
      console.log('www')
    },
    headerClassName() {
      return 'header-row-class-name'
    },
    getSiteId(siteId) {
      console.log('000')
    },
    async getInfo(){
      let option= {
        PageSize: 10,
        PageIndex: 1, //
        EntityType: 'Page', //Page, News, Product
        //Keyword: '',
        SiteId: this.siteId
      }
      let {data} = await getList(option)
      console.log('list',data)
    },
    //关闭弹窗
    closeShare(val,shareId,type) {
      this.isShow = val
      if(shareId) {
        this.shareId = shareId
        this.type = type
        this.isShowCode = true
      }
    },
    // 关闭二维码
    closeShareCode(){
      this.isShowCode = false
    },
    //查看
    handlelook(val) {
      this.isShow = true
      console.log(val)
    },
    //新增推广
    addSpread(){
      this.isShowPopup = true
    },
    handleClosePopup (val,data){
      this.isShowPopup = val
      if (data) {
        console.log(data,'0000004')
        this.infoData = data
        this.isShow = true
        let entityId = ''
        this.infoData = {
          entityType: data.Type, //分享类型 文章 产品 页面
          entityId: data.Type == 'Page' ? data.Id : data.Href.split("/")[2], //id
          coverUrl: data.PicUrl, //封面图片
          shareTitle: data.Title, //分享id
          pageTitle: data.Title, //页面，文章，产品标题
          description: "", //描述
          pageInfoId: data.Type == 'Page' ? '': data.Id // 详情页id，页面推广时不选
        }
      }
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechataccount/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    }
  }
};
</script>
<style scoped>
.el-tabs /deep/ .el-tabs__item {
    background: rgba(245, 245, 245, 1);
    font-size: 14px;
    padding: 0 32px;
    font-weight: 400;
    color: #262626;
    height: 60px;
    line-height: 57px;
    border-top: 3px solid transparent;
    box-sizing: border-box;
}
.el-tabs /deep/ .el-tabs__header {
    margin: 0;
} 
.el-tabs /deep/ .is-active {
    background: #fff;
    border-top: 3px solid #09cceb;
}
.el-table .cell, .el-table th div {
  padding-right: 30px !important;
}
</style>
<style lang="scss" scoped>
.spread-setting__section {
    padding: 32px;
    .answer-tabs {
        padding-top: 32px;
        position: relative;
        .add {
          position: absolute;
          top: 42px;
          right: 0px;
          width:90px;
          height:40px;
          background:rgba(9,204,235,1);
          border-radius:2px;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:40px;
          text-align: center;
          cursor: pointer;
        }
    }
    .reply-wrap {
        padding: 32px 0;
        position: relative;
        //  overflow-y: auto;
    }
    .spread-continer {
      margin-top: 28px;
      border: 1px solid rgba(229,229,229,1);
      border-bottom: none;
      .img {
        width: 37px;
        height: 32px;
      }
      .iconqiehuanxingshier {
        margin-right: 40px;
      }
    }
}
</style>