import Vue from 'vue'
import axios from 'axios'
const new_url = 'back.horus.itdepartment.space'

export default{
state: {
country_setting_arr: [],
isLoadet_country_setting_arr: false,

source_setting_arr: [],
isLoadet_source_setting_arr: false,

funnel_setting_arr: [],
isLoadet_funnel_setting_arr: false,

},
mutations: {

  UpdateCountrySetting(state, payload){
    state.country_setting_arr = payload
  },
  UpdateSourceSetting(state, payload){
    state.source_setting_arr = payload
  },
  UpdateFunnelSetting(state, payload){
    state.funnel_setting_arr = payload
  },


  IsLoadetCountrySetting(state, payload){
    state.isLoadet_country_setting_arr = payload
  },
  IsLoadetSourceSetting(state, payload){
    state.isLoadet_source_setting_arr = payload
  },
  IsLoadetFunnelSetting(state, payload){
    state.isLoadet_funnel_setting_arr = payload
  },


},
actions: {
  // Get All action
async UpdateCountrySetting({commit, getters}){
  commit('IsLoadetCountrySetting', false)
  let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
  let config = {
    method: 'get',
    url: `https://${new_url}/rules/countries`,
    headers: {'Auth-Token': token},
    data: ''
  }
  await axios(config)
    .then(response => {
      // console.log(response)
      if(response.data){
        commit('IsLoadetCountrySetting', true)
        commit('UpdateCountrySetting', response.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
},
async UpdateSourceSetting({commit, getters}){
  commit('IsLoadetSourceSetting', false)
  let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
  let config = {
    method: 'get',
    url: `https://${new_url}/rules/sources`,
    headers: {'Auth-Token': token},
    data: ''
  }
  await axios(config)
    .then(response => {
      // console.log(response)
      if(response.data){
        commit('IsLoadetSourceSetting', true)
        commit('UpdateSourceSetting', response.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
},
async UpdateFunnelSetting({commit, getters}){
  commit('IsLoadetFunnelSetting', false)
  let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
  let config = {
    method: 'get',
    url: `https://${new_url}/rules/funnels`,
    headers: {'Auth-Token': token},
    data: ''
  }
  await axios(config)
    .then(response => {
      // console.log(response)
      if(response.data){
        // console.log(response.data)
        commit('IsLoadetFunnelSetting', true)
        commit('UpdateFunnelSetting', response.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
},

},




getters: {

  
  GET_COUNTRY_SETTING_ARR(state){
    return state.country_setting_arr
  },
  GET_SOURCE_SETTING_ARR(state){
    return state.source_setting_arr
  },
  GET_FUNNEL_SETTING_ARR(state){
    return state.funnel_setting_arr
  },


  IS_LOADET_COUNTRY_SETTING(state){
    return state.isLoadet_country_setting_arr
  },
  IS_LOADET_SOURCE_SETTING(state){
    return state.isLoadet_source_setting_arr
  },
  IS_LOADET_FUNNEL_SETTING(state){
    return state.isLoadet_funnel_setting_arr
  },
}
}