<template>
    <div class="newsDetail" v-if="show">
        <!-- 资讯详情 -->
        <div class="header">
            <h2 class="title">{{title}}</h2>
            <p class="time">发布日期：{{public_time.substring(0,10)}}</p>
        </div>
        <div class="artical" ref="artical" v-html="content"> 
            
        </div>
    </div>
</template>

<script>
    import { newsInfo, wxInfo } from '../http/interface'
    import wx from 'weixin-js-sdk'
    export default {
        name: '',
        inject: ['app'],
        data() {
            return {
                title: '',
                content: '',
                public_time: '',
                imgArr: [],
                show: false
            }
        },
        mounted() {
            this.getInfo()
            // this.initWeixin()
        },
        watch: {
            // $route(to,from){
            //     alert(from.path);
            // }
        },      
        methods: {
            async getInfo() {
                const vm = this
                try {
                    let id = this.$route.params.id
                    vm.app.showLoading()
                    const res = await newsInfo({
                        article_id: id
                    })
                    let type = res.data.type
                    if(type == 1) {
                        location.replace(res.data.url)
                    }else {
                        vm.show = true
                        vm.content = res.data.content
                        vm.title = res.data.title
                        vm.public_time = res.data.public_time
                    }
                    // vm.$nextTick(() => {
                    //     vm.getImgArr()
                    // })
                    vm.app.hideLoading()
                } catch (error) {
                    console.log(error)
                    vm.app.hideLoading()
                }
            },
            openImg(currentUrl) {
                let vm = this
                wx.previewImage({
                    current: currentUrl, // 当前显示图片的http链接
                    urls: vm.imgArr // 需要预览的图片http链接列表
                });
            },
            getImgArr() {
                let vm = this
                let imgList = vm.$refs.artical.querySelectorAll("img")
                imgList.forEach(element => {
                    vm.imgArr.push(element.src)
                    element.onclick = function(e) {
                        vm.openImg(this.src)
                    }
                });
            },
            async initWeixin () {
                const vm = this
                try {
                    if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
                        window.entryUrl = location.href.split('#')[0]
                    }
                    let url = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl
                    const res = await wxInfo(url)
                    if(res.status == 1) {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: res.data.appId, // 必填，公众号的唯一标识
                            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                            signature: res.data.signature, // 必填，签名，见附录1
                            jsApiList: [
                                'previewImage'
                            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    }else {
                        alert(res.msg)
                    }
                } catch (error) {
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
.newsDetail{
    padding: 0 31px;
    .header{
        border-bottom: 1px solid #DCDCDC;
        padding: 29px 0 20px 0;
        .title{
            font-size:36px;
            font-weight:500;
            color:rgba(50,50,50,1);
            line-height: 48px;
        }
        .time{
            font-size:26px;
            font-weight:400;
            color:rgba(50,50,50,1);
            opacity:0.5;
            margin-top: 20px;
        }
    }
    .artical{
        font-size:30px;
        font-weight:400;
        color:rgba(50,50,50,1);
        padding: 29px 0;
        text-align: justify;
    }
}
</style>