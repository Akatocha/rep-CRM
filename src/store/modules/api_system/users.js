import axios from 'axios'
import qs from "qs"
export default{
state: {
  users_data: [],
  all_roles: [],
},
mutations: {
  GetUsersApi(state, payload) {
    state.users_data = payload;
  },
  GetRolesApi(state, payload) {
    state.all_roles = payload;
  },
},
actions: {
  async GetUsersApi({commit, getters}, payload){
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
      url: `https://back.horus.itdepartment.space/users/?${currentPage}${perPage}${search}`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data.data)
      commit('GetUsersApi', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  ROLES_API_DATA(state){
    return state.all_roles
  },
  USERS_API_DATA(state){
    return state.users_data.data
  },
  PAGIN_USERS_API(state){
    return state.users_data.pagination
  },
}
}