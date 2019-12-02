<template>
    <div>
        <div
            @click="handleClick"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
            class="img-item"
            :style="{background: 'url(' + (curItem.fullOssUrl) + ') no-repeat center',backgroundSize:'cover'}"
        >
            <span class="img-wrap">
                <div :class="{ mask:isMaskShow }"></div>
            </span>
            <div class="img-handle-btn" :class="[isHandleBtnShow?'show':'hide']">
                <button @click.stop="handleMove">
                    <el-tooltip class="item" effect="dark" content="移动" placement="bottom">
                        <i class="iconfont iconyidong"></i>
                    </el-tooltip>
                </button>
                <button @click.stop="handleLook">
                    <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
                        
                         <i class="iconfont iconchakan"></i>
                    </el-tooltip>
                </button>
                <button @click.stop="handleDelete">
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                        <i class="iconfont iconshanchu"></i>
                    </el-tooltip>
                </button>
            </div>
            <div v-if="multiple" class="img-handle-btn" :class="[isSelected?'show':'hide']">
                <button class="item-selected" style="float:right">
                    <i class="iconfont iconduihao"></i>
                </button>
            </div>
            <div
                v-else
                class="img-handle-btn"
                :class="isSelected ? 'show' : 'hide'"
            >
                <span class="item-selected" style="float:right">
                     <i class="iconfont iconduihao"></i>
                </span>
            </div>
        </div>
        <p v-if="isRename" @click="rename()" class="img-desc">{{curItem.title}}</p>
        <el-input
            style="padding-top:5px"
            v-else
            type="text"
            size="small"
            placeholder="请输入内容"
            v-model="curItem.title"
            maxlength="30"
            show-word-limit
            @blur="rename(curItem.id,curItem.title)"
        ></el-input>
    </div>
</template>
<script>
import { trim } from "@/utlis/index.js";
export default {
    props: {
        curItem: {
            type: Object
        },
        isSelected: {
            type: Boolean
        },
        multiple: {
            type: Boolean,
            default: () => {
                return true;
            }
        }
    },
    data() {
        return {
            isRename: true,
            isHandleBtnShow: false,
            seletedList: []
        };
    },
    mounted() {},
    methods: {
        handleClick() {
            this.isHandleBtnShow = false;
            this.$emit("handleSelected", this.curItem);
        },
        handleMouseMove() {
            if (this.isSelected || this.isHandleBtnShow) return;
            this.isHandleBtnShow = true;
        },
        handleMouseLeave() {
            this.isHandleBtnShow = false;
        },
        handleMove() {
            this.isHandleBtnShow = true;
            this.$emit("handleMove", this.curItem);
        },
        // 查看大图
        handleLook() {
            this.isHandleBtnShow = true;
            this.$emit("viewPic", this.curItem);
        },
        handleDelete() {
            this.isHandleBtnShow = true;
            this.$emit("batchRemovePic", this.curItem);
        },
        // 重命名图片名称
        rename(id, newName) {
            if (id) {
                if (!trim(newName)) {
                    this.$notify({
                        customClass: "notify-error",
                        message: `图片名称不能为空`,
                        showClose: false,
                        duration: 2000
                    });
                    return false;
                }
                this.isRename = true;
                this.$emit("rename", id, newName);
            } else {
                this.isRename = false;
            }
         
        }
    },
    computed: {
        isMaskShow() {
                return this.isHandleBtnShow || this.isSelected ? true : false;
        }
    },
};
</script>
<style scoped>
.el-input /deep/ .el-input__inner {
    padding-right: 50px;
}
</style>

<style lang="scss" scoped>
.show {
    display: block;
}
.hide {
    display: none;
}
.img-item {
    display: inline-block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    position: relative;
    .img-wrap {
        position: relative;
        display: inline-block;
        width: 100%;
        padding-bottom: 100%;
        overflow: hidden;

        // width: 141px;
        // height: 141px;
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
            max-height: 300px;
            max-width: 300px;
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
            
        }
        button {
            display: inline-block;
            text-align: center;
            width: 33%;
            i{
                color: #fff;
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
