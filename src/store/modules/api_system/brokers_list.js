import axios from 'axios'
import qs from "qs"
export default{
state: {
  broker_list_data: [],
  broker_categories: [],
},
mutations: {
  GetBrokersListApi(state, payload) {
    state.broker_list_data = payload;
  },
  GetBrokersCategories(state, payload) {
    state.broker_categories = payload;
  }
},
actions: {
  async GetBrokersListApi({commit, getters}, payload){
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
      url: `https://back.horus.itdepartment.space/brokers/?${currentPage}${perPage}${search}`,
      // url: `https://back.horus.itdepartment.space/brokers/`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data)
      commit('GetBrokersListApi', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  },
  async GetBrokersCategories({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
    
    let config = {
      method: 'get',
      url: `https://back.horus.itdepartment.space/brokers/categories/`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data)
      commit('GetBrokersCategories', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  },
},
getters: {
  BROKERS_CATEGORIES(state){
    return state.broker_categories
  },
  BROKERS_LIST_API_DATA(state){
    return state.broker_list_data.data
  },
  PAGIN_BROKERS_API(state){
    return state.broker_list_data.pagination
  },
}
}