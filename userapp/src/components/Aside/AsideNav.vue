<template>
  <el-aside
    class="m-asideright"
    :style="{width:width1+'px',transition: 'width ' +time+ ' linear',backgroundColor:'#fff'}"
    :class="{'active':flag==1}"
  >
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
      <el-menu-item :index="item.id" v-for="item in menuList" :key="item.id">
        <i class="el-icon-menu"></i>
        <span>控制台</span>
      </el-menu-item>
     
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        {
          name: "控制台",
          id: "1"
        },
         {
          name: "内容管理",
          id: "2"
        },
         {
          name: "网站管理",
          id: "3"
        },
         {
          name: "小程序管理",
          id: "4"
        },
         {
          name: "微信公众号",
          id: "5"
        },
         {
          name: "表单管理",
          id: "6"
        },
         {
          name: "电商会员",
          id: "7"
        },
         {
          name: "系统设置",
          id: "9"
        },
         {
          name: "回收站",
          id: "9"
        },
      ]
    };
  }
};
</script>

