<template>
    <el-aside class="leftNavAside">
        <h4 class="submenu-title">
            {{subTitle}}
        </h4>
        <ul class="el-menu-vertical-demo submenu-list">
            <li
                class="el-menu-item-left"
                v-for="(item,index) in menuList.children"
                :key="index"
                @click="handlerRoute(item,index)"
                :class="{'active':lastRoute==item.code}"
            >
                <span :class="[item.children && item.children.length > 0==1?'haschildren':'nochildren']">
                    <i v-show="item.children && item.children.length>0" class="icon iconfont" :class="[iconfonts(item.code)]"></i>
                    {{item.name}}
                </span>
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
        iconfonts(code) {
        switch (code) {
                case "mysite":
                    return "iconicon-dash-Mymanagement";
                case "wechataccount":
                    return "iconicon-dash-Publicpromotion";
                case "seo":
                    return "iconicon-dash-seo";
                case "sitemanage":
                    return "iconicon-dash-Webmanagement";
                case "sitemember":
                    return "iconicon-banpipei"    
            }
        }
    }
};
</script>
<style scoped lang="scss">
.leftNavAside {
    width: 100%;
    background: $--color-black-2 !important;
}
.submenu-title {
    height: 50px;
    line-height: 50px;
    color: $--color-white;
    text-align: center;
    font-size: 14px;
}
.submenu-list {
        li {
          cursor: pointer;
          line-height: 32px;
          text-align: left;
          font-size: $--font-size-small;
          span {
            display: inline-block;
            color: $--color-white;
            line-height: 32px;
            width: 100%;
            padding-left: 24px;
            cursor: pointer;
          }
          .nochildren {
              &:hover {
                color: $--color-white;
                background: rgba(245, 246, 247, 0.1);
              }
          }
          .haschildren {
            padding-left: 0px;
            cursor: default;
            i {
              width: 14px;
              height: 32px;
              font-size: 14px;
              line-height: 32px;
              padding: 0 12px;
              color: $--color-white;
            }
          }
          p {
            cursor: pointer;
            padding-left: 40px;
            line-height: 32px;
            font-size: $--font-size-small;
            color:$--color-text-regular;
            &:hover {
              color: $--color-white;
              background: rgba(245, 246, 247, 0.1);
            }
          }
        }
        .active {
            color: $--color-primary !important;
            span {
                color: $--color-primary !important;
            }
        }
        .active:hover {
            color: $--color-white;
            background: rgba(245, 246, 247, 0.1);
        }
    }
</style>
