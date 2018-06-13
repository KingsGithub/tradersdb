<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card v-if="!loading" raised hover style="border-radius:5px">
        <v-card-title primary-title>
          <div>
            <h3>Lease List Page     <small class="orange--text">[click row to edit]</small></h3>
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
            :items="leases"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editLease(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.stationName }}</td>
              <td class="text-xs-left">{{ props.item.traderName }}</td>
              <td class="text-xs-left">{{ props.item.unitName }}</td>
              <td class="text-xs-left">{{ props.item.occupationStartDate }}</td>
              <td class="text-xs-left">{{ props.item.hasNotes }}</td>
              <td class="text-xs-left">{{ props.item.hasPayments }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appLease :lease="props.item" :expanded="props.expanded"></appLease>
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
import Lease from './lease';
  export default {
    components:{
      appLease:Lease
    },
    methods:{
      editLeaseOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editLease(editLease){
          this.$router.push('/leases/lease/'+editLease.id )
      },
      createNew(){
        this.$router.push('/leases/lease/0'); //testing git
      }
    },
    data () {
      return {
        search:'',
        newLease: {},
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
        leases() {
          let stationsLOV = this.$store.getters['stationModule/allStations'];
          let unitsLOV = this.$store.getters['unitModule/allUnits'];
          let tradersLOV = this.$store.getters['traderModule/allTraders'];
          let remodeledLeases = [];
          let stationName = '';
          let t = '';
          let unitName = '';
          let traderName = '';
          if(stationsLOV) {
              const leases = this.$store.getters['leaseModule/allLeases'];
              leases.forEach( lease => {
                    stationName = stationsLOV.find( (station) => {return station.id === lease.stationId} ).name;
                    t = tradersLOV.find( (trader) => {return trader.id === lease.traderId} );
                    if(t) { traderName = t.firstname + ' ' + t.surname } else traderName = 'Not Found';
                    let unit = unitsLOV.find( (unit) => {return unit.id === lease.unitId} );
                    unitName = unit.unitNumber;

                    let item = { ...lease, stationName: stationName, traderName: traderName, unitName: unitName }

                    item.hasNotes = (item.hasNotes) ? "Yes" : "No"; //change boolean to Yes(true) or No(false).
                    item.hasPayments = (item.hasPayments) ? "Yes" : "No"; //change boolean to Yes(true) or No(false).
                    remodeledLeases.push(item);
                });
              return remodeledLeases;
          }
          else
          return this.$store.getters['leaseModule/allLeases']
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      created(){
        if (!this.$store.getters.allLeases)
          this.$store.dispatch('leaseModule/loadLeases');
      }
  }
</script>
