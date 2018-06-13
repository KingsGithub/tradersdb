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
            <h3>Note List Page     <small class="orange--text">[click row to edit]</small></h3>
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
            :items="notes"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editNote(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.leaseNumber }}</td>
              <td class="text-xs-left">{{ props.item.dateCreated }}</td>
              <td class="text-xs-left">{{ props.item.text }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appNote :note="props.item" :expanded="props.expanded"></appNote>
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
import Note from './note';
  export default {
    components:{
      appNote:Note
    },
    methods:{
      editNoteOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editNote(editNote){
          this.$router.push('/notes/note/'+editNote.id )
      },
      createNew(){
        this.$router.push('/notes/note/0');
      }
    },
    data () {
      return {
        search:'',
        newNote: {},
        headers: [
          { text: 'Lease ', value: 'leaseNumber', align: 'left' },
          { text: 'Date', value: 'dateCreated' },
          { text: 'Note', value: 'text' }
        ]
      }
    },
    computed: {
        notes() {
          let leasesLOV = this.$store.getters['leaseModule/allLeases'];
          let remodeledNotes = [];
          let leaseNumber= '';
          if(leasesLOV) {
              const notes = this.$store.getters['noteModule/allNotes'];
              notes.forEach( note => {
                    leaseNumber = leasesLOV.find( (lease) => {return lease.id === note.leaseId} ).leaseNumber;
                    let item = { ...note, leaseNumber: leaseNumber}
                    remodeledNotes.push(item);
                });
              return remodeledNotes;
          }
          else
          return this.$store.getters['noteModule/allNotes']
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      created(){
        if (!this.$store.getters.allNotes)
          this.$store.dispatch('noteModule/loadNotes');
      }
  }
</script>
