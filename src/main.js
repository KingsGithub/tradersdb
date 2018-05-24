import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store/index'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from './firebaseConfig.js'

Vue.use(Vuetify, {
  theme: {
    primary: "#1976D2",
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

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created(){
    firebase.initializeApp(firebaseConfig);
  }
})
