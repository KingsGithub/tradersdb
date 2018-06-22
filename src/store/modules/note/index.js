import firebase from 'firebase/app';
import 'firebase/database';

export const noteModule = {
      namespaced:true,
      state: {
        noteTemplate : {
          id:'0',
          createdBy:'',
          dateCreated:'',
          dateModified:'',
          modifiedBy:'',
          text:'',
          leaseId:'',
          traderId:''
      },

        loadedNotes: [],
          loadedNotesHC:[
            {
              id:'0',
              createdBy:'',
              dateCreated:'',
              dateModified:'',
              modifiedBy:'',
              text:'',
              leaseId:'',
              traderId:''
            }
          ]
      },
      mutations: {
        loadNotes(state, notes) {
            state.loadedNotes = notes
        },
        insertNote(state, note){
          state.loadedNotes.push(note);
        },
        updateNote(state, note){
          var oldNote = state.loadedNotes.find(function (obj) { return obj.id === note.id; });
          oldNote = note
        },
        deleteNote(state, noteId){

        }
      },
      actions: {
          setCurrentNote(state,payload){
          state.currentNote = payload;
          },
          insertNote({commit}, note){
              commit('clearError',null,{root:true});
              commit('setLoading',null,{root:true});
              var newkey = firebase.database().ref('notes').push().key;
              if(newkey){
                note.id = newkey;
                firebase.database().ref('/notes/'+ newkey).update(note)
                .then ( function(result) {
                    //commit('insertNote',note);
                    commit('clearLoading',null,{root:true});
                  })
                .catch( function(error) {
                  commit('setError', {code: error.code, message:error.message},{root:true});
                  commit('clearLoading',null,{root:true});
                })
              }

          },
          updateNote({commit}, note){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/notes/'+ note.id).update(note)
              .then ( function(result) {
                  commit('updateNote',note); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          deleteNote({commit}, note){
            commit('clearError',null, {root:true});
            commit('setLoading',null, {root:true});
              firebase.database().ref('/notes/'+ note.id).remove()
              .then ( function(result) {
                  //commit('updateNote',note); //Because firebase does a reload whenever a change occurs, this is redundant....!
                  commit('clearLoading',null, {root:true});
                })
              .catch( function(error) {
                commit('setError', { code: error.code, message: error.message},{root:true});
                commit('clearLoading',null, {root:true});
              })
          },
          loadNotes({commit}){
            commit('setLoading',null, {root:true});
            firebase.database().ref('notes').on('value',
             (data) => {
                const notes = [];
                const obj = data.val()
                for(let key in obj) {
                    notes.push({
                      id:key,
                      createdBy :obj[key].createdBy,
                      dateCreated :obj[key].dateCreated,
                      modifiedBy :obj[key].modifiedBy,
                      dateModified :obj[key].dateModified,
                      text: obj[key].text,
                      leaseId :obj[key].leaseId,
                      traderId :obj[key].traderId
                    })
                };
                commit('loadNotes',notes);
                commit('clearLoading',null, {root:true});
            });

          }
      },
      getters: {
          allNotes( state ){
            return state.loadedNotes.sort ( (noteA, noteB) => {
                          return noteA.name > noteB.name;
                    })
          },
          getNoteById: state => (id) => {
            return state.loadedNotes.find(note => note.id === id); },

          currentNote: state => {
            return state.currentNote;
          },
          selectedNote (state){
            return  (noteId) => {
                 return state.loadedNotes.find ((note) => {
                   return note.id === noteId;
                 } )
            }
          },
          newNote(state){
            let note = { ...state.noteTemplate }; // make a copy of the template!!!! Do not use the template itself!!!!
            return note;
          },
          loadedNotesHC(state){
            return state.loadedNotesHC;
          },
          traderNotes(state, getters, rootState, rootGetters){
            return function(traderId){
              var users = rootGetters['users'];
              var notes = state.loadedNotes.filter( note => note.traderId === traderId )
              if (notes) {
                  notes.forEach( note=>{
                    let username = users.find( u => {return u.uid === note.createdBy}).name ;
                    if(username) note.createdByName = username;
                    else note.createdByName = "Unknown";
                })
              }
              return notes;
            }
          }

      }
  }


