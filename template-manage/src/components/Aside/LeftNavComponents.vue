<template>
    <el-aside class="leftNavAside">
        <h4 class="submenu-title">
            <i>{{subTitle}}</i>
        </h4>
        <ul class="el-menu-vertical-demo el-menu">
            <li
                class="el-menu-item"
                v-for="(item,index) in menuList.children"
                :key="index"
                @click="handlerRoute(item,index)"
                :class="{'active':lastRoute==item.code}"
            >
                <span>{{item.name}}</span>
            </li>
        </ul>
    </el-aside>
</template>
<script>
import { siteDomain } from "@/environment/index";
export default {
    props: ["menuList", "lastRoute", "subTitle"],
    methods: {
        handlerRoute(item, index) {
            let domain = item.menuUrl.split("/")[0];
            if (siteDomain == domain) {
                this.$router.push(item.path);
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        }
    }
};
</script>
<style scoped>
.leftNavAside {
    background: #f8fafc !important;
}
.submenu-title,
.el-menu {
    background: #f8fafc;
}
.el-menu .el-menu-item {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-bottom: 10px;
}
.el-menu :hover.el-menu-item {
    background: #fff;
}
.el-menu :active.el-menu-item span{
    color: #0595e6;
}
.active {
    color: #0595e6;
    background: #fff;
    /* border-left: 4px solid #0595e6; */
}
.active:hover {
    /* color: #0595e6; */
    background: #ffffff !important;
}
.active:active{
     color: #0595e6;
}
.submenu-title {
    height: 40px;
    line-height: 40px;
    padding-top: 5px;
}
</style>
