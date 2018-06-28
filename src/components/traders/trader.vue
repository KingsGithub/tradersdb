<template>

    <v-layout>
    <!-- <v-flex xs12 sm8 offset-sm2> -->
    <v-flex xs12 sm12 offset-sm0>

      <v-card hover raised style="border-radius:5px">
        <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title height="10">
            <h4>Trader View and Edit page</h4>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="traderCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs5 >
                        <v-text-field @input="hasChanged"  prepend-icon="person" name="firstname" label="FirstName"
                                      :disabled="isFormDisabled" v-model="traderCopy.firstname"  required :rules="[rules.required]"
                                      >{{traderCopy.firstname}}
                        </v-text-field>
                      </v-flex>

                      <v-flex xs5 class="ml-2">
                          <v-text-field @input="hasChanged" id="surname" name="surname" label="Surname"  :disabled="isFormDisabled"
                                        v-model="traderCopy.surname"   required :rules="[rules.required]">{{traderCopy.surname}}
                          </v-text-field>
                      </v-flex>
                       </v-layout>
                    <v-layout row wrap class="light-text">
                      <v-flex xs5>
                      <v-text-field @input="hasChanged" prepend-icon="mail_outline" name="email" label="Email"  :disabled="isFormDisabled"
                                    v-model="traderCopy.email"  required :rules="[rules.required, rules.email]" >{{traderCopy.email}}
                      </v-text-field>
                      </v-flex>
                      <v-flex xs3>
                      <v-text-field @input="hasChanged" prepend-icon="call" name="cellphone" label="Cellphone"
                                    :disabled="isFormDisabled" v-model="traderCopy.cellphone"  required :rules="[rules.required]">
                                    {{traderCopy.cellphone}}
                       </v-text-field>
                      </v-flex>
                      <v-spacer></v-spacer>
                  </v-layout>
                  <v-layout>
                      <v-flex xs3>
                          <v-text-field @input="hasChanged" prepend-icon="person" name="idNumber" label="IDNumber"
                          :disabled="isFormDisabled" v-model="traderCopy.idNumber" required :rules="[rules.required]">
                            {{traderCopy.idNumber}}</v-text-field>
                      </v-flex>
                      <v-flex xs4 class="ml-3">
                        <v-text-field @input="hasChanged" prepend-icon="store" name="commodity" label="Commodity"
                            hint="The type of goods sold by the trader"
                            :disabled="isFormDisabled" v-model="traderCopy.commodity"  required :rules="[rules.required]" >
                            {{traderCopy.commodity}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="company" label="Company"
                            hint="Company description"
                            :disabled="isFormDisabled" v-model="traderCopy.company">{{traderCopy.company}}</v-text-field>
                       </v-flex>
                    </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs8 sm7 >
                      <v-text-field @input="hasChanged" prepend-icon="location_city" name="streetAddress" label="Street Address"
                                    :disabled="isFormDisabled" v-model="traderCopy.streetAddress" required :rules="[rules.required]"
                       >{{traderCopy.streetAddress}}</v-text-field>
                      </v-flex>
                      <v-flex xs3 class="ml-4">
                        <v-text-field  @input="hasChanged" prepend-icon="store" name="personType" label="Person Type"
                            hint="Classification of person involved"
                            disabled v-model="traderCopy.personType"  required :rules="[rules.required]"
                            >{{traderCopy.personType}}</v-text-field>
                       </v-flex>
                  </v-layout>
                    <v-layout row wrap>
                        <v-flex xs3>
                        <v-text-field xs3 @input="hasChanged" prepend-icon="store" name="city" label="City"
                            hint="City"
                            :disabled="isFormDisabled" v-model="traderCopy.city" required :rules="[rules.required]"
                            >{{traderCopy.city}}</v-text-field>
                       </v-flex>
                       <v-flex xs2>
                        <v-text-field xs3 @input="hasChanged" prepend-icon="store" name="postalCode" label="Postal Code"
                            hint="Postal Code"
                            :disabled="isFormDisabled" v-model="traderCopy.postalCode">{{traderCopy.postalCode}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs4 @input="hasChanged" prepend-icon="store" name="province" label="Province"
                            hint="Province"
                            :disabled="isFormDisabled" v-model="traderCopy.province"  required :rules="[rules.required]"
                            >{{traderCopy.province}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="country" label="Country"
                            hint="Country of residence"
                            :disabled="isFormDisabled" v-model="traderCopy.country">{{traderCopy.country}}</v-text-field>
                       </v-flex>
                       </v-layout>


                    <v-layout row wrap class="light-text mb-2">
                        <v-flex>
                        <!-- <v-checkbox left @input="hasChanged"   name="hasLeaseApplicationForm" :label="`Has Lease Docs: ${traderCopy.hasLeaseApplicationForm.toString()}`" :disabled="isFormDisabled" v-model="traderCopy.hasLeaseApplicationForm"></v-checkbox> -->
                        <v-switch  @change="hasChanged" color="orange" name="hasLeaseApplicationForm" label="Has Lease Docs:"
                        :disabled="isFormDisabled" v-model="traderCopy.hasLeaseApplicationForm"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch   @change="hasChanged" color="orange"  name="hasMarriageCertificate" label="Has Marriage Cert:"
                        :disabled="isFormDisabled" v-model="traderCopy.hasMarriageCertificate"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch   @change="hasChanged" color="orange"  name="hasProofOfAddress" label="Has Proof of Address: "
                        :disabled="isFormDisabled" v-model="traderCopy.hasProofOfAddress"></v-switch>
                        </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
        <v-card-actions xs12 md6 sm6 offset-sm3 >
              <v-spacer></v-spacer>
              <!-- <v-btn v-if="hasEditPermission" dark color="orange" @click="doAccountNoEdit">Edit Account No</v-btn> -->
              <v-btn v-if="hasEditPermission" dark color="orange" @click="doEdit">Edit</v-btn>
              <v-btn dark color="orange" @click="doCancel">Cancel</v-btn>
              <v-btn dark color="orange" @click="doSave">Save</v-btn>
              <v-btn dark color="orange" @click="doClose">Close</v-btn>
              <!-- <v-btn dark color="orange" @click="loadtradersHC">LoadHC</v-btn> -->
        </v-card-actions>
          <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="cancelEdits" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Trader from  '../traders/trader.vue'
  import Documents from '../documents/documents.vue'
  import Notes from '../notes/notes.vue'
  import Payments from '../payments/payments.vue'
  import Recon from '../recons/recons.vue'
export default {
   components: {
      appTrader: Trader,
      appDocuments: Documents,
      appNotes: Notes,
      appPayments: Payments,
      appRecon: Recon
    },
   props: ['traderId'],
    data(){
        return {
          routerViews: [
            {tab: 'tab-1', comp: '<app-trader/>'},
            {tab: 'tab-2', comp: '<app-documents/>'},
            {tab: 'tab-3', comp: '<app-notes/>'},
            {tab: 'tab-4', comp: '<app-payments/>'},
            {tab: 'tab-5', comp: '<app-recon/>'},
            ],
          isFormDisabled:true,
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          traderdbCopy:{},
          editedItem:{accountNo:'', isActive:false, startDate:(new Date()).toDateString(), endDate:(new Date()).toDateString()},
          formTitle:"Edit Account Number",
          dialog:false,
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
      traderCopy(){
        let trader = '';
        if(this.traderId === '0')
            trader = { ...this.$store.getters['traderModule/newTrader'] };  // copy the template
         else {
            trader = { ...this.$store.getters['traderModule/selectedTrader'](this.traderId) }// copy the actual existing trader for editing.
         }
         this.traderdbCopy = trader
         return this.traderdbCopy;
      }
    },
    methods: {
      doAccountNoEdit(){
        if(this.traderCopy.accountNumbers && this.traderCopy.accountNumbers.length > 0){
          this.editedItem = this.traderCopy.accountNumbers.find(acno => acno.isActive === true);
          if(!this.editedItem) this.editedItem = this.traderCopy.accountNumbers
              .sort( function(a,b) {
                  Date.parse(a.startDate) >= Date.parse(b.startDate);
                } );
          console.log('Did not find an active account number. Editing old')
        }
        else {
          console.log('creating a new account number')
          this.editedItem = this.$store.getters['traderModule/newAccountNumber'];
          this.editedItem.startDate = (new Date()).toISOString().substring(0,10); // YYYY-MM-DD
          this.editedItem.endDate = (new Date()).toISOString().substring(0,10);
        }
        this.dialog = true;
      },
      showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
      },
      hasChanged(){
        this.formIsModified = true
      },
      hasChangedChkBox(event){
        this.formIsModified = true
        console.log('trader hasChangedChkBox - formisfmodified=', this.formIsModified)
      },
      // cancelAccountNoEdit(){
      //     this.dialog=false;
      // },
      //  editAccountNo(editDocument){
      //     this.editedItem = {...editDocument }; //copy!!!
      //     this.dialog = true;
      // },
      // saveAccountNoEdit(){
      //   this.dialog = false;
      //   this.formIsModified = true;
      //   this.showSnackBar('Account Number has been changed.');
      // },

      doEdit(){
        //If the user does not have the permission to edit then this button is automatically disabled or even invisible.
        this.isFormDisabled = false;
      },
      cancelEdits(confirmed){
          if(confirmed){
            this.isFormDisabled = true;
            this.$router.push('/traders/traders')
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
              this.$router.push('/traders/traders')
          }
      },
      doCancel(){
          this.doDialog('Confirm Cancel', this.message);
      },
      doClose(){
          this.doDialog("Confirm Close",this.message)
      },
      loadtradersHC(){
        const tradersHC = this.$store.getters['traderModule/loadedTradersHC'];
        for( var tr of tradersHC){
             this.$store.dispatch('traderModule/insertTrader', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.traderCopy.id === '0') {
              this.$store.dispatch('traderModule/insertTrader', this.traderCopy, {root:true})
              .then( result => {
                if(this.$store.getters.error){
                    this.showSnackBar(error.message);
                }
                else {
                  this.showSnackBar('Saved.');
                  this.formIsModified = false;
                  this.$store.dispatch('traderModule/setCurrentTrader', this.traderCopy);
                  this.$emit('traderCreated', this.traderCopy.id);
                }
              })
            }
            else {
                  this.$store.dispatch('traderModule/updateTrader', this.traderCopy, {root:true})
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
