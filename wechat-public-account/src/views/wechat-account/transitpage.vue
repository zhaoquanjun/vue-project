<template>
  <div></div>
</template>
<script>
import { transit } from "@/api/request/account.js";
export default {
  created() {
    this._appendSpace();
    let param = this.$route.query;
    let options = {};
    for (var k in param) {
      options[k] = param[k];
    }
    console.log(options)
    this._transitPage(options);
  },
  methods: {
    async _transitPage() {
      let { data } = await transit();
      window.close();
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