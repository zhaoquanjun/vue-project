

// 默认访问的路由
export const defaultRoutes = [
    {
        path: "/",
        redirect: { path: '/content/news' },
    },
    
    {
        path: "/news",
        redirect: { path: '/content/news' },
    },
    {
        path: "/news/create",
        redirect: { path: '/content/createarticle' },
    },
    {
        path: "/picture",
        redirect: { path: '/content/picture' },
    },
    {
        path: "/product",
        redirect: { path: '/content/product' },
    },
    {
        path: "/file",
        redirect: { path: '/content/file' },
    },
    {
        path: "/video",
        redirect: { path: '/content/video' },
    },
    {
        path: "/audio",
        redirect: { path: '/content/audio' },
    },
    {
        path: "/product/create",
        redirect: { path: '/content/createProduct' },
    },
    {
        path: "/content",
        component: () => import('@/views/content-manage/content.vue'),
        children: [
            {
                path: "news",
                name: "news",
                component: () => import('@/views/content-manage/article-manage.vue'),
                meta: {
                    requiresAuth: true,
                    title: "文章管理",
                    isSub: true
                },

            },
            {
                path: 'createarticle',
                name: "createarticle",
                component: () => import('@/components/ArticleManage/ContentDetail.vue'),
                meta: {
                    title: "新增文章"
                }
            },

            {
                path: "picture",
                name: "picture",
                component: () => import('@/views/content-manage/img-manage.vue'),
                meta: { requiresAuth: true, title: "图片管理", isSub: true }
            },
            {
                path: "file",
                name: "file",
                component: () => import('@/views/content-manage/file-manage.vue'),
                meta: {
                    requiresAuth: true,
                    title: "文件管理",
                    isSub: true
                },
            },
            {
                path: "download",
                name: "download",
                component: () => import('@/components/FileManage/downloadFile.vue'),
                meta: {
                    title: "下载文件",
                },
            },
            {
                path: "video",
                name: "video",
                component: () => import('@/views/content-manage/video-manage.vue'),
                meta: {
                    // requiresAuth: true,
                    title: "视频管理",
                    isSub: true
                },
            },
            {
                path: "audio",
                name: "audio",
                component: () => import('@/views/content-manage/audio-manage.vue'),
                meta: {
                    // requiresAuth: true,
                    title: "音频管理",
                    isSub: true
                },
            },
            {
                path: "product",
                name: "product",
                component: () => import('@/views/content-manage/product-manage.vue'),
                meta: { requiresAuth: true, title: "产品管理", isSub: true },
                children: [

                ]
            },
            {
                path: 'createProduct',
                name: "createProduct",
                component: () => import('@/components/ProductManage/ContentDetail.vue'),
                meta: { title: "新增产品" }
            },
            {
                path: "content",
                name: "content",
                component: () => import('@/views/content-manage/content-manage.vue'),
                meta: { requiresAuth: true, title: "内容管理", isSub: true }
            },
        ]
    },
    {
       path:"/recycle",
       component: () => import('@/views/recycle/content.vue'),
       children:[
        {
            path: "page",
            name: "page",
            component: () => import('@/views/recycle/page.vue'),
            meta: {title: "回收站", isSub: true }
        },
        {
            path: "recyclenews",
            name: "recyclenews",
            component: () => import('@/views/recycle/article.vue'),
            meta: {title: "回收站", isSub: true,requiresAuth: true, }
        },
        {
            path: "recycleproduct",
            name: "recycleproduct",
            component: () => import('@/views/recycle/product.vue'),
            meta: {title: "回收站", isSub: true,requiresAuth: true, }
        },
        {
            path: "recyclepicture",
            name: "recyclepicture",
            component: () => import('@/views/recycle/picture.vue'),
            meta: {title: "回收站", isSub: true,requiresAuth: true, }
        },
        {
            path: "recyclefile",
            name: "recyclefile",
            component: () => import('@/views/recycle/file.vue'),
            meta: {title: "回收站", isSub: true,requiresAuth: true, }
        },
        {
            path: "recyclevideo",
            name: "recyclevideo",
            component: () => import('@/views/recycle/video.vue'),
            meta: {title: "回收站", isSub: true ,requiresAuth: true,}
        },
        {
            path: "recycleaudio",
            name: "recycleaudio",
            component: () => import('@/views/recycle/audio.vue'),
            meta: {title: "回收站", isSub: true ,requiresAuth: true,}
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
        path: "/signout-callback-oidc",
        name: "signout-callback-oidc",
        component: () => import("@/views/login/signout-callback-oidc.vue"),
        // meta: {
        //     requiresAuth: true,
        // }
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
        path: '*',
        component: () => import('@/views/error-page/404.vue')
    },
   
];


