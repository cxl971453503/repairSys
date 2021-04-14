import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/vant.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios包
import axios from 'axios'
// 将axios挂载到vue
Vue.prototype.$http = axios;
// 配置根路径
axios.defaults.baseURL = "http://127.0.0.1:9999/"

import qs from 'qs'
Vue.prototype.$qs = qs

// 阻止启动生产消息
Vue.config.productionTip = false

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径来 
  // next 是一个行数，表示方形
  // next() 放行 next('/login') 强制跳转
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // 没有token，强制跳转到登录页
  if(!tokenStr) {
    console.log(tokenStr);
    return next('/login')
  };
  next();
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
