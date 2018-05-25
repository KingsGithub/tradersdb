export const traderModule = {
    namespaced: true,
    state: { 
        traderTemplate : {
            id :1,
            Surame :'Constantine',
            FirstName :'Frederick',
            HasProofOfAddress :'NO',
            HasLeaseApplicationForm :'NO',
            HasMarriageCertificate :'NO',
            EmailAddress :'asdf@gmail.com',
            HomePhone :'0213948594',
            Street_x0020__x0020_Address :'120 Main Road',
            City :'Claremont',
            Province :'Western Cape',
            Postal_x0020_Code :'7895',
            Country_x002F_Region :'South Africa',
            Company :'JHB Oil',
            PersonType :'Trader'
        },
        currentTrader: {},
        loadedTraders: []
    },
    mutations: {

     },
    actions: { 
        setCurrentTrader(state,payload){
            state.currentTrader = payload;
        }
    },
    getters: { 
        getAllTraders(state){
            return state.loadedTraders;
        },
        getTraderById(state, id ){
            return state.loadedTraders.find(trader => trader.id === id);
        },
        currentTrader (state){
            return state.currentTrader;
        },
        loadAllTraders (state, payload){
            state.loadedTraders = payload;
        },
        getTemplate(state){
            return state.traderTemplate;
        }
    }
  }



