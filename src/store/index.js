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
      error: { code:'0', message:'OK'},
      user:null,
      // {
      //   id: '',
      //   permissions: [],
      //   accessToken : ''
      // },
      loading:false
  },
  mutations: {
    resetError(state){
      state.error = {code:'0', message:'OK'};
    },
     setLoading(state,loadState){
       state.loading = loadState;
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
    setError (state, errorObject){
      state.error = errorObject;
    }

  },
  actions: {
      resetError({commit}){
        commit('resetError');
      },
      newTrader(){

      },
      logout({commit}){
        firebase.auth().signOut()
        .then( result => { commit('logout') })
        .catch(error => {commit('setError',{code:error.code, message:error.message});});
      },
      signin({commit}, payload){
            commit('setLoading',true); commit('resetError');
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
              .then( result => {
                commit('setLoading',false);
                firebase.auth().onAuthStateChanged( user => {
                  if(user)
                  commit('setUser', { id: user.uid, accessToken:user.refreshToken , permissions: []});
                })
              }).catch( error => {
              commit('setLoading',false);
              commit('setError', { code: error.code, message: error.message }); });
      },

      signupUser({commit}, payload){
            commit('resetError'); commit('setLoading', true);
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then ( user => {
              commit('setLoading',false)
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
                  commit('setLoading',false);
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
       return state.error.message;
     }
  }

})
