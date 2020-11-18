export default{
state: {
  alertConfig: {vis: false},
},
mutations: {
  ShowAlert(state, payload) {
    state.alertConfig = payload;
  }
},
actions: {
  ShowAlert({commit}, payload) {
    if(payload){
      let newPayload = {
        vis: true
      }
      newPayload.iconName = payload.iconName ?? "mdi-check"
      newPayload.iconColor = payload.iconColor ?? "#74EF60"
      newPayload.iconState = payload.iconState ?? true
      newPayload.message = payload.message ?? "Success!"
      commit('ShowAlert', newPayload);
    }else{
      payload = {
        vis: true,
        iconName: "mdi-check",
        iconColor: "#74EF60",
        iconState: true,
        message: "Success!",
      }
      commit('ShowAlert', payload);
    }
    setTimeout(()=>{
      payload.vis = false
      commit('ShowAlert', payload);
    }, 1500)
  }
},
getters: {
  ALERT_CONFIG(state){
    return state.alertConfig
  },
}
}