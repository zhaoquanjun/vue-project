//import Home from "../views/Home";

// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    redirect:{path:'/memberManage'},
    component: ()=>import('@/components/index.vue'),
    children:[
      {
        path: "/memberManage",
        name: "memberManage",
        component:  () => import("@/views/member-manage.vue")
      },
      {
        path: "/personal",
        name: "personal",
        component: () => import("@/views/personal.vue")
      },
    ]
  },
  
  {
    path: "/callback",
    name: "callback",
    component: () => import("@/views/login/signcallback.vue")
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    name: '401',
   
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    name: '404',
    
  },
  {
    path:'*',
    component:()=>import('@/views/error-page/404.vue')
  } 
  
  
];

// 有权限才可访问的路由
export const authRoutes = [

];
