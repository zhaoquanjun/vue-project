<template>
    <div>
       {{value}}<br>
       <input v-model="value"/><br>
       <span v-html="value2"></span><br>
       <span v-text="value2"></span><br>
       
       <div>
           <span v-if="false">显示</span>
           <span v-else-if="flag">xxx</span>
           <span v-else>隐藏</span>
       </div>
      <div>
          v-show

        <span v-show="true">show-------</span>

      </div>

<br><br>
      <ul>
          <li @click="handleClick(item)"  v-for="(item,index) in list" :key="index">{{item.name}} ---- {{index}}

               <button @click="handleClick(item)">点击</button>
          </li>
      </ul>

   <div>
       {{aa}}
   </div>
    </div>
   
</template>
<script>
import { setTimeout } from 'timers';
export default {
   data(){
       return {
           value:"shhhdhdh",
           value2:'<a>{{value}}</a>',
           flag:true,
           list:[]
       }
   },
   beforeCreate(){
       console.log("beforeCreate")
   },
   created(){
      console.log(this.list) 
     console.log("created")
     //this.handleClick(123)
   },
   beforeMount(){
        console.log("beforeMount")
   },
   mounted(){
       this.handleClick("接口调用")
       console.log("mounted")
   },
   beforeUpdate(){
       console.log("beforeUpdate")
   },
   updated(){
        console.log("updated")
   },
   beforeDestroy(){},
   destroyed(){},
   methods:{
       handleClick(value){
           setTimeout(()=>{
               this.list = [
               {name:"xuzhuan",age:18},
               {name:"chenglin",age:28},
               {name:"litao",age:38},
               ]
               console.log(value)
           },5000)
       }
   },
   computed:{
       aa:{
          get(){
               return 123
          },
          set(){
              
          }
       }
   }

}
</script>

