<template>
  <div>
    <p></p>
  </div>
</template>
<script>
import mgr from '@/services/authentication/oidcService'

export default {
  async created() {   
    try {
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

