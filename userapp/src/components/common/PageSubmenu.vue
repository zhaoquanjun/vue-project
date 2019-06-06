<template>
    <div class="submenu">
        <h4 class="submenu-title">内容管理</h4>
        <ul class="submenu-list">
            <li>内容管理</li>
            <li>产品管理</li>
            <li>图片管理</li>
            <li>文件管理</li>
            <li>站点迁移</li>
        </ul>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.submenu {
    .submenu-title {
        height: 40px;
        line-height: 40px;
         padding-left: 12px;
    }
    max-width: 120px;
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

