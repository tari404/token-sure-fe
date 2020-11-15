import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const testData = {
  yfii: [
    {
      address: '0xd76bb6fdd24aA5f85ef614Ab3008190cB279953F',
      name: 'eth-dai'
    },
    {
      address: '0xd76bb6fdd24aA5f85ef614Ab3008190cB279953F',
      name: 'eth-usdc'
    },
    {
      address: '0xd76bb6fdd24aA5f85ef614Ab3008190cB279953F',
      name: 'eth-usdt'
    },
    {
      address: '0xd76bb6fdd24aA5f85ef614Ab3008190cB279953F',
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

// const testRecords = [
//   {
//     token: 'ETH-USDT',
//     amount: 12000,
//     apy: 9.32,
//     dir: 'in',
//     finished: false
//   },
//   {
//     token: 'ETH-USDT',
//     amount: 23100,
//     apy: 2.32,
//     dir: 'out',
//     finished: true
//   },
//   {
//     token: 'ETH-WBTC',
//     amount: 120,
//     apy: 2.32,
//     dir: 'in',
//     finished: true
//   }
// ]

// const testList = [
//   {
//     token: 'ETH-USDT',
//     amount: 12000,
//     apy: 9.32,
//     dir: 'in'
//   },
//   {
//     token: 'ETH-WBTC',
//     amount: 120,
//     apy: 2.32,
//     dir: 'in'
//   },
//   {
//     token: 'ETH-USDT',
//     amount: 12000,
//     apy: 9.32,
//     dir: 'in'
//   },
//   {
//     token: 'ETH-USDT',
//     amount: 23100,
//     apy: 2.32,
//     dir: 'out'
//   }
// ]

export default new Vuex.Store({
  state: {
    account: '',
    chainId: 1,
    apy: new Map(),
    protocol: testData,

    records: [],
    list: []
  },
  mutations: {
    SET_CHAIN_ID(state, id) {
      state.chainId = id
    },
    SET_ACCOUNT(state, account) {
      state.account = account
      // console.log(account)
      // state.account = '0xE00f86BC7377cfEaFA6F369BcCeb4a2cc151849c'
    },
    SET_MINE_INFO(state, { records, list }) {
      state.records = records
      state.list = list
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
