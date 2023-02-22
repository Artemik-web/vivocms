
import './assets/css/style.less'

import Vue from 'vue'
import router from './router'
import store from './store'
import http from './utils/http'

// ElementUI 全局安装
import ElementUI from 'element-ui'

// 指定了主题颜色
import './assets/theme/index.css'

// 导入mock接口
import './api'

Vue.use(ElementUI)

// 在vue实例上挂载http对象，这样在任何组件内部 this.$http
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: h => h('router-view')
}).$mount('#app')
