import firebase from 'firebase/app';
import 'firebase/database';

export const traderModule = {
      namespaced:true,
      state: {
        traderTemplate:{
          id:'0', firstname:'', surname:'', email:'', cellphone:'', address:'',
          hasLeaseDocuments: false, hasProofOfResidence:false, idNumber: '', commodity:''
        },
          currentTrader: {
            id :0,
            Surname :'Constantine',
            FirstName :'Frederick',
            HasProofOfAddress :false,
            HasLeaseApplicationForm : false,
            HasMarriageCertificate :false,
            EmailAddress :'constantinef@gmail.com',
            HomePhone :'0213948594',
            StreetAddress :'120 Main Road',  City :'Claremont',  Province :'Western Cape',  PostalCode :'7895', Country :'South Africa',
               Company :'JHB Oil', PersonType :'Trader'
            },
          loadedTraders:[
            { id:'asddf434', firstname:'George', surname:'Clooney', email:'gclooney@gmail.com', cellphone:'083 348 9209', address:'142 Loop Street, Cape Town',
              hasLeaseDocuments: true, hasProofOfResidence:true, idNumber: '7208033847087', commodity:'vinyl records'},
              { id:'asddE#f434', firstname:'Reggie', surname:'Parker', email:'parkerjr@gmail.com', cellphone:'083 843 9209', address:'142 Loop Street, Cape Town',
              hasLeaseDocuments: true, hasProofOfResidence:true, idNumber: '8112213847084', commodity:'vinyl records'},
              { id:'asf21ddf434', firstname:'John', surname:'Clark', email:'jclarky@hotmail.com', cellphone:'071 338 6209', address:'142 Loop Street, Cape Town',
              hasLeaseDocuments: true, hasProofOfResidence:true, idNumber: '6111233857183', commodity:'vinyl records'},
              { id:'23sddf434', firstname:'Ramsey', surname:'Mboshu', email:'mboshury@yahoo.com', cellphone:'023 458 5209', address:'142 Loop Street, Cape Town',
              hasLeaseDocuments: true, hasProofOfResidence:true, idNumber: '8705293747787', commodity:'vinyl records'},
              { id:'12dsddf434', firstname:'Michael', surname:'Jordan', email:'mjordan@gmail.com', cellphone:'082 678 5269', address:'142 Loop Street, Cape Town',
              hasLeaseDocuments: true, hasProofOfResidence:true, idNumber: '9402273847482', commodity:'vinyl records'},
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

          },
          deleteTrader({commit}, traderId){

          },
          loadTraders({commit}){

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
                 state.loadedTraders.find ((trader) => {
                   return trader.id === traderId;
                 } )
            }
          },
          newTrader(state){
            let trader = { ...state.traderTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            console.log('from newtrader:',trader)
            return trader;
          },

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
  // HomePhone :'0213948594',
  // StreetAddress :'120 Main Road',  City :'Claremont',  Province :'Western Cape',  PostalCode :'7895', Country :'South Africa',
  //    Company :'JHB Oil', PersonType :'Trader'
  // }
