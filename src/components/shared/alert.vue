<template>
    <v-alert value="true" type="error" dismissible @click="closeAlert">
      {{text}}
    </v-alert>
</template>
<script>
export default {
  props:['text'],
  methods:{
      closeAlert(){this.$emit('closeAlert')}
  }
}
</script>
