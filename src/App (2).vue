<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      temporary
      app
      dark color="primary"
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          router :to="item.link"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
       color="primary" dark
    >
        <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up">
        </v-toolbar-side-icon>
 
          <router-link to="/" style="cursor:pointer" tag="span">
        <v-toolbar-title v-text="title">
        </v-toolbar-title>
          </router-link>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
            <v-btn v-for="item in items" :key="item.title" flat small
              router :to="item.link" v-on:hover="showTooltip(item)">
              <v-icon >{{item.icon}}</v-icon>
              <v-spacer></v-spacer>
              {{item.title}}
            </v-btn>
            <v-btn @click="doLogin">Login</v-btn>
            <v-btn @click="doLogout">Logout</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-spacer></v-spacer>
      <router-view/>
    </v-content>
 
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>
 
<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: 'people', title: 'Traders', link: '/traders/traders', tooltip:'List of Traders'},
        { icon: 'commute', title: 'Stations', link: '/property/stations/station', tooltip:'View and edit Stations'},
        { icon: 'store', title: 'Units', link: '/property/units/unit', tooltip:'View and edit Units'},
        { icon: 'file_copy', title: 'Leases', link: '/leases/lease', tooltip:'View and edit Leases'},
        { icon: 'receipt', title: 'Payments', link: '/payments/payment', tooltip:'View and edit Payments'},
        { icon: 'account_balance', title: 'Accounts', link: '/accounts/balance', tooltip:'View and edit Balances'},
        { icon: 'account_box', title: 'Users', link: '/users/user', tooltip:'View and edit User Profiles'},
        { icon: 'account_box', title: 'SignIn', link: '/users/signin', tooltip:'Sign In'},
        { icon: 'account_box', title: 'SignUp', link: '/users/signup', tooltip:'Sign Up'},
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'TradersDB'
    }
  },
  name: 'App',
  methods:{
    showTooltip(item){
      console.log(item);
      event.target.innerHtml = item.tooltip;
    },
    doLogin(){
     
    },
    doLogout(){
      firebase.auth().signOut().then(result => {
          this.$store.dispatch('setUser',null);
      });
    },
  }
}
</script>