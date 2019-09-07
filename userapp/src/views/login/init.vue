<template>
    <div>
        <p></p>
    </div>
</template>
<script>
import { clearAllCookie } from "@/libs/local.js";

export default {
    created() {
          this.$router.push({
              path:"/board"
          })
          this.$store.commit("reset_store");
          this.$store.state.user.accessToken.Authorization = ""
          clearAllCookie();
    }
}
</script>