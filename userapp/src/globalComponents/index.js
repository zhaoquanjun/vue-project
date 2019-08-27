import Loading from "@/base/loading"

function plugin(Vue){
    if(plugin.installed) return;
    Vue.component("Loading",Loading)
}
export default plugin