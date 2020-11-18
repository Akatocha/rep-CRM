import axios from 'axios'
import qs from "qs"
export default{
state: {
  permission_data: [],
  all_permissions: [],
},
mutations: {
  RemoveAllPermissionStatus(state){
    let arr = state.all_permissions
      for (let i = 0; i< arr.length; i++){
        arr[i].status = false
      }
      state.all_permissions = arr
  },
  AddAllPermissionStatus(state){
    let arr = state.all_permissions
      for (let i = 0; i< arr.length; i++){
        arr[i].status = true
      }
      state.all_permissions = arr
  },
  SwitchPermissionStatus(state, real_id){
    let permission = state.all_permissions.find(item => item.id == real_id)
    permission.status = !permission.status
  },
  GetPermission(state, payload) {
    state.permission_data = payload;
  },
  GetAllPermissions(state, payload) {
    state.all_permissions = payload;
  }
},
actions: {
  RemoveAllPermissionStatus({commit}){
    commit('RemoveAllPermissionStatus')
  },
  AddAllPermissionStatus({commit}){
    commit('AddAllPermissionStatus')
  },
  SwitchPermissionStatus({commit}, payload){
    commit('SwitchPermissionStatus', payload)
  },
  async GetPermission({commit, getters}, payload){
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
      url: `https://back.horus.itdepartment.space/roles/?${currentPage}${perPage}${search}`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      let arrRoles = response.data.data
      for (let i = 0; i<arrRoles.length; i++){
        let x = JSON.parse(arrRoles[i].permissions)
        arrRoles[i].permissions = x
      }
      // console.log(arrRoles);
      commit('GetPermission', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  },
  async GetAllPermissions({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}
    let config = {
      method: 'get',
      url: `https://back.horus.itdepartment.space/permissions/`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      let arrRoles = response.data.data.permissions
      for (let i = 0; i<arrRoles.length; i++){
        arrRoles[i].status = false
      }
      commit('GetAllPermissions', arrRoles)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  ALL_PERMISSIONS(state){
    return state.all_permissions
  },
  PERMISSIONS_LIST(state){
    return state.permission_data.data
  },
  PAGIN_PERMISSION(state){
    return state.permission_data.pagination
  },
}
}