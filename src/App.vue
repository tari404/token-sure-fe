<template>
  <div id="app">
    <div id="nav">
      <div class="logo"><img src="@/assets/logo.png" height="50px" alt="logo" />TokenSure</div>
      <div class="wallet">
        <i class="ri-wallet-line"></i>
        <span v-if="account">{{ account }}</span>
        <span v-else>未连接钱包</span>
      </div>
    </div>
    <router-view v-if="!loading" />
    <div class="loading-layer" v-else v-loading="true"></div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ hasMetamask ? '未能获取账户地址' : '未检测到metamask' }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      loading: true,
      dialogVisible: false,
      hasMetamask: true
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      apy: state => state.apy
    })
  },
  async created() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(this.updateAccount)
        .catch(() => {
          this.dialogVisible = true
        })
    } else {
      this.hasMetamask = false
      this.dialogVisible = true
    }
    axios.get('https://api1.dfi.money/liquidity/pools/').then(res => {
      const map = res.data.data
      for (const m of map) {
        this.apy.set(m.name, Number(m.apy.match(/[\d.]+/)[0]))
      }
      this.loading = false
    })
  },
  beforeDestroy() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.off('accountsChanged', this.updateAccount)
      window.ethereum.off('chainChanged', this.updateChain)
    }
  },
  methods: {
    updateAccount(accounts) {
      this.$store.commit('SET_ACCOUNT', accounts[0])
      if (window.ethereum.chainId) {
        this.updateChain(window.ethereum.chainId)
      }
    },
    updateChain(chainId) {
      this.$store.commit('SET_CHAIN_ID', Number(chainId))
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/reset.styl'

#app
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  display flex
  flex-direction column

#nav
  padding 0 30px
  flex 0 0 80px
  background-color #fff
  display flex
  justify-content space-between
  align-items center
  color #606266
  position relative
  &:after
    content ''
    position absolute
    top 80px
    left 0
    height 4px
    width 100%
    background-image linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)
  .logo
    font-size 20px
    display flex
    align-items center
    color #244384
    img
      margin-right 6px
      font-weight 500
  .wallet
    display flex
    align-items center
    i
      margin-right 4px
.loading-layer
  margin-top 4px
  flex 1 1 auto
</style>
