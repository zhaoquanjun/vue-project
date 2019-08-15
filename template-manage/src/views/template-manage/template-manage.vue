<template>
  <el-container class="templateManage">
    <el-header class="templateTitle" style="height:86px">
      <span class="titleText">整站模版</span>
      <button class="createBtn" @click="dialogShow">开通整站模版</button>
    </el-header>
    <el-main class="contentWrap">
      <div class="contentHeader">
        <div>
          <el-select v-model="searchValue" placeholder="请选择" class="selectSearchValue borderColor">
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="search" placeholder="请输入搜索内容" class="searchInput borderColor"></el-input>
          <el-select
            v-model="firstIndustrySelect"
            placeholder="一级行业"
            class="firstIndustrySelect borderColor"
          >
            <el-option
              v-for="item in firstIndustryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="line"></span>
          <el-select
            v-model="secondIndustrySelect"
            placeholder="二级行业"
            class="secondIndustrySelect borderColor"
          >
            <el-option
              v-for="item in secondIndustryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="languageSelect" placeholder="语言" class="languageSelect borderColor">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="themeSelect" placeholder="主题" class="themeSelect borderColor">
            <el-option
              v-for="item in themeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="templateStatus" placeholder="模版状态" class="templateStatus borderColor">
            <el-option
              v-for="item in templateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-checkbox v-model="isRecommend" class="isRecommend">仅推荐</el-checkbox>
          <button class="inquire">查询</button>
        </div>
        <div style="margin-top:24px;margin-bottom:24px;">
          <span>排序</span>
          <el-select v-model="sort" placeholder="请选择" class="sort borderColor">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>
            <i class="iconfont iconshang" style="color:#09CCEB;margin-left:32px"></i>
          </span>
          <span>
            <i class="iconfont iconxia" style="color:#262626;margin-left:8px"></i>
          </span>
        </div>
      </div>
      <el-main>
        <div class="table-list" id="table-list">
          <el-table
            ref="multipleTable"
            :data="templateInfo"
            tooltip-effect="dark"
            :row-style="{height:'200px'}"
          >
            <el-table-column prop="siteName" label="缩略图" style="padding-left:20px;"></el-table-column>
            <el-table-column label="模板名称|语言|二级域名" width="245px">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.templateName}}</p>
                  <p class="templateName" style="margin:8px 0;">{{scope.row.language}}</p>
                  <p class="templateDomain">{{scope.row.templateDomain}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模版行业">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.firstIndustry}}</p>
                  <p class="templateName" style="margin:8px 0;">{{scope.row.secondIndustry}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="开通时间|更新时间">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.time.a}}</p>
                  <p class="templateName" style="margin-top:5px;">{{scope.row.time.b}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="使用量" width="100"></el-table-column>
            <el-table-column label="设计师">
              <template slot-scope="scope">
                <div>
                  <p class="templateName">{{scope.row.designer.a}}</p>
                  <p class="templateName" style="margin-top:5px;">{{scope.row.designer.b}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="模板状态"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="handle-btn-wrap">
                  <button class="handle-btn" @click="settingTemplate( scope )">设置</button>
                  <button
                    class="handle-btn"
                    style="margin-left:32px"
                    @click="updateTemplate( scope )"
                  >更新</button>
                  <button
                    class="handle-btn"
                    style="margin-left:32px"
                    @click="deleteTemplate( scope )"
                  >删除</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <el-dialog
        width="0"
        :visible.sync="createTemplateShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span>
              <span>开通整站模版</span>
            </span>
            <span class="close-pannel" @click="closeDialog">
              <i class="iconfont iconX" style="font-size:14px;color:#ccc"></i>
            </span>
          </div>
          <div class="tips">为保证设计师可正常登录系统，请填写真实的</div>
          <div class="phoneWrap">
            <div class="phoneTitle">设计师手机号</div>
            <el-input v-model="phone" placeholder="请输入手机号" class="phoneInput" @blur="blurPhone"></el-input>
            <div class="ym-form-item__error" v-show="errorTip">{{errorPhone}}</div>
          </div>
          <div class="remarkWrap">
            <span class="remarkTitle">备注</span>
            <el-input v-model="remark" placeholder="请输入备注信息" class="remarkInput"></el-input>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="createTemplate">开通</button>
            <button class="cancelBtn" @click="cancel">取消</button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        width="0"
        :visible.sync="settingTemplateShow"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="right-pannel" :style="{width:'470px'}">
          <div class="pannel-head">
            <span>
              <span>整站模版设置</span>
            </span>
            <span class="close-pannel" @click="closeDialog">
              <i class="iconfont iconX" style="font-size:14px;color:#ccc"></i>
            </span>
          </div>
          <div class="settingTemplateWrap">
            <div class="templateName">模版名称</div>
            <el-input
              v-model="phone"
              placeholder="请输入模版名称"
              class="templateNameInput"
              @blur="blurPhone"
            ></el-input>
            <div class="ym-form-item__error" v-show="errorTip">{{errorPhone}}</div>
          </div>
          <div class="settingStatusWrap">
            <div class="settingStatus">模版状态</div>
            <div>
              <el-select v-model="templateStatus" placeholder="模版状态" class="settingStatusSelect">
                <el-option
                  v-for="item in templateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span>
                <span style="margin-left:24px;color:rgba(140,140,140,1);">设为推荐</span>
                <el-checkbox v-model="settingChecked" style="margin-left:16px"></el-checkbox>
              </span>
            </div>
          </div>
          <div class="imgWrap">
            <div class="imgTitle">缩略图</div>
          </div>
          <div class="confirm">
            <button class="confirmBtn" @click="createTemplate">确定</button>
            <button class="cancelBtn" @click="cancel">取消</button>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/templateApi";

export default {
  data() {
    return {
      createTemplateShow: false,
      phone: "",
      remark: "",
      errorTip: false,
      errorPhone: "",
      searchValue: "templateName",
      searchOptions: [
        {
          value: "templateName",
          label: "模版名称"
        },
        {
          value: "secondDomaon",
          label: "二级域名"
        },
        {
          value: "designer",
          label: "设计师"
        }
      ],
      search: "",
      firstIndustryOptions: [],
      firstIndustrySelect: "",
      secondIndustryOptions: [],
      secondIndustrySelect: "",
      languageOptions: [],
      languageSelect: "",
      themeOptions: [],
      themeSelect: "",
      templateOptions: [],
      templateStatus: "",
      isRecommend: false,
      sortOptions: [],
      sort: "",
      ascSort: false,
      descSort: true,
      templateInfo: [
        {
          templateName: "电商",
          templateDomain: "http://c1168099161.scd.wezhan.cn",
          language: "中文",
          firstIndustry: "传媒/广告/营销策划",
          secondIndustry: "广告设计",
          time: { a: "2019-08-12 14:15:25", b: "2019-08-12 14:15:25" },
          num: 123,
          designer: { a: "13000000000" },
          status: "未上架"
        },
        {
          templateName: "电商",
          templateDomain: "http://c1168099161.scd.wezhan.cn",
          language: "中文",
          firstIndustry: "传媒/广告/营销策划",
          secondIndustry: "广告设计",
          time: { a: "2019-08-12 14:15:25", b: "2019-08-12 14:15:25" },
          num: 123,
          designer: { a: "13000000000" },
          status: "未上架"
        }
      ],
      settingTemplateShow: false,
      settingChecked: false
    };
  },
  components: {},
  mounted() {
    // this.getTemplateList();
    // this.getFirstIndustry()
  },
  methods: {
    //   获取模版列表
    async getTemplateList() {
      let para = {
        TemplateName: "",
        Domain: "",
        DesignerPhone: "",
        FirstIndustry: 0,
        SecondIndustry: 0,
        Language: "",
        SiteTheme: "",
        IsRecommend: false,
        OpenStatus: 0,
        PageIndex: 0,
        PageSize: 10
      };
      let { data, status } = await templateApi.getSiteTemplates(para);
      this.templateInfo = data;
    },
    //
    async getFirstIndustry() {
      let { data, status } = await templateApi.getFirstIndustries();
      this.firstIndustryOptions = data;
    },
    createTemplate() {
      if (this.phone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入设计师手机号";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
      }
    },
    blurPhone() {
      if (this.phone == "") {
        this.errorTip = true;
        this.errorPhone = "请输入设计师手机号";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.errorTip = true;
        this.errorPhone = "您输入的手机号格式有误，请重新输入";
      } else {
        this.errorTip = false;
        this.errorPhone = "";
      }
    },
    dialogShow() {
      this.createTemplateShow = true;
    },
    cancel() {
      this.createTemplateShow = false;
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.createTemplateShow = false;
    },
    // 设置模版
    settingTemplate(scope) {
      this.settingTemplateShow = true;
    },
    // 更新模版
    updateTemplate(scope) {},
    // 删除模版
    deleteTemplate(scope) {}
  }
};
</script>
<style scoped>
.phoneInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.remarkInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.templateNameInput /deep/ input {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.borderColor /deep/ input {
  border: 1px solid rgba(185, 203, 207, 1);
}
/* .searchInput /deep/ input {
  border-left-color: transparent;
} */
.isRecommend /deep/ .el-checkbox__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(38, 38, 38, 1);
  line-height: 20px;
}
#table-list /deep/ .el-table thead th:nth-child(1) .cell {
  padding-left: 24px;
}
</style>

<style lang="scss" scoped>
.templateTitle {
  height: 86px;
  width: 100%;
  .titleText {
    font-size: 14px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    line-height: 86px;
    margin-left: 32px;
  }
  .createBtn {
    width: 120px;
    height: 40px;
    background: rgba(9, 204, 235, 1);
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    float: right;
    margin-top: 24px;
    margin-right: 32px;
  }
}
.contentWrap {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin: 0 32px;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  .contentHeader {
    padding: 0 22px;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectSearchValue {
    margin-top: 24px;
    width: 130px;
    height: 40px;
  }
  .searchInput {
    margin-left: -2px;
    margin-top: 24px;
    width: 180px;
    height: 40px;
  }
  .firstIndustrySelect {
    margin-top: 24px;
    width: 180px;
    height: 40px;
    margin-left: 110px;
  }
  .line {
    margin: 0 9px;
    vertical-align: middle;
    display: inline-block;
    width: 14px;
    height: 2px;
    background: rgba(140, 140, 140, 1);
  }
  .secondIndustrySelect {
    margin-right: 81px;
  }
  .languageSelect {
    margin-top: 24px;
    width: 130px;
    height: 40px;
    margin-right: 24px;
  }
  .themeSelect {
    margin-top: 24px;
    width: 130px;
    height: 40px;
    margin-right: 24px;
  }
  .templateStatus {
    width: 130px;
    height: 40px;
    margin-top: 24px;
    margin-right: 32px;
  }
  .isRecommend {
    margin-top: 24px;
    margin-right: 32px;
  }
  .inquire {
    margin-top: 24px;
    width: 90px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid rgba(9, 204, 235, 1);
    font-size: 14px;
    font-weight: 400;
    color: rgba(9, 204, 235, 1);
    line-height: 40px;
  }
  .sort {
    width: 130px;
    height: 40px;
    margin-left: 12px;
  }
  .templateName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
  }
  .templateDomain {
    font-size: 14px;
    font-weight: 400;
    color: rgba(9, 204, 235, 1);
    line-height: 20px;
    cursor: pointer;
  }
  .handle-btn {
    font-size: 14px;
    font-weight: 400;
    color: rgba(9, 204, 235, 1);
    line-height: 20px;
  }
}
// 右侧弹框
.right-pannel {
  background: #ffffff;
  position: fixed;
  z-index: 2200;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0 0 3px #ccc;
  transition: width 0.2s linear;
  background-color: "#fff";
  color: #262626;
  overflow: hidden;
  .pannel-head {
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      font-size: 16px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      padding: 0 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
  .tips {
    width: 422px;
    height: 32px;
    background: rgba(242, 255, 234, 1);
    border: 1px solid rgba(199, 221, 185, 1);
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 182, 57, 1);
    line-height: 32px;
    text-align: center;
    margin: 24px;
  }
  .phoneWrap {
    margin: 24px;
    margin-bottom: 0;
    height: 107px;
    .phoneTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .phoneInput {
      margin-top: 15px;
    }
  }
  .remarkWrap {
    margin: 0 24px;
    .remarkTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .remarkInput {
      margin-top: 15px;
    }
  }
  .settingTemplateWrap {
    margin: 32px 24px;
    .templateName {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .templateNameInput {
      //   width: 200px;
      //   height: 45px;
      margin-top: 15px;
    }
  }
  .settingStatusWrap {
    margin-left: 24px;
    .settingStatus {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .settingStatusSelect {
      margin-top: 16px;
    }
  }
  .imgWrap {
    margin-top: 24px;
    margin-left: 24px;
    .imgTitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
  }

  .confirm {
    position: absolute;
    width: 470px;
    height: 80px;
    bottom: 0px;
    border-top: 1px solid #efefef;
    .confirmBtn {
      margin: 24px;
      width: 90px;
      height: 32px;
      background: rgba(9, 204, 235, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
    .cancelBtn {
      width: 90px;
      height: 32px;
      border: 1px solid rgba(9, 204, 235, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(9, 204, 235, 1);
      line-height: 32px;
    }
  }
}
</style>


