//import Home from "../views/Home";

// content :  内容管理  （文章管理 产品管理  图片管理 ）


// dashboard : 网站管理 小程序  控制台首页 微信公众号  系统设置(角色管理)  回收站  

// form 表单管理 




// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    redirect: { path: '/board' },
    component: () => import('@/views/board/index.vue'),
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
    path: "/website",
    name: "website",
    component: website,
    meta: {
      title: "网站管理",
      requiresAuth: true,
      requiresRole: {},
    }
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
    redirect: { path: '/system/role' },
    component: () => import("@/views/member-manage.vue"),
    children: [
      {
        path: "/role",
        name: "role",
        component: () => import("@/views/member-manage.vue"),
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
      requiresAuth: true,
      requiresRole: {},
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

import website from '@/views/website-manage/website.vue';
// 有权限才可访问的路由
export const authRoutes = [

];
