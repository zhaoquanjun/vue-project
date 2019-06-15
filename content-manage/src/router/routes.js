import imgManage from "../views/img-manage";

// 默认访问的路由
export const defaultRoutes = [

  {
    path: "/",
    redirect:{path:'/image'},
    children:[
      {
        path: "/article",
        name: "article",
        component:  () => import('@/views/article-manage.vue')
      },
      {
        path: "/image",
        name: "image",
        component:  () => import('@/views/img-manage.vue')
      },
      {
        path: "/file",
        name: "file",
        component:  () => import('@/views/file-manage.vue')
      },
      {
        path: "/product",
        name: "product",
        component:  () => import('@/views/product-manage.vue')
      },
    ]
  },
  
  {
    path:"/error",
    component: () => import('@/views/error-page/404.vue'),
    children:[
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: '401',
       
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: '404',
        
      }
    ]
  },
  {
    path:'*',
    component:()=>import('@/views/error-page/404.vue')
  } 
];
