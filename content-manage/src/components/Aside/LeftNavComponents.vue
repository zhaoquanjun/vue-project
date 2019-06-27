<template>
  <el-aside>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" >
      <el-menu-item v-for="(item,index) in menuList.children" :key="index" :index="item.menuUrl.split('/')[1]" @click="handlerRoute(item)">
        <span>{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  props: ["menuList"],
  data(){
    return {
      curWebsite:"dashboard.console.wezhan.cn"
    }
  },
  mounted() {
   
  },
  methods: {
    // async skipPage(it) {
    //   let { data, status } = await checkHasRootSkip({url: it.menuUrl});
    //   if (status == 200) {
    //     let path = it.menuUrl.split('/')[1]
    //     this.$router.push(`${path}`)
    //   }
    // }
    handlerRoute(item){
      let host = window.location.host; // 表示当前接口返回的url => item.menuUrl.split('/')[1]
      // dashboard.console.wezhan.cn
      //host === "localhost:8082"
       let [a,b]= item.menuUrl.split('/')
      if(this.curWebsite == a){
        this.$router.push(item.path)
      }else{
           window.location.href ='//'+ item.menuUrl
      }
     
    }
  }
};
</script>

