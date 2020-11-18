import Vue from 'vue'
import App from './App.vue'
import Pusher from 'pusher-js';
import JSONView from 'vue-json-component';
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueContext from 'vue-context'

Pusher.logToConsole = true;


Vue.use(VueAxios, axios, Pusher, JSONView)


Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  VueContext,
  render: h => h(App)
}).$mount('#app')
