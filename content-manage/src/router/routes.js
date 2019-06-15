//import imgManage from "../views/img-manage";

// 默认访问的路由
export const defaultRoutes = [

  {
    path: "/",
    redirect:{path:'/image'},
    component: ()=>import('@/components/index.vue'),
    children:[
      {
        path: "/article",
        name: "article",
        component:  () => import('@/views/content-manage/article-manage.vue')
      },
      {
        path: "/image",
        name: "image",
        component:  () => import('@/views/content-manage/img-manage.vue')
      },
      {
        path: "/file",
        name: "file",
        component:  () => import('@/views/content-manage/file-manage.vue')
      },
      {
        path: "/product",
        name: "product",
        component:  () => import('@/views/content-manage/product-manage.vue')
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
    path: "/product",
    name: "product",
    component:  () => import('@/views/product-manage.vue')
  },
  {
    path: "/test",
    name: "test",
    component:  () => import('@/views/test.vue')
  },
  
    path:'*',
    component:()=>import('@/views/error-page/404.vue')
  } 
];
