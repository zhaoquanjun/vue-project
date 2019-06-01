import Home from "../views/Home";

// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/personal",
    name: "personal",
    component: () => import("@/components/personal/index.vue")
  },
  {
    path: "/callback",
    name: "callback",
    component: () => import("@/views/login/signcallback.vue")
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
];

// 有权限才可访问的路由
export const authRoutes = [

];
