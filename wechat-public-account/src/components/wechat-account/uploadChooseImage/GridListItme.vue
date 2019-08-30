<template>
  <div>
    <div
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      class="img-item"
    >
      <span class="img-wrap">
        <div class="mask" :class="isMaskShow"></div>
        <img :src="curItem.zoomOssUrl" alt>
      </span>
      <div class="img-handle-btn" :class="[isHandleBtnShow?'show':'hide']">
        <span @click.stop="handleMove">
          <span class="move-icon"></span>
        </span>
        <span @click.stop="handleLook">
          <span class="preview-icon"></span>
        </span>
        <span @click.stop="handleDelete">
          <span class="delete-icon"></span>
        </span>
      </div>
      <div class="img-handle-btn" :class="[isSelectedShow?'show':'hide']">
        <span class="item-selected" style="float:right">
          <span class="selected-icon"></span>
        </span>
      </div>
    </div>
    <p class="img-desc">{{curItem.title}}</p>
  </div>
</template>
<script>
export default {
  props: ["curItem", 'index'],
  data() {
    return {
      isHandleBtnShow: false,
      isSelectedShow: false,
      curIndex: null
    };
  },
  methods: {
    handleClick(i) {
      this.curIndex = i;
      this.isHandleBtnShow = false;
      this.isSelectedShow = !this.isSelectedShow;
      this.$emit("handleSelected",this.curItem,this.isSelectedShow,this._uid)
    },
    handleMouseMove() {
      if (this.isSelectedShow || this.isHandleBtnShow) return;
      this.isHandleBtnShow = true;
    },
    handleMouseLeave() {
      this.isHandleBtnShow = false;
    },
    handleMove() {
      this.isHandleBtnShow = true;
      this.$emit("handleMove", this.curItem);
    },
    handleLook() {
      this.isHandleBtnShow = true;
      this.$emit("viewPic", this.index);
    },
    handleDelete() {
      this.isHandleBtnShow = true;
      this.$emit("batchRemovePic", this.curItem);
    }
  },
  computed: {
    isMaskShow() {
      if (this.isHandleBtnShow || this.isSelectedShow) {
        return "show";
      } else {
        return "hide";
      }
    }
  },
  watch: {
    //    curItem(){
    //        alert(1)
    //    }
  }
};
</script>

<style lang="scss" scoped>
.show {
  display: block;
}
.hide {
  display: none;
}
.img-item {
  position: relative;
  .img-wrap {
    position: relative;
    display: inline-block;
    width: 100%;
    .mask {
      position: absolute;
      background: rgba(38, 38, 38, 1);
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0.5;
      filter: opacity(0.5);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-handle-btn {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 16px;
    z-index: 1000;
    .item-selected {
      width: 16px;
      height: 16px;
      margin-right: 9px;
      text-align: center;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      text-align: center;
      width: 33%;
      .svg-icon {
        width: 27px;
        height: 27px;
      }
    }
  }
}
.img-desc {
  text-align: center;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style lang="scss" scoped>
.img-handle-btn {
  span {
    display: block;
  }
  .move-icon {
    width: 16px;
    height: 16px;
    background: url("~img/account/img_move.png") no-repeat center
      center;
    background-size: 100% 100%;
    &:hover {
      background: url("~img/account/img_move_active.png") no-repeat
        center center;
      background-size: 100% 100%;
    }
  }
  .preview-icon {
    width: 16px;
    height: 16px;
    background: url("~img/account/img_preview.png") no-repeat center
      center;
    background-size: 100% 100%;
    &:hover {
      background: url("~img/account/img_preview_active.png") no-repeat
        center center;
      background-size: 100% 100%;
    }
  }
  .delete-icon {
    width: 16px;
    height: 16px;
    background: url("~img/account/img_delete.png") no-repeat center
      center;
    background-size: 100% 100%;
    &:hover {
      background: url("~~img/account/img_delete_active.png") no-repeat
        center center;
      background-size: 100% 100%;
    }
  }
  .selected-icon {
    width: 16px !important;
    height: 16px !important;
    background: url("~~img/account/img_selected.png") no-repeat center
      center;
    background-size: 100% 100%;
  }
}
</style>