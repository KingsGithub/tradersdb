import firebase from 'firebase/app';
import 'firebase/database';

export const reconModule = {
      namespaced:true,
      state: {
        reconTemplate : {
          id:'0',
          createdBy:'',
          dateCreated:'',
          dateModified:'',
          modifiedBy:'',
          text:'',
          leaseId:'',
          traderId:''
      },

        loadedRecons: [],
          loadedReconsHC:[
            {
              id:'0',
              createdBy:'',
              dateCreated:'',
              dateModified:'',
              modifiedBy:'',
              text:'',
              leaseId:'',
              traderId:''
            }
          ]
      },
      mutations: {
        loadRecons(state, recons) {
            state.loadedRecons = recons
        },
        insertRecon(state, recon){
          state.loadedRecons.push(recon);
        },
        updateRecon(state, recon){
          var oldRecon = state.loadedRecons.find(function (obj) { return obj.id === recon.id; });
          oldRecon = recon
        },
        deleteRecon(state, reconId){

        }
      },
      actions: {
          setCurrentRecon(state,payload){
          state.currentRecon = payload;
          },
          insertRecon({commit}, recon){
              commit('clearError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('recons').push().key;
              if(newkey){
                recon.id = newkey;
                firebase.database().ref('/recons/'+ newkey).update(recon)
                .then ( function(result) {
                    //commit('insertRecon',recon);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updateRecon({commit}, recon){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/recons/'+ recon.id).update(recon)
              .then ( function(result) {
                  commit('updateRecon',recon); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deleteRecon({commit}, recon){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/recons/'+ recon.id).remove()
              .then ( function(result) {
                  //commit('updateRecon',recon); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          loadRecons({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('recons').on('value',
             (data) => {
                const recons = [];
                const obj = data.val()
                for(let key in obj) {
                    recons.push({
                      id:key,
                      createdBy :obj[key].createdBy,
                      dateCreated :obj[key].dateCreated,
                      modifiedBy :obj[key].modifiedBy,
                      dateModified :obj[key].dateModified,
                      text: obj[key].text,
                      leaseId :obj[key].leaseId,
                      traderId :obj[key].traderId
                    })
                };
                commit('loadRecons',recons);
                commit('clearLoading',null, {root:true});
            });

          }
      },
      getters: {
          allRecons( state ){
            return state.loadedRecons.sort ( (reconA, reconB) => {
                          return reconA.name > reconB.name;
                    })
          },
          getReconById: state => (id) => {
            return state.loadedRecons.find(recon => recon.id === id); },

          currentRecon: state => {
            return state.currentRecon;
          },
          selectedRecon (state){
            return  (reconId) => {
                 return state.loadedRecons.find ((recon) => {
                   return recon.id === reconId;
                 } )
            }
          },
          newRecon(state){
            let recon = { ...state.reconTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return recon;
          },
          loadedReconsHC(state){
            return state.loadedReconsHC;
          }

      }
  }


