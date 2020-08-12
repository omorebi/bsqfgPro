<template>
    <div class="scan">
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    import { wxInfo } from '../http/interface'
    export default {
        name: '',
        inject: ['app'],
        data() {
            return {
                
            }
        },
        mounted() {
            this.initWeixin()
        },
        methods: {
            async initWeixin () {
                const vm = this
                try {
                    vm.app.showLoading()
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
                                'scanQRCode',
                                'closeWindow'
                            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.ready(() => {
                            console.log('微信配置成功')
                            vm.openSaoyisao()
                        })
                    }else {
                        alert(res.msg)
                    }
                    vm.app.hideLoading()
                } catch (error) {
                    vm.app.hideLoading()
                }
            },
            openSaoyisao() {
                let vm = this
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function(res) {
                        let url = res.resultStr
                        let start = 'http://cfbwg.museum-edu.cn/wx/#/exhibit/detail/'
                        if(url.indexOf(start) == 0) {
                            window.location.replace(url)
                        }else {
                            if(window.confirm('请扫描展品二维码')) {
                                vm.openSaoyisao()
                            }else {
                                wx.closeWindow()
                            }
                        }
                    },
                    cancel: function(res) {
                        console.log('关闭页面')
                        wx.closeWindow()
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>