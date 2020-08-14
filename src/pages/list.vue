<template>
  <div class="online">
    <div class="j_de_header--banner">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide class="slide" v-for="(info, index) in imglist" :key="index">
          <img class="image" :src="info" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <audio
      ref="audio"
      id="faudio"
      preload="auto"
      @timeupdate="audiotimeupdate"
      @ended="audioended"
      :src="audio"
    ></audio>
    <div v-if="list.length" class="list exlist">
      <div v-for="(a,i) in list" :key="i" :class="['cell',a.audio?'':'hascell']">
        <router-link class="image" :to="'/exhibit/detail/'+a.id">
          <div class="img">
            <img :src="a.exhibit_img" />
          </div>
        </router-link>
        <router-link class="center" :to="'/exhibit/detail/'+a.id">
          <div class="title">{{a.exhibit_name}}</div>
          <div :class="['content',a.audio?'hascontent':'']">{{ a.desc }}</div>
        </router-link>
        <div class="fenge"></div>
        <div
          class="right"
          v-if="a.audio"
          :style="{backgroundImage:'url(' + ((i==playi&&isplaying)? zhezhaoImg:'') + ')'}"
        >
          <!-- <div class="zhezhao" :hidden="(i!=playi||!isplaying)">
            <img src="../../static/img/zhezhao.png" alt />
          </div>-->
          <my-progress
            radius="2.13rem"
            :percent="i == playi ? Math.min(1, a.cur/(a.audio_time-1)) : 0"
          >
            <div
              class="btn"
              :class="{'on':true,'play':(i==playi&&isplaying)}"
              @click="toggleplay(i)"
            ></div>
          </my-progress>
          <span class="time">{{(a.audio_time-1)-a.cur | formatSecond}}</span>
          <!-- {{a.audio_time}} -->
        </div>
      </div>
    </div>
    <div v-if="!list.length" class="null">
      <img src="../../static/img/kongneirong.png" />
      <p>精彩内容即将呈现~</p>
    </div>
    <div
      infinite-scroll-disabled="busy"
      infinite-scroll-immediate-check="false"
      infinite-scroll-distance="50"
    >
      <div class="loading" v-if="more">
        <div class="demo-spin-container" v-if="isloading">
          <Spin fix>
            <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
          </Spin>
        </div>
        <div v-if="isloading">加载中...</div>
      </div>
      <div class="nomore" v-if="!more" v-show="list.length">没有更多了</div>
    </div>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk';
import app from '../assets/js/App';
import {toThumbsimg} from '../assets/js/toThumbsimg';
import myProgress from '../components/progress';
import changeLan from '../components/changeLan';
import {exhibitList,exhibitInfo} from '../http/interface';
//   import {mapState,mapGetters,mapActions} from 'vuex';
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
  name: 'online_list',
  inject: ['app'],
  components: {
    myProgress,
    changeLan,
  },
  data() {
    return {
      zhezhaoImg: require('../../static/img/zhezhao.png'),
      imglist: [],
      isGetMore: true,
      isloading: false,
      exhibition_id: null,
      exhibition: {},
      list: [],
      is_show: false,
      is_show2: false,
      skip: 0,
      take: 10,
      playi: null,
      isplaying: false,
      audio: '',
      busy: false,
      more: true,
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
      keyword: '',
      isSearch: false,
    };
  },
  created: function() {},
  mounted: function() {
    //   vm.getExhibitionLbImg();
    //   vm.initWx()
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return transTime(second);
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'exhibitdetail') {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    // console.log('bbbbbb' + to.meta.isBack);
    next();
  },
  activated() {
    this.exhibition_id = this.$route.params.exhibition_id;
    if (!this.$route.meta.isBack) {
      // console.log('qqqqqqqqqq' + this.$route.meta.isBack);
      this.getList(true); /*清空查询条件*/
    }
  },
  deactivated() {
    this.playi = 0;
    this.isplaying = false;
    this.list = this.list;
  },
  methods: {

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
          
          vm.maxTime = res.data.audiotime - 1;
          vm.imglist = vm.detail.exhibit_imgs;
          
          if(vm.imglist.length > 1){
            vm.canswip = true;
          }else{
            vm.canswip = false;
          }
          // vm.initWx()
        }
        vm.app.hideLoading();
      } catch (error) {
        vm.app.hideLoading();
      }
    },

    change(value) {
      this.audioended();
      this.$store.commit('setLan', value);
      this.skip = 0;
      this.is_show = false;
      this.is_show2 = false;
      this.keyword = '';
      this.getList(true);
    },
    play() {
      this.$refs.audio.play();
    },
    async initWx() {
      let vm = this;
      try {
        const res = await wxInfo();
        if (res.status == 1) {
          // console.log(res)
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: [
              'scanQRCode',
              'updateAppMessageShareData', //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              'updateTimelineShareData', //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
              'onMenuShareWeibo', //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async search(keyword) {
      let vm = this;
      if (keyword) {
        try {
          vm.app.showLoading();
          let data = {
            keyword: keyword,
          };
          const res = await exhibitSearch(data);
          // console.log(res)
          if (res.status == 1) {
            let data = res.data;
            data.forEach(e => {
              e.cur = 0;
            });
            vm.list = res.data;
            vm.busy = true;
            vm.isSearch = true;
          }
          vm.app.hideLoading();
        } catch (error) {
          vm.app.hideLoading();
        }
      } else {
        this.skip = 0;
        this.take = 10;
        vm.busy = false;
        this.getList(true);
      }
    },
    /*生成缩略图链接*/
    thumbsimg: function(path, width, height, type) {
      return toThumbsimg(path, width, height, type);
    },
    /*加载展厅*/
    async getExhibitionLbImg() {
      let vm = this;
      try {
        vm.app.showLoading();
        const res = await exhibitionLbImg();
        if (res.status == 1) {
          vm.imgList = res.data;
        }
        vm.app.hideLoading();
      } catch (error) {
        vm.app.hideLoading();
      }
    },
    /*加载展品列表*/
    async getList(isfirst) {
      var vm = this;
      try {
        // vm.app.showLoading()
        const res = await exhibitList({
          num: 0,
          id: vm.exhibition_id,
        });
        if (res.status == 1) {
          vm.imglist = res.data.exhibition_detail_imgs;
          if (isfirst) {
            let data = res.data.exhibit_info;
            data.forEach(e => {
              e.cur = 0;
            });
            vm.list = data;
            vm.busy = false;
            if (res.data.exhibit_info.length < vm.take) {
              //如果第一次加载数量少于设定数量表示没有更多了
              vm.more = false;
              vm.busy = true;
            }
          } else {
            let data = res.data.exhibit_info;
            data.forEach(e => {
              e.cur = 0;
            });
            vm.list = vm.list.concat(data); //如果后续加载数量为零则没有更多了
            if (res.data.exhibit_info.length == 0) {
              vm.busy = true;
              vm.more = false;
            } else {
              vm.busy = false;
            }
          }
          vm.isloading = false;
          if (vm.list.length) {
            vm.is_show = true;
          } else {
            vm.is_show2 = true;
          }
        }
        // vm.app.hideLoading()
      } catch (error) {
        console.log(error);
        // vm.app.hideLoading()
      }
    },
    //加载更多
    get_more() {
      // console.log('触发更多')
      // debugger
      let vm = this;
      vm.skip += 10;
      vm.isloading = true;
      vm.busy = true;
      vm.getList(false);
    },
    /*播放进度*/
    audiotimeupdate: function() {
      var vm = this;
      vm.list[vm.playi].cur = faudio.currentTime || 0;
    },
    // /*播放结束*/
    audioended: function() {
      var vm = this;
      faudio.pause();
      vm.isplaying = false;
      vm.playi = null;
      vm.list.forEach(e => {
        e.cur = 0;
      });
    },
    // /*播放暂停切换*/
    toggleplay(i) {
      var vm = this;

      if (vm.playi === i) {
        // 关闭
        vm.isplaying = !vm.isplaying;
      } else {
        vm.playi = i;
        vm.list.forEach(e => {
          e.cur = 0;
        });
        vm.audio = vm.list[i].audio;
        vm.$refs.audio.load();
        vm.isplaying = true;
      }
      if (vm.isplaying) {
        vm.$nextTick(() => {
          vm.$refs.audio.play();
        });
      } else {
        vm.$refs.audio.pause();
      }
    },
    /*时间格式化 mm:ss*/
    timeFormat: function(t) {
      // console.log(t)
      var minute = parseInt(t / 60);
      var second = parseInt(t % 60);
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      return minute + ':' + second;
    },
    clearKeyword() {
      this.keyword = '';
      this.isSearch = false;
      this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
/** @format */

.online {
  width: 100%;
  min-height: 100vh;
  position: relative;
  // overflow-y: auto;
  .lanTab {
    width: 100vw;
    height: 94px;
    background: #f3f1f2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .lanBtn {
      width: 180px;
      height: 60px;
      font-size: 32px;
      font-weight: 500;
      color: #e27418;
      line-height: 60px;
      background: #ffffff;
      border-radius: 30px;
      text-align: center;
      &.zy {
        background: url('../../static/img/zy1.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
  .tools {
    width: 100%;
    height: 100px;
    display: flex;
    padding: 19px;
    // background: #EDEDED;
    .search {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f3f3;
      border-radius: 31px;
      .sousuo {
        // background: #ffffff;
        height: 100%;
        width: 61px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        border-radius: 6px 0 0 6px;
        img {
          width: 21px;
          height: 21px;
        }
      }
      form {
        width: 100%;
        height: 100%;
        position: relative;
        .clear {
          display: inline-block;
          width: 26px;
          height: 26px;
          position: absolute;
          right: 19px;
          top: 50%;
          transform: translateY(-50%);
          background: url('../../static/img/sosuo_quxiao.png') no-repeat center
            center;
          background-size: 100% 100%;
        }
      }
      input {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 0 6px 6px 0;
        border: none;
        outline: none;
        font-size: 24px;
        background: transparent;
      }
    }
    .cancel {
      font-size: 30px;
      font-weight: 500;
      color: rgba(50, 50, 50, 1);
      width: 110px;
      display: inline-block;
      line-height: 62px;
      text-align: center;
    }
  }
}
.exhibition {
  width: 100%;
  height: 350px;
  position: relative;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .image {
    width: 100%;
    height: 350px;
  }
}

/*加载更多*/
.getmore {
  .text {
    width: 300px;
    height: auto;
    margin: 0 auto;
    font-size: 30px;
    line-height: 200%;
    text-align: center;
    color: #999;
    &:active {
      color: #a97d7b;
    }
  }
  // .demo-spin-container {
  //     display: block;
  //     width: 50px;
  //     height: 50px;
  //     margin: 0 auto;
  //     position: relative;
  //     border: 1px solid #fff;
  //     .demo-spin-icon-load {
  //         color: #a97d7b;
  //         animation: ani-demo-spin 1s linear infinite;
  //     }
  // }
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.j_de_header--banner {
  width: 100%;
  height: 350px;
  position: relative;
  margin: 0 auto;
  background-size: contain;
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

.exlist {
  width: 100%;
  // background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px;
  padding-bottom: 0;
  .cell {
    width: 100%;
    height: 200px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(79, 6, 5, 0.15);
    border-radius: 10px;
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    &.hascell {
      padding-right: 30px;
    }
    .image {
      position: relative;
      margin-right: 35px;
      .img {
        width: 140px;
        height: 140px;
        margin-left: 20px;
        // background: #f6cccd;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        img {
          display: block;
          width: 180px;
          height: 180px;
          border-radius: 12px;
        }
      }
    }
    .center {
      height: 80%;
      // width: 363px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-size: 30px;
        // line-height: 1.2rem;
        color: #323232;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .content {
        font-size: 26px;
        color: #909090;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        &.hascontent {
          width: 343px;
        }
      }
    }
    .fenge {
      width: 2px;
      height: 150px;
      background: rgba(0, 33, 71, 0.2);
    }
    .right {
      height: 100%;
      width: 138px;
      padding-left: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;

      // .zhezhao {
      //   width: 74px;
      //   height: 58px;
      //   position: absolute;
      //   top: 20%;
      //   left: 50%;
      //   img {
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
      background-size: 74px 58px;
      background-position: 71px 45px;
      background-repeat: no-repeat;
      // background-image: url('../../static/img/zhezhao.png');

      .time {
        font-size: 20px;
        color: #646464;
        display: block;
        margin-top: 15px;
      }
      .btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        position: absolute;
        top: 0px;
        left: 0px;
        // transform: translateY(-50%);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        background-repeat: no-repeat;
        &.on {
          background-image: url('../../static/img/play_btn.png');
          background-size: 40px 40px;
          background-position: center center;
        }
        &.play {
          background-image: url('../../static/img/playing_btn.png');
          background-size: 40px 40px;
          // border: 1px solid #E0E0E0;
          background-position: center center;
        }
      }
    }
  }
}
.null {
  padding-top: 15%;
  text-align: center;
  font-size: 30px;
  img {
    display: block;
    width: 25%;
    margin: 0 auto 1rem;
  }
}
.loading {
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
    .ivu-spin-fix {
      z-index: 0;
    }
    .demo-spin-icon-load {
      color: #a97d7b;
      animation: ani-demo-spin 1s linear infinite;
    }
  }
}
.nomore {
  font-size: 20px;
  text-align: center;
  color: lightgray;
}
</style>
