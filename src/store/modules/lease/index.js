export const leaseModule = {
    namespaced: true,
    state: {
        leaseTemplate : {
            id:1,
            effectiveDate: '31-12-2017',
            traderId : '23',
            unitId : '21',
            occupationStartDate:'31-12-2017',
            rental: 2345.00,
            durationYears: 3,
            durationYears: 3,
            endDate: '31-12-2020',
            paymentPeriod: "monthly"
        }
    },
    mutations:{

    },
    actions:{

    },
    getters:{
        getTemplate(state){
            return state.leaseTemplate;
        }
    }
}