export const paymentModule={
    namespaced: true,
    state: {
        chargeTypes:[
            {id:0, description:"RENTAL"}, 
            {id:1,description:"MAINTENTANCE"}, 
            {id:2,description:"REPAIRS"}, 
            {id:3, description:"DEPOSIT"}
            ],
        paymentTemplate : {
            id:0,
            amount:0,
            date:'31-12-2017',
            leaseId: '21',
            referenceNumber: 'Unit00SWE',
            transactionType: "CASH",
            chargeType: "RENTAL"  //RENTAL, MAINTENTANCE, REPAIRS, DEPOSIT, etc.
        }
    },
    mutations:{

    },
    actions:{

    },
    getters:{
        getTemplate(state){
            return state.stationTemplate;
        }
    }
}