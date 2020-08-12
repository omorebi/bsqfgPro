<template>
  <transition name="demo">
    <div class="toast" v-if="theToast">
      <div class="toast__text">
        {{msg}}
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    data () {
        return {
            theToast: false,
            msg: ''
        }
    }
}

</script>
<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &__text {
    padding: 20px;
    font-size: 30px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 5px;
    z-index: 999;
  }
}

.demo-enter-active,
.demo-leave-active {
  transition: 0.3s ease-out;
}

.demo-enter {
  opacity: 0;
  transform: scale(1.2);
}

.demo-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

</style>
