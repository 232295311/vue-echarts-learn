import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式文件
import './assets/css/global.less'
// 引入字体文件
import './assets/font/iconfont.css'
import axios from 'axios'
// 请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到vue的原型对象上
// this.$http即可获得axios对象
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到vue的原型对象上
// this.$echarts即可获得实例对象
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
