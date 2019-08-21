<template>
  <div>
    <p></p>
  </div>
</template>
<script>
import mgr from '@/services/authentication/oidcService'
import {clearAllCookie} from "@/libs/local.js"
export default {
  async created() {   
    try {
      clearAllCookie()
      var result = await mgr.signinRedirectCallback();
      var returnToUrl = '/'
      if (result.state !== undefined) { returnToUrl = result.state }
      window.location = returnToUrl
    } catch (e) {
      window.location = '/401'
    }
  }
}
</script>

