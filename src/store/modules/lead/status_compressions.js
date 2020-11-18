import axios from 'axios'
import qs from "qs"
export default{
state: {
  statusses_compressions_data: [],

},
mutations: {
  UpdateStatusesCompressions(state, payload){
    state.statusses_compressions_data = payload
  },
},
actions: {
  async UpdateStatusesCompressions({commit, getters}, payload){
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
      url: `https://back.horus.itdepartment.space/statuses/compressions/?${currentPage}${perPage}${search}`,
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response)
      commit('UpdateStatusesCompressions', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  },
  async EditStatusesCompressions({dispatch, getters}, payload){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let data = qs.stringify({
      'status_id':  payload.status_id
     });

    let config = {
      method: 'put',
      url: `https://back.horus.itdepartment.space/statuses/compressions/${payload.id}`,
      headers: {'Auth-Token': token},
      data: data
    }
    await axios(config)
    .then(response => {
      // console.log( response)
      if(response.data.status == 'success'){
        dispatch('ShowAlert')
      }
      dispatch('UpdateStatusesCompressions')
    })
    .catch(error => {
      console.log(error)
    });
  },
},
getters: {
  GET_STATUSES_COMPRESSIONS(state){
    return state.statusses_compressions_data.data
  },
  PAGIN_STATUSES_COMPRESSIONS(state){
    return state.statusses_compressions_data.pagination
  },
}
}