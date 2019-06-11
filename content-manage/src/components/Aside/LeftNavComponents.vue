<template>  
      <el-aside>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
          <el-menu-item :index='item.id'  v-for="(item,index) in navList" :key="index">           
            <span>{{item.name}}</span>
          </el-menu-item>         
        </el-menu>
      </el-aside>
</template>
<script>
export default {
    props:["navList"]
}
</script>

