<template>
   <div>
        {{loginData}}
   </div>
</template>
<script>
import * as ajaxRequest from "@/api/ajaxRequest";
export default {
   data(){
       return {
       loginData:null
       }
   },

   methods:{
      postLogin(){
        let params = {
            provider:  "Weixin",
            returnUrl: ""
         };
        var data=  ajaxRequest.post('http://www.baidu.com',params);
        this.loginData = data;
        alert(data);
      }
   }
}
postLogin();
</script>

