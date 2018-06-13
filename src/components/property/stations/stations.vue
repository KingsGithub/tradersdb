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
            <h3>Station List Page     <small class="orange--text">[click row to edit]</small></h3>
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
            :items="stations"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editStation(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.address }}</td>
              <td class="text-xs-left">{{ props.item.phone }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appStation :station="props.item" :expanded="props.expanded"></appStation>
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
import Station from './station';
  export default {
    components:{
      appStation:Station
    },
    methods:{
      editStationOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editStation(editStation){
          this.$router.push('/property/stations/station/'+editStation.id )
      },
      createNew(){
        this.$router.push('/property/stations/station/0'); //testing git
      }
    },
    data () {
      return {
        search:'',
        newStation: {},
        headers: [
          { text: 'Station Name', value: 'name', align: 'left' },
          { text: 'Address', value: 'address' },
          { text: 'Phone', value: 'phone' }
        ]
      }
    },
    computed: {
        stations() {
          return this.$store.getters['stationModule/allStations'];
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      created(){
        if (!this.$store.getters.allStations)
          this.$store.dispatch('stationModule/loadStations');
      }
  }
</script>
