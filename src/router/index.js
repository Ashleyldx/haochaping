import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import layout from '../views/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component:login
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/views/video')
  },
  {
    path: '/question',
    name: 'question',
    component: () => import('@/views/question')
  }
]

const router = new VueRouter({
  routes
})

export default router
