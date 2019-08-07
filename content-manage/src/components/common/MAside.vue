<template>
    <div
        class="m-aside"
        :style="{width:width+'px',backgroundColor:'#fff'}"
        @mouseenter="collapseOpen(180,0.8)"
        @mouseleave="collapseClose"
    >
        <el-aside class="m-asideleft" :style="{width:width+'px'}">
            <ul class="left-menu">
                <li
                    ref="menuItem"
                    class="left-menu-item"
                    :class="{'menu-bg':curPath==it.code,'menu-hover':curIndex==i}"
                    v-for="(it, i) in getMenuList"
                    :key="i"
                    @mouseenter="changeCurHoverItem(i)"
                    @click="skipPages(it,i)"
                >
                    <i
                        class="menu-icon iconfont"
                        :class="[iconfonts(it.code)]"
                    ></i>
                    <span
                        class="menu-item-content"
                    >{{it.name}}</span>
                </li>
            </ul>
        </el-aside>
        <!--  :menuList="menuList[curIndex]" -->
        <!--  -->
        <LeftNavComponents
            :lastRoute="lastRoute"
            v-if="isLeftNavComponentsShow"
            :style="{width:width1+'px !important',backgroundColor:'#fff',height: '100%',display:display,borderRight:'1px solid #e6e6e6'}"
            class="m-asideright"
            :menuList="menuListChild"
        ></LeftNavComponents>
    </div>
</template>
<script>
import { getSliderMenuList } from "@/api/request/user.js";
import LeftNavComponents from "_c/Aside/LeftNavComponents";
import { siteDomain } from "@/environment/index";

export default {
    data() {
        return {
            width: 70,
            width1: 0,
            time: "0.8s",
            curIndex: -1,
            menuList: [],
            serversData: [],
            display: "none",
            curPath: "",
            lastRoute: ""
        };
    },
    components: {
        LeftNavComponents
    },
    methods: {
        changeCurHoverItem(i) {
            this.curIndex = i;
        },
        skipPages(item, i) {
            let [path, url] = item.menuUrl.split("/");
            if (!item.path) return;
            if (siteDomain == path) {
                this.$router.push(item.path);
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        },
        collapseOpen(width, time) {
            this.width = width;
            this.width1 = 100;
            this.display = "block";
            this.time = time + "s";
        },
        collapseClose() {
            this.width = 70;
            this.width1 = 0;
            this.display = "none";
            this.time = "0s";
            this.curIndex = -1;
        },
        iconfonts(code) {
            switch (code) {
                case "board":
                    return "iconkongzhitaishouye";
                case "content":
                    return "iconneirongguanli";
                case "website":
                    return "iconwangzhanguanli";
                case "system":
                    return "iconxitongshezhi";
                case "form":
                    return "iconbiaodanguanli";
                case "micro":
                    return "iconweixinxiaochengxu";
                case "wechat":
                    return "iconweixingongzhonghao";
                case "recycle":
                    return "iconhuishouzhan";
                case "business":
                    return "icondianshanghuiyuan";
            }
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
    watch: {
        $route(to, from) {
            let [, firstRoute, lastRoute] = this.$route.path.split("/");
            this.curPath = firstRoute;
            this.lastRoute = lastRoute;
        }
    }
};
</script>

<style scoped>
@import "../../assets/fonts/aside/iconfont.css";
.m-aside {
    position: absolute;
    left: 0;
    top: 0px;
    /* bottom: 0; */
    z-index: 10;
}
.m-asideleft {
    overflow: hidden;
    /* height: 100%; */
}
.m-asideright {
    width: 0px !important;
    position: absolute;
    left: 180px;
    z-index: 10;
    top: 0;
    text-align: center;
    /* border-right: 1px solid #E5E5E5; */
}
.el-aside /deep/ .el-menu {
    /* height: 100%; */
    border: none;
}
</style>
<style lang="scss" scoped>
// 选中的样式
.menu-bg{
    background: #e0faff;
    color: #0595e6;
}
.menu-hover{
     background: #e0fcff;
}
.left-menu {
    border-right: solid 1px #e6e6e6;
    background: #fff;
    height: calc(100vh - 80px);
    padding-top: 16px;
    .left-menu-item {
        cursor: pointer;
        line-height: 50px;
        white-space: nowrap;
        margin-bottom: 14px;
        .menu-icon {
            display: inline-block;
            font-size: 22px;
            width: 70px;
            text-align: center;
            vertical-align: middle;
            color: #0595e6;
        }
    }
   
}
</style>

