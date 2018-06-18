import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { traderModule } from './modules/trader'
import { stationModule } from './modules/station/index.js'
import { paymentModule } from './modules/payment'
import { unitModule } from './modules/unit'
import { leaseModule } from './modules/lease'
import { documentModule } from './modules/document'
import { noteModule } from './modules/note'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: { traderModule, stationModule, unitModule, leaseModule, paymentModule, documentModule, noteModule },
  state: {
      error:null,
      user:null,
      // { id: '', permissions: [], accessToken : '', name:''},
      loading:false,
      dialog: false,
      users:[] //{uid:'', name:''}
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
    },
    setDialog(state,dialogState){
      state.dialog = dialogState
    },
    setUserName(state, username){
      if(state.user) state.user.name = username;
    },
    setUsers(state, users){
      state.users = users;
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
      signin({dispatch, commit, rootGetters}, payload){
            commit('setLoading'); commit('clearError');
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
              .then( result => {
                commit('clearLoading');
                firebase.auth().onAuthStateChanged( user => {
                  if(user) //comment
                  commit('setUser', { id: user.uid, accessToken:user.refreshToken , permissions: []});
                      dispatch('getUserName');
                      dispatch('stationModule/loadStations',null,{root:true});
                      dispatch('unitModule/loadUnits',null,{root:true});
                      dispatch('traderModule/loadTraders',null,{root:true});
                      dispatch('leaseModule/loadLeases',null,{root:true});
                      dispatch('paymentModule/loadPayments',null,{root:true});
                      dispatch('loadUsers');
                      dispatch('documentModule/loadDocuments',null,{root:true});
                      dispatch('noteModule/loadNotes', null, {root:true});
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
      },
      dialog({commit}, dialogState){
        commit('setDialog', dialogState)
      },
      loadUsers({commit}){
        firebase.database().ref('users').once('value').
        then( snapshot =>{
          var users = [];
          snapshot.forEach(
              function (snapshotChild){
                  var uid = snapshotChild.key ;
                  var name = snapshotChild.val().name;
                  users.push({uid:uid, name:name});
          });
          commit('setUsers', users);
    })
      },
      getUserName({commit}){
        var userid = firebase.auth().currentUser.uid;
        if(userid){
            firebase.database().ref('users').child(userid).once('value').then(snapshot =>{
                var name = (snapshot.val() && snapshot.val().name ) || 'UnKnown';
                commit('setUserName', name);
          })
        }
      }
  },
  getters: {
     getUser(state){
       if(state.user) {
       return state.user;
       } else return {id:'',permissions:[],accessToken:'', name:''};
     },
     userId(state){
       if(state.user)
       return state.user.id;
       else return '';
     },
     error(state){
       return state.error
     },
     dialog(state){
       return state.dialog
     }
     /*
     ,
     validateIdNumberRegExp(state){
       let IdRegExp = "(?<Year>[0-9][0-9])(?<Month>([0][1-9])|([1][0-2]))(?<Day>([0-2][0-9])|([3][0-1]))(?<Gender>[0-9])(?<Series>[0-9]{3})(?<Citizenship>[0-9])(?<Uniform>[0-9])(?<Control>[0-9])"
       return IdRegExp;
     },
     Validate(idNumber) {
          // first clear any left over error messages
          $('#error p').remove();

          // store the error div, to save typing
          var error = $('#error');

          var idNumber = $('#idnumber').val();


          // assume everything is correct and if it later turns out not to be, just set this to false
          var correct = true;

          //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
          // SA ID Number have to be 13 digits, so check the length
          if (idNumber.length != 13 || !isNumber(idNumber)) {
              error.append('<p>ID number does not appear to be authentic - input not a valid number</p>');
              correct = false;
          }

          // get first 6 digits as a valid date
          var tempDate = new Date(idNumber.substring(0, 2), idNumber.substring(2, 4) - 1, idNumber.substring(4, 6));

          var id_date = tempDate.getDate();
          var id_month = tempDate.getMonth();
          var id_year = tempDate.getFullYear();

          var fullDate = id_date + "-" + (id_month + 1) + "-" + id_year;

          if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
              error.append('<p>ID number does not appear to be authentic - date part not valid</p>');
              correct = false;
          }

          // get the gender
          var genderCode = idNumber.substring(6, 10);
          var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";

          // get country ID for citzenship
          var citzenship = parseInt(idNumber.substring(10, 11)) == 0 ? "Yes" : "No";

          // apply Luhn formula for check-digits
          var tempTotal = 0;
          var checkSum = 0;
          var multiplier = 1;
          for (var i = 0; i < 13; ++i) {
              tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
              if (tempTotal > 9) {
                  tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
              }
              checkSum = checkSum + tempTotal;
              multiplier = (multiplier % 2 == 0) ? 1 : 2;
          }
          if ((checkSum % 10) != 0) {
              error.append('<p>ID number does not appear to be authentic - check digit is not valid</p>');
              correct = false;
          };


          // if no error found, hide the error message
          if (correct) {
              error.css('display', 'none');

              // clear the result div
              $('#result').empty();
              // and put together a result message
              $('#result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
          }
          // otherwise, show the error
          else {
              error.css('display', 'block');
          }

          return false;
      },
      isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
      }
      // $('#idCheck').submit(Validate);

      */
    }
})

