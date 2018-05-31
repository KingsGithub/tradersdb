import firebase from 'firebase/app';
import 'firebase/database';

export const leaseModule = {
    namespaced: true,
    state: {
        leaseTemplate : {
            id:0,
            leaseNumber:'',
            effectiveDate: '31-12-2017',
            traderId : '23',
            unitId : '21',
            stationID:'xyz',
            occupationStartDate:'31-12-2017',
            rental: 2345.00,
            durationYears: 3,
            durationYears: 3,
            endDate: '31-12-2020',
            paymentPeriod: "monthly",
            hasNotes:false,
            hasPayments:false
        },
        loadedLeases: [],
        loadedLeasesHC:[{
            id:0,
            leaseNumber:'UnitZ2-FG-345K',
            effectiveDate: '31-12-2017',
            traderId : '',
            unitId : '',
            stationID:'',
            occupationStartDate:'31-12-2017',
            rental: 1235.00,
            durationYears: 3,
            endDate: '31-12-2020',
            paymentPeriod: "monthly",
            hasNotes:false,
            hasPayments:false,
            isActive: true
          }]
          }  ,
          mutations: {
                loadLeases(state, leases) {
                    state.loadedLeases = leases
                },
                insertLease(state, lease){
                  state.loadedLeases.push(lease);
                },
                updateLease(state, lease){
                  var oldLease = state.loadedLeases.find(function (obj) { return obj.id === lease.id; });
                  oldLease = lease
                },
                deleteLease(state, leaseId){

                }
              },
          actions: {
              setCurrentLease(state,payload){
              state.currentLease = payload;
              },
              insertLease({commit}, lease){
                  commit('clearError',null,{root:true});
                  commit('setLoading',null,{root:true});
                  var newkey = firebase.database().ref('leases').push().key;
                  if(newkey){
                    lease.id = newkey;
                    firebase.database().ref('/leases/'+ newkey).update(lease)
                    .then ( function(result) {
                        commit('insertLease',lease);
                        commit('clearLoading',null,{root:true});
                      })
                    .catch( function(error) {
                      commit('setError', {code: error.code, message:error.message},{root:true});
                      commit('clearLoading',null,{root:true});
                    })
                  }

              },
              updateLease({commit}, lease){
                commit('clearError',null, {root:true});
                commit('setLoading',null, {root:true});
                  firebase.database().ref('/leases/'+ lease.id).update(lease)
                  .then ( function(result) {
                      commit('updateLease',lease); //comment
                      commit('clearLoading',null, {root:true});
                    })
                  .catch( function(error) {
                    commit('setError', { code: error.code, message: error.message},{root:true});
                    commit('clearLoading',null, {root:true});
                  })
              },
              deleteLease({commit}, leaseId){
              },
              loadLeases({commit}){
                commit('setLoading',null, {root:true});
                firebase.database().ref('leases').once('value') //help
                .then( (data) => {
                    const leases = [];
                    const obj = data.val()
                    for(let key in obj) {
                        leases.push({
                          id:key,
                          leaseNumber :obj[key].leaseNumber,
                          effectiveDate:obj[key].effectiveDate ,
                          traderId :obj[key].traderId ,
                          unitId :obj[key].unitId ,
                          stationID:obj[key].stationID,
                          occupationStartDate:obj[key].occupationStartDate,
                          rental:obj[key].rental,
                          durationYears:obj[key].durationYears ,
                          endDate:obj[key].endDate ,
                          paymentPeriod:obj[key].paymentPeriod ,
                          hasNotes:obj[key].hasNotes,
                          hasPayments:obj[key].hasPayments,
                          isActive:obj[key].isActive
                        })
                    };
                    commit('loadLeases',leases);
                    commit('clearLoading',null, {root:true});
                })
                .catch(error =>{
                  commit('setError',  { code: error.code, message: error.message} ,{root:true});
                      commit('clearLoading',null, {root:true});
                })
              }
          },
          getters: {
              allLeases( state ){
                return state.loadedLeases.sort ( (leaseA, leaseB) => {
                              return leaseA.name > leaseB.name;
                        })
              },
              getLeaseById: state => (id) => {
                return state.loadedLeases.find(lease => lease.id === id); },

              currentLease: state => {
                return state.currentLease;
              },
              selectedLease (state){
                return  (leaseId) => {
                      return state.loadedLeases.find ((lease) => {
                        return lease.id === leaseId;
                      } )
                }
              },
              newLease(state){
                let lease = { ...state.leaseTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
                return lease;
              },
              loadedLeasesHC(state){
                return state.loadedLeasesHC;
              }
            }
}



