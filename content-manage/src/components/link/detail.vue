<template>
  <div class="detail-select__area">
    <span>选择详情页</span>
    <el-select
      v-model="selectValue"
      placeholder="请选择详情页"
      :style="{ maxWidth: '200px' }"
      size="small"
      @change="selectDetailPage"
    >
      <el-option
        v-for="item in detailList"
        :key="item.id"
        :label="item.title"
        :value="item.id"
      >
        <span style="float: left">{{ item.title }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import * as linkApi from '@/api/request/linkApi'
export default {
  props: {
    model: {
      type: Object
    },
    pageType: {
      type: String
    },
    pageSize: {
      type: Number
    },
    pageIndex: {
      type: Number
    },
    siteId: {
        type: Number
    }
  },
  data() {
    return {
      detailList: [],
      selectValue: ''
    }
  },
  methods: {
    getPageDetailData() {
      this._getDetailPageList()
    },
    async _getDetailPageList() {
      const options = {
        siteId: this.siteId,
        IsDescending: true,
        OrderColumns: 'createtime',
        pageType: this.pageType,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        title: ''
      }
      const { data } = await linkApi.getPageDetail(options)
      this.detailList = data.list
      let homePageId = ''
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].isSystemPage) {
          homePageId = data.list[i].id
          this.$emit("selectDetailPage", data.list[i].id);
          break
        }
        if (this.model['DetailPageId'] === data.list[i].id) {
          this.selectValue = this.model['DetailPageId']
        }
      }
      if (this.selectValue === '' && homePageId !== '') {
        this.selectValue = homePageId
      }
    },
    selectDetailPage(val) {
        this.$emit("selectDetailPage", val);
    },
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg) // search,查询？后面的参数，并匹配正则
      if (r != null) {
        return unescape(r[2])
      } else {
        return null
      }
    },
    onDataChange(action, oldData, data) {
      if (window.smSite) {
        window.smSite.onDataChange(action, oldData, data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-select__area {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    margin-right: 16px;
    display: inline-block;
    min-width: 100px;
    text-align: right;
    font-size: 14px;
    line-height: 20px;
  }
}
.detail-select__area /deep/ .el-input__inner {
  height: 32px !important;
}
</style>
