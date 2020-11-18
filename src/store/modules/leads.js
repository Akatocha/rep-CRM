import axios from 'axios'
import MassRessend from "./lead/mass_resend"

export default{
modules:{
  MassRessend
},
state: {
  leads_time_inretval:null,
  pickShowFilter: true,
  pickResetFilter: true,
  privat_array_filter: null,
  response_leads_table: [],
},
mutations: {
  ShiftAddCheckbox(state, payload){
    for(let i = payload.start; i<=payload.end; i++){
      state.response_leads_table[i].status = true
    }
  },
  ShiftRemoveCheckbox(state, payload){
    for(let i = payload.start; i<=payload.end; i++){
      state.response_leads_table[i].status = false
    }
  },
  RemoveAllCheckbox(state){
    for(let i=0; i<state.response_leads_table.length; i++){
      state.response_leads_table[i].status = false
    }
  },
  AddAllCheckbox(state){
    for(let i=0; i<state.response_leads_table.length; i++){
      state.response_leads_table[i].status = true
    }
  },
  UpdateResponseLeadsTable(state, payload){
    state.response_leads_table = payload
  },
  ChangeStatusLeads(state, payload){
    state.response_leads_table[payload].status = !state.response_leads_table[payload].status 
  },
  UpdateLeadsTimeInterval(state, payload){
    state.leads_time_inretval = payload
  },
  SwitchPickShowFilter(state){
    state.pickShowFilter = !state.pickShowFilter
  },
  SwitchPickResetFilter(state){
    state.pickResetFilter = !state.pickResetFilter
  },
  UpdatePrivatArrayFilter(state, payload){
    state.privat_array_filter = payload
  },
},
actions: {
  ShiftAddCheckbox({commit}, payload){
    commit('ShiftAddCheckbox', payload)
  },
  ShiftRemoveCheckbox({commit}, payload){
    commit('ShiftRemoveCheckbox', payload)
  },
  RemoveAllCheckbox({commit}){
    commit('RemoveAllCheckbox')
  },
  AddAllCheckbox({commit}){
    commit('AddAllCheckbox')
  },
  UpdateResponseLeadsTable({commit}, payload){
    commit('UpdateResponseLeadsTable', payload)
  },
  ChangeStatusLeads({commit}, payload){
    commit('ChangeStatusLeads', payload)
  },
  
  UpdateLeadsTimeInterval({commit}, payload){
    commit('UpdateLeadsTimeInterval', payload)
  },
  SwitchPickShowFilter({commit}){
    commit('SwitchPickShowFilter')
  },
  SwitchPickResetFilter({commit}){
    commit('SwitchPickResetFilter')
  },
  async UpdatePrivatArrayFilter({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let config_privat_filter = {
      method: 'get',
      url: 'https://back.horus.itdepartment.space/leads/filters',
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config_privat_filter)
    .then(response => {
      // console.log( response.data)
      commit('UpdatePrivatArrayFilter', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  GET_LEADS_TIME_INTERVAL(state){
    return state.leads_time_inretval
  },
  SWITCH_LEADS_SHOW_FILTER(state){
    return state.pickShowFilter
  },
  SWITCH_LEADS_RESET_FILTER(state){
    return state.pickResetFilter
  },
  PRIVATE_ARRAY_FILTERS(state){
    return state.privat_array_filter
  },
  RES_LEADS_TAB(state){
    return state.response_leads_table
  },
  SELECTED_LEADS(state){
    let x = state.response_leads_table.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
}
}