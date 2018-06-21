  </<template>
 <v-flex xs12 sm10 md10 offset-sm1>
      <v-tabs  icons-and-text centered dark color="light-blue">
          <v-tabs-slider color="white"></v-tabs-slider>
          <v-tab :to="traderlink">
            Trader
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab to="/tabs/tabs/tab2/0">
            Documents
            <v-icon>favorite</v-icon>
          </v-tab>
          <v-tab to="/tabs/tabs/tab3/0">
            Notes
            <v-icon>account_box</v-icon>
          </v-tab>
          <v-tab to="/tabs/tabs/tab5/0">
            Recon
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab to="/tabs/tabs/tab4/0">
            Payments
            <v-icon>phone</v-icon>
          </v-tab>
          <!-- <v-tab-item id="tab1">
            <v-tab-content>
            <router-view name = "tab1">TAB1</router-view>
            </v-tab-content>
          </v-tab-item>
          <v-tab-item id="tab2">
            <router-view name = "tab2"></router-view>
          </v-tab-item>
          <v-tab-item id="tab3">
            <router-view name = "tab3"></router-view>
          </v-tab-item>
          <v-tab-item id="tab4">
            <router-view name = "tab4"></router-view>
          </v-tab-item>
          <v-tab-item id="tab5">
            <router-view name = "tab5"></router-view>
          </v-tab-item> -->

        </v-tabs>
          <router-view></router-view>
        </v-flex>
  </template>
  <script>
  import Trader from  '../traders/trader.vue'
  import Documents from '../documents/documents.vue'
  import Notes from '../notes/notes.vue'
  import Payments from '../payments/payments.vue'
  import Recon from '../recons/recons.vue'

  export default {
    props:['traderId'],
    data () {
      return {
        routerViews: [
            {tab: 'tab1', comp: '<app-trader/>'},
            {tab: 'tab2', comp: '<app-documents/>'},
            {tab: 'tab3', comp: '<app-notes/>'},
            {tab: 'tab4', comp: '<app-payments/>'},
            {tab: 'tab5', comp: '<app-recon/>'},
            ]
      }
    },
    components: {
      appTrader: Trader,
      appDocuments: Documents,
      appNotes: Notes,
      appPayments: Payments,
      appRecon: Recon
    },
    computed:{
          traderlink() {
              var thelink =  '/tabs/tabs/tab1/'+this.traderId ;
              console.log(thelink);
              return thelink;
              }
    }
  }
</script>
