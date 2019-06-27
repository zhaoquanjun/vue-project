

// 默认访问的路由
export const defaultRoutes = [

  {
    path: "/",
    redirect:{path:'/picture'},
    component: ()=>import('@/components/index.vue'),
    children:[
      {
        path: "news",
        name: "news",
        component:  () => import('@/views/content-manage/article-manage.vue'),
        meta:{
          requiresAuth: true,
          title:"文章管理",
          isSub:true
        },
      
      },
      {
        path: 'create',
        name: "articlecreate",
        component: () => import('@/components/ArticleManage/ContentDetail.vue'),
        meta:{
          requiresAuth: true,
          title:"新增文章"}

      },
     
      {
        path: "picture",
        name: "picture",
        component:  () => import('@/views/content-manage/img-manage.vue'),
        meta:{requiresAuth: true,title:"图片管理",isSub:true}
      },
      {
        path: "file",
        name: "file",
        component:  () => import('@/views/content-manage/file-manage.vue')
      },
      {
        path: "product",
        name: "product",
        component:  () => import('@/views/content-manage/product-manage.vue'),
        meta:{requiresAuth: true,title:"产品管理",isSub:true}
      },
      {
        path: 'createProduct',
        name: "createProduct",
        component: () => import('@/components/ProductManage/ContentDetail.vue'),
        meta:{requiresAuth: true,title:"新增产品"}
      },
      {
        path: "content",
        name: "content",
        component:  () => import('@/views/content-manage/content-manage.vue'),
        meta:{requiresAuth: true,title:"内容管理",isSub:true}
      },
    ]
  },
  {
    path: "/callback",
    name: "callback",
    component: () => import("@/views/login/signcallback.vue"),
    meta: {
      requiresAuth: true,
    }
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
    path: '/500',
    component: () => import('@/views/error-page/500.vue'),
    name: '500',
    meta: {
      title: '服务器错误',
      isSub: false,
    }
  },
  {
    path:'*',
    component:()=>import('@/views/error-page/404.vue')
  } 
];

export const authRoutes=[
  {
    path: "/content",
    name: 'content',
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "控制台首页",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/board",
    name: 'board',
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "控制台首页",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/news",
    name: 'board',
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "控制台首页",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/website",
    name: "website",
    component: () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "网站管理",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/wechat",
    name: 'wechat',
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "微信公众号",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/form",
    name: "form",
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "表单管理",
      requiresAuth: true,
      requiresRole: {},
    }
  },
   {
    path: "/system",
    name: 'system',
    redirect: { path: '/system/role' },
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    children: [
      {
        path: "role",
        name: "role",
        component: () => () => import('@/views/content-manage/article-manage.vue'),
        meta: {
          title: "",
          requiresAuth: true,
          requiresRole: {},
        }
      },
    ]
  },
  {
    path: "/recycle",
    name: "recycle",
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "回收站",
      requiresAuth: true,
      requiresRole: {},
    }
  },

  {
    path: "/personal",
    name: "personal",
    component: () => () => import('@/views/content-manage/article-manage.vue'),
    meta: {
      title: "个人中心",
     
      requiresRole: {},
    }
  },
 
]