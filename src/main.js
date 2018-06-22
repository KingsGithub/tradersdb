import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store/index'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from './firebaseConfig.js'
import Alert from './components/shared/alert.vue'
import SnackBar from './components/shared/snackbar.vue'
import BusyWait from './components/shared/busyWait.vue'
import Dialog from './components/shared/dialog.vue'
import DDate from './components/shared/date.vue'

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

Vue.config.productionTip = false;

Vue.component('app-alert', Alert)
Vue.component('app-snackbar', SnackBar)
Vue.component('app-busywait', BusyWait)
Vue.component('app-dialog',Dialog)
Vue.component('app-date',DDate)
Vue.filter( 'dateFromMilliseconds',
            function(item){
                var d = new Date(item);
                return d.toString(); //getDate()+'-'+d.getMonth()+'-'+d.getFullYear();
            });
Vue.filter('truncate', function(item){
              return item.substring(0,25);
            }
);
Vue.filter('sizeFromBytes',
    function(item){
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
);

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
