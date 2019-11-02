<template>
    <div>
        <p></p>
    </div>
</template>
<script>
import mgr from "@/services/authentication/oidcService";
import store from "@/store/index";
export default {
    async created() {
        try {
            var result = await mgr.signinRedirectCallback();

            var returnToUrl = "/";
            if (result.state !== undefined) {
                returnToUrl = result.state;
            }
            await store.dispatch("_set", result)
            window.location = window.location.origin + returnToUrl;
        } catch (e) {
            console.log(e,'errrrrr')
        }
    }
};
</script>

