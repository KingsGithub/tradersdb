<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card v-if="!loading" raised hover style="border-radius:5px">
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
              <td class="text-xs-left">{{ props.item.traderName }}</td>
              <td class="text-xs-left">{{ props.item.traderId }}</td>
              <td class="text-xs-left">{{ props.item.filename }}</td>
              <td class="text-xs-left">{{ props.item.filetype }}</td>
              <td class="text-xs-left">{{ props.item.filesize }}</td>
              <td class="text-xs-left">{{ props.item.modifiedDate }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appDocument :document="props.item" :expanded="props.expanded"></appDocument>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-container>
            <v-layout>
          <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                        <img :src="imageUrls" height="150" v-if="imageUrls"/>
                        <input
                          type="file"
                          style="display: none"
                          ref="docs"
                          multiple
                          accept=".docx,.docb,.doc,.xls,.xlsx,.pdf,.xml,.tiff,image/*"
                          @change="onFilePicked"
                        >
                      </v-flex>
                      </v-layout>
                      </v-container>
          <v-spacer></v-spacer>
          <v-btn dark color="orange" @click="createNew">New</v-btn>
          <v-btn dark color="orange" @click="deleteDoc">Delete</v-btn>
          <v-btn dark color="orange" @click="closeForm">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Document from './document';
import traderVue from '../traders/trader.vue';
  export default {
    props : {
      traderId:{ type: String, required: false, default: '-LDMAIzfsAsUOAddMlpK'},
      leaseId: { type: String, required: false, default: '-LDvJcCxj4-gl35cZ26K'}
    },
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
      deleteDoc(){

      },
      onFilePicked (e) {
            let vm = this;
            const files = e.target.files;
            let filename = "";
            let i = 0;
            if(files[0] !== undefined) {
              this.imageNames = [];
              this.imageFiles = [];
              this.imageUrls = [];
              this.filename = '';
              for ( var file of files ) {
                this.imageNames.push(file.name);
                var  newDocument = vm.$store.getters['documentModule/newDocument'] ;// get a copy of the template
                this.fileUpload(file, newDocument)
              }
            }else {
            this.imageNames = [];
            this.imageFiles = [];
            this.imageUrls = [];
            }
            this.fileNames = this.imageNames.join();
            console.log("fileNames=",this.fileNames)
      },
      fileUpload( file, document){
            let vm = this;
            console.log("First inserting file : ", file.name);
            if(file.name.lastIndexOf(".")  <= 0) { return; } // no extension so aborts

            var fr = new FileReader ();
            fr.onload = function () {
                            document.filetype = file.type;   // jpeg, png, xls,xlsx, doc, pdf, etc.
                            document.filesize = file.size;  // not strictly necessary since vm should all be available from the db.
                            document.traderId = vm.traderId;
                            document.leaseId =  vm.leaseId;
                            document.filename = file.name;
                            document.createdBy = vm.$store.getters.getUser;
                            document.dateCreated =  (new Date());
                            document.modifiedBy = vm.$store.getters.getUser;;
                            document.dateModified = file.lastModifiedDate ;
                        vm.imageUrls.push(fr.result);
                        vm.imageFiles.push(file); // this is an image file that can be sent to server...
                        console.log("second inserting file : "+ file.name+'-->', document);
                        vm.$store.dispatch('documentModule/insertDocument', { file:file, document:vm.newDocument} )
                  }
                  fr.readAsDataURL(file);
      },
      createNew(){
        //this.$router.push('/documents/document/0,0'); //testing git
        this.$refs.docs.click();
      }
    },
    data () {
      return {
        search:'',
        newDocument: {},
        fileNames: '',
        imageNames : [],
        imageFiles : [],
        imageUrls  : [],
        headers: [
          { text: 'Trader Name ', value: 'traderName', align: 'left' },
          { text: 'Account Id ', value: 'traderId', align: 'left' },
          { text: 'Name ', value: 'filename', align: 'left' },
          { text: 'Type', value: 'filetype' },
          { text: 'Size', value: 'filesize' },
          { text: 'Date Modified', value: 'dateModified' }
        ]
      }
    },
    computed: {
        documents() {
              return this.$store.getters['documentModule/allRemodeledDocuments'];
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
