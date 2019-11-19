<template>
    <div
        class="m-aside"
        :style="{width:width+'px'}"
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
                    @mouseenter="changeCurHoverItem(it,i)"
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
        <div 
            @mouseleave="leaveChange"
            @mouseenter="enterChange">
            <LeftNavComponents
                :subTitle="subTitle"
                :lastRoute="lastRoute"
                v-if="isLeftNavComponentsShow"
                :style="{width: 150 + 'px !important',height: '100%',borderRight:'1px solid #e6e6e6' }"
                class="m-asideright"
                :menuList="menuListChild"
            ></LeftNavComponents>
        </div>
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
            enterTime: null,
            subTitle:""
        };
    },
    components: {
        LeftNavComponents
    },
    methods: {
        enterChange(){
            let times = (new Date()).getTime();
            this.enterTime = times
        },
        leaveChange(){
            this.enterTime = null
        },
        changeCurHoverItem(it,i) {
            if (this.curIndex == -1) {
                this.curIndex = i;
                if(it.children && it.children.length > 0) {
                    this.width = 300;
                } else {
                    this.width = 150;
                }
            } else {
                this.temer = setTimeout(()=>{
                    let levtimes = (new Date()).getTime();
                    if(!this.enterTime || (levtimes - this.enterTime >=200)) {
                        this.curIndex = i;
                        if(it.children && it.children.length > 0) {
                            this.width = 300;
                        } else {
                            this.width = 150;
                        }
                    } else {
                        return
                    }
                },200)
            }
        },
        skipPages(item, i) {
            if (item.children && item.children.length> 0) {
                return;
            }
            window.location.href = "//" + item.menuUrl;
        },
        collapseOpen(width, time) {
            this.width = 150;
        },
        collapseClose() {
            setTimeout(()=>{
                this.width = 60;
            },250)
        },
        iconfonts(code) {
            switch (code) {
                case "board":
                    return "iconicon-kongzhitai1";
                case "content":
                    return "iconicon-neirong";
                case "website":
                    return "iconicon-moban1";
                case "membercenter":
                    return "iconicon-huiyuan1";
                case "role":
                    return "iconicon-chengyuan";
                case "recycle":
                    return "iconicon-huishou";
                case "template":
                    return "iconicon-mobanguanli1"    
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
<style lang="scss"  scoped >
.m-aside {
    position: absolute;
    left: 0;
    top: 0px;
    z-index: 10;
    overflow: hidden;
    transition: 0.2s ease-in-out;
    background-color:$--color-black-1;
    // border-right: 1px solid rgb(229, 229, 229);
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
.el-aside  .el-menu {
    /* height: 100%; */
    border: none;
}
</style>
<style lang="scss" scoped>

.menu-hover {
    background:$--background-color-selected;
    border-left: 4px solid $--color-primary  !important;
    .menu-icon {
        color: $--color-primary !important;
    }
    .menu-item-content {
         color: $--color-black-1 !important;   
     }
}
.menu-bg {
    background:$--background-color-selected;
    color: $--color-primary ;
    border-left: 4px solid $--color-primary !important;
    .menu-icon {
        color: $--color-primary !important;
    }
    .menu-item-content {
         color: $--color-black-1 !important;   
     }
    
}
// 选中的样式
.active-color {
    color: $--color-primary  !important;
     
}
.left-menu {
    background-color:$--color-black-1;
    height: calc(100vh - 50px);
    padding-top: 16px;
    .left-menu-item {
        cursor: pointer;
        line-height: 50px;
        white-space: nowrap;
        margin-bottom: 14px;
        border-left: 4px solid $--color-black-1;
        .menu-item-content {
            display: inline-block;
            line-height: 50px;
            color: $--color-white;
        }
        .menu-icon {
            display: inline-block;
            font-size: 16px;
            width: 60px;
            text-align: center;
            line-height: 50px;
            color:$--color-white;
            margin-left: -4px;
            
        }
        .iconicon-des-Arrow{
            position: absolute;
            left: 126px;
            font-size: 12px;
            vertical-align: middle;
            color: #B9CBCF;
        }
        .iconweixingongzhonghao{
            font-size: 19px;
        }
    }
}
</style>

