<template>
  <div class="progress-circle" :style="{'background':percent?'':''}">
    <svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>
<script>
const RADIUS = '1rem';
export default {
  props: {
    radius: {
      type: String,
      default: RADIUS,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dashArray: Math.PI * 100,
    };
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    },
  },
};
</script>
<style scoped lang="scss">
/** @format */

.progress-circle {
  position: relative;
  border-radius: 50% 0 0 50%;
  width: 100%;
  height: 58px;
  svg {
    background: #fff;
    border-radius: 50%;
    position: absolute;
    width: 58px;
    height: 58px;
    top: 0;
    left: 0;
    circle {
      stroke-width: 6px;
      transform-origin: center;

      &.progress-background {
        progresscolor: #fff;
        progressbackgroundcolor: #fff;
        transform: scale(0.9);
        stroke: #f1eff2;
      }

      &.progress-bar {
        background-color: transparent;
        transform: scale(1) rotate(-90deg);
        stroke: #e27418;
      }
    }
  }
}
</style>
