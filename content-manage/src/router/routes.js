import ContentDetail from "@/components/ArticleManage/ContentDetail.vue";

// 默认访问的路由
export const defaultRoutes = [

  {
    path: "/",
    redirect:{path:'/image'},
    component: ()=>import('@/components/index.vue'),
    children:[
      {
        path: "article",
        name: "article",
        component:  () => import('@/views/content-manage/article-manage.vue'),
        meta:{title:"文章管理",isSub:true},
      
      },
      {
        path: 'create',
        name: "articlecreate",
        component: () => import('@/components/ArticleManage/ContentDetail.vue'),
        meta:{title:"新增文章"}
      },
     
      {
        path: "/image",
        name: "image",
        component:  () => import('@/views/content-manage/img-manage.vue'),
        meta:{title:"图片管理",isSub:true}
      },
      {
        path: "/file",
        name: "file",
        component:  () => import('@/views/content-manage/file-manage.vue')
      },
      {
        path: "/product",
        name: "product",
        component:  () => import('@/views/content-manage/product-manage.vue'),
        meta:{title:"产品管理",isSub:true}
      },
      {
        path: 'createProduct',
        name: "createProduct",
        component: () => import('@/components/ProductManage/ContentDetail.vue'),
        meta:{title:"新增产品"}
      },
      {
        path: "/content",
        name: "content",
        component:  () => import('@/views/content-manage/content-manage.vue'),
        meta:{title:"内容管理",isSub:true}
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

