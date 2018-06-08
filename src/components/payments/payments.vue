<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card v-if="!loading">
        <v-card-title primary-title>
          <div>
            <h3>Payment List Page     <small class="orange--text">[click row to edit]</small></h3>
          </div>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="payments"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editPayment(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.stationName }}</td>
              <td class="text-xs-left">{{ props.item.traderName }}</td>
              <td class="text-xs-left">{{ props.item.unitName }}</td>
              <td class="text-xs-left">{{ props.item.occupationStartDate }}</td>
              <td class="text-xs-left">{{ props.item.hasNotes }}</td>
              <td class="text-xs-left">{{ props.item.hasPayments }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appPayment :payment="props.item" :expanded="props.expanded"></appPayment>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="orange" @click="createNew">New</v-btn>
          <v-btn dark color="orange" @click="closeForm">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Payment from './payment';
  export default {
    components:{
      appPayment:Payment
    },
    methods:{
      editPaymentOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editPayment(editPayment){
          this.$router.push('/payments/payment/'+editPayment.id )
      },
      createNew(){
        this.$router.push('/payments/payment/0'); //testing git
      }
    },
    data () {
      return {
        search:'',
        newPayment: {},
        headers: [
          { text: 'Station ', value: 'stationName', align: 'left' },
          { text: 'Trader', value: 'traderName' },
          { text: 'Unit No.', value: 'unitName' },
          { text: 'StartDate', value: 'occupationStartDate' },
          { text: 'Has Notes', value: 'hasNotes'},
          { text: 'Has Payments', value: 'hasPayments'}
        ]
      }
    },
    computed: {
        payments() {
          let unitsLOV = this.$store.getters['unitModule/allUnits'];
          let tradersLOV = this.$store.getters['traderModule/allTraders'];
          let remodeledPayments = [];
          let t = '';
          let unitName = '';
          let traderName = '';
          const payments = this.$store.getters['paymentModule/allPayments'];
          if(payments) {
                payments.forEach( payment => {
                    t = tradersLOV.find( (trader) => {return trader.id === payment.traderId} );
                    if(t) { traderName = t.firstname + ' ' + t.surname } else traderName = 'Not Found';
                    let unit = unitsLOV.find( (unit) => {return unit.id === payment.unitId} );
                    unitName = unit.unitNumber;

                    let item = { ...payment, stationName: stationName, traderName: traderName, unitName: unitName }

                    item.hasNotes = (item.hasNotes) ? "Yes" : "No"; //change boolean to Yes(true) or No(false).
                    item.hasPayments = (item.hasPayments) ? "Yes" : "No"; //change boolean to Yes(true) or No(false).
                    remodeledPayments.push(item);
                });
              return remodeledPayments;
          }
          else return this.$store.getters.loadedPayments;
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      created(){
        if (!this.$store.getters.allPayments)
          this.$store.dispatch('paymentModule/loadPayments');
      }
  }
</script>
