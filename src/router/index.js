import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Traders from '@/components/traders/traders'
import Trader from '@/components/traders/trader'
import Station from '@/components/property/stations/station'
import Unit from '@/components/property/units/unit'
import Lease from '@/components/leases/lease'
import Payment from '@/components/payments/payment'
import Balance from '@/components/accounts/balance'
import User from '@/components/users/user'
import Signup from '@/components/users/signup'
import Signin from '@/components/users/signin'
import Logout from '@/components/users/logout'
import { store } from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/traders/traders', name: 'Traders', component: Traders,
    beforeRouteEnter: checkAuth },
    { path: '/traders/trader/new', name: 'TraderNew', component: Trader, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/traders/trader/:id', name: 'TraderEdit', component: Trader, props:true,
    beforeRouteEnter: checkAuth},
    { path: '/payments/payment', name: 'Payments', component: Payment ,
    beforeRouteEnter: checkAuth},
    { path: '/property/units/unit', name: 'Unit', component: Unit,
    beforeRouteEnter: checkAuth },
    { path: '/property/stations/station', name: 'Station', component: Station,
    beforeRouteEnter: checkAuth },
    { path: '/leases/lease', name: 'Lease', component: Lease,
    beforeRouteEnter: checkAuth },
    { path: '/accounts/balance', name: 'Balance', component: Balance,
    beforeRouteEnter: checkAuth },
    { path: '/users/user', name: 'User', component: User },
    { path: '/users/signup', name: 'Signup', component: Signup },
    { path: '/users/signin', name: 'Signin', component: Signin },
    { path: '/users/logout', name: 'Logout', component: Logout }
  ],
  mode:'history'
})

function checkAuth(to, from, next) {
//  if (!store.state.authorized) {
  if (!store.state.user) {
        next('/users/signin')  // they are not authorized, so redirect to login
  } else {
    next() // we are authorized, continue on to the requested route
 }
}
