<template>
  <div>
    <div class="lanTab">
      <div
        v-for="lan in lans"
        :key="lan.id"
        :class="['lanBtn', lan.name?'':'zy', lan.id==cheLan?'check':'']"
        @click="checkLan(lan.id)"
      >
        <!-- 中文 -->
        {{lan.name || ''}}
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                lans: [
                    {
                        name: '中文',
                        id: 1
                    },
                    {
                        name: '日本語',
                        id: 3
                    },
                    {
                        id: 10
                    }
                ]
            }
        },
        computed: {
            cheLan() {
                return this.$store.state.lan;
            },
        },
        methods: {
            checkLan(id) {
                // this.cheLan = id
                this.$emit('change', id)
                // this.$store.commit('setLan', id)
            }
        }
    }
</script>

<style lang="scss" scoped>
/** @format */

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
    color: #c33c1d;
    line-height: 60px;
    background: #ffffff;
    border-radius: 30px;
    text-align: center;
    &.check {
      background: #c33c1d;
      color: #ffffff;
    }
    &.zy {
      background: url('../../static/img/zy1.png') no-repeat center center;
      background-size: 100% 100%;
      &.check {
        background: url('../../static/img/zy2.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
}
</style>