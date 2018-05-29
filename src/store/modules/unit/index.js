import firebase from 'firebase/app';
import 'firebase/database';

export const unitModule = {
      namespaced:true,
      state: {
        unitTemplate : {
          id:'0',
          unitNumber:"",
          unitSize:"Std",
          address:"Cape Town Station Deck",
          city:"Cape Town",
          province:"Western Cape",
          postalCode:"8001",
          stationID:'-LDfU1wmBsB_6H78rxG3',
          hasFireExtinguisher: true,
          hasWashbasin:true,
          isVacant:true,
          hasStorage:true,
          propertyType:"Unit"
      },

        loadedUnits: [],
          loadedUnitsHC:[
             {
              id:'0',
              unitNumber:"A1",
              unitSize:"Std",
              address:"Cape Town Station Deck",
              city:"Cape Town",
              province:"Western Cape",
              postalCode:"8001",
              stationID:"-LDfU1wmBsB_6H78rxG3",
              hasFireExtinguisher:true,
              hasWashbasin:false,
              isVacant:false,
              hasStorage:false,
              propertyType:"Unit"
          }

          ]
      },
      mutations: {
        loadUnits(state, units) {
            state.loadedUnits = units
        },
        insertUnit(state, unit){
          state.loadedUnits.push(unit);
        },
        updateUnit(state, unit){
          var oldUnit = state.loadedUnits.find(function (obj) { return obj.id === unit.id; });
          oldUnit = unit
        },
        deleteUnit(state, unitId){

        }
      },
      actions: {
          setCurrentUnit(state,payload){
          state.currentUnit = payload;
          },
          insertUnit({commit}, unit){
              commit('clearError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('units').push().key;
              if(newkey){
                unit.id = newkey;
                firebase.database().ref('/units/'+ newkey).update(unit)
                .then ( function(result) {
                    commit('insertUnit',unit);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updateUnit({commit}, unit){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/units/'+ unit.id).update(unit)
              .then ( function(result) {
                  commit('updateUnit',unit); //comment
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deleteUnit({commit}, unitId){
          },
          loadUnits({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('units').once('value') //help
            .then( (data) => {
                const units = [];
                const obj = data.val()
                for(let key in obj) {
                    units.push({
                      id:key,
                      unitNumber :obj[key].unitNumber,
                      unitSize :obj[key].unitSize,
                      hasFireExtinguisher :obj[key].hasFireExtinguisher,
                      hasStorage :obj[key].hasStorage,
                      hasWashbasin : obj[key].hasWashbasin,
                      isVacant :obj[key].isVacant,
                      stationID: obj[key].stationID,
                      address :obj[key].address,
                      city :obj[key].city,
                      province :obj[key].province,
                      postalCode :obj[key].postalCode,
                      propertyType :obj[key].propertyType
                    })
                };
                commit('loadUnits',units);
                commit('clearLoading',null, {root:true});
            })
            .catch(error =>{
              commit('setError',  { code: error.code, message: error.message} ,{root:true});
                  commit('clearLoading',null, {root:true});
            })
          }
      },
      getters: {
          allUnits( state ){
            return state.loadedUnits.sort ( (unitA, unitB) => {
                          return unitA.name > unitB.name;
                    })
          },
          getUnitById: state => (id) => {
            return state.loadedUnits.find(unit => unit.id === id); },

          currentUnit: state => {
            return state.currentUnit;
          },
          selectedUnit (state){
            return  (unitId) => {
                 return state.loadedUnits.find ((unit) => {
                   return unit.id === unitId;
                 } )
            }
          },
          newUnit(state){
            let unit = { ...state.unitTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return unit;
          },
          loadedUnitsHC(state){
            return state.loadedUnitsHC;
          }

      }
  }


