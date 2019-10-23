<template>
    <div
        class="m-aside"
        :style="{width:width+'px',backgroundColor:'#F8FAFC',borderRight: '1px solid rgb(229, 229, 229)'}"
        @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"
    >
        <el-aside class="m-asideleft" :style="{width:150+'px'}">
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
                    <!--  :class="[curPath==it.code? it.code+'-on' : it.code,curIndex==i ? it.code+'-on' : it.code]" -->
                    <i class="menu-icon iconfont" :class="[iconfonts(it.code)]"></i>
                    <span class="menu-item-content">{{it.name}}</span>
                    <i
                        v-if="menuHasChild(i)"
                        :class="{'active-color':curPath==it.code,}"
                        class="iconfont iconicon-des-Arrow"
                    ></i>
                </li>
            </ul>
        </el-aside>
        <LeftNavComponents
            :subTitle="subTitle"
            :lastRoute="lastRoute"
            v-if="isLeftNavComponentsShow"
            :style="{width: 150 + 'px !important',backgroundColor:'#fff',height: '100%',borderRight:'1px solid #e6e6e6' }"
            class="m-asideright"
            :menuList="menuListChild"
        ></LeftNavComponents>
    </div>
</template>
<script>
import { getSliderMenuList } from "@/api/index";
import LeftNavComponents from "_c/Aside/LeftNavComponents";
export default {
    data() {
        return {
            width: 60,
            width1: 0,
            time: "0.8s",
            curIndex: -1,
            menuList: [],
            serversData: [],
            display: "none",
            border:"1px solid #e5e5e5",
            curPath: "",
            lastRoute: "",
            subTitle:""
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
            if (item.children && item.children.length> 0) {
                return;
            }
            window.location.href = "//" + item.menuUrl;
        },
        collapseOpen(width, time) {
            this.width = 300;
            this.width1 = 150;
            this.display = "block";
            this.time = time + "s";
            this.border = "none";
        },
        collapseClose() {
            this.width = 60;
            this.width1 = 0;
            this.display = "none";
            this.time = "0s";
            this.curIndex = -1;
            this.border = "1px solid #e5e5e5";
        },
        iconfonts(code) {
            switch (code) {
                case "board":
                    return "iconicon-kongzhitai";
                case "content":
                    return "iconicon-neirong1";
                case "website":
                    return "iconicon-wangzhan";
                case "system":
                    return "iconicon-huiyuan";
                case "sitemember":
                    return "iconicon-huiyuan";
                case "form":
                    return "iconicon-chengyuan";   
                case "micro":
                    return "iconweixinxiaochengxu";
                case "wechataccount":
                    return "iconicon-huishouzhna";
                case "recycle":
                    return "iconicon-huishouzhna";
                case "role":
                    return "iconicon-chengyuan";
                case "template":
                    return "iconicon-mobanguanli"    
            }
        },
        menuHasChild(index){
            if(this.getMenuList[index]&&this.getMenuList[index]["children"]){
                return true
            }else{
                false
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
                 this.subTitle=item.name
                return true;
            } else {
                return false;
            }
        }
    },
    watch: {
        $route(to, from) {
            let routerList = this.$route.path.split("/");
            let [, firstRoute, lastRoute] = this.$route.path.split("/");
            this.lastRoute = routerList[routerList.length-1];
            this.curPath = firstRoute;
        }
    }
};
</script>
<style scoped>
.m-aside {
    position: absolute;
    left: 0;
    top: 0px;
    /* bottom: 0; */
    z-index: 10;
    overflow: hidden;
    transition: 0.3s ease-in;
    /* transition:  0.3s linear;  */
}
.m-asideleft {
    overflow: hidden;
    /* transition:  0.3s linear;  */
    /* height: 100%; */
}

.m-asideright {
    width: 0px !important;
    position: absolute;
    left: 150px;
    z-index: 10;
    top: 0;
    text-align: center;
    border-right: none !important;
    /* border-right: 1px solid #E5E5E5; */
}
.el-aside /deep/ .el-menu {
    /* height: 100%; */
    border: none;
}
</style>
<style lang="scss" scoped>
// 选中的样式
.active-color {
    color: #0595e6 !important;
}
.menu-hover {
    background:rgba(248,250,252,1);
}
.menu-bg {
    background:rgba(240, 243, 247, 1);
    color: #0595e6;
    border-left: 4px solid #0595e6 !important;
}
.left-menu {
    // border-right: solid 1px #e6e6e6;
    background: #fff;
    height: calc(100vh - 50px);
    padding-top: 16px;
    .left-menu-item {
        cursor: pointer;
        line-height: 50px;
        white-space: nowrap;
        margin-bottom: 14px;
        border-left: 4px solid #fff;
        .menu-icon {
            display: inline-block;
            font-size: 20px;
            width: 60px;
            text-align: center;
            vertical-align: middle;
            color: #0595e6;
        }
        .iconicon-des-Arrow{
            position: absolute;
            left: 130px;
            font-size: 14px;
            vertical-align: middle;
            color: #B9CBCF;
        }
        .iconweixingongzhonghao{
            font-size: 19px;
        }
    }
}
</style>

