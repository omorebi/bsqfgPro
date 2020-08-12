<template>
  <div class="mapIn">
    <!-- 展厅 -->
    <div id="mymap"></div>
    <!-- 楼层选择 -->
    <div class="floorTab">
      <div class="floor" @click="checkFloor(i, index)" v-for="(i, index) in map_list" :key="index">
        <p :class="['name', i.map_id == floor?'check':'']">{{i.map_name}}</p>
        <span class="btmLine" v-show="i.map_id == floor"></span>
      </div>
    </div>
    <!-- 右侧工具栏 -->
    <div class="tools">
      <!-- <div class="route" 
                @click="lookRoude" 
                :style="{backgroundImage:`url(${isShowRoute?'static/img/luxian.png':'static/img/luxian2.png'})`}">
                <p class="name">导览路线</p>
      </div>-->
      <div :class="['btn', 'fw', visService?'check':'']" @click="showFw"></div>
      <div class="btn wz" @click="viewCenter"></div>
      <div :class="['btn', 'lx', isShowRoute?'check': '']" @click="lookRoude"></div>
    </div>
    <!-- 底部播放组件 -->
    <!-- v-show="JSON.stringify(checkInfo)!='{}'" -->
    <div class="audio" v-show="JSON.stringify(checkInfo)!='{}'">
      <div class="player">
        <img class="image" :src="checkInfo&&checkInfo.list_img" alt />
        <div class="info">
          <div class="name">
            <p>{{checkInfo&&checkInfo.exhibit_name}}</p>
            <span class="close" @click="closePlayer"></span>
          </div>
          <div class="prog_cont">
            <div class="prog_cont_curtime">{{ currentTime | formatSecond }}</div>
            <div class="prog_cont_line" @touchstart="handleTouchStart">
              <div class="slider-track" ref="track"></div>
              <div class="slider-fill" ref="fill" :style="'width:' + sliderX + '%'"></div>
              <div :class="['slider-thumb']" ref="thumb" :style="'left:' + sliderX + '%;top:50%;'"></div>
            </div>
            <!-- <span class="prog_cont_curtime">/</span> -->
            <div class="prog_cont_durtime">{{ maxTime | formatSecond }}</div>
          </div>
          <audio
            ref="audio"
            preload="auto"
            :src="checkInfo.audio"
            @loadedmetadata="onLoadedmetadata"
            @timeupdate="onTimeupdate"
            @ended="onEnded"
          ></audio>
        </div>
      </div>
      <div class="viewPlay">
        <div class="view" @click="detail(checkInfo.exhibit_id)">看详情</div>
        <div :class="['playbtn', playing ? 'pause' : 'play']" @click="toggleplay">导览讲解</div>
      </div>
    </div>
    <loadingDot msg="音频资源加载中..." :showLoading="showLoading" @handleClose="handleClose"></loadingDot>

    <div class="poptip" v-show="visPop&&checkList.length>1">
      <div class="content">
        <p class="tip">
          <span v-if="playing">正在播放：{{checkInfo.exhibit_name}}</span>
          <span v-else>提示：点击左侧图片按钮可以听语音讲解</span>
        </p>
        <ul class="list">
          <li class="item" v-for="(item, index) in checkList" :key="index">
            <div class="image" @click="playitem(item)">
              <img :src="item.list_img" alt />
              <img
                class="zant"
                v-if="playing&&item.exhibit_id==checkInfo.exhibit_id"
                src="../../static/img/zanting0.png"
                alt
              />
              <img class="bof" v-else src="../../static/img/bofang0.png" alt />
            </div>
            <div class="name" @click="detail(item.exhibit_id)">{{item.exhibit_name}}</div>
            <div class="go" @click="detail(item.exhibit_id)"></div>
          </li>
        </ul>
      </div>
      <div class="guanbi" @click="visPop = false"></div>
    </div>
  </div>
</template>

<script>
import {exhibitionMapInfo} from '../http/interface';
import loadingDot from '@/components/loadingDot.vue';
import '../../static/leaflet/leaflet.js'; //换成自己项目的路径
import '../../static/leaflet/leaflet-ant-path.js'; //换成自己项目的路径

const transTime = value => {
  if (isNaN(value)) {
    return value;
  }
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

// 时间格式化
const formatTime = value => {
  let time = '';
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
  name: '',
  inject: ['app'],
  components: {
    loadingDot,
  },
  data() {
    return {
      map_list: [],
      baseImg: null,
      imgWidth: 0,
      imgHeight: 0,
      floor: 1,
      exhibit_info: [],
      showFloor: false,
      mapImg: '',
      points: [],
      checkInfo: {}, //选中项的信息
      isShowRoute: false,

      //播放器
      sliderX: 0,
      playing: false,
      currentTime: 0,
      maxTime: 0,
      minTime: 0,
      showLoading: false,
      audiosrc: '',
      step: 0.1,
      isFirst: false,
      checkList: [], //选中的展品列表
      visPop: false,
      service_point: [], //服务设施点位
      visService: false,
    };
  },
  mounted() {
    let vm = this;
    // document.title = this.$route.query.title
    vm.getExhibitionMapInfo();
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
        // console.log(value)
        // const isFirst = this.isFirst;
        // if (!isFirst) {
        const isplaying = this.playing;
        if (value && !isplaying) {
          this.showLoading = false;
          this.playing = true;
          this.isFirst = true;
        }
        // }
      },
      deep: true,
      immediate: true, // 默认立即触发一次
    },
    // 'detail.audio': {
    // 	handler: (value) => {

    // 	}
    // }
  },
  methods: {
    async getExhibitionMapInfo() {
      const vm = this;
      try {
        vm.app.showLoading();
        let exhibition_id = this.$route.params.exhibition_id;
        let data = {
          exhibition_id: exhibition_id,
        };
        const res = await exhibitionMapInfo(data);
        vm.map_list = res.data;
        vm.app.hideLoading();
        vm.initializeMap(0);
      } catch (error) {
        console.log(error);
        vm.app.hideLoading();
      }
    },
    /*初始化地图*/
    initializeMap(value) {
      var vm = this;
      vm.mapImg = vm.map_list[value].png_map_path;
      vm.imgHeight = vm.map_list[value].height;
      vm.imgWidth = vm.map_list[value].width;
      vm.floor = vm.map_list[value].map_id;
      vm.exhibit_info = vm.map_list[value].exhibit_info;
      vm.service_point = vm.map_list[value].service_point;
      vm.myMap = L.map('mymap', {
        // 修改坐标系
        crs: L.CRS.Simple,
        zoomControl: false,
        // 设置最大拖动边界
        maxBounds: [
          [-(vm.imgHeight / 1.25), -(vm.imgWidth / 1.25)],
          [vm.imgHeight / 1.25, vm.imgWidth / 1.25],
        ],
        // 设置缩放的最小值
        minZoom: -3,
        // 设置地图放大的最大值
        maxZoom: 1,
        //设置初始化的缩放值
        zoom: -2,
        //设置地图中心点
        center: [0, 0],
        zoomSnap: 0.1,
        wheelPxPerZoomLevel: 600,
      });

      // vm.mapPathImg = baseUrl + vm.map_list[vm.floor_id].img;
      vm.baseImg = L.imageOverlay(vm.mapImg, [
        [-(vm.imgHeight / 2), -(vm.imgWidth / 2)],
        [vm.imgHeight / 2, vm.imgWidth / 2],
      ]).addTo(vm.myMap);
      vm.initExhibit();
    },
    //选择楼层
    checkFloor(value, n) {
      var vm = this;
      // vm.initializeMap(n)
      vm.mapImg = this.map_list[n].png_map_path;
      vm.imgHeight = vm.map_list[n].height;
      vm.imgWidth = vm.map_list[n].width;
      vm.floor = vm.map_list[n].map_id;
      vm.exhibit_info = vm.map_list[n].exhibit_info;

      vm.service_point = vm.map_list[n].service_point;

      vm.baseImg.setUrl(vm.mapImg);
      vm.showFloor = false;
      vm.isShowRoute = false;
      vm.visService = false;
      vm.initExhibit();
      vm.handleClose();
      vm.checkInfo = {};
      // this.mapPathImg = this.map_list[n].img;
      // if(this.isPath){
      //     this.baseImg.setUrl(this.mapPathImg);
      // }else{
      //     this.baseImg.setUrl(this.mapImg);
      // }
      // // 切换楼层重置状态
      // this.resetState()
      // // 切换楼层后设置新的地图边界
      // this.imgHeight = this.map_list[n].height;
      // this.imgWidth = this.map_list[n].width;
      // this.myMap.setMaxBounds([
      //     [-(this.imgHeight / 1.25), -(this.imgWidth / 1.25)],
      //     [this.imgHeight / 1.25, this.imgWidth / 1.25]
      //     ])
      //     // 不同尺寸的地图要重新初始化点位范围
      // let corner1 = L.latLng(-(this.imgHeight / 2), -(this.imgWidth / 2)),
      //     corner2 = L.latLng((this.imgHeight / 2), (this.imgWidth / 2)),
      //     bounds = L.latLngBounds(corner1, corner2);
      // this.baseImg.setBounds(bounds)
    },
    viewCenter() {
      let vm = this;
      vm.myMap.setView([0, 0], -2);
    },
    initExhibit() {
      var vm = this;
      vm.removeAllmarker();
      for (let i = 0; i < vm.exhibit_info.length; i++) {
        var d = vm.exhibit_info[i];
        var nx = d.x - vm.imgWidth / 2;
        var ny = vm.imgHeight / 2 - d.y;
        var myIcon = L.divIcon({
          className: 'points',
          html: `<div class="pointInfo ex_${d.autonum}">
                                    <div class="box1">
                                        <img class="close" src="${
                                          d.icon
                                        }" alt=""/>
                                        <span class="s1">${d.exhibit_list &&
                                          d.exhibit_list[0].exhibit_name}</span>
                                    </div>
                                </div>`,
        });
        var point = L.marker([ny, nx], {
          icon: myIcon,
          title: d.exhibit_name,
          alt: d.autonum,
        }).addTo(vm.myMap);

        point.on('click', function(ev) {
          // if(vm.exhibit_info.exhibit_list&&vm.exhibit_info.exhibit_list.length==1) {
          var id = ev.target.options.alt;
          vm.checkList = vm.exhibit_info.filter(e => {
            return e.autonum == id;
          })[0].exhibit_list;
          if (vm.checkList.length == 1) {
            vm.handleClose();
            vm.checkInfo = vm.checkList[0];
            vm.maxTime = vm.checkInfo.audio_time;
            // vm.$refs.audio.load();
            // vm.$refs.audio.oncanplay =  function(res) {
            //     vm.maxTime = parseInt(res.target.duration);
            // }
          } else if (vm.checkList.length > 1) {
            vm.visPop = true;
          }
          $('.ex_' + id)
            .parent()
            .siblings()
            .find('.pointInfo.on')
            .removeClass('on');
          $('.ex_' + id).addClass('on');
          // }
          // console.log(vm.exhibit_info)
          // var id = ev.target.options.alt;
          // vm.checkInfo = vm.exhibit_info.filter(e => {
          //     return e.autonum == id
          // })[0]
          //     vm.handleClose()
          //     vm.audiosrc = vm.checkInfo.audio
          // vm.$refs.audio.load();
          // vm.$refs.audio.oncanplay =  function(res) {
          //     vm.maxTime = parseInt(res.target.duration);
          // }
          // $(".ex_"+id).parent().siblings().find(".pointInfo.on").removeClass("on");
          // $(".ex_"+id).addClass("on");
        });

        // var x = 2400 - (vm.imgWidth / 2);
        // var y = 1080 - (vm.imgHeight / 2);
        // let test = L.divIcon({
        //     className: "points",
        //     html: `<div class="pointInfo ex_123456">
        //                 <div class="box1">

        //                     <span class="s1">${'123456'}</span>
        //                 </div>
        //             </div>`
        // });
        // var pointtest = L.marker([y, x], {
        //     icon: test,
        //     title: '123',
        //     alt: 0
        // }).addTo(vm.myMap);

        vm.points.push(point);
      }

      // vm.addClickPoint();
    },
    // 删除所有标点
    removeAllmarker: function() {
      var vm = this;
      for (var i in vm.points) {
        vm.points[i].remove();
      }
    },
    detail(id) {
      this.$router.push({
        path: `/exhibit/detail/${id}`,
      });
    },
    lookRoude() {
      let vm = this;
      let n;
      if (vm.isShowRoute) {
        vm.isShowRoute = !vm.isShowRoute;
        vm.map_list.forEach((e, index) => {
          if (e.map_id == vm.floor) {
            n = index;
          }
        });
        vm.mapImg = this.map_list[n].png_map_path;
        vm.baseImg.setUrl(vm.mapImg);
        // vm.initExhibit()
      } else {
        vm.isShowRoute = !vm.isShowRoute;
        vm.map_list.forEach((e, index) => {
          if (e.map_id == vm.floor) {
            n = index;
          }
        });
        vm.mapImg = this.map_list[n].road_map_path;
        vm.baseImg.setUrl(vm.mapImg);
        // vm.removeAllmarker()
      }
    },

    //播放器部分
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
    toggleplay() {
      this.playing ? this.pause() : this.play();
    },
    // 暂停音频
    pause() {
      // console.log('暂停音频')
      this.playing = false;
      this.$refs.audio.pause();
    },
    // 播放音频
    play() {
      // console.log('播放')
      this.sliderX ? (this.playing = true) : (this.showLoading = true);
      this.$refs.audio.play();
    },
    onLoadedmetadata() {},
    onTimeupdate(res) {
      let vm = this;
      vm.currentTime = res.target.currentTime;
      // vm.$refs.audio.oncanplay =  () => {
      vm.maxTime = parseInt(res.target.duration) || vm.checkInfo.audio_time;
      // console.log(vm.maxTime)
      // debugger
      vm.sliderX = parseInt((vm.currentTime / vm.maxTime) * 100);
      // }
    },
    // 播放结束
    onEnded() {
      this.currentTime = 0;
      this.sliderX = 0;
      this.playing = false;
      // this.currentTime = 0;
      // this.maxTime = 0;
      // this.sliderX = 0;
      // this.showLoading = false;
      // this.playing = false;
      // this.isFirst = false;
      // this.$refs.audio.load();
    },
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
    handleClose() {
      this.currentTime = 0;
      this.maxTime = 0;
      this.sliderX = 0;
      this.showLoading = false;
      this.playing = false;
      this.isFirst = false;
      this.$refs.audio.load();
    },
    getDetail(detail) {
      let vm = this;
      vm.checkInfo = detail;
      // this.$refs.audio.load();
      vm.maxTime = vm.checkInfo.audio_time;
    },
    playitem(detail) {
      let vm = this;
      if (detail.exhibit_id == vm.checkInfo.exhibit_id) {
        vm.toggleplay();
      } else {
        vm.handleClose();
        // vm.getDetail(detail)
        vm.checkInfo = detail;
        // vm.$refs.audio.load();
        // vm.$refs.audio.oncanplay =  function(res) {
        vm.maxTime = vm.checkInfo.audio_time;
        this.$nextTick(() => {
          vm.toggleplay();
        });
        // }
      }
    },
    showFw() {
      this.removeAllmarker();
      this.visService = !this.visService;
      if (this.visService) {
        this.initfw();
      } else {
        this.initExhibit();
      }
    },
    initfw() {
      var vm = this;
      vm.removeAllmarker();
      for (let i = 0; i < vm.service_point.length; i++) {
        var d = vm.service_point[i];
        var nx = d.x - vm.imgWidth / 2;
        var ny = vm.imgHeight / 2 - d.y;
        var myIcon = L.divIcon({
          className: 'points',
          html: `<div class="pointInfo ex_${d.autonum}">
                                    <div class="box1">
                                        <img class="closes" src="${d.img}" alt=""/>
                                    </div>
                                </div>`,
        });
        // <span class="s1">${d.service_name}</span>
        var point = L.marker([ny, nx], {
          icon: myIcon,
          title: d.service_name,
          alt: d.autonum,
        }).addTo(vm.myMap);

        point.on('click', function(ev) {
          // if(vm.exhibit_info.exhibit_list&&vm.exhibit_info.exhibit_list.length==1) {

          var id = ev.target.options.alt;
          // vm.checkList = vm.exhibit_info.filter(e => {
          //     return e.autonum == id
          // })[0].exhibit_list
          // if(vm.checkList.length == 1) {
          //     // vm.handleClose()
          //     // debugger
          //     vm.checkInfo = vm.checkList[0]
          //     vm.maxTime = vm.checkInfo.audio_time
          //     // vm.$refs.audio.load();
          //     // vm.$refs.audio.oncanplay =  function(res) {
          //     //     vm.maxTime = parseInt(res.target.duration);
          //     // }
          // }else if(vm.checkList.length > 1){
          //     vm.visPop = true
          // }
          // $(".ex_"+id).parent().siblings().find(".pointInfo.on").removeClass("on");
          // $(".ex_"+id).addClass("on");
        });
        vm.points.push(point);
      }
    },
    closePlayer() {
      this.handleClose();
      $('.ex_' + this.checkInfo.autonum)
        .parent()
        .siblings()
        .find('.pointInfo.on')
        .removeClass('on');
      this.checkInfo = {};
    },
  },
};
</script>

<style lang="scss" scoped>
/** @format */

@import '../style/mixin.scss';
.mapIn {
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 94px;
  /deep/ #mymap {
    width: 100%;
    height: 100%;
    .leaflet-control-container {
      display: none;
    }
    .points {
      width: 0 !important;
      height: 0 !important;
      margin: 0 !important;
      .pointInfo {
        width: 0;
        height: 0;
        &.on .box1 {
          .close {
            animation: bigAnim 0.8s ease-in-out infinite alternate-reverse;
          }
        }
        @keyframes bigAnim {
          from {
            transform: translate(-50%) scale(1);
          }
          to {
            transform: translate(-50%) scale(1.5);
          }
        }
        .box1 {
          display: flex;
          flex-direction: column;
          .close {
            width: 72px;
            height: 80px;
            position: absolute;
            left: 0;
            bottom: 0;
            transform: translate(-50%);
            // left: 50%;
            // transform: translate(-50%);
          }
          .closes {
            width: 72px;
            height: 72px;
            position: absolute;
            left: 0;
            bottom: 0;
            transform: translate(-50%);
          }
          .s1 {
            border-radius: 20px;
            font-size: 26px;
            font-weight: 400;
            z-index: 9;
            width: auto;
            height: 40px;
            text-align: center;
            padding: 0.2vw 1vw;
            background: #ffffff;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(-50%);
            box-sizing: content-box;
            max-width: 140px;
          }
        }
      }
    }
  }
  .tools {
    width: 103px;
    height: auto;
    position: absolute;
    right: 10px;
    top: 85px+94px;
    z-index: 1000;
    .btn {
      width: 104px;
      height: 104px;
      background: #fff;
      margin-bottom: 10px;
      cursor: pointer;
      &.fw {
        background: url('../../static/img/fw.png') no-repeat center center;
        background-size: 100% 100%;
        &.check {
          background: url('../../static/img/fw2.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &.wz {
        background: url('../../static/img/wz.png') no-repeat center center;
        background-size: 100% 100%;
      }
      &.lx {
        background: url('../../static/img/lx.png') no-repeat center center;
        background-size: 100% 100%;
        &.check {
          background: url('../../static/img/lx2.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    .route {
      width: 103px;
      height: 103px;
      border-radius: 5px;
      background-color: #b11f35;
      background-repeat: no-repeat;
      background-position: center 5px;
      background-size: 20px 18px;
      margin-bottom: 15px;
      border: 1px solid #780404;
      .name {
        font-size: 9px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding-top: 28px;
        text-align: center;
        white-space: nowrap;
      }
    }
    .lou {
      background-size: 29px 19px;
    }
  }
}

@keyframes moveFromRight {
  0% {
    transform: translateX(100%);
  }
}
.floorTab {
  width: 100%;
  height: 94px;
  background: #f3f1f2;
  position: absolute;
  top: 0;
  display: flex;
  z-index: 1000;
  .floor {
    flex: 1;
    text-align: center;
    font-size: 34px;
    font-weight: 500;
    color: rgba(100, 100, 100, 1);
    line-height: 94px;
    position: relative;
    cursor: pointer;
    .name {
      &.check {
        color: #e27418;
      }
    }
    .btmLine {
      width: 98px;
      height: 6px;
      background: rgba(160, 2, 20, 1);
      border-radius: 3px;
      display: inline-block;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      animation: moveFromLeft 0.6s ease both;
    }
  }
}
// 播放器
.audio {
  width: 690px;
  height: 276px;
  background: rgba(255, 255, 255, 1);
  border-radius: 24px;
  position: absolute;
  bottom: 58px;
  left: 50%;
  transform: translate(-50%);
  z-index: 500;
  // display: flex;
  // align-items: center;
  padding: 30px;
  box-shadow: 0px 10px 9px 1px rgba(58, 0, 0, 0.15);
  .player {
    height: 110px;
    width: 100%;
    // background: #dddddd;
    display: flex;
    .image {
      width: 110px;
      height: 110px;
      border-radius: 10px;
      margin-right: 31px;
    }
    .info {
      flex: 1;
      .name {
        font-size: 34px;
        font-weight: bold;
        color: rgba(50, 50, 50, 1);
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        p {
          width: 415px;
          @include ellipsis(1);
        }
        .close {
          width: 36px;
          height: 36px;
          background: url('../../static/img/guanbi0.png') no-repeat center
            center;
          background-size: 100% 100%;
          display: inline-block;
          cursor: pointer;
        }
      }
      .prog_cont {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin-left: 20px;

        &_curtime {
          color: #82868e;
          font-size: 24px;
        }
        &_durtime {
          color: #82868e;
          font-size: 24px;
        }

        &_line {
          position: relative;
          display: inline-block;
          flex: 1;
          margin: 0 12px;
          height: 30px;
          // background: #EEEEEE;
          border-radius: 2px;

          // &:active .slider-thumb {
          //   transform: scale(1.8);
          //   box-shadow: 0 0 10px #999;
          // }
          .play {
            // background: url(../assets/images/zanting.png) no-repeat center center;
            background-size: 100% 100%;
          }

          .pause {
            // background: url(../assets/images/bofang.png) no-repeat center center;
            background-size: 100% 100%;
          }
          .slider-track {
            position: absolute;
            height: 6px;
            left: 0;
            right: 0;
            top: 50%;
            margin-top: -1px;
            background-color: #d5d5d5;
            transform: translateY(-50%);
          }

          .slider-fill {
            position: absolute;
            height: 6px;
            width: 0%;
            border-radius: 2px;
            background-color: #e27418;
            left: 0;
            top: 50%;
            margin-top: -1px;
            transform: translateY(-50%);
          }

          .slider-thumb {
            position: absolute;
            top: 50%;
            width: 10px;
            height: 22px;
            background-color: #e27418;
            color: #e27418;
            left: 50%;
            margin-left: -6px;
            transform: translateY(-50%);
            border-radius: 5px;
            // margin-top: -6px;
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
              border-radius: 50%;
            }

            &:active {
              transform: scale(1.8);
              transform-origin: center center;
              box-shadow: 0 0 10px #b1b1b1;
            }
          }
        }
      }
    }
  }
  .viewPlay {
    width: 100%;
    height: 70px;
    // background: pink;
    margin-top: 36px;
    display: flex;
    .view {
      width: 240px;
      height: 70px;
      font-size: 30px;
      font-weight: 500;
      color: rgba(50, 50, 50, 1);
      line-height: 70px;
      border-radius: 35px;
      // padding: 0 53px 0 99px;
      background: #eeeeee url('../../static/img/xiangqing.png') no-repeat 53px
        center;
      background-size: 30px 30px;
      text-indent: 93px;
      margin-right: 30px;
    }
    .playbtn {
      width: 360px;
      height: 70px;
      font-size: 30px;
      font-weight: 500;
      color: #ffffff;
      line-height: 70px;
      border-radius: 35px;
      text-indent: 135px;
      &.play {
        background: rgba(160, 2, 20, 1) url('../../static/img/bofang0.png')
          no-repeat 98px center;
        background-size: 30px 30px;
      }
      &.pause {
        background: rgba(160, 2, 20, 1) url('../../static/img/zanting0.png')
          no-repeat 98px center;
        background-size: 30px 30px;
      }
    }
  }
}

.poptip {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  .content {
    width: 100%;
    max-height: 585px;
    background: #f8f8f8;
    overflow-y: auto;
    .tip {
      height: 70px;
      width: 100%;
      font-size: 26px;
      font-weight: bold;
      color: rgba(50, 50, 50, 1);
      line-height: 70px;
      text-align: center;
      background: #ffffff;
      margin-bottom: 18px;
    }
    .list {
      background: #ffffff;
      .item {
        width: 100%;
        height: 140px;
        border-bottom: 1px solid #f8f8f8;
        display: flex;
        align-items: center;
        padding: 20px 30px;
        cursor: pointer;
        .image {
          width: 100px;
          height: 100px;
          background: #dddddd;
          margin-right: 30px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
          }
          .bof {
            width: 28px;
            height: 36px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
          .zant {
            width: 28px;
            height: 36px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
        }
        .name {
          font-size: 32px;
          font-weight: bold;
          color: rgba(50, 50, 50, 1);
          line-height: 140px;
          flex: 1;
          @include ellipsis(1);
        }
        .go {
          width: 26px;
          height: 26px;
          background: url('../../static/img/jinru.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
  .guanbi {
    width: 60px;
    height: 60px;
    background: url('../../static/img/guanbi1.png') no-repeat center center;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 200px;
  }
  // .tip{
  // height: 70px;
  // width: 100%;
  // font-size:26px;
  // font-weight:bold;
  // color:rgba(50,50,50,1);
  // line-height:70px;
  // }
  // .list{
  // width: 100%;
  // height: 585px;
  // background: #ffffff;
  // }
}
</style>