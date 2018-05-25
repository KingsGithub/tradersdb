import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'vuetify/dist/vuetify.min.css'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { store } from './store/index'
 
Vue.use(Vuex);

Vue.use(Vuetify, {
  theme: {
    primary: "#1126A9",
    secondary: "#039BE5",
    accent: "#9c27b0",
    error: "#DD2C00",
    warning: "#FFAB00",
    info: "#2196f3",
    success: "#4caf50"
  }
})
 
Vue.config.productionTip = false
 
/* eslint-disable no-new */
var config = {
  apiKey: "AIzaSyAEBqcPNeZ5k2iFzzNwNjpdH8G7lKiiORo",
  authDomain: "vueresourcescourse.firebaseapp.com",
  databaseURL: "https://vueresourcescourse.firebaseio.com",
  projectId: "vueresourcescourse",
  storageBucket: "vueresourcescourse.appspot.com",
  messagingSenderId: "835214325306"
};
firebase.initializeApp(config);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});


