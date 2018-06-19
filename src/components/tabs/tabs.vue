  </<template>
 <v-flex xs12 sm10 md10 offset-sm1>
      <v-tabs  icons-and-text centered dark color="light-blue">
          <v-tabs-slider color="white"></v-tabs-slider>
          <v-tab href="#tab-1">
            Trader
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab href="#tab-2">
            Documents
            <v-icon>favorite</v-icon>
          </v-tab>
          <v-tab href="#tab-3">
            Notes
            <v-icon>account_box</v-icon>
          </v-tab>
          <v-tab href="#tab-5">
            Recon
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab href="#tab-4">
            Payments
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab-item id="tab-1">
            <v-card flat>
              <v-card-text>
              <app-trader/>>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab-2">
            <v-card flat>
              <v-card-text>
              <app-documents/>>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab-3">
            <v-card flat>
              <v-card-text>
              <app-notes/>>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab-4">
            <v-card flat>
              <v-card-text>
              <app-payments/>>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab-5">
            <v-card flat>
              <v-card-text>
              <app-recon/>>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        </v-flex>
  </template>
  <script>
  import Trader from  '../traders/trader.vue'
  import Documents from '../documents/documents.vue'
  import Notes from '../notes/notes.vue'
  import Payments from '../payments/payments.vue'
  import Recon from '../recons/recons.vue'

  export default {

    data () {
      return {
        routerViews: [
            {tab: 'tab-1', comp: '<app-trader/>'},
            {tab: 'tab-2', comp: '<app-documents/>'},
            {tab: 'tab-3', comp: '<app-notes/>'},
            {tab: 'tab-4', comp: '<app-payments/>'},
            {tab: 'tab-5', comp: '<app-recon/>'},
            ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    components: {
      appTrader: Trader,
      appDocuments: Documents,
      appNotes: Notes,
      appPayments: Payments,
      appRecon: Recon
    }
  }
</script>
