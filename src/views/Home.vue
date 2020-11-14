<template>
  <div class="home">
    <div class="card">
      <h2>选择协议</h2>
      <el-select v-model="protocol" placeholder="请选择">
        <el-option
          v-for="item in protocolOptions"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-table :data="table" class="table">
        <el-table-column prop="name" label="代币集" width="110"></el-table-column>
        <el-table-column prop="amount" label="代币余额"></el-table-column>
        <el-table-column prop="value" label="代币现值"></el-table-column>
        <el-table-column prop="apy" label="资金池APY">
          <template slot-scope="scope">
            {{ scope.row.apy ? scope.row.apy + '%' : '--' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="onClick(scope.row)" type="text" size="small">投保</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import { mapState } from 'vuex'

const web3 = new Web3('https://api.infura.io/v1/jsonrpc/mainnet')

const protocolOptions = [
  { label: 'YFII', value: 'yfii' },
  { label: 'Yearn', value: 'yearn' },
  { label: 'dForce', value: 'dforce' },
  { label: 'AAVE', value: 'aave' },
  { label: 'Compund', value: 'compound' },
  { label: 'Uniswap', value: 'uni' },
  { label: 'Sushiswap', value: 'sushi' },
  { label: 'Balancer', value: 'bal' }
]

export default {
  name: 'Home',
  data() {
    return {
      protocolOptions,
      protocol: 'yfii',

      table: []
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      apy: state => state.apy,
      allProtocol: state => state.protocol
    })
  },
  watch: {
    protocol() {
      this.update()
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    onClick(row) {
      this.$router.push(`/${this.protocol}/${row.name}`)
    },
    update() {
      this.table = this.allProtocol[this.protocol].map(item => {
        const i = {
          address: item.address,
          name: item.name.toUpperCase(),
          amount: '...',
          value: '...',
          apy: this.apy.get(item.name)
        }
        web3.eth
          .call({
            to: item.address,
            data: '0x70a08231' + this.account.substr(2).padStart(64, '0')
          })
          .then(res => {
            i.amount = web3.utils.fromWei(res)
          })
        return i
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.home
  flex 1 1 auto
  display flex
  align-items center
  justify-content space-around
  background-color #f6faff
.card
  width 800px
  padding 20px
  border-radius 8px
  background-color #fff
  box-shadow 0 4px 10px rgba(#40325e, 0.05)
h2
  font-size 18px
  font-weight 400
  margin-bottom 16px
.table
  margin-top 16px
</style>
