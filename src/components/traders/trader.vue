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
                      <v-text-field @input="hasChanged" prepend-icon="location_city" name="address" label="Address"  :disabled="isFormDisabled" v-model="traderCopy.address">{{traderCopy.address}}</v-text-field>
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

                   <v-layout row wrap class="light-text mb-2">
                        <v-flex>
                        <!-- <v-checkbox left @input="hasChanged"   name="hasLeaseDocuments" :label="`Has Lease Docs: ${traderCopy.hasLeaseDocuments.toString()}`" :disabled="isFormDisabled" v-model="traderCopy.hasLeaseDocuments"></v-checkbox> -->
                        <v-checkbox left @input="hasChanged"   name="hasLeaseDocuments" label="`Has Lease Docs:" :disabled="isFormDisabled" v-model="traderCopy.hasLeaseDocuments"></v-checkbox>
                        </v-flex>
                        <v-flex>
                        <v-checkbox left @input="hasChanged"   name="hasProofOfResidence" label="Has Proof of Res: " :disabled="isFormDisabled" v-model="traderCopy.hasProofOfResidence"></v-checkbox>
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
        </v-card-actions>
          <app-dialog :message="message" heading="Confirm Close?" :openDialog="showDialog"></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Dialog from '../shared/dialog'
export default {
   props: ['trader','expanded'],
   computed: {
     hasEditPermission(screen="trader"){
       return true;  /// need to get it from the store.
     }
   },
   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          traderCopy : {...this.trader},
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Confirm Close",
          showDialog: false
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
        this.traderCopy = { ...this.trader };
      },
      doCancel(){
        if(this.formIsModified) {

          this.formIsModified = false;
        }
        this.isFormDisabled = true;

      },
      doClose(){
          if(this.formIsModified) {
            this.showSnackBar('Form has been modified. First Save or else press Cancel.');
            return;
          }
          this.$router.push('/trader/traders');
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('resetError',{root:true});
          console.log('error cleared. dispatching insertTrader')
          this.$store.dispatch('traderModule/insertTrader', this.traderCopy, {root:true})
          .then( result => {
            if(this.$store.getters.error !== 'OK'){
                this.showSnackBar(error);
            }
            else {
              console.log('showing saved')
              this.showSnackBar('Saved.');
              this.formIsModified = false;
            }
          })
        }

      }
    }
}
</script>

<style scoped>
</style>
