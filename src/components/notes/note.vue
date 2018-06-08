<template>
    <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title primary-title>
          <div>
            <h3>Note View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="noteCopy.id"></v-text-field>
                  <v-text-field type = "hidden" name="leaseId" :id="noteCopy.leaseId"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="dateCreated" label="Date"
                                      disabled v-model="noteCopy.dateCreated"  required :rules="[rules.required]"
                                      >{{noteCopy.dateCreated}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="text" label="Note"
                                      :disabled="isFormDisabled" v-model="noteCopy.text"  required :rules="[rules.required]"
                                      >{{noteCopy.text}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="dateModified" label="dateModified"
                                      disabled v-model="noteCopy.dateModified"  required :rules="[rules.required]"
                                      >{{noteCopy.dateModified}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="createdBy" label="Creator"
                                      disabled v-model="noteCopy.createdBy"  required :rules="[rules.required]"
                                      >{{noteCopy.createdBy}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="modifiedBy" label="Modifier"
                                      disabled v-model="noteCopy.modifiedBy"  required :rules="[rules.required]"
                                      >{{noteCopy.modifiedBy}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
        <v-card-actions xs12 md6 sm6 offset-sm3 >
              <v-spacer></v-spacer>
              <v-btn v-if="hasEditPermission" dark color="orange" @click="doEdit">Edit</v-btn>
              <v-btn dark color="orange" @click="doCancel">Cancel</v-btn>
              <v-btn dark color="orange" @click="doSave">Save</v-btn>
              <v-btn dark color="orange" @click="doClose">Close</v-btn>
              <v-btn dark color="orange" @click="loadnotesHC">LoadHC</v-btn>
        </v-card-actions>
         <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="cancelEdits" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

import Dialog from '../shared/dialog'

export default {

   props: {
        id:{ type:String, required: true, default:'0'},
        leaseId:{type:String, required:true}
   },
   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          noteDBCopy : {},
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Form has changed. Cancel Edits?",
          heading:"Confirm Cancel",
          showDialog: false,
          rules: {
            required: (value) => !!value || 'Required.'
          }
        }
    },
    computed:{
        hasEditPermission(){
              return true;  /// need to get it from the store.
      },
      stationsLOV(){
          return this.$store.getters['stationModule/allStations'];
      },
      unitsLOV(){
          return this.$store.getters['unitModule/allUnits'];
      },
      tradersLOV(){
          let traders = this.$store.getters['traderModule/allTraders'];
          let remodeledTraders = [];
              traders.forEach( u => {
                    u = { ...u, traderName: u.firstname+" "+u.surname}
                    remodeledTraders.push(u);
                });
              return remodeledTraders;
      },
      noteCopy(){
        let note = '';
        if(this.id === '0') {
            note = { ...this.$store.getters['noteModule/newNote'] };  // copy the template
            note.leaseId = this.leaseId; // cannot create a note without a lease Id.
        }
        else {
            note = { ...this.$store.getters['noteModule/selectedNote'](this.id) }// copy the actual existing note for editing.
        }
        this.noteDBCopy = note;
        return this.noteDBCopy;
      }
    },
    methods: {
      showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
      },
      hasChanged(){
        this.formIsModified = true
      },
      hasChangedChkBox(event){
        this.formIsModified = true
      },
      doEdit(){
        //If the user does not have the permission to edit then this button is automatically disabled or even invisible.
        this.isFormDisabled = false;
      },
      cancelEdits(confirmed){
          if(confirmed){
            this.isFormDisabled = true;
            this.$router.push('/notes/notes')
          }
          else {
              this.showDialog = false;
              this.formIsModified = true;
          }
      },
      doDialog(heading, message){
          if(this.formIsModified) {
              this.heading = heading
              this.showDialog = true;
          }
          else {
              this.isFormDisabled = true;
              this.$router.push('/notes/notes')
          }
      },
      doCancel(){
          this.doDialog('Confirm Cancel', this.message);
      },
      doClose(){
          this.doDialog("Confirm Close",this.message)
      },
      closeDialog(value){
          if(value) {// answer is in the affirmative to close even if not saved.
              this.formIsModified = false;
              this.isFormDisabled = true;
              this.$router.push('/notes/notes')
          }
      },
      loadnotesHC(){
        const notesHC = this.$store.getters['noteModule/loadedNotesHC'];
        for( var tr of notesHC){
             this.$store.dispatch('noteModule/insertNote', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.id === '0') {
              this.$store.dispatch('noteModule/insertNote', this.noteCopy, {root:true})
                  .then( result => {
                    if(this.$store.getters.error){
                        this.showSnackBar(error.message);
                    }
                    else {
                      this.showSnackBar('Saved.');
                      this.formIsModified = false;
                    }
                  })
          }
          else {
              this.$store.dispatch('noteModule/updateNote', this.noteCopy, {root:true})
              .then( result => {
                      if(this.$store.getters.error){
                          this.showSnackBar(error.message);
                      }
                      else {
                        this.showSnackBar('Updated.');
                        this.formIsModified = false;
                      }
              })
              .catch(error => { this.showSnackBar(error.message)})
          }
      } else {
        this.showSnackBar("Not modified")
      }
    }
  }
}
</script>

<style scoped>
</style>
