<template>
   <v-menu
          ref="menu1"
          :close-on-content-click="false"
          :return-value.sync="date"
          v-model="menu1"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="dateFormatted"
            :label="label"
            :disabled="disabled"
            hint="DD-MM-YYYY format"
            prepend-icon="event"
            readonly
            @blur="date = parseDate(dateFormatted)"
          ></v-text-field>
          <v-date-picker v-model="date" header-color="orange" @input="datePicked"></v-date-picker>
        </v-menu>
</template>
 <script>
  export default {
    props:['date','label', 'disabled', 'onModifyFunction'],
    data: () => ({
      dateFormatted: null,
      menu1: false
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      }
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      }
    },

    methods: {
      datePicked(){
        $refs.menu1.save(date);
        this.$emit('input', this.date)
      },
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('-')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
  }
</script>
