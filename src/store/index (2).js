import Vue from 'vue'
import Vuex from 'vuex'
import {leaseModule} from './modules/lease'
import {unitModule} from './modules/unit'
import {paymentModule} from './modules/payment'
import {traderModule} from './modules/trader'
import {stationModule} from './modules/station'

Vue.use(Vuex)

export const store = new Vuex.Store({
  namespaced:true,
  modules:{
    leaseModule, unitModule, paymentModule, traderModule, stationModule
  },
  state: {
      user: null,
      error:null,
      loading:false
  },
  mutations:{
    setUser(state,payload){
      state.user = payload
      },
    setError(state,payload){
      state.error = payload
    },
    clearError(state){
      state.error = null;
    },
    setLoading(state, loadState){
      state.loading = loadState
    }


  },
  actions:{ 
    setUser({commit}, payload){
        commit('setUser',payload);
    },
    setError({commit}, payload){
       commit('setError',payload);
    },
    clearError({commit},payload){
      commit('clearError')
    },
    setLoading({commit}, loadState){
      commit('setLoading', loadState)
    }
  },
  getters:{
      allTraders (state){
        return state.loadedTraders;
      },
      getUser(state){
        return state.user;
      }
    }

})



