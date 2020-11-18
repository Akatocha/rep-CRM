import axios from 'axios'
const new_url = 'back.horus.itdepartment.space'

export default{
state: {
  simple_statistics: null,
  simple_statistics_loadet: false,
  tab_total_data: null,
  tab_total_data_loadet: false,
  percentage_country_statistics: null,
  percentage_country_statistics_loadet: false,
  percentage_funnel_statistics: null,
  percentage_funnel_statistics_loadet: false,
  time_interval_dashboard: null,
  brokers_schedules: null,
},
mutations: {
  UpdateBrokersSchedules(state, payload){
    state.brokers_schedules = payload
  },
  UpdateSimpleStatistics(state, payload){
    state.simple_statistics = payload
  },
  UpdateTotalData(state, payload){
    state.tab_total_data = payload
  },
  UpdatePercentageCountry(state, payload){
    state.percentage_country_statistics = payload
  },
  UpdatePercentageFunnels(state, payload){
    state.percentage_funnel_statistics = payload
  },
  UpdateTimeInterval(state, payload){
    state.time_interval_dashboard = payload
  },
  LoadingSimpleStatistics(state, payload){
    state.simple_statistics_loadet = payload
  },
  LoadingTotalData(state, payload){
    state.tab_total_data_loadet = payload
  },
  LoadingPercentageCountry(state, payload){
    state.percentage_country_statistics_loadet = payload
  },
  LoadingPercentageFunnels(state, payload){
    state.percentage_funnel_statistics_loadet = payload
  },
},
actions: {
  PickTimeIntervalDashboard({commit}, payload){
    commit('UpdateTimeInterval', payload)
  },
  async GetBrokersSchedulesAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

      let config_simple_statistics = {
        method: 'get',
        url: `https://${new_url}/brokers/schedules/`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_simple_statistics)
        .then(response => {
          // console.log(response)
            commit('UpdateBrokersSchedules', response.data)
        })
        .catch(error => {
          console.log(error)
        })
  },
  async GetSimpleStatisticsAxios({commit, getters}){
    commit('LoadingSimpleStatistics', false)

    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let time
    if(getters.TIME_INT_DASHBOARD){
      time = getters.TIME_INT_DASHBOARD
      let config_simple_statistics = {
        method: 'get',
        url: `https://${new_url}/dashboard/simple-statistics?start=${time.start}%2000:00:00&end=${time.end}%2023:59:59`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_simple_statistics)
        .then(response => {
          // console.log(response)
            commit('LoadingSimpleStatistics', true)
            commit('UpdateSimpleStatistics', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  async GetTabTotalDataAxios({commit, getters}){
    commit('LoadingTotalData', false)

    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let time
    if(getters.TIME_INT_DASHBOARD){
      time = getters.TIME_INT_DASHBOARD
      let config_tab_total_data = {
        method: 'get',
        url: `https://${new_url}/dashboard/country-statistics?start=${time.start}%2000:00:00&end=${time.end}%2023:59:59`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_tab_total_data)
        .then(response => {
          // console.log(response)
            commit('LoadingTotalData', true)
            commit('UpdateTotalData', response.data)
        })
        .catch(error => {
          console.log(error)
        })
      }
  },
  async GetPercentageCountry({commit, getters}){
    commit('LoadingPercentageCountry', false)
    
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let time
    if(getters.TIME_INT_DASHBOARD){
      time = getters.TIME_INT_DASHBOARD
      let config_percentage_country_statistics = {
        method: 'get',
        url: `https://${new_url}/dashboard/percentage-country-statistics?start=${time.start}%2000:00:00&end=${time.end}%2023:59:59`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_percentage_country_statistics)
        .then(response => {
          // console.log(response)
            commit('LoadingPercentageCountry', true)
            commit('UpdatePercentageCountry', response.data.result)
        })
        .catch(error => {
          console.log(error)
        })
      }
  },
  async GetPercentageFunnels({commit, getters}){
    commit('LoadingPercentageFunnels', false)

    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let time
    if(getters.TIME_INT_DASHBOARD){
      time = getters.TIME_INT_DASHBOARD
      let config_percentage_funnel_statistics = {
        method: 'get',
        url: `https://${new_url}/dashboard/percentage-funnel-statistics?start=${time.start}%2000:00:00&end=${time.end}%2023:59:59`,
        headers: {'Auth-Token': token},
        data: ''
      }
      await  axios(config_percentage_funnel_statistics)
        .then(response => {
          // console.log(response)
            commit('LoadingPercentageFunnels', true)
            commit('UpdatePercentageFunnels', response.data.result)
        })
        .catch(error => {
          console.log(error)
        })
      }
  },
},
getters: {
  GET_BROKERS_SCHEDULES(state){
    return state.brokers_schedules
  },
  GET_SIMPLE_STATISTICS(state){
    return state.simple_statistics
  },
  GET_TAB_TOTAL_DATA(state){
    return state.tab_total_data
  },
  GET_PERCENTAGE_COUNTRY(state){
    return state.percentage_country_statistics
  },
  GET_PERCENTAGE_FUNNELS(state){
    return state.percentage_funnel_statistics
  },
  TIME_INT_DASHBOARD(state){
    return state.time_interval_dashboard
  },



  LOADET_SIMPLE_STATISTICS(state){
    return state.simple_statistics_loadet
  },
  LOADET_TAB_TOTAL_DATA(state){
    return state.tab_total_data_loadet
  },
  LOADET_PERCENTAGE_COUNTRY(state){
    return state.percentage_country_statistics_loadet
  },
  LOADET_PERCENTAGE_FUNNELS(state){
    return state.percentage_funnel_statistics_loadet
  },
}
}