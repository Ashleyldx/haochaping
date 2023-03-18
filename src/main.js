import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import Vant from 'vant'
import 'vant/lib/index.css'
import './utils/vant'
// 引入echarts
import echarts from 'echarts'
// vue全局注入echarts
Vue.prototype.$echarts = echarts

// Vue.use(ElementUI);
// Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
