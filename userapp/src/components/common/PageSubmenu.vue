<template>
    <div class="submenu">
        <h4 class="submenu-title"><slot name="title"></slot></h4>
       <ul class="submenu-list">
            <li
                @click="handlerRoute(item,index)"
                v-for="(item,index) in children"
                :key="index"
                 :class="{'active':lastRoute==item.code}"
            >{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import { siteDomain } from "@/environment/index";
export default {
    data(){
        return {
            children:"",
            lastRoute:""
        }
    },
    mounted(){
       let [, firstRoute,lastRoute] = this.$route.path.split("/");
       this.lastRoute = lastRoute
       this.$store.dispatch("getChildrenMenuList",firstRoute).then(data=>{
          this.children = data.children;
       })
    },
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
<style lang="scss" scoped>
.submenu {
    max-width: 120px;
    height: 100vh;
    background: #fff;
    border-right: 1px solid #E5E5E5;
    .submenu-title {
        height: 40px;
        line-height: 40px;
         padding-left: 12px;
    }
    .submenu-list {
        padding-top: 7px;
        li {
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            padding-left: 12px;
            &:hover {
                color: #00c1de;
                // background: #e5f8fa;
            }
        }
    }
}
.active{
    color: #00c1de;
    background: #e5f8fa;
}
.active:hover{
     background: #e5f8fa !important;
}
</style>

