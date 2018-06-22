<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
     <v-snackbar class="green white--text" :timeout="4000"  top  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    <v-flex xs12 sm12 offset-sm0  >
      <v-card v-if="!loading" raised hover style="border-radius:5px">
        <v-card-title primary-title>
          <div>
            <h3>Note List Page </h3>
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
        <v-dialog v-model="dialog" style="border-radius:5px" round max-width="600px">
              <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field autofocus v-model="editedItem.text" :width="400" textarea required :rules="[rules.required]" label="Note"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="cancelEdit">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="saveEdit">Save</v-btn>
                </v-card-actions>
              </v-card>
        </v-dialog>
        <v-data-table
            :headers="headers"
            :items="notes"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr  :key="props.item.id" @closeForm="props.expanded = false" >
              <!-- <td class="text-xs-left">{{ props.item.traderId }}</td>
              <td class="text-xs-left">{{ props.item.leaseId }}</td> -->
              <td class="text-xs-left">{{ props.item.text }}</td>
              <td class="text-xs-left">{{ props.item.createdByName }}</td>
              <td class="text-xs-left">{{ props.item.dateCreated |dateFromMilliseconds|truncate}}</td>
              <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="editNote(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="confirmDelete(props.item)">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
              </td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appNote :note="props.item" :expanded="props.expanded"></appNote>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn dark color="orange" @click="createNew">New</v-btn>
        </v-card-actions>
        <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="deleteNote" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    props : {
      traderId:{ type: String, required: false, default: '-LDMAIzfsAsUOAddMlpK'},
      leaseId: { type: String, required: false, default: '-LDvJcCxj4-gl35cZ26K'}
    },
    methods:{
      closeForm() {
        this.$router.push('/')
      },
      cancelEdit(){
          this.dialog=false;
      },
       editDoc(editDocument){
          this.editedItem = {...editDocument }; //copy!!!
          this.dialog = true;
      },
       doDialog(heading, message){
          this.heading = heading;
          this.message = message;
          this.showDialog = true;
      },
      showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
      },
      deleteNote(confirmed){
        if(confirmed){
          this.$store.dispatch('noteModule/deleteNote',this.noteToDelete)
          .then ( result => {
            this.showSnackBar('Deleted');
          });
        }
        this.showDialog = false;
      },
      confirmDelete(noteToDelete){
        this.noteToDelete = noteToDelete;
        this.doDialog('Delete Note', 'Do you really want to delete this note?');
      },
      saveEdit(){
        if (!this.editedItem.text){
          this.showSnackBar("Enter some note or cancel..");
          return;
        }
        this.dialog = false;
        if(this.editedItem.id ==='0'){
        this.$store.dispatch('noteModule/insertNote', this.editedItem);
        this.showSnackBar('Created');
        }
        else {
          this.$store.dispatch('noteModule/updateNote', this.editedItem);
          this.showSnackBar('Updated');
        }
      },
      editNote(noteToEdit){
          this.dialog = true;
          this.editedItem = {...noteToEdit }; //COPY!
      },
      saveNote(editedItem){
           this.$store.dispatch('noteModule/insertNote', editedItem);
      },
      createNew(){
          this.editedItem = this.$store.getters['noteModule/newNote'];
          this.formTitle = "Add New Note"
          this.editedItem.leaseId = this.leaseId;
          this.editedItem.id = '0';
          this.editedItem.traderId = this.traderId;
          this.editedItem.createdBy = this.$store.getters['getUser'].id;
          this.editedItem.dateCreated = (new Date());
          this.editedItem.text = '';
          this.dialog = true;
      }
    },
    data () {
      return {
        search:'',
        dialog:false,
        snackbar: false,
        heading:'',
        message: '',
        showDialog: false,
        snackbartext:'',
        formTitle:'Edit Note',
        editedItem:{},
        rules: {
            required: (value) => !!value || 'Required.'
        },
        headers: [
          // { text: 'TraderId ', value: 'traderId', align: 'left' },
          // { text: 'Lease Id', value: 'leaseId', align: 'left' },
          { text: 'Note', value: 'text', width:"600",align:"center" },
          { text: 'WrittenBy', value: 'createdBy', align: 'left' },
          { text: 'Date', value: 'dateCreated' }
        ]
      }
    },
    computed: {
        notes() {
          // let leasesLOV = this.$store.getters['leaseModule/allLeases'];
          // let remodeledNotes = [];
          // let leaseNumber= '';
          // if(leasesLOV) {
              const notes = this.$store.getters['noteModule/traderNotes'](this.traderId);
              // notes.forEach( note => {
              //       leaseNumber = leasesLOV.find( (lease) => {return lease.id === note.leaseId} ).leaseNumber;
              //       let item = { ...note, leaseNumber: leaseNumber}
              //       remodeledNotes.push(item);
              //   });
              // return remodeledNotes;
              return notes;
          // }
          // else
          // return this.$store.getters['noteModule/allNotes']
        },
        loading(){
          return this.$store.getters.loading
        }
      }
  }
</script>
