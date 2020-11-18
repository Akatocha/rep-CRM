import axios from 'axios'
import qs from "qs"
export default {
state: {
  all_leads_statuses: [],
},
mutations: {
  getAllStatusesLeads(state, payload) {
    state.all_leads_statuses = payload;
  }
},
actions: {
  async getAllStatusesLeads({commit, getters}, payload){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
    
    let currentPage = `page=1`
    let perPage = `&perPage=15`
    let search = ``
    
    if(payload){
      if(payload.currentPage !== undefined){
        currentPage = `page=${payload.currentPage}`
      }
      if(payload.perPage){
        perPage = `&perPage=${payload.perPage}`
      }
      if(payload.search){
        search = `&search=${payload.search}`
      }
    }

    let config = {
      method: 'get',
      url: `https://back.horus.itdepartment.space/statuses/?${currentPage}${perPage}${search}`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data)
      commit('getAllStatusesLeads', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  ALL_STATUSES_LEADS_DATA(state){
    return state.all_leads_statuses.data
  },
  PAGIN_ALL_STATUSES_LEADS(state){
    return state.all_leads_statuses.pagination
  },
}
}