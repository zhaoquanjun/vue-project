// 默认访问的路由
export const defaultRoutes = [{
        path: "/",
        redirect: {
            path: '/wechat/custommenu'
        },
    },
    
    {
        path: "/wechat",
        component: () => import('@/views/wechat-account/index.vue'),
        children: [{
                path: "custommenu",
                name: "custommenu",
                component: () => import('@/views/wechat-account/custommenu.vue'),
                meta: {
                    requiresAuth: true,
                    title: "自定义菜单",
                    isSub: true
                }
            },
            {
                path: "autoanswer",
                name: "autoanswer",
                component: () => import('@/views/wechat-account/autoanswer.vue'),
                meta: {
                    requiresAuth: true,
                    title: "自动回复",
                    isSub: true
                }
            },
            {
                path: "wechatspread",
                name: "wechatspread",
                component: () => import('@/views/wechat-account/wechatspread.vue'),
                meta: {
                    requiresAuth: true,
                    title: "推广设置",
                    isSub: true
                }
            },
            {
                path: "accountsetting",
                name: "accountsetting",
                component: () => import('@/views/wechat-account/accountsetting.vue'),
                meta: {
                    requiresAuth: true,
                    title: "账号设置",
                    isSub: true
                }
            },
            {
                path: 'wxauther',
                name: 'wxauther',
                component: () => import('@/views/wechat-account/accountwxauther.vue'),
                meta: {
                    title: "账号授权",
                    isSub: true
                }
            },
            {
                path: 'wxtransit',
                name: 'wxtransit',
                component: () => import('@/views/wechat-account/transitpage.vue'),
                meta: {
                    title: "",
                    isSub: true
                }
            }
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
    }
];