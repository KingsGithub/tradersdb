
<template>
  <v-container>
    <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent="onSignup">
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
                  <v-text-field
                    prepend-icon="person"
                    name = "confirmPassword"
                    label  = "Confirm Password"
                    id = "confirmpassword"
                    type = "password"
                    v-model = "confirmPassword"
                    :rules="[comparePasswords]">
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit"> Sign Up</v-btn>
                </v-flex>
                </v-layout>
                <v-layout>
                <v-flex label="UserID:">{{userId}}</v-flex>
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
import Vuex from 'vuex';
export default {
    data(){
        return {
          email:'',
          password:'',
          confirmPassword:''
        }
    },
    methods: {
      onSignup(){
        // go via vuex to store the user in the store.
        const newUser = { email: this.email, password:this.password };
        this.$store.dispatch('signupUser', newUser )
        .then ( result => {
            console.log(result);
        })
        .catch( error => {
            console.log(error);
        })
      }
    },
    computed:{
      comparePasswords(){
        return this.confirmPassword === this.password ? true:"Passwords do not match";
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
    }
}
</script>

<style scoped>
</style>
