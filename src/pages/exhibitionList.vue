<template>
  <div class="container">
    <!-- <div class="topalert">
      <div class="dengpao"></div>
      <div class="tishi">温馨提示：</div>
      <div class="wrap">
        // 外框，固定宽度
        <div id="box">
          // 内部滚动框
          <div id="marquee">{{guntext}}</div>
          //展示的文字
          <div id="copy"></div>
          // 文字副本，为了实现无缝滚动
        </div>
        <div id="node">{{guntext}}</div>
        //为了获取text实际宽度
      </div>
    </div>-->
    <div class="exhibition" v-bind:key="i" v-for="(a,i) in list">
      <router-link class="center" :to="'/basics/list/'+a.exhibition_id">
        <img class="img" :src="a.exhibition_full_img" alt />
        <div class="textDiv">
          <div class="myCon">
            <div class="shudao"></div>
            <div class="detail">{{a.exhibition_name}}</div>
            <!-- <img class="jiantou" src="../../static/img/jinru-color.png" alt /> -->
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import {exhibitionList} from '../http/interface';
export default {
  inject: ['app'],
  data() {
    return {
      guntext:
        '为了不影响他人的参观，请您务必自带耳机收听语音导览，以保持展厅安静！',
      list: '',
      skip: 0,
      take: 10,
      isfirst: true,
    };
  },
  mounted: function() {
    var vm = this;
    vm.getList();
  },
  updated: function() {
    this.move();
  },
  methods: {
    move() {
      // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
      // let width = document.getElementById('node').getBoundingClientRect().width;
      // let box = document.getElementById('box');
      // let copy = document.getElementById('copy');
      // copy.innerText = ''; // 文字副本填充
      let distance = 0; // 位移距离
      //设置位移
      // setInterval(function() {
      //   distance = distance - 1;
      //    如果位移超过文字宽度，则回到起点
      //   if (-distance >= width + 180) {
      //     distance = 60;
      //   }
      //   box.style.transform = 'translateX(' + distance + 'px)';
      // }, 30);
    },
    async getList() {
      var vm = this;
      try {
        // vm.app.showLoading()
        const res = await exhibitionList({
          skip: vm.skip,
          take: vm.take,
          // exhibition_id: vm.exhibition_id
        });
        console.log(res);
        // debugger;
        if (res.status == 1) {
          if (vm.isfirst) {
            let data = res.data.theme;
            data.forEach(e => {
              e.cur = 0;
            });
            // debugger;
            vm.list = data;
            vm.busy = false;
            if (res.data.theme.length < vm.take) {
              //如果第一次加载数量少于设定数量表示没有更多了
              vm.more = false;
              vm.busy = true;
            }
          } else {
            let data = res.data.theme;
            data.forEach(e => {
              e.cur = 0;
            });
            vm.list = vm.list.concat(data); //如果后续加载数量为零则没有更多了
            if (res.data.theme.length == 0) {
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
    // get_more() {
    //   // console.log('触发更多')
    //   // debugger
    //   let vm = this;
    //   vm.skip += vm.take;
    //   vm.isloading = true;
    //   vm.busy = true;
    //   vm.getList(false);
    // }
  },
};
</script>

<style lang="scss" scoped>
/** @format */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px;
  .topalert {
    width: 750px;
    height: 50px;
    background: rgba(218, 230, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(35, 35, 35, 1);

    .dengpao {
      width: 24px;
      height: 24px;
      background: url('../../static/img/tishi.png') no-repeat center center;
      background-size: 100% 100%;
      margin-left: 29px;
    }
    .tishi {
      margin-left: 10px;
      width: 120px;
    }
    .wrap {
      overflow: hidden;
      max-width: 430px;
      #box {
        width: 80000%;
        div {
          float: left;
        }
        #marquee {
          margin: 0 16px 0 0;
        }
        .copy {
        }
      }
      #node {
        position: absolute;
        z-index: -999;
        top: -999999px;
      }
    }
  }
  .exhibition {
    margin-bottom: 30px;
    width: 690px;
    height: 429px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(94, 11, 11, 0.15);
    border-radius: 10px;

    .img {
      height: 345px;
      width: 100%;
      border-radius: 10px 10px 0px 0px;
    }
    .textDiv {
      width: 100%;
      height: 94px;
      display: flex;
      justify-content: center;
      align-items: center;
      // border-bottom: 2px solid rgba(220, 220, 220, 1);
      .myCon {
        width: 100%;
        display: flex;
        justify-content: left;
        align-items: center;
        height: 84px;
        position: relative;
        .shudao {
          width: 6px;
          height: 36px;
          background: #c33c1d;
          position: absolute;
          left: 0px;
          top: 21px;
        }
        .detail {
          font-size: 30px;
          font-family: PingFang SC;
          // font-weight: bold;
          color: rgba(35, 35, 35, 1);
          text-indent: 24px;
          text-align: left;
        }
        .jiantou {
          width: 28px;
          height: 32px;
          position: absolute;
          right: 24px;
          top: 23px;
        }
      }
    }
  }
}
</style>