<template>
  <div id="app">
    <keep-alive>
      <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>
    <transition name="demo">
      <Loading v-if="loadingShow" type="circular"></Loading>
    </transition>
  </div>
</template>
<script>
import loading from '@/components/loading.vue'

export default {
    name: 'App',
    provide () {
        return {
            app: this
        }
    },
    data () {
        return {
            loadingShow: false
        }
    },
    components: {
        'Loading': loading
    // 'loadingDot': loadingDot,
    },
    mounted() {
      let lan = window.localStorage.getItem('lan')
      
      if (lan) {
        this.$store.commit('setLan', lan);
      } else {
        this.$store.commit('setLan', 1);
      }
    },
    methods: {
        showLoading () {
            this.loadingShow = true
        },
        hideLoading () {
            this.loadingShow = false
        }
    }
}

</script>
<style lang="scss">
#app{
  width: 100%;
  min-height: 100vh;
  // background: url('../static/img/bg.png');
  background-size: 100% auto;
  background-repeat: repeat-y;
  overflow: hidden;
}
/* 自定义颜色 */
#nprogress .bar {
  background-color: #AD2229 !important;
}

.demo-enter-active,
.demo-leave-active {
  transition: 0.3s ease-out;
}

.demo-enter {
  opacity: 0;
}

.demo-leave-to {
  opacity: 0;
}

</style>
