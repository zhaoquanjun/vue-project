<template>
  <div></div>
</template>
<script>
import { transit } from "@/api/request/account.js";
export default {
  created() {
    let param = this.$route.query;
    let options = {};
    for(var k in param) {
      options[k] = param[k]
    }
    this._transitPage(options)
  },
  methods: {
    async _transitPage() {
      let {data} = await transit();
    }
  }
}
</script>