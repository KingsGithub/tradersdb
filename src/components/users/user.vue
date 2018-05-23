<template>
    <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media src="/static/doc-images/cards/IMG_1416small.png" height="100px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3>User Profile View and Edit page</h3>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange">Edit</v-btn>
          <v-btn flat color="orange">Cancel</v-btn>
          <v-btn flat color="orange">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
    data(){
        return {

        }
    }
}
</script>

<style scoped>
</style>
