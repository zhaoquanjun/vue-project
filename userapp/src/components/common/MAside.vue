<template>
    <div
        class="m-aside"
        :style="{width:width+'px',backgroundColor:'#fff'}"
        @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"
    >
        <el-aside class="m-asideleft" :style="{width:width+'px'}">
            <ul class="left-menu">
                <li
                    ref="menuItem"
                    class="left-menu-item"
                    :class="[active==i?'menu-bg':'']"
                    v-for="(it, i) in getMenuList"
                    :key="i"
                    @mouseenter="changeCurHoverItem(i)"
                    @mouseleave="itemhandlerLeave"
                    @click="skipPages(it,i)"
                >
                    <i
                        class="menu-icon"
                        :class="[curIndex==i ? it.code+'-on' : it.code,active==i? it.code+'-on' : it.code]"
                    ></i>
                    <span class="menu-item-content" :class="curIndex==i ?'menu-color':''">{{it.name}}</span>
                </li>
            </ul>
        </el-aside>
        <!--  :menuList="menuList[curIndex]" -->
        <LeftNavComponents
            v-if="isLeftNavComponentsShow"
            :style="{width:width1+'px !important',backgroundColor:'#fff',height: '100%',display:display,borderRight:'1px solid #e6e6e6'}"
            class="m-asideright"
            :menuList="menuListChild"
            @changeIndex="changeIndex"
        ></LeftNavComponents>
    </div>
</template>
<script>
import { getSliderMenuList, checkHasRootSkip } from "@/api/index";
import LeftNavComponents from "_c/Aside/LeftNavComponents";

export default {
    data() {
        return {
            flag:0,
            active: 0,
            flag: 0,
            width: 50,
            width1: 0,
            time: "0.8s",
            curIndex: 0,
            menuList: [],
            serversData: [],
            display:"none"
        };
    },
    components: {
        LeftNavComponents
    },
    methods: {
        changeCurHoverItem(i) {
            this.curIndex = i;
            this.flag =i
        },
        itemhandlerLeave() {
            //this.curIndex = 0;
        },
        skipPages(item, i) {
            let path = item.menuUrl.split("/")[1];
            if (!item.path) {
                return;
            }
            this.active = this.curIndex = i;
            this.$router.push(item.path);
        },
        collapseOpen(width, time) {
            this.width = width;
            this.width1 = 120;
            this.display="block"
            this.time = time + "s";
        },
        collapseClose() {
            this.width = 50;
            this.width1 = 0;
             this.display="none"
            this.time = "0s";
            this.curIndex = -1;
        },
        changeIndex(){
            this.active  = this.flag
        }
    },
    computed: {
        getMenuList() {
            if (!this.$store.getters.getMenuList) return;
            return this.$store.getters.getMenuList;
        },
        menuListChild() {
            if (!this.getMenuList) return;
            return this.getMenuList[this.curIndex];
        },
        isLeftNavComponentsShow() {
            if (!this.$store.getters.getMenuList) return;
            let item = this.$store.getters.getMenuList[this.curIndex];
            if (item && item.children) {
                return true;
            } else {
                return false;
            }
        }
    },
};
</script>

<style scoped>
.m-aside {
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    z-index: 10;
}
.m-asideleft {
    overflow: hidden;
    height: 100%;
}
.m-asideright {
    width: 0px !important;
    position: absolute;
    left: 150px;
    z-index: 10;
    top: 0;
    text-align: center;
    /* border-right: 1px solid #E5E5E5; */
}
.el-aside /deep/ .el-menu {
    height: 100%;
    border: none;
}
</style>
<style lang="scss" scoped>
// 手写菜单
.menu-bg {
    background: #e5f8fa;
    color: #00c1de;
}
.menu-color{
     color: #00c1de;
}
.left-menu {
    height: 100%;
    border-right: solid 1px #e6e6e6;
    background: #fff;
    .left-menu-item {
        cursor: pointer;
        padding: 0 20px;
        line-height: 40px;
        white-space: nowrap;

        // &:hover {
        //     background: #E5F8FA;
        //     color: #00c1de;
        // }
        //  &:active {

        //     color: #00c1de;
        // }
        .menu-item-content {
            margin-left: 20px;
        }
        .menu-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
        .board {
            background: url("~img/menu-icon/board.png") no-repeat center;
            background-size: 100%;
        }
        .board-on {
            background: url("~img/menu-icon/board-on.png") no-repeat center;
            background-size: 100%;
        }
        .content {
            background: url("~img/menu-icon/content.png") no-repeat center;
            background-size: 100%;
        }
        .content-on {
            background: url("~img/menu-icon/content-on.png") no-repeat center;
            background-size: 100%;
        }
        .micro {
            background: url("~img/menu-icon/micro.png") no-repeat center;
            background-size: 100%;
        }
        .micro-on {
            background: url("~img/menu-icon/micro-on.png") no-repeat center;
            background-size: 100%;
        }
        .website {
            background: url("~img/menu-icon/website.png") no-repeat center;
            background-size: 100%;
        }
        .website-on {
            background: url("~img/menu-icon/website-on.png") no-repeat center;
            background-size: 100%;
        }
        .wechat {
            background: url("~img/menu-icon/wechat.png") no-repeat center;
            background-size: 100%;
        }
        .wechat-on {
            background: url("~img/menu-icon/wechat-on.png") no-repeat center;
            background-size: 100%;
        }
        .form {
            background: url("~img/menu-icon/form.png") no-repeat center;
            background-size: 100%;
        }
        .form-on {
            background: url("~img/menu-icon/form-on.png") no-repeat center;
            background-size: 100%;
        }
        .system {
            background: url("~img/menu-icon/system.png") no-repeat center;
            background-size: 100%;
        }
        .system-on {
            background: url("~img/menu-icon/system-on.png") no-repeat center;
            background-size: 100%;
        }
        .recycle {
            background: url("~img/menu-icon/recycle.png") no-repeat center;
            background-size: 100%;
        }
        .recycle-on {
            background: url("~img/menu-icon/recycle-on.png") no-repeat center;
            background-size: 100%;
        }
    }
}
</style>

