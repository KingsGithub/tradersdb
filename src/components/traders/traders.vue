<template>

 <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media src="/static/doc-images/cards/IMG_1416small.png" height="100px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3>Trader List page</h3>
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
    :items="traders"
    :search="search"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props" >
      <tr   @click="editTrader(props.item)"  :key="props.item.id" @closeForm="props.expanded = false" >
      <td>{{ props.item.firstname }}</td>
      <td class="text-xs-left">{{ props.item.surname }}</td>
      <td class="text-xs-left">{{ props.item.idNumber }}</td>
      <td class="text-xs-left">{{ props.item.commodity }}</td>
      <td class="text-xs-left">{{ props.item.email }}</td>
      <td class="text-xs-left">{{ props.item.cellphone }}</td>
      </tr>
    </template>
     <template slot="expand" slot-scope="props">
        <appTrader :trader="props.item" :expanded="props.expanded">

        </appTrader>
    </template>
  </v-data-table>
          <v-card-actions>
          <v-btn flat color="orange">Edit</v-btn>
          <v-btn flat color="orange" @click="createNew">New</v-btn>
          <v-btn flat color="orange">Close</v-btn>
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
      editTrader(editTrader) {
        this.$router.push('/traders/trader/'+editTrader.id )
      },
      createNew(){
        this.$router.push('/traders/trader/0');
      }
    },
    data () {
      return {
        search:'',
        newTrader: {},
        headers: [
          { text: 'FirstName', value: 'name', align: 'left' },
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
        }
      },
      created(){
        if (!this.$store.getters.allTraders)
          this.$store.dispatch('traderModule/loadTraders');
      }
  }
</script>
