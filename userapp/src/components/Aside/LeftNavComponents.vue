<template>
    <el-aside class="leftNavAside">
        <h4 class="submenu-title">
            <i>{{subTitle}}</i>
        </h4>
        <ul class="el-menu-vertical-demo el-menu">
            <li
                class="el-menu-item-left"
                v-for="(item,index) in menuList.children"
                :key="index"
                @click="handlerRoute(item,index)"
                :class="{'active':lastRoute==item.code}"
            >
                <span>{{item.name}}</span>
                <div v-show="item.children">
                    <p 
                        v-for="(item,ind) in item.children"
                        @click.stop="handlerRoute(item,index)"
                        :key="ind"
                        :class="{'active':lastRoute==item.code}"
                        >
                        {{item.name}}
                    </p>
                </div>
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
            //有三级路由时，二级路由不跳转
            if (item.children && item.children.length > 0) {
                return
            }
            let domain = item.menuUrl.split("/")[0];
            if (siteDomain == domain) {
                this.$router.push(item.path);
                return;
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        },
    }
};
</script>
<style scoped>
.leftNavAside {
    width: 100%;
    background: #f8fafc !important;
}
.submenu-title,
.el-menu {
    background: #f8fafc;
}
.el-menu .el-menu-item-left {
    line-height: 50px;
    font-size: 14px;
    text-align: left;
}
.el-menu :active.el-menu-item-left span{
    color: #0595e6;
}
.el-menu .el-menu-item-left span{
    display: inline-block;
    height: 50px;
    width: 100%;
    line-height: 50px;
    padding-left: 16px;
}
.el-menu .el-menu-item-left p{
    line-height: 50px;
    padding-left: 40px;
    cursor: pointer;
}
/* .el-menu .el-menu-item-left span:hover {
    background: #fff;
} */
.el-menu .el-menu-item-left p:hover {
    background: #fff;
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
    text-align: left;
    padding-left: 16px;
}
</style>

