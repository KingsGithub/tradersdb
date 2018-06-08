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
            <h3>Payment View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="paymentCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm5 class="mr-2">
                        <v-select  @input="hasChanged"  @change="hasChanged"  prepend-icon="folder" name="leasesLOV"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="leasesLOV"
                          v-model="paymentCopy.leaseId"
                          item-text="leaseDescription"
                          item-value="id"
                          label="Lease"
                          autocomplete
                        ></v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="folder" name="referenceNumber" label="Reference Number"
                                      :disabled="isFormDisabled" v-model="paymentCopy.referenceNumber"  required :rules="[rules.required]"
                                      >{{paymentCopy.referenceNumber}}
                        </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs3>
                      <v-text-field  @input="hasChanged" label="Amount"  @change="hasChanged" prepend-icon="attach_money" name="amount"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                        v-model="paymentCopy.amount"
                      >
                      {{paymentCopy.amount}}
                      </v-text-field>
                    </v-flex>
                    <v-flex xs3 class="ml-4" >
                        <app-date :rules="[rules.required]" label="Date Paid" :disabled="isFormDisabled" @input="hasChanged"  @change="hasChanged"
                                   v-model="paymentCopy.date"  :value="paymentCopy.date" >
                        </app-date>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                       <v-flex xs3>
                         <v-select  @input="hasChanged" @change="hasChanged" prepend-icon="folder" name="transactionType"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="transactionTypes"
                          v-model="paymentCopy.transactionType"
                          label="Transaction Type"
                          autocomplete
                        ></v-select>
                       </v-flex>
                       <v-flex xs3 class="ml-4">
                          <v-select  @input="hasChanged"  @change="hasChanged" prepend-icon="folder" name="chargeType"  required :rules="[rules.required]"  :disabled="isFormDisabled"
                          :items="chargeTypes"
                          v-model="paymentCopy.chargeType"
                          label="Charge Type"
                          autocomplete
                          ></v-select>
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
              <!-- <v-btn dark color="orange" @click="loadpaymentsHC">LoadHC</v-btn> -->
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
          paymentDBCopy : { id:'0',
                    amount:'0',
                    date:'2017-12-23',
                    leaseId: '0',
                    referenceNumber: '',
                    transactionType: "CASH",
                    chargeType: "RENTAL"},
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
      transactionTypes(){
        return this.$store.getters['paymentModule/transactionTypes'];
      },
      chargeTypes(){
          return this.$store.getters['paymentModule/chargeTypes'];
      },
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
      paymentCopy(){
        let payment = '';
        if(this.id === '0'){
            payment = { ...this.$store.getters['paymentModule/newPayment'] };  // copy the template
            let d = new Date();
            payment.date = d.toISOString().substring(0,10);
        }
         else {
            payment = { ...this.$store.getters['paymentModule/selectedPayment'](this.id) }// copy the actual existing payment for editing.
         }
         this.paymentDBCopy = payment;
         return this.paymentDBCopy;
      },
      leasesLOV() {
        let unitsLOV = this.$store.getters['unitModule/allUnits'];
        let tradersLOV = this.$store.getters['traderModule/allTraders'];
        let leases = this.$store.getters['leaseModule/allLeases'];
        let stationsLOV = this.$store.getters['stationModule/allStations'];
        let remodeledLeases = [];
        let t = '';
        let unitName = '';
        let traderName = '';
        if(leases) {
              leases.forEach( lease => {
                  t = tradersLOV.find( (trader) => {return trader.id === lease.traderId} );
                  if(t) { traderName = t.firstname + ' ' + t.surname } else traderName = 'Not Found';
                  let unit = unitsLOV.find( (unit) => {return unit.id === lease.unitId} );
                  unitName = unit.unitNumber;
                  let stationName = stationsLOV.find((station)=>{return station.id === lease.stationId}).name;

                  let item = { id:lease.id, leaseDescription: lease.leaseNumber +' - '+ stationName +' - '+ traderName +' - '+  unitName }

                  remodeledLeases.push(item);
              });
            return remodeledLeases;
        }
        else return this.$store.getters.loadedLeases;
      },
      loading(){
        return this.$store.getters.loading
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
            this.$router.push('/payments/payments')
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
              this.$router.push('/payments/payments')
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
              this.$router.push('/payments/payments')
          }
      },
      loadpaymentsHC(){
        const paymentsHC = this.$store.getters['paymentModule/loadedPaymentsHC'];
        for( var tr of paymentsHC){
             this.$store.dispatch('paymentModule/insertPayment', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.id === '0') {
              this.$store.dispatch('paymentModule/insertPayment', this.paymentCopy, {root:true})
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
              this.$store.dispatch('paymentModule/updatePayment', this.paymentCopy, {root:true})
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
