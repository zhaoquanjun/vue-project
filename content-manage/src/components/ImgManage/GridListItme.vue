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
                    <svg-icon icon-class="img-move"></svg-icon>
                </span>
                <span @click.stop="handleLook">
                    <svg-icon icon-class="img-look"></svg-icon>
                </span>
                <span @click.stop="handleDelete">
                    <svg-icon icon-class="img-delete"></svg-icon>
                </span>
            </div>
            <div class="img-handle-btn" :class="[isSelectedShow?'show':'hide']">
                <span class="item-selected" style="float:right">
                    <svg-icon icon-class="img-selected"></svg-icon>
                </span>
            </div>
        </div>
        <p class="img-desc">{{curItem.title}}</p>
       
    </div>
</template>
<script>
export default {
    props: ["curItem"],
    data() {
        return {
            isHandleBtnShow: false,
            isSelectedShow: false,
          
        };
    },
    methods: {
        handleClick() {
            this.isHandleBtnShow = false;
            this.isSelectedShow = !this.isSelectedShow;
            this.$emit("handleSelected",this.curItem,this.isSelectedShow)
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
            this.$emit("handleMove",this.curItem)
        },
        handleLook() {
            
            this.isHandleBtnShow = true;
            this.$emit("viewPic",this.curItem)
        },
        handleDelete() {
           
            this.isHandleBtnShow = true;
            this.$emit("batchRemovePic",this.curItem)
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
    watch:{
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
        width: 141px;
        height: 141px;
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
        bottom: 10px;
        z-index: 1000;
        .item-selected {
            width: 27px;
            height: 27px;
            margin-right: 9px;
            text-align: center;
            line-height: 27px;
            border-radius: 50%;
            background: #00c1de;
            .svg-icon {
                width: 16px;
                height: 16px;
            }
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
