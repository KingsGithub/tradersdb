export const unitModule = {
    namespaced: true,
    state: {
        unitTemplate : {
            id:0,
            unitNumber:"A1",
            unitSize:"Std",
            address:"Cape Town Station Deck",
            city:"Cape Town",
            province:"Western Cape",
            postalCode:"8001",
            stationID:"Cape Town",
            hasFireExtinguisher:"1",
            sasWashbasin:"0",
            isVacant:"0",
            hasStorage:"0",
            propertyTypeID:"Unit"
        }
    },
    mutations:{

    },
    actions:{

    },
    getters:{
        getTemplate(state){
            return state.unitTemplate
        }
    }
}
