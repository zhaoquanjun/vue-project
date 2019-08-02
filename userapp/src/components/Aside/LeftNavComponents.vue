<template>
    <el-aside class="leftNavAside">
        <el-menu class="el-menu-vertical-demo">
            <el-menu-item
                v-for="(item,index) in menuList.children"
                :key="index"
                :index="item.menuUrl.split('/')[1]"
                @click.native="handlerRoute(item,index)"
                :class="{'active':item.code == code}"
            >
                <span>{{item.name}}</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>
<script>
import { dashboardDomain } from "@/environment/index";
export default {
    props: ["menuList"],
    methods: {
        handlerRoute(item, index) {
            this.$emit("changeIndex");
            this.$store.commit("SETCODE",item.code)
            let domain= item.menuUrl.split("/")[0];
            if (dashboardDomain == domain) {
                this.$router.push(item.path);
            } else {
                window.location.href = "//" + item.menuUrl;
            }
        },
        match(){
           
        },
    },
    computed:{
        code(){
            return this.$store.state.website.curCode;
        }
    }
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
