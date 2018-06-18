  </<template>
      <v-tabs icons-and-text centered dark color="cyan">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab href="#tab-0">
            Trader
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab href="#tab-1">
            Documents
            <v-icon>favorite</v-icon>
          </v-tab>
          <v-tab href="#tab-2">
            Notes
            <v-icon>account_box</v-icon>
          </v-tab>
          <v-tab href="#tab-3">
            Recon
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab href="#tab-4">
            Payments
            <v-icon>phone</v-icon>
          </v-tab>
          <v-tab-item
            v-for="(i,index) in routerViews"
            :key="i"
            :id="'tab-' + index"
          >
            <v-card flat>
              <router-view :name="i">{{i}}</router-view>
              <v-card-text>
              <h6>{{i}} --->  {{index}}</h6>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
  </template>
  <script>
  export default {
    data () {
      return {
        routerViews: ['tab-1','tab-2','tab-3','tab-4','tab-5'],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    }
  }
</script>
