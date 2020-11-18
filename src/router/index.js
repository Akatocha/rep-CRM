import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from "../views/Test.vue"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if(localStorage['jwt']){
        next({ name: 'Dashboard' })
      }else {next()}
    }
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: Test
  // },
  {
    path: '/leads/cold',
    name: 'Cold`sList',
    component: () => import('../views/Cold`sList.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/roles/permission',
    name: 'Permission',
    component: () => import('../views/Permission.vue')
  },
  {
    path: '/api/source_acces',
    name: 'Source_access',
    component: () => import('../views/SourceAccess.vue')
  },
  {
    path: '/api/brokers',
    name: 'api_brokers',
    component: () => import('../views/api_s/Broker_list.vue')
  },
  {
    path: '/api/comparision',
    name: 'Status_compressions',
    component: () => import('../views/leads/Status_compressions.vue')
  },
  {
    path: '/leads/statuses',
    name: 'AllStatuses',
    component: () => import('../views/leads/Statuses_all.vue')
  },
  {
    path: '/leads',
    name: 'Leads',
    component: () => import('../views/Leads.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import('../views/Rules.vue')
  },
  {
    path: '*',
    name: 'Error 404',
    component: () => import('../views/Error_404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage['jwt']){
    next({ name: 'Login' })
  }else {next()}
})
export default router
