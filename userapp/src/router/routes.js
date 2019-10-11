//import Home from "../views/Home";

// content :  内容管理  （文章管理 产品管理  图片管理 ）


// dashboard : 网站管理 小程序  控制台首页 微信公众号  系统设置(角色管理)  回收站  

// form 表单管理 




// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    redirect: { path: '/board' },
  },
  {
    path: "/board",
    name: 'board',
    component: () => import('@/views/board/index.vue'),
    meta: {
      title: "控制台首页",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/news",
    name: 'board',
    component: () => import('@/views/board/index.vue'),
    meta: {
      title: "控制台首页",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/website",
    name: "website",
    component: () => import('@/views/website-manage/index.vue'),
    meta: {
      title: "网站管理",
      requiresAuth: true,
      requiresRole: {},
      isSub:true
    },
    children: [
      {
        path: "selectTemplate",
        name: "selectTemplate",
        component: () => import("@/views/website-manage/selectTemplate.vue"),
        meta: {
          title: "选择模版",
          isSub:true
        }
      },
      {
        path: "backup",
        name: "backup",
        component: () => import("@/views/website-manage/websiteBackup.vue"),
        meta: {
          title: "网站备份",
          requiresAuth: true,
          isSub:true
        }
      },
      {
        path: "mySite",
        name: "mySite",
        component: () => import("@/views/website-manage/mySite.vue"),
        meta: {
          title: "我的网站",
          requiresAuth: true,
          isSub:true
        }
      },
      {
        path: "companyInfo",
        name: "companyInfo",
        component: () => import("@/views/website-manage/companyInfo.vue"),
        meta: {
          title: "公司信息",
          requiresAuth: true,
          isSub:true
        }
      },
      {
        path: "siteDomain",
        name: "siteDomain",
        component: () => import("@/views/website-manage/siteDomain.vue"),
        meta: {
          title: "域名管理",
          requiresAuth: true,
          isSub:true
        }
      },
      {
        path: "email",
        name: "email",
        component: () => import("@/views/website-manage/mailServer.vue"),
        meta: {
          title: "邮件服务器",
          requiresAuth: true,
          isSub:true
        }
      },
      {
        path: "sitevalidation",
        name: "sitevalidation",
        component: () => import("@/views/siteVerify.vue"),
        meta: {
          title: "站点验证",
          isSub:true
        }
      },
      {
        path: "robots",
        name: "robots",
        component: () => import("@/views/website-manage/robots.vue"),
        meta: {
          title: "Robots.txt",
          isSub:true
        }
      },
      {
        path: "sitemap",
        name: "sitemap",
        component: () => import("@/views/website-manage/sitemap.vue"),
        meta: {
          title: "站点地图",
          isSub:true
        }
      }
    ]
  },
  {
    path: "/wechat",
    name: 'wechat',
    component: () => import('@/views/wechat/wechat.vue'),
    meta: {
      title: "微信公众号",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/form",
    name: "form",
    component: () => import('@/views/form/index.vue'),
    meta: {
      title: "表单管理",
      requiresAuth: true,
      requiresRole: {},
    }
  },
  {
    path: "/system",
    name: 'system',
    component: () => import("@/views/system/system.vue"),
    meta: {
      title: "系统设置",
      requiresAuth: true,
      requiresRole: {},

    },
    children: [
      {
        path: "role",
        name: "role",
        component: () => import("@/views/member-manage.vue"),
        meta: {
          title: "成员管理",
          requiresAuth: true,
          requiresRole: {},
          isSub:true
        }
      },
    ]
  },

  {
    path: "/recycle",
    name: "recycle",
    component: () => import("@/views/recycle/index"),
    meta: {
      title: "回收站",
      requiresAuth: true,
      requiresRole: {},
    }
  },

  {
    path: "/personal",
    name: "personal",
    component: () => import("@/views/personal.vue"),
    meta: {
      title: "个人中心",
     
      requiresRole: {},
    }
  },
  {
    path: "/callback",
    name: "callback",
    component: () => import("@/views/login/signcallback.vue"),
    meta: {
      title: "微站",
      requiresAuth: true,
    }
  },
  {
    path: "/signout-callback-oidc",
    name: "signout-callback-oidc",
    component: () => import("@/views/login/signout-callback-oidc.vue"),
    // meta: {
    //     requiresAuth: true,
    // }
},
  {
    path: "/init",
    name: "init",
    component: () => import("@/views/login/init.vue"),
    meta: {
      title: "微站",
      
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: '无权限访问',
      isSub: false,
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    name: '404',
    meta: {
      title: '页面找不到',
      isSub: false,
    }
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
    path: '*',
    component: () => import('@/views/error-page/404.vue')
  }


];


// 有权限才可访问的路由
export const authRoutes = [

];
