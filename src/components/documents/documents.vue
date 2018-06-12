<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card v-if="!loading">
        <v-card-title primary-title>
          <div>
            <h3>Document List Page     <small class="orange--text">[click row to edit]</small></h3>
          </div>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="documents"
            :search="search"
            hide-actions
            :loading="loading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props" >
              <tr   @click="editDocument(props.item)" :key="props.item.id" @closeForm="props.expanded = false" >
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.type }}</td>
              <td class="text-xs-left">{{ props.item.size }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appDocument :document="props.item" :expanded="props.expanded"></appDocument>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="orange" @click="createNew">New</v-btn>
          <v-btn dark color="orange" @click="closeForm">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Document from './document';
  export default {
    components:{
      appDocument:Document
    },
    methods:{
      editDocumentOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editDocument(editDocument){
          this.$router.push('/documents/document/'+editDocument.id )
      },
      createNew(){
        this.$router.push('/documents/document/0,0'); //testing git
      }
    },
    data () {
      return {
        search:'',
        newDocument: {},
        headers: [
          { text: 'Name ', value: 'name', align: 'left' },
          { text: 'Type', value: 'type' },
          { text: 'Size', value: 'size' }
        ]
      }
    },
    computed: {
        documents() {
              return this.$store.getters['documentModule/allDocuments'];
        },
        loading(){
          return this.$store.getters.loading
        }
      },
      // created(){
      //   if (!this.$store.getters['documentModule/allDocuments'])
      //     this.$store.dispatch('documentModule/loadDocuments');
      // }
  }
</script>
