import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/storage";
import vuex from 'vuex';

export const documentModule = {
    namespaced: true,
    state: {
              documentTemplate : {
                  id:'0',
                  downloadURL:'',
                  filetype:'',   // jpeg, png, xls,xlsx, doc, pdf, etc.
                  filesize:'',  // not strictly necessary since this should all be available from the db.
                  traderId: '',
                  leaseId:'',
                  filename:'',
                  description:'',
                  createdBy:'',
                  dateCreated: '',
                  modifiedBy:'',
                  dateModified:'',
                  loadProgress: 0
              },
              loadedDocuments: []
            } ,
            mutations: {
                loadDocuments(state, documents) {
                    state.loadedDocuments = documents
                },
                insertDocument(state, document){
                  state.loadedDocuments.push(document);
                },
                updateDocument(state, document){
                  var oldDocument = state.loadedDocuments.find(function (obj) { return obj.id === document.id; });
                  oldDocument = document
                },
                deleteDocument(state, documentId){

                }
            },
            actions: {
              setCurrentDocument(state,payload){
                  state.currentDocument = payload;
              },
              insertDocument({commit}, docFile){ //docFile contains file object and document object
                  commit('clearError',null,{root:true});
                  commit('setLoading',null,{root:true});
                  //First put doc in firebase Cloud Storage

                  //Then put the URL into the firebase database
                  var newkey = firebase.database().ref('documents').push().key;
                  if(newkey){
                    docFile.document.id = newkey;
                    firebase.database().ref('/documents/'+ newkey).update(docFile.document)
                    .then ( function(result) {
                        commit('insertDocument',docFile.document);
                        uploadFile( docFile.file, docFile.document);
                        commit('clearLoading',null,{root:true});
                      })
                    .catch( function(error) {
                      commit('setError', {code: error.code, message:error.message},{root:true});
                      commit('clearLoading',null,{root:true});
                    })
                  }

                },
                uploadFile(file, document) {  // returns downloadURL
                  // Create the file metadata
                  var metadata = {
                    traderId: document.traderId,
                    leaseId: document.leaseId,
                    createdBy : document.createdBy,
                    filetype: file.type
                  };

                  const storageRef = firebase.storage().ref();
                  //storageRef.addChild('images');

                  // Upload file and metadata to the object 'images/mountains.jpg'
                  var uploadTask = storageRef.child('documents/' + file.name).put(file, metadata);

                  // Listen for state changes, errors, and completion of the upload.
                  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                            function(snapshot) {
                              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                              document.loadProgress = progress;
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
                                      document.downloadURL = downloadURL;
                                    });
                                });
              },
              updateDocument({commit}, document){
                commit('clearError',null, {root:true});
                commit('setLoading',null, {root:true});
                  firebase.database().ref('/documents/'+ document.id).update(document)
                  .then ( function(result) {
                      commit('updateDocument',document); //comment
                      commit('clearLoading',null, {root:true});
                    })
                  .catch( function(error) {
                    commit('setError', { code: error.code, message: error.message},{root:true});
                    commit('clearLoading',null, {root:true});
                  })
              },
              deleteDocument({commit}, documentId){
              },
              loadDocuments({commit}){
                commit('setLoading',null, {root:true});
                firebase.database().ref('documents').once('value') //help
                .then( (data) => {
                    const documents = [];
                    const obj = data.val()
                    for(let key in obj) {
                        documents.push({
                          id:key,
                          filename: obj[key].filename,
                          filetype: obj[key].filetype,
                          filesize: obj[key].filesize,
                          createdBy: obj[key].createdBy,
                          dateCreated: obj[key].dateCreated,
                          modifiedBy: obj[key].modifiedBy,
                          dateModified: obj[key].dateModified,
                          description: obj[key].description,
                          downloadURL: obj[key].downloadURL,
                          traderId:obj[key].traderId,
                          leaseId: obj[key].leaseId
                        })
                    };
                    commit('loadDocuments',documents);
                    commit('clearLoading',null, {root:true});
                })
                .catch(error =>{
                  commit('setError',  { code: error.code, message: error.message} ,{root:true});
                      commit('clearLoading',null, {root:true});
                })
              }
          },
          getters: {
            allDocuments( state ){
              return state.loadedDocuments;
              // .sort ( (documentA, documentB) => {
              //               return documentA.name > documentB.name;
              //         })
            },
            
          getDocumentById: state => (id) => {
                return state.loadedDocuments.find(document => document.id === id); },

              currentDocument: state => {
                return state.currentDocument;
              },
              selectedDocument (state){
                return  (documentId) => {
                      return state.loadedDocuments.find ((document) => {
                        return document.id === documentId;
                      } )
                }
              },
              newDocument(state){
                let document = { ...state.documentTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
                return document;
              },
              loadedDocumentsHC(state){
                return state.loadedDocumentsHC;
              }
            }
}



