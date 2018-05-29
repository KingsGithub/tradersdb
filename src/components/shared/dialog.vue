<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
      <v-card>
        <v-card-title class="headline">{{heading}}</v-card-title>
        <v-card-text>{{message}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="closeDialog(false)">No</v-btn>
          <v-btn color="green darken-1" flat @click.native="closeDialog(true)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    props:['heading', 'message'],
    methods:{
      closeDialog(answer){
        this.$emit('dialogClosed', answer);
        this.$store.dispatch('dialog', false)
      }
    },
    computed: {
      dialog(){
        return this.$store.getters.dialog
      }
    }
  }
</script>
