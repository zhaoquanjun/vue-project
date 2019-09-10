<template>
    <div>
        <p></p>
    </div>
</template>
<script>
import { clearAllCookie } from "@/libs/local.js";

export default {
    created() {
          this.$store.commit("reset_store");
          this.$store.state.user.accessToken.Authorization = ""
          clearAllCookie();
           this.$router.push({
              path:"/board"
          })
    }
}
</script>