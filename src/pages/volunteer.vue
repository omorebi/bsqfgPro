<template>
  <div class="wrap">
    <div class="banner">
      <swiper :options="swiperOption">
        <swiper-slide v-for="img in imgUrls" :key="img">
          <img class="image" :src="img" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="title">
      <p class="title2">清风馆语音导览志愿服务</p>
    </div>
    <div class="content">
      <div class="title">清风馆语音导览志愿者工作概况</div>
      <p class="artical" v-html="content" ref="artical"></p>
      <div class="title title1">清风馆语音导览志愿者招募：</div>
      <p class="artical" v-html="recruit" ref="artical"></p>
    </div>
  </div>
</template>
<script>
import {volunteerInfo, wxInfo} from '../http/interface';
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
      title: '',
      content: '',
      recruit: '',
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
        // autoplay: {
        //   delay: 2000,
        //   // 自动切换不会停止
        //   disableOnInteraction: false
        // },
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
        const res = await volunteerInfo();
        console.log(res);
        vm.recruit = res.data.recruit;
        vm.imgUrls = res.data.images;
        vm.content = res.data.basic;
        vm.title = res.data.title;
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
.wrap {
  // padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  // padding: 35px 18px;
  .banner {
    width: 100%;
    height: 422px;
    .image {
      width: 100%;
      height: 422px;
    }
    /deep/ .swiper-pagination {
      .swiper-pagination-bullet {
        width: 11px;
        height: 11px;
        background: #ffffff;
        opacity: 0.4;
        transition: all 0.3s;
        &.swiper-pagination-bullet-active {
          width: 27px;
          border-radius: 5px;
          opacity: 1;
        }
      }
    }
  }
  .title {
    width: 100%;
    height: 94px;
    line-height: 94px;
    text-align: center;
    font-size: 36px;
    color: #323232;
  }
  .content {
    width: 95%;
    border-top: 2px solid rgba(220, 220, 220, 1);
    .title {
      text-align: left;
      text-indent: 0.8rem;
      color: rgba(107, 15, 16, 1);
      height: 90px;
      line-height: 90px;
      font-size: 32px;
      font-weight: 500;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAMAAADwSaEZAAABUFBMVEUAAAD/AACqAACSACSZABqiABeqABWdABSZABGfABClAA+eABiiABebABahABOcABCeABefABWhABSiABOeABKfABedABaeABSgABSiABShABOeABafABWfBBShBBOgAxSgAxSfAxOgAxWhAxWfAxShAxOgAxWgAxWhAxSfAxShAhSgAhOhAhOgAhOhAhOgAhOhAhSgAhOgAhWhAhWgAhShAhSgAhSgAhSgAhSgAhOhAhOgAhShAhOgAhOfAhWgAhWhAhSgAhSgAhShAhSgAhSgAhShARWgARWgARShARSgARSgARWfAxSgAxSgAxShAxOfAxSgAxSgAhSgAhSgAhWgAhSgAhSgAhSgAhShAhSgAhShAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhSgAhTAsV2aAAAAb3RSTlMAAQYHCgsMDQ8QERUWFxsfIiUmKSotLzIzNDY6PUBES05SVldYX2FjZGVnaWprbHaChIaHiYqLjI+Rkpedn6ChoqOkpaepra6ytba5wMLDxcjKztHT1NXW19jZ4OLj5OXn6Ovv8PHz9PX3+vv8/f7RDwW3AAABg0lEQVRYw+3YR1MCQRAF4DYLJswiiFkRwYAYUQFZEAMiCqgYEAOghP7/Ny+WrjBSw0wf0Np3fIevamenp2YXQEt9xJnB2lLyd/5C6c+x9jwamVZjDEWS7WVhuyiWCxaGohmnxNyUWIAS8/1VrBDyKIriC6QJsGjfZ9XulcZedd9lVBbzqsoFWcylKidlsW1VOU2JzchiW6pyShbbpFyzI1W5LIsVTF9dy730BGTmmgEAoMlySTHoT1c3yWQ89S+OoPngmp4KW0fEayJMl0dEJMIM74RYT07DCLH4gddfNZ5gihdzc9wxW0N82APXjbUty4XF+O6/KS4sb+axLEW+NXteNA0bq2Zk1PaibVoNk8NuN5yusqwGBLHCIGvHR8SwBHN87GIY8ysNrGJYroOFHQq+gDOH3fEzS9YVbdPWNWZ4I8S6i1TYPkBDnArzAEB/tJS2UWB3AAAwoFMPTEzmOcszJIzhTqU2Ia6ddFVo5oSwtsc4aGb94fBp7Ykcj2l/MuslH16T9H7h71p5AAAAAElFTkSuQmCC)
        no-repeat left center;
      background-size: 38px 38px;
    }
    .title1 {
      background: url(data:image/png;base64,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)
        no-repeat left center;
      background-size: 38px 38px;
    }
    .artical {
      font-size: 30px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
      text-align: justify;
      /deep/ a {
        border-bottom: 1px solid #2275ff;
        color: #2275ff;
      }
      /deep/ strong {
        color: #6b0f10;
        font-size: 32px;
      }
    }
  }
}
</style>
