import axios from 'axios'
import qs from 'qs';

export default{
state: {
  token: '',
  userData: null,
  permission: null
},
mutations: {
  UpdateToken(state, token){
    state.token = token
  },
  UpdateUserData(state, payload){
    state.userData = payload
  },
  UpdatePermission(state, payload){
    state.permission = payload
  }
},
actions: {
  Login({commit}, data){
    commit('UpdateToken', data)
  },
  UpdateUserData({commit}, payload){
    if (payload){
      commit('UpdateUserData', payload)
    }else{
      let user = JSON.parse(localStorage.userData)
      commit('UpdateUserData', user)
    }
  },
  
  
  async GetPermissionAxios({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let config_permissio = {
      method: 'get',
      url: 'https://back.horus.itdepartment.space/user-permissions',
      headers: {'Auth-Token': token},
      data: ''
    }
    await  axios(config_permissio)
    .then(response => {
      commit('UpdatePermission', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  GET_TOKEN(state){
    return state.token
  },
  GET_USER_PERMISSION(state){
    return state.permission
  },
  GET_USER_DATA(state){
    return state.userData
  }
}
}