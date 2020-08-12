import axios from 'axios'
import Qs from 'qs'
import {
    baseUrl
} from '@/config/url.js'
import store from '../store.js'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken
// 配置全局取消数组
window.__axiosPromiseArr = []

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json'
    },
    timeout: 60000
})

instance.interceptors.request.use(function (config) {
    // if (promiseArr[config.url]) {
    //     promiseArr[config.url]('操作取消')
    //     promiseArr[config.url] = cancel
    // } else {
    //     promiseArr[config.url] = cancel
    // }
    return config
}, function (error) {
    return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
    if (response.data.status == 1) {
        return response.data
    } else {
        return response.data
    }
}, function (error) {
    return Promise.reject(error)
})

export default (url = '', data = {}, type = 'GET') => {
    let options = {
        url,
        cancelToken: new CancelToken(c => {
            cancel = c
            window.__axiosPromiseArr.push({ cancel }) // 放入一个全局数组，以便之后在router中统一取消
        })
    }
    let p = 'w'
    let language = 1
    let pid = 65
    if (url == '/api/exhibit_list' || url == '/api/exhibit_info') {//只有展品列表，展品详情有语言切换
        language = data.language
    }
    data = Object.assign(data, {
        language: language,
        p: p,
        pid: pid
    })
    type = type.toUpperCase()
    return new Promise((resolve, reject) => {
        if (type === 'GET') {
            options = Object.assign(options, {
                method: 'get',
                params: data
            })
        } else if (type === 'POST') {
            options = Object.assign(options, {
                method: 'post',
                data: Qs.stringify(data)
            })
        }
        instance(options)
            .then(res => {
                resolve(res)
                return false
            })
    })
}