<template>
  <div>
    <span class="btn" @click="routerGo('/basics/list')">清风馆语音导览</span>
    <span class="btn" @click="routerGo('/exhibitionList')">基本陈列</span>
    <span class="btn" @click="routerGo('/venue_introduction')">博物馆简介</span>
    <span class="btn" @click="routerGo('/visitNotes')">参观须知</span>
    <span class="btn" @click="routerGo('/posInfo')">位置信息</span>
    <!-- <span class="btn" @click="routerGo('/explainingAppointment')">讲解预约</span> -->
    <span class="btn" @click="routerGo('/volunteer')">志愿服务</span>
    <span class="btn" @click="routerGo('/news')">社教活动</span>
    <span class="btn" @click="routerGo('/messageBoard')">留言板</span>
    <span class="btn" @click="routerGo('/guided')">地图导览</span>
    <span class="btn" @click="routerGo('/myscan')">扫一扫</span>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    routerGo(path) {
      const vm = this;
      vm.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
/** @format */

div {
  text-align: center;
}
.btn {
  display: inline-block;
  width: 80%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  height: 80px;
  line-height: 80px;
  border-radius: 40px;
  margin: 10px;
  color: #fff;
  // font-size: 12px;
}
</style>
