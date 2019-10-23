<template>
  <div class="table-wrap" id="img-list">
    <ul class="img-list">
      <li class="item" v-for="(item, i) in imgPageResult.list" :key="item.id">
        <grid-list-item
          :curItem="item"
          :index="i"
          @handleSelected="handleSelected"
          @viewPic="viewPic"
          @handleMove="handleMove"
          @batchRemovePic="batchRemovePic"
        ></grid-list-item>
      </li>
    </ul>
    <div class="pageing">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="imgPageResult.totalRecord"
        :page-count="imgPageResult.totalPage"
        :page-size="picSearchOptions.pageSize"
        :page-sizes="[5,10,15,20,50,100]"
        @current-change="changePage"
        @size-change="changeSize"
      ></el-pagination>
    </div>
    <div id="img-list-dialog" v-show="imgVisible">
      <i class="el-icon-close image-preview__close--icon" @click="_handleCloseImagePreviewModal"></i>
      <ul class="image-preview__area">
        <li class="previw-prev__btn" @click="_handlePreviewPrev">
          <i
            class="el-icon-arrow-left"
            :style="{color: curIndex == 0 ? '#aaa' : '#fff', cursor:  curIndex == 0 ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-for="(item, index) in imgPageResult.list" :key="item.id">
          <img v-if="index == curIndex" :src="item.fullOssUrl" alt />
        </li>
        <li class="previw-next__btn" @click="_handlePrevewNext">
          <i
            class="el-icon-arrow-right"
            :style="{color: curIndex == imgPageResult && imgPageResult.list.length ? '#aaa' : '#fff', cursor:  curIndex == imgPageResult && imgPageResult.list.length ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import GridListItem from "./GridListItme";
export default {
  props: ["imgPageResult", "picSearchOptions"],
  data() {
    return {
      imgVisible: false,
      seletedList: [],
      curIndex: 0
    };
  },
  components: {
    GridListItem
  },
  methods: {
    handleSelected(item, isSelected, uid) {
      //   if (isSelected) {
      //     this.seletedList.push(item);
      //   } else {
      //     this.seletedList = this.seletedList.filter(cur => cur !== item);
      //   }
      this.$children.filter(item => {
        if (item._uid != uid) {
          item.isSelectedShow = false;
        }
      });

      if (isSelected) {
        this.seletedList[0] = item;
      }
      this.$emit("handleSelectionChange", this.seletedList);
    },
    changePage(page) {
      this.picSearchOptions.pageIndex = page;
      this.$emit("getPicList");
    },
    changeSize(size) {
      this.picSearchOptions.pageSize = size;
      this.$emit("getPicList");
    },
    viewPic(i) {
      this.imgVisible = true;
      this.curIndex = i;
    },
    /**
     * 移动分类
     */
    handleMove(item) {
      console.log(item);
      this.$emit("moveClassify", true, item);
    },
    batchRemovePic(item) {
      this.$emit("batchRemove", [item.id]);
    },
    _handlePreviewPrev() {
      this.curIndex = this.curIndex > 0 ? this.curIndex - 1 : this.curIndex;
      console.log(this.curIndex);
    },
    _handlePrevewNext() {
      this.curIndex =
        this.curIndex < this.imgPageResult.list.length
          ? this.curIndex + 1
          : this.curIndex;
      console.log(this.curIndex);
    },
    _handleCloseImagePreviewModal() {
      this.imgVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
#img-list {
  padding-top: 44px;
  max-height: 645px;
  .img-list {
    width: 100%;
    height: 400px;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    justify-content: space-around;
    align-content: space-between;
    flex-wrap: wrap;
    li.item {
      display: inline-block;
      width: 18%;
      margin: 10px 20px;
    }
  }
  .pageing {
    padding-top: 40px;
    padding-right: 20px;
  }

  #img-list-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1001;
    .image-preview__close--icon {
      position: absolute;
      top: 10px;
      right: 18px;
      color: #fff;
      font-size: 20px;
      z-index: 1000;
      cursor: pointer;
    }
    .image-preview__area {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          max-width: 800px;
          max-height: 400px;
        }
      }
      .previw-prev__btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        i {
          font-size: 60px;
          color: #fff;
        }
      }
      .previw-next__btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        cursor: pointer;
        i {
          font-size: 60px;
          color: #fff;
        }
      }
    }
  }
}
</style>

<style scoped>
.pageing /deep/ .el-pagination {
  font-size: 14px;
}
.pageing /deep/ .el-pagination span:not([class*="suffix"]) {
  height: 32px;
  line-height: 32px;
}

.pageing /deep/ .el-pagination .el-pagination__jump {
  height: 32px;
}

.pageing /deep/ .el-pagination .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.pageing /deep/ .el-pagination button {
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}

.pageing /deep/ .el-pagination .el-pager li.number {
  widows: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
