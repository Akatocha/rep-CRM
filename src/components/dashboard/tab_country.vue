<template>
  <div>
    <div class="country_main">
      <div class="table_header">
        <div class="h_countries">Country</div>
        <div class="h_status">Status</div>
        <div class="h_lead">Lead</div>
        <div class="h_percent">%</div>
      </div>
      <button @click="switchDropMenu()" v-if="visBtnArrow" class="outline_none btn_arrow" :class="{'btn_arrow_reverse': !dropMenuStatus}">
        <img src="@/assets/icon/short_up.svg">
      </button>
     <div v-if="VisTabElement"  class="table_box" :class="{'table_box_min': dropMenuStatus}">
       <div
         v-for="(country, key, index) in GET_PERCENTAGE_COUNTRY"
         :key="index"
         class="country_cell">
         <div class="country">
            <img :src="`https://www.countryflags.io/${countryIsoCode(key)}/flat/24.png`" >
           {{countryIsoName(key)}}
         </div>
         <div v-for="(status, key, index) in country" :key="index" class="tab_row">
           <div class="status">
            {{statusTitle(key)}}
           </div>
           <div class="lead">
             {{status.count}}
           </div>
           <div class="percent">
             {{status.percent}}%
           </div>
         </div>
       </div>
     </div>
      <NoDataCell :pb_plus='true' :Loadet='LOADET_PERCENTAGE_COUNTRY' :Visibiliti="!VisTabElement"></NoDataCell>

    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import NoDataCell from './noData'


  export default {
    components: {
      NoDataCell,
    },
    data() {
      return {
        dropMenu: true
      }
    },
    methods: {
      switchDropMenu(){
        this.dropMenu = !this.dropMenu
      },
      countryIsoName(country_id){
        // let iso_name = this.GET_COUNTRIES[country_id-1].iso_name
        if (this.GET_COUNTRIES){
          let x = this.GET_COUNTRIES.find(x => x.id == country_id)
          return x.iso_name 
        }else{return 'Null'}
      },
      countryIsoCode(country_id){
        if(this.GET_COUNTRIES){
          let x = this.GET_COUNTRIES.find(x => x.id == country_id)
          return x.iso_code
        }else{return 'Null'}
      },
      statusTitle(status_id){
        if (this.GET_STATUSES){
          let status =  this.GET_STATUSES.find(x => x.id == status_id)
          return status.title
        }else{return 'Null'}
      },

    },
    computed: {
      ...mapGetters([ 'LOADET_PERCENTAGE_COUNTRY','GET_COUNTRIES', 'GET_STATUSES', 'GET_PERCENTAGE_COUNTRY']),
      VisTabElement(){
        if (this.VisibNoDataCell && this.LOADET_PERCENTAGE_COUNTRY){
          return true
        }else{return false}
      },
      VisibNoDataCell(){
        if (Object.keys(this.GET_PERCENTAGE_COUNTRY).length > 0){
          return true
        }else{return false}
      },
      dropMenuStatus(){
        if (this.dropMenu && this.visBtnArrow){
          return true
        }else{return false}
      },
      visBtnArrow(){
        if(this.rowInTable > 4 && this.LOADET_PERCENTAGE_COUNTRY){
          return true
        }else{return false}
      },
      rowInTable(){
        let c = 0 
        for (let country in this.GET_PERCENTAGE_COUNTRY){
          for( let status in this.GET_PERCENTAGE_COUNTRY[country]){
            c = c+1
          }
        }
        return c 
      }
    },
  }
</script>

<style lang="scss" scoped>
@import '../../scss/dashboard_components/tab_country';

</style>