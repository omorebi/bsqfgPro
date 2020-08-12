<template>
  <transition name="demo">
    <div class="wrap" v-if="showError">
      <div class="dialog">
        <p class="error-msg">{{ msg }}</p>
        <div class="btn-wrap">
          <span class="btn" @click="goBackHandle">返回</span>
          <span class="btn" @click="reloadHandle">重新刷新</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    data () {
        return {
            showError: false,
            msg: '错误提示'
        }
    },
    methods: {
        goBackHandle () {
            this.showError = false
            window.history.go(-1)
        },
        reloadHandle () {
            this.showError = false
            window.location.reload()
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog {
    width: 80%;
    padding: 10px;
    padding-bottom: 0;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #fff;
    .error-msg {
      text-align: center;
      padding: 15px 0;
      font-size: 14px;
      letter-spacing: 1px;
      border-bottom: 1px solid #ccc;
    }
    .btn-wrap {
      text-align: center;
      display: flex;
      & > span:nth-child(1) {
        border-right: 1px solid #ccc;
      }
      .btn {
        display: inline-block;
        flex: 1;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        line-height: 40px;
      }
    }
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
