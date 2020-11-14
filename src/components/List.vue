<template>
  <div class="records">
    <ul>
      <li v-for="(item, i) in list" :key="i" :class="`record-item record-item-${item.dir}`">
        <p>{{ item.dir === 'in' ? '承接保单' : '发布保单' }}</p>
        <span class="token">{{ item.amount }} {{ item.token }}</span>
        <span class="apy"><span style="color: #606266;">APY: </span>{{ item.apy }}%</span>
        <el-button @click="toRemove(item)" type="text" size="small">撤销</el-button>
      </li>
    </ul>
    <div class="close" @click="$emit('close')"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Records',
  computed: {
    ...mapState({
      account: state => state.account,
      list: state => state.list
    })
  },
  mounted() {
    const list = this.$el.querySelectorAll('li')
    for (let i = 0; i < list.length; i++) {
      const el = list[i]
      el.style.animation = `fade-in .2s ${0.1 * i}s forwards`
    }
  },
  methods: {
    toRemove(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.records
  position absolute
  top 0
  right 0
  width 400px
  height 100%
  background-image linear-gradient(to left, #f6fafe 70%, rgba(#f6fafe, 0))
  border-radius 8px
.record-item
  margin-bottom 10px
  padding 10px 16px
  background-color #fff
  border-radius 6px
  border-left solid 6px
  box-shadow 0 4px 10px rgba(#40325e, 0.1)
  font-size 14px
  position relative
  opacity 0
  p
    color #606266
  .token
    width 150px
    display inline-block
  .apy
    display inline-block
  button
    position absolute
    top 50%
    right 14px
    transform translateY(-50%)
.record-item-in
  border-left-color #ea0070
.record-item-out
  border-left-color #74a700

.close
  margin 36px auto 0
  width 40px
  height 40px
  border-radius 50%
  border solid 2px #ddd
  background-color #f6faff
  position relative
  cursor pointer
  opacity .6
  transition opacity .16s
  &:hover
    opacity 1
  &:before, &:after
    content ''
    width 26px
    height 2px
    position absolute
    top 17px
    left 5px
    background-color #ddd
    transform rotate(45deg)
  &:after
    transform rotate(-45deg)
</style>
