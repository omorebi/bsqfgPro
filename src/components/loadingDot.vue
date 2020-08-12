<template>
  <transition name="loading">
    <div class="loading" v-if="showLoading" @click="handleClose">
      <div class="loading__wrap" @click.stop>
        <div v-if="!!msg" class="loading__text">{{msg}}</div>
        <div class="loading__dot">
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <i></i>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    msg: {
      type: String,
      default: '加载中...'
    },
    showLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose');
    }
  }
};

</script>
<style lang="scss" scoped>
/** @format */

.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.35);

  &__wrap {
    padding: 20px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 10px;
  }

  &__text {
    font-size: 26px;
  }

  &__dot {
    position: relative;
    width: 80px;
    line-height: 10px;
    margin: 10px auto 0;
    display: flex;

    p,
    i {
      line-height: 1;
      width: 10px;
      height: 10px;
      margin: 4px;
      border-radius: 100%;
      flex-shrink: 0;
    }

    p {
      background-color: #cacaca;
    }

    //小圆点移动的动画
    i {
      position: absolute;
      left: 0;
      top: 0;
      background-color: #fff;
      -webkit-animation: animDotMove 0.6s steps(1, end) infinite;
      animation: animDotMove 0.6s steps(1, end) infinite;
    }

    @-webkit-keyframes animDotMove {
      0% {
        left: 0;
      }

      25% {
        left: 18px;
      }

      50% {
        left: 36px;
      }

      75% {
        left: 54px;
      }

      100% {
        left: 0;
      }
    }

    @keyframes animDotMove {
      0% {
        left: 0;
      }

      25% {
        left: 18px;
      }

      50% {
        left: 36px;
      }

      75% {
        left: 54px;
      }

      100% {
        left: 0;
      }
    }
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: 0.3s ease-out;
}

.loading-enter {
  transform: scale(1.2);
  opacity: 0;
}

.loading-leave-to {
  opacity: 0;
  transform: scale(1);
}
</style>
