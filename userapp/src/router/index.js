import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'; // 存放映射表的

Vue.use(VueRouter); 


export default new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});