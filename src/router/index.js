import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Traders from '@/components/traders/traders'
import Trader from '@/components/traders/trader'

import Notes from '@/components/notes/notes'
import Note from '@/components/notes/note'

import Payments from '@/components/payments/payments'
import Payment from '@/components/payments/payment'

import Stations from '@/components/property/stations/stations'
import Station from '@/components/property/stations/station'
import Units from '@/components/property/units/units'
import Unit from '@/components/property/units/unit'
import Lease from '@/components/leases/lease'
import Leases from '@/components/leases/leases'
import Balance from '@/components/accounts/balance'
import User from '@/components/users/user'
import Signup from '@/components/users/signup'
import Signin from '@/components/users/signin'
import Logout from '@/components/users/logout'
import { store } from '../store'

Vue.use(Router) //dfsd

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },

    { path: '/traders/traders', name: 'Traders', component: Traders,
    beforeRouteEnter: checkAuth },
    { path: '/traders/trader/new', name: 'TraderNew', component: Trader, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/traders/trader/:id', name: 'TraderEdit', component: Trader, props:true,
    beforeRouteEnter: checkAuth},

    { path: '/note/notes', name: 'Notes', component: Notes,
    beforeRouteEnter: checkAuth },
    { path: '/notes/note/new,:leaseId', name: 'NoteNew', component: Note, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/notes/note/:id,:leaseId', name: 'NoteEdit', component: Note, props:true,
    beforeRouteEnter: checkAuth},

    { path: '/payments/payments', name: 'Payments', component: Payments,
    beforeRouteEnter: checkAuth },
    { path: '/payments/payment/new, :leaseId', name: 'PaymentNew', component: Payment, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/payments/payment/:id, :leaseId', name: 'PaymentEdit', component: Payment, props:true,
    beforeRouteEnter: checkAuth},

    { path: '/property/units/units', name: 'Units', component: Units,
    beforeRouteEnter: checkAuth },
    { path: '/property/units/unit/new', name: 'UnitNew', component: Unit, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/property/units/unit/:id', name: 'UnitEdit', component: Unit, props:true,
    beforeRouteEnter: checkAuth },

    { path: '/property/stations/stations', name: 'Stations', component: Stations,
    beforeRouteEnter: checkAuth },
    { path: '/property/stations/station/new', name: 'Station', component: Station, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/property/stations/station/:id', name: 'StationEdit', component: Station, props:true,
    beforeRouteEnter: checkAuth },

    { path: '/leases/leases', name: 'Leases', component: Leases,
    beforeRouteEnter: checkAuth },
    { path: '/leases/lease/new', name: 'LeaseNew', component: Lease, props:true,
    beforeRouteEnter: checkAuth },
    { path: '/leases/lease/:id', name: 'LeaseEdit', component: Lease, props:true,
    beforeRouteEnter: checkAuth },

    { path: '/accounts/balance', name: 'Balance', component: Balance,
    beforeRouteEnter: checkAuth },

    { path: '/users/user', name: 'User', component: User, beforeRouteEnter: checkAuth  },

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
