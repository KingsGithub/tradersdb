<template>
  <v-layout row wrap>
    <v-flex>
      <v-menu
        ref="Menu"
        :close-on-content-click="false"
        v-model="dateMenu"
        :nudge-right="40"
        :return-value.sync="internalDate"
        :disabled="disabled"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="internalDate"
          :disabled="disabled"
          :label="label"
          prepend-icon="event"
          readonly
          required
          :rules="rules"
        ></v-text-field>
        <v-date-picker v-model="internalDate" @input="dateChanged"></v-date-picker>

      </v-menu>
    </v-flex>
    <v-spacer></v-spacer>
  </v-layout>
</template>

<script>

  export default {
    props: {
        value: { type: String, required:true},
        disabled: { type: Boolean, required: true },
        label: { type: String, required: true },
        rules: {type:Array, required:false},
    },
    data () {
       return {
        internalDate: this.value,
        dateMenu: false
      }
    },
    methods:{
      dateChanged(){
        this.$refs.Menu.save(this.internalDate);
        this.dateMenu = false;
        this.$emit('input',this.internalDate)
      }
    }
  }
</script>
