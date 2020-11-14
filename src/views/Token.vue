<template>
  <div class="token">
    <div class="op-container">
      <div class="title">
        <span>Token集</span> <b>{{ name }}</b>
        <p v-if="apy">
          <span>APY:</span> <b>{{ apy }}%</b>
        </p>
      </div>
      <div class="op-content">
        <div class="list">
          <div class="tabel-title">
            <span>现值</span>
            <span>让利APY</span>
          </div>
          <div class="tabel">
            <div>
              <ul class="tabel-in">
                <li v-for="(item, i) in inList" :key="i" class="tabel-row" @click="selectIn(item)">
                  <span>{{ item.amount }}</span>
                  <span style="color: #ea0070;">{{ item.apy.toFixed(2) }}%</span>
                </li>
              </ul>
              <div class="apy-line-row">
                <span></span>
                <span v-if="inList[0] && outList[0]">
                  {{ ((inList[0].apy + outList[0].apy) / 2).toFixed(2) }}%
                </span>
              </div>
              <ul class="tabel-out">
                <li
                  v-for="(item, i) in outList"
                  :key="i"
                  class="tabel-row"
                  @click="selectOut(item)"
                >
                  <span>{{ item.amount }}</span>
                  <span style="color: #74a700;">{{ item.apy.toFixed(2) }}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="op">
          <div>
            <p>承接保单</p>
            <div class="form" :class="{ 'in-form-focus': focus === 'in' }">
              <el-form ref="inForm" :model="inForm" label-width="100px">
                <el-form-item label="承保代币数量">
                  <el-input v-model="inForm.amount" type="number"></el-input>
                </el-form-item>
                <el-form-item label="最小APY获利">
                  <el-input v-model="inForm.apy" type="number">
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <p class="pledge-token"><span>预计质押Token: </span>--</p>
            <div class="button in-button" :active="!!(inForm.amount && inForm.apy)">确认</div>
          </div>
          <div>
            <p>
              生成保单
              <span class="token-balance">
                <span>可用{{ name }}:</span> {{ balance }}
              </span>
            </p>
            <div class="form" :class="{ 'out-form-focus': focus === 'out' }">
              <el-form ref="outForm" :model="outForm" label-width="100px">
                <el-form-item label="待保代币数量">
                  <el-input v-model="outForm.amount" type="number"></el-input>
                </el-form-item>
                <el-form-item label="最大APY让利">
                  <el-input v-model="outForm.apy" type="number">
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <p class="gas-notice"><i class="el-icon-info" />需缴纳铸币费 0.001 Gas</p>
            <div class="button out-button" :active="!!(outForm.amount && outForm.apy)">确认</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub-container">
      <transition-group name="fade" fill-mode="out-in">
        <Records v-if="opened === 'records'" @close="opened = ''" key="records" />
        <List v-if="opened === 'list'" @close="opened = ''" key="list" />
      </transition-group>
    </div>
    <div class="menu">
      <router-link to="/">返回主页</router-link>
      <a @click="opened = 'records'">成交记录</a>
      <a @click="opened = 'list'">挂单列表</a>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import { mapGetters, mapState } from 'vuex'

import Records from '@/components/Records'
import List from '@/components/List'

const web3 = new Web3('https://api.infura.io/v1/jsonrpc/mainnet')

export default {
  name: 'Token',
  components: {
    Records,
    List
  },
  props: {
    protocol: String,
    name: String
  },
  data() {
    return {
      timer: 0,
      outList: [],
      inList: [],

      inForm: {
        amount: '',
        apy: ''
      },
      outForm: {
        amount: '',
        apy: ''
      },

      focus: '',
      opened: '',
      balance: '...'
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      apyMap: state => state.apy
    }),
    ...mapGetters(['contractAddr']),
    apy() {
      const a = this.apyMap.get(this.name.toLowerCase())
      return a ? a : ''
    }
  },
  watch: {
    account() {
      this.init()
    }
  },
  created() {
    this.init()
    this.update()
    this.timer = setInterval(this.update, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    init() {
      const addr = this.contractAddr(this.protocol, this.name)
      if (addr && this.account) {
        web3.eth
          .call({
            to: addr,
            data: '0x70a08231' + this.account.substr(2).padStart(64, '0')
          })
          .then(res => {
            this.balance = web3.utils.fromWei(res)
          })
      }
    },
    update() {
      const testInList = []
      for (let i = 0; i < 30; i++) {
        testInList.push({
          amount: Math.floor(Math.random() * 100 + 1) * 10 ** Math.floor(Math.random() * 3 + 1),
          apy: Math.random() * 5 + 9
        })
      }
      this.inList = testInList.sort((a, b) => a.apy - b.apy)

      const testOutList = []
      for (let i = 0; i < 30; i++) {
        testOutList.push({
          amount: Math.floor(Math.random() * 100 + 1) * 10 ** Math.floor(Math.random() * 3 + 1),
          apy: Math.random() * 6 + 3
        })
      }
      this.outList = testOutList.sort((a, b) => b.apy - a.apy)
    },
    selectOut(item) {
      this.inForm = {
        amount: item.amount.toString(),
        apy: item.apy.toFixed(2)
      }
      this.outForm = {
        amount: '',
        apy: item.apy.toFixed(2)
      }
      this.focus = 'in'
    },
    selectIn(item) {
      this.outForm = {
        amount: item.amount.toString(),
        apy: item.apy.toFixed(2)
      }
      this.inForm = {
        amount: '',
        apy: item.apy.toFixed(2)
      }
      this.focus = 'out'
    }
  }
}
</script>

<style lang="stylus" scoped>
.token
  flex 1 1 auto
  display flex
  background-color #f6faff
.op-container
  margin 30px
  padding 20px 30px 30px
  flex 1 0 800px
  max-width 1000px
  border-radius 8px
  background-color #fff
  box-shadow 0 4px 10px rgba(#40325e, 0.05)
  display flex
  flex-direction column
  >.title
    margin-bottom 14px
    padding-bottom 12px
    border-bottom solid 1px #f6f6f6
    span
      font-size 12px
      color #606266
    b
      color #5868bb
    p
      display inline
      padding-left 160px
      font-size 14px
  .op-content
    flex 1 1 auto
    display flex
    .list
      flex 0 0 360px
      margin-right 50px
      display flex
      flex-direction column
    .op
      flex 1 1 auto
      display grid
      grid-gap 20px
      grid-template-rows repeat(2, 1fr)
    ul
      display flex
      flex-direction column
      position relative
      &:before
        font-family 'element-icons'
        position absolute
        left 50%
        transform translateX(-50%)
        font-size 20px
        opacity .2
      li
        cursor pointer
        position relative
      li:hover
        background-color rgba(#e3ecf7, .3)
    .tabel-in
      flex-flow column-reverse
      &:before
        content '\e78f承接保单'
        bottom 4px
        color #ea0070
    .tabel-out
      &:before
        content '\e790发布保单'
        top 4px
        color #74a700
  .tabel-title
    display flex
    justify-content space-between
    font-size 14px
    margin 2px 0 6px
  .tabel
    flex 1 1 auto
    overflow hidden
    position relative
    >div
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)
  .tabel-row
    padding 0 2px
    display flex
    justify-content space-between
    font-family monospace
  .apy-line-row
    display flex
    justify-content space-between
    font-family monospace
    padding 8px 0
    font-size 18px
    font-weight 500
    color #333
  .form
    margin-top 16px
    padding 22px 14px 0
    border-radius 6px
    border solid 1px #eee
    transition all .2s ease-out
  .in-form-focus
    border-color #eaad00
    box-shadow 0 2px 6px rgba(234, 0, 112, .4)
  .out-form-focus
    border-color #ead800
    box-shadow 0 2px 6px rgba(116, 167, 0, .4)
  .button
    margin-top 10px
    height 40px
    border-radius 3px
    display flex
    align-items center
    justify-content center
    background-color #eee
    color #aaa
    cursor not-allowed
    transition all .16s ease-out
    &[active]
      color #fff
      cursor pointer
  .out-button[active]
      background-color #74a700
  .in-button[active]
      background-color #d61d73
.menu
  flex 0 0 180px
  margin 30px 30px 30px 0
  display flex
  flex-direction column
  a
    margin-bottom 20px
    height 40px
    border-radius 3px
    color #fff
    display flex
    justify-content center
    align-items center
    background-color #1D8FE1
    background-image linear-gradient(225deg, #22E1FF, #1D8FE1 60%, #1D8FE1)
    background-size 200% 100%
    transition all .2s ease-out
    &:hover
      background-position-x 100%

.token-balance
  font-size 14px
  float right
  span
    color #606266
.pledge-token
  font-size 14px
  margin 8px 0 4px
  span
    color #606266
.gas-notice
  font-size 14px
  margin 8px 0 4px
  color #606266
  i
    margin-right 4px

.sub-container
  flex 1 1 auto
  margin 30px
  position relative

.fade-enter, .fade-leave-to
  opacity 0
  transform translateX(30px)
.fade-enter-active, .fade-leave-active
  transition all .2s
</style>
