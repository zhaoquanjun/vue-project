<template>
    <div
        class="m-aside"
        :style="{width:width+'px',transition: 'width .5s linear',backgroundColor:'#fff'}"
        @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"
    >
        <!--   @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"-->
        <el-aside class="m-asideleft" :style="{width:width+'px'}">
            <ul class="left-menu">
                <li class="left-menu-item">
                    <svg-icon icon-class="l-home"></svg-icon>
                    <span class="menu-item-content">控制台首页</span>
                </li>
                
                <li class="left-menu-item">
                    <svg-icon icon-class="l-content"></svg-icon>
                    <span class="menu-item-content">内容管理</span>
                </li>
                <li class="left-menu-item">
                    <svg-icon icon-class="l-website"></svg-icon>
                    <span class="menu-item-content">网站管理</span>
                </li>
                <li class="left-menu-item">
                    <svg-icon icon-class="l-form"></svg-icon>
                    <span class="menu-item-content">表单管理</span>
                </li>
                <li class="left-menu-item">
                    <svg-icon icon-class="l-system"></svg-icon>
                    <span class="menu-item-content">系统设置</span>
                </li>
                <li class="left-menu-item">
                    <svg-icon icon-class="l-recyclebin"></svg-icon>
                    <span class="menu-item-content">回收站</span>
                </li>
            </ul>

            <!-- <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
        <el-menu-item
          v-for="(item) in navList"
          @mouseenter="collapseOpen(150,0)"
          :index="item.id"
          :key="item.id"
        >
          <i class="el-icon-menu"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
            </el-menu>-->

            <!-- <el-menu default-active="1-4-1" class="el-menu-vertical" active-text-color="#00c1de">
                <el-menu-item index="1">
                    <i>
                        <svg-icon icon-class="l-home"></svg-icon>
                    </i>
                    <span class="menu-item-conten">控制台首页</span>
                </el-menu-item>
                <el-menu-item index="2"></el-menu-item>
                <el-menu-item index="3">
                    <i>
                        <svg-icon icon-class="l-website"></svg-icon>
                    </i>
                    <span class="menu-item-conten">网站管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i>
                        <svg-icon icon-class="l-form"></svg-icon>
                    </i>
                    <span class="menu-item-conten">表单管理</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <i>
                        <svg-icon icon-class="l-system"></svg-icon>
                    </i>
                    <span class="menu-item-conten">系统设置</span>
                </el-menu-item>
                <el-menu-item index="6">
                    <i>
                        <svg-icon icon-class="l-recyclebin"></svg-icon>
                    </i>
                    <span class="menu-item-conten">回收站</span>
                </el-menu-item>
            </el-menu>-->
        </el-aside>
        <LeftNavComponents
            :style="{width:width1+'px !important',transition: 'width '+time+' linear',backgroundColor:'#fff'}"
            class="m-asideright"
            :navList="navList"
        ></LeftNavComponents>
    </div>
</template>
<script>
import LeftNavComponents from "../aside/LeftNavComponents";

export default {
    data() {
        return {
            flag: 0,
            width: 50,
            width1: 0,
            time: "0.8s",
            navList: [
                { name: "控制台", id: "1" },
                { name: "内容管理", id: "2" },
                { name: "网站管理", id: "3" },
                { name: "小程序管理", id: "4" },
                { name: "微信公众号", id: "5" },
                { name: "表单管理", id: "6" },
                { name: "电商会员", id: "7" },
                { name: "系统设置", id: "8" },
                { name: "回收站", id: "9" }
            ]
        };
    },
    components: {
        LeftNavComponents
    },
    methods: {
        collapseOpen(width, time) {
            this.width = width;
            this.width1 = 120;
            this.time = time + "s";
            this.navList = [
                { name: "控制台", id: "1" },
                { name: "内容管理", id: "2" },
                { name: "网站管理", id: "3" },
                { name: "小程序管理", id: "4" },
                { name: "微信公众号", id: "5" },
                { name: "表单管理", id: "6" },
                { name: "电商会员", id: "7" },
                { name: "系统设置", id: "8" },
                { name: "回收站", id: "9" }
            ];
        },
        collapseClose() {
            this.width = 50;
            this.width1 = 0;
            this.time = "0s";
        }
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
        padding: 0 20px;
        line-height: 40px;
        white-space: nowrap;
        .menu-item-content {
            margin-left: 20px;
        }
    }
}
</style>

