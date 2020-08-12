/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * imgBaseUrl: 图片所在域名地址
 */

let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://hdwx.museum-edu.cn/'
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://hdwx.museum-edu.cn/'
}

export {
    baseUrl
}