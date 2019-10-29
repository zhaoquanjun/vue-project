<template>
  <div class="spread-setting__section">
    <div class="spread-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
    </div>
    <div v-if="!isShowStatistics" class="answer-tabs">
      <el-tabs v-model="replyType" type="card" @tab-click="getInfo">
        <el-tab-pane label="页面推广" name="page"></el-tab-pane>
        <el-tab-pane label="文章推广" name="news"></el-tab-pane>
        <el-tab-pane label="产品推广" name="product"></el-tab-pane>
      </el-tabs>
      <div class="add" @click="addSpread">新增推广</div>
    </div>
    <div v-if="!isShowStatistics" class="spread-continer">
      <template>
        <el-table
          :data="list"
          :header-cell-style="{color:'#A1A8B1',fontWeight: '400',lineHeight: '36px',paddingLeft: '40px'}"
          :cell-style="{color:'#262626',lineHeight: '36px',paddingLeft: '40px'}"
          style="width: 100%">
          <template slot="empty">
              <div class="empty-table">
                  <img src="~img/table-empty.png" />
                  <p>暂无数据</p>
              </div>
          </template>
          <el-table-column
            prop="pageTitle"
            :label="listTitle"
            width="160">
          </el-table-column>
          <el-table-column
            prop="shareTitle"
            label="分享标题"
            width="160">
          </el-table-column>
          <el-table-column
            prop="shareTitle"
            label="分享封面"
            width="140">
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
            label="阅读数"
            width="110">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="140">
            <template slot-scope="scope">
              <span>{{scope.row.createTime.slice(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="icon iconfont iconbianji" @click="handlelook(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="icon iconfont iconshanchu" @click="remove(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看数据" placement="top">
                <i class="icon iconfont iconshuju" @click="getStatistics(scope.row)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="paging">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next"
          :total="TotalRecord"
          :page-sizes="[5,10,20]"
        ></el-pagination>
      </div>
    </div>
    <statistics 
      v-if="isShowStatistics"
      :AddType="replyType"
      @closeStatistics="closeStatistics"
      :shareInfo= "shareInfo"
    >
    </statistics>
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
import Statistics from "@/components/wechat-account/spread/statistics.vue";
import { unBind, getList, remove, getStatistics } from "@/api/request/account.js";
import PopUp from "@/components/wechat-account/defineMenu/link/popup.vue";
import { notify } from "@/utlis/index.js";
import {getLocal} from '@/libs/local'
export default {
  data() {
    return {
      siteId: this.$store.state.dashboard.siteId,
      replyType: 'page',
      PageSize: 5, //每页数
      PageIndex: 1, //当前页面
      TotalPage: 0, //总页数
      TotalRecord: 0, //总数量
      shareId: '',
      isShow: false,
      listTitle: '页面标题',
      type: '',
      isShowPopup: false,
      isShowCode: false,
      shareInfo: '',
      infoData: {},
      isShowStatistics: false,
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
      list: []
    };
  },
  components: {
    ChangeSite,
    PopUp,
    SharePopup,
    Statistics,
    ShareCode
  },
  created() {
    let wx_status = this.$store.state.wxaccount.wx_status || getLocal("wx_status")
    if (!wx_status.isCertification) {
        this._getWxIsAuth()
    }
    this.getInfo();
  },
  methods: {
    headerClassName() {
      return 'header-row-class-name'
    },
    getSiteId(siteId) {
    
    },
    async getInfo(){
      let EntityTyp = 'Page';
      this.listTitle = '页面标题'
      if (this.replyType == 'news') {
        EntityTyp = 'News';
        this.listTitle = '文章标题'
      } else if (this.replyType == 'product') {
        EntityTyp = 'Product';
        this.listTitle = '产品标题'
      }
      let option= {
        PageSize: this.PageSize,
        PageIndex: this.PageIndex, //
        EntityType: EntityTyp, //Page, News, Product
        SiteId: this.siteId
      }
      let {data} = await getList(option)
      if(data&&data.list) {
        this.list = data.list
        this.TotalPage = data.totalPage
        this.TotalRecord = data.totalRecord
      }
    },
    //关闭弹窗
    closeShare(val,shareId,type) {
      this.isShow = val
      if(shareId) {
        this.shareId = shareId
        this.type = type
        this.isShowCode = true
      } else {
        this.isShowCode = false
        this.getInfo()
      }
    },
    // 关闭二维码
    closeShareCode(){
      this.isShowCode = false
      this.getInfo()
    },
    //查看
    handlelook(val) {
      this.isShow = true
      this.infoData = val
    },
    //删除handledelet
    async remove(val){
      this.$confirm("提示", {
        title: "提示",
        iconClass: "icon-warning",
          message:  `删除后，分享地址将不可访问，是否确定删除？`,
          callback: async action => {
              if (action === "confirm") {
                  let data = await remove(this.siteId,val.id)
                  if(data && data.status == 200 ) {
                    notify(this, '删除成功', "success");
                    this.getInfo();
                  } else {
                    notify(this, '删除失败', "error");
                  }
              }
          }
      });
    },
    //新增推广
    addSpread(){
      this.isShowPopup = true
    },
    handleClosePopup (val,data){
      this.isShowPopup = val
      if (data) {
        this.isShow = true
        let entityId = ''
        this.infoData = {
          entityType: data.Type, //分享类型 文章 产品 页面
          entityId: data.Href, //id
          coverUrl: data.PicUrl, //封面图片
          shareTitle: data.Title, //分享id
          pageTitle: data.Title, //页面，文章，产品标题
          description: "", //描述
          pageInfoId: data.Type == 'Page' ? '': data.Id // 详情页id，页面推广时不选
        }
      }
    },
    //获取阅读分享数据
    async getStatistics(item){
      console.log('999',item)
      this.shareInfo = item
      this.isShowStatistics = true
    },
    closeStatistics(){
      this.isShowStatistics = false
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      this.siteId = this.$store.state.dashboard.siteId
      if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechat/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    },
    //分页 每页条数
    handleSizeChange(val) {
      this.PageSize = val
      this.getInfo()
    },
    //分页 当前页数
    handleCurrentChange(val){
      this.PageIndex = val
      this.getInfo()
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
.el-table /deep/ .cell {
  height: 42px;
  line-height: 42px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-table /deep/ td {
  padding: 10px 0 8px 36px;
}
.el-table .cell, .el-table th div {
  padding-right: 30px !important;
}
</style>
<style lang="scss" scoped>
.spread-setting__section {
    padding: 10px 32px 0;
    min-width: 1100px;
    overflow-y: auto;
    .iconfont {
      padding: 8px;
      border-radius: 2px;
      margin-right: 10px !important;
      cursor: pointer;
      &:hover {
        background: #E5E5E5;
      }
    }
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
      padding-bottom: 16px;
      .img {
        width: 37px;
        height: 32px;
      }
      .iconbianji {
        margin-right: 40px;
      }
    }
    .paging {
      margin-top: 40px;
      text-align: right;
    }
}
</style>