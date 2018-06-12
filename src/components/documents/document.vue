<template>
    <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title primary-title>
          <div>
            <h3>Document View and Edit page</h3>
          </div>
        </v-card-title>
          <v-card-text>
                <v-form >
                  <v-container>
                  <v-text-field type = "hidden" name="id" :id="documentCopy.id"></v-text-field>
                  <v-layout row wrap class="light-text">
                      <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                        <img :src="imageUrls" height="150" v-if="imageUrls"/>
                        <v-text-field label="Select Image" @click='pickFile' :value="fileNames" prepend-icon='attach_file'>{{fileNames}}</v-text-field>
                        <input
                          type="file"
                          style="display: none"
                          ref="image"
                          multiple
                          accept=".doc,.xls,.sxls,.pdf,.xml,image/*"
                          @change="onFilePicked"
                        >
                      </v-flex>

                  </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
        <v-card-actions xs12 md6 sm6 offset-sm3 >
              <v-spacer></v-spacer>
              <v-btn v-if="hasEditPermission" dark color="orange" @click="doEdit">Edit</v-btn>
              <v-btn dark color="orange" @click="doCancel">Cancel</v-btn>
              <v-btn dark color="orange" @click="doSave">Save</v-btn>
              <v-btn dark color="orange" @click="doClose">Close</v-btn>
              <!-- <v-btn dark color="orange" @click="loaddocumentsHC">LoadHC</v-btn> -->
        </v-card-actions>
         <app-dialog :message="message" :openDialog="showDialog" :onCloseFunc="cancelEdits" :heading="heading" ></app-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

import Dialog from '../shared/dialog'
import firebase from 'firebase/app';
import "firebase/database";
import 'firebase/storage';
export default {

   props: ['id'],

   components:{
      appDialog:Dialog
   },
    data(){
        return {
          isFormDisabled:true,
          documentDBCopy : {},
          formIsModified:false,
          snackbar: false,
          snackbartext:'',
          timeoutt:2500,
          yposition:true,
          message:"Form has changed. Cancel Edits?",
          heading:"Confirm Cancel",
          showDialog: false,
          menu2:false,
          documents: [],//{ imageName:'', imageURL:'',imageFile:'', imageDownLoadURL:''}
          fileNames: '',
          imageNames: [],
          imageUrls: [],
          imageFiles: [],
          imageDownLoadURLs:[],
          rules: {
            required: (value) => !!value || 'Required.',
            email: (value) => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
          }
        }
    },
    computed:{
        hasEditPermission(){
              return true;  /// need to get it from the store.
      },
      documentCopy(){
        let document = '';
        if(this.id === '0')
            document = { ...this.$store.getters['documentModule/newDocument'] };  // copy the template
         else {
            document = { ...this.$store.getters['documentModule/selectedDocument'](this.id) }// copy the actual existing document for editing.
         }
         this.documentDBCopy = document;
         return this.documentDBCopy;
      }
    },
    methods: {
      pickFile () {
          this.$refs.image.click ()
      },

      onFilePicked (e) {
        const files = e.target.files;
        let filename = "SomeString";
        let i = 0;
        if(files[0] !== undefined) {
          for ( var file of files ) {
              this.imageNames.push(file.name);
              let ll = file.name.lastIndexOf(".") ;

              if(ll  <= 0) {
                return;
              }
              const fr = new FileReader ();
              fr.readAsDataURL(file);
              fr.addEventListener('load', () => {
                this.imageUrls.push(fr.result);
                this.imageFiles.push(file); // this is an image file that can be sent to server...
              })
          }
          this.fileNames = this.imageNames.join();
          console.log("fileNames=",this.fileNames)

        } else {
          console.log("Error fileNames=",this.fileNames)

          this.imageNames = [];
          this.imageFiles = [];
          this.imageUrls = [];
        }
      },
      uploadFile(file) {  // returns downloadURL
          // Create the file metadata
          var metadata = {
            contentType: 'image/jpeg'
          };

          const storageRef = firebase.storage().ref();
          //storageRef.addChild('images');

          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log('Upload is ' + progress + '% done');
                      switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                      }
                    },
                    function(error) {

                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                              case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;

                              case 'storage/canceled':
                                // User canceled the upload
                                break;
                              /// ETC. TO DO STUFF HERE...
                              case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                            }
                            return '';
                          },
                          function() {
                            // Upload completed successfully, now we can get the download URL
                            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                              console.log('File available at', downloadURL);
                              return downloadURL;
                            });
                        });
      },
      showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
      },
      handleFiles(file){
          console.log("Filename="+file.filename);
      },
      hasChanged(){
        this.formIsModified = true
      },
      hasChangedChkBox(event){
        this.formIsModified = true
      },
      doEdit(){
        //If the user does not have the permission to edit then this button is automatically disabled or even invisible.
        this.isFormDisabled = false;
      },
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
          if(this.formIsModified) {
              this.heading = heading
              this.showDialog = true;
          }
          else {
              this.isFormDisabled = true;
              this.$router.push('/documents/documents')
          }
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
      loaddocumentsHC(){
        const documentsHC = this.$store.getters['documentModule/loadedDocumentsHC'];
        for( var tr of documentsHC){
             this.$store.dispatch('documentModule/insertDocument', tr, {root:true})
        }
      },
      doSave(){
        var i = 0;
        console.log("number of files=",this.imageFiles.length);
        for( var file of this.imageFiles) {
          this.imageDownLoadURLs.push(this.uploadFile(file));
          console.log("imageDLURL=",this.imageDownLoadURLs[i]);
          i++;
        }
      }
      // doSave(){
      //   // Need to save this here. What does that mean?
      //   if(this.formIsModified) {
      //     this.$store.dispatch('clearError',{root:true});
      //     if(this.id === '0') {
      //         this.$store.dispatch('documentModule/insertDocument', this.documentCopy, {root:true})
      //             .then( result => {
      //               if(this.$store.getters.error){
      //                   this.showSnackBar(error.message);
      //               }
      //               else {
      //                 this.showSnackBar('Saved.');
      //                 this.formIsModified = false;
      //               }
      //             })
      //     }
      //     else {
      //         this.$store.dispatch('documentModule/updateDocument', this.documentCopy, {root:true})
      //         .then( result => {
      //                 if(this.$store.getters.error){
      //                     this.showSnackBar(error.message);
      //                 }
      //                 else {
      //                   this.showSnackBar('Updated.');
      //                   this.formIsModified = false;
      //                 }
      //         })
      //         .catch(error => { this.showSnackBar(error.message)})
      //     }
      //     } else {
      //       this.showSnackBar("Not modified")
      //     }
      //   }
  }
}
</script>

<style scoped>
</style>
