<template>
  <v-layout row justify-center>
      <v-dialog :value="isOpen" persistent max-width="350">
      <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
          <v-card> <v-card-title class="headline">{{heading}}</v-card-title>
              <v-card-text>{{message}}</v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="onCloseFunc(false)">No</v-btn>
                  <v-btn color="green darken-1" flat @click.native="onCloseFunc(true)">Yes</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-layout>
</template>
<script>
export default {
  props: {
    heading: { type: String, default: "Confirm Cancel" },
    message: { type: String, default: "Confirm Cancel" },
    openDialog: { type: Boolean, default: false },
    onCloseFunc: { type: Function, required: true }
  },
  data() {
    return {};
  },
  computed: {
    isOpen() {
      return this.openDialog;
    }
  }
};
</script>
