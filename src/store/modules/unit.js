export const unitModule = {
    namespaced: true,
    state: {
        unitTemplate : {
            id:0,
            UnitNumber:"A1",
            UnitSize:"Std",
            Address:"Cape Town Station Deck",
            City:"Cape Town",
            Province:"Western Cape",
            PostalCode:"8001",
            StationID:"Cape Town",
            HasFireExtinguisher:"1",
            HasWashbasin:"0",
            IsVacant:"0",
            HasStorage:"0",
            PropertyTypeID:"Unit"
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