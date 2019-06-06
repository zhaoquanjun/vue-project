<template>
    <div class="submenu">
        <h4 class="submenu-title"><slot name="title"></slot></h4>
        <ul class="submenu-list">
            <li v-for="(item,index) in submenuList" :key="index">{{item.name}}</li>
           
        </ul>
    </div>
</template>
<script>
export default {
    props:{
        submenuList:{
            type:Array,
            default:() =>([
                 {name:"企业信息",url:'enterprise'},
                {name:"显示设置",url:'url'},
                {name:'成员列表',url:'url'}
            ])
        }
    }
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
                background: #e5f8fa;
            }
        }
    }
}
</style>

