import firebase from 'firebase/app';
import 'firebase/database';

export const traderModule = {
      namespaced:true,
      state: {
        traderTemplate:{
          id:'0', firstname:'', surname:'', email:'', cellphone:'', address:'',
          hasLeaseApplicationForm: false, hasProofOfAddress:false, idNumber: '', commodity:'',
          city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
        },
          currentTrader: {
            id :0,
            surname :'Constantine',
            firstName :'Frederick',
            hasProofOfAddress :false,
            hasLeaseApplicationForm : false,
            hasMarriageCertificate :false,
            email :'constantinef@gmail.com',
            cellphone:'0348597654',
            landLine :'0213948594',
            commodity:'Oil',
            streetAddress :'120 Main Road',  city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
            loadedTraders: [],
          loadedTradersHC:[
            { id:'asddf434', firstname:'George', surname:'Clooney', email:'gclooney@gmail.com', cellphone:'083 348 9209', landLine:'0216457287' , streetAddress:'142 Loop Street, Cape Town',
              hasLeaseApplicationForm: true, hasProofOfAddress:true, hasMarriageCertificate :false, idNumber: '7208033847087', commodity:'vinyl records',
              city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
              { id:'asddE#f434', firstname:'Reggie', surname:'Parker', email:'parkerjr@gmail.com', cellphone:'083 843 9209', landLine:'0216457287' , streetAddress:'142 Loop Street, Cape Town',
              hasLeaseApplicationForm: true, hasProofOfAddress:true, hasMarriageCertificate :false, idNumber: '8112213847084', commodity:'vinyl records',
              city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
              { id:'asf21ddf434', firstname:'John', surname:'Clark', email:'jclarky@hotmail.com', cellphone:'071 338 6209', landLine:'0216457287' , streetAddress:'142 Loop Street, Cape Town',
              hasLeaseApplicationForm: true, hasProofOfAddress:true, hasMarriageCertificate :false, idNumber: '6111233857183', commodity:'vinyl records',
              city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
              { id:'23sddf434', firstname:'Ramsey', surname:'Mboshu', email:'mboshury@yahoo.com', cellphone:'023 458 5209', landLine:'0216457287' , streetAddress:'142 Loop Street, Cape Town',
              hasLeaseApplicationForm: true, hasProofOfAddress:true, hasMarriageCertificate :false, idNumber: '8705293747787', commodity:'vinyl records',
              city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
              { id:'12dsddf434', firstname:'Michael', surname:'Jordan', email:'mjordan@gmail.com', cellphone:'082 678 5269', landLine:'0216457287' , streetAddress:'142 Loop Street, Cape Town',
              hasLeaseApplicationForm: true, hasProofOfAddress:true, hasMarriageCertificate :false, idNumber: '9402273847482', commodity:'vinyl records',
              city :'Cape Town',  province :'Western Cape',  postalCode :'8001', country :'South Africa',
               company :'JHB Oil', personType :'Trader'
            },
          ]
      },
      mutations: {
        loadTraders(state, traders) {
            state.loadedTraders = traders
        },
        insertTrader(state, trader){
          state.loadedTraders.push(trader);
        },
        updateTrader(state, trader){

        },
        deleteTrader(state, traderId){

        }
      },
      actions: {
          setCurrentTrader(state,payload){
          state.currentTrader = payload;
          },
          insertTrader({commit}, trader){
              commit('resetError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('traders').push().key;
              if(newkey){
                trader.id = newkey;
                firebase.database().ref('/traders/'+ newkey).update(trader)
                .then ( function(result) {
                    commit('insertTrader',trader);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', error.message,{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updateTrader({commit}, trader){
            commit('resetError',null,{root:true});
            commit('setLoading',null,{root:true});
              firebase.database().ref('/traders/'+ trader.id).update(trader)
              .then ( function(result) {
                  commit('updateTrader',trader); //comment
                  commit('clearLoading',null,{root:true});
                })
              .catch( function(error) {
                commit('setError', error.message,{root:true});
                commit('clearLoading',null,{root:true});
              })
          },
          deleteTrader({commit}, traderId){

          },
          loadTraders({commit}){
            commit('setLoading',null,{root:true});
            firebase.database().ref('traders').once('value')
            .then( (data) => {
                const traders = [];
                const obj = data.val()
                for(let key in obj) {
                    traders.push({
                      id:key,
                      surname :obj[key].surname,
                      firstname :obj[key].firstname,
                      hasProofOfAddress :obj[key].hasProofOfAddress,
                      hasLeaseApplicationForm :obj[key].hasLeaseApplicationForm,
                      hasMarriageCertificate :obj[key].hasMarriageCertificate,
                      email :obj[key].email,
                      cellphone: obj[key].cellphone,
                      commodity: obj[key].commodity,
                      idNumber: obj[key].idNumber,
                      landLine :obj[key].landLine,
                      streetAddress :obj[key].streetAddress,
                      city :obj[key].city,
                      province :obj[key].province,
                      postalCode :obj[key].postalCode,
                      country :obj[key].country,
                      company :obj[key].company,
                      personType :obj[key].personType
                    })
                };
                commit('loadTraders',traders);
                commit('clearLoading',null,{root:true});
            })
            .catch(error =>{
              commit('setError', error.message,{root:true});
                  commit('clearLoading',null,{root:true});
            })
          }
      },
      getters: {
          allTraders( state ){
            return state.loadedTraders ;
          //   .sort ( (traderA, traderB) => {
          //     return traderA.name > traderB.name;
          //  })
          },
          getTraderById: state => (id) => {
            return state.loadedTraders.find(trader => trader.id === id); },

          currentTrader: state => {
            return state.currentTrader;
          },
          selectedTrader (state){
            return  (traderId) => {
                 return state.loadedTraders.find ((trader) => {
                   return trader.id === traderId;
                 } )
            }
          },
          newTrader(state){
            let trader = { ...state.traderTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return trader;
          },
          loadedTradersHC(state){
            return state.loadedTradersHC;
          }

      }
  }

  // export const trader = {
  // id :1,
  // Surname :'Constantine',
  // FirstName :'Frederick',
  // HasProofOfAddress :false,
  // HasLeaseApplicationForm : false,
  // HasMarriageCertificate :false,
  // EmailAddress :'constantinef@gmail.com',
  // landLine :'0213948594',
  // StreetAddress :'120 Main Road',  City :'Cape Town',  Province :'Western Cape',  PostalCode :'8001', Country :'South Africa',
  //    Company :'JHB Oil', PersonType :'Trader'
  // }
