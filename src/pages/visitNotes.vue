<template>
  <div class="wrap">
    <!-- <div class="banner">
        <swiper :options="swiperOption">
            <swiper-slide 
                v-for="(img, index) in imgUrls" 
                :key="index"> 
                <img class="image" 
                    :src="img.img" 
                    @click="jumpTo(img.url)"/>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>-->
    <div class="topImage">
      <img :src="default_img" alt />
    </div>
    <div class="core">
      <div class="title">语音导览参观须知</div>
      <div class="content">
        <p class="artical" v-html="content" ref="artical"></p>
      </div>
    </div>
  </div>
</template>
<script>
import {introductionGuide, wxInfo} from '../http/interface';
import {toThumbsimg} from '@/assets/js/toThumbsimg.js';
import {baseUrl} from '@/config/url.js';
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import wx from 'weixin-js-sdk';
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      imgUrls: [],
      imgUrl: '',
      title: '',
      content: '',
      swiperOption: {
        notNextTick: true,
        // 默认为slide（位移切换）
        effect: 'slide',
        // 分页器
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
        // 自动播放
        autoplay: {
          delay: 2000,
          // 自动切换不会停止
          disableOnInteraction: false,
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
        observerParents: true,
      },
      detail: {
        exhibit_imgs: [],
      },
      imgArr: [],
      default_img: '',
    };
  },
  inject: ['app'],
  created() {
    const vm = this;
    vm.getVenueIntroduction();
  },
  methods: {
    thumbsimg: function(path, width, height, type) {
      path = path.replace(baseUrl, '');
      return toThumbsimg(path, width, height, type);
    },
    async getVenueIntroduction() {
      const vm = this;
      try {
        vm.app.showLoading();
        const res = await introductionGuide();
        vm.default_img = res.data.img;
        // vm.imgUrls = res.data.imgs
        vm.content = res.data.content;
        // vm.title = res.data.title
        // vm.$nextTick(() => {
        //     vm.getImgArr()
        // })
        vm.app.hideLoading();
      } catch (error) {
        vm.app.hideLoading();
      }
    },
    jumpTo(url) {
      if (url) {
        window.location.href = url;
      }
    },
    openImg(currentUrl) {
      let vm = this;
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: vm.imgArr, // 需要预览的图片http链接列表
      });
    },
    getImgArr() {
      let vm = this;
      let imgList = vm.$refs.artical.querySelectorAll('img');
      imgList.forEach(element => {
        vm.imgArr.push(element.src);
        element.onclick = function(e) {
          vm.openImg(this.src);
        };
      });
    },
    async initWeixin() {
      const vm = this;
      try {
        if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
          window.entryUrl = location.href.split('#')[0];
        }
        let url = /(Android)/i.test(navigator.userAgent)
          ? location.href.split('#')[0]
          : window.entryUrl;
        const res = await wxInfo(url);
        if (res.status == 1) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        } else {
          alert(res.msg);
        }
      } catch (error) {}
    },
  },
};
</script>
<style lang="scss" scoped>
/** @format */

@import '../style/mixin.scss';
.image {
  width: 100vw;
  height: auto;
  background: #dddddd;
  img {
    width: 100%;
    height: auto;
  }
}
.core {
  padding: 0 20px;
}
.wrap {
  // padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  // padding: 35px 18px;
  .topImage {
    width: 100%;
    height: 422px;
    .image {
      width: 100%;
      height: 422px;
    }
    // /deep/ .swiper-pagination{
    //     .swiper-pagination-bullet{
    //         width: 11px;
    //         height: 11px;
    //         background: #FFFFFF;
    //         opacity: .4;
    //         transition: all .3s;
    //         &.swiper-pagination-bullet-active{
    //             width: 27px;
    //             border-radius: 5px;
    //             opacity: 1;
    //         }
    //     }
    // }
  }
  .title {
    width: 100%;
    height: 94px;
    line-height: 94px;
    border-bottom: 1px solid #dcdcdc;
    // background: url('../../static/img/titBg.png') no-repeat left center;
    // background-size: 10px 82px;
    margin-bottom: 35px;
    // text-indent: 19px;
    text-align: center;

    font-size: 36px;
    font-weight: 500;
    color: rgba(50, 50, 50, 1);
    // .title1{
    //     font-size: 40px;
    //     line-height: 44px;
    //     color: #e7e6e5;
    //     font-weight:bold;
    // }
    // .title2{
    //     font-size: 34px;
    //     line-height: 38px;
    //     color: #333333;
    //     font-weight:bold;
    // }
  }
  .content {
    width: 95%;
    // padding: 0 13px;
    // .title{
    //     text-align: center;
    //     font-size:36px;
    //     font-weight:500;
    //     color:rgba(50,50,50,1);
    //     border-bottom: 1px solid #DCDCDC;
    //     padding: 24px;
    // }
    .artical {
      font-size: 30px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
      padding: 29px 0;
      text-align: justify;

      /deep/ strong {
        color: #6b0f10;
        font-size: 32px;
      }
    }
  }
}
</style>
