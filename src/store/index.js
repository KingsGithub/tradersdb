import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { traderModule } from './modules/trader'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: { traderModule },
  state: {
      error:null,
      user:null,
      // {
      //   id: '',
      //   permissions: [],
      //   accessToken : ''
      // },
      loading:false
  },
  mutations: {
    clearError(state){
      state.error = null
    },
     setLoading(state){
       state.loading = true;
     },
     clearLoading(state){
        state.loading = false;
     },
     setUser ( state, user){
        state.user = user;
     },
     logout(state){
       if(state.user)
        state.user=null;
    },
    setError (state, errorObject){ // { code:'nnn', message:'xyz' }
      state.error = errorObject;
    }

  },
  actions: {
      clearError({commit}){
        commit('clearError');
      },
      logout({commit}){
        firebase.auth().signOut()
        .then( result => { commit('logout') })
        .catch(error => {commit('setError',{code:error.code, message:error.message});});
      },
      signin({commit}, payload){
            commit('setLoading'); commit('clearError');
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
              .then( result => {
                commit('clearLoading');
                firebase.auth().onAuthStateChanged( user => {
                  if(user) //comment
                  commit('setUser', { id: user.uid, accessToken:user.refreshToken , permissions: []});
                })
              }).catch( error => {
              commit('clearLoading');
              commit('setError', { code: error.code, message: error.message }); });
      },

      signupUser({commit}, payload){
            commit('clearError'); commit('setLoading');
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then ( user => {
              commit('clearLoading')
              firebase.auth().onAuthStateChanged( user => {
                      if(user){
                          const newUser = {
                            id : user.uid,
                            permissions: [],
                            accessToken:user.refreshToken
                            } // New user has only certain default permissions still to be determined.
                            commit( 'setUser', newUser);
                          }
                })
              }
            )
            .catch(
                error => {
                  commit('setError',{code:error.code, message:error.message});
                  commit('clearLoading');
                }
            )
      }
  },
  getters: {
     getUser(state){
       if(state.user) {
       return state.user;
       } else return {id:'',permissions:[],accessToken:''};
     },
     userId(state){
       if(state.user)
       return state.user.id;
       else return '';
     },
     error(state){
       return state.error
     }
  }

})
