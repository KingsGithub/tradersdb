<template>

 <v-layout>
    <v-layout v-if="loading" row wrap>
          <v-flex  xs12 sm6 offset-sm4>
            <app-busywait :loading="test"></app-busywait>
          </v-flex>
    </v-layout>
     <v-snackbar class="green white--text" :timeout="4000"  top  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    <v-flex xs12 sm8 offset-sm2>
      <v-card v-if="!loading" raised hover style="border-radius:5px">
        <v-card-title primary-title>
          <div>
            <h3>Document List Page
              <small class="orange--text">[click row to edit]</small>
            </h3>
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
            v-model="selected"
            :headers="headers"
            :items="documents"
            :search="search"
            :loading="loading"
            class="elevation-1"
             :pagination.sync="pagination"
            item-key="id"
            :rows-per-page-items="rowsPerPageItems"
          >
            <template slot="items" slot-scope="props" >
              <tr   :key="props.item.id" @closeForm="props.expanded = false" >
              <!-- <td class="text-xs-left">{{ props.item.traderId }}</td> -->
              <td class="text-xs-left layout px-4">{{ props.item.filename }}</td>
              <td class="text-xs-left">{{ props.item.filesize |sizeFromBytes}}</td>
              <td class="text-xs-left  pa-0 layout px-0 nowrap">{{ props.item.filetype|truncate }}</td>
              <td class="text-xs-left">{{ props.item.lastModified |dateFromMilliseconds |truncate}}
                  <v-progress-linear v-show="props.item.loadProgress < 100 && props.item.loadProgress > 0"
                  v-model="props.item.loadProgress"></v-progress-linear>
              </td>
               <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editDoc(props.item)">
                      <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="confirmDelete(props.item)">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
              </td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <appDocument :document="props.item" :expanded="props.expanded"></appDocument>
            </template>
          </v-data-table>
          <v-card-actions>
          <v-container>
          <v-layout row wrap>
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
        <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="deleteDoc" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Document from './document';
import traderVue from '../traders/trader.vue';
import Dialog from '../shared/dialog'

  export default {
    props : {
      traderId:{ type: String, required: false, default: '-LDMAIzfsAsUOAddMlpK'},
      leaseId: { type: String, required: false, default: '-LDvJcCxj4-gl35cZ26K'}
    },
    components:{
      appDocument:Document,
       appDialog:Dialog
    },
    methods:{
       cancelEdits(confirmed){
          if(confirmed){
            this.isFormDisabled = true;
            this.$router.push('/documents/documents')
          }
          else {
              this.showDialog = false;
              this.formIsModified = true;
          }
      },
      doDialog(heading, message){
          this.heading = heading;
          this.message = message;
          this.showDialog = true;
      },
      doCancel(){
          this.doDialog('Confirm Cancel', this.message);
      },
      doClose(){
          this.doDialog("Confirm Close",this.message)
      },
      closeDialog(value){
          if(value) {// answer is in the affirmative to close even if not saved.
              this.formIsModified = false;
              this.isFormDisabled = true;
              this.$router.push('/documents/documents')
          }
      },
      editDocumentOLD(props) {
        props.expanded = !props.expanded;
      },
      closeForm() {
        this.$router.push('/')
      },
      editDocument(editDocument){
          this.$router.push('/documents/document/'+editDocument.id )
      },
      showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
      },
      confirmDelete(docToDelete){
          this.docToDelete = docToDelete;
          this.doDialog("Confirm Delete","Do you really want to delete this document? "+docToDelete.filename)
      },
      deleteDoc(confirmed){
        this.showDialog = false;
        if(confirmed){
              this.$store.dispatch('documentModule/deleteDocument',this.docToDelete)
              .then(result=>{
                if(this.$store.getters.error){
                      this.showSnackBar(error.message);
                  }
                  else {
                      this.showSnackBar('Deleted.');
                  }
              });
        }
      },
      onFilePicked (e) {
            let vm = this;
            const files = e.target.files;
            let filename = "";
            let i = 0;
            if(files[0] !== undefined) {
              this.filename = '';
              for ( var file of files ) {
                var  newDocument = vm.$store.getters['documentModule/newDocument'] ;// get a copy of the template
                newDocument.id = 'A'+ i++;
                this.fileUpload(file, newDocument)
              }
            }else {
            this.imageNames = [];
            this.imageFiles = [];
            this.imageUrls = [];
            }
      },
      fileUpload( file, document){
            let vm = this;
            if(file.name.lastIndexOf(".")  <= 0) { return; } // no extension so aborts
            var fr = new FileReader ();
            fr.onload = function () {
                        document.filetype = file.type;   // jpeg, png, xls,xlsx, doc, pdf, etc.
                        document.filesize = file.size;  // not strictly necessary since vm should all be available from the db.
                        document.traderId = vm.traderId;
                        document.leaseId =  vm.leaseId;
                        document.filename = file.name;
                        document.createdBy = (vm.$store.getters.getUser).id;
                        document.dateCreated =  (new Date());
                        document.modifiedBy = (vm.$store.getters.getUser).id;
                        document.lastModified = file.lastModified ;
                        vm.$store.dispatch('documentModule/insertDocument', { file:file, document:document})
                        .then( result => {
                            vm.refresh();  ///TODO Need to solve the duplicate keys bug in display of loaded documents
                        })
            }
            fr.readAsDataURL(file);
      },
      createNew(){
        this.$refs.docs.click();
      },
      refresh(){
        this.$store.dispatch('documentModule/loadDocuments');
      },
       toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.documents.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    filters:{
       truncate(item){
         return item.substring(0,25);
       },
       dateFromMilliseconds(item){
         var d = new Date(item);
         return d.toString(); //getDate()+'-'+d.getMonth()+'-'+d.getFullYear();
       },
      sizeFromBytes(item){
          var x = 0;
          var suffix = "";
          if(item < 1000){
            x = item;
          }
          else if(item < 1000000){
            x = item / 1000;suffix = "kB";
          }else if(item >= 1000000){
            x = item/1000000;suffix = "MB";
          }
          return (x+"").substring(0,5)+" "+suffix;
      }
    },
    data () {
      return {
        pagination: {
            sortBy: 'name'
        },
        snackbar: false,
        snackbartext:'',
        search:'',
        newDocument: {},
        heading:'',
        message:'',
        fileNames: '',
        showDialog:false,
        docToDelete:{},
        imageNames : [],
        imageFiles : [],
        imageUrls  : [],
        selected: [],
        rowsPerPageItems: [4,7,11,16,20, {"text":"All","value":-1}],
        headers: [
          // { text: 'Account Id ', value: 'traderId', align: 'left' },
          { text: 'Name ', value: 'filename', align: 'left' },
          { text: 'Size', value: 'filesize' },
          { text: 'Type', value: 'filetype' },
          { text: 'Last Modified', value: 'lastModified' },
          { text: 'Actions', value: '' }
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
      created(){
        if (!this.$store.getters['documentModule/allDocuments'])
          this.$store.dispatch('documentModule/loadDocuments');
      }
  }
</script>
