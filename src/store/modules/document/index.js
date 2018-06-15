import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/storage";
import uploadFile  from '../../../components/uploadFile'
import Vue from "vue"

import vuex from 'vuex';

export const documentModule = {
    namespaced: true,
    state: {
              documentTemplate : {
                  id:'0',
                  downloadURL:'',
                  filename:'',
                  filetype:'',   // jpeg, png, xls,xlsx, doc, pdf, etc.
                  filesize:'',  // not strictly necessary since this should all be available from the db.
                  traderId: '',
                  leaseId:'',
                  description:'',
                  createdBy:'',
                  dateCreated: '',
                  modifiedBy:'',
                  lastModified:'',
                  loadProgress: false
              },
              loadedDocuments: []
            } ,
    mutations: {
                loadDocuments(state, documents) {
                    state.loadedDocuments = documents
                },
                insertDocument(state, payload){
                  state.loadedDocuments.push(payload);
                },
                updateProgress(state,document){
                  var oldDocument = state.loadedDocuments.find(function (obj) { return obj.id === document.id; });
                  oldDocument.loadProgress = false;
                },
                updateDocument(state, document){
                  var oldDocument = state.loadedDocuments.find(function (obj) { return obj.id === document.id; });
                  console.log("in update:document--id=",document.id+"---"+ document.downloadURL)
                  if(oldDocument){console.log("olddocid=",oldDocument.id +"---"+ oldDocument.downloadURL)}
                  oldDocument = document

                },
                deleteDocument(state, document){
                  // get index of object with doc.id
                  var removeIndex = state.loadedDocuments.findIndex(function(item) { return item.id === document.id; });
                  // remove object
                  state.loadedDocuments.splice(removeIndex, 1);
                }
            },
    actions: {
              setCurrentDocument(state,payload){
                  state.currentDocument = payload;
              },

            insertDocument({commit}, docFile){ //docFile contains file object and document object
                  commit('clearError',null,{root:true});
                  commit('setLoading',null,{root:true});
                  var file = { ...docFile.file }; // make a copy.
                  console.log("file=",file);
                  var doc =  { ...docFile.document }; // make a copy.
                  //first store the document info on firebase database and get it's key.
                  doc.loadProgress = true;
                  firebase.database().ref('documents').push(doc)
                  .then( data => {
                        doc.id = data.key;
                        // now store the blob onto the storage area
                        firebase.storage().ref('documents/'+data.key+"--" + docFile.file.name).put(docFile.file)
                        .then (snapshot => {
                              // get the downloadURL and update the document in the firebase database.
                              snapshot.ref.getDownloadURL()
                              .then( downloadurl => {
                                  doc.downloadURL = downloadurl;
                                  firebase.database().ref('documents').child(data.key).update(doc)
                                  .then(result => {
                                        console.log('inserting document - ', doc.filename+"--"+ doc.downloadURL)
                                        // Since firebase inserts the doc locally immediately, we have to UPDATE that doc locally!!!!
                                        doc.loadProgress = false;
                                        commit('updateProgress', doc);
                                        commit('clearLoading',null,{root:true});
                                  })
                              });
                          })
                        .catch( error =>{
                              console.log('error inserting document =', error.message)
                              commit('setError', {code: error.code, message:error.message},{root:true});
                              commit('clearLoading',null,{root:true});
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
              deleteDocument({commit}, document){
                commit('clearError',null, {root:true});
                commit('setLoading',null, {root:true});
                ///TODO ALSO Delete from fireabase.storage!!!!
                const storageRef = firebase.storage().ref();
                storageRef.child('documents/' + document.id+'--'+document.filename).delete()
                .then( function(result){
                      firebase.database().ref('/documents/'+ document.id).remove()
                      .then ( function(result) {
                   //       commit('deleteDocument',document); //comment
                          commit('clearLoading',null, {root:true});
                        })
                      .catch( function(error) {
                        commit('setError', { code: error.code, message: error.message},{root:true});
                        commit('clearLoading',null, {root:true});
                      })
                }).catch(function(error) {
                    // Uh-oh, an error occurred!
                    commit('setError', { code: error.code, message: error.message},{root:true});
                    commit('clearLoading',null, {root:true});
            });
              },
              loadDocuments({commit}){
                commit('setLoading',null, {root:true});
                firebase.database().ref('documents').on('value',
                 (data) => {
                  console.log('loading documents....')
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
                          lastModified: obj[key].lastModified,
                          description: obj[key].description,
                          downloadURL: obj[key].downloadURL,
                          traderId:obj[key].traderId,
                          leaseId: obj[key].leaseId,
                          loadProgress: obj[key].loadProgress
                        })
                    };
                    commit('loadDocuments',documents);
                    commit('clearLoading',null, {root:true});
                });

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



