<template>
    <div
        class="m-aside"
        :style="{width:width+'px',transition: 'width .5s linear',backgroundColor:'#fff'}"
        @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"
    >
      <!-- @mouseleave="collapseClose" -->
        <el-aside class="m-asideleft" :style="{width:width+'px'}">
            <ul class="left-menu">
                <li
                    ref="menuItem"
                    class="left-menu-item"
                    v-for="(it, i) in getMenuList"
                    :key="i"
                    @mouseenter="changeCurHoverItem(i)"
                    @click="skipPages(it,i)"
                >
                    <!-- <svg-icon :icon-class="'l-' + it.code"></svg-icon> -->
                    <!-- :class="curIndex==i ? it.code+"-on" : it.code" -->
                    <i class="menu-icon" :class="[curIndex==i ? it.code+'-on' : it.code]"></i>
                    <span class="menu-item-content">{{it.name}}</span>
                </li>
            </ul>
        </el-aside>
     <!--  :menuList="menuList[curIndex]" -->
        <LeftNavComponents
            v-if="isLeftNavComponentsShow"
            :style="{width:width1+'px !important',transition: 'width '+time+' linear',backgroundColor:'#fff',height: '100%'}"
            class="m-asideright"
           :menuList="menuListChild"
        ></LeftNavComponents>
    </div>
</template>
<script>
import { getSliderMenuList, checkHasRootSkip } from "@/api/index";
import LeftNavComponents from "../Aside/LeftNavComponents";
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            flag: 0,
            width: 50,
            width1: 0,
            time: "0.8s",
            curIndex: 0,
            menuList: [],
            serversData: []
        };
    },
    components: {
        LeftNavComponents
    },
    mounted(){
      
    },
    methods: {
        changeCurHoverItem(i) {
            this.curIndex = i;
        },
        skipPages(item,i) {
            console.log(this.$refs.menuItem)    
            let path = item.menuUrl.split('/')[1]
            if(!item.path){return}
            this.$router.push(item.path)
        },
        collapseOpen(width, time) {
            this.width = width;
            this.width1 = 120;
            this.time = time + "s";
        },
        collapseClose() {
            this.width = 50;
            this.width1 = 0;
            this.time = "0s";
        }
    },
    computed: {
        getMenuList(){
            if(!this.$store.getters.getMenuList) return
            return this.$store.getters.getMenuList
        },
        menuListChild(){
            if(!this.getMenuList) return
            return this.getMenuList[this.curIndex]
        },
        isLeftNavComponentsShow(){
             if(!this.$store.getters.getMenuList) return
            let item = this.$store.getters.getMenuList[this.curIndex] ;
            if(item && item.children){
                return true
            }else{
                return false
            }
        },
       
    },
    watch:{
       
    }
   
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
    overflow: hidden;
}
.el-menu {
    height: 100%;
}
</style>
<style lang="scss" scoped>
// 手写菜单

.left-menu {
    height: 100%;
    border-right: solid 1px #e6e6e6;
    background: #fff;
    .left-menu-item {
        cursor: pointer;
        padding: 0 20px;
        line-height: 40px;
        white-space: nowrap;
        &:hover{
             background: #e5f8fa;
            color: #00c1de;
        }
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

