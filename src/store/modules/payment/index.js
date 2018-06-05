export const paymentModule={
    namespaced: true,


    state: {
      chargeTypes:["RENTAL", "MAINTENTANCE", "REPAIRS", "DEPOSIT"],
      transactionTypes:["CASH", "EFT", "CREDIT CARD", "DEBIT CARD"],
      paymentTemplate : {
          id:0,
          amount:0,
          date:'',
          leaseId: '0',
          referenceNumber: '',
          transactionType: "CASH",
          chargeType: "RENTAL"
      },
      loadedPayments: [],
      loadedPaymentsHC:[
        {
          id:0,
          amount:1900,
          date:'2017-12-23',
          leaseId: 'Unit-Z3-CPT-RP-2918',
          referenceNumber: 'Unit-Z3-CPT-RP-2918',
          transactionType: "CASH",
          chargeType: "RENTAL"
        }
      ]
    },
      mutations: {
        loadPayments(state, payments) {
            state.loadedPayments = payments
        },
        insertPayment(state, payment){
          state.loadedPayments.push(payment);
        },
        updatePayment(state, payment){
          var oldPayment = state.loadedPayments.find(function (obj) { return obj.id === payment.id; });
          oldPayment = payment
        },
        deletePayment(state, paymentId){

        }
      },
      actions: {
          setCurrentPayment(state,payload){
          state.currentPayment = payload;
          },
          insertPayment({commit}, payment){
              commit('clearError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('payments').push().key;
              if(newkey){
                payment.id = newkey;
                firebase.database().ref('/payments/'+ newkey).update(payment)
                .then ( function(result) {
                    commit('insertPayment',payment);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updatePayment({commit}, payment){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/payments/'+ payment.id).update(payment)
              .then ( function(result) {
                  commit('updatePayment',payment); //comment
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deletePayment({commit}, paymentId){
          },
          loadPayments({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('payments').once('value') //help
            .then( (data) => {
                const payments = [];
                const obj = data.val()
                for(let key in obj) {
                    payments.push({
                      id:key,
                      paymentNumber :obj[key].paymentNumber,
                      paymentSize :obj[key].paymentSize,
                      hasFireExtinguisher :obj[key].hasFireExtinguisher,
                      hasStorage :obj[key].hasStorage,
                      hasWashbasin : obj[key].hasWashbasin,
                      isVacant :obj[key].isVacant,
                      stationId: obj[key].stationId,
                      address :obj[key].address,
                      city :obj[key].city,
                      province :obj[key].province,
                      postalCode :obj[key].postalCode,
                      propertyType :obj[key].propertyType
                    })
                };
                commit('loadPayments',payments);
                commit('clearLoading',null, {root:true});
            })
            .catch(error =>{
              commit('setError',  { code: error.code, message: error.message} ,{root:true});
                  commit('clearLoading',null, {root:true});
            })
          }
      },
      getters: {
          allPayments( state ){
            return state.loadedPayments.sort ( (paymentA, paymentB) => {
                          return paymentA.name > paymentB.name;
                    })
          },
          getPaymentById: state => (id) => {
            return state.loadedPayments.find(payment => payment.id === id); },

          currentPayment: state => {
            return state.currentPayment;
          },
          selectedPayment (state){
            return  (paymentId) => {
                  return state.loadedPayments.find ((payment) => {
                    return payment.id === paymentId;
                  } )
            }
          },
          newPayment(state){
            let payment = { ...state.paymentTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return payment;
          },
          loadedPaymentsHC(state){
            return state.loadedPaymentsHC;
          }
      }
  }


