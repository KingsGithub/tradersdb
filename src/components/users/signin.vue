<template>
  <v-container>
    <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-snackbar :timeout="3000" top v-model="snackbar"> {{ error }}
          <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent="onSignIn">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="person"
                    name = "email"
                    label  = "Email"
                    id = "email"
                    type = "email"
                    v-model = "email"
                    required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="person"
                    name = "password"
                    label  = "Password"
                    id = "password"
                    type = "password"
                    v-model = "password"
                    required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit"> Sign In</v-btn>
                </v-flex>
                <v-flex v-show="loginError !== 'OK'">
                  <v-text-field label="Eerror" id="eerror" :value="loginError">{{something}}</v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>
<script>
import Alert from '../shared/alert.vue';
export default {
    data(){
        return {
          email:'',
          password:'',
          confirmPassword:'',
          something:'asfsadf',
          loginError: "OK" //this.error||'help'
          ,timeout:3000,
          y:"top",
          mode: "NONE",
          x:"",
          snackbar:false
        }
    },
    components:{
      alert:Alert
    },
    methods: {
      onSignIn(){
        // go via vuex to store the user in the store.
        //this.$store.dispatch('resetError').then(res => {
            this.$store.dispatch('signin', {email:this.email, password: this.password});
        // })
      }
    },
    computed:{
      error(){
        const errormessage = this.$store.getters.error;
        console.log('computed error:', errormessage)
        if(errormessage !== 'OK') {
            this.loginError = errormessage; this.snackbar = true;
            return errormessage;
        } else return 'OK'
      },
       userId(){
        return this.$store.getters.userId;
      }
    },
    watch: {
      userId(value){
        if( value !== '' && value !== undefined) {
          this.$router.push('/');
        }
      }
    },
    created(){
      this.$store.dispatch('logout');
      this.$store.dispatch('resetError')
    }
}
</script>

<style scoped>
</style>
