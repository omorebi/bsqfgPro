import req from './api.js'




/**
 * @return  博物馆场馆介绍
 */
export const museumInfo = () => req('/api/museum/info', {

})
/**
 * @return  参观须知
 */
export const introductionGuide = () => req('/api/museum/guide', {

})
/**
 * @return  讲解预约
 */
export const explainInfo = () => req('/api/explain_info', {

})
/**
 * @return  讲解预约
 */
export const volunteerInfo = () => req('/api/museum/volunteer', {

})


/**
 * @return  博物馆场馆介绍
 */
export const topList = () => req('/api/top_list', {

})
/**
 * @return  最新资讯顶部推荐列表

 */
export const newsTopRecommend = (data) => req('/api/top_article_list', data)
/**
 * @return  热门资讯列表
 */
export const newsList = (data) => req('/api/article_list', data)

/**
 * @return  资讯详情
 */
export const newsInfo = (data) => req('/api/article_detail', data)
/**
 * @return  列表导览
 */
export const exhibitList = (data) => req('/api/exhibition_detail_more', data)
/**
 * @return  列表导览头图
 */
export const exhibitionLbImg = (data) => req('/api/exhibition_lb_img', data)


/**
 * @return  资讯详情
 */
export const exhibitInfo = (data) => req('/api/exhibit_info', data)

/**
 * @return  展厅详情
 */
export const exhibitionInfo = (data) => req('/api/exhibition_info', data)
/**
 * @return  展品浏览收听接口（浏览展品和播放语音时调用）

 */
export const visitExhibit = (data) => req('/api/visit_exhibit', data)

/**
 * @return  展厅列表接口

 */
export const exhibitionList = (data) => req('/api/exhibition_list', data)

/**
 * @return  交通指南
 */
export const museumRoute = () => req('/api/museum/traffic')


/**
 * @return  搜索
 */
export const exhibitSearch = (data) => req('/api/exhibit_search', data)

/**
 * @return  获取微信配置信息
 */
export const wxInfo = (url = window.location.href) => req('/api/wxconfig', {
    url
})

/**
 * @return  标签列表
 */
export const tipList = () => req('/api/tip_list')

/**
 * @return  地图列表
 */
export const mapList = (data) => req('/api/map_list', data)



/**
 * @return  留言板描述
 */
export const message = (data) => req('/api/museum/message', data)
/**
 * @return  提交留言
 */
export const submitMsg = (data) => req('/api/museum/submit_msg', data, 'POST')



/**
 * @return  地图
 */
export const exhibitionMapInfo = (data) => req('/api/map_list', data)