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
import { wechataccountDomain } from "@/environment/index";
export default {
    props: ["menuList", "lastRoute", "subTitle"],
    methods: {
        handlerRoute(item, index) {
            let domain = item.menuUrl.split("/")[0];
            if (wechataccountDomain == domain) {
                this.$router.push(item.path);
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        }
    }
};
</script>
<style scoped>
.el-menu .el-menu-item {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-bottom: 10px;
}
.el-menu :hover.el-menu-item {
    background: #e0fcff;
}
.active {
    color: #0595e6;
    background: #e0faff;
}
.active:hover {
    color: #0595e6;
    background: #e0faff !important;
}
.submenu-title {
    height: 40px;
    line-height: 40px;
    padding-top: 5px;
}
</style>
