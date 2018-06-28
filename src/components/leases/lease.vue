<template>
    <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card hover raised style="border-radius:5px">
        <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title primary-title>
          <div>
            <h3>Lease View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="leaseCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs6>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="leaseNumber" label="lease Number"
                                      :disabled="isFormDisabled" v-model="leaseCopy.leaseNumber"  required :rules="[rules.required]"
                                      >{{leaseCopy.leaseNumber}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm3>
                        <v-select  @input="hasChanged" prepend-icon="commute" name="stationsLOV"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="stationsLOV"
                          v-model="leaseCopy.stationId"
                          item-text="name"
                          item-value="id"
                          label="Station"
                          autocomplete
                        ></v-select>
                      </v-flex>
                       <v-flex xs12 sm3  class="ml-4">
                        <v-select  @input="hasChanged" prepend-icon="person" name="tradersLOV"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="tradersLOV"
                          v-model="leaseCopy.traderId"
                          item-text="traderName"
                          item-value="id"
                          label="Trader"
                          autocomplete
                        ></v-select>
                      </v-flex>
                       <v-flex xs12 sm3 class="ml-4">
                        <v-select  @input="hasChanged" prepend-icon="store" name="unitsLOV"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="unitsLOV"
                          v-model="leaseCopy.unitId"
                          item-text="unitNumber"
                          item-value="id"
                          label="Unit"
                          autocomplete
                        ></v-select>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <!-- <date-picker  label="Start Date"  :disabled="isFormDisabled" @input="hasChanged" lang="eng" editable v-model="leaseCopy.occupationStartDate"> </date-picker> -->
                    <v-flex xs3 >
                        <app-date :rules="[rules.required]" label="Start Date" :disabled="isFormDisabled" @input="hasChanged"
                                   v-model="leaseCopy.occupationStartDate"  :value="leaseCopy.occupationStartDate" >
                        </app-date>
                    </v-flex>
                    <v-flex xs3   class="ml-4">
                        <app-date :rules="[rules.required]" label="Effective Date" :disabled="isFormDisabled" @input="hasChanged"
                                   v-model="leaseCopy.effectiveDate"  :value="leaseCopy.effectiveDate" >
                        </app-date>
                      </v-flex>
                      <v-flex xs3  class="ml-4">
                        <app-date :rules="[rules.required]" label="End Date" :disabled="isFormDisabled" @input="hasChanged"
                                   v-model="leaseCopy.endDate"  :value="leaseCopy.endDate" >
                        </app-date>
                      </v-flex>
                  </v-layout>
                  <v-layout>
                       <v-flex xs3>
                        <v-text-field  @input="hasChanged" prepend-icon="event" name="duartionYears" label="Duration Years"
                            hint="Duration Years"
                             :disabled="isFormDisabled" v-model="leaseCopy.durationYears"  required :rules="[rules.required]" >
                            {{leaseCopy.durationYears}}</v-text-field>
                       </v-flex>
                       <v-flex xs3 class="ml-4">
                        <v-text-field   xs3 @input="hasChanged" prepend-icon="attach_money"  required :rules="[rules.required]" name="rental" label="Rental Amount"
                            hint="Rental Amount"
                             :disabled="isFormDisabled" v-model="leaseCopy.rental">{{leaseCopy.rental}}</v-text-field>
                       </v-flex>
                       <v-flex xs3 sm3 class="ml-4">
                          <v-select  @input="hasChanged" prepend-icon="event" name="paymentPeriod"  required  :rules="[rules.required]" :disabled="isFormDisabled"
                            :items="paymentPeriodLOV"
                            v-model="leaseCopy.paymentPeriod"
                            label="Payment Period"
                            autocomplete
                          ></v-select>
                      </v-flex>
                  </v-layout>
                    <v-layout row wrap class="light-text mb-2">
                       <v-flex xs3 >
                        <v-switch  @change="hasChanged" color="green" name="hasNotes" label="Has Notes"
                                  :disabled="isFormDisabled" v-model="leaseCopy.hasNotes"></v-switch>
                        </v-flex>
                       <v-flex xs3 class="ml-4">
                        <v-switch   @change="hasChanged" color="green"  name="hasPayments" label="Has Payments"
                                    :disabled="isFormDisabled" v-model="leaseCopy.hasPayments"></v-switch>
                        </v-flex>
                       <v-flex xs3 class="ml-4">
                        <v-switch   @change="hasChanged" color="green"  name="isActive" label="Active? "
                                    :disabled="isFormDisabled" v-model="leaseCopy.isActive"></v-switch>
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
              <v-btn dark color="orange" @click="doDocs">Document(s)</v-btn>
              <!-- <v-btn dark color="orange" @click="loadleasesHC">LoadHC</v-btn> -->
        </v-card-actions>
         <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="cancelEdits" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

import Dialog from '../shared/dialog'

export default {

   props: ['id'],
  //  props : {
  //     traderId:{ type: String, required: false, default: '-LDMAIzfsAsUOAddMlpK'},
  //     leaseId: { type: String, required: false, default: '-LDvJcCxj4-gl35cZ26K'}
  //   },

   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          leaseDBCopy : {},
          formIsModified:false,
          snackbar: false,
          paymentPeriodLOV: ['Weekly', 'Monthly', 'Per Annum'],
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Form has changed. Cancel Edits?",
          heading:"Confirm Cancel",
          showDialog: false,
          menu2:false,
          theFiles:[],
          rules: {
            required: (value) => !!value || 'Required.',
            email: (value) => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
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
      leaseCopy(){
        let lease = '';
        if(this.id === '0')
            lease = { ...this.$store.getters['leaseModule/newLease'] };  // copy the template
         else {
            lease = { ...this.$store.getters['leaseModule/selectedLease'](this.id) }// copy the actual existing lease for editing.
         }
         this.leaseDBCopy = lease;
         return this.leaseDBCopy;
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
            this.$router.push('/leases/leases')
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
              this.$router.push('/leases/leases')
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
              this.$router.push('/leases/leases')
          }
      },
      loadleasesHC(){
        const leasesHC = this.$store.getters['leaseModule/loadedLeasesHC'];
        for( var tr of leasesHC){
             this.$store.dispatch('leaseModule/insertLease', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.id === '0') {
              this.$store.dispatch('leaseModule/insertLease', this.leaseCopy, {root:true})
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
              this.$store.dispatch('leaseModule/updateLease', this.leaseCopy, {root:true})
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
    },
    doDocs(){
      if(this.leaseDBCopy.leaseId) {
        this.$router.push("/documents/document/0,"+this.leaseDBCopy.leaseId);
      }
      else {
        this.$router.push("/documents/document/0,0");
      }
    },
    doFiles(files){
      console.log("Files=", this.theFiles, files)
    }
  }
}
</script>

<style scoped>
</style>
