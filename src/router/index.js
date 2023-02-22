import Vue from 'vue'
import VueRouter from 'vue-router'
import jwt from 'jsonwebtoken'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

// 同步加载
// import Login from '../views/Login.vue';
// import Register from '../views/Register.vue';
// import App from '../views/App.vue';
// import Dashboard from '../views/Dashboard.vue';
// import Admin from '../views/Admin.vue';

// 异步加载（懒加载）
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const App = () => import('../views/App.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Admin = () => import('../views/Admin.vue')
const Menu = () => import('../views/Menu.vue')
const Role = () => import('../views/Role.vue')
const Carousel = () => import('../views/Carousel.vue')
const Productcate = () => import('../views/Productcate.vue')
const Product = () => import('../views/Product.vue')

const defaultActive = localStorage.getItem('default-active') || '/app/dashboard'

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/app',
      component: App,
      meta: { requireAuth: true },
      children: [
        { path: '', redirect: defaultActive },
        { path: 'dashboard', component: Dashboard, meta: { requireAuth: true } },
        { path: 'admin', component: Admin, meta: { requireAuth: true } },
        { path: 'menu', component: Menu, meta: { requireAuth: true } },
        { path: 'role', component: Role, meta: { requireAuth: true } },
        { path: 'carousel', component: Carousel, meta: { requireAuth: true } },
        { path: 'productcate', component: Productcate, meta: { requireAuth: true } },
        { path: 'product', component: Product, meta: { requireAuth: true } }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  const token = localStorage.getItem('SC-Token')
  try {
    jwt.verify(token, '0513')
    if (to.path === '/login') next('/app')
  } catch (err) {
    console.log(err)
    /* 验证token发送错误，退出到登录页面
    1. token无效
    2. 密钥错误
    3. token过期
    */
    if (to.meta.requireAuth) next('/login')
  }

  next()
})

router.afterEach(() => NProgress.done())

export default router
