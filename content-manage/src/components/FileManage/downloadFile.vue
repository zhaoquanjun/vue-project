<template>
    <div>123</div>
</template>
<script>
import {download} from "@/api/request/fileManageApi";

export default {
    mounted(){
        let query;
        this._download()
    },
    methods:{
          async _download(row){
            let option ={
                id:row.id,
                type:"File",
                appId:this.$store.state.dashboard.appId
            };
             let { data } = await videoManageApi.download(option);
              var a = document.createElement("a");
            var binaryData = [];
            binaryData.push(data);
            a.href = window.URL.createObjectURL(
              new Blob(binaryData, { type: "application/dat" })
            );
            // var names = row.fileName.split("_");
            // var filename =row.siteName + "_" + names[1] + "_" + names[2];
            a.download = "123"; // Set the file name.
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
    }
};
</script>
<style scoped>
</style>
