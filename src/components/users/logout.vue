<template>
    <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media src="/static/doc-images/cards/IMG_1416small.png" height="100px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3>Logout page</h3>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn dark color="orange" @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
  computed:{
    loggedOut(){
      return this.$store.getters.userId;
    }
  },
   methods:{
     logout(){
        this.$store.dispatch('logout');
        this.$router.push('/')
     }
   },
   watch:{
     loggedOut(value){
       if( value === null || value === undefined){
         this.$router.push('/');
       }
     }
   }
}
</script>

<style scoped>
</style>
