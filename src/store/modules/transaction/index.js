import firebase from 'firebase/app';
import 'firebase/database';

export const transactionModule = {
      namespaced:true,
      transactionTypes:['Charge','OpenBalance','CloseBalance','Payment-Rent','Payment-Water'],
      state: {
        transactionTemplate : {
          id:'0',
          createdBy:'',
          dateCreated:'',
          dateModified:'',
          modifiedBy:'',
          transactionType:'',
          description:'',
          transactionDate:'',
          amount:'',
          leaseId:'',
          traderId:''
      },

        loadedTransactions: [],
          loadedTransactionsHC:[
            {
              id:'0',
              createdBy:'',
              dateCreated:'',
              dateModified:'',
              modifiedBy:'',
              transactionType:'',
              description:'',
              transactionDate:'',
              amount:'',
              leaseId:'',
              traderId:''
            }
          ]
      },
      mutations: {
        loadTransactions(state, transactions) {
            state.loadedTransactions = transactions
        },
        insertTransaction(state, transaction){
          state.loadedTransactions.push(transaction);
        },
        updateTransaction(state, transaction){
          var oldTransaction = state.loadedTransactions.find(function (obj) { return obj.id === transaction.id; });
          oldTransaction = transaction
        },
        deleteTransaction(state, transactionId){

        }
      },
      actions: {
          setCurrentTransaction(state,payload){
          state.currentTransaction = payload;
          },
          insertTransaction({commit}, transaction){
              commit('clearError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('transactions').push().key;
              if(newkey){
                transaction.id = newkey;
                firebase.database().ref('/transactions/'+ newkey).update(transaction)
                .then ( function(result) {
                    //commit('insertTransaction',transaction);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updateTransaction({commit}, transaction){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/transactions/'+ transaction.id).update(transaction)
              .then ( function(result) {
                  commit('updateTransaction',transaction); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deleteTransaction({commit}, transaction){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/transactions/'+ transaction.id).remove()
              .then ( function(result) {
                  //commit('updateTransaction',transaction); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          loadTransactions({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('transactions').on('value',
             (data) => {
                const transactions = [];
                const obj = data.val()
                for(let key in obj) {
                    transactions.push({
                      id:key,
                      createdBy :obj[key].createdBy,
                      dateCreated :obj[key].dateCreated,
                      modifiedBy :obj[key].modifiedBy,
                      dateModified :obj[key].dateModified,
                      transactionType:obj[key].transactionType,
                      description:obj[key].description,
                      transactionDate:obj[key].transactionDate,
                      amount:obj[key].amount,
                      leaseId :obj[key].leaseId,
                      traderId :obj[key].traderId
                    })
                };
                commit('loadTransactions',transactions);
                commit('clearLoading',null, {root:true});
            });

          }
      },
      getters: {
          allTransactions( state ){
            return state.loadedTransactions.sort ( (transactionA, transactionB) => {
                          return transactionA.name > transactionB.name;
                    })
          },
          getTransactionById: state => (id) => {
            return state.loadedTransactions.find(transaction => transaction.id === id); },

          currentTransaction: state => {
            return state.currentTransaction;
          },
          selectedTransaction (state){
            return  (transactionId) => {
                 return state.loadedTransactions.find ((transaction) => {
                   return transaction.id === transactionId;
                 } )
            }
          },
          newTransaction(state){
            let transaction = { ...state.transactionTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return transaction;
          },
          loadedTransactionsHC(state){
            return state.loadedTransactionsHC;
          },
          traderTransactions(state){
            return function(traderId){
                return state.loadedTransactions.filter( transaction => transaction.traderId === traderId );
            }
          }

      }
  }


