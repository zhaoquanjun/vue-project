<template>
    <div>
        <p></p>
    </div>
</template>
<script>
import { clearAllCookie } from "@/libs/local.js";
alert(1)
export default {
    created() {
          alert(1)  
          this.$router.push({
              path:"/board"
          })
          console.log(this)
          clearAllCookie();
    }
}
</script>