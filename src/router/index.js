import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../layout'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: '首页',
        component: () => import('../views/index/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/userCenter',
        name: '个人中心',
        component: () => import('../views/userCenter/index.vue'),
        meta: {
          title: '个人中心'
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '飞流工作室-后台登录'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/index/dashboard.vue'),
    meta: {
      title: '飞流工作室-仪表盘'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
