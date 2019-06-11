<template>
    <div class="submenu">
        <h4 class="submenu-title">
            <slot name="title"></slot>
        </h4>
        <ul class="submenu-list">
            <router-link
                :to="item.url"
                tag="li"
                v-for="(item,index) in submenuList"
                :key="index"
            >{{item.name}}</router-link>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        submenuList: {
            type: Array,
            default: () => [
                { name: "文章管理", url: "/article" },
                { name: "产品管理", url: "/product" },
                { name: "图片管理", url: "/image" },
                { name: "文件管理", url: "/file" }
            ]
        }
    }
};
</script>
<style lang="scss" scoped>
.router-link-active {
    color: #00c1de;
    background: #e5f8fa;
}
.submenu {
    max-width: 120px;
    height: 100vh;
    background: #fff;
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
                background: #e5f8fa;
            }
        }
    }
}
</style>

