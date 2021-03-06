

// 默认访问的路由
export const defaultRoutes = [

    {
        path: "/",
        redirect: { path: '/template/sitetemplate' },
    },
    {
        path: "/template",
        redirect: { path: '/template/sitetemplate' },
    },
    {
        path: "/template",
        component: () => import('@/views/template-manage/index.vue'),
        children: [
            {
                path: "sitetemplate",
                name: "sitetemplate",
                component: () => import('@/views/template-manage/template-manage.vue'),
                meta: {
                    requiresAuth: true,
                    title: "整站模板",
                    isSub: true
                },
            },
            {
                path: "controlmanege/combinedcontrol",
                name: "controlmanege/combinedcontrol",
                component: () => import('@/views/template-manage/controlTemplate.vue'),
                meta: {
                    requiresAuth: true,
                    title: "组合控件",
                    isSub: true
                },
            },
            {
                path: "controlmanege/composeManage",
                name: "controlmanege/composeManage",
                component: () => import('@/views/template-manage/controlManage.vue'),
                meta: {
                    requiresAuth: false,
                    title: "控件管理",
                    isSub: true
                },
            },
            {
                path: "controlmanege/normalcontrol",
                name: "controlmanege/normalcontrol",
                component: () => import('@/views/template-manage/normalControl.vue'),
                meta: {
                    requiresAuth: true,
                    title: "普通控件",
                    isSub: true
                },
            },
            {
                path: "controlmanege/controlcategory",
                name: "controlmanege/controlcategory",
                component: () => import('@/views/template-manage/controlCategory.vue'),
                meta: {
                    requiresAuth: true,
                    title: "控件分类",
                    isSub: true
                },
            },
            // {
            //     path: "product",
            //     name: "product",
            //     component: () => import('@/views/content-manage/product-manage.vue'),
            //     meta: { requiresAuth: true, title: "产品管理", isSub: true }
            // },
        ]
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
        meta: {
            title: "微站",
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
        path: '*',
        component: () => import('@/views/error-page/404.vue')
    }
];

export const authRoutes = []

