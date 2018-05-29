import firebase from 'firebase/app';
import 'firebase/database';

export const stationModule = {
      namespaced:true,
      state: {
          stationTemplate : {
                id:'0',
                name: '',
                address: '',
                phone: ''
          } ,
          loadedStations: [],
          loadedStationsHC:[
            {
              id:'Cape Town',
              name: "Cape Town",
              address: 'Propnet Building, 1 Adderley Street, Cape Town, 8000',
              phone: '0214496478'
            }
          ]
      },
      mutations: {
        loadStations(state, stations) {
            state.loadedStations = stations
        },
        insertStation(state, station){
          state.loadedStations.push(station);
        },
        updateStation(state, station){

        },
        deleteStation(state, stationId){

        }
      },
      actions: {
          setCurrentStation(state,payload){
          state.currentStation = payload;
          },
          insertStation({commit}, station){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              var newkey = firebase.database().ref('stations').push().key;
              if(newkey){
                station.id = newkey;
                firebase.database().ref('/stations/'+ newkey).update(station)
                .then ( function(result) {
                    commit('insertStation',station);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null, {root:true});
                })
              }

          },
          updateStation({commit}, station){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/stations/'+ station.id).update(station)
              .then ( function(result) {
                  commit('updateStation',station); //comment
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deleteStation({commit}, stationId){
          },
          loadStations({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('stations').once('value') //help
            .then( (data) => {
                const stations = [];
                const obj = data.val()
                for(let key in obj) {
                    stations.push({
                      id:key,
                      name: obj[key].name,
                      address: obj[key].address,
                      phone: obj[key].phone
                    })
                };
                commit('loadStations',stations);
                commit('clearLoading',null, {root:true});
            })
            .catch(error =>{
              commit('setError',  { code: error.code, message: error.message} ,{root:true});
                  commit('clearLoading',null, {root:true});
            })
          }
      },
      getters: {
          allStations( state ){
            return state.loadedStations ;
          //   .sort ( (stationA, stationB) => {
          //     return stationA.name > stationB.name;
          //  })
          },
          getStationById: state => (id) => {
            return state.loadedStations.find(station => station.id === id); },

          currentStation: state => {
            return state.currentStation;
          },
          selectedStation (state){
            return  (stationId) => {
                 return state.loadedStations.find ((station) => {
                   return station.id === stationId;
                 } )
            }
          },
          newStation(state){
            let station = { ...state.stationTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return station;
          },
          loadedStationsHC(state){
            return state.loadedStationsHC;
          }

      }
  }
