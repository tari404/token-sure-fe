import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Token from '../views/Token.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:protocol/:name',
    name: 'Token',
    component: Token,
    props: route => ({
      protocol: route.params.protocol,
      name: route.params.name
    })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
