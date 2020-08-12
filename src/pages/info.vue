<template>
  <div>
    <!-- 二维码页面 -->
    <!-- <div v-if="is_subscribe" class="head1">
			<p class="focus">关注公众号才能收听讲解哦！</p>
			<div class="explain">
				<p class="numtwo">1. 长按下方二维码，点击识别二维码后，关注公众号。</p>
				<p class="numthree">2. 重新在微信app中打开扫一扫，扫码后即可收听语音展览。</p>    
			</div>
			<div class="footer">
				<img src="../../../static/img/erweima.jpg" alt="">
			</div>
    </div>-->
    <!-- 音频详情页面 -->
    <div v-if="is_subscribe2">
      <!-- <change-lan @change="change"></change-lan> -->
      <div class="j_de">
        <div class="j_de_header">
          <div class="j_de_header--banner">
            <!-- <img class="image" :src="detail.exhibit_imgs&&detail.exhibit_imgs[0]" /> -->
            <swiper class="swiper" :options="swiperOption">
              <swiper-slide class="slide" v-for="(info, index) in imglist" :key="index">
                <img class="image" :src="info" />
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <!-- <div class="eye">
							<img src="../../static/img/eye.png" alt="">
							<span class="look_num">{{detail.look_num}}</span>
            </div>-->
          </div>
          <div class="j_de_header--progress" v-if="detail.audio">
            <!--v-if="detail.audio"-->
            <div class="prog_cont">
              <div
                class="prog_btn"
                :class="[playing?'play':'pause']"
                @click="toggleplay"
                style="margin-right:15px;"
              ></div>
              <div class="middels">
                <div class="mttitle">{{detail.exhibit_name}}</div>
                <!-- currentTime返回当前视频/音频播放位置 -->
                <div class="prog_cont_curtime">{{ currentTime | formatSecond }}</div>
              </div>
            </div>

            <!-- timeupdate用来更新音频当前播放时间 -->
            <audio
              ref="audio"
              preload="auto"
              :src="detail.audio"
              @timeupdate="onTimeupdate"
              @ended="onEnded"
            ></audio>
            <loadingDot :msg="'音频资源加载中...'" :showLoading="showLoading" @handleClose="handleClose"></loadingDot>
          </div>
        </div>
        <!-- 内容描述 -->
        <div class="j_de_body">
          <div class="j_de_body--content" v-html="detail.content"></div>
        </div>
      </div>
    </div>
    <!-- <div class="changeView">
      <div class="text1" @click="isShowAction(1)" :hidden="!isShowC">{{hideStr}}</div>
      <div class="text2" @click="isShowAction(0)">{{showStr}}</div>
    </div>-->
  </div>
</template>
<script>
import wx from 'weixin-js-sdk';
import 'swiper/dist/css/swiper.css';
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import {toThumbsimg} from '../assets/js/toThumbsimg';
import app from '../assets/js/App';
import loadingDot from '../components/loadingDot';
import {exhibitInfo} from '../http/interface';
import changeLan from '../components/changeLan';
// import 'iview/dist/styles/iview.css'
// import lanSwitch from '../common/lanSwitch'
// import {mapState,mapGetters,mapActions} from 'vuex';

//时间转换
const transTime = value => {
  let time = '';
  let h = parseInt(value / 3600);
  value %= 3600;
  let m = parseInt(value / 60);
  let s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }
  return time;
};

//时间格式化
const formatTime = value => {
  let time = '';
  // 将字符串分割成数组
  let s = value.split(':');
  let i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i];
  return time;
};

export default {
  data() {
    return {
      // swiper配置
      hideStr: 'EN',
      showStr: '中',
      zhongwen: '中',
      yingwen: 'EN',
      language: 1,
      isShowC: false,
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
      // baseURL:app.baseURL,
      detail: {}, //获取回来的数据
      exhibit_id: null,
      exhibition_id: null,
      api_token: '',
      list: [],
      is_subscribe: false, //公众号二维码页面
      is_subscribe2: true, //音频详情

      sliderX: 0,
      // 该字段是音频是否处于播放状态的属性
      playing: false,
      // 音频当前播放时长
      currentTime: 0,
      // 音频最大播放时长
      maxTime: 0,
      minTime: 0,
      step: 0.1,
      isFirst: false,
      // 音频加载默认是关闭
      showLoading: false,
      imglist: [],
    };
  },
  inject: ['app'],
  computed: {
    // ...mapState({
    //    lan: 'lan'
    // }),
  },
  components: {
    loadingDot,
    swiper,
    swiperSlide,
    changeLan,
    // lanSwitch
  },
  created: function() {
    this.exhibit_id = this.$route.params.exhibit_id;
    this.getDetail();
    // this.dovisitExhibit()//浏览量
    // this.getList();
    // this.is_api_token();
    // this.isSubscribe();
  },
  methods: {
    isShowAction(e) {
      var vm = this;
      if (!vm.isShowC) {
        vm.isShowC = true;
        return;
      }
      var currH = '';
      var currS = '';
      if (e == 1) {
        if (vm.language == 1) {
          vm.language = 2;
        } else {
          vm.language = 1;
        }
        vm.getDetail();
        currH = vm.showStr;
        currS = vm.hideStr;
      } else {
        currH = vm.hideStr;
        currS = vm.showStr;
      }
      vm.isShowC = !vm.isShowC;
      vm.showStr = currS;
      vm.hideStr = currH;
    },
    async dovisitExhibit() {
      let vm = this;
      try {
        vm.app.showLoading();
        let data = {
          exhibit_id: vm.exhibit_id,
        };
        const res = await visitExhibit(data);
        if (res.status == 1) {
          console.log(res);
        }
        vm.app.hideLoading();
      } catch (error) {
        vm.app.hideLoading();
      }
    },
    // goThree(e) {
    // 	window.location.href = e
    // },
    /*生成缩略图链接*/
    thumbsimg: function(path, width, height, type) {
      return toThumbsimg(path, width, height, type);
    },
    // initWx() {
    // 	let vm = this
    //     if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
    //         window.entryUrl = location.href.split('#')[0]
    //     }
    //     // 进行签名的时候  Android 不用使用之前的链接， ios 需要
    //     let signLink =  /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl;
    //     this.axios({
    // 		method: 'get',
    // 		url: '/api/wxconfig',
    // 		params: {
    // 			p: "w",
    // 			url: signLink,
    // 			pid: 8
    // 		}
    // 	}).then(res => {
    //         wx.config({
    //             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //             appId: res.data.data.appId, // 必填，公众号的唯一标识
    //             timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
    //             nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
    //             signature: res.data.data.signature, // 必填，签名，见附录1
    //             jsApiList: [
    // 				'updateAppMessageShareData',//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    // 				'updateTimelineShareData',//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    // 				'onMenuShareWeibo',//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    //             ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //         });
    //         wx.ready(() => {
    // 			// console.log('微信配置成功')
    // 			wx.updateAppMessageShareData({
    // 				title: vm.detail.exhibit_name, // 分享标题
    // 				desc: '吉林大学校史馆', // 分享描述
    // 				link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // 				imgUrl: vm.detail.exhibit_imgs&&vm.detail.exhibit_imgs[0], // 分享图标
    // 				success: function () {
    // 				// 设置成功
    // 					console.log('设置成功')
    // 					// alert('设置成功')
    // 				}
    // 			})
    // 			wx.updateTimelineShareData({
    // 				title: vm.detail.exhibit_name, // 分享标题
    // 				link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // 				imgUrl: vm.detail.exhibit_imgs&&vm.detail.exhibit_imgs[0], // 分享图标
    // 				success: function () {
    // 				// 设置成功
    // 					console.log('设置成功')
    // 					// alert('设置成功')
    // 				}
    // 			})
    // 			wx.onMenuShareWeibo({
    // 				title: vm.detail.exhibit_name, // 分享标题
    // 				desc: '吉林大学校史馆', // 分享描述
    // 				link: window.location.href, // 分享链接
    // 				imgUrl: vm.detail.exhibit_imgs&&vm.detail.exhibit_imgs[0], // 分享图标
    // 				success: function () {
    // 				// 用户确认分享后执行的回调函数
    // 					console.log('设置成功')
    // 					// alert('设置成功')
    // 				},
    // 				cancel: function () {
    // 				// 用户取消分享后执行的回调函数
    // 				}
    // 			})
    //         })

    //             // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

    //     })
    //     .catch((error) => {
    // 		console.log(error);
    //     });
    // },
    // 是否关注公总号
    isSubscribe: function() {
      const vm = this;
      vm.axios({
        method: 'get',
        url: '/api/users/subscribe',
        params: {
          api_token: vm.api_token,
        },
      })
        .then(function(rlt) {
          if (rlt.data.status == 1) {
            console.log(rlt.data);
            if (rlt.data.data === 1) {
              vm.is_subscribe2 = true;
            } else {
              vm.is_subscribe = true;
            }
            return;
          }
          if (rlt.data.status == 405) {
            let path = vm.$route.path;
            vm.isLogin(path);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 判断是否有token
    is_api_token: function() {
      this.api_token = app.getCookie('47api_token');
      if (this.api_token) {
        this.isSubscribe();
        return true;
      } else {
        let path = this.$route.path;
        this.isLogin(path);
      }
    },
    // 加载展品详情
    async getDetail(value) {
      let vm = this;
      vm.handleClose();
      try {
        vm.app.showLoading();
        let data = {
          language: vm.language,
          exhibit_id: vm.exhibit_id,
        };
        const res = await exhibitInfo(data);
        if (res.status == 1) {
          vm.detail = res.data;
          vm.maxTime = vm.detail.audio_time - 1;
          document.title = vm.detail.exhibit_name;
          vm.imglist = vm.detail.exhibit_imgs;
          // vm.initWx()
        }
        vm.app.hideLoading();
      } catch (error) {
        vm.app.hideLoading();
      }
    },

    // 控制音频的播放与暂停
    toggleplay() {
      this.playing ? this.pause() : this.play();
    },
    handleClose() {
      this.currentTime = 0;
      this.maxTime = 0;
      this.sliderX = 0;
      this.showLoading = false;
      this.playing = false;
      this.isFirst = false;
      if (this.detail.audio) {
        this.$refs.audio.load();
      }
    },
    // 播放音频
    play() {
      if (this.detail.audio.trim().length === 0) {
        return;
      }
      // debugger;
      // this.sliderX ? (
      this.playing = true;
      // ) : (this.showLoading = true);
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      // console.log('暂停音频')
      this.playing = false;
      this.$refs.audio.pause();
    },
    onTimeupdate(res) {
      // vm.app.hideLoading();
      // currentTime 属性设置或返回音频/视频播放的当前位置
      this.currentTime = res.target.currentTime;
      this.$refs.audio.oncanplay = function() {
        this.maxTime = parseInt(res.target.duration);
      };
      // 进度条
      this.sliderX = parseInt((this.currentTime / this.maxTime) * 100);
    },
    //播放结束
    onEnded() {
      this.currentTime = 0;
      this.sliderX = 0;
      this.playing = false;
      this.isFirst = false;
    },
    handleTouchStart(e) {
      this.setValue(e.touches[0]);
      document.addEventListener('touchmove', this.handleTouchMove);
      document.addEventListener('touchup', this.handleTouchEnd);
      document.addEventListener('touchend', this.handleTouchEnd);
      document.addEventListener('touchcancel', this.handleTouchEnd);
    },
    handleTouchMove(e) {
      this.setValue(e.changedTouches[0]);
    },
    handleTouchEnd(e) {
      this.setValue(e.changedTouches[0]);
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchup', this.handleTouchEnd);
      document.removeEventListener('touchend', this.handleTouchEnd);
      document.removeEventListener('touchcancel', this.handleTouchEnd);
    },
    // 从点击位置更新 value
    setValue(e) {
      const $track = this.$refs.track;
      const {maxTime, minTime, step} = this;
      let value =
        ((e.clientX - $track.getBoundingClientRect().left) /
          $track.offsetWidth) *
        (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }

      this.$refs.audio.currentTime = value;
    },
    change(value) {
      this.$store.commit('setLan', value);
      this.getDetail();
    },
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return transTime(second);
    },
  },
  watch: {
    sliderX: {
      handler: function(value) {
        const isFirst = this.isFirst;
        if (!isFirst) {
          const isplaying = this.playing;
          if (value && !isplaying) {
            this.showLoading = false;
            this.playing = true;
            this.isFirst = true;
          }
        }
      },
      deep: true,
      immediate: true, // 默认立即触发一次
    },
  },
};
</script>
<style lang="scss" scoped>
/** @format */

@import '../../static/css/mixin.scss';

.changeView {
  width: 235px;
  height: 95px;
  position: fixed;
  right: 23px;
  bottom: 230px;
}

.text1 {
  width: 100%;
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 95px;
  position: absolute;
  left: 0px;
  top: 0px;
  text-align: left;

  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../static/img/changeL.png');
  transition: all 0.5s;
  padding-left: 47px;
}

.text2 {
  width: 95px;
  height: 95px;
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 95px;
  background-color: #b00b09;
  border-radius: 50%;
  position: absolute;
  right: 0px;
  top: 0px;
  text-align: center;
}
/* 二维码页面 */
// .head1 {
//   	width: 100%;
// 	height: 100%;
// 	padding-top: 3.73rem;
//   .focus {
//     font-size: 1.25rem;
//     color: #295D17;
//     font-weight: bold;
// 	text-align: center;
// 	margin-bottom: 1.7rem;
//   }
//   .explain {
//     box-sizing: border-box;
//     width: 100%;
// 	font-size: .86rem;
// 	line-height: 1.5rem;
// 	color: #555555;
// 	padding: 0 2.17rem;
//   }
//   /* 二维码 */
//   .qr {
//     width: 100%;
//     height: 25rem;
//     background-size: 100%;
//     margin-top: 15vw;
//   }

//   /* 尾部 */
//   .footer {
// 	margin-top: 3.43rem;
//     width: 100%;
// 	height: 23.5rem;
// 	background-image: url(../../../static/img/weixinbg.png);
// 	background-size: 100% auto;
// 	background-repeat: no-repeat;
// 	position: relative;
// 	img{
// 		width: 8.63rem;
// 		height: 8.63rem;
// 		position: absolute;
// 		top: 4.53rem;
// 		left: 50%;
// 		transform: translateX(-50%);
// 	}
//   }
// }

/* 音频详情 */
.j_de {
  min-height: 100vh;
  box-sizing: border-box;
  // padding-bottom: 124px;
  // background-image: url('../../static/img/dbd.png');
  // background: #eeeeee;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .j_de_header {
    // width: 100vw;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    padding: 60px 24px;
    background: #ffffff;

    .j_de_header--banner {
      width: 100%;
      height: 400px;
      background: rgba(76, 116, 82, 1);
      box-shadow: 0px 11px 22px 0px rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      position: relative;
      /deep/ .swiper {
        width: 100%;
        height: 100%;
        .swiper-pagination {
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
      .image {
        width: 100%;
        height: 100%;
        // border-radius: 5px;
      }
      // .eye{
      // 	position: absolute;
      // 	bottom: 5%;
      // 	left: 5%;
      // 	z-index: 20;
      // 	display: flex;
      // 	justify-content: space-between;
      // 	align-items: center;
      // 	img{
      // 		width: 37px;
      // 		height: 26px;
      // 	}
      // 	.look_num{
      // 		font-size: 30px;
      // 		color: #FFFFFF;
      // 		margin-left: 10px;
      // 	}
      // }
      .lanBtn {
        width: 200px;
        height: 50px;
        background: #153d07;
        position: absolute;
        right: 22px;
        bottom: 30px;
        border-radius: 25px;
        display: flex;
        z-index: 20;
        .lan {
          flex: 1;
          border-radius: 25px;
          text-align: center;
          color: #ffffff;
          font-size: 30px;
          line-height: 50px;
          &.check {
            background: #ffc600;
          }
        }
      }
    }

    .j_de_header--progress {
      // background: #B00B09;
      // position: fixed;
      // bottom: 0;
      // left: 0;
      width: 100%;
      // min-height: 124px;
      display: flex;
      align-items: center;
      user-select: none;

      .prog_cont {
        margin-top: 50px;
        width: 709px;
        min-height: 108px;
        background: rgba(239, 239, 239, 1);
        border-radius: 20px;
        flex: 1;
        display: flex;
        align-items: center;

        .middels {
          display: flex;
          flex-direction: column;
          justify-content: center;
          // height: 100%;

          .mttitle {
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            // -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }

        .prog_btn {
          margin-left: 14px;
          width: 66px;
          height: 66px;
          flex-shrink: 0;
          background-size: 100% 100%;
          transition: background-image 0.2s ease-out 0s;
          background-color: #fff;

          &.play {
            background: url('../../static/img/zanting.png') center center
              no-repeat;
            background-size: 100% 100%;
          }

          &.pause {
            background: url('../../static/img/bofang.png') center center
              no-repeat;
            background-size: 100% 100%;
          }
        }

        &_curtime,
        &_durtime {
          color: #82868e;
          font-size: 24px;
        }

        &_line {
          position: relative;
          display: inline-block;
          flex: 1;
          margin: 0 12px 0 24px;
          height: 30px;
          border-radius: 2px;
          .slider-track {
            position: absolute;
            height: 4px;
            left: 0;
            right: 0;
            top: 50%;
            margin-top: -2px;
            background-color: #d2d2d2;
            opacity: 0.3;
          }

          .slider-fill {
            position: absolute;
            height: 4px;
            width: 0%;
            border-radius: 2px;
            background-color: #e27418;
            left: 0;
            top: 50%;
            margin-top: -2px;
          }

          .slider-thumb {
            position: absolute;
            width: 10px;
            height: 22px;
            background-color: #e27418;
            color: #e27418;
            border-radius: 5px;
            left: 50%;
            top: 50%;
            margin-left: -5px;
            margin-top: -11px;
            cursor: pointer;
            &:after {
              display: block;
              content: ' ';
              width: 4px;
              height: 4px;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -2px;
              margin-left: -2px;
              background-color: #e27418;
              border-radius: 50%;
            }
            &:active {
              transform: scale(1.8);
              box-shadow: 0 0 10px #b1b1b1;
            }
          }
        }
      }
    }
  }
  &_body {
    padding: 0 23px 40px 23px;
    box-sizing: border-box;
    background: #ffffff;
    // background: url('../../../static/img/bglogo.png') no-repeat center center;
    // background-size: 382px 411px;
    &--title {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .title {
        width: 100%;
        font-size: 42px;
        color: #000000;
        word-break: break-all;
        text-align: center;
        border-bottom: 1px solid #eeeeee;
        line-height: 94px;
      }
    }

    &--content {
      word-wrap: break-word;
      padding-top: 15px;
      // background-image: url(../../static/img/bglogo.png);
      // background-size: 382px 411px;
      // background-position: center center;
      // background-repeat: no-repeat;
      min-height: 500px;
      padding-bottom: 20px;
      /deep/ p {
        font-size: 28px;
        color: #323232;
        line-height: 1.5;
        @include text_jusify();
      }
    }
  }
}
.btm {
  width: 100%;
  height: 3.4rem;
  // background: #ffffff url(../../../static/img/bottom_bg.png);
  // position: fixed;
  // bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btm .logo {
  width: 7.27rem;
  height: 1.07rem;
}
</style>