<template>
    <div class="traffic">
        <img class="image" :src="img" alt="" @click="search">
        <p class="place">场馆位置：{{position}}</p>
        <div class="routes">
            <h2 class="name">乘车指南</h2>
            <div class="transit">
                <!-- <p class="type">公交：</p> -->
                <p class="artical" v-html="bus"></p>
            </div>
            <!-- <div class="metro">
                <p class="type">地铁：</p>
                <p class="artical" v-html="metro" ref="artical"></p>
            </div> -->
        </div>
    </div>
</template>

<script>
    import { museumRoute, wxInfo } from '../http/interface'
    import wx from 'weixin-js-sdk'
    export default {
        name: '',
        inject: ['app'],
        data() {
            return {
                bus: '',
                title: '',
                img: '',
                position: '',
                imgArr: [],
                url: ''
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            search() {
                if(this.url) {
                    window.location.href = this.url 
                }
            },
            async getInfo() {
                const vm = this
                try {
                    vm.app.showLoading()
                    const res = await museumRoute()
                    vm.title = res.data.title
                    vm.bus = res.data.bus
                    vm.img = res.data.img
                    vm.position = res.data.position
                    vm.url = res.data.url
                    // vm.$nextTick(() => {
                    //     vm.getImgArr()
                    // })
                    vm.app.hideLoading()
                } catch (error) {
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
    .traffic{
        background: #EEEEEE;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        .image{
            width: 100%;
        }
        .place{
            font-size:32px;
            font-weight:500;
            color:rgba(50,50,50,1);
            padding: 29px 32px;
            background: #ffffff;
        }
        .routes{
            margin-top: 20px;
            background: #ffffff;
            padding: 0 33px;
            flex: 1;
            .name{
                font-size:36px;
                font-weight:500;
                color:rgba(0,0,0,1);
                padding: 24px;
                text-align: center;
                border-bottom: 1px solid #DCDCDC;
            }
            .transit{
                margin-top: 20px;
                .type{
                    background: url('../../static/img/gongjiao.png') no-repeat left center;
                    background-size: 42px 42px;
                }
            }
            .metro{
                .type{
                    background: url('../../static/img/ditie.png') no-repeat left center;
                    background-size: 42px 42px;
                }
            }
            .type{
                font-size:32px;
                font-weight:500;
                color:rgba(50,50,50,1);
                text-indent: 19+42px;
                height: 96px;
                line-height: 96px;
            }
            .artical{
                font-size:30px;
                font-weight:500;
                color:rgba(50,50,50,1);
            }
        }
    }
</style>