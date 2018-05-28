export const stationModule={
    namespaced: true,
    state:{
        stationTemplate : {
            id:'34EA2CCF11',
            name: "Cape Town",
            address: '23 Adderley Street, Cape Town'
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