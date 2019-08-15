<template>
    <el-aside class="leftNavAside">
        <el-menu class="el-menu-vertical-demo">
            <el-menu-item
                v-for="(item,index) in menuList.children"
                :key="index"
                :index="item.menuUrl.split('/')[1]"
                @click.native="handlerRoute(item,index)"
                :class="{'active':lastRoute==item.code}"
            >
                <span>{{item.name}}</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>
<script>
import { siteDomain } from "@/environment/index";
export default {
    props: ["menuList","lastRoute"],
    methods: {
        handlerRoute(item, index) {
            
            let domain= item.menuUrl.split("/")[0];
            if (siteDomain == domain) {
                this.$router.push(item.path);
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        },

    },
   
};
</script>
<style scoped>

.el-menu /deep/ .el-menu-item {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-bottom: 10px;
}
.el-menu /deep/ :hover.el-menu-item {
    background: #e0fcff;
}
.active{
    color: #0595e6;
    background: #e0faff;
}
.active:hover{
     color: #0595e6;
     background: #e0faff !important;
}
</style>
