<template>
  <div class="table-list"
       id="table-list">
    <el-table ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              class="content-table"
              @expand-change="expandSelect"
              :row-key="getRowKeys"
              :expand-row-keys="expands">
      <template slot="empty">
        <div class="empty-table">
          <img src="~img/memberManage/table-empty.png" />
          <p>暂无数据</p>
        </div>
      </template>
      <el-table-column prop="domain"
                       label="域名"
                       class="domain-name"
                       min-width="230">
        <template slot-scope="scope">
          <span class="domain-name">{{ scope.row.domain }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cdnDomainResolveStatusDesc"
                       min-width="250">
        <template slot="header">
          <div style="line-height:23px;padding-left:0;">
            <span>解析状态</span>
            <el-tooltip style="display:inline-block;"
                        class="item"
                        effect="dark"
                        content="刷新解析状态"
                        placement="top-start">
              <i class="iconfont iconhuifu"
                 @click="updateExplainStatus"></i>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="props">
          <template v-if="props.row.cdnDomainResolveStatus === 3">
            <div>
              <el-tooltip class="item"
                          effect="dark"
                          content="服务器正在生成解析记录值，请耐心等待"
                          placement="top-start"
                          style="display:inline-block;">
                <span :class="resolveStatus(props.row.cdnDomainResolveStatus)"
                      style="line-height:14px;">{{ props.row.cdnDomainResolveStatusDesc }}</span>
              </el-tooltip>
              <img src="~img/memberManage/loading.png"
                   class="loading-img" />
            </div>
          </template>
          <el-tooltip v-else-if="
              props.row.cdnDomainResolveStatus === 0 && props.row.isInAliDns
            "
                      class="item"
                      effect="dark"
                      content="点击“一键解析”，自动完成解析域名"
                      placement="top-start">
            <span :class="resolveStatus(props.row.cdnDomainResolveStatus)">{{
              props.row.cdnDomainResolveStatusDesc
            }}</span>
          </el-tooltip>
          <el-tooltip v-else-if="
              props.row.cdnDomainResolveStatus === 0 && !props.row.isInAliDns
            "
                      class="item"
                      effect="dark"
                      content="请复制“解析详情”中的解析记录值后，前往域名购买平台完成域名解析"
                      placement="top-start">
            <span :class="resolveStatus(props.row.cdnDomainResolveStatus)">{{
              props.row.cdnDomainResolveStatusDesc
            }}</span>
          </el-tooltip>
          <template v-else-if="props.row.cdnDomainResolveStatus === 1">
            <div>
              <el-tooltip class="item"
                          effect="dark"
                          content="域名解析存在一定延时，请耐心等待"
                          placement="top-start"
                          style="display:inline-block;">
                <span :class="resolveStatus(props.row.cdnDomainResolveStatus)"
                      style="line-height:14px;">{{ props.row.cdnDomainResolveStatusDesc }}</span>
              </el-tooltip>
              <img src="~img/memberManage/loading.png"
                   class="loading-img" />
            </div>
          </template>
          <span v-else
                :class="resolveStatus(props.row.cdnDomainResolveStatus)">
            {{ props.row.cdnDomainResolveStatusDesc }}
            <i class="iconfont iconicon-dash-rightq"
               style="color:#00b539;width:14px;height:14px;margin-left:10px;"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="150"
                       label="操作">
        <template slot-scope="props">
          <button v-if="
              props.row.isInAliDns &&
                props.row.cdnStatus !== 1 &&
                props.row.cdnStatus !== 2 &&
                props.row.cdnStatus !== 3
            "
                  class="handle-btn"
                  @click="resolveCdnByAliYunToken(props.row)"
                  style="color: #ff6a00;font-size:12px">
            一键解析
          </button>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <el-tooltip effect="dark" content="解析详情" placement="top">11</el-tooltip>
        <template slot-scope="props">
          <div class="domain-detail">
            <el-row class="domain-detail-row">
              <el-col :span="5">
                <div style="min-width:400px;">
                  <span class="domain-explain-item">
                    解析类型 &nbsp;
                    <span class="domain-explain-text">{{
                      props.row.cdnDomainResolveType
                        ? props.row.cdnDomainResolveType
                        : "—"
                    }}</span>
                  </span>
                </div>
              </el-col>
              <el-col :span="5">
                <div style="min-width:500px;">
                  <span class="domain-explain-item">
                    解析记录值 &nbsp;
                    <span class="domain-explain-text">{{
                      props.row.cdnDomainResolveValue
                        ? props.row.cdnDomainResolveValue
                        : "—"
                    }}</span>
                    <span class="explain-text-copy"
                          v-if="!hasCopy"
                          :data-clipboard-text="
                        props.row.cdnDomainResolveValue
                          ? props.row.cdnDomainResolveValue
                          : '—'
                      "
                          @click="explainCopy">复制</span>
                    <span v-else
                          class="explain-text-copy-success">复制成功</span>
                  </span>
                </div>
              </el-col>
            </el-row>
            <div class="explain-islink">
              <a class="renewal cl-button cl-button--primary_notbg"
                 :href="aliyunDomainResolve"
                 target="_blank">如何进行手动解析?</a>
            </div>
            <el-row class="status-switch"
                    v-if="props.row.isInAliDns"
                    style="width:49.5%;">
              <!-- cdn状态 -->
              <el-col :span="10">
                <div style="min-width:500px;">
                  <span>CDN状态</span>
                  <el-tooltip class="item"
                              effect="dark"
                              content="为提高您的网站访问速度，添加域名时将自动开启CDN"
                              placement="top-start">
                    <i class="iconfont iconicon-exclamationmark status"
                       style="color:#e5e5e5;margin-left:10px;"></i>
                  </el-tooltip>

                  <span v-if="
                      props.row.cdnStatus === 1 || props.row.cdnStatus === 2
                    "
                        class="status">{{ props.row.cdnStatusDesc }}</span>
                  <div v-else-if="props.row.cdnStatus === 3"
                       style="display:inline-block;">
                    <el-switch :value="props.row.cdnStatusDesc !== '审核未通过'"
                               @change="reopenCdn(props.row)"
                               class="status"></el-switch>
                    <span class="status"
                          style="cursor: pointer;"
                          @click="notPassTip()">{{ props.row.cdnStatusDesc }}</span>
                  </div>

                  <el-switch v-else-if="props.row.cdnStatus === 5"
                             :value="props.row.cdnStatusDesc === '已开启'"
                             @change="pauseCdn(props.row)"
                             class="status"></el-switch>
                  <el-switch v-else-if="
                      props.row.cdnStatus === 0 || props.row.cdnStatus === 4
                    "
                             :value="props.row.cdnStatusDesc !== '未开启'"
                             @change="reopenCdn(props.row)"
                             class="status"></el-switch>
                </div>
              </el-col>

              <!-- https状态 -->
              <el-col :span="10"
                      min-width="200">
                <div v-if="
                    props.row.cdnStatus === 5 &&
                      props.row.cdnDomainResolveStatus === 2
                  ">
                  <span>HTTPS状态</span>
                  <el-tooltip class="item"
                              effect="dark"
                              content="为让您的网站更安全，建议您开启HTTPS"
                              placement="top-start">
                    <i class="iconfont iconicon-exclamationmark status"
                       style="color:#e5e5e5;margin-left:10px;"></i>
                  </el-tooltip>
                  <el-switch
                    v-if="props.row.httpsStatus===0"
                    :value="props.row.httpsStatus!==0"
                    @change="swichChange(props.row.httpsStatus,props.row,props.$index)"
                    class="status"
                  ></el-switch>
                  <span
                    v-else-if="props.row.httpsStatus===1"
                    class="status"
                  >{{props.row.httpsStatusDesc}}</span>
                  <div v-else-if="props.row.httpsStatus===2 || props.row.httpsStatus===3"  style="display:inline-block;">
                    <el-switch
                      :value="props.row.httpsStatus!==2 && props.row.httpsStatus!==3"
                      @change="swichChange(props.row.httpsStatus,props.row,props.$index)"
                    ></el-switch>
                    <span class="status">{{props.row.httpStatusDesc}}</span>
                  </div>
                  <el-switch v-else-if="props.row.httpsStatus === 4"
                             :value="props.row.httpsStatus === 4"
                             @change="
                      swichChange(
                        props.row.httpsStatus,
                        props.row,
                        props.$index
                      )
                    "></el-switch>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
        
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
           
              <button style> <el-tooltip class="item" effect="dark" content="解析详情" placement="top"><i>123</i></el-tooltip></button>
          
            <el-tooltip class="item" effect="dark" content="删除域名" placement="top">
              <button class="handle-btn delete-btn" @click="handleDelete(scope.row,scope.$index)">
                <i class="iconfont iconshanchu cl-iconfont is-square" style="color:#262626"></i>
              </button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示"
               :visible.sync="passTip"
               width="50%">
      <span>
        审核未通过？请排查以下事项并在调整后重新开启
        <br />
        <br />● 内容不合规：
        <br />
        <br />无法正常访问或内容不含有任何实质信息
        <br />
        <br />游戏私服类
        <br />
        <br />传奇类游戏、纸牌类游戏
        <br />
        <br />盗版软件等无版权下载网站
        <br />
        <br />P2P类金融网站
        <br />
        <br />彩票类网站
        <br />
        <br />违规医院和药品类网站
        <br />
        <br />涉黄、涉毒、涉赌等
        <br />
        <br />自动超时拒绝：您的域名因不符合CDN接入规则而拒绝，请您
        <br />
        <br />查看之前的反馈结果，合规后可再行申请提交审核
        <br />
        <br />● 域名已被添加至CDN域名列表。
        <br />
        <br />处理方式：
        <br />
        <br />a、登录您的阿里云账户删除该域名并在该页面“重新提交”。
        <br />
        <br />b、如果您未添加过该域名，请在阿里云提交工单并等待处理。
        如何提交工单?
        <br />
        <br />● 中文域名暂不支持开启CDN。
        <br />
        <br />
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import { aliyunDomainResolve } from "@/environment/help-link.js";
export default {
  props: ["tableData"],
  data () {
    return {
      aliyunDomainResolve: aliyunDomainResolve,
      domainStepName: [
        "生成解析记录值",
        "配置解析",
        "等待解析生效",
        "解析成功"
      ],
      active: 0,
      expands: [],
      getRowKeys (row) {
        return row.id;
      },
      passTip: false,
      hasCopy: false
    };
  },
  mounted () {
    this.getListNotResolve();
    this.resetExpandText();
    this.resetExplainStatus();
  },
  methods: {
    //一键解析域名
    resolveCdnByAliYunToken (row) {
      let params = {
        id: row.id,
        isForceUpdate: false,
        curDomain: row.domain
      };
      let message = [];
      message.push(
        this.$createElement("p", { style: "color: #262626" }, params.curDomain)
      );
      message.push(
        this.$createElement(
          "p",
          { style: "color: #8C8C8C" },
          "当前域名为阿里云DNS，可授权完成一键解析"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        iconClass: "icon-warning",
        confirmButtonText: "授权并一键解析",
        message: this.$createElement("div", null, message),
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "授权成功"
          });
          this.$emit("resolveCdnByAliYunToken", params);
          this.$emit("getCdnDomainList");
        })
        .catch(() => { });
    },
    // 解析记录值复制
    explainCopy () {
      var clipboard = new Clipboard(".explain-text-copy");
      clipboard.on("success", e => {
        this.hasCopy = true;
        setTimeout(() => {
          this.hasCopy = false;
        }, 1500);
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        clipboard.destroy();
      });
    },
    //开启cdn
    reopenCdn (row) {
      let openTip = [
        "确定开启CDN吗?",
        "开启CDN后，原有的域名解析将失效，",
        "请在开启CDN后进行域名解析，以确保网站能够正常访问。"
      ];
      let open = () => {
        this.$emit("reopenCdn", row.id);
      };
      this.elemnetConfirm("warning", openTip, open);
    },
    //关闭cdn
    pauseCdn (row) {
      let closeTip = [
        " 确定停用CDN吗?",
        "停用CDN后，原有的域名解析将失效，",
        "请在停用CDN后进行域名解析，以确保网站能够正常访问。"
      ];
      let close = () => {
        this.$emit("pauseCdn", row.id);
      };
      this.elemnetConfirm("warning", closeTip, close);
    },
    // 是否开启HTTPS
    swichChange (status, row, index) {
      let openTip = ["将为您申请免费证书，请发布您的网站并确保可正常访问！"];
      let closeTip = ["确定要停用HTTPS吗？"];
      let domainId = row.id;
      // let open = () => {
      //     this.$emit("oneKeyEnableHttps", domainId);
      // };
      // let close = () => {
      //     this.$emit("disableHttps", domainId);
      // };
      if (status !== 4) {
        this.$confirm(
          "将为您申请免费证书，请发布您的网站并确保可正常访问！",
          "开启HTTPS",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "发布网站并申请",
            cancelButtonText: "已发布，直接申请",
            iconClass: "icon-success"
          }
        )
          .then(() => {
            this.$emit("publishdata", domainId);
          })
          .catch(action => {
            if (action === "cancel") {
              this.$emit("oneKeyEnableHttps", domainId);
            }
          });
      } else {
        this.$confirm("确定要停用HTTPS吗？", "提示", {
          iconClass: "icon-success",
          callback: action => {
            if (action === "confirm") {
              this.$emit("disableHttps", domainId);
            } else {
            }
          }
        });
      }
    },
    // 删除域名列表
    handleDelete (row, index) {
      let domainId = row.id;
      this.$emit("_deleteCdnDomain", domainId, index);
    },
    stepClass (row, index) {
      if (row.cdnDomainResolveStatus === 0 && !row.cdnDomainResolveValue) {
        this.active = 0;
        return;
      } else if (row.cdnDomainResolveStatus === 0) {
        this.active = 1;
        return;
      } else if (row.cdnDomainResolveStatus === 1) {
        this.active = 2;
        return;
      } else if (row.cdnDomainResolveStatus === 2) {
        this.active = 3;
        return;
      }
    },
    resolveStatus (status, cdnStatus) {
      switch (status) {
        case 0:
          return "domainStatus0";
        case 1:
          return "domainStatus1";
        case 2:
          return "domainStatus2";
        case 3:
          return "domainStatus3";
        default:
          return "domainStatus0";
      }
    },
    elemnetConfirm (type, content, callback, index, status, title) {
      let message = [];
      content.forEach((item, index) => {
        if (index == 0) {
          message.push(
            this.$createElement("p", { style: "color: #262626" }, item)
          );
        } else {
          message.push(
            this.$createElement("p", { style: "color: #8C8C8C" }, item)
          );
        }
      });
      this.$confirm("提示", {
        title: title || "提示",
        message: this.$createElement("div", null, message),
        type: type,
        iconClass: `icon-${type}`,
        // customClass:"large", // 弹窗大小  large / medium / small
        callback: async action => {
          if (action === "confirm") {
            callback(this);
          } else {
          }
        }
      });
    },

    // 折叠面板每次只能展开一行
    expandSelect (row, expandedRows) {
      var that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.id);
        }
      } else {
        that.expands = [];
      }
    },
    notPassTip () {
      this.passTip = true;
    },
    getListNotResolve () {
      this.notResolveList = [];
      this.tableData.forEach((item, index) => {
        this.notResolveList.push(item.cdnDomainResolveStatus);
      });
    },
    resetExpandText (index) {
      this.$nextTick(() => {
        let eles = document.getElementsByClassName("el-table__expand-icon");
        for (let i = 0; i < eles.length; i++) {
          let ele = eles[i];
          if (this.notResolveList[i] == 3) {
            eles[i].innerHTML ='<button disabled="disabled" style="color:#262626;height: 24px;cursor:default;padding:10px;">-</button>';
          } else {
            ele.innerHTML = `<i class=" iconfont iconicon-des-setup cl-iconfont is-square" style="color:#262626;" id="iconfont-setup"></i>`;
            // ele.style.position="relative";
            //   let tooltipBox = document.createElement('div');
            //   tooltipBox.style.display="none";
            //   tooltipBox.innerHTML="<i>解析详情</i>"
            //   let tooltipArrow = document.createElement('div');
            //   tooltipBox.className="tooltip-box";
            //   tooltipArrow.className="tooltip-arrow";
            //   tooltipBox.appendChild(tooltipArrow);
            //   ele.appendChild(tooltipBox);
            // ele.onmouseover=function(){
            //   tooltipBox.style.display="block";
            // }
            // ele.onmouseleave=function(){
            //   tooltipBox.style.display="none";
            // }
          }
        }
      });
    },
    // 刷新解析状态
    updateExplainStatus () {
      this.$emit("getCdnDomainList");
    },
    // 定时刷新解析状态
    resetExplainStatus () {
      let flag = false;
      this.tableData.forEach(elem => {
        if (elem.cdnDomainResolveStatus !== 2) {
          flag = true;
        }
      });
      if (flag) {
        let timer = setInterval(() => {
          this.$emit("getCdnDomainList");
          clearInterval(timer);
        }, 180000);
      }
    }
  },
  watch: {
    tableData () {
      this.getListNotResolve();
      this.resetExpandText();
      this.resetExplainStatus();
    }
  }
};
</script>
<style>
.hoverBtn {
  padding: 8px;
  background: transparent;
}
.hoverBtn:hover {
  background: rgba(9, 204, 235, 0.09);
}
</style>
<style scoped>
.el-table /deep/ thead :first-child > .cell {
  padding-left: 62px;
}

.el-table /deep/ .el-table__expand-icon {
  height: auto;
  transform: rotate(0deg);
}
.el-table /deep/ .el-table__expanded-cell:hover {
  background: #eee !important;
}
.el-table /deep/ thead th {
  padding: 9px 0;
}
.el-table /deep/ td {
  padding: 10px 0;
}
.el-table /deep/ .el-table__row > :last-child .cell {
  overflow: visible;
}
.domain-detail /deep/ .el-switch__core {
  height: 18px;
  width: 30px !important;
}
.domain-detail /deep/ .el-switch__core:after {
  width: 13px;
  height: 13px;
  line-height: 18px;
}
</style>
<style lang="scss" scoped>
.el-table /deep/ .tooltip {
  display: none;
  top: -20px;
}
.el-table /deep/ .iconicon-des-setup {
  position: relative;
}
.el-table /deep/ .iconicon-des-setup:hover .tooltip {
  display: block;
}
.handle-btn-wrap {
  width: 70%;
  display: block;
  justify-content: flex-start;
  position: relative;
  & > :first-child {
    position: absolute;
    z-index: 1;
    background: transparent;
    color: transparent;
    top: 3px;
    right: 77px;
    height: 4px;
    overflow: hidden;
    padding: 2px;
    // pointer-events: none
  }
}
.domainStatus0 {
  color: #fb4d68;
}

.domainStatus1 {
  color: #f5a623;
}

.domainStatus2 {
  color: #00b539;
}

.domainStatus3 {
  color: #8c8c8c;
}

.domain-name {
  padding-left: 50px;
}
@keyframes myloading-img {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading-img {
  width: 14px;
  height: 14px;
  margin-left: 10px;
  animation: myloading-img 1s linear infinite;
}
.domain-detail {
  background: $--background-color-selected;
  display: block;
  margin: -10px 3px -7px;
  position: relative;
  overflow: hidden;
  &:hover {
    background: $--background-color-selected !important;
  }
  .domain-detail-row {
    background: $--color-white;
    height: 40px;
    line-height: 40px;
    width: 99%;
    display: inline-block;
    margin: 16px 7px 12px;
    .domain-explain-item {
      padding-left: 50px;
      .domain-explain-text {
        color: $--color-text-regular;
      }
      .explain-text-copy {
        color: $--color-text-orange;
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
      }
      .explain-text-copy-success {
        margin: 0 10px;
        color: $--color-success;
      }
    }
  }
  .explain-islink {
    float: right;
    margin-right: 10px;
    margin-bottom: 10px;
    line-height: 20px;
    a.explain-islink-manual {
      color: $--color-text-orange;
      &:hover {
        text-decoration: none;
        color: $--color-text-orange;
      }
    }
  }
  .status-switch {
    float: left;
    margin-bottom: 5px;
    margin-left: 55px;
    line-height: 20px;
    line-height: 40px;
    .status {
      padding: 0 10px;
      line-height: 20px;
    }
  }
}
.iconicon-exclamationmark:hover {
  background: transparent !important;
}
.iconfont.iconhuifu {
  font-size: 12px;
  margin-left: 10px;
  font-weight: 400;
  &:hover {
    color: $--color-text-orange;
  }
}
.tooltip-box{
  transform-origin: center bottom;
  z-index: 2005;
  display: none;
  background: #303133;
  color: #FFF;
  position: absolute;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  line-height: 1.2;
  min-width: 10px;
  word-wrap: break-word;
  .tooltip-arrow{
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    left: 8px;
  }
}
</style>
