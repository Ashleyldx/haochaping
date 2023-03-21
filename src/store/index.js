import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'haochaping_USER'

export default new Vuex.Store({
  state: {
    // 是一个对象，存储当前登录用户信息（token等数据）
    user:JSON.parse(window.localStorage.getItem('haochaping_USER'))
  },
  getters: {
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      // 为了防止数据刷新丢失，需要把数据备份到本地存储
      window.localStorage.setItem('haochaping_USER',JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
  }
})
