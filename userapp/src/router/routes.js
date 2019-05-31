
import Home from "../views/Home";

export default [
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
    path: "/signcallback",
    name: "signcallback",
    component: () => import("@/views/login/signcallback.vue")
  },
  {
    path: "/callback",
    name: "signcallback",
    component: () => import("@/views/login/signcallback.vue")
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
];

