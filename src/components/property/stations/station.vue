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
            <h3>Station View and Edit Page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="stationCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs8>
                        <v-text-field @input="hasChanged"  prepend-icon="commute" name="name" label="Station Name"
                                      :disabled="isFormDisabled" v-model="stationCopy.name"  required :rules="[rules.required]"
                                      >{{stationCopy.name}}
                        </v-text-field>
                      </v-flex>

                      <v-flex xs8>
                          <v-text-field @input="hasChanged" prepend-icon="location_city" id="address" name="address" label="Address"  :disabled="isFormDisabled"
                                        v-model="stationCopy.address"   required :rules="[rules.required]">{{stationCopy.address}}
                          </v-text-field>
                      </v-flex>
                       </v-layout>
                      <v-flex xs8>
                      <v-text-field @input="hasChanged" prepend-icon="call" name="phone" label="Phone"  :disabled="isFormDisabled"
                                    v-model="stationCopy.phone"  required :rules="[rules.required]" >{{stationCopy.phone}}
                      </v-text-field>
                      </v-flex>
                  </v-container>
                </v-form>
              </v-card-text>
        <v-card-actions xs12 md6 sm6 offset-sm3 >
              <v-spacer></v-spacer>
              <v-btn v-if="hasEditPermission" flat color="orange" @click="doEdit">Edit</v-btn>
              <v-btn flat color="orange" @click="doCancel">Cancel</v-btn>
              <v-btn flat color="orange" @click="doSave">Save</v-btn>
              <v-btn flat color="orange" @click="doClose">Close</v-btn>
              <!-- <v-btn flat color="orange" @click="loadstationsHC">LoadHC</v-btn> -->
        </v-card-actions>
         <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="cancelEdits" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Dialog from '../../shared/dialog'
export default {

   props: ['id'],

   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          //stationCopy : {...this.station},
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Form has changed. Cancel Edits?",
          heading:"Confirm Cancel",
          showDialog: false,
          rules: {
            required: (value) => !!value || 'Required.',
            email: (value) => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
          }
        }
    },
    computed:{ hasEditPermission(){
       return true;  /// need to get it from the store.
     },
      stationCopy(){
        let station = '';
        if(this.id === '0')
            station = { ...this.$store.getters['stationModule/newStation'] };  // copy the template
         else {
            station = { ...this.$store.getters['stationModule/selectedStation'](this.id) }// copy the actual existing station for editing.
         }
         return station;
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
            this.$router.push('/property/stations/stations')
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
              this.$router.push('/property/stations/stations')
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
              this.$router.push('/property/stations/stations')
          }
      },
      loadstationsHC(){
        const stationsHC = this.$store.getters['stationModule/loadedStationsHC'];
        console.log(stationsHC)
        for( var tr of stationsHC){
             this.$store.dispatch('stationModule/insertStation', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.stationCopy.id === '0') {
              this.$store.dispatch('stationModule/insertStation', this.stationCopy, {root:true})
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
              this.$store.dispatch('stationModule/updateStation', this.stationCopy, {root:true})
              .then( result => {
                      if(this.$store.getters.error){
                          this.showSnackBar(error.message);
                      }
                      else {
                        this.showSnackBar('Saved.');
                        this.formIsModified = false;
                      }
              })
              .catch(error => { this.showSnackBar(error.message)})
          }
      } else {
        this.showSnackBar("Not modified")
               console.log('NOT MODIFIED!!!!!')
      }
    }
  }
}
</script>

<style scoped>
</style>
