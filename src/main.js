// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'lib-flexible'
import '@/style/reset.scss'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import VueWechatTitle from 'vue-wechat-title'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Toast from '@/components/toast'
import Error from '@/components/error'

import VueLazyload from 'vue-lazyload'
import axios from 'axios'
import moment from 'moment'
import 'leaflet/dist/leaflet.css'


import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)


require('./assets/js/jquery.js')
Vue.prototype.axios = axios
Vue.prototype.$moment = moment
Vue.prototype.isLogin = function (options) {
    window.location.href = 'http://cfbwg.museum-edu.cn/wx_oauth?vue_url=' + options



    
}
Vue.use(VueWechatTitle)
Vue.use(Toast)
Vue.use(Error)
Vue.use(iView)
Vue.use(VueAwesomeSwiper)
// import Vconsole from 'Vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole,{
//     color: '#000000'
// })

// 添加VueLazyload 选项
Vue.use(VueLazyload, {
    preLoad: 1.3,
    loading: require('./assets/images/loading-bars.svg'),
    attempt: 1
})
import store from './store';



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
