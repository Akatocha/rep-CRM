<template lang="pug">
div
  .first_main
    .cell_box(v-for="(broker, key_b, index) in GET_MASS_RESEND" :key="index")
      .subcell_box
        span {{getBrokerName(key_b)}}
        .loading_row(v-for="(country, key_c, index) in broker" :key="index")
          img(src='@/assets/icon/pause.svg' v-if="!country.pause" @click="pauseBroker(key_b ,key_c, 0)" )
          img(src='@/assets/icon/play.svg' v-if="country.pause" @click="pauseBroker(key_b ,key_c, 1)" )
          img(src='@/assets/icon/trash.svg' @click="deleteCountry(key_b ,key_c)" )
          img(:src='getCountryFlag(key_c)')
          .load_container(:class="{ 'zero': !country.done_count }")
            .load_lin(:style="getWidth(country.percent)" )
              .count {{country.done_count}} / {{country.total_count}}
          .message_box(v-if="country.errors" )
            v-icon(size="16") mdi-alert-circle
            | {{country.errors}}
</template>

<script>
import qs from "qs"
import { mapActions, mapGetters } from 'vuex'

  export default {
computed: {
  ...mapGetters(['GET_MASS_RESEND', 'GET_BROKERS', 'GET_COUNTRIES'])
},
methods: {
  ...mapActions(['UpdateMassResend']),
  pauseBroker(key_b, key_c, from){
    let token = localStorage['jwt']
    let data = qs.stringify({
        'broker_id': key_b,
        'country_id': key_c,
        });
    let config = {
      method: 'put',
      url: `https://back.horus.itdepartment.space/mass-resend/toggle-pause`,
      headers: { 
        'Auth-Token': token, 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    }
    this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateMassResend()
        if (response.data.status !== 'success') {
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      }); 
  },
  deleteCountry(key_b, key_c){
    let token = localStorage['jwt']
    let data = qs.stringify({
        'broker_id': key_b,
        'country_id': key_c,
        });
    let config = {
      method: 'delete',
      url: `https://back.horus.itdepartment.space/mass-resend`,
      headers: { 
        'Auth-Token': token, 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    }
    this.axios(config)
      .then((response) => {
        // console.log(response.data);
        this.UpdateMassResend()
        if (response.data.status !== 'success') {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      }); 
  },
  getBrokerName(id) {
    if (this.GET_BROKERS.length>0) {
      let x =  this.GET_BROKERS.find(el => el.id == id)
      return x.title
    }else{return 'de'}
  },
  getCountryFlag(id){
  if(this.GET_COUNTRIES.length>0){
    let country = this.GET_COUNTRIES.find(el => el.id == id)
    return `https://www.countryflags.io/${country.code}/flat/24.png`
  }else{ return 'https://www.countryflags.io/ua/flat/24.png'}
  },
  getWidth(percent){
    let w = {width: percent + '%'}
  return w
  },
},
  }
</script>

<style lang="scss" scoped>
@import '../../scss/leads/tab_leads_first';
</style>