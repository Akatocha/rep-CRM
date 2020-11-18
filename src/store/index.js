import Vue from 'vue'
import Vuex from 'vuex'
import test from './modules/test'
import alert_config from './modules/alert_navbar'
import login from './modules/login'
import leads from './modules/leads'
import storeData from './modules/storeDataLeads'
import dashboard from './modules/dashboard'
import rules from './modules/rules'
import status_compressions from "./modules/lead/status_compressions"
import all_statuses from "./modules/lead/all_statuses"
import source_access from "./modules/api_system/source_access"
import users from "./modules/api_system/users"
import permissions from "./modules/api_system/permissions"
import brokers_list from "./modules/api_system/brokers_list"
Vue.use(Vuex)

export const store = () => new Vuex.Store({
  modules: {
    alert_config,
    login,
    storeData,
    leads,
    dashboard,
    rules,
    status_compressions,
    all_statuses,
    source_access,
    brokers_list,
    permissions,
    users,
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {

  }
})

export default store
