import axios from 'axios'

export default{
state: {
  mass_resend: null
},
mutations: {
  UpdateMassResend(state, payload){
    state.mass_resend = payload
  },
},
actions: {
  async UpdateMassResend({commit, getters}){
    let token
    if (getters.GET_TOKEN){
      token = getters.GET_TOKEN
    }else{ token = localStorage['jwt']}

    let config = {
      method: 'get',
      url: 'https://back.horus.itdepartment.space/mass-resend',
      headers: {'Auth-Token': token},
      data: ''
    }
    await axios(config)
    .then(response => {
      // console.log( response.data)
      commit('UpdateMassResend', response.data)
    })
    .catch(error => {
      console.log(error)
    });
  }
},
getters: {
  GET_MASS_RESEND(state){
    return state.mass_resend
  },
}
};