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
            <h3>Unit View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="unitCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs4>
                        <v-text-field @input="hasChanged"  prepend-icon="store" name="unitNumber" label="Unit Number"
                                      :disabled="isFormDisabled" v-model="unitCopy.unitNumber"  required :rules="[rules.required]"
                                      >{{unitCopy.unitNumber}}
                        </v-text-field>
                      </v-flex>
                      <v-flex xs2 class="ml-4">
                        <v-select  @input="hasChanged" prepend-icon="flip_to_front" name="unitSizeLOV"  :disabled="isFormDisabled"
                          :items="unitSizes"
                          v-model="unitCopy.unitSize"
                          label="Unit Size"
                          autocomplete
                        ></v-select>
                      </v-flex>

                  </v-layout>
                  <v-layout row wrap class="light-text">
                       <v-flex xs12 sm4>
                        <v-select  @input="hasChanged" prepend-icon="commute" name="stationsLOV"  :disabled="isFormDisabled"
                          :items="stationsLOV"
                          v-model="unitCopy.stationId"
                          item-text="name"
                          item-value="id"
                          label="Station"
                          autocomplete
                        ></v-select>
                      </v-flex>
                      <v-flex xs4 class="ml-4">
                      <v-text-field @input="hasChanged" prepend-icon="location_city" name="address" label="Address"
                                    disabled v-model="unitCopy.address"  required :rules="[rules.required]">
                                    {{unitCopy.address}}
                       </v-text-field>
                      </v-flex>
                  </v-layout>
                  <v-layout>
                      <v-flex xs4 >
                          <v-text-field xs4 @input="hasChanged" prepend-icon="location_city" name="city" label="City"
                          disabled v-model="unitCopy.city" required :rules="[rules.required]">
                            {{unitCopy.city}}</v-text-field>
                      </v-flex>
                       <v-flex xs2>
                        <v-text-field class="ml-4"  xs3 @input="hasChanged" prepend-icon="store" name="postalCode" label="Postal Code"
                            hint="Postal Code"
                            disabled v-model="unitCopy.postalCode">{{unitCopy.postalCode}}</v-text-field>
                       </v-flex>
                  </v-layout>
                  <v-layout>
                       <v-flex xs4>
                        <v-text-field xs8 @input="hasChanged" prepend-icon="store" name="province" label="Province"
                            hint="Province"
                            disabled v-model="unitCopy.province"  required :rules="[rules.required]" >
                            {{unitCopy.Province}}</v-text-field>
                       </v-flex>
                       <v-flex>
                        <v-text-field xs8 class="ml-4" @input="hasChanged" prepend-icon="store" name="propertyType" label="Property Type"
                            hint="Classification of property involved"
                            disabled v-model="unitCopy.propertyType"  required :rules="[rules.required]"
                            >{{unitCopy.propertyType}}</v-text-field>
                       </v-flex>
                  </v-layout>
                    <v-layout row wrap class="light-text mb-2">
                        <v-flex>
                        <v-switch @change="hasChanged"  color="green" name="hasFireExtinguisher" label="Has Fire Extinguisher:"
                                  :disabled="isFormDisabled" v-model="unitCopy.hasFireExtinguisher"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch @change="hasChanged"    color="green"  name="hasWashbasin" label="Has Washbasin:"
                                    :disabled="isFormDisabled" v-model="unitCopy.hasWashbasin"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch  @change="hasChanged"  color="green"  name="isVacant" label="Is Vacant: "
                                    :disabled="isFormDisabled" v-model="unitCopy.isVacant"></v-switch>
                        </v-flex>
                        <v-flex>
                        <v-switch  @change="hasChanged"   color="green"  name="hasStorage" label="Has Storage: "
                                    :disabled="isFormDisabled" v-model="unitCopy.hasStorage"></v-switch>
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
              <!-- <v-btn dark color="orange" @click="loadunitsHC">LoadHC</v-btn> -->
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
          unitDBCopy : {},
          unitSizes: ['Std', 'Big', 'Small', 'Double'],
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
      unitCopy(){
        let unit = '';
        if(this.id === '0')
            unit = { ...this.$store.getters['unitModule/newUnit'] };  // copy the template
         else {
            unit = { ...this.$store.getters['unitModule/selectedUnit'](this.id) }// copy the actual existing unit for editing.
         }
         this.unitDBCopy = unit;
         return this.unitDBCopy;
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
        console.log('unit chkbox change=', this.formIsModified)
      },
      doEdit(){
        //If the user does not have the permission to edit then this button is automatically disabled or even invisible.
        this.isFormDisabled = false;
      },
      cancelEdits(confirmed){
          if(confirmed){
            this.isFormDisabled = true;
            this.$router.push('/property/units/units')
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
              this.$router.push('/property/units/units')
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
              this.$router.push('/property/units/units')
          }
      },
      loadunitsHC(){
        const unitsHC = this.$store.getters['unitModule/loadedUnitsHC'];
        for( var tr of unitsHC){
             this.$store.dispatch('unitModule/insertUnit', tr, {root:true})
        }
      },
      doSave(){
        // Need to save this here. What does that mean?
        if(this.formIsModified) {
          this.$store.dispatch('clearError',{root:true});
          if(this.unitCopy.id === '0') {
              this.$store.dispatch('unitModule/insertUnit', this.unitCopy, {root:true})
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
              this.$store.dispatch('unitModule/updateUnit', this.unitCopy, {root:true})
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
