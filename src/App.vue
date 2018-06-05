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
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-spacer></v-spacer>
     <v-snackbar class="green white--text" :timeout="timeoutt"  :top="yposition"  v-model="snackbar">
            {{ snackbartext }}
            <v-btn flat light color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
      <v-spacer></v-spacer>
      <router-view class="mt-2"/>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'TradersDB',

      snackbar: false,
      snackbartext:'',
      timeoutt:2500,
      yposition:true,
      message:"Confirm Close",
      showDialog: false


    }
  },
  computed:{
    userId(){
      return this.$store.getters.userId;
    },
    items() {
        const user = this.$store.getters.getUser;
        if (user.id != '' ){
          return [
                  { icon: 'people', title: 'Traders', link: '/traders/traders', tooltip:'List of Traders'},
                  { icon: 'commute', title: 'Stations', link: '/property/stations/stations', tooltip:'View and edit Stations'},
                  { icon: 'store', title: 'Units', link: '/property/units/units', tooltip:'View and edit Units'},
                  { icon: 'file_copy', title: 'Leases', link: '/leases/leases', tooltip:'View and edit Leases'},
                  { icon: 'receipt', title: 'Payments', link: '/payments/payments', tooltip:'View and edit Payments'},
                  { icon: 'account_balance', title: 'Accounts', link: '/accounts/balance', tooltip:'View and edit Balances'},
                  { icon: 'account_box', title: 'Users', link: '/users/user', tooltip:'View and edit User Profiles'},
                  { icon: 'person', title: 'Logout', link: '/users/logout', tooltip:'Logout'}
                 ];
        }
        else return [
            { icon: 'account_box', title: 'Signup', link: '/users/signup', tooltip:'Signup to use the system'},
            { icon: 'account_box', title: 'Signin', link: '/users/signin', tooltip:'Log on to the system'}
        ];
    }
  },
  name: 'App',
  methods:{
    showSnackBar(text){
          this.snackbartext = text;
          this.snackbar = true;
    },
    showTooltip(item){
      console.log(item);
      event.target.innerHtml = item.tooltip;
    }
  }
}
</script>
