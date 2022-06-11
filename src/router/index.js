import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AccountManager from '@/components/AccountManager'
import GroupManager from '@/components/GroupManager'
import PersonalCenter from '@/components/PersonalCenter'
import ConesAdd from '@/components/ConesAdd'
import ConesList from '@/components/ConesList'
import DispatchList from '@/components/DispatchList'
import WarningInfo from '@/components/WarningInfo'
import DispatchAdd from '@/components/DispatchAdd'
import DispatchAudit from '@/components/DispatchAudit'
import LocationShow from '@/components/LocationShow'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [{
      path: 'AccountManager',
      name: 'AccountManager',
      component: AccountManager
    },
    {
      path: 'GroupManager',
      name: 'GroupManager',
      component: GroupManager
    },
    {
      path: 'PersonalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter
    },
    
    {
      path: 'DispatchAdd',
      name: 'DispatchAdd',
      component: DispatchAdd
    },
    {
      path: 'DispatchAudit',
      name: 'DispatchAudit',
      component: DispatchAudit
    },

    

    {
      path: 'ConesAdd',
      name: 'ConesAdd',
      component: ConesAdd
    },
    {
      path: 'ConesList',
      name: 'ConesList',
      component: ConesList
    },
    {
      path: 'WarningInfo',
      name: 'WarningInfo',
      component: WarningInfo
    },
    {
      path: 'DispatchList',
      name: 'DispatchList',
      component: DispatchList
    },
    {
      path: 'LocationShow',
      name: 'LocationShow',
      component: LocationShow
    },]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token')
  if (to.name === 'Login') {
    next();
  } else {
    if (token) {
      next()
    } else {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }
  }
});


export default router
