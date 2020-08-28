import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import user from '@/components/user.vue'
import retail from '@/components/retail.vue'
import takeOrder from '@/components/takeOrder.vue'
import dispatch from '@/components/dispatch.vue'
import resetpwd from '@/pages/resetPwd.vue'
import cards from '@/pages/cards.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/index/resetpwd',
      name: 'resetpwd',
      component: resetpwd
    },
    {
      path: '/index/cards',
      name: 'cards',
      component: cards
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/retail',
      name: 'retail',
      component: retail
    },
    {
      path: '/takeOrder',
      name: 'takeOrder',
      component: takeOrder
    },
    {
      path: '/dispatch',
      name: 'dispatch',
      component: dispatch
    }
  ]
})
