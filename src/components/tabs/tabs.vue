  </<template>
     <v-flex xs12 sm10 md10 offset-sm1>
        <v-tabs  @traderCreated="onTraderCreated"  icons-and-text centered dark color="light-blue">
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab @traderCreated="onTraderCreated" :to="{ name: 'trader', params: { traderId: theTraderId }}" ref="traderTab">
              Trader
              <v-icon>person</v-icon>
            </v-tab>
            <v-tab :to="{ name: 'document', params: { traderId: theTraderId }}">
              Documents
              <v-icon>file_copy</v-icon>
            </v-tab>
            <v-tab :to="{ name: 'note', params: { traderId: theTraderId }}">
              Notes
              <v-icon>format_align_center</v-icon>
            </v-tab>
            <v-tab :to="{ name: 'recon', params: { traderId: theTraderId }}">
              Recon
              <v-icon>account_balance</v-icon>
            </v-tab>
            <v-tab :to="{ name: 'payment', params: { traderId: theTraderId }}">
              Payments
              <v-icon>receipt</v-icon>
            </v-tab>
        </v-tabs>
        <v-tabs-items>
          <v-tab-item id="t1" :disabled = "traderIdCopy==='0'">

          </v-tab-item>
        </v-tabs-items>
        <v-slide-x-transition origin="right top 50000">
                      <router-view></router-view>
        </v-slide-x-transition>
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
        traderIdCopy:'0'
        //routerViews: [{tab: 'tab1', comp: '<app-trader/>'},{tab: 'tab2', comp: '<app-documents/>'}, {tab: 'tab3', comp: '<app-notes/>'}, {tab: 'tab4', comp: '<app-payments/>'},{tab: 'tab5', comp: '<app-recon/>'},]
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
        theTraderId(){
            if(this.traderId !== '0')
                this.traderIdCopy = this.traderId;  //decouple the prop
            else {
                this.$store.dispatch('traderModule/setCurrentTrader', this.$store.getters['traderModule/newTrader']);
                this.traderIdCopy = (this.$store.getters['traderModule/currentTrader']).id;
            }
            return this.traderIdCopy;
        },
          traderlink() {
              var thelink = { name: 'trader', params: { traderId: this.traderId }};
              return thelink;
              }
    },
    methods:{
        onTraderCreated(traderId){
          console.log('trader created', traderId)
          this.traderIdCopy = traderId;
        },
        traderCreated(traderId){
          console.log('trader created', traderId)
          this.traderIdCopy = traderId;
        }
    },
    mounted(){
       this.$router.push(this.traderlink);
    }
  }
</script>
