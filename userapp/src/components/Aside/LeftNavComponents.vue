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
import { checkHasRootSkip } from "@/api/index";
export default {
  props: ["menuList"],
  data(){
    return {
      curWebsite:"dashboard.console.wezhan.cn"
    }
  },
  mounted() {
    console.log(this.$router,'00000')
    console.log(window.location.host)
    console.log(this.menuList)
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
      console.log(item,'二级菜单')
      let host = window.location.host; // 表示当前接口返回的url => item.menuUrl.split('/')[1]
      // dashboard.console.wezhan.cn
      //host === "localhost:8082"
       let [a,b]= item.menuUrl.split('/')
       console.log(a,b)
      if(this.curWebsite == a){
        console.log('dashboard',item.path)
        this.$router.push(item.path)
      }else{
           window.location.href ='//'+ item.menuUrl
      }
     
    }
  }
};
</script>

