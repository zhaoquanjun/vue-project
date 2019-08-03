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
    height: 40px;
    line-height: 40px;
    font-size: 12px;
   
}
.el-menu /deep/ :hover.el-menu-item {
    color: #15c6e0;
    background: #fff;
}
.active{
    color: #00c1de;
    background: #e5f8fa;
}
.active:hover{
     background: #e5f8fa !important;
}
</style>
