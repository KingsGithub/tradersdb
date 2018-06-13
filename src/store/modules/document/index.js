import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/storage";
import uploadFile  from '../../../components/uploadFile'

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
                  lastModified:'',
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
                      console.log('inserting document - ', docFile.document)
                        commit('insertDocument',docFile.document);
                        uploadFile (docFile.file, docFile.document);
                        firebase.database().ref('/documents/'+ newkey).update(docFile.document);
                        commit('clearLoading',null,{root:true});
                      })
                    .catch( function(error) {
                      console.log('error inserting document =', error.message)
                      commit('setError', {code: error.code, message:error.message},{root:true});
                      commit('clearLoading',null,{root:true});
                    })
                  }
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



