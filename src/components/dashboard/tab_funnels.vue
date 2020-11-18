<template>
  <div>
    <div class="source_main" >
      <div class="table_header">
        <div class="h_source">Funnels</div>
        <div class="h_country">Country</div>
        <div class="h_status">Status</div>
        <div class="h_lead">Lead</div>
        <div class="h_percent">%</div>
      </div>
      <button @click="switchDropMenu()" v-if="visBtnArrow" class="outline_none btn_arrow" :class="{'btn_arrow_reverse': !dropMenuStatus}">
        <img src="@/assets/icon/short_up.svg">
      </button>
      <div v-if="VisTabElement" class="table_box"  :class="{'table_box_min': dropMenuStatus}">
        <div v-for="(funnel, key, index) in GET_PERCENTAGE_FUNNELS" :key="index" class="source_cell">
          <div class="source">{{funnelsTitle(key)}}</div>
          <div v-for="(country, key, index) in funnel" :key="index" class="country_cell">
            <div class="country">
            <img :src="`https://www.countryflags.io/${countryIsoCode(key)}/flat/24.png`" >
            {{countryIsoName(key)}}
            </div>
            <div v-for="(status, key, index) in country" :key="index" class="tab_row">
                <div class="status">{{statusTitle(key)}}</div>
                <div class="lead">{{status.count}}</div>
                <div class="percent">{{status.percent}}%</div>
            </div>
          </div>
        </div>
      </div>
      <NoDataCell :pb_plus='true' :Loadet='LOADET_PERCENTAGE_FUNNELS' :Visibiliti="!VisTabElement"></NoDataCell>

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
    computed: {
      ...mapGetters(['LOADET_PERCENTAGE_FUNNELS','GET_COUNTRIES', 'GET_STATUSES', 'GET_FUNNELS', 'GET_PERCENTAGE_FUNNELS']),
      VisTabElement(){
        if (this.VisibNoDataCell && this.LOADET_PERCENTAGE_FUNNELS){
          return true
        }else{return false}
      },
      VisibNoDataCell(){
        if (Object.keys(this.GET_PERCENTAGE_FUNNELS).length > 0){
          return true
        }else{return false}
      },
      dropMenuStatus(){
        if (this.dropMenu && this.visBtnArrow){
          return true
        }else{return false}
      },
      visBtnArrow(){
        if(this.rowInTable > 4 && this.LOADET_PERCENTAGE_FUNNELS){
          return true
        }else{return false}
      },
      rowInTable(){
        let c = 0 
        for (let url in this.GET_PERCENTAGE_FUNNELS){
          for (let country in this.GET_PERCENTAGE_FUNNELS[url]){
            for (let row in this.GET_PERCENTAGE_FUNNELS[url][country])
            c = c+1
          }
        }
        return c 
      }
    },
    methods: {
      switchDropMenu(){
        this.dropMenu = !this.dropMenu
      },
      funnelsTitle(funnel_id){
        if(this.GET_FUNNELS){
          let x = this.GET_FUNNELS.find(x => x.id == funnel_id)
          return x.url
        }else{return 'Null'}
      },
      countryIsoName(country_id){
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
  }
</script>

<style lang="scss" scoped>
@import '../../scss/dashboard_components/tab_funnels';

</style>