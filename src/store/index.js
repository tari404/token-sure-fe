import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const testData = {
  yfii: [
    {
      address: '0x19d994471D61d36FE367928Cc58102a376089D1f',
      name: 'eth-dai'
    },
    {
      address: '0x68A23248000d5d4C943EE685989998c1B19bD74E',
      name: 'eth-usdc'
    },
    {
      address: '0x7E43210a4c6831D421f57026617Fdfc8ED3A0baf',
      name: 'eth-usdt'
    },
    {
      address: '0xb918368082655fA223c162266ecd88Aa7Ae40bc9',
      name: 'eth-wbtc'
    }
  ],
  yearn: [],
  dforce: [],
  aave: [],
  compound: [],
  uni: [],
  sushi: [],
  bal: []
}

const testRecords = [
  {
    token: 'ETH-USDT',
    amount: 12000,
    apy: 9.32,
    dir: 'in',
    finished: false
  },
  {
    token: 'ETH-USDT',
    amount: 23100,
    apy: 2.32,
    dir: 'out',
    finished: true
  },
  {
    token: 'ETH-WBTC',
    amount: 120,
    apy: 2.32,
    dir: 'in',
    finished: true
  }
]

const testList = [
  {
    token: 'ETH-USDT',
    amount: 12000,
    apy: 9.32,
    dir: 'in'
  },
  {
    token: 'ETH-WBTC',
    amount: 120,
    apy: 2.32,
    dir: 'in'
  },
  {
    token: 'ETH-USDT',
    amount: 12000,
    apy: 9.32,
    dir: 'in'
  },
  {
    token: 'ETH-USDT',
    amount: 23100,
    apy: 2.32,
    dir: 'out'
  }
]

export default new Vuex.Store({
  state: {
    account: '',
    chainId: 1,
    apy: new Map(),
    protocol: testData,

    records: testRecords,
    list: testList
  },
  mutations: {
    SET_CHAIN_ID(state, id) {
      state.chainId = id
    },
    SET_ACCOUNT(state, account) {
      // state.account = account
      console.log(account)
      state.account = '0x000000004fa9e635dBe91C83aEe357d01494936D'
    }
  },
  getters: {
    contractAddr(state) {
      return (protocol, name) => {
        name = name.toLowerCase()
        const tokenList = state.protocol[protocol]
        if (!tokenList) {
          return ''
        }
        const token = tokenList.find(item => item.name === name)
        return token ? token.address : ''
      }
    }
  },
  actions: {},
  modules: {}
})
