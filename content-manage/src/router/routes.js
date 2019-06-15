import imgManage from "../views/img-manage";

// 默认访问的路由
export const defaultRoutes = [
  {
    path: "/",
    name: "image",
    component: imgManage
    
  },
  {
    path: "/article",
    name: "article",
    component:  () => import('@/views/article-manage.vue')
  },
  {
    path: "/image",
    name: "article",
    component:  () => import('@/views/img-manage.vue')
  },
  {
    path: "/file",
    name: "article",
    component:  () => import('@/views/file-manage.vue')
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
  
];
