<template>
    <v-layout>
    <v-flex xs12 md12 sm6 >
      <v-card>
        <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title primary-title>
          <div>
            <h3>Trader View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="traderCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs5>
                        <v-text-field @input="hasChanged"  prepend-icon="person" name="firstname" label="FirstName"  :disabled="isFormDisabled" v-model="traderCopy.firstname">{{traderCopy.firstname}}</v-text-field>
                      </v-flex>

                      <v-flex xs5 class="ml-4">
                          <v-text-field @input="hasChanged" id="surname" name="surname" label="Surname"  :disabled="isFormDisabled" v-model="traderCopy.surname">{{traderCopy.surname}}</v-text-field>
                      </v-flex>
                      <v-flex xs5>
                      <v-text-field @input="hasChanged" prepend-icon="mail_outline" name="email" label="Email"  :disabled="isFormDisabled" v-model="traderCopy.email">{{traderCopy.email}}</v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout row wrap class="light-text">
                      <v-flex xs3>
                      <v-text-field @input="hasChanged" prepend-icon="call" name="cellphone" label="Cellphone"  :disabled="isFormDisabled" v-model="traderCopy.cellphone">{{traderCopy.cellphone}}</v-text-field>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex xs8 >
                      <v-text-field @input="hasChanged" prepend-icon="location_city" name="streetAddress" label="Address"  :disabled="isFormDisabled" v-model="traderCopy.streetAddress">{{traderCopy.streetAddress}}</v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout>
                      <v-flex xs3>
                          <v-text-field xs4 @input="hasChanged" prepend-icon="person" name="idnumber" label="IDNumber"  :disabled="isFormDisabled" v-model="traderCopy.idNumber">{{traderCopy.idNumber}}</v-text-field>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex xs8>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="commodity" label="Commodity"
                            hint="The type of goods sold by the trader"
                            :disabled="isFormDisabled" v-model="traderCopy.commodity">{{traderCopy.commodity}}</v-text-field>
                       </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="city" label="City"
                            hint="City"
                            :disabled="isFormDisabled" v-model="traderCopy.city">{{traderCopy.city}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="province" label="Province"
                            hint="Province"
                            :disabled="isFormDisabled" v-model="traderCopy.province">{{traderCopy.province}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="postalCode" label="Postal Code"
                            hint="Postal Code"
                            :disabled="isFormDisabled" v-model="traderCopy.postalCode">{{traderCopy.postalCode}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="country" label="Country"
                            hint="Country of residence"
                            :disabled="isFormDisabled" v-model="traderCopy.country">{{traderCopy.country}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="company" label="Company"
                            hint="Company description"
                            :disabled="isFormDisabled" v-model="traderCopy.company">{{traderCopy.company}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="persontype" label="Person Type"
                            hint="The type of goods sold by the trader"
                            :disabled="isFormDisabled" v-model="traderCopy.persontype">{{traderCopy.persontype}}</v-text-field>
                       </v-flex>
                    </v-layout>
                    <v-layout row wrap class="light-text mb-2">
                        <v-flex>
                        <!-- <v-checkbox left @input="hasChanged"   name="hasLeaseApplicationForm" :label="`Has Lease Docs: ${traderCopy.hasLeaseApplicationForm.toString()}`" :disabled="isFormDisabled" v-model="traderCopy.hasLeaseApplicationForm"></v-checkbox> -->
                        <v-checkbox left @input="hasChanged"   name="hasLeaseApplicationForm" label="`Has Lease Docs:" :disabled="isFormDisabled" v-model="traderCopy.hasLeaseApplicationForm"></v-checkbox>
                        </v-flex>
                        <v-flex>
                        <v-checkbox left @input="hasChanged"   name="hasMarriageCertificate" label="`Has Marriage Cert:" :disabled="isFormDisabled" v-model="traderCopy.hasMarriageCertificate"></v-checkbox>
                        </v-flex>
                        <v-flex>
                        <v-checkbox left @input="hasChanged"   name="hasProofOfAddress" label="Has Proof of Res: " :disabled="isFormDisabled" v-model="traderCopy.hasProofOfAddress"></v-checkbox>
                        </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
            <v-card-actions>
          <v-btn v-if="hasEditPermission" flat color="orange" @click="doEdit">Edit</v-btn>
          <v-btn flat color="orange" @click="doCancel">Cancel</v-btn>
          <v-btn flat color="orange" @click="doSave">Save</v-btn>
          <v-btn flat color="orange" @click="doClose">Close</v-btn>
          <v-btn flat color="orange" @click="loadtradersHC">LoadHC</v-btn>
        </v-card-actions>
          <app-dialog :message="message" heading="Confirm Close?" :openDialog="showDialog"></app-dialog>
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
          //traderCopy : {...this.trader},
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Confirm Close",
          showDialog: false
        }
    },
    computed:{ hasEditPermission(){
       return true;  /// need to get it from the store.
     },
      traderCopy(){
        let trader = '';
        if(this.id === '0')
            trader = { ...this.$store.getters['traderModule/newTrader'] };  // copy the template
         else {
            trader = { ...this.$store.getters['traderModule/selectedTrader'](this.id) }// copy the actual existing trader for editing.
         }
         return trader;
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
      doEdit(){
        //If the user does not have the permission to edit then this button is automatically disabled or even invisible.
        this.isFormDisabled = false;
      },
      doCancel(){
        if(this.formIsModified) {
      //show alert / dialogue confirming cancel yup
          this.formIsModified = false;
        }
        this.isFormDisabled = true;
        this.$router.push('/traders/traders')

      },
      doClose(){
          if(this.formIsModified) {
            this.showSnackBar('Form has been modified. First Save or else press Cancel.');
            return;
          }
          this.$router.push('/traders/traders');
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
          this.$store.dispatch('resetError',{root:true});
          if(this.traderCopy.id === '0') {
              this.$store.dispatch('traderModule/insertTrader', this.traderCopy, {root:true})
                  .then( result => {
                    if(this.$store.getters.error !== 'OK'){
                        this.showSnackBar(error);
                    }
                    else {
                      this.showSnackBar('Saved.');
                      this.formIsModified = false;
                    }
                  })
          }
          else {
              this.$store.dispatch('traderModule/updateTrader', this.traderCopy, {root:true})
                  .then( result => {
                    if(this.$store.getters.error !== 'OK'){
                        this.showSnackBar(error);
                    }
                    else {
                      this.showSnackBar('Saved.');
                      this.formIsModified = false;
                    }
                  })

          }
        }

      }
    }
}
</script>

<style scoped>
</style>
