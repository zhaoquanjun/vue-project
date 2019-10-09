<template>
  <el-header class="content-header" id="uploadHeader">
    <template v-if="!isBatchHeaderShow">
      <div class="seachInput head-item">
        <el-input
          size="small"
          v-model="picSearchOptions.keyword"
          placeholder="输入图片名称搜索"
          class="input-with-select"
        >
          <el-button slot="append" @click="getPicList">
            <!-- <svg-icon icon-class="search-icon"></svg-icon> -->
            <span class="search-icon"></span>
          </el-button>
        </el-input>
      </div>
      <div class="head-item head-middle">
        <span>排序</span>
        <span class="select-sort">
          <el-select size="small" v-model="orderByLabel" placeholder="请选择" @change="changeSelected">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span @click="switchIsDesc" style="display: flex; align-items: center;">
          <span class="sort-up sort-icon" v-if="picSearchOptions.isDescending"></span>
          <span class="sort-down sort-icon" v-else></span>
        </span>

        <span class="list-mode mode-item" style="margin-left: 10px;" @click="showType('list')">
          <!-- <svg-icon icon-class="list-mode "></svg-icon> -->
          <i class="list-icon mode-icon" :class="{'list-iconOn':!modeSelecte}"></i>
        </span>
        <span class="grid-mode mode-item" @click="showType('grid')">
          <!-- <svg-icon icon-class="grid-mode"></svg-icon> -->
          <i class="list-icon mode-icon" :class="{'mode-iconOn':modeSelecte}"></i>
        </span>
      </div>
      <div class="head-item head-right">
        <el-button class="upload-wrap" size="small" @click="switchUploadBoxShowStatus">
          <!-- <svg-icon icon-class="upload-img"></svg-icon> -->
          上传图片
        </el-button>
      </div>
    </template>
    <template v-else>
      <div style="padding:0 21px">
        <span>
          已选
          <i>{{countPic}}</i> 张图片
        </span>
        <el-button style="margin:0 16px" size="small" @click="batchMove">
          <!-- <svg-icon icon-class="tab-moved"></svg-icon> -->
          移动
        </el-button>
        <el-button size="small" @click="batchDelete">
          <!-- <svg-icon icon-class="l-recyclebin"></svg-icon> -->
          删除
        </el-button>
      </div>
    </template>
  </el-header>
</template>
<script>
export default {
  props: ["picSearchOptions", "isBatchHeaderShow", "countPic"],
  data() {
    return {
      modeSelecte: true,
      options: [
        {
          value: "1",
          label: "创建时间"
        },
        {
          value: "2",
          label: "文件大小"
        },
        {
          value: "3",
          label: "文件名"
        }
      ],
      orderByLabel: ""
    };
  },
  methods: {
    changeSelected(value) {
      this.picSearchOptions.orderByType = value;
      this.getPicList();
    },
    getPicList() {
      this.$emit("getPicList");
    },
    switchUploadBoxShowStatus() {
      //this.$emit("switchUploadBoxShowStatus");
      window.open("http://content.console.wezhan.cn/content/picture");
    },
    switchIsDesc() {
      this.picSearchOptions.isDescending = !this.picSearchOptions.isDescending;
      this.getPicList();
    },
    batchMove() {
      this.$emit("batchMove");
    },
    batchDelete() {
      this.$emit("batchDelete");
    },
    showType(value) {
      if (value === "list") {
        this.modeSelecte = false;
      }
      if (value === "grid") {
        this.modeSelecte = true;
      }
      this.$emit("showType", value);
    }
  }
};
</script>
<style lang="scss" scoped>
#uploadHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8eaf3;
  height: 70px !important;
  background: #fff;
  .seachInput {
    display: inline-block;
    width: 230px;
    /* height: 36px; */
    box-sizing: border-box;
    margin-left: 24px;
  }

  .head-middle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    .select-sort {
      margin-left: 12px;
    }
    .mode-item {
      margin: 0 10px;
      display: inline-block;
      width: 24px;
      height: 24px;
      text-align: center;
      box-sizing: border-box;
      .mode-icon {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .head-right {
    height: 40px;
    margin-right: 25px;
    button {
      display: flex;
      align-items: center;
      height: 40px;
      color: #fff;
      text-align: center;
      background: #00c1de;
      span {
        color: #fff;
      }
    }
  }

  .head-item {
    display: flex;
    align-items: center;
    .sort-icon {
      display: inline-block;
      margin: 10px;
      width: 24px;
      height: 24px;
    }
    .sort-up {
      background: url("~img/account/down_arrow.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .sort-down {
      background: url("~img/account/upon_arrow.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }

  .list-mode {
    border-right: none;

    .list-icon {
      // background: url("~@static/images/list-mode.png") no-repeat center;
      background-size: 100%;
    }
    .list-iconOn {
      // background: url("~@static/images/list-modeOn.png") no-repeat center;
      background-size: 100%;
    }
  }
  .grid-mode {
    .mode-icon {
      // background: url("~@static/images/grid-mode.png") no-repeat center;
      background-size: 100%;
    }
    .mode-iconOn {
      // background: url("~@static/images/grid-modeOn.png") no-repeat center;
      background-size: 100%;
    }
  }
  .head-right,
  .head-middle {
    float: right;
  }
}
</style>

<style scoped>
.seachInput /deep/ .el-input-group {
  position: relative;
}

.seachInput /deep/ .el-input-group .el-input-group__append {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  background: #fff;
  border: none;
}
.seachInput /deep/ .el-input-group .el-input-group__append button {
  padding: 12;
}
.seachInput /deep/ .el-input-group .el-input-group__append button .search-icon {
  display: block;
  width: 18px;
  height: 18px;
  background: url("~img/account/search.png") no-repeat center center;
  background-size: 100% 100%;
}

.head-right /deep/.el-button {
  color: #fff;
}
.head-right /deep/.el-button span {
  color: #fff;
}
</style>
