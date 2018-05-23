<template>
  <div>
   <v-snackbar
      :timeout="4000"
      top
      v-model="showSnackbar"
    >
      {{ alertText }}
      <v-btn flat color="pink" @click.native="showSnackbar = false">Close</v-btn>
    </v-snackbar>
    </div>
</template>
<script>
  export default {
    props:['alertText','snackbar'],
    data () {
      return {
        showSnackbar: false ||this.setSnackBar,
      }
    },
    computed:{
        setSnackBar(){
            return this.snackbar
        }
    }
  }
</script>
