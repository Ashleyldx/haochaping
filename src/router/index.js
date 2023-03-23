import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import layout from '../views/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home') // 首页
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my') // 我的
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video') // 视频
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/question')  // 问答
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
