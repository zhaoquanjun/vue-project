<template>
  <div></div>
</template>
<script>
import { transit } from "@/api/request/account.js";
import { notify } from "@/utlis/index.js";
export default {
  created() {
    this._appendSpace();
    let param = this.$route.query;
    let str = '';
    for (var k in param) {
      str += `${k}=${param[k]}&`;
    }
    str = str.slice(0, str.length - 1)
    this._transitPage(str);
  },
  methods: {
    async _transitPage(str) {
      let  {data, status}  = await transit(str);
      if (status == 200) {
        notify(this, data, "success");
      } else {
        notify(this, data, "error");
      }
      
      setTimeout(function (){
        window.close();
      }, 3000)
    },
    _appendSpace() {
      var oDiv = document.createElement("div");
      oDiv.style.cssText =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 1000; display: flex; justify-content: center;align-items: center;";
      document.getElementById('app').appendChild(oDiv);
    }
  }
};
</script>