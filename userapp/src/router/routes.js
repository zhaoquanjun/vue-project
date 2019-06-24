//import Home from "../views/Home";

// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    redirect:{path:'/board'},
    //component: ()=>import('@/views/index.vue'),
  },
  {
    path: "/board",
    component: ()=>import('@/views/index.vue'),
    meta: {
      title:"控制台首页",
      requiresAuth: true,
      requiresRole:{},
    }
  },
  {
    path: "/memberManage",
    name: "memberManage",
    component: () => import("@/views/member-manage.vue"),
    meta: {
      title:"",
      requiresAuth: true,
      requiresRole:{},
    }
  },
  {
    path: "/personal",
    name: "personal",
    component: () => import("@/views/personal.vue"),
    meta: {
      title:"个人中心",
      requiresAuth: true,
      requiresRole:{},
    }
  },
  {
    path: "/recycle",
    name: "recycle",
    component: () => import("@/views/personal.vue"),
    meta: {
      title:"回收站",
      requiresAuth: true,
      requiresRole:{},
    }
  },
  {
    path: "/callback",
    name: "callback",
    component: () => import("@/views/login/signcallback.vue"),
    meta: {
      
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-page/403.vue'),
    meta:{
      title:'无权限访问',
      isSub:false,
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    name: '404',
    meta:{
      title:'页面找不到',
      isSub:false,
    }
  },
  {
    path: '/500',
    component: () => import('@/views/error-page/500.vue'),
    name: '500',
    meta:{
      title:'服务器错误',
      isSub:false,
    }
  },
  {
    path:'*',
    component:()=>import('@/views/error-page/404.vue')
  } 
  
  
];

// 有权限才可访问的路由
export const authRoutes = [

];
