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
            <h3>lease View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="leaseCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="store" name="leaseNumber" label="lease Number"
                                      :disabled="isFormDisabled" v-model="leaseCopy.leaseNumber"  required :rules="[rules.required]"
                                      >{{leaseCopy.leaseNumber}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm4>
                        <v-select  @input="hasChanged" prepend-icon="commute" name="stationsLOV"  :disabled="isFormDisabled"
                          :items="stationsLOV"
                          v-model="leaseCopy.stationID"
                          item-text="name"
                          item-value="id"
                          label="Station"
                          autocomplete
                        ></v-select>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm4>
                        <v-select  @input="hasChanged" prepend-icon="commute" name="tradersLOV"  :disabled="isFormDisabled"
                          :items="tradersLOV"
                          v-model="leaseCopy.traderID"
                          item-text="name"
                          item-value="id"
                          label="Trader"
                          autocomplete
                        ></v-select>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm4>
                        <v-select  @input="hasChanged" prepend-icon="commute" name="unitsLOV"  :disabled="isFormDisabled"
                          :items="unitsLOV"
                          v-model="leaseCopy.unitID"
                          item-text="name"
                          item-value="id"
                          label="Unit"
                          autocomplete
                        ></v-select>
                      </v-flex>
                  </v-layout>
                  <v-layout>
                      <v-flex xs4 >
                          <v-text-field xs4 @input="hasChanged" prepend-icon="calendar" name="occupationStartDate" label="StartDate"
                          disabled v-model="leaseCopy.occupationStartDate" required :rules="[rules.required]">
                            {{leaseCopy.occupationStartDate}}</v-text-field>
                      </v-flex>
                      <v-flex xs4 >
                          <v-text-field xs4 @input="hasChanged" prepend-icon="calendar" name="effectiveDate" label="Effective Date"
                          disabled v-model="leaseCopy.effectiveDate" required :rules="[rules.required]">
                            {{leaseCopy.effectiveDate}}</v-text-field>
                      </v-flex>
                      <v-flex xs4 >
                          <v-text-field xs4 @input="hasChanged" prepend-icon="calendar" name="endDate" label="End Date"
                          disabled v-model="leaseCopy.endDate" required :rules="[rules.required]">
                            {{leaseCopy.endDate}}</v-text-field>
                      </v-flex>
                       <v-flex xs2>
                        <v-text-field class="ml-4"  xs3 @input="hasChanged" prepend-icon="store" name="rental" label="Rental Amount"
                            hint="Rental Amount"
                            disabled v-model="leaseCopy.rental">{{leaseCopy.rental}}</v-text-field>
                       </v-flex>
                  </v-layout>
                  <v-layout>
                       <v-flex xs4>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="duartionYears" label="duration Years"
                            hint="Duration Years"
                            disabled v-model="leaseCopy.durationYears"  required :rules="[rules.required]" >
                            {{leaseCopy.durationYears}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 class="ml-4" @input="hasChanged" prepend-icon="store" name="paymentPeriod" label="Payment Period"
                            hint="Classification of property involved"
                            disabled v-model="leaseCopy.paymentPeriod"  required :rules="[rules.required]"
                            >{{leaseCopy.paymentPeriod}}</v-text-field>
                       </v-flex>
                  </v-layout>
                    <v-layout row wrap class="light-text mb-2">
                        <v-flex>
                        <v-switch  @click="hasChangedChkBox($event)" color="green" name="hasNotes" label="Has Notes"
                                  :disabled="isFormDisabled" v-model="leaseCopy.hasNotes"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch   @click="hasChangedChkBox($event)"  color="green"  name="hasPayments" label="Has Payments"
                                    :disabled="isFormDisabled" v-model="leaseCopy.hasWashbasin"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch   @click="hasChangedChkBox($event)"  color="green"  name="isActive" label="Active? "
                                    :disabled="isFormDisabled" v-model="leaseCopy.isActive"></v-switch>
                        </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
        <v-card-actions xs12 md6 sm6 offset-sm3 >
              <v-spacer></v-spacer>
              <v-btn v-if="hasEditPermission" flat color="orange" @click="doEdit">Edit</v-btn>
              <v-btn flat color="orange" @click="doCancel">Cancel</v-btn>
              <v-btn flat color="orange" @click="doSave">Save</v-btn>
              <v-btn flat color="orange" @click="doClose">Close</v-btn>
              <v-btn flat color="orange" @click="loadleasesHC">LoadHC</v-btn>
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

   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          leaseDBCopy : {},
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
          return this.$store.getters['traderModule/allTraders'];
      },
      leaseCopy(){
        let lease = '';
        if(this.id === '0')
            lease = { ...this.$store.getters['leaseModule/newlease'] };  // copy the template
         else {
            lease = { ...this.$store.getters['leaseModule/selectedlease'](this.id) }// copy the actual existing lease for editing.
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
          if(this.leaseCopy.id === '0') {
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
                        this.showSnackBar('Saved.');
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
