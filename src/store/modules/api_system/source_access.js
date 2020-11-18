import axios from 'axios'
import qs from "qs"
export default{
state: {
  source_access_data: [],
},
mutations: {
  getSourceAccess(state, payload) {
    state.source_access_data = payload;
  }
},
actions: {
  async getSourceAccess({commit, getters}, payload){
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
      url: `https://back.horus.itdepartment.space/sources/?${currentPage}${perPage}${search}`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data.data)
      commit('getSourceAccess', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  SOURCE_ACCESS_DATA(state){
    return state.source_access_data.data
  },
  PAGIN_SOURCE_ACCESS(state){
    return state.source_access_data.pagination
  },
}
}