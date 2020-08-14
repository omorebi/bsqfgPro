import Vue from 'vue'
import Router from 'vue-router'
import RouterCommon from './common' // 引入通用模块

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})

Vue.use(Router)

const router = new Router({
    routes: [
        ...RouterCommon,
        {
            path: '/venue_introduction',
            name: 'venue_introduction',
            component: resolve => require(['@/pages/venue_introduction'], resolve),
            meta: {
                title: '博物馆简介',
                keepAlive: false
            }
        },
        {
            path: '/visitNotes',
            name: 'visitNotes',
            component: resolve => require(['@/pages/visitNotes'], resolve),
            meta: {
                title: '参观须知',
                keepAlive: false
            }
        },
        {
            path: '/posInfo',
            name: 'posInfo',
            component: resolve => require(['@/pages/posInfo'], resolve),
            meta: {
                title: '位置信息',
                keepAlive: false
            }
        },
        {
            path: '/explainingAppointment',
            name: 'explainingAppointment',
            component: resolve => require(['@/pages/explainingAppointment'], resolve),
            meta: {
                title: '讲解预约',
                keepAlive: false
            }
        },
        {
            path: '/volunteer',
            name: 'volunteer',
            component: resolve => require(['@/pages/volunteer'], resolve),
            meta: {
                title: '志愿者',
                keepAlive: false
            }
        },
        {
            path: '/news',
            name: 'news',
            component: resolve => require(['@/pages/news'], resolve),
            meta: {
                title: '社教活动',
                keepAlive: false
            }
        },
        {
            path: '/news_detail/:id',
            name: 'news_detail',
            component: resolve => require(['@/pages/newsDetail'], resolve),
            meta: {
                title: '活动详情',
                keepAlive: false
            }
        },
        // {
        //     path: '/scenic',
        //     name: 'scenic',
        //     component: resolve => require(['@/pages/scenic'], resolve),
        //     meta: {
        //         title: '景点介绍',
        //         keepAlive: false
        //     }
        // },
        // {
        //     path: '/scenic_detail/:id',
        //     name: 'scenic_detail',
        //     component: resolve => require(['@/pages/scenicDetail'], resolve),
        //     meta: {
        //         title: '景点介绍',
        //         keepAlive: false
        //     }
        // },
        {
            path: '/guided',
            name: 'guided',
            component: resolve => require(['@/pages/guided'], resolve),
            meta: {
                title: '地图导览',
                keepAlive: false
            }
        },
        // {
        //     path: '/traffic',
        //     name: 'traffic',
        //     component: resolve => require(['@/pages/traffic'], resolve),
        //     meta: {
        //         title: '交通指南',
        //         keepAlive: false
        //     }
        // },
        {
            path: '/myscan',
            name: 'myscan',
            component: resolve => require(['@/pages/myscan'], resolve),
            meta: {
                title: '扫一扫',
                keepAlive: false
            }
        },
        {
            path: '/exhibitionList',
            name: 'exhibitionList',
            component: resolve => require(['@/pages/exhibitionList'], resolve),
            meta: {
                title: '基本陈列'
            }
        },
        {
            path: '/basics/list/:exhibition_id',
            name: 'base',
            component: resolve => require(['@/pages/list'], resolve),
            meta: {
                title: '语音导览',
                keepAlive: true,
                isBack: true
            }
        },
        {
            path: '/exhibit/detail/:exhibit_id',
            name: 'exhibitdetail',
            component: resolve => require(['@/pages/info.vue'], resolve),
            meta: {
                //   title: '展品详情'
            }
        },
        {
            path: '/exhibition/detail/:exhibition_id',
            name: 'exhibitiondetail',
            component: resolve => require(['@/pages/exhibition.vue'], resolve),
            meta: {
                //   title: '展品详情'
            }
        },
        // {
        //     path: '/basics/search/:exhibition_id',
        //     name: 'search',
        //     component: resolve => require(['@/pages/search.vue'], resolve),
        //     meta: {
        //       title: '东湖旅店'
        //     }
        // },
        {
            path: '/messageBoard',
            name: 'messageBoard',
            component: resolve => require(['@/pages/messageBoard.vue'], resolve),
            meta: {
                title: '留言板',
                needLogin: true
            }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    },
})

const cancelLastReq = (next) => {
    let axiosPromiseArr = window.__axiosPromiseArr || []
    if (!!axiosPromiseArr && axiosPromiseArr.length) {
        // console.log(axiosPromiseArr)
        let len = axiosPromiseArr.length
        while (len--) {
            axiosPromiseArr[len].cancel('cancel')
            axiosPromiseArr.splice(len, 1)
        }
    }
    next()
}

/**
 * 获取token
 */
const getCookie = cname => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * 微信环境判断
 */
const isWxEnv = () => {
    let ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == "micromessenger";
};

router.beforeEach((to, from, next) => {
    if (to.meta.needLogin && !getCookie('api_token') && process.env.NODE_ENV == 'production') {// && process.env.NODE_ENV == 'production'
        if (!isWxEnv()) {
            alert('请在微信环境下使用')
        } else {
            location.href = "/wx_oauth?vue_url=" + window.location.hash.replace('#', '')
        }
    } else {
        NProgress.start()
        cancelLastReq(next)
    }




})

router.afterEach((to, from) => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done()
})

export default router