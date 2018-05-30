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
            <h3>Unit List Page     <small>[click row to edit]</small></h3>
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
            :items="units"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editUnit(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.unitNumber }}</td>
              <td class="text-xs-left">{{ props.item.unitSize }}</td>
              <td class="text-xs-left">{{ props.item.stationName }}</td>
              <td class="text-xs-left">{{ props.item.isVacant }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appUnit :unit="props.item" :expanded="props.expanded"></appUnit>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="orange" @click="createNew">New</v-btn>
          <v-btn flat color="orange" @click="closeForm">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Unit from './unit';
  export default {
    components:{
      appUnit:Unit
    },
    methods:{
      editUnitOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editUnit(editUnit){
          this.$router.push('/property/units/unit/'+editUnit.id )
      },
      createNew(){
        this.$router.push('/property/units/unit/0'); //testing git
      }
    },
    data () {
      return {
        search:'',
        newUnit: {},
        headers: [
          { text: 'Unit Number', value: 'unitNumber', align: 'left' },
          { text: 'Unit Size', value: 'unitSize' },
          { text: 'Station', value: 'stationName' },
          { text: 'Is Vacant', value: 'isVacant' }
        ]
      }
    },
    computed: {
        units() {
          let statLOV = this.$store.getters['stationModule/stationsLOV'];
          console.log('statlov=',statLOV)
          let runits = [];
          if(statLOV) {
              this.$store.getters['unitModule/allUnits'].forEach( u => {
                    let item = { ...u, stationName: statLOV.find( x => {return x.id = u.stationID} ).name }
                    runits.push(item);
                });
              return runits;
          }
          else
          return this.$store.getters['unitModule/allUnits']
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      created(){
        if (!this.$store.getters.allUnits)
          this.$store.dispatch('unitModule/loadUnits');
      }
  }
</script>
