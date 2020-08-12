export default [
    // 默认页
    {
        path: '/',
        redirect: '/main'

    },
    {
        path: '/main',
        name: 'main',
        component: resolve => require(['@/pages/exhibitionList'], resolve),
        meta: {
            title: '清风馆语音导览'
        }
    },
    // 404
    {
        path: '*',
        name: '404',
        component: resolve => require(['@/components/404'], resolve),
        meta: {
            title: '404'
        }
    }
]
