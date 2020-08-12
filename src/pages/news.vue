<template>
    <div class="news">
        <div class="banner">
            <swiper :options="swiperOption">
                <swiper-slide class="slide" v-for="(info, index) in list" :key="index">
                    <img class="image" v-lazy="info.img"  @click="getDetail(info)"/>
                    <div class="info"  @click="getDetail(info)">
                        <p class="title">{{info.title}}</p>
                        <p class="time">发布日期：{{info.public_time}}</p>
                    </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <div class="content">
            <div class="title">
                <p>全部活动</p>
            </div>
            <div class="list">
                <div class="item" @click="getDetail(i)" v-for="(i, index) in news" :key="index">
                    <img class="image" :src="i.img" alt="">
                    <div class="info">
                        <p class="name">{{i.title}}</p>
                        <p class="time">发布日期：{{i.public_time}}</p>
                    </div>
                </div>
                <!-- <div class="getmore" v-if="isGetMore">
                    <div class="text" @click="get_more" v-text="'加载更多'"></div>
                </div> -->
            </div>
            <div v-infinite-scroll="get_more" infinite-scroll-disabled="busy" infinite-scroll-immediate-check="false" infinite-scroll-distance="50">
                <div class="loading" v-if="more">
                    <div class="demo-spin-container" v-if="isloading">
                        <Spin fix>
                            <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
                        </Spin>
                    </div>
                    <div v-if="isloading">
                        加载中...
                    </div>
                </div>
                <div class="nomore" v-if="!more">没有更多了</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { newsList, newsTopRecommend } from '../http/interface'
    export default {
        name: '',
        inject: ['app'],
        data() {
            return {
                swiperOption: {
                    notNextTick: true,
                    // 默认为slide（位移切换）
                    effect: "slide",
                    // 分页器
                    pagination: {
                        el: ".swiper-pagination",
                        type: 'bullets'
                    },
                    // 自动播放
                    autoplay: {
                        delay: 2000,
                        // 自动切换不会停止
                        disableOnInteraction: false
                    },
                    loop: false,
                    // 设置slider容器能够同时显示的slider数量
                    slidesPerView: 1,
                    // 设置为true时，active slide会居中，默认状态下居左
                    centeredSlides: true,
                    // 监视器
                    // 当改变swiper的样子修改，swiper自动初始化
                    observer: true,
                    // 将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新
                    observerParents: true
                },
                list: [],
                skip: 0,
                take: 10,
                isGetMore: true,
                news: [],
                topLimit: 3,
                more: true,
			    isloading: false,
                busy: false,
            }
        },
        mounted() {
            this.getNewsTopRecommend()
            this.getNewsList(true)
        },
        methods: {
            async getNewsTopRecommend() {
                const vm = this
                try {
                    vm.app.showLoading()
                    // let data = {
                    //     limit: vm.topLimit
                    // }
                    const res = await newsTopRecommend()
                    // console.log(res)
                    vm.list = res.data
                    // vm.imgUrls = res.data.imgs
                    // vm.content = res.data.content
                    // vm.title = res.data.title
                    vm.app.hideLoading()
                } catch (error) {
                    vm.app.hideLoading()
                }
            },
            getDetail(obj) {
                // if(obj.type == 1) {
                //     location.href = obj.url
                // }else {
                    this.$router.push(`/news_detail/${obj.article_id}`)
                // }
            },
            async getNewsList(isfirst) {
                // const vm = this
                // let skip = vm.skip
                // let take = vm.take
                // try {
                //     vm.app.showLoading()
                //     const res = await newsList({
                //         page: skip,
                //         size: take
                //     })
                //     if(res.data.data&&res.data.data.length) {
                //         vm.news = vm.news.concat(res.data.data)
                //     }else {
                //         vm.isGetMore = false
                //     }
                //     vm.app.hideLoading()
                // } catch (error) {
                //     vm.app.hideLoading()
                // }
                var vm = this;
                try {
                    // vm.app.showLoading()
                    const res = await newsList({
                        skip: vm.skip,
                        take: vm.take
                    })
                    if (res.status == 1) {
                        
                        if(isfirst) {
                            vm.news = res.data
                            vm.busy = false;
                            // console.log(res.data.data.length)
                            if(res.data.length < vm.take) {//如果第一次加载数量少于设定数量表示没有更多了
                                vm.more = false
                                vm.busy = true;
                            }
                        }else {
                            vm.news = vm.news.concat(res.data)//如果后续加载数量为零则没有更多了
                            if(res.data.length == 0){
                                vm.busy = true;
                                vm.more = false
                            }else{
                                vm.busy = false;
                            }
                        }
                        vm.isloading = false
                        // if(vm.list.length) {
                        //     vm.is_show = true
                        // }else {
                        //     vm.is_show2 = true
                        // }
                    }
                    // vm.app.hideLoading()
                } catch (error) {
                    // vm.app.hideLoading()
                }
            },
            get_more() {
                const vm = this
                vm.isloading = true
                vm.busy = true
                vm.skip += vm.take
                vm.getNewsList(false)
            }

        },
    }
</script>

<style lang="scss" scoped>
    @import '../style/mixin.scss';
    .news {
        background: #ffffff;
        min-height: 100vh;
        .banner{
            width: 100%;
            height: 422px;
            .image{
                width: 100%;
                height: 422px;
            }
            .info{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                // bottom: 0;
                z-index: 1000;
                // background:rgba(52,18,0,0.36);
                background-image:linear-gradient(
                    to right,   
                    rgba(52,18,0,.5) 0%,
                    rgba(52,18,0,.3) 70%,
                    rgba(52,18,0,0) 100%
                );
                width: 100%;
                padding: 34px 32px;
                .title{
                    font-size:34px;
                    font-weight:bold;
                    color:rgba(255,255,255,1);
                    line-height: 60px;
                            @include ellipsis();
                }
                .time{
                    font-size:26px;
                    font-weight:500;
                    color:rgba(255,255,255,1);
                }
            }
            /deep/ .swiper-pagination{
                .swiper-pagination-bullet{
                    width: 11px;
                    height: 11px;
                    background: #FFFFFF;
                    opacity: .4;
                    transition: all .3s;
                    &.swiper-pagination-bullet-active{
                        width: 27px;
                        border-radius: 5px;
                        opacity: 1;
                    }
                }
            }
        }
        .content{
            .title{
                height: 64px;
                overflow: hidden;
                padding-top: 32px;
                p{
                    font-size:32px;
                    font-weight:bold;
                    color:rgba(50,50,50,1);
                    border-left: 8px solid #A33336;
                    text-indent: 32px;
                    height: 30px;
                    line-height:30px;
                }
            }
            .list{
                padding: 0 32px;
                .item{
                    height: 211px;
                    border-bottom: 1px solid #E8E8E8;
                    display: flex;
                    align-items: center;
                    .image{
                        width: 228px;
                        height: 152px;
                        margin-right: 21px;
                    }
                    .info{
                        // flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 152px;
                        .name{
                            font-size:30px;
                            font-weight:500;
                            color:rgba(50,50,50,1);
                            @include ellipsis(2);
                        }
                        .time{
                            width: 437px;
                            font-size:26px;
                            font-weight:500;
                            color:rgba(121,121,121,1);
                            @include ellipsis();
                        }
                    }
                }
                .getmore{
                    .text {
                        font-size: 32px;
                        line-height: 200%;
                        text-align: center;
                        color: #999;
                    }

                    .text:active {
                        color: #a97d7b;
                    }
                }
            }
        }
    }
    .loading{
        text-align: center;
        line-height: 3;
        display: flex;
        flex-direction: column;
        margin: 20px 0;
        font-size: 30px;
        .demo-spin-container {
            display: block;
            width: 30px;
            height: 30px;
            margin: 0 auto;
            position: relative;
            border: 1px solid #fff;
            .ivu-spin-fix{
                z-index: 0;
            }
            .demo-spin-icon-load {
                color: #a97d7b;
                animation: ani-demo-spin 1s linear infinite;
            }
        }
    }
    .nomore{
        font-size: 30px;
        text-align: center;
    }
</style>