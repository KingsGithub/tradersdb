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
            <h3>Trader List Page     <small class="orange--text">[click row to edit]</small></h3>
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
           v-model="selected"
            class="elevation-1"
            :headers="headers"
            :items="traders"
            :search="search"
            actions
            :loading="loading"
            :pagination.sync="pagination"
            item-key="id"
            :rows-per-page-items="rowsPerPageItems"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editTrader(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.firstname }}</td>
              <td class="text-xs-left">{{ props.item.surname }}</td>
              <td class="text-xs-left">{{ props.item.idNumber }}</td>
              <td class="text-xs-left">{{ props.item.commodity }}</td>
              <td class="text-xs-left">{{ props.item.email }}</td>
              <td class="text-xs-left">{{ props.item.cellphone }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appTrader :trader="props.item" :expanded="props.expanded"></appTrader>
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
import Trader from './trader';
  export default {
    components:{
      appTrader:Trader
    },
    methods:{
      editTraderOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editTrader(editTrader){
          this.$store.dispatch('traderModule/setCurrentTrader',editTrader);
          this.$router.push('/tabs/tabs/'+this.currentTrader.id )
      },
      createNew(){
        this.$router.push('/tabs/tabs/0');
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    data () {
      return {
        search:'',
        newTrader: {},
        pagination: {
            sortBy: 'surname'
        },
         selected: [],
        rowsPerPageItems: [7,11,16,20, {"text":"All","value":-1}],
        headers: [
          { text: 'FirstName', value: 'firstname', align: 'left' },
          { text: 'Surname', value: 'surname' },
          { text: 'IDNumber', value: 'idNumber' },
          { text: 'Commodity', value: 'commodity' },
          { text: 'Email', value: 'email' },
          { text: 'CellPhone', value: 'cellphone' }
        ]
      }
    },
    computed: {
        traders() {
          return this.$store.getters['traderModule/allTraders'];
        },
        loading(){
          return this.$store.getters.loading
        },
        currentTrader(){
          return this.$store.getters['traderModule/currentTrader'];
        }
      },
      created(){
        if (!this.$store.getters.allTraders)
          this.$store.dispatch('traderModule/loadTraders');
      }
  }
</script>
