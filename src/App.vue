<template>
  <div id="app">
    <div id="nav">
      <div class="logo">TokenSure</div>
      <div class="wallet">
        <i class="ri-wallet-line"></i>
        <span v-if="contract">{{ contract }}</span>
        <span v-else>未连接钱包</span>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      contract: state => state.contract
    })
  }
}
</script>

<style lang="stylus">
@import '~@/assets/reset.styl'

#nav
  padding 0 30px
  height 80px
  background-color #fff
  border-bottom solid 1px #dfdfdf
  display flex
  justify-content space-between
  align-items center
  color #666
  .logo
    font-size 20px
  .wallet
    display flex
    align-items center
    i
      margin-right 4px
</style>
