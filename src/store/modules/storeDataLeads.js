import axios from 'axios'
import qs from 'qs';
const new_url = 'back.horus.itdepartment.space'
export default{
state: {
  countries: [],
  statuses: [],
  funnels:[],
  brokers: [],
  sources: [],
},
mutations: {
  SwitchSourceStatus(state, real_id){
    let sources = state.sources.find(item => item.id == real_id)
    sources.status = !sources.status
  },
  SwitchFunnelStatus(state, real_id){
    let funnels = state.funnels.find(item => item.id == real_id)
    funnels.status = !funnels.status
  },
  UpdateBrokers(state, payload){
    state.brokers = payload
  },
  ChangeBrokerStatus(state, payload){
    state.brokers[payload].status = !state.brokers[payload].status
  },
  RemoveAllBrokerStatus(state){
    let arr = state.brokers
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.brokers = arr
  },
  AddAllBrokerStatus(state){
    let arr = state.brokers
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.brokers = arr
  },
  UpdateSources(state, payload){
    state.sources = payload
  },
  ChangeSourceStatus(state, payload){
    state.sources[payload].status = !state.sources[payload].status
  },
  RemoveAllSourceStatus(state){
    let arr = state.sources
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.sources = arr
  },
  AddAllSourceStatus(state){
    let arr = state.sources
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.sources = arr
  },
  UpdateCountries(state, payload){
    state.countries = payload
  },
  ChangeCountryStatus(state, payload){
    state.countries[payload].status = !state.countries[payload].status
  },
  SwitchCountryStatus(state, real_id){
    let country = state.countries.find(item => item.id == real_id)
    country.status = !country.status
  },
  RemoveAllCountryStatus(state){
    let arr = state.countries
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.countries = arr
  },
  AddAllCountryStatus(state){
    let arr = state.countries
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.countries = arr
  },

  UpdateStatuses(state, payload){
    state.statuses = payload
  },
  ChangeStatusesStatus(state, payload){
    state.statuses[payload].status = !state.statuses[payload].status
  },
  SwitchStatusesStatus(state, real_id){
    let statuses = state.statuses.find(item => item.id == real_id)
    statuses.status = !statuses.status
  },
  RemoveAllStatusesStatus(state){
    let arr = state.statuses
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.statuses = arr
  },
  AddAllStatusesStatus(state){
    let arr = state.statuses
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.statuses = arr
  },

  UpdateFunnels(state, payload){
    state.funnels = payload
  },
  ChangeFunnelsStatus(state, payload){
    state.funnels[payload].status = !state.funnels[payload].status
  },
  RemoveAllFunnelsStatus(state){
    let arr = state.funnels
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.funnels = arr
  },
  AddAllFunnelsStatus(state){
    let arr = state.funnels
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.funnels = arr
  },
},
actions: {

  async  GetSourcesAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
      let config_sources = {
        method: 'get',
        url: `https://${new_url}/sources/`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_sources)
      .then(response => {
        // console.log(response.data.data)
        if(response.data){
          let arr = response.data.data
          for (let i = 0; i< arr.length; i++){
            arr[i].status = false
          }
          commit('UpdateSources', arr)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    ChangeSourceStatus({commit}, payload){
      commit('ChangeSourceStatus', payload)
    },
    RemoveAllSourceStatus({commit}){
      commit('RemoveAllSourceStatus')
    },
    AddAllSourceStatus({commit}){
      commit('AddAllSourceStatus')
    },

  async  GetBrokersAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
      let config_countries = {
        method: 'get',
        url: `https://${new_url}/systems/brokers`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_countries)
      .then(response => {
        // console.log(response)
        if(response.data){
          let arr = response.data
          for (let i = 0; i< arr.length; i++){
            arr[i].status = false
          }
          commit('UpdateBrokers', arr)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
  ChangeBrokerStatus({commit}, payload){
    commit('ChangeBrokerStatus', payload)
  },
  RemoveAllBrokerStatus({commit}){
    commit('RemoveAllBrokerStatus')
  },
  AddAllBrokerStatus({commit}){
    commit('AddAllBrokerStatus')
  },
  async  GetCountriesAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
      let config_countries = {
        method: 'get',
        url: `https://${new_url}/systems/countries`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_countries)
      .then(response => {
        // console.log(response)
        if(response.data){
          let arr = response.data
          for (let i = 0; i< arr.length; i++){
            arr[i].status = false
          }
          commit('UpdateCountries', arr)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  SwitchCountryStatus({commit}, payload){
    commit('SwitchCountryStatus', payload)
  },
  SwitchSourceStatus({commit}, payload){
    commit('SwitchSourceStatus', payload)
  },
  SwitchFunnelStatus({commit}, payload){
    commit('SwitchFunnelStatus', payload)
  },
  ChangeCountryStatus({commit}, payload){
    commit('ChangeCountryStatus', payload)
  },
  RemoveAllCountryStatus({commit}){
    commit('RemoveAllCountryStatus')
  },
  AddAllCountryStatus({commit}){
    commit('AddAllCountryStatus')
  },


  async GetStatusesAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let config_statuses = {
      method: 'get',
      url: `https://${new_url}/systems/statuses`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config_statuses)
      .then(response => {
        if(response.data){
          // console.log(response.data)
          let arr = response.data
          for (let i = 0; i< arr.length; i++){
            arr[i].status = false
          }
          commit('UpdateStatuses', arr)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  SwitchStatusesStatus({commit}, payload){
    commit('SwitchStatusesStatus', payload)
  },
  ChangeStatusesStatus({commit}, payload){
    commit('ChangeStatusesStatus', payload)
  },
  RemoveAllStatusesStatus({commit}){
    commit('RemoveAllStatusesStatus')
  },
  AddAllStatusesStatus({commit}){
    commit('AddAllStatusesStatus')
  },

  async GetFunellsAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let config_funnels = {
      method: 'get',
      url: `https://${new_url}/systems/funnels`,
      headers: {'Auth-Token': token},
      data: ''
    }

    await axios(config_funnels)
      .then(response => {
        // console.log(response)

        if(response.data){
          let arr = response.data
          for (let i = 0; i< arr.length; i++){
            arr[i].status = false
          }
          commit('UpdateFunnels', arr)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  ChangeFunnelsStatus({commit}, payload){
    commit('ChangeFunnelsStatus', payload)
  },
  RemoveAllFunnelsStatus({commit}){
    commit('RemoveAllFunnelsStatus')
  },
  AddAllFunnelsStatus({commit}){
    commit('AddAllFunnelsStatus')
  },


},
getters: {
  GET_BROKERS(state){
    return state.brokers
  },
  GET_BROKERS_SELECT(state){
    let x = state.brokers.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
  GET_COUNTRIES(state){
    return state.countries
  },
  GET_COUNTRIES_SELECT(state){
    let x = state.countries.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
  GET_STATUSES(state){
    return state.statuses
  },
  GET_STATUSES_SELECT(state){
    let x = state.statuses.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
  GET_FUNNELS(state){
    return state.funnels
  },
  GET_FUNNELS_SELECT(state){
    let x = state.funnels.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
  GET_SOURCES(state){
    return state.sources
  },
  GET_SOURCES_SELECT(state){
    let x = state.sources.filter(obj => obj.status == true)
    let selectArrayId = []
    for(let i=0; i<x.length; i++){
      selectArrayId.push(x[i].id)
    }
    return selectArrayId
  },
}
}